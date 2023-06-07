import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Modal from 'react-modal';
import axios from 'axios';

const MySubGreddit = () => {
    const date = new Date;
    const goto = useNavigate();
    const token = localStorage.getItem('name');

    const [user, setUser] = useState('');
    const [name, setName] = useState('');
    const [todo, setTodo] = useState('');
    const [doto, setDoto] = useState('');
    const [index, setIndex] = useState(-1);
    const [intervalId, setIntervalId] = useState(0);
    const [description, setDescription] = useState('');

    const [tags, setTags] = useState([]);
    const [text, setText] = useState([]);
    const [reports, setReports] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [greddits, setGreddits] = useState([]);

    const [main, setMain] = useState(true);
    const [stats, setStats] = useState(false);
    const [users, setUsers] = useState(false);
    const [reported, setReported] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [requests, setRequests] = useState(false);

    const enableForm = () => {setShowForm(true);}
    const disableForm = () => {setShowForm(false);}

    const handleForm = () => {
        setShowForm(false);
        // submit the new sub greddit
        axios.post('/api/new-greddit', {
            accessToken: token,
            moderator: user,
            name: name,
            description: description,
            keywords: keywords,
            followers: [user],
            blocked: [],
            waiting: [],
            posts: 0,
            tags: tags,
            left: [],
            joined: [{ name: user, day: date }],
            visitors: [],
            rejected: []
        })
        .then((result) => {
            console.log(result.data);
            if (result.data.verdict === 'failed') {
                alert('That name already exists!');
            } else {
                setGreddits([...greddits, {
                    moderator: user,
                    name: name,
                    description: description,
                    keywords: keywords,
                    followers: [user],
                    blocked: [],
                    waiting: [],
                    posts: 0,
                    tags: tags,
                    left: [],
                    joined: [{ name: user, day: date }],
                    visitors: [],
                    rejected: []
                }])
            }
        })
        .catch((err) => {
            console.log(err);
        })
        setName('');
        setDescription('');
        setKeywords([]);
        setTags([]);
    }

    const handleKeywords = () => {
        // add keyword to the list of keywords
        setKeywords([...keywords, todo]);
        setTodo('');
    }

    const handleTags = () => {
        // add tags to the list of tags
        setTags([...tags, doto]);
        setDoto('');
    }

    const handleAccept = (name) => {
        const id = greddits[index]._id;
        axios.post('/api/greddit-join', { accessToken:token, id: id, name: name, day: date })
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            })

        const updated = greddits.map((obj, idx) => {
            if (idx === index) {
                obj.followers.push(name);
                obj.joined.push({ name, day: date });
                obj.waiting = obj.waiting.filter(item => item !== name);
                return {...obj, followers: obj.followers, waiting: obj.waiting, joined: obj.joined};
            }
            return obj;
        });
        setGreddits(updated);
    }

    const handleReject = (name) => {
        const id = greddits[index]._id;
        axios.post('/api/greddit-reject', { accessToken: token, id: id, name: name, day: date })
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            })

        const updated = greddits.map((obj, idx) => {
            if (idx === index) {
                obj.rejected.push({ name, day: date });
                obj.waiting = obj.waiting.filter(item => item !== name);
                return {...obj, waiting: obj.waiting, rejected: obj.rejected};
            }
            return obj;
        });
        setGreddits(updated);
    }

    const showGreddit = (idx) => {
        // console.log(idx);
        setIndex(idx);
        setMain(false);
        setUsers(true);
    }

    const handleStats = () => { setStats(true); setUsers(false); setReported(false); setRequests(false); setMain(false); }
    const handleUsers = () => { setStats(false); setUsers(true); setReported(false); setRequests(false); setMain(false); }
    const handleMain = () => { setStats(false); setUsers(false); setReported(false); setRequests(false); setMain(true); }
    const handleRequests = () => { setStats(false); setUsers(false); setReported(false); setRequests(true); setMain(false); }

    const handleReports = () => { 
        setStats(false); 
        setUsers(false); 
        setReported(true); 
        setRequests(false); 
        setMain(false); 
        axios.post('/api/get-reports', { accessToken: token, name: greddits[index].name })
            .then((result) => {
                // console.log(result.data.reports)
                setReports(result.data.reports);
                let arr = [];
                result.data.reports.map((obj, idx) => {
                    if (obj.status === 'blocked') {
                        arr[idx] = 'Blocked';
                    } else {
                        arr[idx] = 'Block User';
                    }
                })
                setText(arr);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const deleteGreddit = (idx) => {
        // console.log(idx);
        const id = greddits[idx]._id;
        axios.post('/api/delete-greddit', { accessToken: token, name: greddits[idx].name })
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            })
        setGreddits(greddits.filter(greddit => greddit._id !== id));
    }

    const handleBlock = (idx) => {
        // console.log(reports[idx]);
        if (reports[idx].status === 'blocked') {
            alert('already blocked');
            return;
        }
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(0);
            document.getElementById(idx).innerHTML = 'Block User';
            return;
        }
        var n = 3;
        document.getElementById(idx).innerHTML = 'Cancel in 3';
        const newIntervalID = setInterval(() => {
            if (n > 0) {
                n--;
                // console.log(n);
                document.getElementById(idx).innerHTML = 'Cancel in ' + n;
            } 
            if (n == 0) {
                document.getElementById(idx).innerHTML = 'Blocked';
                console.log('done');
                // do the stuff
                axios.post('/api/block-report', { 
                    accessToken: token, 
                    id: reports[idx]._id, 
                    pid: reports[idx].pid,
                    name: reports[idx].reported_to,
                    gname: reports[idx].gname
                })
                    .then((result) => {
                        // console.log(result)
                        const temp = reports.map((obj, i) => {
                            if (idx === i) {
                                return {...obj, status: 'blocked'}
                            }
                            return obj;
                        });
                        setReports(temp);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                clearInterval(newIntervalID);
            }
        }, 1000);
        setIntervalId(newIntervalID);
    }

    const handleDelete = (idx) => {
        console.log(reports[idx]);
        // delete the post and report
        axios.post('/api/delete-report', { accessToken: token, id: reports[idx]._id, pid: reports[idx].pid })
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            })

            const temp = reports.filter((obj, i) => {
                if (idx !== i) return obj;
            });
            setReports(temp);
    }

    const handleIgnore = (idx) => {
        // console.log(reports[idx]);

        // change status of report to ignored
        axios.post('/api/ignore-report', { accessToken: token, id: reports[idx]._id })
            .then((result) => {
                // console.log(result)
                if (result.data.verdict === 'already ignored') {
                    alert('already ignored');
                } else {
                    const temp = reports.map((obj, i) => {
                        if (idx === i) {
                            return {...obj, status: 'ignored'}
                        }
                        return obj;
                    });
                    setReports(temp);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const customStyles = {
        content: {  
            padding: "15px",
            zIndex: "1000",
            height: "60%",
            width: "40%",
            borderRadius: "10px",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#FFF"
        },
        overlay: {
            display: "flex",
            justifyContent: "center",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0, .5)",
            zIndex: "1000",
            overflowY: "auto"
        }
    };

    useEffect(() => {
        axios.post("/api/sub-greddit", { accessToken: token })
            .then((result) => {
                if (result.data.verdict === 'failed') {
                    localStorage.clear();
                    goto('/login');
                }
                setGreddits(result.data.greddits);
                setUser(result.data.moderator);
                // console.log(user);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);
    // console.log(greddits);

    return (
        <div>
            <Navbar/>
            { !main && (
                <div className="sidenav">
                    <button onClick={handleMain}>Main</button>
                    <button onClick={handleStats}>Stats</button>
                    <button onClick={handleUsers}>Users</button>
                    <button onClick={handleRequests}>Requests</button>
                    <button onClick={handleReports}>Reported Page</button>
                </div>
            )}

            { main && (
                <div className="my-sub-greddit">
                    <h2>My Sub Greddit Page</h2>
                    <Modal
                        ariaHideApp={false}
                        style={customStyles}
                        isOpen={showForm}
                        onRequestClose={disableForm}
                    >
                        <form>
                            <div style={{marginTop: '15px'}}>
                                <label style={{maxWidth: '200px'}}>Name : </label>
                                <input
                                    required
                                    type="text"
                                    value={name}
                                    style={{marginLeft: '80px', width: '400px', height: '30px'}}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
    
                            <div style={{marginTop: '15px', display: 'flex'}}>
                                <label>Description : </label>
                                <textarea
                                    required
                                    type="text"
                                    value={description}
                                    style={{marginLeft: '37px', width: '400px', height: '200px'}}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop: '15px', display: 'flex'}}>
                                <label>Tags : </label>
                                <input 
                                    required
                                    type="text" 
                                    value={doto}
                                    style={{marginLeft: '98px', width: '250px', height: '30px'}}
                                    onChange={(e) => setDoto(e.target.value)}
                                />
                                <input 
                                    disabled={!doto}
                                    type="button" 
                                    value="Add word"
                                    style={{marginLeft: '20px'}}
                                    onClick={handleTags}
                                />
                            </div>
    
                            <div style={{marginTop: '15px', display: 'flex'}}>
                                <label>Banned words : </label>
                                <input
                                    required
                                    type="text"
                                    value={todo}
                                    style={{marginLeft: '9px', width: '250px', height: '30px'}}
                                    onChange={(e) => setTodo(e.target.value)}
                                />
                                <input
                                    disabled={!todo}
                                    type="button"
                                    value="Add word"
                                    style={{marginLeft: '20px'}}
                                    onClick={handleKeywords}
                                />
                            </div>
                            
                            <button onClick={handleForm} style={{backgroundColor: '#f1356d', border: '0', fontSize: '25px', color: '#fff', marginTop: '30px', marginLeft: '225px'}}>Submit</button>
                        </form>
                    </Modal>
    
                    <div className="grid">
                        { greddits.map((data, index) => 
                            <div key={index} className="group">
                                <div style={{ marginTop: '30px', display: 'flex' }}>
                                    <h3>{'Name : ' + data.name}</h3>
                                    <button onClick={() => showGreddit(index)} style={{marginLeft: '50px'}}><i className="bi bi-eye"></i></button>
                                    <button onClick={() => deleteGreddit(index)} style={{marginLeft: '10px'}}><i className="bi bi-trash"></i></button>
                                </div>
                                <p>{'Description : ' + data.description}</p>
                                <div>
                                    <span>Tags : </span>
                                    { data.tags.map((word, index, array) => {
                                        if  (array.length - 1 === index) {
                                            return <span key={index}>{word + '.'}</span>
                                        } else {
                                            return <span key={index}>{word + ', '}</span>
                                        }
                                    })}
                                </div>
                                <span>Banned Keywords : </span>
                                { data.keywords.map((word, index, array) => {
                                    if (array.length - 1 === index) {
                                        return <span key={index}>{word + '.'}</span>
                                    } else {
                                        return <span key={index}>{word + ', '}</span>
                                    }
                                })}
                                <p>
                                    <span>#people : {data.followers.length} </span>
                                    <span style={{marginLeft: '50px'}}>#posts : {data.posts}</span>
                                </p>
                            </div>
                        )}  
                    </div>
                    <button className="plus" onClick={enableForm}>+</button>
                </div>
            )}

            <div className="main">
                { stats && (
                    <h2>Stats Page</h2>
                )}
                { users && (
                    <div>
                        <h2>Users Page</h2>
                        <div className="users">
                            <div className="list">
                                <h3>Followers</h3>
                                <ul>
                                    { greddits[index].followers.map((name, idx) => 
                                        <li key={idx}>{name}</li>
                                    )}
                                </ul>
                            </div>
                            <div className="list">
                                <h3>Blocked Users</h3>
                                <ul>
                                    { greddits[index].blocked.map((name, idx) =>
                                        <li key={idx}>{name}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                { requests && (
                    <div>
                        <h2>Joining Requests Page</h2>
                        { greddits[index].waiting.length ? (
                            <div className="requests">
                                <p>The following users have requested to join the Sub-Greddit.</p>
                                { greddits[index].waiting.map((name, idx) =>
                                    <div className="row" key={idx}>
                                        <span>{name}</span>
                                        <div className="grid">
                                            <button className="accept-btn" onClick={() => handleAccept(name)}>Accept</button>
                                            <button className="reject-btn" onClick={() => handleReject(name)}>Reject</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h3>You have no requests pending.</h3>
                            </div>   
                        )}
                    </div>
                )}
                { reported && (
                    <div>
                        <h2>Reported Page</h2>
                        { reports.length ? reports.map((obj, idx) => 
                            <div className="reports" key={idx}>
                                <span>Reported by: {obj.reported_by} </span>
                                <span> Reported user: {obj.reported_to}</span>
                                <p>Concern: {obj.concern}</p>
                                <p>Text: {obj.text}</p>
                                <button 
                                    id={idx}
                                    disabled={obj.status === 'ignored' || obj.status === 'blocked'}
                                    onClick={() => handleBlock(idx)}
                                >
                                    {text[idx]}
                                </button>
                                <button 
                                    disabled={obj.status === 'ignored'} 
                                    onClick={() => handleDelete(idx)}
                                >
                                    Delete Post
                                </button>
                                <button 
                                    disabled={obj.status === 'blocked'} 
                                    onClick={() => handleIgnore(idx)}
                                >
                                    Ignore
                                </button>
                            </div>
                        ) : 
                        <div>
                            <h3>You have no reports pending.</h3>
                        </div>    
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default MySubGreddit;
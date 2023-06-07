import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Modal from 'react-modal';
import axios from 'axios';

const Home = () => {
    const date = new Date;
    const goto = useNavigate();
    const token = localStorage.getItem('name');

    const [user, setUser] = useState('');
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');

    const [rest, setRest] = useState(false);
    const [sorts, setSorts] = useState(false);
    const [normal, setNormal] = useState(true);

    const [one, setOne] = useState([]);
    const [greddits, setGreddits] = useState([]);

    const showList = () => { setSorts(true); }
    const disableList = () => { setSorts(false); }

    const showGreddit = (id) => {
        greddits.map((obj) => {
            if (obj._id === id) {
                // navigate to the chosen subgreddit
                const name = obj.name;
                goto('/sub-greddit/' + name);
            }
        });
    }

    // ####################### MAIN CONTENT ######################
    const check = (idx) => {
        const temp = greddits[idx].followers;
        const arr = temp.filter((item) => item === user);
        if (arr.length) return true;
        else return false;
    }

    const checkIt = (idx) => {
        const temp = one[idx].followers;
        const arr = temp.filter((item) => item === user);
        if (arr.length) return true;
        else return false;
    }

    const leaveGreddit = (id) => {
        axios.post('/api/leave-greddit', { accessToken: token, id: id, name: user, day: date })
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            })

        const temp = greddits.map((obj) => {
            if (obj._id === id) {
                obj.followers = obj.followers.filter(item => item !== user);
                return {...obj, followers: obj.followers};
            }
            return obj;
        });
        setGreddits(temp);
    }

    const joinGreddit = (id) => {
        axios.post('/api/join-greddit', { accessToken: token, id: id, name: user })
            .then((result) => {
                console.log(result);
                if (result.data.verdict === 'requested earlier') {
                    alert('You have already requested to join');
                } else if (result.data.verdict === 'not allowed') {
                    alert('You have already left the sub-greddit');
                } else if (result.data.verdict === 'you are blocked') {
                    alert('You have been blocked by the moderator!');
                } else {
                    alert('Request sent');
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleSearch = () => {
        setRest(true);
        const temp = one.filter((obj) => {
            const str = obj.name.toLowerCase();
            if (str.includes(search)) {
                return obj;
            }
        });
        setOne(temp);
    }

    const handleTags = () => {
        setRest(true);
        let arr = filter.replace(/\s/g, "");
        arr = arr.split(',');

        const temp = one.filter((obj) => {
            let num = 0;
            obj.tags.map((item) => {
                const str = item.toLowerCase();
                arr.map((data) => {
                    if (str.includes(data)) num++;
                })
            })
            if (num) return obj;
        });
        setOne(temp);
    }

    const handleReset = () => {
        setNormal(true);
        setRest(false);
        setSearch('');
        setFilter('');
        const temp = [...greddits].sort((a, b) => {
            const arr = a.followers.filter(item => item === user);
            const brr = b.followers.filter(item => item === user);
            return (arr.length > brr.length) ? -1 : 1;
        });
        setOne(temp);
    }

    const handleNasc = () => {
        setRest(true);
        setSorts(false);
        setNormal(false);
        const temp = greddits.sort((a, b) => {
            return (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1;
        });
        setGreddits(temp);
    }

    const handleNdesc = () => {
        setRest(true);
        setSorts(false);
        setNormal(false);
        const temp = greddits.sort((a, b) => {
            return (a.name.toLowerCase() > b.name.toLowerCase()) ? -1 : 1;
        });
        setGreddits(temp);
    }

    const handleFdesc = () => {
        setRest(true);
        setSorts(false);
        setNormal(false);
        const temp = greddits.sort((a, b) => {
            return (a.followers.length > b.followers.length) ? -1 : 1;
        });
        setGreddits(temp);
    }

    const handleCdate = () => {
        setRest(true);
        setSorts(false);
        setNormal(false);
        const temp = greddits.sort((a, b) => {
            return (a.createdAt > b.createdAt) ? -1 : 1;
        });
        setGreddits(temp);
    }

    useEffect(() => {
        const temp = [...greddits].sort((a, b) => {
            const arr = a.followers.filter(item => item === user);
            const brr = b.followers.filter(item => item === user);
            return (arr.length > brr.length) ? -1 : 1;
        });
        setOne(temp);
    }, [greddits]);

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
        axios.post("/api/all-greddit", { accessToken: token })
            .then((result) => {
                // console.log(result.data)
                if (result.data.verdict === 'failed') {
                    localStorage.clear();
                    goto('/login');
                }
                setGreddits(result.data.greddits);
                setUser(result.data.moderator);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);
    
    return (
        <div>
            <Navbar/>
            <div className="home">
                <div>
                    <Modal
                    ariaHideApp={false}
                    style={customStyles}
                    isOpen={sorts}
                    onRequestClose={disableList}
                    >
                        <div className="dd-body" onClick={handleNasc}><button>Name (Ascending)</button></div>
                        <div className="dd-body" onClick={handleNdesc}><button>Name (Descending)</button></div>
                        <div className="dd-body" onClick={handleFdesc}><button>Followers (Descending)</button></div>
                        <div className="dd-body" onClick={handleCdate}><button>Creation Date</button></div>
                    </Modal>
                    <div className="options">
                        <button onClick={showList} className="dd-header">Sort Greddits</button>
                        <input
                            type="text"
                            placeholder="Search Greddit"
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button onClick={handleSearch}><i className="bi bi-search"></i></button>
                        <input
                            type="text"
                            placeholder="Search Tags"
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <button onClick={handleTags}><i className="bi bi-search"></i></button>
                        <button disabled={!rest} onClick={handleReset}>Reset</button>
                    </div>

                    <h2>Sub Greddit Page</h2>
                    { normal && ( 
                        <div className="grid">
                            { one.map((data, idx) => 
                                <div key={idx} className="group">
                                    <button onClick={() => showGreddit(data._id)} className="name" title="show greddit">{data.name}</button>
                                    <div className="fleft">
                                        { data.moderator === user && (
                                            <button disabled><i className="bi bi-box-arrow-right"></i></button>
                                        )}
                                        { data.moderator !== user && checkIt(idx) && (
                                            <button className="able" onClick={() => leaveGreddit(data._id)} title="leave greddit"><i className="bi bi-box-arrow-right"></i></button>
                                        )}
                                        { data.moderator !== user && !checkIt(idx) && (
                                            <button className="able" onClick={() => joinGreddit(data._id)} title="join greddit"><i className="bi bi-box-arrow-in-left"></i></button>
                                        )}
                                    </div>
                                    <p>{'Description: ' + data.description}</p>
                                    <div className="tags">
                                        <span>Tags : </span>
                                        { data.tags.map((word, idx, array) => {
                                            if  (array.length - 1 === idx) {
                                                return <span key={idx}>{word + '.'}</span>
                                            } else {
                                                return <span key={idx}>{word + ', '}</span>
                                            }
                                        })}
                                    </div>
                                    <div className="keywords">
                                        <span>Banned Keywords: </span>
                                        { data.keywords.map((word, idx, array) => {
                                            if (array.length - 1 === idx) {
                                                return <span key={idx}>{word + '.'}</span>
                                            } else {
                                                return <span key={idx}>{word + ', '}</span>
                                            }
                                        })}
                                    </div>
                                    <div className="stats">
                                        <span># people: {data.followers.length} </span>
                                        <span className="fleft"># posts: {data.posts}</span>
                                    </div>
                                </div>
                            )} 
                        </div>
                    )}
                    { !normal && (
                        <div className="grid">
                            { greddits.map((data, idx) => 
                                <div key={idx} className="group">
                                    <button onClick={() => showGreddit(data._id)} className="name" title="show greddit">{data.name}</button>
                                    <div className="fleft">
                                        { data.moderator === user && (
                                            <button disabled><i className="bi bi-box-arrow-right"></i></button>
                                        )}
                                        { data.moderator !== user && check(idx) && (
                                            <button className="able" onClick={() => leaveGreddit(data._id)} title="leave greddit"><i className="bi bi-box-arrow-right"></i></button>
                                        )}
                                        { data.moderator !== user && !check(idx) && (
                                            <button className="able" onClick={() => joinGreddit(data._id)} title="join greddit"><i className="bi bi-box-arrow-in-left"></i></button>
                                        )}
                                    </div>
                                    <p>{'Description: ' + data.description}</p>
                                    <div className="tags">
                                        <span>Tags : </span>
                                        { data.tags.map((word, idx, array) => {
                                            if  (array.length - 1 === idx) {
                                                return <span key={idx}>{word + '.'}</span>
                                            } else {
                                                return <span key={idx}>{word + ', '}</span>
                                            }
                                        })}
                                    </div>
                                    <div className="keywords">
                                        <span>Banned Keywords: </span>
                                        { data.keywords.map((word, idx, array) => {
                                            if (array.length - 1 === idx) {
                                                return <span key={idx}>{word + '.'}</span>
                                            } else {
                                                return <span key={idx}>{word + ', '}</span>
                                            }
                                        })}
                                    </div>
                                    <div className="stats">
                                        <span># people: {data.followers.length} </span>
                                        <span className="fleft"># posts: {data.posts}</span>
                                    </div>
                                </div>
                            )} 
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
 
export default Home;
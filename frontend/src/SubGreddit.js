import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Modal from 'react-modal';
import axios from 'axios';

const SubGreddit = () => {
    const date = new Date;
    const goto = useNavigate();
    const { name } = useParams();
    const photo = require('./subgreddit.png');
    const token = localStorage.getItem('name');

    const [user, setUser] = useState('');
    const [index, setIndex] = useState(-1);
    const [concern, setConcern] = useState('');
    const [comment, setComment] = useState('');
    const [description, setDescription] = useState('');

    const [posts, setPosts] = useState([]);
    const [reported, setReported] = useState([]);
    const [subgreddit, setSubgreddit] = useState([]);
    const [showComment, setShowComment] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [showreport, setShowReport] = useState(false);

    const closeForm = () => { setShowForm(false); }
    const closeReport = () => { setShowReport(false); }

    const showReport = (idx) => { 
        setShowReport(true); 
        setIndex(idx);
    }

    const handleComment = (idx) => {
        if (showComment.includes(idx)) {
            const arr = showComment.filter(item => item !== idx);
            setShowComment(arr);
        } else {
            setShowComment([...showComment, idx]);
        }
    }

    const checkComment = (idx) => {
        if (showComment.includes(idx)) return true;
        else return false;
    }

    const addComment = (id) => {
        console.log(comment);

        axios.post('/api/add-comment', { 
            accessToken: token,
            id: id,
            name: user, 
            day: date,
            comment: comment
        })
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            })
        
        // add comment to posts
        const arr = posts.map((obj) => {
            if (obj._id === id) {
                obj.comments.push({
                    name: user,
                    day: date,
                    comment: comment
                });
                return obj;
            }
            return obj;
        })
        setComment('');
    }

    const handleReport = () => {
        setShowReport(false);
        // console.log(posts[index]);
        // store the report in the backend
        axios.post('/api/add-report', {
            accessToken: token, 
            gname: subgreddit.name,
            pid: posts[index]._id,
            reported_by: user,
            reported_to: posts[index].pname,
            concern: concern,
            text: posts[index].description,
            status: 'active'
        })
            .then((result) => {
                // console.log(result)
                if (result.data.verdict === 'cannot report a moderator') {
                    alert('cannot report a moderator');
                } else {
                    setConcern('')
                    setReported([...reported, index])
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleFollow = (person) => {
        // console.log(person);
        axios.post('/api/add-follow', { accessToken: token, name1: user, name2: person })
            .then((result) => {
                // console.log(result.data.verdict)
                if (result.data.verdict === 'already following') {
                    alert('Already following ' + person)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const createPost = () => { 
        const arr = subgreddit.followers.filter(item => item === user);
        if (arr.length) {
            setShowForm(true);
        } else {
            alert('Not a member!');
        }
    }

    const checkMember = () => {
        const arr = subgreddit.followers.filter(item => item === user);
        if (arr.length) return true;
        else return false;
    }

    const checkUp = (id) => {
        const arr = posts[id].upvotes.filter(item => item === user);
        if (arr.length) return false;
        else return true;
    }

    const checkDown = (id) => {
        const arr = posts[id].downvotes.filter(item => item === user);
        if (arr.length) return false;
        else return true;
    }

    const checkReport = (idx) => {
        const arr = reported.filter(item => item === idx);
        if (arr.length) return false;
        else return true;
    }

    const savePost = (id) => {
        axios.post('/api/save-post', { accessToken: token, id: id, name: user })
            .then((result) => {
                // console.log(result);
                if (result.data.verdict === 'already saved') {
                    alert('Already in the saved posts')
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleUpvote = (idx) => {
        const updated = posts.map((obj, index) => {
            if (idx === index) {
                if (obj.upvotes.includes(user)) {
                    obj.upvotes = obj.upvotes.filter(item => item !== user);
                    return {...obj, upvotes: obj.upvotes};
                } else {
                    // update in the backend
                    axios.post('/api/upvote', { accessToken: token, id: obj._id, name: user })
                        .then((result) => {
                            console.log(result)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    obj.upvotes.push(user);
                    obj.downvotes = obj.downvotes.filter(item => item !== user);
                    return {...obj, upvotes: obj.upvotes, downvotes: obj.downvotes};
                }
            }
            return obj;
        });
        setPosts(updated);
    }

    const handleDownvote = (idx) => {
        const updated = posts.map((obj, index) => {
            if (idx === index) {
                if (obj.downvotes.includes(user)) {
                    obj.downvotes = obj.downvotes.filter(item => item !== user);
                    return {...obj, downvotes: obj.downvotes};
                } else {
                    // update in the backend
                    axios.post('/api/downvote', { accessToken: token, id: obj._id, name: user })
                    .then((result) => {
                        console.log(result)
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    obj.downvotes.push(user);
                    obj.upvotes = obj.upvotes.filter(item => item !== user);
                    return {...obj, upvotes: obj.upvotes, downvotes: obj.downvotes};
                }
            }
            return obj;
        });
        setPosts(updated);
    }

    const handleForm = () => {
        setShowForm(false);
        // console.log(description);
        var n = 0, arr = '';
        var words = description.split(" ");

        words.map((item, idx) => {
            if (subgreddit.keywords.includes(item)) {
                n++;
                let len = item.length, temp = '';
                for (let i = 0; i < len; i++) {
                    temp = temp.concat('*');
                }
                words[idx] = temp;
            } 
        });

        arr = words.join(" ");
        if (n) alert('Your post has banned keywords');
        console.log(arr);
        axios.post('/api/create-post', {
            accessToken: token, 
            gname: subgreddit.name,
            pname: user,
            description: arr,
            upvotes: [],
            downvotes: [],
            comments: [],
            status: 'active',
            saved: []
        })
            .then((result) => {
                // console.log(result)
                if (result.data.verdict === 'not a user')
                    alert('Post not created. You are not a member');
            })
            .catch((err) => {
                console.log(err);
            })

        setPosts([...posts, {
            gname: subgreddit.name,
            pname: user,
            description: arr,
            upvotes: [],
            downvotes: [],
            comments: [],
            status: 'active',
            saved: []
        }]);

        setDescription('');
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
        // get the subgreddit using id from params
        axios.post("/api/get-greddit", { accessToken: token, name: name })
            .then((result) => {
                if (result.data.verdict === 'failed') {
                    localStorage.clear();
                    goto('/login');
                }
                if (result.data.flag === 'true') {
                    setPosts(result.data.posts)
                }
                setSubgreddit(result.data.subGreddit)
                setUser(result.data.user)
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    if (subgreddit.length === 0) {
        return (
            <div>
                <Navbar />
                <h1 style={{marginTop: '100px', textAlign: 'center'}}>Loading</h1>
            </div>
        )
    } else {
        return (
            <div>
                <Navbar />
                <div className="sub-greddit">
                    <div className="details">
                        <div className="pic">
                            <img src={photo} alt="Sub-Greddit" />
                            <h2>
                                <button onClick={createPost} className="post-btn">Create Post</button>
                            </h2>
                            <Modal
                                ariaHideApp={false}
                                style={customStyles}
                                isOpen={showForm}
                                onRequestClose={closeForm}
                            >
                                <h2>Add a new post...</h2>
                                <form>
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

                                    <button type="button" onClick={handleForm} style={{backgroundColor: '#f1356d', border: '0', fontSize: '25px', color: '#fff', marginTop: '30px', marginLeft: '225px', borderRadius: '5px'}}>Post</button>
                                </form>
                            </Modal>
                        </div>
                        <div className="content">
                            <h2>{subgreddit.name}</h2>
                            <p>{subgreddit.description}</p>
                            <div className="tags">
                                <span>Tags : </span>
                                { subgreddit.tags.map((word, idx, array) => {
                                    if  (array.length - 1 === idx) {
                                        return <span key={idx}>{word + '.'}</span>
                                    } else {
                                        return <span key={idx}>{word + ', '}</span>
                                    }
                                })}
                            </div>
                            <div className="keywords">
                                <span>Banned Keywords: </span>
                                { subgreddit.keywords.map((word, idx, array) => {
                                    if (array.length - 1 === idx) {
                                        return <span key={idx}>{word + '.'}</span>
                                    } else {
                                        return <span key={idx}>{word + ', '}</span>
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="post-wrapper">
                        <h2>Posts</h2>
                        { checkMember() ? (
                            <div className="member">
                                { posts.map((obj, idx) => 
                                    <div className="post-body" key={idx}>
                                        <span className="btext">{obj.pname} </span>
                                        { (obj.pname !== user && obj.pname != 'Blocked User') && (
                                            <button onClick={() => handleFollow(obj.pname)} className="follow-btn">Follow</button>
                                        )}
                                        <div className="fleft">
                                            <button onClick={() => savePost(obj._id)} title="save this post"><i className="bi bi-save2"></i></button>
                                        </div>
                                        <p>{obj.description}</p>
                                        <button onClick={() => handleComment(idx)} title="show comments" className="cmt-btn">Comments</button>
                                        <div className="fleft">
                                            { (checkUp(idx)) ? 
                                                <button onClick={() => handleUpvote(idx)}><i className="bi bi-arrow-up-square"></i></button> : 
                                                <button onClick={() => handleUpvote(idx)}><i className="bi bi-arrow-up-square-fill"></i></button>
                                            }
                                            <span>{obj.upvotes.length}</span>
                                            { (checkDown(idx)) ? 
                                                <button onClick={() => handleDownvote(idx)}><i className="bi bi-arrow-down-square"></i></button> :
                                                <button onClick={() => handleDownvote(idx)}><i className="bi bi-arrow-down-square-fill"></i></button>
                                            }
                                            <span>{obj.downvotes.length}</span>
                                            { (checkReport(idx)) ? 
                                                <button onClick={() => showReport(idx)} title="report this post"><i className="bi bi-flag"></i></button> :
                                                <button disabled><i className="bi bi-flag-fill"></i></button>
                                            }
                                        </div>
                                        { checkComment(idx) && (
                                            <div className="comment-wrapper">
                                                <div className="group">
                                                    <input
                                                        type="text"
                                                        placeholder="Add a new comment"
                                                        value={comment} 
                                                        onChange={(e) => setComment(e.target.value)}
                                                    />
                                                    <button disabled={!comment} onClick={() => addComment(obj._id)} className="add-btn">Add</button>
                                                </div>
                                                { obj.comments.map((cobj, cidx) => 
                                                    <div className="comments">
                                                        <span>{cobj.comment}</span>
                                                        <div className="fleft">
                                                            <span> --{cobj.name}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <Modal
                                            ariaHideApp={false}
                                            style={customStyles}
                                            isOpen={showreport}
                                            onRequestClose={closeReport}
                                        >
                                            <h2>Report this post...</h2>
                                            <form>
                                                <div style={{marginTop: '15px', display: 'flex'}}>
                                                    <label>Concern : </label>
                                                    <textarea
                                                        required
                                                        type="text"
                                                        value={concern}
                                                        style={{marginLeft: '37px', width: '400px', height: '200px'}}
                                                        onChange={(e) => setConcern(e.target.value)}
                                                    />
                                                </div>
                                                <button type="button" onClick={handleReport} style={{backgroundColor: '#f1356d', border: '0', fontSize: '25px', color: '#fff', marginTop: '30px', marginLeft: '225px'}}>Report</button>
                                            </form>
                                        </Modal>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="not-member">
                                <h4>You are not a member of this Sub-Greddit.</h4>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
 
export default SubGreddit;
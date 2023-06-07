import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Modal from 'react-modal';
import axios from 'axios';

const Profile = () => {
    const goto = useNavigate();
    const photo = require('./profile.png');
    const token = localStorage.getItem('name');

    const [canEdit, setCanEdit] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    // get the followers and following form the database
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    const handleEdit = () => {setCanEdit(true);}
    const openFollowers = () => {setShowFollowers(true);}
    const closeFollowers = () => {setShowFollowers(false);}
    const openFollowing = () => {setShowFollowing(true);}
    const closeFollowing = () => {setShowFollowing(false);}

    const handleSave = () => {
        // update the values accordingly
        setCanEdit(false);
        const token = localStorage.getItem('name');
        axios.post('/api/profile-update', {
            accessToken: token,
            firstName: firstName,
            lastName: lastName,
            age: age,
            contact: contact,
            email: email,
            userName: userName,
            password: password
        }, { accessToken: token })
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const removeFollower = (name) => {
        // remove the follower and update the follower array
        axios.post('/api/update-followers', { 
            accessToken: token,
            name1: userName,
            name2: name
        })
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            })
        setFollowers(followers.filter(follower => follower !== name))
    }

    const removeFollowing = (name) => {
        // remove the following and update the following array
        axios.post('/api/update-following', { 
            accessToken: token,
            name1: userName,
            name2: name
        })
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            })
        setFollowing(following.filter(following => following !== name))
    }

    const customStyles = {
        content: {  
            padding: "15px",
            zIndex: "1000",
            width: "30%",
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
        axios.post("/api/profile", { accessToken: token })
            .then((result) => {
                // console.log(result)
                if (result.data.verdict === 'failed') {
                    localStorage.clear();
                    goto('/login');
                }
                setFirstName(result.data.user.firstName)
                setLastName(result.data.user.lastName)
                setAge(result.data.user.age)
                setContact(result.data.user.contact)
                setEmail(result.data.user.email)
                setUserName(result.data.user.userName)
                setPassword(result.data.user.password)
                setFollowers(result.data.user.followers)
                setFollowing(result.data.user.following)
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    return (
        <div>
            <Navbar/>
            <div className="profile">
                <div className="pic">
                    <img src={photo} alt="Profile" />
                    <h2>{firstName+' '+lastName}</h2>
                    <h3>{'@'+userName}</h3>
                    { canEdit && (
                        <button disabled>Edit Profile</button>
                    )}
                    { !canEdit && (
                        <button onClick={handleEdit}>Edit Profile</button>
                    )}
                </div>

                <div className="form">
                    <form>
                        <div className="group">
                            <label>First Name : </label>
                            <input
                                disabled={!canEdit}
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="group">
                            <label>Last Name : </label>
                            <input
                                disabled={!canEdit}
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="group">
                            <label>Contact : </label>
                            <input
                                disabled={!canEdit}
                                type="number"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </div>

                        <div className="group">
                            <label>Age : </label>
                            <input
                                disabled={!canEdit}
                                type="number"
                                min="8"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>

                        <div className="group">
                                <label>E-mail : </label>
                            <input
                                disabled={!canEdit}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="group">
                            <label>User Name : </label>
                            <input
                                disabled
                                type="text"
                                value={userName}
                            />
                        </div>

                        <div className="group">
                            <label>Password : </label>
                            <input
                                disabled
                                type="password"
                                value={password}
                            />
                        </div>
                    </form>

                    <button onClick={openFollowers}>Followers: {followers.length}</button>
                    <Modal
                        ariaHideApp={false}
                        style={customStyles}
                        isOpen={showFollowers}
                        onRequestClose={closeFollowers}
                    >
                        { followers.map((name, index) => 
                            <div key={index} style={{width: '400px', fontSize: '25px'}}>
                                <span style={{color: '#f1356d'}}>{'@' + name}</span>
                                <button style={{float: 'right'}} onClick={() => removeFollower(name)}>Remove</button>
                            </div>
                        )}
                    </Modal>

                    <button onClick={openFollowing}>Following: {following.length}</button>
                    <Modal
                        ariaHideApp={false}
                        style={customStyles}
                        isOpen={showFollowing}
                        onRequestClose={closeFollowing}    
                    >
                        { following.map((name, index) => 
                            <div key={index} style={{width: '400px', fontSize: '25px'}}>
                                <span style={{color: '#f1356d'}}>{'@' + name}</span>
                                <button style={{float: 'right'}} onClick={() => removeFollowing(name)}>Unfollow</button>
                            </div>
                        )}
                    </Modal>

                    { canEdit && (
                        <button onClick={handleSave} className='saveBut'>Save Changes</button>
                    )}
                    { !canEdit && (
                        <button disabled className='saveBut'>Save Changes</button>
                    )}
                </div>
            </div>
        </div>
    );
}
 
export default Profile;
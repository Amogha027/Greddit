import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from 'axios';

const SavedPosts = () => {
    const token = localStorage.getItem('name');
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState('');

    const handleRemoval = (id) => {
        // console.log(id);

        axios.post('/api/remove-post', { accessToken: token, id: id, name: user })
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            })

        const temp = posts.filter(obj => obj._id !== id);
        setPosts(temp);
    }

    useEffect(() => {
        // get all the saved posts from the backend
        axios.post("/api/saved-posts", { accessToken: token })
            .then((result) => {
                // console.log(result)
                setPosts(result.data.posts)
                setUser(result.data.user)
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    return (
        <div>
            <Navbar />
            <div className="saved-posts">
                { posts.length ? (
                    <div>
                        { posts.map((obj, idx) => 
                            <div className="posts" key={idx}>
                                <span style={{color: '#f1356d'}}>{obj.pname}</span>
                                <span style={{marginLeft: '20px', marginRight: '10px'}}> --[{obj.gname}]</span>
                                <button onClick={() => handleRemoval(obj._id)} title="remove this post"><i className="bi bi-x-circle"></i></button>
                                <p>Text: {obj.description}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <h2>You have no saved posts yet.</h2>
                )}
            </div>
        </div>
    );
}
 
export default SavedPosts;
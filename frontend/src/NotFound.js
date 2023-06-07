import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const NotFound = () => {
    return (
        <div>
            <Navbar/>
            <div className="not-found">
                <h2>Sorry!</h2>
                <p>That page cannot be found.</p>
                { localStorage.getItem('name') && (
                    <button>
                        <Link to='/home'>Back to Home page...</Link>
                    </button>
                )}
                { !localStorage.getItem('name') && (
                    <button>
                        <Link to='/login'>Back to Login page...</Link>
                    </button>
                )}
            </div>
        </div>
    );
}
 
export default NotFound;
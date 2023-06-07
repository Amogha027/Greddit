import { Link, Navigate } from 'react-router-dom';

const Navbar = () => {
    const logout = () => {
        localStorage.removeItem('name');
        localStorage.clear();
        Navigate('/login');
    }

    return (
        <nav className="navbar">
            <h1>Greddit</h1>
            { localStorage.getItem('name') && (
                <div className="links">
                    <Link to='/home'>Home <i className="bi bi-house"></i></Link>
                    <div className="dropdown">
                        <button className="dropbtn">Dropdown <i className="bi bi-chevron-down"></i></button>
                        <div className="dropdown-content">
                            <Link to='/profile'>Profile</Link>
                            <Link to='/my-sub-greddit'>My Page</Link>
                            <Link to='/saved-posts'>Saved Posts</Link>
                        </div>
                    </div>
                    <Link onClick={logout}>Logout <i className="bi bi-box-arrow-right"></i></Link>
                </div>
            )}
            { !localStorage.getItem('name') && (
                <div className="links">
                    <Link to='/'>About <i className="bi bi-file-person"></i></Link>
                    <Link to='/login'>Login <i className="bi bi-box-arrow-in-left"></i></Link>
                </div>
            )}
        </nav>
    );
}
 
export default Navbar;
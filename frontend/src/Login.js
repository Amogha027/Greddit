import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from 'axios';

const Login = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const [userNameL, setUserNameL] = useState('');
    const [passwordL, setPasswordL] = useState('');

    const [login, setLogin] = useState(true);
    const [signUp, setSignUp] = useState(false);
    const goto = useNavigate();

    const LtoS = () => {
        setLogin(false);
        setSignUp(true);
    }

    const StoL = () => {
        setSignUp(false);
        setLogin(true);
    }

    const handleLogin = (e) => {
        e.preventDefault();
        // check the credentials and act accordingly
        axios.post('/api/login', {
            userName: userNameL,
            password: passwordL
        })
            .then((result) => {
                if (result.data.stats === 'failed') {
                    localStorage.clear();
                    alert(result.data.errs);
                    setUserNameL('');
                    setPasswordL('');
                } else {
                    // console.log(result.data.token);
                    localStorage.setItem('name', result.data.token);
                    goto('/home');
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Login failed!');
                setUserNameL('');
                setPasswordL('');
            })
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        // update the database and redirect for login
        axios.post('/api/signup', {
            firstName: firstName,
            lastName: lastName,
            age: age,
            contact: contact,
            email: email,
            userName: userName,
            password: password,
            followers: [],
            following: []
        })
            .then((result) => {
                if (result.data.msg === 'user already exists') 
                    alert('That username already exists. Try loging in or use other username')
                else if (result.data.msg === 'User validation failed: password: Minimum password length is 6 characters') {
                    alert('Minimum password length is 6 characters!');
                } else if (result.data.msg === 'User validation failed: email: Please enter a valid email') {
                    alert('Please enter a valid email!');
                } else if (result.data.msg === 'User validation failed: email: Please enter a valid email, password: Minimum password length is 6 characters') {
                    alert('Please enter a valid email & Minimum password length is 6 characters!');
                } else {
                    console.log(result);
                    setSignUp(false);
                    setLogin(true);
                    setFirstName('');
                    setLastName('');
                    setAge('');
                    setEmail('');
                    setContact('');
                    setUserName('');
                    setPassword('');
                    goto('/login');
                }
            })
            .catch((err) => {
                console.log(err);
            })
        // updation done
    }

    return (
        <div>
            <Navbar/>
            <div className="login">
                { login && (
                    <div>
                        <h2>Login</h2>
                        <form onSubmit={handleLogin}>
                            <input 
                            required
                            type="text"
                            value={userNameL}
                            placeholder="Username"
                            onChange={(e) => setUserNameL(e.target.value)}
                            />

                            <input
                            required 
                            type="password"
                            value={passwordL}
                            placeholder="Password"
                            onChange={(e) => setPasswordL(e.target.value)}
                            />

                            { (userNameL === '' || passwordL === '') && (
                                <button disabled className="sub">Login</button>
                            )}
                            { (!(userNameL === '' || passwordL === '')) && (
                                <button type="submit" className="sub">Login</button>
                            )}
                        </form>
                        <button type="button" onClick={LtoS}>Create an Account? Sign Up.</button>
                    </div>
                )}
                { signUp && (
                    <div>
                        <h2>Sign Up</h2>
                        <form onSubmit={handleSignUp}>
                            <input 
                            required 
                            type="text"
                            value={firstName}
                            placeholder="First Name"
                            onChange={(e) => setFirstName(e.target.value)}
                            />

                            <input 
                            required 
                            type="text"
                            value={lastName}
                            placeholder="Last Name"
                            onChange={(e) => setLastName(e.target.value)}
                            />
                            
                            <input 
                            required 
                            type="tel"
                            value={contact}
                            placeholder="Contact"
                            onChange={(e) => setContact(e.target.value)}
                            />
                            
                            <input 
                            required 
                            type="number"
                            min='8'
                            value={age}
                            placeholder="Age"
                            onChange={(e) => setAge(e.target.value)}
                            />
                            
                            <input
                            required 
                            type="email"
                            value={email}
                            placeholder="E-mail"
                            onChange={(e) => setEmail(e.target.value)}
                            />
                            
                            <input 
                            required
                            type="text"
                            value={userName}
                            placeholder="User Name"
                            onChange={(e) => setUserName(e.target.value)}
                            />
                            
                            <input
                            required 
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            
                            { (firstName === '' || lastName === '' || contact === '' || age === '' || email === '' || userName === '' || password === '') && (
                                <button disabled className="sub">Sign Up</button>
                            )}
                            { (!(firstName === '' || lastName === '' || contact === '' || age === '' || email === '' || userName === '' || password === '')) && (
                                <button type="submit" className="sub">Sign Up</button>
                            )}
                        </form>
                        <button type="button" onClick={StoL}>Already have an Account? Sign In.</button>
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default Login;
import { Navigate } from "react-router-dom";

const ProtectLogin = ({ child }) => {
    if (localStorage.getItem('name')) {
        return <Navigate to='/home' replace />
    }
    return child;
}
 
export default ProtectLogin;
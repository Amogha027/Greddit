import { Navigate } from "react-router-dom";

const Protected = ({ child }) => {
    if (!localStorage.getItem('name')) {
        return <Navigate to='/login' replace />
    }
    return child;
}
 
export default Protected;
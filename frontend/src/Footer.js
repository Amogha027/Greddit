import { useEffect, useState } from "react";

const Footer = () => {
    const [date, setDate] = useState(new Date());
    
    useEffect(() => {
        var timer = setInterval(()=>setDate(new Date()), 1000 )
        return function cleanup() {
            clearInterval(timer)
        }
    
    });

    return ( 
        <footer>
            <div className="footer">
                <p className="top">Greddit &copy; Amogha A Halhalli</p>
                <p className="bot">Server Time: {date.toLocaleDateString()} {date.toLocaleTimeString()}</p>
            </div>
        </footer>
    );
}
 
export default Footer;
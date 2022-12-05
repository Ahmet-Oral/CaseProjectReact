import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import toast from 'react-simple-toasts';

export default function Navbar() {
    let navigate = useNavigate()



    const handleLogoutButton = () => {
        localStorage.clear()
        console.log("logout - cleared local storage", localStorage)
        navigate("/");
        window.location.reload(false);
        toast("logged out!")


    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid" style={{ display: "flex" }}>

                    <Link className="navbar-brand" to="/">Home</Link>

                    {localStorage.getItem("role") === "ROLE_ADMIN" &&
                        <div style={{ marginLeft: "auto", marginRight:10 }} >
                            <Link style={{marginRight:10}} className="btn btn-light" to="/">Weather Data</Link>
                            <Link style={{marginRight:90}} className="btn btn-light" to="/user/view">View Users</Link>
                            <Link style={{marginRight:10}} className="btn btn-warning" to="/weather/new">New weather</Link>
                            <Link style={{marginRight:50}} className="btn btn-warning" to="/user/new">New user</Link>
                        </div>
                    }

                    {localStorage.getItem("currentUser") != null &&
                        <button style={{marginRight:10}} onClick={() => handleLogoutButton()} className='btn btn-danger'>Logout</button>
                    }

                </div>
            </nav>
        </div>
    )
}

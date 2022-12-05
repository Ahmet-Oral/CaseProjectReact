import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-simple-toasts';
import {RefreshToken} from "../services/HttpService";

export default function AddUser() {

    let navigate = useNavigate()


    const [user, setUsers] = useState({
        password: "",
        username: "",
        role: "",
    })

    const { password, username, role } = user


    const onInputChange = (event) => { // will trigger on every letter change
        setUsers({ ...user, [event.target.name]: event.target.value })
    }

    const onSubmit = async (event) => {
        const accessTokenStr = localStorage.getItem('access_token');
        event.preventDefault() // prevents variables from being shown in url
        // const result = await axios.post("http://localhost:8080/api/v1/user/create/"+ username + "/" + password + "/" + role,
        const result = await axios.post("http://localhost:8080/api/v1/user/create/",
            { username: username,
                    password: password,
                    role: role
            },
            { headers: { "Authorization": `Bearer ${accessTokenStr}`} })
            .catch(async function (error) {
                if (error.response.data.error_message?.includes("The Token has expired")) {
                    console.log("Error:", error.response.data.error_message)
                    await RefreshToken().catch(async function (error) {
                        toast("Token expired - logged out!")
                        navigate("/");
                    });
                }
                console.log("Error:", error)
                if (error.response.data.message !== undefined) {
                    toast("Error: " + error.response.data.message)
                }
                if (error.response.data.error_message !== undefined) {
                    toast("Error: " + error.response.data.error_message)
                }
            });

        if (result.status === 201) {
            navigate("/user/view");
        }
    }




    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Create New User</h2>
                    <form onSubmit={(event)=>onSubmit(event)}>
                        <div className='mb-3'>
                            <label htmlFor='Username' className='form-label'>Username</label>
                            <input type='text' className='form-control' placeholder='Username' name="username" value={username}
                                   onChange={(event) => onInputChange(event)}></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Password' className='form-label'>Password</label>
                            <input type='text' className='form-control' placeholder='Password' name="password" value={password}
                                onChange={(event) => onInputChange(event)}></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Role' className='form-label'>Role</label>
                            <input type='text' className='form-control' placeholder='Role' name="role" value={role}
                                onChange={(event) => onInputChange(event)}></input>
                        </div>
                        <button type='submit' className='btn btn-outline-primary'>Submit</button>
                        <Link to='/user/view' className='btn btn-outline-danger m-2'>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

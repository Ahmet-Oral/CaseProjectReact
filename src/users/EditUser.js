import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from "react-simple-toasts";

export default function EditUser() {

    let navigate = useNavigate()
    const {id}=useParams()
    const accessTokenStr = localStorage.getItem('access_token');

    const [user, setUsers] = useState({
        username: "",
        role: "",
        locked: false
    })

    const { username, role, locked } = user


    const onInputChange = (event) => { // will trigger on every letter change
        setUsers({ ...user, [event.target.name]: event.target.value });
    };

    useEffect(()=>{
        loadUser();
    }, []);

    const onSubmit = async (event) => {
        console.log("id to update: ",id)
        event.preventDefault() // prevents variables from being shown in url
        const result = await axios.put("http://localhost:8080/api/v1/user/update",
            { username: username,
                role: role,
                locked: locked,
                id: id
            },
            { headers: { "Authorization": `Bearer ${accessTokenStr}`} })
            .catch(function (error) {
                console.log("Error:", error)
                toast("Error: "+ error.response.data.error_message)
                toast("Error: "+ error.response.data.message)
            });
        if (result.status === 201) {
            toast("User updated!")
            navigate("/user/view");
        }
    };

    // display user data
    const loadUser=async () => {
        const result=await axios.get(`http://localhost:8080/api/v1/user/${id}`,
            { headers: { "Authorization": `Bearer ${accessTokenStr}`}
            })
            .catch(function (error) {
                console.log("Error:", error)
                toast("Error: "+ error.response.data.message)
            });
        setUsers(result.data);
    }


    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit User</h2>
                    <form onSubmit={(event)=>onSubmit(event)}>

                        <div className='mb-3'>
                            <label htmlFor='Username' className='form-label'>Username</label>
                            <input type='text' className='form-control' placeholder='Username' name="username" value={username}
                                onChange={(event) => onInputChange(event)}></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Locked' className='form-label'>locked</label>
                            <input type='text' className='form-control' placeholder='Locked' name="locked" value={locked}
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

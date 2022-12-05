import React, {useEffect, useState} from 'react'
import axios from "axios";
import {Link, useNavigate} from 'react-router-dom';
import toast from 'react-simple-toasts';
import {RefreshToken} from "../services/HttpService";

export default function ViewUsers() {

    let navigate = useNavigate()
    const [users, setUsers] = useState([])

    // hook - will run on page load
    useEffect(() => {
            localStorage.getItem("role") === "ROLE_ADMIN" &&
            loadUsers();
        //console.log("useEffect - loaded users")
    }, []);

    const loadUsers = async () => {
        const accessTokenStr = localStorage.getItem('access_token');
        const result = await axios.get("http://localhost:8080/api/v1/users",
            {headers: {"Authorization": `Bearer ${accessTokenStr}`}})
            .catch(async function (error) {
                // if token expired
                if (error.response.data.error_message?.includes("The Token has expired")) {
                    console.log("Error:", error.response.data.error_message)
                    await RefreshToken().catch(async function (error){
                        toast("Token expired - logged out!")
                        navigate("/");
                    });
                }
                // if no permission
                else if (error.request.status === 403 && error.response.data.error_message == null) {
                    console.log("Error - No permission")
                    toast("Error - No permission")
                }
            });
        if (result.status === 200) {
            setUsers(result.data)
            console.log("users successfully fetched: ", result.data)
        }
    };

    const deleteUser = async (id) => {
        const accessTokenStr = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8080/api/v1/user/delete/${id}`,
            { headers: { "Authorization": `Bearer ${accessTokenStr}`}
            }).catch(function (error) {
            console.log("Error:", error.response.data.message)
            toast("Error: "+ error.response.data.message)
        });
        toast("Deleted user!")
        loadUsers()
    }

    return (
        <div className='container'>
            {localStorage.getItem("role") === "ROLE_ADMIN" &&
                <div className='container'>
                    <div className='py-4'>
                        <table className='table border shadow'>
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Username</th>
                                <th scope="col">Role</th>
                                <th scope="col">Locked</th>
                                <th scope="col">Date Created</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                users.map((user, index) => (
                                    <tr>
                                        <th scope="row" key={index}>{index + 1}</th>
                                        <td>{user.username}</td>
                                        <td>{user.roles.map(({name}) => `${name}`).join(' | ')}</td>
                                        <td>{user.locked.toString()}</td>
                                        {/*convert date from UTC to local time*/}
                                        <td>{new Date(user.dateCreated).toLocaleString()}</td>
                                        <td>
                                            <Link to={`/user/edit/${user.id}`} className="btn btn-warning mx-2">Edit</Link>
                                            <button onClick={() => deleteUser(user.id)} className="btn btn-danger mx-2">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </div>
    )
}

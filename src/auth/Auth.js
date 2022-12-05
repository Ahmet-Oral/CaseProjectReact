import { FormControl, InputLabel, Input, Button, FormHelperText, FormGroup } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-simple-toasts';


function Auth() {
    let navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleUsername = (value) => {
        setUsername(value)
    }
    const handlePassword = (value) => {
        setPassword(value)
    }

    const handleLoginButton = async () => {
        const result = await axios.post("http://localhost:8080/api/v1/login",
            { username: username,
                password: password,
            }).catch(function (error) {
            if(error.response.status === 423) { 
                toast("Too many failed attempts - Account locked")
                console.log("Account locked")
                return;
            } else if(error.response.status === 400){
                toast("Wrong Password!")
                console.log("Wrong Password!")
            }else if(error.response.status === 404){
                toast("User not found!")
                console.log("User not found!")
            } else {
                toast("Error: " + error.response.status)
                console.log("Error: " + error)
            }
        });
        console.log("result: ", result)

        if (result.status === 200) {
            setUsername("") // reset username password
            setPassword("")
            localStorage.setItem("access_token", result.data.access_token);
            localStorage.setItem("refresh_token", result.data.refresh_token);
            localStorage.setItem("currentUser", result.data.username)
            localStorage.setItem("role", result.data.role)
            console.log("login successful - redirecting to home page - localStorage: ", localStorage)
            navigate("/home");
            window.location.reload(false);
            toast("Logged in!")
        }

    }

    const handleRegisterButton = async () => {
        const result = await axios.post("http://localhost:8080/api/v1/register",
            { username: username,
                password: password
            })
        .catch(function (error) {
            toast("Error "+ error.response.data.message)
            console.log("Error ", error)
        });
        console.log("result: ", result)
        if (result.status === 201) {
            toast("User successfully created, please login!")
            console.log("User successfully created")
        } 
    }






    return (
        <FormControl>
            <InputLabel style={{ top: 40 }}>username</InputLabel>
            <Input style={{ top: 40 }} onChange={(i) => handleUsername(i.target.value)} />

            <InputLabel style={{ top: 110 }}>password</InputLabel>
            <Input style={{ top: 60 }}
                onChange={(i) => handlePassword(i.target.value)} />


            <Button variant="contained"
                style={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    top: 90
                }}
                onClick={() => handleRegisterButton()}>Register</Button>

            <Button variant="contained"
                style={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    top: 130
                }}
                onClick={() => handleLoginButton()}>Login</Button>
            <FormHelperText style={{marginTop:70}}>Are you already registered?</FormHelperText>

        </FormControl>
    )
}

export default Auth;
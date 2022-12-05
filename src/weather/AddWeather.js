import React, {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import toast from "react-simple-toasts";
import {RefreshToken} from "../services/HttpService";

export default function AddWeather() {
    let navigate = useNavigate()


    const [weather, setWeather] = useState({
        temperature: "",
        country: "",
        city: "",
        date: "",
        condition: "",
    })

    const { temperature, country, city,date,condition } = weather


    const onInputChange = (event) => { // will trigger on every letter change
        setWeather({ ...weather, [event.target.name]: event.target.value })
    }

    const onSubmit = async (event) => {
        const accessTokenStr = localStorage.getItem('access_token');
        event.preventDefault() // prevents variables from being shown in url
        // const result = await axios.post("http://localhost:8080/api/v1/user/create/"+ username + "/" + password + "/" + role,
        const result = await axios.post("http://localhost:8080/api/v1/weather/new",
            { temperature: temperature,
                country: country,
                city: city,
                date: date,
                condition: condition,
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
                toast("Error: " + error.response.data.error_message)
            });

        if (result.status === 201) {
            navigate("/");
        }
    }


    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Create New Weather Data</h2>
                    <form onSubmit={(event)=>onSubmit(event)}>
                        <div className='mb-3'>
                            <label htmlFor='Temperature' className='form-label'>Temperature</label>
                            <input type='text' className='form-control' placeholder='Temperature' name="temperature" value={temperature}
                                   onChange={(event) => onInputChange(event)}></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Country' className='form-label'>Country</label>
                            <input type='text' className='form-control' placeholder='Country' name="country" value={country}
                                   onChange={(event) => onInputChange(event)}></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='City' className='form-label'>City</label>
                            <input type='text' className='form-control' placeholder='City' name="city" value={city}
                                   onChange={(event) => onInputChange(event)}></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Date' className='form-label'>Date</label>
                            <input type='text' className='form-control' placeholder='yyyy-dd-mm' name="date" value={date}
                                   onChange={(event) => onInputChange(event)}></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Condition' className='form-label'>Condition</label>
                            <input type='text' className='form-control' placeholder='Condition' name="condition" value={condition}
                                   onChange={(event) => onInputChange(event)}></input>
                        </div>
                        <button type='submit' className='btn btn-outline-primary'>Submit</button>
                        <Link to='/' className='btn btn-outline-danger m-2'>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
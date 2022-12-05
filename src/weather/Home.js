import React, {useEffect, useState} from 'react'
import axios from "axios";
import {Link, useNavigate, useParams} from 'react-router-dom';
import toast from 'react-simple-toasts';
import {
    Button,
    FormHelperText, MenuItem,
    Pagination,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {RefreshToken} from "../services/HttpService";

export default function Home() {
    let navigate = useNavigate()
    const [weathers, setWeathers] = useState([])
    const [pagination, setPagination] = useState([])
    const [load, setLoad] = React.useState(false);
    const [pageSize, setPageSize] = React.useState(10);
    const [isDesc, setIsDesc] = React.useState(false);
    const [pageNumber, setPageNumber] = React.useState(0);
    const [sortBy, setSortBy] = React.useState("id");
    const [filter, setFilter] = React.useState("");
    const [filterBy, setFilterBy] = React.useState("temperature");

    // hook - will run on page load
    useEffect(() => {
        loadWeathers(sortBy, isDesc, pageNumber, pageSize, filterBy, filter)

    }, []); // [] to prevent infinite loop


    const loadWeathers = async (sortBy, isDesc, pageNumber, pageSize, filterBy, filter) => { //load asynchronously
        setLoad(true)
        console.log("loadWeathers")
        const accessTokenStr = localStorage.getItem('access_token');
        let url = "http://localhost:8080/api/v1/weather/page/"+sortBy+"/"+isDesc+"/"+pageNumber+"/"+pageSize

        if (filter !== "" && filterBy !== "") {
            url = "http://localhost:8080/api/v1/weather/page/" + sortBy + "/" + isDesc + "/" + pageNumber + "/" + pageSize + "/" + filterBy + "/" + filter
        }

        const result = await axios.get(url,
            {headers: {"Authorization": `Bearer ${accessTokenStr}`}})
            //const result = await axios.get("http://localhost:8080/api/v1/users", { headers: { "Authorization": `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhaG1ldCIsInJvbGVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS92MS9sb2dpbiIsImV4cCI6MTY3MDAwODQxNH0.cY9EbZfY2Sp6WLQX2b9ePFpUseEtblPS52rDLTyGXUE` } })
            .catch(async function (error) {
                setLoad(false);
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
            setWeathers(result.data.content)
            console.log("weather data successfully fetched: ", result.data)
            setPagination(result.data);
            setLoad(false)
        }
    };


    function handlePagination (event) {
        console.log("selected page" ,event.currentTarget.textContent)
        setPageNumber(event.currentTarget.textContent)
        loadWeathers(sortBy, isDesc, event.currentTarget.textContent, pageSize, filterBy, filter)
    }
    function handleSelectChange (event) {
        console.log("selected page size" ,event.target.value)
        setPageSize(event.target.value)
        loadWeathers(sortBy, isDesc, 0, event.target.value, filterBy, filter)
    }

    function handleSort (event) {
        toast("Sorting by: "+ event.target.textContent.slice(0, -1) + " - Ascending: "+ isDesc)
        console.log("on click column", event.target.textContent.slice(0, -1))
        setSortBy(event.target.textContent.slice(0, -1))
        loadWeathers(event.target.textContent.slice(0, -1), !isDesc, 0, pageSize, filterBy, filter)
        isDesc ? setIsDesc(false) : setIsDesc(true)
    }

    function handleFilterText (event) {
        console.log("Filter:", event.target.value)
        setFilter(event.target.value)
    }
    function handleSelectFilterBy (event) {
        console.log("Filtering by", event.target.value)
        setFilterBy(event.target.value)
    }
    function handleFilterbutton (event) {
        toast("Filtered")
        loadWeathers(sortBy, isDesc, 0, pageSize, filterBy, filter)
    }

    return (
        <div>
            <FormHelperText> Number of records by given filters: {pagination.totalElements}</FormHelperText>
            <TableContainer style={{marginTop: 10}} component={Paper}>
                <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow style={{background:"lightgray"}}>
                            <TableCell style={{cursor:'pointer',  textAlign: 'center'}} onClick={handleSort} align="right">Temperature&darr;</TableCell>
                            <TableCell style={{cursor:'pointer',  textAlign: 'center'}} onClick={handleSort} align="right">Country&darr;</TableCell>
                            <TableCell style={{cursor:'pointer',  textAlign: 'center'}} onClick={handleSort} align="right">City&darr;</TableCell>
                            <TableCell style={{cursor:'pointer',  textAlign: 'center'}} onClick={handleSort} align="right">date&darr;</TableCell>
                            <TableCell style={{cursor:'pointer',  textAlign: 'center'}} onClick={handleSort} align="right">condition&darr;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {weathers.map((weather) => (
                            <TableRow key={weather.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell style={{ textAlign: 'center'}} component="th" scope="row">{weather.temperature}</TableCell>
                                <TableCell style={{ textAlign: 'center'}} align="right">{weather.country}</TableCell>
                                <TableCell style={{ textAlign: 'center'}} align="right">{weather.city}</TableCell>
                                <TableCell style={{ textAlign: 'center'}} align="right">{new Date(weather.date).toLocaleString()}</TableCell>
                                <TableCell style={{ textAlign: 'center'}} align="right">{weather.condition}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="container-fluid" style={{ display: "flex" }}>

                <Select size="small" style={{ marginLeft: 15, marginTop:20 }}
                        value={filterBy}
                        disabled={load}
                        onChange={handleSelectFilterBy}>
                    <MenuItem value={"temperature"}>Temperature</MenuItem>
                    <MenuItem value={"country"}>Country</MenuItem>
                    <MenuItem value={"city"}>City</MenuItem>
                    <MenuItem value={"date"}>Date (by year only)</MenuItem>
                    <MenuItem value={"condition"}>Condition</MenuItem>
                </Select>
                <TextField
                    disabled={load}
                    style={{ marginLeft: 15, marginTop:20 }}
                    size="small"
                    value={filter}
                    onChange={handleFilterText}
                />
                <Button size="small" disabled={load} style={{ marginRight: "auto", marginLeft:10,marginTop:17 }} onClick={handleFilterbutton} variant="contained">Filter</Button>

                <FormHelperText style={{ marginLeft: "auto", marginRight:10, marginTop:33 }}>Number of rows per page:</FormHelperText>

                <Select size="small" style={{ marginLeft: 15, marginTop:23 }}
                        value={pageSize}
                        onChange={handleSelectChange}
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>

                <Pagination  hidePrevButton hideNextButton style={{ marginLeft: 50, marginRight:20 , marginTop:25 }} disabled={load} count={pagination.totalPages-1} onChange={handlePagination} color="primary"/>

            </div>
        </div>
    )
}

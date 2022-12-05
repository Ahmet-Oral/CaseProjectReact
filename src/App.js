import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './navbar/Navbar';
import Home from './weather/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddUser from './users/AddUser';
import EditUser from './users/EditUser';
import ViewUsers from './users/ViewUsers';
import Auth from './auth/Auth';
import AddWeather from "./weather/AddWeather";

function App() {


  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          {localStorage.getItem("currentUser") != null ? (
            <>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/home" element={<Home />} />
                {localStorage.getItem("role") === "ROLE_ADMIN" ? (
                    <>
                        <Route exact path="/weather/new" element={<AddWeather />} />
                        <Route exact path="/user/new" element={<AddUser />} />
                        <Route exact path="/user/view" element={<ViewUsers />} />
                        <Route exact path="/user/edit/:id" element={<EditUser />} />
                        <Route exact path="/user/view/:id" element={<ViewUsers />} />
                    </>
                ) : (
                    <Route exact path="/*" element={<Home />} />
                )}
            </>
          ) : (
            <Route exact path="/*" element={<Auth />} />
          )}
        </Routes>
      </Router>

    </div>
  );
}

export default App;

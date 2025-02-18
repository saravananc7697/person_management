import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainAuth from "./Auth-component/MainAuth";
import Signup from "./Auth-component/Sign-up/Signup";
import Forget from "./Auth-component/Forget-password/Forget";
import Dashboard from "./Pages/DashboardPage/Dashboard";
import PersonDetails from "./Pages/PersonDetailsPage/PersonDetails";
import AdminProfile from "./Pages/AdminProfile/AdminProfile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainAuth />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<Forget />} />
          {/* <Route path="/dashboard/profile" element={<AdminProfile />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/person/:personid" element={<PersonDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

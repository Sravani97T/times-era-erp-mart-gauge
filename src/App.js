import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./Components/Assets/LoginPage";
import Dashboard from "./Components/Assets/Dashboard";
import Settings from "./Components/Assets/Settings";
import Profile from "./Components/Assets/Profile";
import DashboardLayout from "./Components/Assets/DashboardLayout";
import LoanMainProduct from "./Components/Assets/LoanMasters/LoanMainProduct";
import LoanProductMaster from "./Components/Assets/LoanMasters/LoanProductMaster";
import LoanPurity from "./Components/Assets/LoanMasters/LoanPrurity";
import LoanEntryMast from "./Components/Assets/LoanMasters/LoanEntryMast";
const App = ({onLogin}) => {
  
 const tenantName = localStorage.getItem("tenantName");
  const [isAuthenticated, setIsAuthenticated] = useState(
    // localStorage.getItem("isLoggedIn") === "true"
    tenantName
  );

    const handleLogin = (name) => {
    // localStorage.setItem("isLoggedIn", "true"); // Store login status
    setIsAuthenticated(name);
    console.log(name)
  };
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            {/* masters */}
            <Route path="/loan-mainproduct" element={<LoanMainProduct />} />
            <Route path="/product-name" element={<LoanProductMaster />} />
            <Route path="/purity-master" element={<LoanPurity />} />
                        <Route path="/entry-mast" element={<LoanEntryMast />} />


          </Route>
        ) : (
          // If not authenticated, redirect to login
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;

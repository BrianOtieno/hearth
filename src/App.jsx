import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Storefront from "./views/Storefront";
import AboutPage from "./views/AboutPage";
import DriverPortal from "./views/DriverPortal";
import Dashboard from "./views/Dashboard";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/driver" element={<DriverPortal />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

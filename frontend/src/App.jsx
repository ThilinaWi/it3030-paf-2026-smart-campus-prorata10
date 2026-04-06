import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ResourceList from './components/resources/ResourceList';
import ResourceForm from './components/resources/ResourceForm';
import ResourceDetail from './components/resources/ResourceDetail';
import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/resources" />} />
                    <Route path="/resources" element={<ResourceList />} />
                    <Route path="/resources/create" element={<ResourceForm />} />
                    <Route path="/resources/edit/:id" element={<ResourceForm />} />
                    <Route path="/resources/:id" element={<ResourceDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
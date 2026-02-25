import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes/AppRoutes';
import Footer from './components/common/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <AppRoutes />
      </main>
      <Footer/>
    </Router>
  );
}
export default App;
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes/AppRoutes';
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <AppRoutes />
      </main>
      <Footer/>
    </Router>
  );
}

export default App;
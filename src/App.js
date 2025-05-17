import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import DetalleSalon from "./DetalleSalon";

// Componente de navegación
const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-gray-900 to-purple-900 shadow-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <svg 
                className="h-8 w-8 text-purple-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
              <span className="ml-2 text-white font-bold text-xl">Sistema de Salones</span>
            </a>
          </div>
          <div>
            <a 
              href="/" 
              className="text-purple-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Inicio
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Layout principal
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/salon/:nombre" element={<DetalleSalon />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 
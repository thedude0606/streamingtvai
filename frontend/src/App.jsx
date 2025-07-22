import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CampaignList from './components/CampaignList';
import CampaignForm from './components/CampaignForm';
import { Button } from '@/components/ui/button';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold">Streaming TV AI</h1>
            <ul className="flex space-x-4">
              <li>
                <Link to="/">
                  <Button variant="link" className="text-white">Campaigns</Button>
                </Link>
              </li>
              <li>
                <Link to="/create">
                  <Button variant="link" className="text-white">Create Campaign</Button>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<CampaignList />} />
            <Route path="/create" element={<CampaignForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;



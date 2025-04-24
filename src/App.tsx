import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-cream font-sans">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/game/:roomId" element={<GamePage />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Pizza } from 'lucide-react';

const HomePage: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [nameError, setNameError] = useState('');
  const { setPlayerName: setGamePlayerName } = useGame();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setNameError('Please enter your name');
      return;
    }
    
    setGamePlayerName(playerName);
    navigate('/lobby');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-800 to-red-800 text-white p-4">
      <div className="max-w-md w-full bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-102">
        <div className="flex flex-col items-center mb-8">
          <Pizza className="w-20 h-20 text-yellow-300 mb-4" />
          <h1 className="text-4xl font-bold text-center mb-2 text-yellow-100">Italian Brainrot</h1>
          <p className="text-xl text-center text-yellow-100 opacity-80">The Guessing Game</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-yellow-100 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setNameError('');
              }}
              className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 text-white placeholder-gray-300"
              placeholder="Enter your name"
            />
            {nameError && <p className="mt-1 text-sm text-red-300">{nameError}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-300 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
          >
            Enter Lobby
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-yellow-100 opacity-70">
            Join the fun and guess the Italian brainrot phrases!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
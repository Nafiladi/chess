import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import GameRoomCard from '../components/Lobby/GameRoomCard';
import CreateGameModal from '../components/Lobby/CreateGameModal';
import { Pizza, Users, Plus, RefreshCw } from 'lucide-react';

const LobbyPage: React.FC = () => {
  const { gameRooms, currentPlayer, isConnected, createRoom } = useGame();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  
  // Redirect to home if no player is set
  useEffect(() => {
    if (!currentPlayer && !localStorage.getItem('playerName')) {
      navigate('/');
    }
  }, [currentPlayer, navigate]);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  const handleCreateGame = (roomName: string) => {
    createRoom(roomName);
    setIsCreateModalOpen(false);
    // Navigate to game page after creating room
    setTimeout(() => {
      navigate(`/game/${gameRooms[0]?.id || 'new-room'}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-red-800 text-white">
      {/* Header */}
      <header className="pt-6 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Pizza className="h-8 w-8 text-yellow-300 mr-3" />
            <h1 className="text-2xl font-bold text-yellow-100">Italian Brainrot Lobby</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className="flex items-center px-3 py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Game
            </button>
          </div>
        </div>
      </header>
      
      {/* Connection status */}
      {!isConnected && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-red-900 bg-opacity-60 text-white rounded-lg p-3 flex items-center">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            <span>Connecting to server...</span>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Game rooms section */}
        <section>
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-yellow-300 mr-2" />
            <h2 className="text-xl font-semibold text-yellow-100">Available Game Rooms</h2>
          </div>
          
          {gameRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameRooms.map((room) => (
                <GameRoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="bg-white bg-opacity-10 rounded-lg p-8 text-center">
              <p className="text-lg text-yellow-100 mb-4">No game rooms available</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create First Game
              </button>
            </div>
          )}
        </section>
        
        {/* How to play section */}
        <section className="mt-12 bg-white bg-opacity-10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-100 mb-4">How to Play</h2>
          <div className="space-y-3 text-yellow-100 opacity-90">
            <p>
              1. Create a new game room or join an existing one
            </p>
            <p>
              2. Take turns guessing the correct Italian "brainrot" phrase for each image
            </p>
            <p>
              3. Score points for correct guesses and compete with your friends
            </p>
            <p>
              4. Share your room link to invite friends to join your game
            </p>
          </div>
        </section>
      </main>
      
      {/* Create game modal */}
      <CreateGameModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateGame}
      />
    </div>
  );
};

export default LobbyPage;
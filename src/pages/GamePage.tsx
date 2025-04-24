import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import GameBoard from '../components/Game/GameBoard';
import PlayerList from '../components/Game/PlayerList';
import ChatBox from '../components/Game/ChatBox';
import WaitingRoom from '../components/Game/WaitingRoom';
import { ArrowLeft } from 'lucide-react';

const GamePage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { currentPlayer, currentRoom, gameState, joinRoom, leaveRoom } = useGame();
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (roomId && currentPlayer && !currentRoom && !isJoining) {
      setIsJoining(true);
      joinRoom(roomId, currentPlayer.name);
      setTimeout(() => setIsJoining(false), 1000);
    }
  }, [roomId, currentPlayer, currentRoom, joinRoom, isJoining]);

  // Redirect to home if no player is set
  useEffect(() => {
    if (!currentPlayer && !localStorage.getItem('playerName')) {
      navigate('/');
    }
  }, [currentPlayer, navigate]);

  const handleLeaveGame = () => {
    leaveRoom();
    navigate('/lobby');
  };

  // Show loading state while joining
  if (isJoining || !currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-800 to-red-800 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
          <p className="text-xl">Joining game room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-red-800 text-white">
      {/* Header */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={handleLeaveGame}
              className="mr-4 p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold">{currentRoom.name}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            <span className="text-sm">
              {currentRoom.status === 'waiting' ? 'Waiting for players' : 'Game in progress'}
            </span>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRoom.status === 'waiting' || !gameState ? (
          <WaitingRoom room={currentRoom} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game board */}
            <div className="lg:col-span-2">
              <GameBoard gameState={gameState} />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <PlayerList players={currentRoom.players} currentPlayerId={currentPlayer?.id} />
              <ChatBox roomId={currentRoom.id} chat={currentRoom.chat || []} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GamePage;
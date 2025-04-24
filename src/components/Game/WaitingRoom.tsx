import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameRoom } from '../../types/gameTypes';
import { Share2, Users, Clock, ArrowLeft } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface WaitingRoomProps {
  room: GameRoom;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ room }) => {
  const navigate = useNavigate();
  const { leaveRoom, currentPlayer } = useGame();
  
  const handleShareLink = () => {
    const link = `${window.location.origin}/game/${room.id}`;
    navigator.clipboard.writeText(link);
    
    // Simple notification
    alert('Game link copied to clipboard!');
  };
  
  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/lobby');
  };
  
  const isHost = currentPlayer && currentPlayer.id === room.createdBy;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-yellow-100 mb-2">Waiting for Players</h2>
          <p className="text-xl text-yellow-200 opacity-80">
            Room: {room.name}
          </p>
        </div>
        
        <div className="mb-10">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-yellow-300 mr-2" />
            <h3 className="text-xl font-semibold text-yellow-100">Players ({room.players.length}/2)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            {room.players.map(player => (
              <div 
                key={player.id}
                className="bg-white bg-opacity-20 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold mr-3">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {player.name}
                      {player.id === currentPlayer?.id && " (You)"}
                    </p>
                    {player.id === room.createdBy && (
                      <span className="text-xs bg-yellow-500 bg-opacity-30 text-yellow-100 px-2 py-0.5 rounded-full">
                        Host
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty player slot */}
            {room.players.length < 2 && (
              <div className="bg-white bg-opacity-10 rounded-lg p-4 border-2 border-dashed border-white border-opacity-20 flex items-center justify-center">
                <p className="text-gray-400 text-center">
                  Waiting for another player...
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleShareLink}
            className="flex items-center px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition-colors duration-200 w-full max-w-md"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Game Link
          </button>
          
          <button
            onClick={handleLeaveRoom}
            className="flex items-center px-6 py-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-medium transition-colors duration-200 w-full max-w-md"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Leave Room
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2 animate-pulse" />
            <p className="text-gray-400">
              {room.players.length < 2 
                ? "Waiting for another player to join..."
                : "Game will start automatically when both players are ready."
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5">
        <h3 className="text-lg font-semibold text-yellow-100 mb-3">How to Play</h3>
        <div className="space-y-2 text-gray-300">
          <p>1. Take turns guessing the Italian "brainrot" phrase for each image.</p>
          <p>2. Type your guess in the text field when it's your turn.</p>
          <p>3. Get points for correct guesses!</p>
          <p>4. The player with the most points after all rounds wins.</p>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
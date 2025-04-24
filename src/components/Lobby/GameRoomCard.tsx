import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { Users, Play, Clock } from 'lucide-react';
import { GameRoom } from '../../types/gameTypes';

interface GameRoomCardProps {
  room: GameRoom;
}

const GameRoomCard: React.FC<GameRoomCardProps> = ({ room }) => {
  const navigate = useNavigate();
  const { joinRoom, currentPlayer } = useGame();

  const handleJoinRoom = () => {
    if (currentPlayer) {
      joinRoom(room.id, currentPlayer.name);
      navigate(`/game/${room.id}`);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/game/${room.id}`;
    navigator.clipboard.writeText(link);
    
    // Show toast notification (simplified version)
    alert('Game link copied to clipboard!');
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-102 hover:bg-opacity-15">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-yellow-100 truncate">{room.name}</h3>
          <span className={`
            px-2 py-0.5 text-xs font-medium rounded-full 
            ${room.status === 'waiting' ? 'bg-blue-500 bg-opacity-30 text-blue-100' : 
              room.status === 'in-progress' ? 'bg-yellow-500 bg-opacity-30 text-yellow-100' : 
              'bg-red-500 bg-opacity-30 text-red-100'
            }
          `}>
            {room.status === 'waiting' ? 'Waiting' : 
             room.status === 'in-progress' ? 'In Progress' : 
             'Full'}
          </span>
        </div>
        
        <div className="flex items-center mb-4">
          <Users className="h-4 w-4 text-gray-300 mr-2" />
          <p className="text-sm text-gray-300">
            {room.players.length} / 2 players
          </p>
        </div>
        
        <div className="mb-6">
          <p className="text-xs text-gray-400">Players:</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {room.players.map(player => (
              <span key={player.id} className="text-xs bg-white bg-opacity-10 px-2 py-1 rounded-full">
                {player.name}
                {room.createdBy === player.id && " (Host)"}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={handleJoinRoom}
            disabled={room.status !== 'waiting' || room.players.length >= 2}
            className={`
              w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium
              ${room.status === 'waiting' && room.players.length < 2 
                ? 'bg-green-500 hover:bg-green-400 text-white' 
                : 'bg-gray-700 bg-opacity-50 text-gray-400 cursor-not-allowed'}
            `}
          >
            <Play className="h-4 w-4 mr-2" />
            {room.status === 'waiting' && room.players.length < 2 
              ? 'Join Game' 
              : room.status === 'in-progress' 
                ? 'Game In Progress' 
                : 'Room Full'}
          </button>
          
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-medium"
          >
            Share Link
          </button>
        </div>
      </div>
      
      <div className="bg-white bg-opacity-5 px-5 py-3 flex items-center">
        <Clock className="h-4 w-4 text-gray-400 mr-2" />
        <p className="text-xs text-gray-400">
          Created a few minutes ago
        </p>
      </div>
    </div>
  );
};

export default GameRoomCard;
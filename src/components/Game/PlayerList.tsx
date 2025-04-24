import React from 'react';
import { Users, Crown } from 'lucide-react';
import { Player } from '../../types/gameTypes';

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerId }) => {
  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
      <div className="bg-white bg-opacity-5 p-4 flex items-center">
        <Users className="h-5 w-5 text-yellow-300 mr-2" />
        <h2 className="text-lg font-bold text-yellow-100">Players</h2>
      </div>
      
      <div className="divide-y divide-white divide-opacity-10">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id}
            className={`p-4 flex items-center justify-between transition-colors duration-200 ${
              player.id === currentPlayerId ? 'bg-white bg-opacity-5' : ''
            }`}
          >
            <div className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mr-3
                ${index === 0 ? 'bg-yellow-500 text-black' : 'bg-white bg-opacity-20 text-white'}
              `}>
                {index === 0 ? (
                  <Crown className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              
              <div>
                <p className={`font-medium ${player.id === currentPlayerId ? 'text-yellow-200' : 'text-white'}`}>
                  {player.name}
                  {player.id === currentPlayerId && " (You)"}
                </p>
                <p className="text-xs text-gray-400">
                  {player.id === currentPlayerId ? 'Your score' : 'Score'}: {player.score}
                </p>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-yellow-300">
              {player.score}
            </div>
          </div>
        ))}
      </div>
      
      {players.length < 2 && (
        <div className="p-4 text-center text-gray-400 italic text-sm">
          Waiting for another player to join...
        </div>
      )}
    </div>
  );
};

export default PlayerList;
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { Player, GameRoom, GameState } from '../types/gameTypes';

interface GameContextType {
  currentPlayer: Player | null;
  gameRooms: GameRoom[];
  currentRoom: GameRoom | null;
  gameState: GameState | null;
  isConnected: boolean;
  createRoom: (roomName: string) => void;
  joinRoom: (roomId: string, playerName: string) => void;
  leaveRoom: () => void;
  submitGuess: (guess: string) => void;
  sendChatMessage: (message: string) => void;
  setPlayerName: (name: string) => void;
}

const defaultContextValue: GameContextType = {
  currentPlayer: null,
  gameRooms: [],
  currentRoom: null,
  gameState: null,
  isConnected: false,
  createRoom: () => {},
  joinRoom: () => {},
  leaveRoom: () => {},
  submitGuess: () => {},
  sendChatMessage: () => {},
  setPlayerName: () => {},
};

const GameContext = createContext<GameContextType>(defaultContextValue);

export const useGame = () => useContext(GameContext);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameRooms, setGameRooms] = useState<GameRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Initialize WebSocket connection
  const { sendMessage, lastMessage, readyState } = useWebSocket();
  const isConnected = readyState === WebSocket.OPEN;

  // Load player name from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setCurrentPlayer({ id: generateId(), name: savedName, score: 0 });
    }
  }, []);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        
        switch (data.type) {
          case 'ROOMS_UPDATE':
            setGameRooms(data.rooms);
            break;
          case 'ROOM_JOINED':
            setCurrentRoom(data.room);
            break;
          case 'GAME_STATE_UPDATE':
            setGameState(data.gameState);
            break;
          case 'PLAYER_JOINED':
            if (currentRoom && data.roomId === currentRoom.id) {
              setCurrentRoom({
                ...currentRoom,
                players: [...currentRoom.players, data.player]
              });
            }
            break;
          case 'PLAYER_LEFT':
            if (currentRoom && data.roomId === currentRoom.id) {
              setCurrentRoom({
                ...currentRoom,
                players: currentRoom.players.filter(p => p.id !== data.playerId)
              });
            }
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    }
  }, [lastMessage, currentRoom]);

  // Request rooms update when connected
  useEffect(() => {
    if (isConnected) {
      sendMessage(JSON.stringify({ type: 'GET_ROOMS' }));
    }
  }, [isConnected, sendMessage]);

  // Generate a random ID for players and rooms
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const setPlayerName = (name: string) => {
    localStorage.setItem('playerName', name);
    setCurrentPlayer({ id: currentPlayer?.id || generateId(), name, score: 0 });
  };

  const createRoom = (roomName: string) => {
    if (!currentPlayer) return;
    
    const roomId = generateId();
    sendMessage(JSON.stringify({
      type: 'CREATE_ROOM',
      room: {
        id: roomId,
        name: roomName,
        status: 'waiting',
        players: [currentPlayer],
        createdBy: currentPlayer.id,
      }
    }));
  };

  const joinRoom = (roomId: string, playerName: string) => {
    if (!currentPlayer && !playerName) return;
    
    if (!currentPlayer && playerName) {
      setPlayerName(playerName);
    }
    
    sendMessage(JSON.stringify({
      type: 'JOIN_ROOM',
      roomId,
      player: currentPlayer || { id: generateId(), name: playerName, score: 0 }
    }));
  };

  const leaveRoom = () => {
    if (!currentRoom || !currentPlayer) return;
    
    sendMessage(JSON.stringify({
      type: 'LEAVE_ROOM',
      roomId: currentRoom.id,
      playerId: currentPlayer.id
    }));
    
    setCurrentRoom(null);
    setGameState(null);
  };

  const submitGuess = (guess: string) => {
    if (!currentRoom || !currentPlayer || !gameState) return;
    
    sendMessage(JSON.stringify({
      type: 'SUBMIT_GUESS',
      roomId: currentRoom.id,
      playerId: currentPlayer.id,
      guess
    }));
  };

  const sendChatMessage = (message: string) => {
    if (!currentRoom || !currentPlayer) return;
    
    sendMessage(JSON.stringify({
      type: 'CHAT_MESSAGE',
      roomId: currentRoom.id,
      player: currentPlayer,
      message,
      timestamp: new Date().toISOString()
    }));
  };

  return (
    <GameContext.Provider
      value={{
        currentPlayer,
        gameRooms,
        currentRoom,
        gameState,
        isConnected,
        createRoom,
        joinRoom,
        leaveRoom,
        submitGuess,
        sendChatMessage,
        setPlayerName,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = 'wss://italian-brainrot-api.example.com';

interface UseWebSocketReturn {
  sendMessage: (message: string) => void;
  lastMessage: MessageEvent | null;
  readyState: number;
}

export const useWebSocket = (): UseWebSocketReturn => {
  // In a real implementation, we'd connect to a real WebSocket server
  // For this demo, we'll simulate WebSocket behavior
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const mockSocketRef = useRef<any>(null);

  const sendMessage = useCallback((message: string) => {
    console.log('Sending message:', message);
    // Simulate sending a message
    try {
      const data = JSON.parse(message);

      // Simulate responses based on message type
      setTimeout(() => {
        let response;

        switch (data.type) {
          case 'GET_ROOMS':
            response = {
              type: 'ROOMS_UPDATE',
              rooms: [
                {
                  id: 'room1',
                  name: 'Pasta Lovers',
                  status: 'waiting',
                  players: [{ id: 'p1', name: 'Mario', score: 0 }],
                  createdBy: 'p1',
                },
                {
                  id: 'room2',
                  name: 'Pizza Squad',
                  status: 'in-progress',
                  players: [
                    { id: 'p2', name: 'Luigi', score: 3 },
                    { id: 'p3', name: 'Peach', score: 2 },
                  ],
                  createdBy: 'p2',
                },
              ],
            };
            break;

          case 'CREATE_ROOM':
            response = {
              type: 'ROOM_JOINED',
              room: data.room,
            };
            break;

          case 'JOIN_ROOM':
            response = {
              type: 'ROOM_JOINED',
              room: {
                id: data.roomId,
                name: data.roomId === 'room1' ? 'Pasta Lovers' : 'Custom Room',
                status: 'waiting',
                players: [
                  { id: 'p1', name: 'Mario', score: 0 },
                  data.player,
                ],
                createdBy: 'p1',
                chat: [],
              },
            };
            break;

          case 'SUBMIT_GUESS':
            // Simulate correct guess 50% of the time
            const isCorrect = Math.random() > 0.5;
            response = {
              type: 'GAME_STATE_UPDATE',
              gameState: {
                currentRound: 1,
                totalRounds: 5,
                currentImage: 'https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg',
                correctAnswer: 'tralalelo tralala',
                timeRemaining: 30,
                status: isCorrect ? 'correct_guess' : 'incorrect_guess',
                lastGuess: {
                  playerId: data.playerId,
                  guess: data.guess,
                  isCorrect,
                },
                currentPlayer: data.playerId,
              },
            };
            break;

          default:
            console.log('Unhandled message type in mock websocket:', data.type);
            return;
        }

        // Create a mock MessageEvent
        const mockEvent = new MessageEvent('message', {
          data: JSON.stringify(response),
        });
        setLastMessage(mockEvent);
      }, 300); // Simulate network delay
    } catch (error) {
      console.error('Error processing mock message:', error);
    }
  }, []);

  useEffect(() => {
    // Simulate connection established after a short delay
    const timer = setTimeout(() => {
      setReadyState(WebSocket.OPEN);
      
      // Simulate periodic rooms update
      const intervalId = setInterval(() => {
        const mockRoomsUpdate = {
          type: 'ROOMS_UPDATE',
          rooms: [
            {
              id: 'room1',
              name: 'Pasta Lovers',
              status: 'waiting',
              players: [{ id: 'p1', name: 'Mario', score: 0 }],
              createdBy: 'p1',
            },
            {
              id: 'room2',
              name: 'Pizza Squad',
              status: 'in-progress',
              players: [
                { id: 'p2', name: 'Luigi', score: 3 },
                { id: 'p3', name: 'Peach', score: 2 },
              ],
              createdBy: 'p2',
            },
          ],
        };
        
        const mockEvent = new MessageEvent('message', {
          data: JSON.stringify(mockRoomsUpdate),
        });
        setLastMessage(mockEvent);
      }, 10000);

      mockSocketRef.current = intervalId;
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (mockSocketRef.current) {
        clearInterval(mockSocketRef.current);
      }
      setReadyState(WebSocket.CLOSED);
    };
  }, []);

  return {
    sendMessage,
    lastMessage,
    readyState,
  };
};
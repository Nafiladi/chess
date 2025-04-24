import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { MessageSquare, Send } from 'lucide-react';
import { ChatMessage } from '../../types/gameTypes';

interface ChatBoxProps {
  roomId: string;
  chat: ChatMessage[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ roomId, chat = [] }) => {
  const { currentPlayer, sendChatMessage } = useGame();
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !currentPlayer) return;
    
    sendChatMessage(message);
    setMessage('');
  };
  
  // Format timestamp to readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg flex flex-col h-64">
      <div className="bg-white bg-opacity-5 p-4 flex items-center">
        <MessageSquare className="h-5 w-5 text-yellow-300 mr-2" />
        <h2 className="text-lg font-bold text-yellow-100">Chat</h2>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {chat.length === 0 ? (
          <p className="text-center text-gray-400 italic text-sm">
            No messages yet. Say hello!
          </p>
        ) : (
          chat.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.playerId === currentPlayer?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-xs rounded-lg px-3 py-2 break-words
                  ${msg.playerId === currentPlayer?.id 
                    ? 'bg-yellow-500 bg-opacity-70 text-black rounded-tr-none' 
                    : 'bg-white bg-opacity-20 text-white rounded-tl-none'}
                `}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-medium ${msg.playerId === currentPlayer?.id ? 'text-yellow-900' : 'text-yellow-200'}`}>
                    {msg.playerId === currentPlayer?.id ? 'You' : msg.playerName}
                  </span>
                  <span className={`text-xs ${msg.playerId === currentPlayer?.id ? 'text-yellow-800' : 'text-gray-400'}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 bg-white bg-opacity-5 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full px-3 py-2 pr-10 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-300 text-white placeholder-gray-400 text-sm"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className={`
            absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full 
            ${message.trim() ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-gray-700 bg-opacity-50 text-gray-400 cursor-not-allowed'}
          `}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
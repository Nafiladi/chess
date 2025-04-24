import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (roomName: string) => void;
}

const CreateGameModal: React.FC<CreateGameModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setRoomName('');
      setError('');
    }
  }, [isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      setError('Please enter a room name');
      return;
    }
    
    onCreate(roomName);
  };
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div 
        ref={modalRef}
        className="bg-gradient-to-br from-green-900 to-red-900 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-yellow-100">Create New Game</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-300" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium text-yellow-100 mb-1">
              Room Name
            </label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 text-white placeholder-gray-300"
              placeholder="Enter a room name"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition-colors duration-200"
            >
              Create Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGameModal;
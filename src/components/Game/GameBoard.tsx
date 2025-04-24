import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Clock, Send, CheckCircle, XCircle } from 'lucide-react';
import { GameState } from '../../types/gameTypes';

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { currentPlayer, submitGuess } = useGame();
  const [guess, setGuess] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(gameState.timeRemaining);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<{message: string, type: 'success' | 'error' | 'neutral'} | null>(null);
  
  // Reset input when a new round starts
  useEffect(() => {
    setGuess('');
    setShowAnswer(false);
    
    // Set feedback based on last guess
    if (gameState.lastGuess) {
      if (gameState.lastGuess.isCorrect) {
        setFeedback({
          message: `Correct! "${gameState.lastGuess.guess}" was right!`,
          type: 'success'
        });
        setShowAnswer(true);
      } else {
        setFeedback({
          message: `Incorrect! Try again!`,
          type: 'error'
        });
      }
      
      // Clear feedback after 3 seconds
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.lastGuess, gameState.currentRound]);
  
  // Update timer
  useEffect(() => {
    setTimeRemaining(gameState.timeRemaining);
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState.timeRemaining]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guess.trim()) return;
    
    submitGuess(guess);
    setGuess('');
  };
  
  // Check if it's the current player's turn
  const isPlayerTurn = currentPlayer && currentPlayer.id === gameState.currentPlayer;
  
  // Get time display color based on remaining time
  const getTimeColor = () => {
    if (timeRemaining > 20) return 'text-green-400';
    if (timeRemaining > 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
      {/* Game info header */}
      <div className="bg-white bg-opacity-5 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-yellow-100">Round {gameState.currentRound} of {gameState.totalRounds}</h2>
        </div>
        <div className="flex items-center">
          <Clock className={`h-5 w-5 ${getTimeColor()} mr-2`} />
          <span className={`font-mono text-lg font-bold ${getTimeColor()}`}>
            {timeRemaining}s
          </span>
        </div>
      </div>
      
      {/* Image display */}
      <div className="p-4">
        <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
          <img 
            src={gameState.currentImage} 
            alt="Guess this phrase" 
            className="w-full h-full object-cover"
          />
          
          {/* Turn indicator overlay */}
          {!isPlayerTurn && gameState.status !== 'round_ended' && !showAnswer && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <p className="text-white text-xl font-bold">Waiting for opponent to guess...</p>
            </div>
          )}
          
          {/* Answer reveal overlay */}
          {showAnswer && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-400 mb-3" />
              <p className="text-white text-xl font-bold mb-1">Correct Answer:</p>
              <p className="text-yellow-300 text-2xl font-bold italic">"{gameState.correctAnswer}"</p>
            </div>
          )}
        </div>
        
        {/* Feedback message */}
        {feedback && (
          <div className={`
            mb-4 p-3 rounded-lg text-center font-medium
            ${feedback.type === 'success' ? 'bg-green-500 bg-opacity-30 text-green-100' : 
              feedback.type === 'error' ? 'bg-red-500 bg-opacity-30 text-red-100' : 
              'bg-blue-500 bg-opacity-30 text-blue-100'}
          `}>
            {feedback.message}
          </div>
        )}
        
        {/* Guess input form */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={!isPlayerTurn || gameState.status === 'round_ended' || showAnswer}
            placeholder={isPlayerTurn ? "Enter your guess..." : "Waiting for your turn..."}
            className="w-full px-4 py-3 pr-12 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!isPlayerTurn || gameState.status === 'round_ended' || !guess.trim() || showAnswer}
            className={`
              absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full 
              ${isPlayerTurn && guess.trim() && !showAnswer ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-gray-700 bg-opacity-50 text-gray-400 cursor-not-allowed'}
            `}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        {/* Game instruction */}
        <p className="mt-4 text-sm text-center text-gray-300 italic">
          {isPlayerTurn && !showAnswer ? 
            "Your turn! Guess the Italian brainrot phrase for this image." : 
            !isPlayerTurn && !showAnswer ? 
            "Wait for your opponent to make their guess." :
            "Get ready for the next round!"}
        </p>
      </div>
    </div>
  );
};

export default GameBoard;
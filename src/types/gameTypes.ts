export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: string;
}

export interface GameRoom {
  id: string;
  name: string;
  status: 'waiting' | 'in-progress' | 'full';
  players: Player[];
  createdBy: string;
  chat?: ChatMessage[];
}

export interface Guess {
  playerId: string;
  guess: string;
  isCorrect: boolean;
}

export interface GameState {
  currentRound: number;
  totalRounds: number;
  currentImage: string;
  correctAnswer: string;
  timeRemaining: number;
  status: 'waiting' | 'round_started' | 'correct_guess' | 'incorrect_guess' | 'round_ended' | 'game_ended';
  lastGuess?: Guess;
  currentPlayer: string;
}

export const brainrotImages = [
  {
    imageUrl: 'https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg',
    answer: 'tralalelo tralala'
  },
  {
    imageUrl: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg',
    answer: 'assassino cappuccino'
  },
  {
    imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    answer: 'mama mia pizzeria'
  },
  {
    imageUrl: 'https://images.pexels.com/photos/1547248/pexels-photo-1547248.jpeg',
    answer: 'gelato magnifico'
  },
  {
    imageUrl: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg',
    answer: 'parmigiano tarantino'
  }
];
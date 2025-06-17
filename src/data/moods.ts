
export interface Mood {
  id: string;
  name: string;
  pokemon: string;
  emoji: string;
  color: string;
  imageUrl: string;
}

export const moods: Mood[] = [
  { 
    id: '1', 
    name: 'Happy', 
    pokemon: 'Pikachu', 
    emoji: '😊', 
    color: '#FFD700',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
  },
  { 
    id: '2', 
    name: 'Excited', 
    pokemon: 'Eevee', 
    emoji: '🤩', 
    color: '#FF6B6B',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png'
  },
  { 
    id: '3', 
    name: 'Calm', 
    pokemon: 'Snorlax', 
    emoji: '😌', 
    color: '#4ECDC4',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png'
  },
  { 
    id: '4', 
    name: 'Confused', 
    pokemon: 'Psyduck', 
    emoji: '😵‍💫', 
    color: '#95A5A6',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png'
  },
  { 
    id: '5', 
    name: 'Fiery', 
    pokemon: 'Charmander', 
    emoji: '😠', 
    color: '#E74C3C',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
  },
  { 
    id: '6', 
    name: 'Anxious', 
    pokemon: 'Meowth', 
    emoji: '😰', 
    color: '#7B1FA2',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png'
  },
  { 
    id: '7', 
    name: 'Tired', 
    pokemon: 'Slowpoke', 
    emoji: '😴',
    color: '#9B59B6',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/79.png'
  },
  { 
    id: '8', 
    name: 'Energetic', 
    pokemon: 'Jolteon', 
    emoji: '⚡', 
    color: '#F39C12',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png'
  },
  { 
    id: '9', 
    name: 'Dreamy', 
    pokemon: 'Clefairy', 
    emoji: '🌙', 
    color: '#FF69B4',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png'
  }
];

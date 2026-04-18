export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl: string;
}

export type Point = { x: number; y: number };

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

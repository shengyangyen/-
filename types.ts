
export interface PageData {
  id: number;
  imageUrl?: string;
  isQuestion?: boolean;
  answer?: string;
  content?: string;
}

export enum GameStatus {
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  SUCCESS = 'SUCCESS'
}

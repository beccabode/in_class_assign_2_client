export interface Card {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  rank: "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";
  value: number;
}

export interface PlayRoundResponse {
  playerCard: Card;
  computerCard: Card;
  result: string;
  rounds: number;
  playerCount: number;
  computerCount: number;
}

export interface GameHistoryItem {
  id?: number | string;
  rounds: number;
  result: string;
  finishedAt: string;
}
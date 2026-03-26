export interface Card {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  rank: "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";
  value: number;
}

export interface GameState {
  id: string;
  round: number;
  playerCard: Card | null;
  computerCard: Card | null;
  playerStackCount: number;
  computerStackCount: number;
  roundWinner: "player" | "computer" | "tie" | null;
  status: "in_progress" | "finished";
  gameWinner: "player" | "computer" | null;
  warPileCount: number;
}

export interface GameHistoryItem {
  id: string;
  rounds: number;
  result: "win" | "loss";
  finishedAt: string;
}
import { useState } from "react";
import type { Card, GameHistoryItem, GameState } from "../types/game";

const suits = ["hearts", "diamonds", "clubs", "spades"] as const;

const ranks = [
  { rank: "2", value: 2 },
  { rank: "3", value: 3 },
  { rank: "4", value: 4 },
  { rank: "5", value: 5 },
  { rank: "6", value: 6 },
  { rank: "7", value: 7 },
  { rank: "8", value: 8 },
  { rank: "9", value: 9 },
  { rank: "10", value: 10 },
  { rank: "J", value: 11 },
  { rank: "Q", value: 12 },
  { rank: "K", value: 13 },
  { rank: "A", value: 14 },
] as const;

function drawWarCards(deck: Card[], pile: Card[]) {
  const updatedDeck = [...deck];
  const updatedPile = [...pile];

  if (updatedDeck.length > 0) {
    updatedPile.push(updatedDeck.shift()!);
  }

  if (updatedDeck.length > 0) {
    updatedPile.push(updatedDeck.shift()!);
  }

  return {
    updatedDeck,
    updatedPile,
  };
}

function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const r of ranks) {
      deck.push({
        suit,
        rank: r.rank,
        value: r.value,
      });
    }
  }

  return deck;
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffledDeck = [...deck];

  for (let i = shuffledDeck.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = shuffledDeck[i];
    shuffledDeck[i] = shuffledDeck[randomIndex];
    shuffledDeck[randomIndex] = temp;
  }

  return shuffledDeck;
}

function getSuitSymbol(suit: Card["suit"]) {
  switch (suit) {
    case "hearts":
      return "♥";
    case "diamonds":
      return "♦";
    case "clubs":
      return "♣";
    case "spades":
      return "♠";
  }
}

function getSuitColor(suit: Card["suit"]) {
  if (suit === "hearts" || suit === "diamonds") {
    return "red";
  }

  return "black";
}

function saveGameToHistory(gameResult: GameHistoryItem) {
  const existingHistory = localStorage.getItem("gameHistory");
  const parsedHistory: GameHistoryItem[] = existingHistory
    ? JSON.parse(existingHistory)
    : [];

  parsedHistory.unshift(gameResult);

  localStorage.setItem("gameHistory", JSON.stringify(parsedHistory));
}

function GamePage() {
  const [decks, setDecks] = useState(() => {
    const newDeck = shuffleDeck(createDeck());

    return {
      player: newDeck.slice(0, 26),
      computer: newDeck.slice(26),
    };
  });

  const playerDeck = decks.player;
  const computerDeck = decks.computer;

  const [game, setGame] = useState<GameState>({
    id: "game-1",
    round: 0,
    playerCard: null,
    computerCard: null,
    playerStackCount: 26,
    computerStackCount: 26,
    roundWinner: null,
    status: "in_progress",
    gameWinner: null,
    warPileCount: 0,
  });

  const playRound = () => {
  if (playerDeck.length === 0 || computerDeck.length === 0) {
    return;
  }

  let newPlayerDeck = [...playerDeck];
  let newComputerDeck = [...computerDeck];

  const warPile: Card[] = [];

  const firstPlayerCard = newPlayerDeck.shift()!;
  const firstComputerCard = newComputerDeck.shift()!;

  warPile.push(firstPlayerCard, firstComputerCard);

  let playerBattleCard = firstPlayerCard;
  let computerBattleCard = firstComputerCard;

  let roundWinner: "player" | "computer" | "tie" = "tie";

  while (roundWinner === "tie") {
    if (playerBattleCard.value > computerBattleCard.value) {
      roundWinner = "player";
      newPlayerDeck.push(...warPile);
    } else if (computerBattleCard.value > playerBattleCard.value) {
      roundWinner = "computer";
      newComputerDeck.push(...warPile);
    } else {
      if (newPlayerDeck.length < 2) {
        roundWinner = "computer";
        newComputerDeck.push(...warPile, ...newPlayerDeck);
        newPlayerDeck = [];
        break;
      }

      if (newComputerDeck.length < 2) {
        roundWinner = "player";
        newPlayerDeck.push(...warPile, ...newComputerDeck);
        newComputerDeck = [];
        break;
      }

      const playerWarResult = drawWarCards(newPlayerDeck, warPile);
      newPlayerDeck = playerWarResult.updatedDeck;

      const computerWarResult = drawWarCards(newComputerDeck, playerWarResult.updatedPile);
      newComputerDeck = computerWarResult.updatedDeck;

      const updatedPile = computerWarResult.updatedPile;

      playerBattleCard = updatedPile[updatedPile.length - 2];
      computerBattleCard = updatedPile[updatedPile.length - 1];

      warPile.length = 0;
      warPile.push(...updatedPile);
    }
  }

  let status: "in_progress" | "finished" = "in_progress";
  let gameWinner: "player" | "computer" | null = null;

  if (newPlayerDeck.length === 0) {
    status = "finished";
    gameWinner = "computer";
  } else if (newComputerDeck.length === 0) {
    status = "finished";
    gameWinner = "player";
  }

  if (status === "finished" && gameWinner) {
  saveGameToHistory({
    id: crypto.randomUUID(),
    rounds: game.round + 1,
    result: gameWinner === "player" ? "win" : "loss",
    finishedAt: new Date().toLocaleString(),
  });
}

  setDecks({
    player: newPlayerDeck,
    computer: newComputerDeck,
  });

  setGame({
    ...game,
    round: game.round + 1,
    playerCard: playerBattleCard,
    computerCard: computerBattleCard,
    roundWinner,
    playerStackCount: newPlayerDeck.length,
    computerStackCount: newComputerDeck.length,
    status,
    gameWinner,
    warPileCount: warPile.length,
  });
};

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <h1>War Card Game</h1>

      <h2>Round: {game.round}</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "2rem",
        }}
      >
        <div>
          <h3>You</h3>
          <p>Cards: {game.playerStackCount}</p>

          <div
            style={{
              border: "2px solid black",
              borderRadius: "8px",
              width: "120px",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
              fontWeight: "bold",
            }}
          >
            {game.playerCard ? (
              <div
                style={{
                  color: getSuitColor(game.playerCard.suit),
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  width: "100%",
                  padding: "6px",
                }}
              >
                <div style={{ alignSelf: "flex-start" }}>
                  {game.playerCard.rank}
                  {getSuitSymbol(game.playerCard.suit)}
                </div>

                <div style={{ alignSelf: "center", fontSize: "28px" }}>
                  {getSuitSymbol(game.playerCard.suit)}
                </div>

                <div style={{ alignSelf: "flex-end" }}>
                  {game.playerCard.rank}
                  {getSuitSymbol(game.playerCard.suit)}
                </div>
              </div>
            ) : (
              "No card"
            )}

          </div>
        </div>

        <div>
          <h3>Computer</h3>
          <p>Cards: {game.computerStackCount}</p>

          <div
            style={{
              border: "2px solid black",
              borderRadius: "8px",
              width: "120px",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
              fontWeight: "bold",
            }}
          >
            {game.computerCard ? (
              <div
                style={{
                  color: getSuitColor(game.computerCard.suit),
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  width: "100%",
                  padding: "6px",
                }}
              >
                <div style={{ alignSelf: "flex-start" }}>
                  {game.computerCard.rank}
                  {getSuitSymbol(game.computerCard.suit)}
                </div>

                <div style={{ alignSelf: "center", fontSize: "28px" }}>
                  {getSuitSymbol(game.computerCard.suit)}
                </div>

                <div style={{ alignSelf: "flex-end" }}>
                  {game.computerCard.rank}
                  {getSuitSymbol(game.computerCard.suit)}
                </div>
              </div>
            ) : (
              "No card"
            )}

          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {game.roundWinner === "player" && <h3>You win this round!</h3>}
        {game.roundWinner === "computer" && <h3>Computer wins this round!</h3>}
        {game.roundWinner === "tie" && <h3>WAR!</h3>}
        {game.roundWinner === null && <h3>Click below to start</h3>}

        {game.warPileCount > 2 && <p>Cards won this round: {game.warPileCount}</p>}
      </div>

      <div style={{ marginTop: "2rem" }}>
        {game.status === "in_progress" ? (
          <button
            onClick={playRound}
            style={{ padding: "1rem", fontSize: "16px" }}
          >
            Flip Card
          </button>
        ) : (
          <div>
            <h2>Game Over</h2>
            <h3>
              {game.gameWinner === "player"
                ? "🎉 You won the game!"
                : "💻 Computer wins the game!"}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default GamePage;
import { useEffect, useState } from "react";
import { sendRequest } from "../utils/api";
import type { PlayRoundResponse } from "../types/game";

function GamePage() {
  const [game, setGame] = useState<PlayRoundResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const userId = Number(localStorage.getItem("userId"));

  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  const formatCard = (card: number | { rank: string; suit: string } | null | undefined) => {
    if (card === null || card === undefined) return null;

    // If backend already sends object (future-proof)
    if (typeof card === "object") {
      return card;
    }

    // If backend sends number (YOUR CURRENT CASE)
    const suit = suits[Math.floor(card / 13)];
    const rank = ranks[card % 13];

    return { rank, suit };
  };

  useEffect(() => {
    const startGame = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response = await sendRequest("/games/start", "POST", {
          userId,
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Could not start game.");
          return;
        }

        setGame(data);
        setGameStarted(true);
      } catch {
        setError("Something went wrong while starting the game.");
      } finally {
        setLoading(false);
      }
    };

    void startGame();
  }, [userId]);

  const playRound = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await sendRequest("/games/play", "POST", {
        userId,
      });

      const data: PlayRoundResponse | { message: string } =
        await response.json();

      if (!response.ok) {
        if ("message" in data) {
          setError(data.message);
        } else {
          setError("Could not play round");
        }
        return;
      }

      setGame(data as PlayRoundResponse);
    } catch {
      setError("Something went wrong while playing the round.");
    } finally {
      setLoading(false);
    }
  };

  const playerCard = formatCard(game?.playerCard);
  const computerCard = formatCard(game?.computerCard);

  return (
    <div
      style={{
        padding: "1rem",
        textAlign: "center",
        background: "green",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1>War Card Game</h1>

      {error && <p style={{ color: "yellow" }}>{error}</p>}

      {!gameStarted && loading && <p>Starting game...</p>}

      {gameStarted && (
        <>
          <h2>Round: {game?.rounds ?? 0}</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "2rem",
            }}
          >
            <div>
              <h3>You</h3>
              <p>Cards: {game?.playerCount ?? 26}</p>

              <div
                style={{
                  border: "2px solid black",
                  borderRadius: "10px",
                  width: "120px",
                  height: "170px",
                  background: "white",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                {playerCard ? `${playerCard.rank} of ${playerCard.suit}` : "No card yet"}
              </div>
            </div>

            <div>
              <h3>Computer</h3>
              <p>Cards: {game?.computerCount ?? 26}</p>

              <div
                style={{
                  border: "2px solid black",
                  borderRadius: "10px",
                  width: "120px",
                  height: "170px",
                  background: "white",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                {computerCard ? `${computerCard.rank} of ${computerCard.suit}` : "No card yet"}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            {game?.result === "player" && <h3>You win this round!</h3>}
            {game?.result === "computer" && <h3>Computer wins this round!</h3>}
            {game?.result === "war-player" && (
              <h3>WAR! You won after 3 face-down and 1 face-up.</h3>
            )}
            {game?.result === "war-computer" && (
              <h3>WAR! Computer won after 3 face-down and 1 face-up.</h3>
            )}
            {!game && <h3>Click below to start playing</h3>}

            {game?.gameOver && game.winner === "player" && (
              <h2>🎉 You collected all cards and won the game!</h2>
            )}

            {game?.gameOver && game.winner === "computer" && (
              <h2>💻 The computer collected all cards and won the game.</h2>
            )}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <button
            onClick={() => void playRound()}
            disabled={loading || game?.gameOver}
            style={{ padding: "1rem", fontSize: "16px" }}
          >
            {loading ? "Playing..." : game?.gameOver ? "Game Over" : "Flip Card"}
          </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GamePage;
import { useEffect, useState } from "react";
import { sendRequest } from "../utils/api";
import type { PlayRoundResponse } from "../types/game";

function GamePage() {
  const [game, setGame] = useState<PlayRoundResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const startGame = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response = await sendRequest("/games/start", "POST");
        const data: { message: string } = await response.json();

        if (!response.ok) {
          setError(data.message || "Could not start game.");
          return;
        }

        setGameStarted(true);
      } catch {
        setError("Something went wrong while starting the game.");
      } finally {
        setLoading(false);
      }
    };

    void startGame();
  }, []);

  const playRound = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await sendRequest("/games/play", "POST");
      const data: PlayRoundResponse | { message: string } = await response.json();

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
                {game?.playerCard
                  ? `${game.playerCard.rank} of ${game.playerCard.suit}`
                  : "No card yet"}
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
                {game?.computerCard
                  ? `${game.computerCard.rank} of ${game.computerCard.suit}`
                  : "No card yet"}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            {game?.result === "player" && <h3>You win this round!</h3>}
            {game?.result === "computer" && <h3>Computer wins this round!</h3>}
            {game?.result === "tie" && <h3>WAR!</h3>}
            {!game && <h3>Click below to start playing</h3>}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <button
              onClick={() => void playRound()}
              disabled={loading}
              style={{ padding: "1rem", fontSize: "16px" }}
            >
              {loading ? "Playing..." : "Flip Card"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GamePage;
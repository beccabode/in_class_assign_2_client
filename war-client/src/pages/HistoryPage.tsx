import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { sendRequest } from "../utils/api";
import type { GameHistoryItem } from "../types/game";

function HistoryPage() {
  const { userId } = useAuth();
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async (): Promise<void> => {
      if (!userId) {
        return;
      }

      try {
        const response = await sendRequest(`/games/${userId}`, "GET");
        const data: GameHistoryItem[] | { message: string } = await response.json();

        if (!response.ok) {
          setError("message" in data ? data.message : "Could not load history.");
          return;
        }

        setHistory(data as GameHistoryItem[]);
      } catch {
        setError("Something went wrong while loading history.");
      }
    };

    void fetchHistory();
  }, [userId]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Game History</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {history.length === 0 ? (
        <p>No finished games yet.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Date Finished</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Result</th>
              <th style={{ border: "1px solid black", padding: "0.5rem" }}>Rounds</th>
            </tr>
          </thead>
          <tbody>
            {history.map((game, index) => (
              <tr key={game.id ?? index}>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{game.finishedAt}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{game.result}</td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>{game.rounds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HistoryPage;
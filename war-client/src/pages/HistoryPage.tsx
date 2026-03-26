import { useState } from "react";
import type { GameHistoryItem } from "../types/game";

function HistoryPage() {
  const [history] = useState<GameHistoryItem[]>(() => {
    const savedHistory = localStorage.getItem("gameHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Game History</h1>

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
            {history.map((game) => (
              <tr key={game.id}>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>
                  {game.finishedAt}
                </td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>
                  {game.result}
                </td>
                <td style={{ border: "1px solid black", padding: "0.5rem" }}>
                  {game.rounds}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HistoryPage;
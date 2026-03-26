import type { GameHistoryItem } from "../types/game";

function HistoryPage() {
  const mockHistory: GameHistoryItem[] = [
    {
      id: "1",
      rounds: 42,
      result: "win",
      finishedAt: "2026-03-24 3:00 PM",
    },
    {
      id: "2",
      rounds: 35,
      result: "loss",
      finishedAt: "2026-03-23 4:15 PM",
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Game History</h1>

      <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "0.5rem" }}>Date Finished</th>
            <th style={{ border: "1px solid black", padding: "0.5rem" }}>Result</th>
            <th style={{ border: "1px solid black", padding: "0.5rem" }}>Rounds</th>
          </tr>
        </thead>
        <tbody>
          {mockHistory.map((game) => (
            <tr key={game.id}>
              <td style={{ border: "1px solid black", padding: "0.5rem" }}>{game.finishedAt}</td>
              <td style={{ border: "1px solid black", padding: "0.5rem" }}>{game.result}</td>
              <td style={{ border: "1px solid black", padding: "0.5rem" }}>{game.rounds}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryPage;
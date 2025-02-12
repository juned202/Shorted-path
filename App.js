import React, { useState } from "react";

const size = 20;

const Grid = () => {
  const [selected, setSelected] = useState([]);
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async (row, col) => {
    if (selected.length < 2) {
      const newSelection = [...selected, { row, col }];
      setSelected(newSelection);

      if (newSelection.length === 2) {
        await fetchPath(newSelection);
      }
    }
  };

  const fetchPath = async (cells) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: cells[0], end: cells[1] }),
      });

      if (!response.ok) throw new Error("Failed to fetch path!");

      const data = await response.json();
      setPath(data.path || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "radial-gradient(circle, #111, #000)",
        color: "#0ff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textShadow: "0 0 10px cyan",
          letterSpacing: "2px",
          fontSize: "24px",
          marginBottom: "10px",
        }}
      >
        Shortest-Path Finder
      </h2>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 25px)`,
          gap: "2px",
          padding: "20px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)",
        }}
      >
        {[...Array(size)].map((_, row) =>
          [...Array(size)].map((_, col) => {
            const isSelected = selected.some(
              (cell) => cell.row === row && cell.col === col
            );
            const isPath = path.some(
              (cell) => cell.row === row && cell.col === col
            );

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => handleClick(row, col)}
                style={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "5px",
                  border: "1px solid rgba(0, 255, 255, 0.2)",
                  background: isSelected
                    ? "rgba(255, 0, 0, 0.8)"
                    : isPath
                    ? "rgba(0, 255, 255, 0.8)"
                    : "rgba(0, 0, 0, 0.6)",
                  boxShadow: isSelected
                    ? "0 0 10px red"
                    : isPath
                    ? "0 0 10px cyan"
                    : "none",
                  cursor: "pointer",
                  transition: "0.2s ease-in-out",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              ></div>
            );
          })
        )}
      </div>

      {/* Controls */}
      <div style={{ marginTop: "20px" }}>
      <button
  onClick={() => {
    setSelected([]);
    setPath([]);
  }}
  style={{
    padding: "10px 20px",
    background: "rgba(255, 255, 255, 0.1)",
    color: "white",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
    transition: "0.3s ease-in-out",
  }}
  onMouseOver={(e) => (e.target.style.background = "rgba(0, 255, 255, 0.5)")}
  onMouseOut={(e) => (e.target.style.background = "rgba(2, 0, 3, 0.8)")}
  onMouseDown={(e) => (e.target.style.background = "cyan")}
  onMouseUp={(e) => (e.target.style.background = "rgba(0, 255, 255, 0.5)")}
>
  Reset
</button>

      </div>
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
      )}
    </div>
  );
};

export default Grid;

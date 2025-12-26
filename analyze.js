const { Chess } = require("chess.js");
const Stockfish = require("stockfish");

module.exports = function analyzeGame(pgn) {
  return new Promise((resolve) => {
    const chess = new Chess();
    chess.loadPgn(pgn);

    const engine = Stockfish();
    const moves = chess.history();
    let evaluations = [];
    let index = 0;

    engine.postMessage("uci");

    engine.onmessage = (event) => {
      if (event.includes("score cp")) {
        const match = event.match(/score cp (-?\d+)/);
        if (match) {
          evaluations.push({
            move: index + 1,
            eval: parseInt(match[1])
          });
        }
        index++;

        if (index < moves.length) {
          chess.move(moves[index]);
          engine.postMessage("position fen " + chess.fen());
          engine.postMessage("go depth 10");
        } else {
          engine.postMessage("quit");
          resolve({
            moves,
            evaluations,
            accuracy: calculateAccuracy(evaluations)
          });
        }
      }
    };

    chess.reset();
    engine.postMessage("position fen " + chess.fen());
    engine.postMessage("go depth 10");
  });
};

function calculateAccuracy(evals) {
  if (evals.length === 0) return 0;
  const loss = evals.reduce((a, b) => a + Math.abs(b.eval), 0);
  return Math.max(0, 100 - loss / evals.length / 10).toFixed(2);
}

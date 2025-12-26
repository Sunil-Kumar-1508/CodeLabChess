async function analyze() {
  const pgn = document.getElementById("pgn").value;

  const res = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pgn })
  });

  const data = await res.json();

  document.getElementById("result").innerText =
    "Accuracy: " + data.accuracy + "%\n\n" +
    JSON.stringify(data.evaluations, null, 2);
}

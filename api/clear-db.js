const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "data.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("🗑  Limpando tabelas...");

  db.run("DELETE FROM movimentacoes", (err) => {
    if (err) console.error("Erro ao limpar movimentacoes:", err.message);
    else console.log("✔ movimentacoes apagadas");
  });

  db.run("DELETE FROM devolucoes", (err) => {
    if (err) console.error("Erro ao limpar devolucoes:", err.message);
    else console.log("✔ devolucoes apagadas");
  });

  // Resetar IDs
  db.run("DELETE FROM sqlite_sequence WHERE name IN ('movimentacoes', 'devolucoes')", (err) => {
    if (err) console.error("Erro ao resetar IDs:", err.message);
    else console.log("✔ IDs resetados");
  });
});

db.close(() => {
  console.log("✅ Banco de dados limpo com sucesso!");
});

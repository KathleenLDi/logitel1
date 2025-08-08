// api/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// garante pasta uploads
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer p/ upload de NF/imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage });

/* ========== MOVIMENTAÇÕES ========== */

// Listar tudo
app.get("/movimentacoes", (req, res) => {
  const rows = db.prepare("SELECT * FROM movimentacoes ORDER BY datetime(dataHora) DESC").all();
  res.json(rows);
});

// Criar (Entrada/Saída/Evento) – com upload opcional de NF
app.post("/movimentacoes", upload.single("notaFiscalFile"), (req, res) => {
  const {
    tipo, equipamento, localizacao, responsavel,
    motivo, notaFiscal, observacao, dataHora
  } = req.body;

  const notaFiscalUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.notaFiscalUrl || null);

  const stmt = db.prepare(`
    INSERT INTO movimentacoes
    (tipo, equipamento, localizacao, responsavel, motivo, notaFiscal, notaFiscalUrl, observacao, dataHora, devolvido)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `);

  const info = stmt.run(
    tipo, equipamento, localizacao, responsavel,
    motivo || null, notaFiscal || null, notaFiscalUrl, observacao || null,
    dataHora || new Date().toISOString()
  );

  const novo = db.prepare("SELECT * FROM movimentacoes WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(novo);
});

// Atualizar devolução (só marca devolvido = 1) – versão simples
app.put("/movimentacoes/:id/devolver", (req, res) => {
  const { id } = req.params;
  db.prepare("UPDATE movimentacoes SET devolvido = 1 WHERE id = ?").run(id);
  const mov = db.prepare("SELECT * FROM movimentacoes WHERE id = ?").get(id);
  res.json(mov);
});

/* ========== DEVOLUÇÕES (modal com dados) ========== */

// Registrar devolução com dados + imagem
app.post("/devolucoes", upload.single("imagem"), (req, res) => {
  const { movimentacaoId, responsavel, observacao, dataHora } = req.body;
  const imagemUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const insert = db.prepare(`
    INSERT INTO devolucoes (movimentacaoId, responsavel, dataHora, observacao, imagemUrl)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    movimentacaoId,
    responsavel,
    dataHora || new Date().toISOString(),
    observacao,
    imagemUrl
  );

  // marca a movimentação como devolvida
  db.prepare("UPDATE movimentacoes SET devolvido = 1 WHERE id = ?").run(movimentacaoId);

  const devolucao = db.prepare("SELECT * FROM devolucoes WHERE id = ?").get(insert.lastInsertRowid);
  res.status(201).json(devolucao);
});

// Listar devoluções por movimentação (se quiser exibir depois)
app.get("/movimentacoes/:id/devolucoes", (req, res) => {
  const { id } = req.params;
  const rows = db.prepare("SELECT * FROM devolucoes WHERE movimentacaoId = ? ORDER BY datetime(dataHora) DESC").all(id);
  res.json(rows);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API online em http://localhost:${PORT}`);
});

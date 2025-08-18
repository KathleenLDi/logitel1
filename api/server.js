// api/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("./db");

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
app.get("/movimentacoes", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM movimentacoes ORDER BY dataHora DESC"
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao listar movimentações" });
  }
});

// Criar (Entrada/Saída/Evento) – com upload opcional de NF
app.post("/movimentacoes", upload.single("notaFiscalFile"), async (req, res) => {
  const {
    tipo, equipamento, localizacao, responsavel,
    motivo, notaFiscal, observacao, dataHora
  } = req.body;

  const notaFiscalUrl = req.file
    ? `/uploads/${req.file.filename}`
    : (req.body.notaFiscalUrl || null);

  try {
    const [result] = await pool.query(
      `INSERT INTO movimentacoes
        (tipo, equipamento, localizacao, responsavel, motivo, notaFiscal, notaFiscalUrl, observacao, dataHora, devolvido)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        tipo,
        equipamento,
        localizacao,
        responsavel,
        motivo || null,
        notaFiscal || null,
        notaFiscalUrl,
        observacao || null,
        dataHora ? new Date(dataHora) : new Date()
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM movimentacoes WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao criar movimentação" });
  }
});

// Atualizar devolução (marca devolvido = 1)
app.put("/movimentacoes/:id/devolver", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE movimentacoes SET devolvido = 1 WHERE id = ?", [id]);
    const [rows] = await pool.query("SELECT * FROM movimentacoes WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao marcar devolução" });
  }
});

/* ========== DEVOLUÇÕES ========== */

// Registrar devolução com dados + imagem
app.post("/devolucoes", upload.single("imagem"), async (req, res) => {
  const { movimentacaoId, responsavel, observacao, dataHora } = req.body;
  const imagemUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [insert] = await conn.query(
      `INSERT INTO devolucoes
        (movimentacaoId, responsavel, dataHora, observacao, imagemUrl)
       VALUES (?, ?, ?, ?, ?)`,
      [
        movimentacaoId,
        responsavel,
        dataHora ? new Date(dataHora) : new Date(),
        observacao || null,
        imagemUrl
      ]
    );

    await conn.query("UPDATE movimentacoes SET devolvido = 1 WHERE id = ?", [movimentacaoId]);

    await conn.commit();

    const [rows] = await pool.query("SELECT * FROM devolucoes WHERE id = ?", [insert.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(500).json({ error: "Erro ao registrar devolução" });
  } finally {
    conn.release();
  }
});

// Listar devoluções por movimentação
app.get("/movimentacoes/:id/devolucoes", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM devolucoes WHERE movimentacaoId = ? ORDER BY dataHora DESC",
      [id]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao listar devoluções" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API online em http://localhost:${PORT}`);
});

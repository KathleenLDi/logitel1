// api/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const app = express();

// middlewares
app.use(cors());
app.use(express.json({ limit: "15mb" })); // aceita base64 grande
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// garante pasta de uploads
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// multer para upload via form-data
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "") || ".bin";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage });

/** Converte dataURI base64 para arquivo em /uploads e retorna a URL pública */
function saveDataUriToFile(dataUri) {
  try {
    const m = /^data:([^;]+);base64,(.+)$/i.exec(dataUri || "");
    if (!m) return null;

    const mime = m[1].toLowerCase();
    const buf = Buffer.from(m[2], "base64");

    let ext = ".bin";
    if (mime.includes("pdf")) ext = ".pdf";
    else if (mime.includes("png")) ext = ".png";
    else if (mime.includes("jpeg") || mime.includes("jpg")) ext = ".jpg";

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), buf);
    return `/uploads/${filename}`;
  } catch (e) {
    console.error("saveDataUriToFile erro:", e);
    return null;
  }
}

/* ===================== MOVIMENTAÇÕES ===================== */

// Listar
app.get("/movimentacoes", (req, res) => {
  try {
    const rows = db
      .prepare("SELECT * FROM movimentacoes ORDER BY datetime(dataHora) DESC")
      .all();
    res.json(rows);
  } catch (err) {
    console.error("GET /movimentacoes:", err);
    res.status(500).json({ error: "Erro ao listar movimentações" });
  }
});

// Criar (Entrada/Saída/Evento)
app.post("/movimentacoes", upload.single("notaFiscalFile"), (req, res) => {
  try {
    const {
      tipo,
      equipamento,
      localizacao,
      responsavel,
      motivo,
      notaFiscal,
      observacao,
      dataHora,
      notaFiscalUrl: notaFiscalUrlBody,
    } = req.body;

    // validações básicas (evita 500 silencioso)
    const faltando = [];
    if (!tipo) faltando.push("tipo");
    if (!equipamento) faltando.push("equipamento");
    if (!localizacao) faltando.push("localizacao");
    if (!responsavel) faltando.push("responsavel");
    if (faltando.length) {
      return res
        .status(400)
        .json({ error: `Campos obrigatórios faltando: ${faltando.join(", ")}` });
    }

    // origem da NF: upload (file) OU base64 dataURI (notaFiscalUrl) OU link simples
    let notaFiscalUrl = null;
    if (req.file) {
      notaFiscalUrl = `/uploads/${req.file.filename}`;
    } else if (notaFiscalUrlBody) {
      if (String(notaFiscalUrlBody).startsWith("data:")) {
        const saved = saveDataUriToFile(notaFiscalUrlBody);
        if (saved) notaFiscalUrl = saved;
      } else {
        notaFiscalUrl = notaFiscalUrlBody; // já é um link pronto
      }
    }

    const stmt = db.prepare(`
      INSERT INTO movimentacoes
      (tipo, equipamento, localizacao, responsavel, motivo, notaFiscal, notaFiscalUrl, observacao, dataHora, devolvido)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    const info = stmt.run(
      tipo,
      equipamento,
      localizacao,
      responsavel,
      motivo || null,
      notaFiscal || null,
      notaFiscalUrl || null,
      observacao || null,
      dataHora || new Date().toISOString()
    );

    const novo = db.prepare("SELECT * FROM movimentacoes WHERE id = ?").get(info.lastInsertRowid);
    res.status(201).json(novo);
  } catch (err) {
    console.error("POST /movimentacoes:", err);
    res.status(500).json({ error: "Erro ao criar movimentação" });
  }
});

// Devolver (simples)
app.put("/movimentacoes/:id/devolver", (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("UPDATE movimentacoes SET devolvido = 1 WHERE id = ?").run(id);
    const mov = db.prepare("SELECT * FROM movimentacoes WHERE id = ?").get(id);
    res.json(mov);
  } catch (err) {
    console.error("PUT /movimentacoes/:id/devolver:", err);
    res.status(500).json({ error: "Erro ao marcar devolução" });
  }
});

/* ===================== DEVOLUÇÕES (opcional) ===================== */

app.post("/devolucoes", upload.single("imagem"), (req, res) => {
  try {
    const { movimentacaoId, responsavel, observacao, dataHora, imagemBase64 } = req.body;

    let imagemUrl = null;
    if (req.file) {
      imagemUrl = `/uploads/${req.file.filename}`;
    } else if (imagemBase64 && imagemBase64.startsWith("data:")) {
      const saved = saveDataUriToFile(imagemBase64);
      if (saved) imagemUrl = saved;
    }

    const insert = db
      .prepare(
        `INSERT INTO devolucoes (movimentacaoId, responsavel, dataHora, observacao, imagemUrl)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(
        movimentacaoId,
        responsavel,
        dataHora || new Date().toISOString(),
        observacao || null,
        imagemUrl
      );

    db.prepare("UPDATE movimentacoes SET devolvido = 1 WHERE id = ?").run(movimentacaoId);

    const devolucao = db.prepare("SELECT * FROM devolucoes WHERE id = ?").get(insert.lastInsertRowid);
    res.status(201).json(devolucao);
  } catch (err) {
    console.error("POST /devolucoes:", err);
    res.status(500).json({ error: "Erro ao registrar devolução" });
  }
});

app.get("/movimentacoes/:id/devolucoes", (req, res) => {
  try {
    const { id } = req.params;
    const rows = db
      .prepare("SELECT * FROM devolucoes WHERE movimentacaoId = ? ORDER BY datetime(dataHora) DESC")
      .all(id);
    res.json(rows);
  } catch (err) {
    console.error("GET /movimentacoes/:id/devolucoes:", err);
    res.status(500).json({ error: "Erro ao listar devoluções" });
  }
});

// fallback de erro
app.use((err, req, res, next) => {
  console.error("Middleware erro:", err);
  res.status(500).json({ error: err.message || "Erro interno" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API online em http://localhost:${PORT}`);
});
// Listar TODAS as devoluções (com dados da movimentação associada)
app.get("/devolucoes", (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT
        d.id,
        d.movimentacaoId,
        d.responsavel,
        d.dataHora,
        d.observacao,
        d.imagemUrl,
        m.equipamento,
        m.localizacao,
        m.responsavel AS respMov,
        m.tipo AS tipoMov
      FROM devolucoes d
      LEFT JOIN movimentacoes m ON m.id = d.movimentacaoId
      ORDER BY datetime(d.dataHora) DESC
    `
    )
    .all();

  res.json(rows);
});

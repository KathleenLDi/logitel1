// api/db.js
const Database = require("better-sqlite3");

const db = new Database("./data.db");

// Tabelas: movimentacoes e devolucoes
db.exec(`
CREATE TABLE IF NOT EXISTS movimentacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL,                 -- 'Entrada' | 'Saída' | 'Evento'
  equipamento TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  motivo TEXT,                        -- motivo ou tipo de evento
  notaFiscal TEXT,                    -- número NF
  notaFiscalUrl TEXT,                 -- caminho do arquivo
  observacao TEXT,
  dataHora TEXT NOT NULL,             -- ISO string
  devolvido INTEGER DEFAULT 0         -- 0/1
);

CREATE TABLE IF NOT EXISTS devolucoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movimentacaoId INTEGER NOT NULL,
  responsavel TEXT NOT NULL,
  dataHora TEXT NOT NULL,
  observacao TEXT NOT NULL,
  imagemUrl TEXT,                     -- caminho da imagem/comprovante
  FOREIGN KEY(movimentacaoId) REFERENCES movimentacoes(id)
);
`);

module.exports = db;

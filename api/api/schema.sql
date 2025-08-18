-- api/schema.sql
CREATE DATABASE IF NOT EXISTS logitel
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE logitel;

CREATE TABLE IF NOT EXISTS movimentacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL,               -- 'Entrada' | 'Saída' | 'Evento'
  equipamento VARCHAR(255) NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  responsavel VARCHAR(255) NOT NULL,
  motivo VARCHAR(255),
  notaFiscal VARCHAR(255),
  notaFiscalUrl VARCHAR(512),
  observacao TEXT,
  dataHora DATETIME NOT NULL,
  devolvido TINYINT(1) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS devolucoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movimentacaoId INT NOT NULL,
  responsavel VARCHAR(255) NOT NULL,
  dataHora DATETIME NOT NULL,
  observacao TEXT,
  imagemUrl VARCHAR(512),
  CONSTRAINT fk_devolucao_mov
    FOREIGN KEY (movimentacaoId)
    REFERENCES movimentacoes(id)
    ON DELETE CASCADE
);

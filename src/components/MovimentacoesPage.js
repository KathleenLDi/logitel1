// MovimentacoesPage.js
import React, { useState } from "react";
import ListaMovimentacoes from "./ListaMovimentacoes";

export default function MovimentacoesPage({ tipo, movimentacoes, onRegistrar, onVoltar }) {
  const [busca, setBusca] = useState("");
  const filtradas = movimentacoes
    .filter(m => m.tipo === tipo)
    .filter(item =>
      item.equipamento.toLowerCase().includes(busca.toLowerCase())
    );

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="mb-4 fw-bold">
        {tipo === "Entrada" ? "Entradas" : tipo === "Saída" ? "Saídas" : "Eventos"}
      </h2>
      <button className={`btn ${tipo === "Evento" ? "btn-warning text-dark" : "btn-primary"} mb-3`} onClick={onRegistrar}>
        <i className="bi bi-plus-circle me-2"></i>Registrar {tipo}
      </button>
      <div className="mb-4" style={{ maxWidth: 400 }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder={`Buscar ${tipo.toLowerCase()} por equipamento`}
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <span className="input-group-text"><i className="bi bi-search"></i></span>
        </div>
      </div>
      <ListaMovimentacoes movimentacoes={filtradas} />
      <button className="btn btn-outline-secondary mt-3" onClick={onVoltar}>
        <i className="bi bi-arrow-left"></i> Voltar
      </button>
    </div>
  );
}

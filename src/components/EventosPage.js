// EventosPage.js
import React, { useState } from "react";
import ListaMovimentacoes from "./ListaMovimentacoes";

export default function EventosPage({ movimentacoes, onRegistrar, onDevolver, onVoltar }) {
  const [busca, setBusca] = useState("");
  const filtradas = movimentacoes
    .filter(m => m.tipo === "Evento")
    .filter(item =>
      item.equipamento.toLowerCase().includes(busca.toLowerCase())
    );

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="mb-4 fw-bold">Eventos</h2>
      <button className="btn btn-warning text-dark mb-3" onClick={onRegistrar}>
        <i className="bi bi-plus-circle me-2"></i>Registrar Evento
      </button>
      <div className="mb-4" style={{ maxWidth: 400 }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar equipamento em evento"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <span className="input-group-text"><i className="bi bi-search"></i></span>
        </div>
      </div>
      <ListaMovimentacoes movimentacoes={filtradas} onDevolver={onDevolver} />
      <button className="btn btn-outline-secondary mt-3" onClick={onVoltar}>
        <i className="bi bi-arrow-left"></i> Voltar
      </button>
    </div>
  );
}


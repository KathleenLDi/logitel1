// ConsultarPage.js
import React, { useState } from "react";
import ListaMovimentacoes from "./ListaMovimentacoes";

export default function ConsultarPage({ movimentacoes }) {
  const [busca, setBusca] = useState("");

  const filtradas = movimentacoes.filter(item => {
    const texto = `${item.tipo} ${item.equipamento} ${item.responsavel}`.toLowerCase();
    return texto.includes(busca.toLowerCase());
  });

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="mb-4 fw-bold">Consultar Registros</h2>
      <div className="mb-4" style={{ maxWidth: 500 }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por tipo, equipamento ou responsável"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <span className="input-group-text"><i className="bi bi-search"></i></span>
        </div>
      </div>
      <ListaMovimentacoes movimentacoes={filtradas} />
    </div>
  );
}


// src/components/EventosPage.js
import React, { useMemo, useState } from "react";
import ListaMovimentacoes from "./ListaMovimentacoes";

export default function EventosPage({
  movimentacoes = [],            // <-- valor padrão evita undefined
  onRegistrar,
  onDevolver,
  onConsultarDevolucoes,         // opcional
  onVoltar,
}) {
  const [busca, setBusca] = useState("");

  const eventos = useMemo(
    () => (Array.isArray(movimentacoes) ? movimentacoes : []).filter(m => m?.tipo === "Evento"),
    [movimentacoes]
  );

  const filtradas = useMemo(() => {
    const termo = busca.toLowerCase();
    return eventos.filter(it => (it?.equipamento || "").toLowerCase().includes(termo));
  }, [eventos, busca]);

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="mb-4 fw-bold">Eventos</h2>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <button className="btn btn-warning text-dark" onClick={onRegistrar}>
          <i className="bi bi-plus-circle me-2"></i>Registrar Evento
        </button>

        {onConsultarDevolucoes && (
          <button className="btn btn-outline-secondary" onClick={onConsultarDevolucoes}>
            <i className="bi bi-eye me-2"></i>Consultar Devoluções
          </button>
        )}

        <button className="btn btn-outline-secondary ms-auto" onClick={onVoltar}>
          <i className="bi bi-arrow-left"></i> Voltar
        </button>
      </div>

      <div className="mb-4" style={{ maxWidth: 400 }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar equipamento em evento"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <span className="input-group-text"><i className="bi bi-search"></i></span>
        </div>
      </div>

      <ListaMovimentacoes movimentacoes={filtradas} onDevolver={onDevolver} />
    </div>
  );
}

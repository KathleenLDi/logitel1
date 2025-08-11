// src/components/EventosPage.js
import React, { useMemo, useState } from "react";
import ListaMovimentacoes from "./ListaMovimentacoes";

export default function EventosPage({
  movimentacoes = [],
  onRegistrar,
  onDevolver,
  onConsultarDevolucoes, // recebe item
  onVoltar,
}) {
  const [busca, setBusca] = useState("");
  const [eventoId, setEventoId] = useState("");

  const eventos = useMemo(
    () => (Array.isArray(movimentacoes) ? movimentacoes : []).filter((m) => m?.tipo === "Evento"),
    [movimentacoes]
  );

  const filtradas = useMemo(() => {
    const termo = busca.toLowerCase();
    return eventos.filter((it) => (it?.equipamento || "").toLowerCase().includes(termo));
  }, [eventos, busca]);

  const eventoSelecionado = useMemo(
    () => eventos.find((e) => String(e.id) === String(eventoId)) || null,
    [eventos, eventoId]
  );

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="mb-4 fw-bold">Eventos</h2>

      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <button className="btn btn-warning text-dark fw-bold" onClick={onRegistrar}>
          <i className="bi bi-plus-circle me-2" /> Registrar Evento
        </button>

        {/* seletor do evento para consulta */}
        <div className="d-flex align-items-center gap-2">
          <label className="form-label m-0">Consultar devoluções:</label>
          <select
            className="form-select"
            style={{ width: 260 }}
            value={eventoId}
            onChange={(e) => setEventoId(e.target.value)}
          >
            <option value="">Selecione um evento</option>
            {eventos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.equipamento} — {new Date(e.dataHora).toLocaleString()}
              </option>
            ))}
          </select>
          <button
            className="btn btn-outline-secondary fw-bold"
            disabled={!eventoSelecionado}
            onClick={() => onConsultarDevolucoes && onConsultarDevolucoes(eventoSelecionado)}
          >
            <i className="bi bi-eye me-2" />
            Consultar Devoluções
          </button>
        </div>

        <button className="btn btn-outline-secondary fw-bold ms-auto" onClick={onVoltar}>
          <i className="bi bi-arrow-left me-2" /> Voltar
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
          <span className="input-group-text">
            <i className="bi bi-search" />
          </span>
        </div>
      </div>

      <ListaMovimentacoes movimentacoes={filtradas} onDevolver={onDevolver} />
    </div>
  );
}

// src/components/Home.js
import React, { useMemo, useState } from "react";
import ListaMovimentacoes from "./ListaMovimentacoes";

export default function Home({
  movimentacoes = [],
  onNovaEntrada,
  onNovaSaida,
  onNovoEvento,
}) {
  const [busca, setBusca] = useState("");

  // Totais por tipo
  const { entradasCount, saidasCount, eventosCount } = useMemo(() => {
    let e = 0,
      s = 0,
      ev = 0;
    for (const m of movimentacoes) {
      if (m?.tipo === "Entrada") e++;
      else if (m?.tipo === "Saída") s++;
      else if (m?.tipo === "Evento") ev++;
    }
    return { entradasCount: e, saidasCount: s, eventosCount: ev };
  }, [movimentacoes]);

  // Filtro de busca
  const filtradas = useMemo(() => {
    const t = (busca || "").toLowerCase().trim();
    if (!t) return movimentacoes;
    return movimentacoes.filter((m) => {
      const blob = [
        m?.tipo,
        m?.equipamento,
        m?.localizacao,
        m?.responsavel,
        m?.motivo,
        m?.observacao,
        m?.dataHora,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(t);
    });
  }, [movimentacoes, busca]);

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="fw-bold mb-4">Controle Logístico</h2>

      {/* Cards de totais */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="fw-bold text-muted mb-2">Entradas</div>
              <div className="display-6 fw-bold text-primary">{entradasCount}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="fw-bold text-muted mb-2">Saídas</div>
              <div className="display-6 fw-bold text-success">{saidasCount}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="fw-bold text-muted mb-2">Eventos</div>
              <div className="display-6 fw-bold text-warning">{eventosCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Linha de ações (botões grandes) */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <button
            className="btn btn-primary w-100 py-2 fw-semibold"
            onClick={onNovaEntrada}
          >
            Nova Entrada
          </button>
        </div>
        <div className="col-12 col-md-4">
          <button
            className="btn btn-outline-primary w-100 py-2 fw-semibold"
            onClick={onNovaSaida}
          >
            Nova Saída
          </button>
        </div>
        <div className="col-12 col-md-4">
          <button
            className="btn btn-warning w-100 py-2 fw-semibold"
            onClick={onNovoEvento}
          >
            Novo Evento
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="mb-3">
        <div className="input-group">
          <input
            className="form-control"
            placeholder="Buscar por tipo, equipamento ou responsável"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <span className="input-group-text">
            <i className="bi bi-search" />
          </span>
        </div>
      </div>

      {/* Tabela */}
      <ListaMovimentacoes movimentacoes={filtradas} />
    </div>
  );
}

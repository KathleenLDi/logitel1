import React, { useState } from "react";
import ListaMovimentacoes from "./ListaMovimentacoes";
import ModalDevolucao from "./ModalDevolucao";

export default function EventosPage({ movimentacoes, onRegistrar, onDevolver, onVoltar }) {
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const filtradas = movimentacoes
    .filter((m) => m.tipo === "Evento")
    .filter((item) => item.equipamento.toLowerCase().includes(busca.toLowerCase()));

  function abrirModalDevolucao(evento) {
    setEventoSelecionado(evento);
    setModalAberto(true);
  }

  function fecharModal() {
    setEventoSelecionado(null);
    setModalAberto(false);
  }

  // Quando salvar no modal, marca como devolvido na lista do App
  function devolucaoSalva() {
    if (onDevolver && eventoSelecionado) {
      onDevolver(eventoSelecionado); // reaproveita handler do App
    }
    fecharModal();
  }

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
            onChange={(e) => setBusca(e.target.value)}
          />
          <span className="input-group-text"><i className="bi bi-search"></i></span>
        </div>
      </div>

      {/* Aqui passamos nossa função que abre o modal */}
      <ListaMovimentacoes movimentacoes={filtradas} onDevolver={abrirModalDevolucao} />

      <button className="btn btn-outline-secondary mt-3" onClick={onVoltar}>
        <i className="bi bi-arrow-left"></i> Voltar
      </button>

      {/* Modal de devolução */}
      <ModalDevolucao
        aberto={modalAberto}
        evento={eventoSelecionado}
        onFechar={fecharModal}
        onSalvo={devolucaoSalva}
      />
    </div>
  );
}

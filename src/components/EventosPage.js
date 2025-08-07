// EventosPage.js
import React, { useState } from "react";
import ListaMovimentacoes from "./ListaMovimentacoes";
import ModalDevolucao from "./ModalDevolucao";

export default function EventosPage({ movimentacoes, onRegistrar, onDevolver, onVoltar }) {
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // Filtrando apenas os eventos
  const filtradas = movimentacoes
    .filter(m => m.tipo === "Evento")
    .filter(item =>
      item.equipamento.toLowerCase().includes(busca.toLowerCase())
    );

  const abrirModalDevolucao = (evento) => {
    setEventoSelecionado(evento);
    setModalAberto(true);
  };

  const fecharModalDevolucao = () => {
    setEventoSelecionado(null);
    setModalAberto(false);
  };

  const salvarDevolucao = (dadosDevolucao) => {
    onDevolver({
      ...eventoSelecionado,
      devolvido: true,
      ...dadosDevolucao
    });
    fecharModalDevolucao();
  };

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

      <ListaMovimentacoes
        movimentacoes={filtradas}
        onDevolver={abrirModalDevolucao} // Passa o evento para o modal
      />

      <button className="btn btn-outline-secondary mt-3" onClick={onVoltar}>
        <i className="bi bi-arrow-left"></i> Voltar
      </button>

      {/* Modal de devolução */}
      <ModalDevolucao
        isOpen={modalAberto}
        onClose={fecharModalDevolucao}
        onSalvar={salvarDevolucao}
      />
    </div>
  );
}

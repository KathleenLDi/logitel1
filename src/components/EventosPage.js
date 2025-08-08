<<<<<<< HEAD
=======
// EventosPage.js
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36
import React, { useState } from "react";
import ListaMovimentacoes from "./ListaMovimentacoes";
import ModalDevolucao from "./ModalDevolucao";

export default function EventosPage({ movimentacoes, onRegistrar, onDevolver, onVoltar }) {
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

<<<<<<< HEAD
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
=======
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
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="mb-4 fw-bold">Eventos</h2>
<<<<<<< HEAD
=======

>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36
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
<<<<<<< HEAD
            onChange={(e) => setBusca(e.target.value)}
=======
            onChange={e => setBusca(e.target.value)}
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36
          />
          <span className="input-group-text"><i className="bi bi-search"></i></span>
        </div>
      </div>

<<<<<<< HEAD
      {/* Aqui passamos nossa função que abre o modal */}
      <ListaMovimentacoes movimentacoes={filtradas} onDevolver={abrirModalDevolucao} />
=======
      <ListaMovimentacoes
        movimentacoes={filtradas}
        onDevolver={abrirModalDevolucao} // Passa o evento para o modal
      />
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36

      <button className="btn btn-outline-secondary mt-3" onClick={onVoltar}>
        <i className="bi bi-arrow-left"></i> Voltar
      </button>

      {/* Modal de devolução */}
      <ModalDevolucao
<<<<<<< HEAD
        aberto={modalAberto}
        evento={eventoSelecionado}
        onFechar={fecharModal}
        onSalvo={devolucaoSalva}
=======
        isOpen={modalAberto}
        onClose={fecharModalDevolucao}
        onSalvar={salvarDevolucao}
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36
      />
    </div>
  );
}

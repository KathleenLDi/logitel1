// src/components/EventosPage.js
import React, { useMemo, useState } from "react";
import ListaMovimentacoes from "./ListaMovimentacoes";
import ModalDevolucao from "./ModalDevolucao";

export default function EventosPage({
  movimentacoes,
  onRegistrar,           // abrir tela de registro de evento
  onVoltar,
  API = "http://localhost:4000",
  onAtualizar,           // opcional: (atualizado) => setMovimentacoes(...)
}) {
  const [busca, setBusca] = useState("");

  // modal de devolução
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const abrirModalDevolucao = (evento) => {
    setEventoSelecionado(evento);
    setModalAberto(true);
  };
  const fecharModalDevolucao = () => {
    setEventoSelecionado(null);
    setModalAberto(false);
  };

  // salvar devolução (POST /devolucoes) e marcar item como devolvido
  const salvarDevolucao = async ({ responsavel, dataHora, observacao, imagem }) => {
    if (!eventoSelecionado) return;

    try {
      const fd = new FormData();
      fd.append("movimentacaoId", eventoSelecionado.id);
      fd.append("responsavel", responsavel || "");
      fd.append("dataHora", dataHora || new Date().toISOString());
      fd.append("observacao", observacao || "");
      if (imagem) fd.append("imagem", imagem);

      const r = await fetch(`${API}/devolucoes`, { method: "POST", body: fd });
      if (!r.ok) {
        const t = await r.text();
        throw new Error(`Falha ao salvar devolução (${r.status}) ${t}`);
      }

      // marca como devolvido localmente
      const atualizado = { ...eventoSelecionado, devolvido: 1 };
      if (onAtualizar) onAtualizar(atualizado);

      fecharModalDevolucao();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar devolução.");
    }
  };

  // tabela de eventos com busca
  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return movimentacoes
      .filter((m) => m.tipo === "Evento")
      .filter((item) =>
        q
          ? `${item.equipamento || ""} ${item.localizacao || ""} ${item.responsavel || ""} ${item.motivo || ""}`
              .toLowerCase()
              .includes(q)
          : true
      );
  }, [movimentacoes, busca]);

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold m-0">Eventos</h2>

        <div className="d-flex gap-2">
          <button className="btn btn-warning text-dark" onClick={onRegistrar}>
            <i className="bi bi-plus-circle me-2" />
            Registrar Evento
          </button>
          <button className="btn btn-outline-secondary" onClick={onVoltar}>
            <i className="bi bi-arrow-left me-2" />
            Voltar
          </button>
        </div>
      </div>

      <div className="mb-4" style={{ maxWidth: 420 }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar equipamento, local, responsável…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <span className="input-group-text">
            <i className="bi bi-search" />
          </span>
        </div>
      </div>

      {/* A lista já sabe renderizar o botão “Registrar Devolução” quando
          recebe a prop onDevolver. Aqui passamos a função que abre o modal. */}
      <ListaMovimentacoes movimentacoes={filtradas} onDevolver={abrirModalDevolucao} />

      {/* Modal de devolução */}
      <ModalDevolucao
        aberto={modalAberto}
        item={eventoSelecionado}
        onFechar={fecharModalDevolucao}
        onSalvar={salvarDevolucao}
      />
    </div>
  );
}

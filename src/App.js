// src/App.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import RegistroMovimentacao from "./components/RegistroMovimentacao";
import ListaMovimentacoes from "./components/ListaMovimentacoes";
import Login from "./components/Login";
import MovimentacoesPage from "./components/MovimentacoesPage";
import EventosPage from "./components/EventosPage";
import ConsultarPage from "./components/ConsultarPage";

const API = "http://localhost:4000"; // troque pelo IP do servidor quando for subir

export default function App() {
  const [logado, setLogado] = useState(false);
  const [erroLogin, setErroLogin] = useState("");
  const [pagina, setPagina] = useState("home");
  const [mostrarRegistro, setMostrarRegistro] = useState({ tipo: null, ativo: false });

  // dados
  const [movimentacoes, setMovimentacoes] = useState([]);

  // modal devolução
  const [devModal, setDevModal] = useState({ aberto: false, item: null });

  // carrega movimentações ao iniciar
  useEffect(() => {
    fetch(`${API}/movimentacoes`)
      .then((r) => r.json())
      .then(setMovimentacoes)
      .catch(console.error);
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    const usuario = e.target.usuario.value;
    const senha = e.target.senha.value;
    if (usuario === "admin" && senha === "1234") {
      setLogado(true);
      setErroLogin("");
    } else {
      setErroLogin("Usuário ou senha inválidos!");
    }
  }

  function handleLogout() {
    setLogado(false);
    setErroLogin("");
    setPagina("home");
  }

  // chamada pelo RegistroMovimentacao após salvar na API
  function handleRegistrarMovimentacaoLocal(nova) {
    setMovimentacoes((prev) => [nova, ...prev]);
    setMostrarRegistro({ tipo: null, ativo: false });
    setPagina("home");
  }

  // ABRE modal de devolução (não marca direto)
  function abrirModalDevolucao(item) {
    setDevModal({ aberto: true, item });
  }

  // Salva devolução via /devolucoes e marca devolvido no item
  async function salvarDevolucao(dados) {
    if (!devModal.item) return;

    try {
      const fd = new FormData();
      fd.append("movimentacaoId", devModal.item.id);
      fd.append("responsavel", dados.responsavel);
      fd.append("observacao", dados.observacao || "");
      fd.append("dataHora", new Date().toISOString());
      if (dados.imagem) fd.append("imagem", dados.imagem);

      const r = await fetch(`${API}/devolucoes`, {
        method: "POST",
        body: fd,
      });
      if (!r.ok) {
        alert("Falha ao registrar devolução.");
        return;
      }

      // marca devolvido na lista
      setMovimentacoes((prev) =>
        prev.map((m) => (m.id === devModal.item.id ? { ...m, devolvido: 1 } : m))
      );
    } catch (e) {
      console.error(e);
      alert("Erro ao registrar devolução.");
    } finally {
      setDevModal({ aberto: false, item: null });
    }
  }

  let conteudo = null;

  if (!logado) {
    conteudo = <Login onLogin={handleLogin} erro={erroLogin} />;
  } else if (mostrarRegistro.ativo) {
    conteudo = (
      <RegistroMovimentacao
        tipo={mostrarRegistro.tipo}
        onSalvar={handleRegistrarMovimentacaoLocal} // <- nome alinhado
        onCancelar={() => setMostrarRegistro({ tipo: null, ativo: false })}
        API={API}
      />
    );
  } else if (pagina === "home") {
    conteudo = (
      <Home
        movimentacoes={movimentacoes}
        onNovaEntrada={() => setMostrarRegistro({ tipo: "Entrada", ativo: true })}
        onNovaSaida={() => setMostrarRegistro({ tipo: "Saída", ativo: true })}
        onNovoEvento={() => setMostrarRegistro({ tipo: "Evento", ativo: true })}
      />
    );
  } else if (pagina === "entradas") {
    conteudo = (
      <MovimentacoesPage
        tipo="Entrada"
        movimentacoes={movimentacoes}
        onRegistrar={() => setMostrarRegistro({ tipo: "Entrada", ativo: true })}
        onVoltar={() => setPagina("home")}
      />
    );
  } else if (pagina === "saidas") {
    conteudo = (
      <MovimentacoesPage
        tipo="Saída"
        movimentacoes={movimentacoes}
        onRegistrar={() => setMostrarRegistro({ tipo: "Saída", ativo: true })}
        onVoltar={() => setPagina("home")}
      />
    );
  } else if (pagina === "eventos") {
    conteudo = (
      <EventosPage
        movimentacoes={movimentacoes}
        onRegistrar={() => setMostrarRegistro({ tipo: "Evento", ativo: true })}
        onDevolver={abrirModalDevolucao}  // <- abre modal
        onVoltar={() => setPagina("home")}
        
      />
    );
  } else if (pagina === "consultar") {
    conteudo = <ConsultarPage movimentacoes={movimentacoes} />;
  } else {
    conteudo = (
      <div className="flex-grow-1 p-5 text-center">
        <h2 className="fw-bold mb-3">Em construção</h2>
        <button className="btn btn-outline-primary" onClick={() => setPagina("home")}>
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f5f6fa" }}>
      {logado && <Sidebar pagina={pagina} setPagina={setPagina} onLogout={handleLogout} />}
      {conteudo}

      {/* Modal de Devolução */}
      {devModal.aberto && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 480 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Registrar Devolução {devModal.item ? `— ${devModal.item.equipamento}` : ""}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDevModal({ aberto: false, item: null })}
                />
              </div>

              <DevolucaoForm
                onCancel={() => setDevModal({ aberto: false, item: null })}
                onSave={salvarDevolucao}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- componente de formulário do modal (inline no mesmo arquivo) --- */
function DevolucaoForm({ onCancel, onSave }) {
  const [responsavel, setResponsavel] = useState("");
  const [observacao, setObservacao] = useState("");
  const [imagem, setImagem] = useState(null);

  return (
    <>
      <div className="modal-body">
        <div className="mb-3">
          <label className="form-label">Responsável *</label>
          <input
            className="form-control"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Observação</label>
          <textarea
            className="form-control"
            rows={3}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagem (opcional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImagem(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button
          className="btn btn-success"
          onClick={() => onSave({ responsavel, observacao, imagem })}
          disabled={!responsavel}
        >
          Salvar devolução
        </button>
      </div>
    </>
  );
}

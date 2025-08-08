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

const API = "http://localhost:4000";

export default function App() {
  const [logado, setLogado] = useState(false);
  const [erroLogin, setErroLogin] = useState("");
  const [pagina, setPagina] = useState("home");
  const [mostrarRegistro, setMostrarRegistro] = useState({ tipo: null, ativo: false });

  const [movimentacoes, setMovimentacoes] = useState([]);

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

  // chamado pelo RegistroMovimentacao após salvar no backend
  function handleRegistrarMovimentacaoLocal(nova) {
    setMovimentacoes((prev) => [nova, ...prev]);
    setMostrarRegistro({ tipo: null, ativo: false });
  }

  // marcar devolução (PUT na API) – usado em EventosPage
  async function handleDevolucao(item) {
    try {
      const r = await fetch(`${API}/movimentacoes/${item.id}/devolver`, { method: "PUT" });
      const atualizado = await r.json();
      setMovimentacoes((prev) => prev.map((m) => (m.id === atualizado.id ? atualizado : m)));
    } catch (e) {
      console.error(e);
      alert("Falha ao registrar devolução.");
    }
  }

  let conteudo = null;
  if (!logado) {
    conteudo = <Login onLogin={handleLogin} erro={erroLogin} />;
  } else if (mostrarRegistro.ativo) {
    conteudo = (
      <RegistroMovimentacao
        tipo={mostrarRegistro.tipo}
        onSalvarLocal={handleRegistrarMovimentacaoLocal}  // <- nome certo aqui
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
        onDevolver={handleDevolucao}
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
    </div>
  );
}

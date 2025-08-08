<<<<<<< HEAD
// src/App.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

=======
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Importando componentes personalizados
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import RegistroMovimentacao from "./components/RegistroMovimentacao";
import ListaMovimentacoes from "./components/ListaMovimentacoes";
import Login from "./components/Login";
import MovimentacoesPage from "./components/MovimentacoesPage";
import EventosPage from "./components/EventosPage";
import ConsultarPage from "./components/ConsultarPage";

<<<<<<< HEAD
const API = "http://localhost:4000";
=======
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36

export default function App() {
  const [logado, setLogado] = useState(false);
  const [erroLogin, setErroLogin] = useState("");
  const [pagina, setPagina] = useState("home");
  const [mostrarRegistro, setMostrarRegistro] = useState({ tipo: null, ativo: false });

<<<<<<< HEAD
  const [movimentacoes, setMovimentacoes] = useState([]);

  useEffect(() => {
    fetch(`${API}/movimentacoes`)
      .then((r) => r.json())
      .then(setMovimentacoes)
      .catch(console.error);
  }, []);
=======
  const [movimentacoes, setMovimentacoes] = useState([
    {
      dataHora: "2024-04-22T08:30:00",
      tipo: "Entrada",
      equipamento: "Impressora Canon",
      localizacao: "Sala 3",
      responsavel: "João",
      motivo: "Compra",
      notaFiscal: "NF12345",
      notaFiscalUrl: "",
      observacao: "",
    },
    {
      dataHora: "2024-04-18T14:20:00",
      tipo: "Saída",
      equipamento: "Scanner",
      localizacao: "Sala 1",
      responsavel: "Maria",
      motivo: "Empréstimo para outro setor",
      observacao: "",
    },
    {
      dataHora: "2024-04-20T10:00:00",
      tipo: "Evento",
      equipamento: "Roteador Cisco",
      localizacao: "Sala 4",
      responsavel: "Felipe",
      motivo: "Na praia",
      observacao: "Evento de teste",
      devolvido: false,
    },
    {
      dataHora: "2024-04-18T12:50:00",
      tipo: "Entrada",
      equipamento: "Laptop Dell",
      localizacao: "Sala 2",
      responsavel: "Carlos",
      motivo: "Compra",
      notaFiscal: "NF99999",
      notaFiscalUrl: "",
      observacao: "Novo",
    },
    {
      dataHora: "2024-04-19T08:40:00",
      tipo: "Evento",
      equipamento: "Switch HP",
      localizacao: "Sala 5",
      responsavel: "Paula",
      motivo: "Moto week",
      observacao: "Troca de porta",
      devolvido: true,
    },
    {
      dataHora: "2024-04-17T16:00:00",
      tipo: "Entrada",
      equipamento: "Projetor",
      localizacao: "Sala 2",
      responsavel: "João",
      motivo: "Empréstimo para outro setor",
      notaFiscal: "NF11223",
      notaFiscalUrl: "",
      observacao: "",
    },
    {
      dataHora: "2024-04-18T17:00:00",
      tipo: "Saída",
      equipamento: "HD Externo",
      localizacao: "Sala 1",
      responsavel: "Lucas",
      motivo: "Manutenção",
      observacao: "Troca de setor",
    },
  ]);
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36

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

<<<<<<< HEAD
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
=======
  function handleRegistrarMovimentacao(dados) {
    setMovimentacoes([{ ...dados }, ...movimentacoes]);
    setMostrarRegistro({ tipo: null, ativo: false });
  }

  function handleDevolucao(itemDevolver) {
    setMovimentacoes(movimentacoes.map(item =>
      item === itemDevolver ? { ...item, devolvido: true } : item
    ));
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36
  }

  let conteudo = null;
  if (!logado) {
    conteudo = <Login onLogin={handleLogin} erro={erroLogin} />;
  } else if (mostrarRegistro.ativo) {
    conteudo = (
      <RegistroMovimentacao
        tipo={mostrarRegistro.tipo}
<<<<<<< HEAD
        onSalvarLocal={handleRegistrarMovimentacaoLocal}  // <- nome certo aqui
        onCancelar={() => setMostrarRegistro({ tipo: null, ativo: false })}
        API={API}
=======
        onSalvar={handleRegistrarMovimentacao}
        onCancelar={() => setMostrarRegistro({ tipo: null, ativo: false })}
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36
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
<<<<<<< HEAD
        <button className="btn btn-outline-primary" onClick={() => setPagina("home")}>
          Voltar ao início
        </button>
=======
        <button className="btn btn-outline-primary" onClick={() => setPagina("home")}>Voltar ao início</button>
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36
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

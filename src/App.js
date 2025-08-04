import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// --- Sidebar ---
function Sidebar({ pagina, setPagina, onLogout }) {
  return (
    <div className="bg-dark text-light p-4" style={{ minWidth: 220, minHeight: "100vh" }}>
      <div className="fs-4 fw-bold mb-5">
        <i className="bi bi-list me-2"></i> Painel
      </div>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <button className={`nav-link text-light ${pagina === "home" ? "active fw-bold" : ""}`}
            onClick={() => setPagina("home")}>
            <i className="bi bi-house-door me-2"></i> Início
          </button>
        </li>
        <li className="nav-item mb-3">
          <button className={`nav-link text-light ${pagina === "entradas" ? "active fw-bold" : ""}`}
            onClick={() => setPagina("entradas")}>
            <i className="bi bi-box-arrow-in-down me-2"></i> Entradas
          </button>
        </li>
        <li className="nav-item mb-3">
          <button className={`nav-link text-light ${pagina === "saidas" ? "active fw-bold" : ""}`}
            onClick={() => setPagina("saidas")}>
            <i className="bi bi-box-arrow-up me-2"></i> Saídas
          </button>
        </li>
        <li className="nav-item mb-3">
          <button className={`nav-link text-light ${pagina === "eventos" ? "active fw-bold" : ""}`}
            onClick={() => setPagina("eventos")}>
            <i className="bi bi-calendar-event me-2"></i> Eventos
          </button>
        </li>
        <li className="nav-item mb-3">
          <button className={`nav-link text-light ${pagina === "consultar" ? "active fw-bold" : ""}`}
            onClick={() => setPagina("consultar")}>
            <i className="bi bi-search me-2"></i> Consultar
          </button>
        </li>
      </ul>
      <button className="btn btn-outline-light mt-5" onClick={onLogout}>
        <i className="bi bi-box-arrow-right me-2"></i> Sair
      </button>
    </div>
  );
}

// --- ListaMovimentacoes ---
function ListaMovimentacoes({ movimentacoes, onDevolver }) {
  const isEntrada = movimentacoes.some(m => m.tipo === "Entrada" && (m.notaFiscal || m.notaFiscalUrl));
  return (
    <div className="bg-white rounded shadow-sm p-3">
      <div className="table-responsive">
        <table className="table table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Equipamento</th>
              <th>Localização</th>
              <th>Responsável</th>
              <th>Motivo</th>
              {isEntrada && <th>Nota Fiscal</th>}
              <th>Observação</th>
              {onDevolver && <th>Ação</th>}
            </tr>
          </thead>
          <tbody>
            {movimentacoes.length === 0 ? (
              <tr>
                <td colSpan={onDevolver ? (isEntrada ? 9 : 8) : (isEntrada ? 8 : 7)} className="text-center text-muted">
                  Nenhuma movimentação encontrada.
                </td>
              </tr>
            ) : (
              movimentacoes.map((item, i) => (
                <tr key={i}>
                  <td>{item.dataHora ? new Date(item.dataHora).toLocaleString() : "--"}</td>
                  <td>{item.tipo}</td>
                  <td>{item.equipamento}</td>
                  <td>{item.localizacao}</td>
                  <td>{item.responsavel}</td>
                  <td>{item.motivo || "-"}</td>
                  {isEntrada && (
                    <td>
                      {item.tipo === "Entrada" ? (
                        <>
                          {item.notaFiscal || "-"}
                          {item.notaFiscalUrl &&
                            <div>
                              <a
                                href={item.notaFiscalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-link mt-1"
                              >
                                <i className="bi bi-eye"></i> Visualizar
                              </a>
                            </div>
                          }
                        </>
                      ) : "-"}
                    </td>
                  )}
                  <td>{item.observacao || "-"}</td>
                  {onDevolver && (
                    <td>
                      {item.devolvido ? (
                        <span className="badge bg-success">Devolvido</span>
                      ) : (
                        <button className="btn btn-sm btn-outline-success" onClick={() => onDevolver(item)}>
                          Registrar Devolução
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Demais componentes seguem igual ---
function Home({ movimentacoes, onNovaEntrada, onNovaSaida, onNovoEvento }) {
  const [busca, setBusca] = useState("");
  const entradas = movimentacoes.filter(m => m.tipo === "Entrada").length;
  const saidas = movimentacoes.filter(m => m.tipo === "Saída").length;
  const eventos = movimentacoes.filter(m => m.tipo === "Evento").length;
  const estoque = 42;

  const filtradas = movimentacoes.filter(item => {
    const texto = (item.tipo + " " + item.equipamento + " " + item.responsavel).toLowerCase();
    return texto.includes(busca.toLowerCase());
  });
  const ultimos = filtradas.slice(0, 5);

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h1 className="mb-4 fw-bold" style={{ fontSize: "2.4rem" }}>Controle Logístico</h1>
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="bg-white rounded shadow-sm p-3">
            <span className="fs-6 fw-bold">Entradas</span>
            <div className="fs-2 fw-bold text-primary mt-2">{entradas}</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="bg-white rounded shadow-sm p-3">
            <span className="fs-6 fw-bold">Saídas</span>
            <div className="fs-2 fw-bold text-success mt-2">{saidas}</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="bg-white rounded shadow-sm p-3">
            <span className="fs-6 fw-bold">Eventos</span>
            <div className="fs-2 fw-bold text-warning mt-2">{eventos}</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="bg-white rounded shadow-sm p-3">
            <span className="fs-6 fw-bold">Estoque Atual</span>
            <div className="fs-2 fw-bold text-dark mt-2">{estoque}</div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <button className="btn btn-primary w-100 py-2 fw-bold" onClick={onNovaEntrada}>Nova Entrada</button>
        </div>
        <div className="col-12 col-md-4">
          <button className="btn btn-outline-primary w-100 py-2 fw-bold" onClick={onNovaSaida}>Nova Saída</button>
        </div>
        <div className="col-12 col-md-4">
          <button className="btn btn-warning w-100 py-2 fw-bold text-dark" onClick={onNovoEvento}>Novo Evento</button>
        </div>
      </div>
      <div className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por tipo, equipamento ou responsável"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <span className="input-group-text"><i className="bi bi-search"></i></span>
        </div>
      </div>
      <ListaMovimentacoes movimentacoes={ultimos} />
    </div>
  );
}

function MovimentacoesPage({ tipo, movimentacoes, onRegistrar, onVoltar }) {
  const [busca, setBusca] = useState("");
  const filtradas = movimentacoes
    .filter(m => m.tipo === tipo)
    .filter(item =>
      item.equipamento.toLowerCase().includes(busca.toLowerCase())
    );
  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="mb-4 fw-bold">
        {tipo === "Entrada" ? "Entradas" : tipo === "Saída" ? "Saídas" : "Eventos"}
      </h2>
      <button className={`btn ${tipo === "Evento" ? "btn-warning text-dark" : "btn-primary"} mb-3`} onClick={onRegistrar}>
        <i className="bi bi-plus-circle me-2"></i>Registrar {tipo}
      </button>
      <div className="mb-4" style={{ maxWidth: 400 }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder={`Buscar ${tipo.toLowerCase()} por equipamento`}
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <span className="input-group-text"><i className="bi bi-search"></i></span>
        </div>
      </div>
      <ListaMovimentacoes movimentacoes={filtradas} />
      <button className="btn btn-outline-secondary mt-3" onClick={onVoltar}>
        <i className="bi bi-arrow-left"></i> Voltar
      </button>
    </div>
  );
}

function EventosPage({ movimentacoes, onRegistrar, onDevolver, onVoltar }) {
  const [busca, setBusca] = useState("");
  const filtradas = movimentacoes
    .filter(m => m.tipo === "Evento")
    .filter(item =>
      item.equipamento.toLowerCase().includes(busca.toLowerCase())
    );
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
      <ListaMovimentacoes movimentacoes={filtradas} onDevolver={onDevolver} />
      <button className="btn btn-outline-secondary mt-3" onClick={onVoltar}>
        <i className="bi bi-arrow-left"></i> Voltar
      </button>
    </div>
  );
}

function ConsultarPage({ movimentacoes }) {
  const [busca, setBusca] = useState("");
  const filtradas = movimentacoes.filter(item => {
    const texto =
      (item.tipo + " " + item.equipamento + " " + item.responsavel)
        .toLowerCase();
    return texto.includes(busca.toLowerCase());
  });
  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="mb-4 fw-bold"><i className="bi bi-search"></i> Consultar movimentações</h2>
      <div className="mb-4" style={{ maxWidth: 400 }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por tipo, equipamento ou responsável"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <span className="input-group-text"><i className="bi bi-search"></i></span>
        </div>
      </div>
      <ListaMovimentacoes movimentacoes={filtradas} />
    </div>
  );
}

// --- REGISTRO DE MOVIMENTACAO ---
function RegistroMovimentacao({ tipo, onSalvar, onCancelar }) {
  const [equipamento, setEquipamento] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [motivo, setMotivo] = useState("");
  const [outroMotivo, setOutroMotivo] = useState("");
  const [notaFiscal, setNotaFiscal] = useState("");
  const [notaFiscalUrl, setNotaFiscalUrl] = useState("");
  const [notaFiscalFile, setNotaFiscalFile] = useState(null);
  const [observacao, setObservacao] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [evento, setEvento] = useState("");
  const [outroEvento, setOutroEvento] = useState("");
  const [erro, setErro] = useState("");

  const motivosEntrada = [
    "Compra",
    "Empréstimo para outro setor",
    "Outros"
  ];
  const motivosSaida = [
    "Manutenção",
    "Empréstimo para outro setor",
    "Outros"
  ];
  const eventosPadrao = [
    "Na praia",
    "Moto week",
    "Outros"
  ];

  // Manipula arquivo da nota fiscal (imagem ou pdf)
  function handleNotaFiscalFile(e) {
    const file = e.target.files[0];
    setNotaFiscalFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNotaFiscalUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setNotaFiscalUrl("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!equipamento || !localizacao || !responsavel ||
      ((tipo === "Entrada" || tipo === "Saída") && !motivo) ||
      (tipo === "Evento" && !evento)
    ) {
      setErro("Preencha todos os campos obrigatórios!");
      return;
    }
    let motivoFinal = motivo === "Outros" ? outroMotivo : motivo;
    let eventoFinal = evento === "Outros" ? outroEvento : evento;

    onSalvar({
      tipo: tipo,
      equipamento,
      localizacao,
      responsavel,
      motivo: tipo === "Evento" ? eventoFinal : motivoFinal,
      notaFiscal: tipo === "Entrada" ? notaFiscal : undefined,
      notaFiscalUrl: tipo === "Entrada" ? notaFiscalUrl : undefined,
      observacao,
      dataHora: dataHora ? new Date(dataHora).toISOString() : new Date().toISOString(),
      devolvido: false
    });
  }

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="fw-bold mb-4">Registrar {tipo}</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div className="mb-3">
          <label className="form-label">Equipamento *</label>
          <input className="form-control" value={equipamento} onChange={e => setEquipamento(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Localização *</label>
          <input className="form-control" value={localizacao} onChange={e => setLocalizacao(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Responsável *</label>
          <input className="form-control" value={responsavel} onChange={e => setResponsavel(e.target.value)} required />
        </div>
        {(tipo === "Entrada") && (
          <>
            <div className="mb-3">
              <label className="form-label">Motivo *</label>
              <select
                className="form-select"
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                {motivosEntrada.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
              {motivo === "Outros" && (
                <input
                  className="form-control mt-2"
                  placeholder="Descreva o motivo"
                  value={outroMotivo}
                  onChange={e => setOutroMotivo(e.target.value)}
                  required
                />
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Nota Fiscal</label>
              <input
                className="form-control mb-2"
                placeholder="Número ou código da Nota Fiscal"
                value={notaFiscal}
                onChange={e => setNotaFiscal(e.target.value)}
              />
              <input
                className="form-control"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleNotaFiscalFile}
              />
              {notaFiscalUrl &&
                <div className="mt-2">
                  <span className="me-2">Arquivo:</span>
                  <a href={notaFiscalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-link">
                    Visualizar Nota
                  </a>
                </div>
              }
            </div>
          </>
        )}
        {(tipo === "Saída") && (
          <div className="mb-3">
            <label className="form-label">Motivo *</label>
            <select
              className="form-select"
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {motivosSaida.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
            {motivo === "Outros" && (
              <input
                className="form-control mt-2"
                placeholder="Descreva o motivo"
                value={outroMotivo}
                onChange={e => setOutroMotivo(e.target.value)}
                required
              />
            )}
          </div>
        )}
        {tipo === "Evento" && (
          <div className="mb-3">
            <label className="form-label">Tipo de Evento *</label>
            <select
              className="form-select"
              value={evento}
              onChange={e => setEvento(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {["Na praia", "Moto week", "Outros"].map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
            {evento === "Outros" && (
              <input
                className="form-control mt-2"
                placeholder="Descreva o evento"
                value={outroEvento}
                onChange={e => setOutroEvento(e.target.value)}
                required
              />
            )}
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Data e Hora</label>
          <input
            className="form-control"
            type="datetime-local"
            value={dataHora}
            onChange={e => setDataHora(e.target.value)}
          />
          <small className="form-text text-muted">Se não preencher, será usada a data/hora atual.</small>
        </div>
        <div className="mb-3">
          <label className="form-label">Observação</label>
          <textarea className="form-control" value={observacao} onChange={e => setObservacao(e.target.value)} rows={3} />
        </div>
        {erro && <div className="alert alert-danger">{erro}</div>}
        <button className="btn btn-primary me-2" type="submit">Registrar</button>
        <button className="btn btn-secondary" onClick={onCancelar} type="button">Cancelar</button>
      </form>
    </div>
  );
}

function Login({ onLogin, erro }) {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%" }}>
        <h1 className="h4 text-center mb-4">SISTEMA DE REGISTRO DE EQUIPAMENTOS</h1>
        <form onSubmit={onLogin}>
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">
              Usuário
            </label>
            <input type="text" className="form-control" id="usuario" name="usuario" required autoFocus />
          </div>
          <div className="mb-3">
            <label htmlFor="senha" className="form-label">
              Senha
            </label>
            <input type="password" className="form-control" id="senha" name="senha" required />
          </div>
          {erro && <div className="alert alert-danger py-1">{erro}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [logado, setLogado] = useState(false);
  const [erroLogin, setErroLogin] = useState("");
  const [pagina, setPagina] = useState("home");
  const [mostrarRegistro, setMostrarRegistro] = useState({ tipo: null, ativo: false });

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

  function handleRegistrarMovimentacao(dados) {
    setMovimentacoes([{ ...dados }, ...movimentacoes]);
    setMostrarRegistro({ tipo: null, ativo: false });
  }

  function handleDevolucao(itemDevolver) {
    setMovimentacoes(movimentacoes.map(item =>
      item === itemDevolver ? { ...item, devolvido: true } : item
    ));
  }

  let conteudo = null;
  if (!logado) {
    conteudo = <Login onLogin={handleLogin} erro={erroLogin} />;
  } else if (mostrarRegistro.ativo) {
    conteudo = (
      <RegistroMovimentacao
        tipo={mostrarRegistro.tipo}
        onSalvar={handleRegistrarMovimentacao}
        onCancelar={() => setMostrarRegistro({ tipo: null, ativo: false })}
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
        <button className="btn btn-outline-primary" onClick={() => setPagina("home")}>Voltar ao início</button>
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

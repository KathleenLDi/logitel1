import React, { useState } from "react";
import ListaMovimentacoes from "./ListaMovimentacoes";

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

export default Home;

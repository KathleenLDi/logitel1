import React from "react";

export default function Sidebar({ pagina, setPagina, onLogout }) {
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

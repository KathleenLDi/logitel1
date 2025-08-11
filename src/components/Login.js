// Login.js
import React from "react";
import logo from "./logo.png";

export default function Login({ onLogin, erro }) {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card shadow"
        style={{ maxWidth: 500, width: "100%", padding: "16px 55px 40px" }}
      >
        <div className="text-center" style={{ marginBottom: "-28px" }}>
          <img
            src={logo}
            alt="Logo LogiTel"
            style={{ maxWidth: 400, height: "auto" }}
          />
        </div>

        <form onSubmit={onLogin}>
          <div className="mb-3 mt-0"> {/* removi o espaçamento superior */}
            <label className="form-label fw-bold">Usuário:</label>
            <input type="text" name="usuario" className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Senha:</label>
            <input type="password" name="senha" className="form-control" required />
          </div>

          {erro && <div className="alert alert-danger">{erro}</div>}
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
}
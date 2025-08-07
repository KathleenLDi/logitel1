// Login.js
import React from "react";

export default function Login({ onLogin, erro }) {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%" }}>
        <h1 className="h4 text-center mb-4">SISTEMA DE REGISTRO DE EQUIPAMENTOS</h1>
        <form onSubmit={onLogin}>
          <div className="mb-3">
            <label className="form-label">Usuário</label>
            <input type="text" name="usuario" className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input type="password" name="senha" className="form-control" required />
          </div>
          {erro && <div className="alert alert-danger">{erro}</div>}
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
}

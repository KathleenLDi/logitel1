// Login.js
import React from "react";
import logo from "./logo.png";

<<<<<<< HEAD
export default function Login({ onLogin, erro }) {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card shadow"
        style={{ maxWidth: 500, width: "100%", padding: " 0px 60px 80px" }}
      >
        <div className="text-center" style={{ marginBottom: "-15px" }}> {/* reduzido de mb-4 para 8px */}
          <img
            src={logo}
            alt="Logo LogiTel"
            style={{ maxWidth: 400, height: "auto" }}
          />
        </div>

        <form onSubmit={onLogin}>
          <div className="mb-2">
            <label className="form-label fw-bold">Usuário:</label>
            <input type="text" name="usuario" className="form-control" required />
          </div>

          <div className="mb-2">
            <label className="form-label fw-bold">Senha:</label>
            <input type="password" name="senha" className="form-control" required />
          </div>

=======

export default function Login({ onLogin, erro }) {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 500, width: "100%" }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo LogiTel" style={{ maxWidth: "400px", height: "auto" }} />
        </div>
        <form onSubmit={onLogin}>
          <div className="mb-3">
            <label className="form-label">Usuário</label>
            <input type="text" name="usuario" className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input type="password" name="senha" className="form-control" required />
          </div>
>>>>>>> 765ced9a04f7e38824485172b30cd6feb4f91c36
          {erro && <div className="alert alert-danger">{erro}</div>}
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
}

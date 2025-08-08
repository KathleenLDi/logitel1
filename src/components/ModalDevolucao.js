// src/components/ModalDevolucao.js
import React, { useState, useEffect } from "react";

// ajuste aqui se sua API estiver em outro host/porta
const API = "http://localhost:4000";

export default function ModalDevolucao({ aberto, evento, onFechar, onSalvo }) {
  const [responsavel, setResponsavel] = useState("");
  const [observacao, setObservacao] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [arquivo, setArquivo] = useState(null); // imagem (opcional)
  const [erro, setErro] = useState("");

  // preenche data/hora automaticamente e limpa campos ao abrir
  useEffect(() => {
    if (aberto) {
      const agora = new Date();
      const localISOTime = new Date(
        agora.getTime() - agora.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16); // YYYY-MM-DDTHH:mm
      setDataHora(localISOTime);
      setResponsavel("");
      setObservacao("");
      setArquivo(null);
      setErro("");
    }
  }, [aberto]);

  if (!aberto) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!evento || !evento.id) {
      setErro("Evento inválido.");
      return;
    }
    if (!responsavel.trim()) {
      setErro("Informe o responsável.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("movimentacaoId", evento.id);
      fd.append("responsavel", responsavel);
      fd.append("observacao", observacao);
      fd.append("dataHora", dataHora ? new Date(dataHora).toISOString() : new Date().toISOString());
      if (arquivo) fd.append("imagem", arquivo);

      const r = await fetch(`${API}/devolucoes`, {
        method: "POST",
        body: fd,
      });
      if (!r.ok) throw new Error("Falha ao registrar devolução");
      const salvo = await r.json();

      // avisa o pai para atualizar a UI (ex.: marcar "devolvido")
      onSalvo?.(salvo);
      onFechar?.();
    } catch (err) {
      console.error(err);
      setErro("Erro ao salvar a devolução.");
    }
  }

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={contentStyle}>
        <h5 className="mb-3">Registrar Devolução</h5>

        <div className="mb-2 text-muted">
          <strong>Equipamento:</strong> {evento?.equipamento}
          <br />
          <strong>Responsável original:</strong> {evento?.responsavel}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Responsável pela devolução *</label>
            <input
              className="form-control"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Data e Hora</label>
            <input
              type="datetime-local"
              className="form-control"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              readOnly
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
            <label className="form-label">Imagem/Comprovante (opcional)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*,application/pdf"
              onChange={(e) => setArquivo(e.target.files?.[0] || null)}
            />
          </div>

          {erro && <div className="alert alert-danger">{erro}</div>}

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">
              Salvar
            </button>
            <button type="button" className="btn btn-secondary" onClick={onFechar}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* estilos inline simples; pode mover para .css se quiser */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1050,
};

const contentStyle = {
  background: "#fff",
  borderRadius: 8,
  padding: 20,
  width: "100%",
  maxWidth: 520,
  boxShadow: "0 5px 20px rgba(0,0,0,.2)",
};

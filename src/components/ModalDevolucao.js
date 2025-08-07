import React, { useEffect, useState } from "react";
import "./ModalDevolucao.css"; // (estilo opcional que pode criar depois)

function ModalDevolucao({ isOpen, onClose, onSalvar }) {
  const [responsavel, setResponsavel] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [notaFile, setNotaFile] = useState(null);
  const [notaUrl, setNotaUrl] = useState("");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    if (isOpen) {
      const agora = new Date();
      const localISOTime = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setDataHora(localISOTime);
      setResponsavel("");
      setNotaFile(null);
      setNotaUrl("");
      setObservacao("");
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNotaFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNotaUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setNotaUrl("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!responsavel || !observacao) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    onSalvar({
      responsavel,
      dataHora,
      notaFiscalUrl: notaUrl,
      observacao,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content p-4 rounded bg-white" style={{ maxWidth: 500 }}>
        <h5>Registrar Devolução</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Responsável *</label>
            <input
              type="text"
              className="form-control"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Data e Hora *</label>
            <input
              type="datetime-local"
              className="form-control"
              value={dataHora}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nota Fiscal / Imagem</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
            />
            {notaUrl && (
              <div className="mt-2">
                <a href={notaUrl} target="_blank" rel="noopener noreferrer">
                  Visualizar Anexo
                </a>
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Observação *</label>
            <textarea
              className="form-control"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success">
              Salvar Devolução
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalDevolucao;

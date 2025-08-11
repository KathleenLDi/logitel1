// src/components/DevolucoesPage.js
import React, { useEffect, useState } from "react";

const abrirArquivo = (url) => {
  if (!url) return;
  if (url.startsWith("data:")) {
    const w = window.open("", "_blank", "noopener");
    if (w) {
      w.document.write(`
        <html>
          <head><title>Nota / Imagem</title></head>
          <body style="margin:0">
            <iframe src="${url}" style="border:0;width:100vw;height:100vh"></iframe>
          </body>
        </html>
      `);
      w.document.close();
    }
  } else {
    window.open(url, "_blank", "noopener");
  }
};

export default function DevolucoesPage({ API, onVoltar }) {
  const [busca, setBusca] = useState("");
  const [items, setItems] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    fetch(`${API}/devolucoes`)
      .then((r) => r.json())
      .then((data) => {
        if (ativo) setItems(data);
      })
      .catch(console.error)
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [API]);

  const filtrados = items.filter((d) => {
    const alvo = [
      d.responsavel,
      d.equipamento,
      d.observacao,
      d.localizacao,
      d.tipoMov,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return alvo.includes(busca.toLowerCase());
  });

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="fw-bold mb-0">Devoluções</h2>
        <button className="btn btn-outline-secondary" onClick={onVoltar}>
          <i className="bi bi-arrow-left"></i> Voltar
        </button>
      </div>

      <div className="mb-3" style={{ maxWidth: 420 }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por equipamento, responsável ou observação"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-3">
        {carregando ? (
          <div className="text-muted">Carregando...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Data/Hora</th>
                  <th>Responsável</th>
                  <th>Equipamento</th>
                  <th>Localização</th>
                  <th>Observação</th>
                  <th>Arquivo</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      Nenhuma devolução encontrada.
                    </td>
                  </tr>
                ) : (
                  filtrados.map((d) => (
                    <tr key={d.id}>
                      <td>
                        {d.dataHora
                          ? new Date(d.dataHora).toLocaleString()
                          : "--"}
                      </td>
                      <td>{d.responsavel || "-"}</td>
                      <td>{d.equipamento || "-"}</td>
                      <td>{d.localizacao || "-"}</td>
                      <td style={{ maxWidth: 420 }}>{d.observacao || "-"}</td>
                      <td>
                        {d.imagemUrl ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-link p-0"
                            onClick={() => abrirArquivo(d.imagemUrl)}
                          >
                            <i className="bi bi-eye"></i> Visualizar
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

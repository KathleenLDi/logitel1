// src/components/ListaMovimentacoes.js
import React from "react";

const API_BASE = process.env.REACT_APP_API || "http://localhost:4000";

function ListaMovimentacoes({ movimentacoes, onDevolver }) {
  const isEntrada = movimentacoes.some(
    (m) => m.tipo === "Entrada" && (m.notaFiscal || m.notaFiscalUrl)
  );

  function abrirNota(item) {
    const url = item.notaFiscalUrl;
    if (!url) return;

    
    if (url.startsWith("data:")) {
      const w = window.open("", "_blank", "noopener,noreferrer");
      if (w) {
        w.document.write(`
          <html>
            <head><title>Nota Fiscal</title></head>
            <body style="margin:0">
              <iframe src="${url}" style="border:0;width:100vw;height:100vh"></iframe>
            </body>
          </html>
        `);
        w.document.close();
      }
      return;
    }

  
    const finalUrl = url.startsWith("/uploads/")
      ? `${API_BASE}${url}`
      : url;

    window.open(finalUrl, "_blank", "noopener,noreferrer");
  }

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
                <td
                  colSpan={onDevolver ? (isEntrada ? 9 : 8) : isEntrada ? 8 : 7}
                  className="text-center text-muted"
                >
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
                          {item.notaFiscalUrl && (
                            <div>
                              <button
                                type="button"
                                className="btn btn-sm btn-link mt-1 p-0"
                                onClick={() => abrirNota(item)}
                              >
                                <i className="bi bi-eye"></i> Visualizar
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  )}

                  <td>{item.observacao || "-"}</td>

                  {onDevolver && (
                    <td>
                      {item.devolvido ? (
                        <span className="badge bg-success">Devolvido</span>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => onDevolver(item)}
                        >
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

export default ListaMovimentacoes;

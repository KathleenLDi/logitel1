// src/components/DevolucoesPage.js
import React, { useEffect, useState } from "react";


const API_DEFAULT = "http://localhost:4000";

export default function DevolucoesPage({ API = "http://localhost:4000", item, onVoltar }) {
  const [loading, setLoading] = useState(true);
  const [lista, setLista] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let abort = false;

    async function carregar() {
      if (!item || !item.id) {
        setLoading(false);
        setLista([]);
        return;
      }
      setLoading(true);
      setErro("");

      try {
        const r = await fetch(`${API}/movimentacoes/${item.id}/devolucoes`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const dados = await r.json();
        if (!abort) setLista(Array.isArray(dados) ? dados : []);
      } catch (e) {
        if (!abort) setErro("Falha ao carregar devoluções.");
      } finally {
        if (!abort) setLoading(false);
      }
    }

    carregar();
    return () => {
      abort = true;
    };
  }, [API, item]);

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">
          Devoluções{item?.equipamento ? ` • ${item.equipamento}` : ""}
        </h2>
        <button className="btn btn-outline-secondary" onClick={onVoltar}>
          <i className="bi bi-arrow-left me-2" />
          Voltar
        </button>
      </div>

      {!item?.id && (
        <div className="alert alert-warning">Selecione um evento na tela anterior.</div>
      )}

      {item?.id && loading && (
        <div className="alert alert-info">Carregando devoluções...</div>
      )}

      {erro && <div className="alert alert-danger">{erro}</div>}

      {item?.id && !loading && !erro && (
        <div className="bg-white rounded shadow-sm p-3">
          {lista.length === 0 ? (
            <div className="text-muted">Nenhuma devolução registrada para este evento.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Data/Hora</th>
                    <th>Responsável</th>
                    <th>Observação</th>
                    <th>Imagem</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((d) => (
                    <tr key={d.id}>
                      <td>{new Date(d.dataHora).toLocaleString()}</td>
                      <td>{d.responsavel}</td>
                      <td>{d.observacao || "-"}</td>
                      <td>
                        {d.imagemUrl ? (
                          <a
                            href={`${API}${d.imagemUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-link p-0"
                          >
                            Ver arquivo
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

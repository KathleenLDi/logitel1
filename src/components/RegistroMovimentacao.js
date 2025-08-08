import React, { useEffect, useState } from "react";

export default function RegistroMovimentacao({
  tipo,
  onSalvarLocal,           // vem do App para atualizar a lista sem F5
  onCancelar,
  API = "http://localhost:4000",
}) {
  const [equipamento, setEquipamento] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [motivo, setMotivo] = useState("");
  const [outroMotivo, setOutroMotivo] = useState("");
  const [notaFiscal, setNotaFiscal] = useState("");
  const [notaFiscalFile, setNotaFiscalFile] = useState(null);

  // 👉 apenas pré-visualização local (base64), não vai para o backend
  const [previewUrl, setPreviewUrl] = useState("");

  const [observacao, setObservacao] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [evento, setEvento] = useState("");
  const [outroEvento, setOutroEvento] = useState("");
  const [erro, setErro] = useState("");

  const motivosEntrada = ["Compra", "Empréstimo para outro setor", "Outros"];
  const motivosSaida = ["Manutenção", "Empréstimo para outro setor", "Outros"];
  const eventosPadrao = ["Na praia", "Moto week", "Outros"];

  useEffect(() => {
    const agora = new Date();
    const localISOTime = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setDataHora(localISOTime);
  }, []);

  function handleNotaFiscalFile(e) {
    const file = e.target.files?.[0] || null;
    setNotaFiscalFile(file);
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!equipamento || !localizacao || !responsavel) {
      setErro("Preencha os campos obrigatórios!");
      return;
    }
    if ((tipo === "Entrada" || tipo === "Saída") && !motivo) {
      setErro("Informe o motivo.");
      return;
    }
    if (tipo === "Evento" && !evento) {
      setErro("Informe o tipo de evento.");
      return;
    }
    if (!observacao.trim()) {
      setErro("O campo de observação é obrigatório!");
      return;
    }

    const motivoFinal =
      tipo === "Evento"
        ? evento === "Outros"
          ? outroEvento
          : evento
        : motivo === "Outros"
        ? outroMotivo
        : motivo;

    // monta FormData – NÃO enviamos preview/base64!
    const fd = new FormData();
    fd.append("tipo", tipo);
    fd.append("equipamento", equipamento);
    fd.append("localizacao", localizacao);
    fd.append("responsavel", responsavel);
    fd.append("motivo", motivoFinal || "");
    fd.append("observacao", observacao);
    fd.append("dataHora", dataHora ? new Date(dataHora).toISOString() : new Date().toISOString());

    if (tipo === "Entrada") {
      fd.append("notaFiscal", notaFiscal || "");
      if (notaFiscalFile) fd.append("notaFiscalFile", notaFiscalFile);
      // ⚠️ NÃO enviar preview/base64 para o backend
      // if (previewUrl) fd.append("notaFiscalUrl", previewUrl)  -> NÃO FAÇA
    }

    try {
      const r = await fetch(`${API}/movimentacoes`, {
        method: "POST",
        body: fd,
      });
      if (!r.ok) throw new Error("Falha ao registrar movimentação");
      const nova = await r.json();

      // Atualiza a lista na home sem precisar dar F5
      onSalvarLocal?.(nova);
    } catch (err) {
      console.error(err);
      setErro("Erro ao salvar. Tente novamente.");
    }
  }

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="fw-bold mb-4">Registrar {tipo}</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        {/* Campos básicos */}
        <div className="mb-3">
          <label className="form-label">Equipamento *</label>
          <input
            className="form-control"
            value={equipamento}
            onChange={(e) => setEquipamento(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Localização *</label>
          <input
            className="form-control"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Responsável *</label>
          <input
            className="form-control"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            required
          />
        </div>

        {/* Motivo / Evento */}
        {tipo === "Entrada" && (
          <>
            <div className="mb-3">
              <label className="form-label">Motivo *</label>
              <select
                className="form-select"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                {motivosEntrada.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
              {motivo === "Outros" && (
                <input
                  className="form-control mt-2"
                  placeholder="Descreva o motivo"
                  value={outroMotivo}
                  onChange={(e) => setOutroMotivo(e.target.value)}
                  required
                />
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Nota Fiscal</label>
              <input
                className="form-control mb-2"
                placeholder="Número / código da NF"
                value={notaFiscal}
                onChange={(e) => setNotaFiscal(e.target.value)}
              />
              <input
                className="form-control"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleNotaFiscalFile}
              />
              {previewUrl && (
                <div className="mt-2">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-link"
                  >
                    Visualizar Nota
                  </a>
                </div>
              )}
            </div>
          </>
        )}

        {tipo === "Saída" && (
          <div className="mb-3">
            <label className="form-label">Motivo *</label>
            <select
              className="form-select"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {motivosSaida.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            {motivo === "Outros" && (
              <input
                className="form-control mt-2"
                placeholder="Descreva o motivo"
                value={outroMotivo}
                onChange={(e) => setOutroMotivo(e.target.value)}
                required
              />
            )}
          </div>
        )}

        {tipo === "Evento" && (
          <div className="mb-3">
            <label className="form-label">Tipo de Evento *</label>
            <select
              className="form-select"
              value={evento}
              onChange={(e) => setEvento(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {eventosPadrao.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            {evento === "Outros" && (
              <input
                className="form-control mt-2"
                placeholder="Descreva o evento"
                value={outroEvento}
                onChange={(e) => setOutroEvento(e.target.value)}
                required
              />
            )}
          </div>
        )}

        {/* Data/Hora */}
        <div className="mb-3">
          <label className="form-label">Data e Hora</label>
          <input
            className="form-control"
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            readOnly
          />
          <small className="form-text text-muted">Preenchido automaticamente.</small>
        </div>

        {/* Observação */}
        <div className="mb-3">
          <label className="form-label">Observação *</label>
          <textarea
            className={`form-control ${erro.includes("observação") ? "is-invalid" : ""}`}
            rows={3}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            required
          />
          {erro && <div className="invalid-feedback">Campo obrigatório</div>}
        </div>

        {erro && !erro.includes("observação") && (
          <div className="alert alert-danger">{erro}</div>
        )}

        <button className="btn btn-primary me-2" type="submit">
          Registrar
        </button>
        <button className="btn btn-secondary" type="button" onClick={onCancelar}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

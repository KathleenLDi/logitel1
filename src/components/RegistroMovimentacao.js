import React, { useState,useEffect  } from "react";

function RegistroMovimentacao({ tipo, onSalvar, onCancelar }) {
  const [equipamento, setEquipamento] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [motivo, setMotivo] = useState("");
  const [outroMotivo, setOutroMotivo] = useState("");
  const [notaFiscal, setNotaFiscal] = useState("");
  const [notaFiscalUrl, setNotaFiscalUrl] = useState("");
  const [notaFiscalFile, setNotaFiscalFile] = useState(null);
  const [observacao, setObservacao] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [evento, setEvento] = useState("");
  const [outroEvento, setOutroEvento] = useState("");
  const [erro, setErro] = useState("");
useEffect(() => {
  const agora = new Date();
  const localISOTime = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16); // "YYYY-MM-DDTHH:mm"
  setDataHora(localISOTime);
}, []);

  const motivosEntrada = ["Compra", "Empréstimo para outro setor", "Outros"];
  const motivosSaida = ["Manutenção", "Empréstimo para outro setor", "Outros"];
  const eventosPadrao = ["Na praia", "Moto week", "Outros"];

  function handleNotaFiscalFile(e) {
    const file = e.target.files[0];
    setNotaFiscalFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNotaFiscalUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setNotaFiscalUrl("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!equipamento || !localizacao || !responsavel ||
      ((tipo === "Entrada" || tipo === "Saída") && !motivo) ||
      (tipo === "Evento" && !evento)) {
      setErro("Preencha todos os campos obrigatórios!");
      return;
    }

    if (!observacao.trim()) {
      setErro("O campo de observação é obrigatório!");
      return;
    }

    const motivoFinal = motivo === "Outros" ? outroMotivo : motivo;
    const eventoFinal = evento === "Outros" ? outroEvento : evento;

    onSalvar({
      tipo,
      equipamento,
      localizacao,
      responsavel,
      motivo: tipo === "Evento" ? eventoFinal : motivoFinal,
      notaFiscal: tipo === "Entrada" ? notaFiscal : undefined,
      notaFiscalUrl: tipo === "Entrada" ? notaFiscalUrl : undefined,
      observacao,
      dataHora: dataHora ? new Date(dataHora).toISOString() : new Date().toISOString(),
      devolvido: false
    });
  }

  return (
    <div className="flex-grow-1 p-5" style={{ background: "#f5f6fa" }}>
      <h2 className="fw-bold mb-4">Registrar {tipo}</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div className="mb-3">
          <label className="form-label">Equipamento *</label>
          <input className="form-control" value={equipamento} onChange={e => setEquipamento(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Localização *</label>
          <input className="form-control" value={localizacao} onChange={e => setLocalizacao(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Responsável *</label>
          <input className="form-control" value={responsavel} onChange={e => setResponsavel(e.target.value)} required />
        </div>

        {tipo === "Entrada" && (
          <>
            <div className="mb-3">
              <label className="form-label">Motivo *</label>
              <select className="form-select" value={motivo} onChange={e => setMotivo(e.target.value)} required>
                <option value="">Selecione</option>
                {motivosEntrada.map(op => <option key={op} value={op}>{op}</option>)}
              </select>
              {motivo === "Outros" && (
                <input className="form-control mt-2" placeholder="Descreva o motivo" value={outroMotivo} onChange={e => setOutroMotivo(e.target.value)} required />
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Nota Fiscal</label>
              <input className="form-control mb-2" placeholder="Número ou código da Nota Fiscal" value={notaFiscal} onChange={e => setNotaFiscal(e.target.value)} />
              <input className="form-control" type="file" accept="image/*,application/pdf" onChange={handleNotaFiscalFile} />
              {notaFiscalUrl && (
                <div className="mt-2">
                  <span className="me-2">Arquivo:</span>
                  <a href={notaFiscalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-link">Visualizar Nota</a>
                </div>
              )}
            </div>
          </>
        )}

        {tipo === "Saída" && (
          <div className="mb-3">
            <label className="form-label">Motivo *</label>
            <select className="form-select" value={motivo} onChange={e => setMotivo(e.target.value)} required>
              <option value="">Selecione</option>
              {motivosSaida.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
            {motivo === "Outros" && (
              <input className="form-control mt-2" placeholder="Descreva o motivo" value={outroMotivo} onChange={e => setOutroMotivo(e.target.value)} required />
            )}
          </div>
        )}

        {tipo === "Evento" && (
          <div className="mb-3">
            <label className="form-label">Tipo de Evento *</label>
            <select className="form-select" value={evento} onChange={e => setEvento(e.target.value)} required>
              <option value="">Selecione</option>
              {eventosPadrao.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
            {evento === "Outros" && (
              <input className="form-control mt-2" placeholder="Descreva o evento" value={outroEvento} onChange={e => setOutroEvento(e.target.value)} required />
            )}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Data e Hora</label>
          <input className="form-control" type="datetime-local" value={dataHora} readOnly/>
          <small className="form-text text-muted">Se não preencher, será usada a data/hora atual.</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Observação *</label>
          <textarea className={`form-control ${erro.includes("observação") ? "is-invalid" : ""}`} value={observacao} onChange={e => setObservacao(e.target.value)} rows={3} />
          {erro.includes("observação") && <div className="invalid-feedback">Campo obrigatório</div>}
        </div>

        {erro && !erro.includes("observação") && <div className="alert alert-danger">{erro}</div>}

        <button className="btn btn-primary me-2" type="submit">Registrar</button>
        <button className="btn btn-secondary" onClick={onCancelar} type="button">Cancelar</button>
      </form>
    </div>
  );
}

export default RegistroMovimentacao;

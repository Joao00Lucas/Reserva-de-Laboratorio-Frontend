import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from "date-fns/locale";

type Props = {
  onChange: (val: {
    dataInicio: Date | null;
    dataFim: Date | null;
    horaInicio: Date | null;
    horaFim: Date | null;
  }) => void;
};

export default function SeletorDataHora({ onChange }: Props) {
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<Date | null>(null);
  const [horaFim, setHoraFim] = useState<Date | null>(null);
  const [mostrarInputs, setMostrarInputs] = useState(false);
  const [resumoPronto, setResumoPronto] = useState(false);

  useEffect(() => {
    onChange({ dataInicio, dataFim, horaInicio, horaFim });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataInicio, dataFim, horaInicio, horaFim]);

  const formatarData = (data: Date | null) => {
    return data ? data.toLocaleDateString('pt-BR'): '';
  };

  const formatarHora = (data: Date | null) => {
    return data ? data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }): '';
  };

  const podeConfirmar = dataInicio && dataFim && horaInicio && horaFim;

  const confirmar = () => {
    if (podeConfirmar) {
      setMostrarInputs(false);
      setResumoPronto(true);
    }
  };

  return (
    <div className="w-[30rem] bg-[#dad8d8] rounded-lg p-1 text-[#414040]">
      {!mostrarInputs && !resumoPronto && (
        <button
          onClick={() => setMostrarInputs(true)}
          className="flex items-center gap-3 cursor-pointer">
          <i className="bx bx-calendar text-2xl"></i>
          <p>Selecionar data e hora</p>
        </button>
      )}

      {mostrarInputs && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label className="text-sm font-semibold">Data de Início</label>
              <DatePicker
                locale={ptBR}
                selected={dataInicio}
                onChange={(date: Date | null) => setDataInicio(date)}
                dateFormat="dd/MM/yyyy"
                className="w-full px-3 py-1 rounded-md border border-black focus:outline-none"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm font-semibold">Data de Fim</label>
              <DatePicker
                locale={ptBR}
                selected={dataFim}
                onChange={(date: Date | null) => setDataFim(date)}
                dateFormat="dd/MM/yyyy"
                minDate={dataInicio || undefined}
                className="w-full px-3 py-1 rounded-md border border-black focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label className="text-sm font-semibold">Hora de Início</label>
              <DatePicker
                locale={ptBR}
                selected={horaInicio}
                onChange={(time: Date | null) => setHoraInicio(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Início"
                dateFormat="HH:mm"
                className="w-full px-3 py-1 rounded-md border border-black focus:outline-none"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm font-semibold">Hora de Fim</label>
              <DatePicker
                locale={ptBR}
                selected={horaFim}
                onChange={(time: Date | null) => setHoraFim(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Fim"
                dateFormat="HH:mm"
                className="w-full px-3 py-1 rounded-md border border-black focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={confirmar}
              disabled={!podeConfirmar}
              className={`mt-2 px-4 py-1 rounded text-white ${
                podeConfirmar
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {resumoPronto && (
        <div onClick={() => setMostrarInputs(true)}
          className="flex flex-col gap-1 cursor-pointer">
          <div className="flex flex-row gap-6 items-center justify-evenly">
            <p>{formatarData(dataInicio)}</p>
            <p>{formatarData(dataFim)}</p>
          </div>

          {/* Linha de horários */}
          <div className="flex flex-row gap-6 items-center justify-evenly">
            <p>{formatarHora(horaInicio)}</p>
            <p>{formatarHora(horaFim)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

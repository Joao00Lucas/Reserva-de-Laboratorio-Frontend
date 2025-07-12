import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  onChange: (val: { tipo: 'nenhuma' | 'semanal'; dataFinal: Date | null }) => void;
};

export default function BlocoRepeticao({ onChange }: Props) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoRepeticao, setTipoRepeticao] = useState<'nenhuma' | 'semanal'>('nenhuma');
  const [dataFinal, setDataFinal] = useState<Date | null>(null);

  useEffect(() => {
    onChange({ tipo: tipoRepeticao, dataFinal });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoRepeticao, dataFinal]);

  const resumoSelecionado = () => {
    if (tipoRepeticao === 'nenhuma') return '(não repetir)';
    if (tipoRepeticao === 'semanal' && dataFinal) {
      const formatada = dataFinal.toLocaleDateString('pt-BR');
      return `(até ${formatada})`;
    }
    return '(a cada semana)';
  };

  return (
    <>
      <div
        onClick={() => setMostrarModal(true)}
        className="w-[30rem] flex items-center justify-between bg-[#dad8d8] rounded-lg pl-1 py-2 text-[#414040] cursor-pointer hover:bg-[#cfcfcf] transition"
      >
        <div className="flex items-center gap-3">
          <i className="bx bx-sort-alt-2 text-2xl"></i>
          <p className="text-base">Não repetir <span className="text-sm text-gray-600 ml-2">{resumoSelecionado()}</span></p>
        </div>
        <i className="bx bx-chevron-down text-2xl"></i>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-[30rem] shadow-lg flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-center">Repetição do agendamento</h2>

            <div className="flex justify-between gap-4">
              <button
                className={`flex-1 py-2 rounded-md cursor-pointer ${
                  tipoRepeticao === 'nenhuma' ? 'bg-[#14a840] hover:bg-[#24be5f] text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setTipoRepeticao('nenhuma')}
              >
                Não repetir
              </button>

              <button
                className={`flex-1 py-2 rounded-md cursor-pointer ${
                  tipoRepeticao === 'semanal' ? 'bg-[#14a840] hover:bg-[#24be5f] text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setTipoRepeticao('semanal')}
              >
                A cada semana
              </button>
            </div>

            {tipoRepeticao === 'semanal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repetir até:
                </label>
                <DatePicker
                  selected={dataFinal}
                  onChange={(date) => setDataFinal(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholderText="Escolha a data final"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition cursor-pointer"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition cursor-pointer"
                onClick={() => {
                  setMostrarModal(false);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

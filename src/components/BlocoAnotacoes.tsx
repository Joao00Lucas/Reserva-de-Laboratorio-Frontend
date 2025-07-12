import { useState, useEffect } from 'react';

type Props = {
  onChange: (texto: string) => void;
};

export default function BlocoAnotacoes({ onChange }: Props) {
  const [mostrarCampo, setMostrarCampo] = useState(false);
  const [anotacao, setAnotacao] = useState('');

  useEffect(() => {
    onChange(anotacao);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anotacao]);

  return (
    <div className="w-[30rem] flex flex-col gap-2">
      <div
        onClick={() => setMostrarCampo((prev) => !prev)}
        className="flex items-center bg-[#dad8d8] rounded-lg px-4 py-2 text-[#414040] gap-3 cursor-pointer hover:bg-[#cfcfcf] transition"
      >
        <i className="bx bx-file text-2xl"></i>
        <p>Anotações</p>
        <i className={`bx ${mostrarCampo ? 'bx-chevron-up' : 'bx-chevron-down'} ml-auto text-xl`} />
      </div>

      {mostrarCampo && (
        <textarea
          value={anotacao}
          onChange={(e) => setAnotacao(e.target.value)}
          placeholder="Digite suas observações..."
          className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      )}
    </div>
  );
}

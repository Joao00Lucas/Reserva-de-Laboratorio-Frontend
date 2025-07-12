import { useEffect, useState } from "react";
import ModalResponsavel from "./ModalResponsavel";
import ModalEstudante from "./ModalEstudante";

type Pessoa = {
  id: number;
  nome: string;
};

type ResponsavelAPI = {
  id: number;
  name: string;
};

type TurmaAPI = {
  id: number;
  name: string;
};

type Props = {
  setResponsavel: (res: Pessoa) => void;
  setEstudantes: (lista: Pessoa[]) => void;
};

export default function ResponsavelEstudantes({ setResponsavel, setEstudantes }: Props) {
  const [responsaveis, setResponsaveis] = useState<ResponsavelAPI[]>([]);
  const [turmas, setTurmas] = useState<TurmaAPI[]>([]);
  const [mostrarModalResponsavel, setMostrarModalResponsavel] = useState(false);
  const [mostrarModalTurma, setMostrarModalTurma] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch("http://localhost:5000/users"),
          fetch("http://localhost:5000/classes"),
        ]);

        setResponsaveis(await res1.json());
        setTurmas(await res2.json());
      } catch (error) {
        console.error("Erro ao carregar responsáveis ou turmas:", error);
      }
    };

    fetchData();
  }, []);

  const handleNovoResponsavel = (novo: ResponsavelAPI) => {
    setResponsaveis(prev => [...prev, novo]);
    setResponsavel({ id: novo.id, nome: novo.name });
  };

  const handleNovaTurma = (novaTurma: TurmaAPI) => {
    setTurmas(prev => [...prev, novaTurma]);
    const turmaAsPessoa: Pessoa = { id: novaTurma.id, nome: novaTurma.name };
    setEstudantes([turmaAsPessoa]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-[30rem] flex items-center justify-between bg-[#dad8d8] rounded-lg p-1 text-[#414040] gap-3">
        <div className="flex items-center gap-3">
          <i className="bx bx-user text-2xl"></i>
          <p>Responsável</p>
        </div>
        <div className="flex gap-2">
          <select
            onChange={(e) => {
              const selected = responsaveis.find(r => r.id === Number(e.target.value));
              if (selected) setResponsavel({ id: selected.id, nome: selected.name });
            }}
            className="bg-[#14a840] text-white px-2 rounded w-[7.5rem]"
          >
            <option key="default" value="">Selecionar</option>
            {responsaveis.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button
            className="px-3 py-1 bg-[#14a840] text-white rounded hover:bg-[#24be5f] text-sm cursor-pointer"
            onClick={() => setMostrarModalResponsavel(true)}
          >
            Cadastrar
          </button>
        </div>
      </div>

      <div className="w-[30rem] flex items-center justify-between bg-[#dad8d8] rounded-lg p-1 text-[#414040] gap-3">
        <div className="flex items-center gap-3">
          <i className="bx bx-group text-2xl"></i>
          <p>Turma</p>
        </div>
        <div className="flex gap-2">
          <select
            onChange={(e) => {
              const selected = turmas.find(t => t.id === Number(e.target.value));
              if (selected) {
                const turmaAsPessoa: Pessoa = { id: selected.id, nome: selected.name };
                setEstudantes([turmaAsPessoa]);
              }
            }}
            className="bg-[#14a840] text-white px-2 rounded w-[7.5rem]"
          >
            <option key="default" value="">Selecionar</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button
            className="px-3 py-1 bg-[#14a840] text-white rounded hover:bg-[#24be5f] text-sm cursor-pointer"
            onClick={() => setMostrarModalTurma(true)}
          >
            Cadastrar
          </button>
        </div>
      </div>

      {mostrarModalResponsavel && (
        <ModalResponsavel
          onClose={() => setMostrarModalResponsavel(false)}
          onCreate={handleNovoResponsavel}
        />
      )}
      {mostrarModalTurma && (
        <ModalEstudante
          onClose={() => setMostrarModalTurma(false)}
          onCreate={handleNovaTurma}
        />
      )}
    </div>
  );
}

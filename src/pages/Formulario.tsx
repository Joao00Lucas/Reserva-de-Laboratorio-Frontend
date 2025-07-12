import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SeletorDataHora from '../components/Datepicker';
import ResponsavelEstudantes from '../components/Responsavel_estudante';
import BlocoTodoDia from '../components/BlocoTodoDia';
import BlocoRepeticao from '../components/NaoRepetir';
import BlocoAnotacoes from '../components/BlocoAnotacoes';
import CalendarioAgendamentos from '../components/CalendarioAgendamento';

type IntervaloTempo = {
  dataInicio: Date | null;
  dataFim: Date | null;
  horaInicio: Date | null;
  horaFim: Date | null;
};

type Pessoa = {
  id: number;
  nome: string;
};

type Repeticao = {
  tipo: 'nenhuma' | 'semanal';
  dataFinal: Date | null;
};

type ReservaAPI = {
  id: number;
  start: string;
  end: string;
  day: string;
  responsible: string;
  class_group: string;
  students: string[];
};

function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

function Formulario() {
  const navigate = useNavigate();

  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horariosDoDia, setHorariosDoDia] = useState<string[]>([]);
  const [todoDia, setTodoDia] = useState(false);
  const [intervaloTempo, setIntervaloTempo] = useState<IntervaloTempo>({
    dataInicio: null,
    dataFim: null,
    horaInicio: null,
    horaFim: null
  });
  const [laboratorio, setLaboratorio] = useState('');
  const [responsavel, setResponsavel] = useState<Pessoa | null>(null);
  const [estudantes, setEstudantes] = useState<Pessoa[]>([]);
  const [repeticao, setRepeticao] = useState<Repeticao>({ tipo: 'nenhuma', dataFinal: null });
  const [anotacoes, setAnotacoes] = useState('');
  const [labs, setLabs] = useState<{ id: string, name: string }[]>([]);
  const [agendamentos, setAgendamentos] = useState<{ data: Date; horarios: string[] }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const labsRes = await fetch("http://localhost:5000/labs");
        setLabs(await labsRes.json());
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (labs.length > 0 && laboratorio === '') {
      setLaboratorio(labs[0].id);
    }
  }, [labs, laboratorio]);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      if (!laboratorio) return;
      try {
        const res = await fetch(`http://localhost:5000/reservations?labId=${laboratorio}`);
        const data = await res.json();

        const agendamentosFormatados: { [key: string]: string[] } = {};

        (data as ReservaAPI[]).forEach((reserva) => {
          const dataStr = reserva.day;

          const dtInicio = new Date(reserva.start);
          const dtFim = new Date(reserva.end);

          const horaInicio = dtInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const horaFim = dtFim.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const horarioCompleto = `${horaInicio} - ${horaFim}`;

          if (!agendamentosFormatados[dataStr]) {
            agendamentosFormatados[dataStr] = [];
          }
          agendamentosFormatados[dataStr].push(horarioCompleto);
        });

        const resultado = Object.entries(agendamentosFormatados).map(([dataStr, horarios]) => {
          const [ano, mes, dia] = dataStr.split('-').map(Number);
          const data = new Date(ano, mes - 1, dia, 12, 0, 0);
          return { data, horarios };
        });

        setAgendamentos(resultado);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
      }
    };
    fetchAgendamentos();
  }, [laboratorio]);

  const handleSelecionarData = (data: Date) => {
    setDataSelecionada(data);
    const agendamento = agendamentos.find((item) => item.data.toDateString() === data.toDateString());
    setHorariosDoDia(agendamento ? agendamento.horarios : []);
  };

  const handleSubmit = async () => {
    if (
      !intervaloTempo.dataInicio ||
      !intervaloTempo.horaInicio ||
      !laboratorio ||
      !responsavel
    ) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const startTime = new Date(intervaloTempo.dataInicio);
    startTime.setHours(intervaloTempo.horaInicio.getHours());
    startTime.setMinutes(intervaloTempo.horaInicio.getMinutes());

    const endTime = intervaloTempo.dataFim && intervaloTempo.horaFim
      ? new Date(intervaloTempo.dataFim)
      : new Date(intervaloTempo.dataInicio);

    if (intervaloTempo.horaFim) {
      endTime.setHours(intervaloTempo.horaFim.getHours());
      endTime.setMinutes(intervaloTempo.horaFim.getMinutes());
    }

    const payload = {
      labId: laboratorio,
      responsible: responsavel.nome,
      students: estudantes.map(est => est.id),
      startTime: formatDateTimeLocal(startTime),
      endTime: formatDateTimeLocal(endTime),
      notes: anotacoes,
      todoDay: todoDia,
      repeatWeekly: repeticao.tipo === 'semanal',
      repeatUntil: repeticao.tipo === 'semanal' && repeticao.dataFinal
        ? formatDateTimeLocal(repeticao.dataFinal)
        : null
    };

    try {
      const response = await fetch("http://localhost:5000/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Agendamento realizado com sucesso!");
        navigate("/laboratorios");
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro na comunicação com o servidor");
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex justify-center items-center">
      <div className="relative w-4/5 h-full pb-2 flex flex-col gap-8">
        <button
          onClick={() => navigate('/laboratorios')}
          className="absolute left-4 pt-1 flex gap-2 text-gray-600 hover:text-black text-lg bg-transparent cursor-pointer"
        >
          <i className="bx bx-arrow-back text-2xl"></i>
          <span>Voltar</span>
        </button>

        <div className="w-full mt-10 flex h-full gap-4 px-4">
          <div className="w-1/2 border-r pr-4 overflow-y-auto items-center">
            <CalendarioAgendamentos
              aoSelecionarData={handleSelecionarData}
            />

            {dataSelecionada && (
              <div className="mt-4 p-3 bg-gray-100 rounded shadow-sm">
                <p className="text-sm text-gray-600 mb-2">
                  Horários agendados em <strong>{dataSelecionada.toLocaleDateString()}</strong>:
                </p>
                {horariosDoDia.length > 0 ? (
                  <ul className="text-green-700 text-sm list-disc list-inside">
                    {horariosDoDia.map((hora, idx) => (
                      <li key={idx}>{hora}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Nenhum horário agendado.</p>
                )}
              </div>
            )}
          </div>

          <div className="w-1/2 pl-4 overflow-y-auto flex flex-col items-center gap-4" id="formulario-agendamento">
            <BlocoTodoDia value={todoDia} onChange={setTodoDia} />
            <SeletorDataHora onChange={setIntervaloTempo} />

            <div className="w-[30rem] flex items-center bg-[#dad8d8] rounded-lg p-1 text-[#414040] gap-3">
              <i className="bx bxs-flask text-2xl"></i>
              <select
                value={laboratorio}
                onChange={(e) => setLaboratorio(e.target.value)}
                required
                className="w-full bg-transparent text-[#414040] text-base font-normal outline-none"
              >
                <option value="">Laboratório</option>
                {labs.map(lab => (
                  <option key={lab.id} value={lab.id}>{lab.name}</option>
                ))}
              </select>
            </div>

            <ResponsavelEstudantes
              setResponsavel={setResponsavel}
              setEstudantes={setEstudantes}
            />
            <BlocoRepeticao onChange={setRepeticao} />
            <BlocoAnotacoes onChange={setAnotacoes} />
            <p className="text-gray-400">(GMT-4) Horário do Mato Grosso do Sul</p>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-[30rem] py-2 rounded bg-[#14a840] text-white font-semibold hover:bg-[#24be5f] transition cursor-pointer"
            >
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Formulario;

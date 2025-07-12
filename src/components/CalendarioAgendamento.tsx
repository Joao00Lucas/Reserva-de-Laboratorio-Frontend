import DatePicker from "react-datepicker";
import { useState } from "react";
import "../assets/datepicker.css";
import { ptBR } from "date-fns/locale";

type Props = {
  aoSelecionarData: (data: Date) => void;
};

export default function CalendarioAgendamentos({ aoSelecionarData }: Props) {
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);

  return (
    <div className="bg-white rounded-lg flex justify-center">
      <DatePicker
        calendarClassName="calendario-agendamento"
        locale={ptBR}
        selected={dataSelecionada}
        onChange={(date) => {
          setDataSelecionada(date);
          aoSelecionarData(date!);
        }}
        inline
        renderDayContents={(day) => <span>{day}</span>}
      />
    </div>
  );
}

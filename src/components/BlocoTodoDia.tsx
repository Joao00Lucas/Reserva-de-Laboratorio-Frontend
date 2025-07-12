type Props = {
  value: boolean;
  onChange: (val: boolean) => void;
};

export default function BlocoTodoDia({value, onChange}: Props) {

  return (
    <div onClick={() => onChange(!value)} className="w-[30rem] flex items-center bg-[#dad8d8] rounded-lg text-[#414040] gap-3 cursor-pointer">
      <i className="bx bx-time-five text-2xl p-1"></i>
      <p>Todo o dia</p>
      <i className={`bx ${value ? 'bx-toggle-right text-green-600' : 'bx-toggle-left text-gray-500'} text-4xl ml-auto cursor-pointer transition-all duration-300 pr-1`}
      ></i>
    </div>
  );
}

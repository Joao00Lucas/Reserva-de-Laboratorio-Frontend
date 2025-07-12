import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreate: (novaTurma: { id: number; name: string }) => void;
};

export default function ModalEstudante({ onClose, onCreate }: Props) {
  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-xl relative">
        <h2 className="text-xl font-semibold mb-4">Cadastrar Turma</h2>

        <input
          type="text"
          placeholder="Nome da Turma"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
        />

        <input
          type="text"
          placeholder="Curso"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button
            onClick={async () => {
              if (nome.trim() && curso.trim()) {
                try {
                  const res = await fetch("http://localhost:5000/admin/classes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: nome, course: curso }),
                    credentials: 'include'
                  });

                  if (!res.ok) {
                    const erroTexto = await res.text();
                    throw new Error(`Erro ${res.status}: ${erroTexto}`);
                  }

                  const nova = await res.json();
                  onCreate(nova);
                  onClose();
                } catch (err) {
                  console.error("Erro ao criar turma:", err);
                  alert("Erro ao criar turma");
                }
              } else {
                alert("Preencha todos os campos.");
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}

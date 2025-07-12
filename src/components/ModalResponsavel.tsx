import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreate: (novoResponsavel: { id: number; name: string }) => void;
};

export default function ModalResponsavel({ onClose, onCreate }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-xl relative">
        <h2 className="text-xl font-semibold mb-4">Cadastrar Responsável</h2>

        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"/>

        <input
          type="email"
          placeholder="E-mail institucional"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"/>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button
            onClick={async () => {
              if (nome.trim() && email.trim()) {
                try {
                  const res = await fetch("http://localhost:5000/admin/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: nome, email: email, password: "123", status: false }),
                  });

                  if (res.status === 409) {
                    alert("Email já cadastrado!");
                    return;
                  }

                  if (!res.ok) throw new Error("Erro ao criar")

                  const novoResponsavel = { id: Date.now(), name: nome };
                  onCreate(novoResponsavel);
                  onClose();
                } catch (err) {
                  console.error("Erro ao criar responsável:", err);
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Lab = {
  id: number;
  name: string;
  type: string;
};

function Labs() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filter, setFilter] = useState("Tudo"); 

  useEffect(() => {
      const fetchLabs = async () => {
        try {
          const response = await fetch("http://localhost:5000/labs/", {
            method: 'GET',
            headers: { 
              "Content-Type": "application/json"
            },
            credentials: 'include'
          });
          const data = await response.json();
          setLabs(data);
        } catch (error) {
          console.error("Erro ao carregar laboratórios:", error);
        }
      };
      fetchLabs();
    }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/labs/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ name: nome, type: tipo })
      });

      if (response.ok) {
        const newLab = await response.json();
        setLabs([...labs, newLab]);
        setNome("");
        setTipo("");
        setShowModal(false);
        const refreshResponse = await fetch("http://localhost:5000/labs/", {
          credentials: 'include'
        });
        setLabs(await refreshResponse.json());
      } else {
        alert("Erro ao cadastrar laboratório");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const filteredLabs = filter === "Tudo" 
    ? labs 
    : labs.filter(lab => lab.type === filter);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col justify-center items-center overflow-hidden">
      <div className="w-[70%] h-[80%] flex flex-col">
        <section className="w-full h-12 flex mt-4 justify-start border-b border-[#9e9d9d] overflow-x-auto">
          {["Tudo", "Hotel Tecnológico", "IF Maker", "Eletrotécnica", "Informática", "Incubadora", "Container"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`h-6 px-2 ml-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                filter === item 
                  ? "bg-[#14a840] text-white" 
                  : "bg-[#dfdcdc] text-black hover:bg-[#14a840] hover:text-white"
              }`}>
              {item}
            </button>
          ))}
        </section>

        <div className="w-full h-[22rem] flex flex-col items-center gap-4 overflow-y-auto mt-4">
          {filteredLabs.map((lab) => (
            <div
              key={lab.id}
              className="w-[50rem] h-20 flex items-center justify-between bg-[#f0f0f0] rounded-2xl p-4 hover:shadow-md hover:shadow-gray-300 transition border border-gray-300"
            >
              <div className="h-20 flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-800">{lab.name}</h3>
                <p className="text-sm text-gray-600">{lab.type}</p>
              </div>
              <i 
                className="bx bx-calendar text-4xl hover:text-[#14a840] cursor-pointer" 
                onClick={() => navigate(`/agendar?labId=${lab.id}`)}
              ></i>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[70%] text-end mt-4">
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-full shadow-md transition cursor-pointer"
        >
          <i className="bx bx-plus send"></i>
          <span>Cadastrar Laboratório</span>
        </button>
      </div>

      <footer className="mt-6 text-sm text-center text-gray-500">
        <p>© 2025 IFMS - Todos os direitos reservados</p>
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[999]">
          <div className="bg-white p-8 rounded w-[25rem]">
            <h2 className="mt-0 mb-4 text-[#18181b] text-xl font-semibold">Cadastrar Laboratório</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-4 text-[#18181b]">
                Nome:
                <input
                  type="text"
                  className="w-full mt-1 p-2 rounded border border-[#ccc]"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </label>
              <label className="block mb-4 text-[#18181b]">
                Tipo:
                <select
                  className="w-full mt-1 p-2 rounded border border-[#ccc]"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Hotel Tecnológico">Hotel Tecnológico</option>
                  <option value="IF Maker">IF Maker</option>
                  <option value="Eletrotécnica">Eletrotécnica</option>
                  <option value="Informática">Informática</option>
                  <option value="Incubadora">Incubadora</option>
                  <option value="Container">Container</option>
                </select>
              </label>
              <div className="flex justify-end gap-4 mt-4">
                <button type="submit" className="px-4 py-2 rounded bg-[#14a840] text-white font-semibold">
                  Salvar
                </button>
                <button 
                  type="button" 
                  className="px-4 py-2 rounded bg-[#ccc] font-semibold" 
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Labs;

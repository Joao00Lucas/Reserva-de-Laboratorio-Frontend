import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }
      
      const data = await response.json();

      if (response.ok) {

        localStorage.setItem("usuario", JSON.stringify({
          email,
          isAdmin: data.isAdmin
        }));
        navigate("/laboratorios");
      } else {

        setErro(data.message || "Erro ao fazer login");
      }
    } catch (err) {
      setErro("Erro ao conectar com o servidor");
      console.error(err);
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <img src="/ifms_logo.png" alt="Logo da instituição" className="w-40 h-32 mb-8"/>

      <form onSubmit={handleLogin} className="w-80 p-6 rounded">

        {erro && <p className="text-red-400 mb-4 text-sm">{erro}</p>}

        <label className="block mb-4">
          <input
            className="w-full mt-1 p-2 rounded bg-gray-100 text-gray-900 text-base"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            required
          />
        </label>

        <label className="block mb-4">
          <input
            className="w-full mt-1 p-2 rounded bg-gray-100 text-gray-900 text-base"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />
        </label>

        <p className="w-full flex justify-end -mt-2 mb-4">
        <a href="#" className="text-green-600 underline hover:text-green-500 text-sm">Esqueci minha senha</a>
        </p>

        <button type="submit" className="w-full py-2 rounded text-white font-semibold bg-green-600 hover:bg-green-500 mb-12">Entrar</button>

        <div className="text-center text-sm text-gray-500">
          Não tem uma conta?{" "}
          <a href="#" className="text-green-600 hover:text-green-500 underline">
          Cadastre-se
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;


// admin@estudante.ifms.edu.br
// Senha@123

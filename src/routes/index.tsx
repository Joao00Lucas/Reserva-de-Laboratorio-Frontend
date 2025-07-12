import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Labs from "../pages/Labs";
import Formulario from "../pages/Formulario";
import Calendar from "../pages/Calendar";
import { PrivateRoute } from "./PrivateRoute";

export function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/laboratorios" element={<PrivateRoute><Labs /></PrivateRoute>} />
        <Route path="/agendar/" element={<PrivateRoute><Formulario /></PrivateRoute>} />
        <Route path="/calendario/:labId" element={<PrivateRoute><Calendar /></PrivateRoute>} />
      </Routes>
  );
}

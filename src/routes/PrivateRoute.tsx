import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export function PrivateRoute({ children }: Props) {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

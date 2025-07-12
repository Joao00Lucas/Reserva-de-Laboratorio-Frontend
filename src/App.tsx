import {AppRoutes} from './routes'
import Header from "./components/Header";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const hideHeader = location.pathname === "/";
  return (
    <div>
      {!hideHeader && <Header />}
      <AppRoutes />
    </div>
  );
}

export default App;

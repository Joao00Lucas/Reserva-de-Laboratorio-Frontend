import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import './assets/index.css'
import './assets/labs.css'
import './assets/form.css'
import 'boxicons/css/boxicons.min.css';
import { BrowserRouter } from "react-router";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

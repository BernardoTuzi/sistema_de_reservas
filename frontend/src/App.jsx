import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import IniciarReserva from './pages/IniciarReserva';
import Calendario from './pages/Calendario';
import EsqueciSenha from './pages/EsqueciSenha.jsx';
import MinhasReservas from './pages/MinhasReservas';
import Relatorio from './pages/Relatorio';

function App() {
  return (
    <Routes>
      {/* Rota padrão: vai para o Login */}
      <Route path="/" element={<Login />} />
      
      {/* Rotas do Sistema */}
      <Route path="/home" element={<Home />} />
      <Route path="/reservar" element={<IniciarReserva />} />
      <Route path="/calendario" element={<Calendario />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/minhas-reservas" element={<MinhasReservas />} />
      <Route path="/relatorios" element={<Relatorio />} />
    </Routes>
  );
}

export default App;
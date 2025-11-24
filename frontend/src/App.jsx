import { Routes, Route } from 'react-router-dom';

// Contexto de Tema (Dark Mode)
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

// Páginas Comuns e do Professor
import Login from './pages/Login';
import Home from './pages/Home';
import IniciarReserva from './pages/IniciarReserva';
import Calendario from './pages/Calendario';
import EsqueciSenha from './pages/EsqueciSenha';
import MinhasReservas from './pages/MinhasReservas';
import Relatorio from './pages/Relatorio';

// Páginas da Coordenação
import HomeCoordenacao from './pages/HomeCoordenacao';
import CadastrarUsuario from './pages/CadastrarUsuario';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import ReservaCoordenacao from './pages/ReservaCoordenacao';
import EditarUsuario from './pages/EditarUsuario';

function App() {
  return (
    <ThemeProvider>
      {/* O botão de trocar tema fica flutuando em TODAS as telas */}
      <ThemeToggle />

      <Routes>
        {/* Rota padrão: Login */}
        <Route path="/" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        
        {/* --- Rotas do Professor --- */}
        <Route path="/home" element={<Home />} />
        <Route path="/reservar" element={<IniciarReserva />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/minhas-reservas" element={<MinhasReservas />} />
        <Route path="/relatorios" element={<Relatorio />} />

        {/* --- Rotas da Coordenação --- */}
        <Route path="/home-coordenacao" element={<HomeCoordenacao />} />
        <Route path="/cadastrar-usuario" element={<CadastrarUsuario />} />
        <Route path="/gerenciar-usuarios" element={<GerenciarUsuarios />} />
        <Route path="/reserva-coordenacao" element={<ReservaCoordenacao />} />
        
        {/* Rota dinâmica para edição */}
        <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
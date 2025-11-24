import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: 'Arial', backgroundColor: '#f5f5f5' },
    card: { margin: 'auto', width: '900px', height: '600px', backgroundColor: '#fff', borderRadius: '10px', display: 'flex', overflow: 'hidden', boxShadow: '0 0 20px rgba(0,0,0,0.1)' },
    leftSide: { width: '250px', backgroundColor: '#A8CFA0', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    rightSide: { flex: 1, padding: '30px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    searchBar: { padding: '8px', borderRadius: '15px', border: '1px solid #ccc', width: '300px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { textAlign: 'left', borderBottom: '2px solid #ccc', padding: '10px', color: '#666' },
    td: { padding: '10px', borderBottom: '1px solid #eee' },
    navLink: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }
};

export default function GerenciarUsuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState('');

    useEffect(() => {
        api.get('/professores').then(res => setUsuarios(res.data));
    }, []);

    const usuariosFiltrados = usuarios.filter(u => 
        u.nomeProfessor.toLowerCase().includes(busca.toLowerCase())
    );

    const deletarUsuario = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este professor?")) {
            try {
                await api.delete(`/professores/${id}`);
                alert("Usuário excluído!");
                setUsuarios(usuarios.filter(u => u.idProfessor !== id));
            } catch (error) {
                alert("Erro ao excluir. Verifique se ele possui reservas ativas.");
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.leftSide}>
                    <h2>UNIRIO</h2>
                    <div>
                        <div style={styles.navLink} onClick={() => navigate('/home-coordenacao')}>🏠 PÁGINA INICIAL</div>
                        <div style={styles.navLink} onClick={() => navigate(-1)}>↩ VOLTAR</div>
                    </div>
                </div>
                <div style={styles.rightSide}>
                    <div style={styles.header}>
                        <h2 style={{color: '#555', fontWeight: 'normal'}}>Gerenciar Usuários</h2>
                    </div>
                    
                    <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <label>Buscar:</label>
                        <input 
                            style={styles.searchBar} 
                            placeholder="Digite o nome..." 
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    <div style={{height: '400px', overflowY: 'auto'}}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Nome</th>
                                    <th style={styles.th}>Matrícula</th>
                                    <th style={styles.th}>E-mail</th>
                                    <th style={styles.th}>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltrados.map(u => (
                                    <tr key={u.idProfessor}>
                                        <td style={styles.td}>{u.idProfessor}</td>
                                        <td style={styles.td}>{u.nomeProfessor}</td>
                                        <td style={styles.td}>{u.matriculaProfessor}</td>
                                        <td style={styles.td}>{u.emailProfessor}</td>
                                        <td style={styles.td}>
                                            <button style={{marginRight:'5px', cursor:'pointer'}} onClick={() => navigate(`/editar-usuario/${u.idProfessor}`)}>✏️</button>
                                            <button style={{color:'red', cursor:'pointer', border:'none', background:'none'}} onClick={() => deletarUsuario(u.idProfessor)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
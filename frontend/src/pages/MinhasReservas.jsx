import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' },
    sidebar: { width: '250px', backgroundColor: '#A8CFA0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    content: { flex: 1, padding: '40px', backgroundColor: '#fff' },
    title: { textAlign: 'right', fontWeight: 'normal', marginBottom: '40px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '15px', borderBottom: '2px solid #ddd', color: '#555' },
    td: { padding: '15px', borderBottom: '1px solid #eee' },
    btnCancelar: { backgroundColor: '#FFB3B3', border: 'none', padding: '5px 15px', borderRadius: '10px', cursor: 'pointer', color: '#333' }
};

export default function MinhasReservas() {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        const userStorage = localStorage.getItem('user');
        if (!userStorage) {
            navigate('/'); return;
        }
        const usuario = JSON.parse(userStorage);

        api.get(`/reservas/professor/${usuario.id}`)
            .then(res => setReservas(res.data))
            .catch(console.error);
    }, []);

    const handleCancelar = async (id) => {
        if (!window.confirm("Deseja cancelar esta reserva?")) return;

        try {
            await api.delete(`/reservas/${id}`);
            alert("Reserva cancelada!");
            setReservas(reservas.filter(r => r.id !== id));
        } catch (error) {
            alert(error.response.data);
        }
    };

    const formatarData = (dataISO) => {
        if (!dataISO) return "-";
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR') + ' - ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div>
                    <h1 style={{fontSize: '24px', margin: 0}}>UNIRIO</h1>
                    <p style={{fontSize: '12px'}}>Sistema de Reservas</p>
                </div>
                <div>
                    <div style={{marginBottom: '10px', cursor: 'pointer'}} onClick={() => navigate('/home')}>🏠 PÁGINA INICIAL</div>
                    <div style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>↩ VOLTAR</div>
                </div>
            </div>

            <div style={styles.content}>
                <h1 style={styles.title}>Minhas Reservas</h1>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Data/Hora</th>
                            <th style={styles.th}>Sala</th>
                            <th style={styles.th}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map(reserva => (
                            <tr key={reserva.id}>
                                <td style={styles.td}>#{reserva.id}</td>
                                <td style={styles.td}>{formatarData(reserva.dataReserva)}</td>
                                <td style={styles.td}>{reserva.sala?.nome || "Sala Removida"}</td>
                                <td style={styles.td}>
                                    <button style={styles.btnCancelar} onClick={() => handleCancelar(reserva.id)}>
                                        Cancelar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' },
    sidebar: { width: '250px', backgroundColor: '#A8CFA0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    content: { flex: 1, padding: '40px', backgroundColor: '#fff' },
    calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    controls: { marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' },
    dayLabel: { fontWeight: 'bold', marginBottom: '10px', color: '#555' },
    dayCell: { height: '100px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px', position: 'relative' },
    dayNumber: { fontSize: '18px', fontWeight: 'bold' },
    reservaVerde: { backgroundColor: '#B3FFB3', color: '#006400', fontSize: '12px', padding: '2px', borderRadius: '4px', width: '100%', marginTop: '2px' },
    reservaVermelha: { backgroundColor: '#FFB3B3', color: '#8B0000', fontSize: '12px', padding: '2px', borderRadius: '4px', width: '100%', marginTop: '2px' },
    navButton: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#333' }
};

export default function Calendario() {
    const navigate = useNavigate();
    
    const [dataAtual, setDataAtual] = useState(new Date());
    const [salas, setSalas] = useState([]);
    const [salaSelecionada, setSalaSelecionada] = useState('');
    
    const [minhasReservasDias, setMinhasReservasDias] = useState([]);
    const [diasLotados, setDiasLotados] = useState([]);

    // 1. Carregar lista de salas
    useEffect(() => {
        api.get('/salas').then(res => setSalas(res.data));
    }, []);

    // 2. Carregar dados do calendário (sempre que muda mês ou sala)
    useEffect(() => {
        const userStorage = localStorage.getItem('user');
        if (!userStorage) return;
        const usuario = JSON.parse(userStorage);
        const mes = dataAtual.getMonth(); // 0-11
        const ano = dataAtual.getFullYear();

        // A. Buscar "Minhas Reservas" (Verde)
        api.get(`/reservas/professor/${usuario.id}`).then(res => {
            const dias = res.data
                .map(r => new Date(r.dataReserva))
                .filter(d => d.getMonth() === mes && d.getFullYear() === ano)
                .map(d => d.getDate());
            setMinhasReservasDias(dias);
        });

        // B. Buscar "Dias Lotados" (Vermelho) - Só se tiver sala selecionada
        if (salaSelecionada) {
            // O backend espera mês 1-12, o JS usa 0-11, então somamos +1
            api.get(`/reservas/lotacao?salaId=${salaSelecionada}&mes=${mes + 1}&ano=${ano}`)
                .then(res => {
                    console.log("Dias lotados:", res.data);
                    setDiasLotados(res.data);
                })
                .catch(console.error);
        } else {
            setDiasLotados([]);
        }

    }, [dataAtual, salaSelecionada]);

    // Lógica de navegação e dias
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const diasTotais = new Date(ano, mes + 1, 0).getDate();
    const diaInicio = new Date(ano, mes, 1).getDay();
    const vazios = Array.from({ length: diaInicio });
    const dias = Array.from({ length: diasTotais }, (_, i) => i + 1);

    const mesAnterior = () => setDataAtual(new Date(ano, mes - 1, 1));
    const proximoMes = () => setDataAtual(new Date(ano, mes + 1, 1));

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
                {/* Filtro de Sala */}
                <div style={styles.controls}>
                    <label>Ver disponibilidade da Sala:</label>
                    <select 
                        onChange={(e) => setSalaSelecionada(e.target.value)} 
                        value={salaSelecionada}
                        style={{padding: '5px', borderRadius: '5px'}}
                    >
                        <option value="">Nenhuma (Ver apenas minhas reservas)</option>
                        {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                    </select>
                </div>

                <div style={styles.calendarHeader}>
                    <button style={styles.navButton} onClick={mesAnterior}>⬅</button>
                    <h1 style={{margin: 0}}>{meses[mes]} {ano}</h1>
                    <button style={styles.navButton} onClick={proximoMes}>➡</button>
                </div>

                <div style={styles.grid}>
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => <div key={d} style={styles.dayLabel}>{d}</div>)}
                    
                    {vazios.map((_, i) => <div key={`vazio-${i}`}></div>)}

                    {dias.map(dia => {
                        const souEu = minhasReservasDias.includes(dia);
                        const estaLotado = diasLotados.includes(dia);

                        return (
                            <div key={dia} style={styles.dayCell}>
                                <span style={styles.dayNumber}>{dia}</span>
                                {souEu && <div style={styles.reservaVerde}>Minha Reserva</div>}
                                {estaLotado && <div style={styles.reservaVermelha}>LOTADO</div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const styles = {
    container: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', fontFamily: 'Arial' },
    card: { display: 'flex', width: '900px', height: '600px', backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 20px rgba(0,0,0,0.1)' },
    leftSide: { flex: 1, backgroundColor: '#A8CFA0', padding: '40px', color: '#333', display: 'flex', flexDirection: 'column' },
    rightSide: { flex: 2, padding: '40px', display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' },
    input: { padding: '8px', borderRadius: '15px', border: '1px solid #ccc', width: '100%', marginBottom: '10px', display: 'block' },
    btnSalvar: { backgroundColor: '#5C8A58', color: '#fff', padding: '10px 30px', border: 'none', borderRadius: '20px', cursor: 'pointer', marginTop: '20px', alignSelf: 'flex-start' },
    sectionTitle: { marginTop: '30px', marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '5px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { textAlign: 'left', borderBottom: '2px solid #ccc', padding: '8px' },
    td: { padding: '8px', borderBottom: '1px solid #eee' },
    btnIcon: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', marginLeft: '5px' },
    
    // Modal Styles
    modalOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', width: '300px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }
};

export default function EditarUsuario() {
    const navigate = useNavigate();
    const { id } = useParams();
    
    // Dados principais
    const [form, setForm] = useState({ nomeProfessor: '', matriculaProfessor: '', emailProfessor: '', senhaProfessor: '' });
    const [reservas, setReservas] = useState([]);
    
    // Dados para o Modal de Edição
    const [salas, setSalas] = useState([]);
    const [equipamentos, setEquipamentos] = useState([]);
    const [reservaEditando, setReservaEditando] = useState(null); // Se não for null, o modal abre

    useEffect(() => {
        api.get(`/professores/${id}`).then(res => setForm(res.data));
        carregarReservas();
        
        // Carregar listas para o dropdown de edição
        api.get('/salas').then(res => setSalas(res.data));
        api.get('/equipamentos').then(res => setEquipamentos(res.data));
    }, [id]);

    const carregarReservas = () => {
        api.get(`/reservas/professor/${id}`).then(res => setReservas(res.data));
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSalvarUsuario = async () => {
        try {
            await api.put(`/professores/${id}`, form);
            alert("Dados atualizados com sucesso!");
        } catch (error) {
            alert("Erro ao atualizar.");
        }
    };

    const handleCancelarReserva = async (idReserva) => {
        if (!window.confirm("Cancelar esta reserva?")) return;
        try {
            await api.delete(`/reservas/${idReserva}?isCoordenacao=true`);
            alert("Reserva cancelada!");
            carregarReservas();
        } catch (error) {
            alert(error.response?.data);
        }
    };

    // --- LÓGICA DE EDIÇÃO ---
    const abrirModalEdicao = (reserva) => {
        // Preenche o modal com os dados atuais da reserva
        setReservaEditando({
            id: reserva.id,
            salaId: reserva.sala?.id || '',
            equipamentoId: reserva.equipamento?.id || ''
        });
    };

    const salvarEdicaoReserva = async () => {
        try {
            await api.put(`/reservas/${reservaEditando.id}`, {
                // Enviamos apenas o que mudou (Sala e Equipamento)
                // O backend mantém o resto
                sala: { id: reservaEditando.salaId },
                equipamento: reservaEditando.equipamentoId ? { id: reservaEditando.equipamentoId } : null
            });
            alert("Reserva alterada com sucesso!");
            setReservaEditando(null); // Fecha modal
            carregarReservas(); // Recarrega lista
        } catch (error) {
            alert(error.response?.data || "Erro ao editar. Verifique conflitos de horário.");
        }
    };

    const formatarData = (dataISO) => {
        if (!dataISO) return "-";
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Sidebar Esquerda */}
                <div style={styles.leftSide}>
                    <h2 style={{marginTop: 0}}>Editar Usuário</h2>
                    <p>Gerenciar professor e suas reservas.</p>
                    <p onClick={() => navigate(-1)} style={{cursor:'pointer', marginTop:'auto'}}>↩ Voltar</p>
                </div>
                
                {/* Conteúdo Direita */}
                <div style={styles.rightSide}>
                    
                    {/* Formulário Professor */}
                    <h3 style={{marginTop: 0}}>Dados Pessoais</h3>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                        <div><label>Nome:</label><input name="nomeProfessor" value={form.nomeProfessor} style={styles.input} onChange={handleChange} /></div>
                        <div><label>Matrícula:</label><input name="matriculaProfessor" value={form.matriculaProfessor} style={styles.input} onChange={handleChange} /></div>
                        <div><label>Email:</label><input name="emailProfessor" value={form.emailProfessor} style={styles.input} onChange={handleChange} /></div>
                        <div><label>Senha:</label><input name="senhaProfessor" type="password" value={form.senhaProfessor} style={styles.input} onChange={handleChange} /></div>
                    </div>
                    <button style={styles.btnSalvar} onClick={handleSalvarUsuario}>Salvar Alterações</button>

                    {/* Lista de Reservas */}
                    <h3 style={styles.sectionTitle}>Reservas do Professor</h3>
                    <div style={{flex: 1, overflowY: 'auto'}}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Data</th>
                                    <th style={styles.th}>Sala</th>
                                    <th style={styles.th}>Equip.</th>
                                    <th style={styles.th}>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map(r => (
                                    <tr key={r.id}>
                                        <td style={styles.td}>{formatarData(r.dataReserva)}</td>
                                        <td style={styles.td}>{r.sala?.nome}</td>
                                        <td style={styles.td}>{r.equipamento?.nome || "-"}</td>
                                        <td style={styles.td}>
                                            <button style={styles.btnIcon} title="Editar" onClick={() => abrirModalEdicao(r)}>✏️</button>
                                            <button style={{...styles.btnIcon, color:'red'}} title="Cancelar" onClick={() => handleCancelarReserva(r.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MODAL DE EDIÇÃO (Aparece se reservaEditando != null) */}
                    {reservaEditando && (
                        <div style={styles.modalOverlay}>
                            <div style={styles.modalContent}>
                                <h3>Editar Reserva #{reservaEditando.id}</h3>
                                
                                <label>Alterar Sala:</label>
                                <select 
                                    style={styles.input}
                                    value={reservaEditando.salaId}
                                    onChange={(e) => setReservaEditando({...reservaEditando, salaId: e.target.value})}
                                >
                                    {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                </select>

                                <label>Alterar Equipamento:</label>
                                <select 
                                    style={styles.input}
                                    value={reservaEditando.equipamentoId}
                                    onChange={(e) => setReservaEditando({...reservaEditando, equipamentoId: e.target.value})}
                                >
                                    <option value="">(Nenhum)</option>
                                    {equipamentos.map(eq => <option key={eq.id} value={eq.id}>{eq.nome}</option>)}
                                </select>

                                <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
                                    <button onClick={() => setReservaEditando(null)} style={{cursor:'pointer', border:'none', background:'none', textDecoration:'underline'}}>Cancelar</button>
                                    <button onClick={salvarEdicaoReserva} style={{backgroundColor:'#5C8A58', color:'white', border:'none', padding:'5px 15px', borderRadius:'10px', cursor:'pointer'}}>Salvar</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
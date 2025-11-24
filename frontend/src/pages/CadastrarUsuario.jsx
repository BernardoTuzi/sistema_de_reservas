import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = {
    container: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', fontFamily: 'Arial' },
    card: { display: 'flex', width: '800px', height: '500px', backgroundColor: '#fff', boxShadow: '0 0 20px rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden' },
    leftSide: { flex: 1, backgroundColor: '#A8CFA0', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#333' },
    rightSide: { flex: 1.5, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    title: { textAlign: 'right', fontSize: '24px', marginBottom: '30px', color: '#555' },
    inputGroup: { marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    label: { marginRight: '10px', fontWeight: 'bold', color: '#666' },
    input: { padding: '8px', borderRadius: '15px', border: '1px solid #ccc', width: '200px', backgroundColor: '#e0e0e0' },
    btnConfirmar: { backgroundColor: '#88B083', color: '#fff', border: 'none', padding: '10px 40px', borderRadius: '20px', fontSize: '16px', cursor: 'pointer', alignSelf: 'flex-end', marginTop: '20px' },
    navLink: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }
};

export default function CadastrarUsuario() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nomeProfessor: '', matriculaProfessor: '', emailProfessor: '', senhaProfessor: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await api.post('/professores', form);
            alert("USUÁRIO CADASTRADO COM SUCESSO! ✅");
            navigate('/home-coordenacao');
        } catch (error) {
            alert("FALHA AO CADASTRAR USUÁRIO! ❌\nVerifique as informações.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.leftSide}>
                    <div>
                        <h2 style={{margin:0}}>UNIRIO</h2>
                    </div>
                    <div>
                        <div style={styles.navLink} onClick={() => navigate('/home-coordenacao')}>🏠 PÁGINA INICIAL</div>
                        <div style={styles.navLink} onClick={() => navigate(-1)}>↩ VOLTAR</div>
                    </div>
                </div>
                <div style={styles.rightSide}>
                    <h2 style={styles.title}>Cadastrar Usuários</h2>
                    
                    {/* ID é automático, não precisa de campo */}
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome:</label>
                        <input name="nomeProfessor" style={styles.input} onChange={handleChange} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Matrícula:</label>
                        <input name="matriculaProfessor" style={styles.input} onChange={handleChange} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>E-mail:</label>
                        <input name="emailProfessor" style={styles.input} onChange={handleChange} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Senha:</label>
                        <input name="senhaProfessor" type="password" style={styles.input} onChange={handleChange} />
                    </div>

                    <button style={styles.btnConfirmar} onClick={handleSubmit}>Confirmar</button>
                </div>
            </div>
        </div>
    );
}
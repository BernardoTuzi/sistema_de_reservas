import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = {
    container: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#A8CFA0', fontFamily: 'Arial, sans-serif' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
    logo: { fontSize: '28px', color: '#333', marginBottom: '10px', fontWeight: 'bold' },
    subtitle: { fontSize: '14px', color: '#666', marginBottom: '30px' },
    inputGroup: { marginBottom: '15px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '5px', fontSize: '14px', color: '#333' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', backgroundColor: '#5C8A58', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' },
    link: { display: 'block', marginTop: '15px', fontSize: '14px', color: '#5C8A58', textDecoration: 'none', cursor: 'pointer' }
};

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async () => {
        if (!email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const response = await api.post('/auth/login', { email, senha });
            
            // Salva os dados do usuário no navegador para usar depois
            localStorage.setItem('user', JSON.stringify(response.data));
            
            navigate('/home');

        } catch (error) {
            console.error(error);
            alert("Email ou senha incorretos!");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.logo}>UNIRIO</h1>
                <p style={styles.subtitle}>Sistema de Reservas</p>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email</label>
                    <input 
                        type="email" 
                        placeholder="exemplo@unirio.br" 
                        style={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Senha</label>
                    <input 
                        type="password" 
                        placeholder="********" 
                        style={styles.input}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>

                <button style={styles.button} onClick={handleLogin}>
                    ENTRAR
                </button>

                <a style={styles.link} onClick={() => navigate('/esqueci-senha')}>
                    Esqueci minha senha
                </a>
            </div>
        </div>
    );
}
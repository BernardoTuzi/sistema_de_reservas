import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' },
    sidebar: { width: '250px', backgroundColor: '#A8CFA0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    content: { flex: 1, padding: '40px', backgroundColor: '#fff', overflowY: 'auto' },
    title: { textAlign: 'right', fontWeight: 'normal', marginBottom: '40px' },
    
    statsGrid: { display: 'flex', gap: '20px', marginBottom: '40px', alignItems: 'stretch' },
    
    // Card Padrão
    card: { flex: 1, padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    
    // Card da Lista (Mais largo para caber os detalhes)
    cardList: { flex: 2, padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column' },
    
    number: { fontSize: '36px', fontWeight: 'bold', color: '#5C8A58', margin: '10px 0' },
    label: { color: '#666', fontSize: '14px' },
    
    // Estilo da lista detalhada
    listContainer: { marginTop: '10px', maxHeight: '300px', overflowY: 'auto', textAlign: 'left', borderTop: '1px solid #ddd', paddingTop: '10px' },
    listItem: { marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '8px' },
    itemHeader: { fontSize: '15px', fontWeight: 'bold', color: '#333', marginBottom: '4px' },
    itemDetails: { fontSize: '13px', color: '#666', display: 'flex', gap: '15px', flexWrap: 'wrap' }
};

export default function Relatorio() {
    const navigate = useNavigate();
    
    const [estatisticas, setEstatisticas] = useState({
        total: 0,
        futurasQtd: 0,
        futurasLista: [], 
        salaFavorita: '-',
        usuarioTipo: ''
    });

    useEffect(() => {
        const userStorage = localStorage.getItem('user');
        if (!userStorage) return;
        const usuario = JSON.parse(userStorage);

        let url = '';
        if (usuario.tipo === 'COORDENACAO') {
            url = '/reservas'; 
        } else {
            url = `/reservas/professor/${usuario.id}`;
        }

        api.get(url)
            .then(res => {
                const reservas = res.data;
                
                // 1. Total
                const total = reservas.length;

                // 2. Futuras (Detalhes completos)
                const agora = new Date();
                const reservasFuturas = reservas.filter(r => new Date(r.dataReserva) > agora);
                
                // Mapear os dados para o formato que a tela precisa
                const listaDetalhada = reservasFuturas.map(r => {
                    const dataObj = new Date(r.dataReserva);
                    const dia = dataObj.toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit', year:'2-digit'});
                    const hora = dataObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
                    
                    const nomeSala = r.sala ? r.sala.nome : 'Sala removida';
                    // Nome do professor responsável (importante para a coordenação ver)
                    const nomeProf = r.professor ? r.professor.nomeProfessor : 'Desconhecido';
                    
                    // Equipamento: Conta 1 se tiver objeto, 0 se for null
                    const temEquip = r.equipamento ? true : false;
                    const nomeEquip = r.equipamento ? r.equipamento.nome : '';
                    const qtdEquip = temEquip ? 1 : 0;

                    return {
                        id: r.id,
                        cabecalho: `${dia} às ${hora} - ${nomeSala}`,
                        responsavel: nomeProf,
                        equipamentoInfo: temEquip ? `${qtdEquip} (${nomeEquip})` : '0'
                    };
                });

                // 3. Sala Favorita
                const contagemSalas = {};
                reservas.forEach(r => {
                    const nome = r.sala ? r.sala.nome : 'Indefinida';
                    contagemSalas[nome] = (contagemSalas[nome] || 0) + 1;
                });

                let salaTop = '-';
                let maxUso = 0;
                for (const [nome, uso] of Object.entries(contagemSalas)) {
                    if (uso > maxUso) {
                        maxUso = uso;
                        salaTop = nome;
                    }
                }

                setEstatisticas({
                    total,
                    futurasQtd: reservasFuturas.length,
                    futurasLista: listaDetalhada,
                    salaFavorita: salaTop,
                    usuarioTipo: usuario.tipo
                });
            })
            .catch(console.error);
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div>
                    <h1 style={{fontSize: '24px', margin: 0}}>UNIRIO</h1>
                    <p style={{fontSize: '12px'}}>
                        {estatisticas.usuarioTipo === 'COORDENACAO' ? 'Área da Coordenação' : 'Sistema de Reservas'}
                    </p>
                </div>
                <div>
                    <div 
                        style={{marginBottom: '10px', cursor: 'pointer'}} 
                        onClick={() => navigate(estatisticas.usuarioTipo === 'COORDENACAO' ? '/home-coordenacao' : '/home')}
                    >
                        🏠 PÁGINA INICIAL
                    </div>
                    <div style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                        ↩ VOLTAR
                    </div>
                </div>
            </div>

            <div style={styles.content}>
                <h1 style={styles.title}>
                    Relatórios de Uso {estatisticas.usuarioTipo === 'COORDENACAO' ? '(Visão Geral)' : '(Individual)'}
                </h1>

                <div style={styles.statsGrid}>
                    {/* Card 1: Total */}
                    <div style={styles.card}>
                        <h3>Total de Reservas</h3>
                        <p style={styles.number}>{estatisticas.total}</p>
                        <p style={styles.label}>Histórico completo</p>
                    </div>

                    {/* Card 2: Lista Detalhada (O que você pediu) */}
                    <div style={styles.cardList}>
                        <h3 style={{textAlign: 'center'}}>Próximas Aulas ({estatisticas.futurasQtd})</h3>
                        
                        <div style={styles.listContainer}>
                            {estatisticas.futurasLista.length > 0 ? (
                                estatisticas.futurasLista.map((item) => (
                                    <div key={item.id} style={styles.listItem}>
                                        <div style={styles.itemHeader}> {item.cabecalho}</div>
                                        <div style={styles.itemDetails}>
                                            <span>👤 <b>Resp:</b> {item.responsavel}</span>
                                            <span>📽️ <b>Equipamentos:</b> {item.equipamentoInfo}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{textAlign: 'center', color: '#999', marginTop: '20px'}}>Nenhuma aula futura.</p>
                            )}
                        </div>
                    </div>

                    {/* Card 3: Favorita */}
                    <div style={styles.card}>
                        <h3>Sala Mais Usada</h3>
                        <p style={{...styles.number, fontSize: '24px'}}>{estatisticas.salaFavorita}</p>
                        <p style={styles.label}>Estatística de uso</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
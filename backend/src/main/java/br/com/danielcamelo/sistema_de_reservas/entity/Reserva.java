package br.com.danielcamelo.sistema_de_reservas.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "RESERVA")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idReserva")
    private Integer id;

    @Column(name = "data", nullable = false)
    private LocalDateTime data;

    @Column(name = "relatorio")
    private String relatorio;

    @Enumerated(EnumType.STRING)
    @Column(name = "criadaPor", nullable = false)
    private TipoCriador criadaPor;

    // --- RELACIONAMENTOS (FKs) ---

    @ManyToOne
    @JoinColumn(name = "fk_idSala", nullable = false)
    private Sala sala;

    @ManyToOne
    @JoinColumn(name = "fk_idProfessor", nullable = false)
    private Professor professor;

    @ManyToOne
    @JoinColumn(name = "fk_idCoordenacao", nullable = true) // Opcional
    private Coordenacao coordenacao;

    // CORREÇÃO PRINCIPAL: Equipamento no singular (Muitos-para-Um)
    // Uma reserva tem UM equipamento associado (conforme sua FK fk_idEquipamento)
    @ManyToOne
    @JoinColumn(name = "fk_idEquipamento")
    private Equipamento equipamento;

    // --- Construtor Vazio ---
    public Reserva() {
    }

    // --- Getters e Setters ---

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getDataReserva() {
        return data;
    }

    public void setDataReserva(LocalDateTime dataReserva) {
        this.data = dataReserva;
    }

    public String getRelatorio() {
        return relatorio;
    }

    public void setRelatorio(String relatorio) {
        this.relatorio = relatorio;
    }

    public TipoCriador getCriadaPor() {
        return criadaPor;
    }

    public void setCriadaPor(TipoCriador criadaPor) {
        this.criadaPor = criadaPor;
    }

    public Sala getSala() {
        return sala;
    }

    public void setSala(Sala sala) {
        this.sala = sala;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }

    public Coordenacao getCoordenacao() {
        return coordenacao;
    }

    public void setCoordenacao(Coordenacao coordenacao) {
        this.coordenacao = coordenacao;
    }

    public Equipamento getEquipamento() {
        return equipamento;
    }

    public void setEquipamento(Equipamento equipamento) {
        this.equipamento = equipamento;
    }
}
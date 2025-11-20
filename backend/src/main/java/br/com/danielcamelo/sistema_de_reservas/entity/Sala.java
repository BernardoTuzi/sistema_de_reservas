package br.com.danielcamelo.sistema_de_reservas.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "SALA")
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idSala") // Nome exato no banco
    private Integer id;

    @Column(name = "nomeSala", nullable = false) // Nome exato
    private String nome;

    @Column(name = "capacidadeSala") // Nome exato
    private Integer capacidade;

    @OneToMany(mappedBy = "sala")
    @JsonIgnore
    private Set<Reserva> reservas;

    // --- Construtor Vazio ---
    public Sala() {
    }

    // --- Getters e Setters ---

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(Integer capacidade) {
        this.capacidade = capacidade;
    }

    public Set<Reserva> getReservas() {
        return reservas;
    }

    public void setReservas(Set<Reserva> reservas) {
        this.reservas = reservas;
    }
}
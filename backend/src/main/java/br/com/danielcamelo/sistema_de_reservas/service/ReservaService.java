package br.com.danielcamelo.sistema_de_reservas.service;

import br.com.danielcamelo.sistema_de_reservas.entity.Reserva;
import br.com.danielcamelo.sistema_de_reservas.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }

    public Reserva buscarPorId(Integer id) {
        return reservaRepository.findById(id).orElse(null);
    }

    public Reserva criarReserva(Reserva novaReserva) {
        if (novaReserva.getDataReserva() == null) {
            throw new RuntimeException("A data da reserva é obrigatória.");
        }

        if (novaReserva.getDataReserva().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Não é possível criar uma reserva para uma data passada.");
        }

        List<Reserva> reservasDoProf = reservaRepository.findByProfessor(novaReserva.getProfessor());

        long reservasFuturas = reservasDoProf.stream()
                .filter(r -> r.getDataReserva().isAfter(LocalDateTime.now()))
                .count();

        if (reservasFuturas >= 2) {
            throw new RuntimeException("Este professor já atingiu o limite de 2 reservas futuras.");
        }

        return reservaRepository.save(novaReserva);
    }
}
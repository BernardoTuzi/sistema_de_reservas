package br.com.danielcamelo.sistema_de_reservas.controller;

import br.com.danielcamelo.sistema_de_reservas.entity.Reserva;
import br.com.danielcamelo.sistema_de_reservas.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public List<Reserva> listarTodas() { return reservaService.listarTodas(); }

    @GetMapping("/professor/{id}")
    public List<Reserva> listarPorProfessor(@PathVariable Integer id) { return reservaService.buscarPorProfessor(id); }

    @GetMapping("/lotacao")
    public List<Integer> getDiasLotados(@RequestParam Integer salaId, @RequestParam int mes, @RequestParam int ano) {
        return reservaService.buscarDiasLotados(salaId, mes, ano);
    }

    @GetMapping("/ocupadas")
    public List<String> getHorariosOcupados(@RequestParam Integer salaId, @RequestParam String data) {
        return reservaService.buscarHorariosOcupados(salaId, data);
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Reserva reserva) {
        try {
            return ResponseEntity.ok(reservaService.criarReserva(reserva));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- NOVO: EDITAR ---
    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Integer id, @RequestBody Reserva reserva) {
        try {
            return ResponseEntity.ok(reservaService.atualizarReserva(id, reserva));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // --------------------

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(@PathVariable Integer id, @RequestParam(defaultValue = "false") boolean isCoordenacao) {
        try {
            reservaService.cancelarReserva(id, isCoordenacao);
            return ResponseEntity.ok("Cancelada com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
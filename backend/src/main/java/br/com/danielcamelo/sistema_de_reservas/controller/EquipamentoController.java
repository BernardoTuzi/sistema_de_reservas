package br.com.danielcamelo.sistema_de_reservas.controller;

import br.com.danielcamelo.sistema_de_reservas.entity.Equipamento;
import br.com.danielcamelo.sistema_de_reservas.service.EquipamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// --- ESTAS DUAS ANOTAÇÕES SÃO OBRIGATÓRIAS ---
@RestController
@RequestMapping("/api/equipamentos") // O endereço é PLURAL
public class EquipamentoController {

    @Autowired
    private EquipamentoService equipamentoService;

    @GetMapping
    public List<Equipamento> listarTodos() {
        return equipamentoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipamento> buscarPorId(@PathVariable Integer id) {
        Equipamento equipamento = equipamentoService.buscarPorId(id);
        if (equipamento != null) {
            return ResponseEntity.ok(equipamento);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public Equipamento criar(@RequestBody Equipamento equipamento) {
        return equipamentoService.salvar(equipamento);
    }
}
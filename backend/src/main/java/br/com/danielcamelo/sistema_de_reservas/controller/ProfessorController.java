package br.com.danielcamelo.sistema_de_reservas.controller;

import br.com.danielcamelo.sistema_de_reservas.entity.Professor;
import br.com.danielcamelo.sistema_de_reservas.service.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @GetMapping
    public List<Professor> listarTodosProfessores() {
        return professorService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professor> buscarProfessorPorId(@PathVariable Integer id) {
        Professor professor = professorService.buscarPorId(id);
        if (professor != null) {
            return ResponseEntity.ok(professor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Professor criarProfessor(@RequestBody Professor professor) {
        return professorService.salvar(professor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professor> atualizarProfessor(@PathVariable Integer id, @RequestBody Professor professorAtualizado) {
        Professor professor = professorService.buscarPorId(id);
        if (professor == null) return ResponseEntity.notFound().build();

        professor.setNomeProfessor(professorAtualizado.getNomeProfessor());
        professor.setEmailProfessor(professorAtualizado.getEmailProfessor());
        professor.setMatriculaProfessor(professorAtualizado.getMatriculaProfessor());
        professor.setSenhaProfessor(professorAtualizado.getSenhaProfessor());

        return ResponseEntity.ok(professorService.salvar(professor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProfessor(@PathVariable Integer id) {
        professorService.deletar(id); // Agora vai funcionar!
        return ResponseEntity.noContent().build();
    }
}
package devfull.MediaVault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import devfull.MediaVault.entities.DTO.ArquivoDTO;
import devfull.MediaVault.entities.DTO.ArquivoInfoDTO;
import devfull.MediaVault.service.ArquivoService;

@RestController
@RequestMapping("api/files")
public class ArquivoController {

	@Autowired
	private ArquivoService servico;

	@PostMapping("/upload")
	public ResponseEntity<ArquivoInfoDTO> uploadArquivo(@RequestPart("file") MultipartFile file,
			@RequestParam("nome") String nome, @RequestParam("tipo") String tipo, @RequestParam("tamanho") Long tamanho,
			@RequestParam("tamanhoFormatado") String tamanhoFormatado) {

		// Validação básica
		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("Arquivo não pode estar vazio");
		}

		// Log para debug
		System.out.println("Arquivo recebido: " + (file != null ? file.getOriginalFilename() : "null"));
		System.out.println("Nome: " + nome);
		System.out.println("Tipo: " + tipo);
		System.out.println("Tamanho: " + tamanho);
		System.out.println("TamanhoFormatado: " + tamanhoFormatado);

		// Monta o DTO manualmente
		ArquivoDTO dto = new ArquivoDTO(file, nome, tipo, tamanho, tamanhoFormatado);

		// Chama o serviço
		ArquivoInfoDTO resposta = servico.uploadArquivo(dto);

		return ResponseEntity.ok(resposta);
	}

	@PostMapping("/test-completo")
	public ResponseEntity<String> testeCompleto(@RequestPart("file") MultipartFile file,
			@RequestParam("nome") String nome, @RequestParam("tipo") String tipo, @RequestParam("tamanho") Long tamanho,
			@RequestParam("tamanhoFormatado") String tamanhoFormatado) {

		System.out.println("=== TESTE COMPLETO ===");
		System.out.println("File: " + (file != null ? file.getOriginalFilename() : "NULL"));
		System.out.println("Nome: " + nome);
		System.out.println("Tipo: " + tipo);
		System.out.println("Tamanho: " + tamanho);
		System.out.println("TamanhoFormatado: " + tamanhoFormatado);
		System.out.println("====================");

		return ResponseEntity.ok("Teste completo OK - Arquivo: " + file.getOriginalFilename());
	}

	@PostMapping("/test")
	public ResponseEntity<String> testeSimples(@RequestPart("file") MultipartFile file) {
		System.out.println("Arquivo recebido: " + (file != null ? file.getOriginalFilename() : "NULL"));
		return ResponseEntity.ok("Teste OK");
	}

}
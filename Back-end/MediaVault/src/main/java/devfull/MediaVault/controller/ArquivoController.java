package devfull.MediaVault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

		// Monta o DTO manualmente
		ArquivoDTO dto = new ArquivoDTO(file, nome, tipo, tamanho, tamanhoFormatado);

		// Chama o serviço
		ArquivoInfoDTO resposta = servico.uploadArquivo(dto);

		return ResponseEntity.ok(resposta);
	}
	
	@GetMapping()
	public ResponseEntity<List<ArquivoInfoDTO>> files(){ 
		List<ArquivoInfoDTO> lista = servico.findAll();
		return ResponseEntity.ok().body(lista);
	}
}
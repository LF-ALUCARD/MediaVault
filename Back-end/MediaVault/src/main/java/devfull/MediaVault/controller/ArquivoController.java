package devfull.MediaVault.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import devfull.MediaVault.entities.DTO.ArquivoDTO;
import devfull.MediaVault.entities.DTO.ArquivoInfoDTO;
import devfull.MediaVault.entities.DTO.DownloadRequestDTO;
import devfull.MediaVault.service.ArquivoService;

@RestController
@RequestMapping("api/files")
public class ArquivoController {

	@Autowired
	private ArquivoService servico;

	@PostMapping("/upload")
	public ResponseEntity<ArquivoInfoDTO> uploadArquivo(
	    @RequestPart("file") MultipartFile file,
	    @RequestParam("nome") String nome,
	    @RequestParam("tipo") String tipo,
	    @RequestParam("tamanho") Long tamanho,
	    @RequestParam("tamanhoFormatado") String tamanhoFormatado) {

	    ArquivoDTO dto = new ArquivoDTO(file, nome, tipo, tamanho, tamanhoFormatado);
	    ArquivoInfoDTO resposta = servico.uploadArquivo(dto);

	    return ResponseEntity.ok(resposta);
	}

	@GetMapping()
	public ResponseEntity<List<ArquivoInfoDTO>> files() {
		List<ArquivoInfoDTO> lista = servico.findAll();
		return ResponseEntity.ok().body(lista);
	}

	@PostMapping("/download-multiple")
	public ResponseEntity<Resource> downloadArquivos(@RequestBody DownloadRequestDTO dto) {
	    return servico.downloadArquivosZip(dto.getFileIds());
	}

	@GetMapping("/{id}/download")
	public ResponseEntity<Resource> downloadArquivo(@PathVariable Long id) {
		return servico.downloadArquivosZip(List.of(id));
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
		servico.delete(id);
		return ResponseEntity.ok().body(Map.of("message", "Arquivo excluído com sucesso"));
	}

}
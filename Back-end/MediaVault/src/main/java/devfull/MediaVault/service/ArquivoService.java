package devfull.MediaVault.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import devfull.MediaVault.entities.Arquivo;
import devfull.MediaVault.entities.User;
import devfull.MediaVault.entities.DTO.ArquivoDTO;
import devfull.MediaVault.entities.DTO.ArquivoInfoDTO;
import devfull.MediaVault.repositories.ArquivoRepository;
import devfull.MediaVault.service.exceptions.AcessoNegadoException;
import devfull.MediaVault.service.exceptions.ArquivoInvalidoException;
import devfull.MediaVault.service.exceptions.CredenciaisInvalidasException;
import devfull.MediaVault.service.exceptions.EmailDuplicadoException;
import devfull.MediaVault.service.exceptions.RecursoNaoEncontradoException;

@Service
public class ArquivoService {

	@Autowired
	private ArquivoRepository repositor;

	/*----------------------------------------------------------------------------*/

	public ArquivoInfoDTO uploadArquivo(ArquivoDTO obj) {
			long tamanhoMaximo = 500 * 1024 * 1024;

			if (obj.getFile() == null || obj.getFile().isEmpty()) {
				throw new IllegalArgumentException("Arquivo não pode estar vazio");
			}

			String[] formatosPermitidos = { "mp4", "opus", "avi", "mov", "mp3","mp4", "wav", "aac", "ogg", "m4a", "flac",
					"jpg", "jpeg", "png", "gif", "bmp", "webp" };
			
			String extensao = obj.getNome().substring(obj.getNome().lastIndexOf(".") + 1).toLowerCase();
			boolean tipoValido = Arrays.stream(formatosPermitidos).anyMatch(extensao::equals);

			if (!tipoValido) {
				throw new ArquivoInvalidoException("Formato de arquivo não suportado");
			}

			if (obj.getTamanho() > tamanhoMaximo) {
				throw new ArquivoInvalidoException("Arquivo excede o tamanho máximo permitido (500MB)");
			}

			Arquivo entidade = converter(obj);

			if (repositor.existsByNomeAndUserId(obj.getNome(), entidade.getUser().getId())) {
				throw new EmailDuplicadoException("Arquivo já existente");
			}

			Arquivo savedArquivo = repositor.save(entidade);
			return new ArquivoInfoDTO(savedArquivo);
			
	}

	private Arquivo converter(ArquivoDTO obj) {

		try {
			User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

			Arquivo entidade = new Arquivo();
			entidade.setNome(obj.getNome());
			entidade.setTipo(obj.getTipo());
			entidade.setTamanho(obj.getTamanho());
			entidade.setTamanho_formatado(obj.getTamanhoFormatado());
			entidade.setMidia(obj.getFile().getBytes());
			entidade.setData_upload(LocalDate.now());
			entidade.setStatus("valid");

			entidade.setData_expiracao(LocalDate.now().plusDays(180));

			entidade.setDias_restantes(180);
			entidade.setUser(user);

			return entidade;

		}

		catch (IOException e) {
			throw new ArquivoInvalidoException("Erro de Salvar arquivo");
		}

	}

	/*----------------------------------------------------------------------------*/

	public List<ArquivoInfoDTO> findAll() {
		
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		List<Arquivo> lista = repositor.findAllByUserId(user.getId());
		List<ArquivoInfoDTO> listagem = lista.stream().map(x -> new ArquivoInfoDTO(x)).toList();
		
		return listagem;
	}

	/*----------------------------------------------------------------------------*/

	public ResponseEntity<Resource> downloadArquivosZip(List<Long> ids) {
	    List<Arquivo> arquivosValidos = new ArrayList<>();

	    for (Long id : ids) {
	        Arquivo arquivo = repositor.findById(id)
	                .orElseThrow(() -> new RecursoNaoEncontradoException("Arquivo não encontrado: ID " + id));

	        if ("expired".equalsIgnoreCase(arquivo.getStatus())) {
	            throw new AcessoNegadoException(
	                    "O arquivo " + arquivo.getNome() + " está expirado e não pode ser baixado.");
	        }

	        arquivosValidos.add(arquivo);
	    }

	    if (arquivosValidos.isEmpty()) {
	        throw new ArquivoInvalidoException("Nenhum arquivo válido para download.");
	    }

	    try {
	        Path zipTemp = Files.createTempFile("arquivos_", ".zip");
	        try (ZipOutputStream zipOut = new ZipOutputStream(Files.newOutputStream(zipTemp))) {
	            for (Arquivo arquivo : arquivosValidos) {
	                zipOut.putNextEntry(new ZipEntry(arquivo.getNome()));
	                zipOut.write(arquivo.getMidia());
	                zipOut.closeEntry();
	            }
	        }

	        InputStreamResource resource = new InputStreamResource(Files.newInputStream(zipTemp));
	        return ResponseEntity.ok()
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"arquivos_selecionados.zip\"")
	                .contentType(MediaType.APPLICATION_OCTET_STREAM)
	                .body(resource);

	    } catch (IOException e) {
	        throw new RuntimeException("Erro ao gerar o arquivo ZIP: " + e.getMessage(), e);
	    }
	}


	/*----------------------------------------------------------------------------*/

	public void delete(Long id) {

		Arquivo arquivo = repositor.findById(id)
				.orElseThrow(() -> new CredenciaisInvalidasException("Arquivo não encontrado"));

		repositor.delete(arquivo);

	}
	/*----------------------------------------------------------------------------*/

}
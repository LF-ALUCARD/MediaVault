package devfull.MediaVault.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataIntegrityViolationException;
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
import devfull.MediaVault.service.exceptions.DataBaseException;
import devfull.MediaVault.service.exceptions.EmailDuplicadoException;
import devfull.MediaVault.service.exceptions.RecursoNaoEncontradoException;
import devfull.MediaVault.service.exceptions.ResourceNotFoundException;

@Service
public class ArquivoService {

	@Autowired
	private ArquivoRepository repositor;

	public ArquivoInfoDTO uploadArquivo(ArquivoDTO obj) {
		try {
			if (obj.getFile() == null || obj.getFile().isEmpty()) {
				throw new IllegalArgumentException("Arquivo não pode estar vazio");
			}

			// Validação de tipo
			String[] formatosPermitidos = { "mp4", "opus", "avi", "mov", "mp3", "wav", "aac", "ogg", "m4a", "flac",
					"jpg", "jpeg", "png", "gif", "bmp", "webp" };
			String extensao = obj.getNome().substring(obj.getNome().lastIndexOf(".") + 1).toLowerCase();
			boolean tipoValido = Arrays.stream(formatosPermitidos).anyMatch(extensao::equals);

			if (!tipoValido) {
				throw new ArquivoInvalidoException("Formato de arquivo não suportado");
			}

			// Validação de tamanho (máx. 500MB)
			long tamanhoMaximo = 500 * 1024 * 1024;
			if (obj.getTamanho() > tamanhoMaximo) {
				throw new ArquivoInvalidoException("Arquivo excede o tamanho máximo permitido (500MB)");
			}

			// Salvar arquivo fisicamente
			String caminhoWs = salvarArquivoFisico(obj);

			// Criar entidade
			Arquivo entidade = converter(obj, caminhoWs);

			// Verificar duplicidade
			if (repositor.existsByNomeAndUserId(obj.getNome(), entidade.getUser().getId())) {
				throw new EmailDuplicadoException("Arquivo já existente");
			}

			// Persistir e retornar
			Arquivo savedArquivo = repositor.save(entidade);
			return new ArquivoInfoDTO(savedArquivo);

		} catch (IOException e) {
			throw new RuntimeException("Erro ao salvar o arquivo", e);
		}
	}

	public List<ArquivoInfoDTO> findAll() {
		List<Arquivo> lista = repositor.findAll();
		List<ArquivoInfoDTO> listagem = lista.stream().map(x -> new ArquivoInfoDTO(x)).toList();
		return listagem;
	}

	public ResponseEntity<Resource> downloadArquivoZip(Long id) {
	    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

	    // Buscar o arquivo e validar dono
	    Arquivo arquivo = repositor.findById(id)
	        .orElseThrow(() -> new RecursoNaoEncontradoException("Arquivo não encontrado"));

	    if (!arquivo.getUser().getId().equals(user.getId())) {
	        throw new AcessoNegadoException("Você não tem permissão para acessar este arquivo");
	    }

	    // Verificar expiração
	    if (arquivo.getData_expiracao().isBefore(LocalDate.now())) {
	        throw new ArquivoInvalidoException("Arquivo expirado. Não é possível fazer download após 180 dias.");
	    }

	    try {
	        // Caminho do arquivo original
	        Path caminhoOriginal = Paths.get(arquivo.getCaminho_ws());

	        // Criar ZIP temporário
	        Path zipTemp = Files.createTempFile("arquivo_", ".zip");
	        try (ZipOutputStream zipOut = new ZipOutputStream(Files.newOutputStream(zipTemp))) {
	            ZipEntry zipEntry = new ZipEntry(arquivo.getNome());
	            zipOut.putNextEntry(zipEntry);
	            Files.copy(caminhoOriginal, zipOut);
	            zipOut.closeEntry();
	        }

	        // Preparar resposta
	        InputStreamResource resource = new InputStreamResource(Files.newInputStream(zipTemp));
	        return ResponseEntity.ok()
	            .header(HttpHeaders.CONTENT_DISPOSITION,
	                "attachment; filename=\"" + arquivo.getNome().replaceAll("\\.[^.]+$", "") + ".zip\"")
	            .contentType(MediaType.parseMediaType("application/zip"))
	            .body(resource);

	    } catch (IOException e) {
	        throw new RuntimeException("Erro ao gerar o arquivo ZIP", e);
	    }
	}
	private String salvarArquivoFisico(ArquivoDTO obj) throws IOException {
		if (obj.getFile() == null) {
			throw new IllegalArgumentException("Arquivo não pode ser null");
		}

		String basePath = "C:\\midia";
		String tipo = obj.getTipo().toLowerCase();
		String tipoPasta;

		// Define a pasta com base no tipo
		switch (tipo) {
		case "video":
			tipoPasta = "video";
			break;
		case "audio":
			tipoPasta = "audio";
			break;
		case "image":
			tipoPasta = "image";
			break;
		default:
			throw new IllegalArgumentException("Tipo de arquivo inválido: " + tipo);
		}

		Path pastaDestino = Paths.get(basePath, tipoPasta);
		Files.createDirectories(pastaDestino); // cria se não existir

		// Gera nome físico único
		String extensao = obj.getNome().substring(obj.getNome().lastIndexOf("."));
		String nomeUnico = UUID.randomUUID().toString() + extensao;

		Path caminhoArquivo = pastaDestino.resolve(nomeUnico);
		Files.copy(obj.getFile().getInputStream(), caminhoArquivo, StandardCopyOption.REPLACE_EXISTING);

		return caminhoArquivo.toString();
	}

	public void delete(Long id) {
		if (!repositor.existsById(id)) {
			throw new ResourceNotFoundException("Id não encontrado");
		}

		try {
			boolean arquivoApagado = apagandoArquivo(id);

			if (!arquivoApagado) {
				System.out.println("Arquivo físico não encontrado, mas metadados serão removidos.");
			}

			repositor.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DataBaseException(e.getMessage());
		} catch (RuntimeException e) {
			throw new RuntimeException("Erro ao apagar arquivo físico: " + e.getMessage());
		}
	}

	private boolean apagandoArquivo(Long id) {
		Optional<Arquivo> obj = repositor.findById(id);
		if (obj.isEmpty()) {
			return false;
		}

		Path caminhoCompleto = Paths.get(obj.get().getCaminho_ws());

		try {
			if (Files.exists(caminhoCompleto)) {
				Files.delete(caminhoCompleto);
				return true;
			} else {
				return false;
			}
		} catch (IOException e) {
			throw new RuntimeException("Erro ao apagar o arquivo: " + e.getMessage());
		}
	}

	private Arquivo converter(ArquivoDTO obj, String caminho) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Arquivo entidade = new Arquivo();
		entidade.setNome(obj.getNome());
		entidade.setTipo(obj.getTipo());
		entidade.setTamanho(obj.getTamanho());
		entidade.setTamanho_formatado(obj.getTamanhoFormatado()); // Corrigido: usando o getter correto
		entidade.setCaminho_ws(caminho);
		entidade.setData_upload(LocalDate.now());
		entidade.setStatus("valid");

		// Corrigido: removida duplicação e calculando corretamente
		LocalDate dataExpiracao = LocalDate.now().plusDays(180);
		entidade.setData_expiracao(dataExpiracao);

		// Calculando dias restantes
		entidade.setDias_restantes(180);

		entidade.setUser(user);

		return entidade;
	}
}
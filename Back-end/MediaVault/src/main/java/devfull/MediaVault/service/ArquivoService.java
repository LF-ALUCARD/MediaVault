package devfull.MediaVault.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import devfull.MediaVault.entities.Arquivo;
import devfull.MediaVault.entities.User;
import devfull.MediaVault.entities.DTO.ArquivoDTO;
import devfull.MediaVault.entities.DTO.ArquivoInfoDTO;
import devfull.MediaVault.repositories.ArquivoRepository;
import devfull.MediaVault.service.exceptions.ArquivoInvalidoException;
import devfull.MediaVault.service.exceptions.EmailDuplicadoException;

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
            String[] formatosPermitidos = {"mp4", "avi", "mov", "mp3", "wav", "aac", "ogg", "m4a", "flac"};
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
    
    private String salvarArquivoFisico(ArquivoDTO obj) throws IOException {
        if (obj.getFile() == null) {
            throw new IllegalArgumentException("Arquivo não pode ser null");
        }

        String basePath = "C:\\midia";
        String tipoPasta = obj.getTipo().equalsIgnoreCase("video") ? "video" : "audio";
        Path pastaDestino = Paths.get(basePath, tipoPasta);

        Files.createDirectories(pastaDestino); // cria se não existir

        // Gera nome físico único
        String extensao = obj.getNome().substring(obj.getNome().lastIndexOf("."));
        String nomeUnico = UUID.randomUUID().toString() + extensao;

        Path caminhoArquivo = pastaDestino.resolve(nomeUnico);
        Files.copy(obj.getFile().getInputStream(), caminhoArquivo, StandardCopyOption.REPLACE_EXISTING);

        return caminhoArquivo.toString();
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
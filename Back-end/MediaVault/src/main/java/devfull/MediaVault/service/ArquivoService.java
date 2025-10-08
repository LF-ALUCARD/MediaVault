package devfull.MediaVault.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import devfull.MediaVault.entities.Arquivo;
import devfull.MediaVault.entities.User;
import devfull.MediaVault.entities.DTO.ArquivoDTO;
import devfull.MediaVault.entities.DTO.ArquivoInfoDTO;
import devfull.MediaVault.repositories.ArquivoRepository;
import devfull.MediaVault.service.exceptions.EmailDuplicadoException;

@Service
public class ArquivoService {

    @Autowired
    private ArquivoRepository repositor;

    public ArquivoInfoDTO uploadArquivo(ArquivoDTO obj) {
        try {
            // Validação adicional
            if (obj.getFile() == null || obj.getFile().isEmpty()) {
                throw new IllegalArgumentException("Arquivo não pode estar vazio");
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
            ArquivoInfoDTO arquivoInfo = new ArquivoInfoDTO(savedArquivo);
            return arquivoInfo;

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar o arquivo", e);
        }
    }
    
    private String salvarArquivoFisico(ArquivoDTO obj) throws IOException {
        // Validação do arquivo
        if (obj.getFile() == null) {
            throw new IllegalArgumentException("Arquivo não pode ser null");
        }

        String basePath = "C:\\midia";
        String tipoPasta = obj.getTipo().equalsIgnoreCase("video") ? "video" : "audio";
        Path pastaDestino = Paths.get(basePath, tipoPasta);

        Files.createDirectories(pastaDestino); // cria se não existir

        Path caminhoArquivo = pastaDestino.resolve(obj.getNome());
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
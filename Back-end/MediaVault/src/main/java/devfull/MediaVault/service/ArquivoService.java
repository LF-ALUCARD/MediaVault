package devfull.MediaVault.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import devfull.MediaVault.entities.Arquivo;
import devfull.MediaVault.entities.DTO.ArquivoDTO;
import devfull.MediaVault.entities.DTO.ArquivoInfoDTO;
import devfull.MediaVault.entities.DTO.AuthResponse_arquivo_DTO;
import devfull.MediaVault.repositories.ArquivoRepository;
import devfull.MediaVault.security.GerarToken;
import devfull.MediaVault.service.exceptions.EmailDuplicadoException;

@Service
public class ArquivoService {

	@Autowired
	private ArquivoRepository repositor;
	
    @Autowired
    private GerarToken gerarToken;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
	
    public AuthResponse_arquivo_DTO uploadoArquivo(ArquivoDTO obj) {
        Arquivo entidade = converter(obj);
        if(repositor.existsByNome(obj.getNome())) {
        	throw new EmailDuplicadoException ("E-mail já existente");
        }
        Arquivo savedArquivo = repositor.save(entidade);
        String token = gerarToken.gerarToken(savedArquivo);
        ArquivoInfoDTO arquivoInfo = new ArquivoInfoDTO(savedArquivo);
        return new AuthResponse_arquivo_DTO(token, arquivoInfo);
    }
    
    private Arquivo converter(ArquivoDTO obj) {
    	Arquivo entidade = new Arquivo();
    	entidade.setNome(obj.getNome());
    	entidade.setTipo(obj.getTipo());
    	entidade.setTamanho_formatado(obj.getTamanhoFormatado());
    	entidade.setTamanho(obj.getTamanho());
    	entidade.setCaminho_ws(obj.getCaminhoWs());
    	entidade.setData_upload(LocalDate.now());
    	entidade.setData_expiracao(entidade.getData_upload().plusDays(180));
    	entidade.setStatus("valid");
    	entidade.setDias_restantes((int) ChronoUnit.DAYS.between(LocalDate.now(), entidade.getData_expiracao()));
    	return entidade;
    }
}

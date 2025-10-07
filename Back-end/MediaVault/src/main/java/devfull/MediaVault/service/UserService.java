package devfull.MediaVault.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import devfull.MediaVault.entities.User;
import devfull.MediaVault.entities.DTO.AuthResponseDTO;
import devfull.MediaVault.entities.DTO.UserInfoDTO;
import devfull.MediaVault.entities.DTO.UserRegisterDTO;
import devfull.MediaVault.entities.enums.UserRole;
import devfull.MediaVault.repositories.UserRepository;
import devfull.MediaVault.security.GerarToken;
import devfull.MediaVault.service.exceptions.CredenciaisInvalidasException;

@Service
public class UserService {

    @Autowired
    private UserRepository repositor;

    @Autowired
    private GerarToken gerarToken;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    public UserInfoDTO me(String token) {
        if (!gerarToken.tokenValido(token)) {
            throw new CredenciaisInvalidasException("Token inválido ou expirado");
        }

        String email = gerarToken.getEmailFromToken(token);
        User user = findByEmail(email);
        return new UserInfoDTO(user);
    }

    public AuthResponseDTO register(UserRegisterDTO obj) {
        User entidade = converter(obj);
        User savedUser = repositor.save(entidade);
        String token = gerarToken.gerarToken(savedUser);
        UserInfoDTO userInfo = new UserInfoDTO(savedUser);
        return new AuthResponseDTO(token, userInfo);
    }
    
    public User findByEmail(String email) {
    	User obj = repositor.findByEmail(email);
    		
    	if (obj != null) {
    		return obj;
    	}
    	throw new CredenciaisInvalidasException("E-mail ou senha inválidos");
    }
    
    private User converter(UserRegisterDTO obj) {
        User entidade = new User();
        entidade.setNome(obj.getNome());
        entidade.setEmail(obj.getEmail());
        entidade.setRole(UserRole.valueOfCode(obj.getRole()));
        entidade.setSenha(passwordEncoder.encode(obj.getSenha())); // Criptografar aqui
        return entidade;
    }
}
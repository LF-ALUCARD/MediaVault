package devfull.MediaVault.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import devfull.MediaVault.entities.DTO.AuthResponseDTO;
import devfull.MediaVault.entities.DTO.UserRegisterDTO;
import devfull.MediaVault.service.UserService;

@RestController
@RequestMapping(value = "api/auth")
public class UserController {
	
	@Autowired
	private UserService servico;

	@PostMapping(value = "/register")
	public ResponseEntity<AuthResponseDTO> register(@RequestBody UserRegisterDTO obj){
		AuthResponseDTO resposta = servico.register(obj);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(resposta.getUser().getId()).toUri();
		return ResponseEntity.created(uri).body(resposta);
	}
}

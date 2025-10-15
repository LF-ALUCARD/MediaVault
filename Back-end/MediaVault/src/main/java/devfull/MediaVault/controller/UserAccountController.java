package devfull.MediaVault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import devfull.MediaVault.entities.User;
import devfull.MediaVault.entities.DTO.UserInfoDTO;
import devfull.MediaVault.entities.DTO.UserPasswordDTO;
import devfull.MediaVault.entities.DTO.UserProfileDTO;
import devfull.MediaVault.service.DashboardService;
import devfull.MediaVault.service.UserService;

@RestController
@RequestMapping(value = "api/user")
public class UserAccountController {

	@Autowired
	private UserService servico;
	
	@Autowired
	private DashboardService dahs;
	
	@PutMapping(value = "profile/{id}")
	public ResponseEntity<UserInfoDTO> updateProfile(@PathVariable Long id, @RequestBody UserProfileDTO obj){
	    User entidade = servico.updateProfile(id, obj);
	    UserInfoDTO dto = new UserInfoDTO(entidade);
	    return ResponseEntity.ok().body(dto);
	}
	
	@PutMapping(value = "password/{id}")
	public ResponseEntity<UserInfoDTO> updateProfile(@PathVariable Long id, @RequestBody UserPasswordDTO obj){
	    User entidade = servico.updatePassword(id, obj);
	    UserInfoDTO dto = new UserInfoDTO(entidade);
	    return ResponseEntity.ok().body(dto);
	}
}

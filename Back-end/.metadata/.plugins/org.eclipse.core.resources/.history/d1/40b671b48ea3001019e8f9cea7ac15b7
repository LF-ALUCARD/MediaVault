package devfull.MediaVault.entities.DTO;

import java.io.Serializable;

import devfull.MediaVault.entities.User;
import devfull.MediaVault.entities.enums.UserRole;

public class UserInfoDTO implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private Long id;
	private String email;
	private UserRole role;

	public UserInfoDTO() {
	}

	public UserInfoDTO(User obj) {
		id = obj.getId();
		email = obj.getEmail();
		role = obj.getRole();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public UserRole getRole() {
		return role;
	}

	public void setRole(UserRole role) {
		this.role = role;
	}

}

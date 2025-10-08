package devfull.MediaVault.entities.DTO;

import java.io.Serializable;

public class AuthResponseDTO implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String token;
	private UserInfoDTO user;

	public AuthResponseDTO() {
	}

	public AuthResponseDTO(String token, UserInfoDTO user) {
		super();
		this.token = token;
		this.user = user;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public UserInfoDTO getUser() {
		return user;
	}

	public void setUser(UserInfoDTO user) {
		this.user = user;
	}

}

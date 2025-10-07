package devfull.MediaVault.entities.DTO;

import java.io.Serializable;

public class UserRegisterDTO implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String nome;
	private String email;
	private String password;
	private int role;

	public UserRegisterDTO() {
	}

	public UserRegisterDTO(String nome, String email, String password, int role) {
		this.nome = nome;
		this.email = email;
		this.password = password;
		this.role = role;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public int getRole() {
		return role;
	}

	public void setRole(int role) {
		this.role = role;
	}

}

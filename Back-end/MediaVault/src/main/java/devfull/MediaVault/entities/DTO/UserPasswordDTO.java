package devfull.MediaVault.entities.DTO;

import java.io.Serializable;

public class UserPasswordDTO implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private String senhaAtual;
	private String senhaNova;

	public UserPasswordDTO() {
	}

	public UserPasswordDTO(String senhaAtual, String senhaNova) {
		super();
		this.senhaAtual = senhaAtual;
		this.senhaNova = senhaNova;
	}

	public String getSenhaAtual() {
		return senhaAtual;
	}

	public void setSenhaAtual(String senhaAtual) {
		this.senhaAtual = senhaAtual;
	}

	public String getSenhaNova() {
		return senhaNova;
	}

	public void setSenhaNova(String senhaNova) {
		this.senhaNova = senhaNova;
	}

}

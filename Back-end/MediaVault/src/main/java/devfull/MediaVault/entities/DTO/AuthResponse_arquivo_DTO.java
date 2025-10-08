package devfull.MediaVault.entities.DTO;

import java.io.Serializable;

public class AuthResponse_arquivo_DTO implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String token;
	private ArquivoInfoDTO arquivo;

	public AuthResponse_arquivo_DTO() {
	}

	public AuthResponse_arquivo_DTO(String token, ArquivoInfoDTO arquivo) {
		super();
		this.token = token;
		this.arquivo = arquivo;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public ArquivoInfoDTO getarquivo() {
		return arquivo;
	}

	public void setarquivo(ArquivoInfoDTO arquivo) {
		this.arquivo = arquivo;
	}

}

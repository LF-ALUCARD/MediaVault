package devfull.MediaVault.entities.DTO;

import java.io.Serializable;

public class ArquivoDTO implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private Long id;
	private String nome;
	private String tipo;
	private Long tamanho;
	private String tamanhoFormatado;
	private String caminhoWs;

	public ArquivoDTO() {

	}

	public ArquivoDTO(Long id, String nome, String tipo, Long tamanho, String tamanhoFormatado, String caminhoWs) {
		super();
		this.id = id;
		this.nome = nome;
		this.tipo = tipo;
		this.tamanho = tamanho;
		this.tamanhoFormatado = tamanhoFormatado;
		this.caminhoWs = caminhoWs;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public Long getTamanho() {
		return tamanho;
	}

	public void setTamanho(Long tamanho) {
		this.tamanho = tamanho;
	}

	public String getTamanhoFormatado() {
		return tamanhoFormatado;
	}

	public void setTamanhoFormatado(String tamanhoFormatado) {
		this.tamanhoFormatado = tamanhoFormatado;
	}

	public String getCaminhoWs() {
		return caminhoWs;
	}

	public void setCaminhoWs(String caminhoWs) {
		this.caminhoWs = caminhoWs;
	}

}

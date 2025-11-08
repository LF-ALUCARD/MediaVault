package devfull.MediaVault.entities.DTO;

import java.io.Serializable;

import org.springframework.web.multipart.MultipartFile;

public class ArquivoDTO implements Serializable {

	private static final long serialVersionUID = 1L;

	private MultipartFile file;
	private String nome;
	private String tipo;
	private Long tamanho;
	private String tamanhoFormatado;

	public ArquivoDTO() {
	}

	public ArquivoDTO(MultipartFile file, String nome, String tipo, Long tamanho, String tamanhoFormatado) {
		this.file = file;
		this.nome = nome;
		this.tipo = tipo;
		this.tamanho = tamanho;
		this.tamanhoFormatado = tamanhoFormatado;
	}

	// Getters e Setters
	public MultipartFile getFile() {
		return file;
	}

	public void setFile(MultipartFile file) {
		this.file = file;
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

}
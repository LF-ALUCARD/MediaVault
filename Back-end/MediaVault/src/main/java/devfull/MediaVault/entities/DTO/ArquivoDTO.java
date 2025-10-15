package devfull.MediaVault.entities.DTO;

import java.io.Serializable;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ArquivoDTO implements Serializable {

	private static final long serialVersionUID = 1L;
	@NotNull(message = "Arquivo é obrigatório")
	private MultipartFile file;

	@NotBlank(message = "Nome é obrigatório")
	private String nome;

	@NotBlank(message = "Tipo é obrigatório")
	private String tipo;

	@NotNull(message = "Tamanho é obrigatório")
	private Long tamanho;

	// Usando JsonProperty para mapear corretamente
	@JsonProperty("tamanhoFormatado")
	private String tamanhoFormatado;

	private List<Long> fileIds;

	public List<Long> getFileIds() {
		return fileIds;
	}

	public void setFileIds(List<Long> fileIds) {
		this.fileIds = fileIds;
	}

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
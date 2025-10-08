package devfull.MediaVault.entities.DTO;

import java.io.Serializable;
import java.time.LocalDate;

import devfull.MediaVault.entities.Arquivo;

public class ArquivoInfoDTO implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private Long id;
	private String nome;
	private String tipo;
	private Long tamanho;
	private String tamanho_formatado;
	private String caminho_ws;
	private LocalDate data_upload;
	private LocalDate data_expiracao;
	private String status;
	private Integer dias_restantes;

	public ArquivoInfoDTO() {
	}

	public ArquivoInfoDTO(Arquivo obj) {
		id = obj.getId();
		nome = obj.getNome();
		tipo = obj.getTipo();
		tamanho = obj.getTamanho();
		tamanho_formatado = obj.getTamanho_formatado();
		caminho_ws = obj.getCaminho_ws();
		data_upload = obj.getData_upload();
		data_expiracao = obj.getData_expiracao();
		status = obj.getStatus();
		dias_restantes = obj.getDias_restantes();
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

	public String getTamanho_formatado() {
		return tamanho_formatado;
	}

	public void setTamanho_formatado(String tamanho_formatado) {
		this.tamanho_formatado = tamanho_formatado;
	}

	public String getCaminho_ws() {
		return caminho_ws;
	}

	public void setCaminho_ws(String caminho_ws) {
		this.caminho_ws = caminho_ws;
	}

	public LocalDate getData_upload() {
		return data_upload;
	}

	public void setData_upload(LocalDate data_upload) {
		this.data_upload = data_upload;
	}

	public LocalDate getData_expiracao() {
		return data_expiracao;
	}

	public void setData_expiracao(LocalDate data_expiracao) {
		this.data_expiracao = data_expiracao;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Integer getDias_restantes() {
		return dias_restantes;
	}

	public void setDias_restantes(Integer dias_restantes) {
		this.dias_restantes = dias_restantes;
	}

}

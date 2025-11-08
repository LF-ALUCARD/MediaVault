package devfull.MediaVault.entities;

import java.io.Serializable;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_arquivo")
public class Arquivo implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String nome;
	private String tipo;
	private Long tamanho;
	private String tamanho_formatado;
	private LocalDate data_upload;
	private LocalDate data_expiracao;
	private String status;
	private Integer dias_restantes;
	
	
	private byte[] midia;
	
	@ManyToOne
	@JoinColumn(name = "usuario_id")
	@JsonBackReference
	private User user;

	public Arquivo() {
	}

	public Arquivo(Long id, String nome, String tipo, Long tamanho, String tamanho_formatado, byte[] midia,
			LocalDate data_upload, LocalDate data_expiracao, String status, Integer dias_restantes, User user) {
		super();
		this.id = id;
		this.nome = nome;
		this.tipo = tipo;
		this.tamanho = tamanho;
		this.tamanho_formatado = tamanho_formatado;
		this.midia = midia;
		this.data_upload = data_upload;
		this.data_expiracao = data_expiracao;
		this.status = status;
		this.dias_restantes = dias_restantes;
		this.user = user;
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

	public byte[] getMidia() {
		return this.midia;
	}

	public void setMidia(byte[] midia) {
		this.midia = midia;
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

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

}

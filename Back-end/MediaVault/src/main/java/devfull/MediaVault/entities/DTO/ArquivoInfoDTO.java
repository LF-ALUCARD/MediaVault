package devfull.MediaVault.entities.DTO;

import java.io.Serializable;
import java.time.LocalDate;

import devfull.MediaVault.entities.Arquivo;

public class ArquivoInfoDTO implements Serializable {

	private static final long serialVersionUID = 1L;

	private String name;
	private String type;
	private String size;
	private LocalDate uploadDate;
	private LocalDate expiryDate;
	private String status;
	private Integer daysRemaining;

	public ArquivoInfoDTO() {
	}

	public ArquivoInfoDTO(Arquivo obj) {
		name = obj.getNome();
		type = obj.getTipo();
		size = obj.getTamanho_formatado();
		uploadDate = obj.getData_upload();
		expiryDate = obj.getData_expiracao();
		status = obj.getStatus();
		daysRemaining = obj.getDias_restantes();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSize() {
		return size;
	}

	public void setSize(String size) {
		this.size = size;
	}

	public LocalDate getUploadDate() {
		return uploadDate;
	}

	public void setUploadDate(LocalDate uploadDate) {
		this.uploadDate = uploadDate;
	}

	public LocalDate getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDate expiryDate) {
		this.expiryDate = expiryDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Integer getDaysRemaining() {
		return daysRemaining;
	}

	public void setDaysRemaining(Integer daysRemaining) {
		this.daysRemaining = daysRemaining;
	}

}

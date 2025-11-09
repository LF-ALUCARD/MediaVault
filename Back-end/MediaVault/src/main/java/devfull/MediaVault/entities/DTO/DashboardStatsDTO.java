package devfull.MediaVault.entities.DTO;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class DashboardStatsDTO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Integer totalFiles;
	private Integer validFiles;
	private Integer expiringFiles;
	private Integer expiredFiles;

	List<ArquivoInfoDTO> recentFiles = new ArrayList<>();

	public DashboardStatsDTO() {
	}

	public DashboardStatsDTO(Integer totalFiles, Integer validFiles, Integer expiringFiles, Integer expiredFiles) {
		this.totalFiles = totalFiles;
		this.validFiles = validFiles;
		this.expiringFiles = expiringFiles;
		this.expiredFiles = expiredFiles;
	}

	public Integer getTotalFiles() {
		return totalFiles;
	}

	public void setTotalFiles(Integer totalFiles) {
		this.totalFiles = totalFiles;
	}

	public Integer getValidFiles() {
		return validFiles;
	}

	public void setValidFiles(Integer validFiles) {
		this.validFiles = validFiles;
	}

	public Integer getExpiringFiles() {
		return expiringFiles;
	}

	public void setExpiringFiles(Integer expiringFiles) {
		this.expiringFiles = expiringFiles;
	}

	public Integer getExpiredFiles() {
		return expiredFiles;
	}

	public void setExpiredFiles(Integer expiredFiles) {
		this.expiredFiles = expiredFiles;
	}

	public List<ArquivoInfoDTO> getRecentFiles() {
		return recentFiles;
	}

	public void setRecentFiles(List<ArquivoInfoDTO> recentFiles) {
		this.recentFiles = recentFiles;
	}

}

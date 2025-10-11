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
	private Long totalStorage;
	private Long usedStorage;
	private Integer storagePercentage;

	List<ArquivoInfoDTO> recentFiles = new ArrayList<>();

	public DashboardStatsDTO() {
	}

	public DashboardStatsDTO(Integer totalFiles, Integer validFiles, Integer expiringFiles, Integer expiredFiles,
			Long totalStorage, Long usedStorage, Integer storagePercentage) {
		this.totalFiles = totalFiles;
		this.validFiles = validFiles;
		this.expiringFiles = expiringFiles;
		this.expiredFiles = expiredFiles;
		this.totalStorage = totalStorage;
		this.usedStorage = usedStorage;
		this.storagePercentage = storagePercentage;
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

	public Long getTotalStorage() {
		return totalStorage;
	}

	public void setTotalStorage(Long totalStorage) {
		this.totalStorage = totalStorage;
	}

	public Long getUsedStorage() {
		return usedStorage;
	}

	public void setUsedStorage(Long usedStorage) {
		this.usedStorage = usedStorage;
	}

	public Integer getStoragePercentage() {
		return storagePercentage;
	}

	public void setStoragePercentage(Integer storagePercentage) {
		this.storagePercentage = storagePercentage;
	}

	public List<ArquivoInfoDTO> getRecentFiles() {
		return recentFiles;
	}

	public void setRecentFiles(List<ArquivoInfoDTO> recentFiles) {
		this.recentFiles = recentFiles;
	}

}

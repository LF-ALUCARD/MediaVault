package devfull.MediaVault.entities.DTO;

public class UserStatsDTO {

	private Integer totalFiles;
	private Long totalStorage;

	public UserStatsDTO() {
	}

	public UserStatsDTO(Integer totalFiles, Long totalStorage) {
		this.totalFiles = totalFiles;
		this.totalStorage = totalStorage;
	}

	public Integer getTotalFiles() {
		return totalFiles;
	}

	public void setTotalFiles(Integer totalFiles) {
		this.totalFiles = totalFiles;
	}

	public Long getTotalStorage() {
		return totalStorage;
	}

	public void setTotalStorage(Long totalStorage) {
		this.totalStorage = totalStorage;
	}

}

package devfull.MediaVault.entities.DTO;

import java.util.List;

public class DownloadRequestDTO {

	private List<Long> fileIds;

	public DownloadRequestDTO() {
	}

	public List<Long> getFileIds() {
		return fileIds;
	}

	public void setFileIds(List<Long> fileIds) {
		this.fileIds = fileIds;
	}

}

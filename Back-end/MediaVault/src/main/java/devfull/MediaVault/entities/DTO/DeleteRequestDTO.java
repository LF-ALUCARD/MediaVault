package devfull.MediaVault.entities.DTO;

import java.util.List;

public class DeleteRequestDTO {

	private List<Long> fileIds;

	public DeleteRequestDTO() {
	}

	public List<Long> getFileIds() {
		return fileIds;
	}

	public void setFileIds(List<Long> fileIds) {
		this.fileIds = fileIds;
	}

}

package devfull.MediaVault.service;

import java.io.File;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import devfull.MediaVault.entities.Arquivo;
import devfull.MediaVault.entities.DTO.ArquivoInfoDTO;
import devfull.MediaVault.entities.DTO.DashboardStatsDTO;
import devfull.MediaVault.entities.DTO.UserStatsDTO;
import devfull.MediaVault.repositories.ArquivoRepository;

@Service
public class DashboardService {

	@Autowired
	private ArquivoRepository repositor;

	public DashboardStatsDTO buscarDados() {
		List<Arquivo> arquivos = repositor.findAll();

		DashboardStatsDTO dash = new DashboardStatsDTO();
		dash.setTotalFiles(arquivos.size());
		dash.setValidFiles(contarPorStatus(arquivos, "valid"));
		dash.setExpiringFiles(contarPorStatus(arquivos, "expiring"));
		dash.setExpiredFiles(contarPorStatus(arquivos, "expired"));
		dash.setTotalStorage(espacoTotalDisco());
		dash.setUsedStorage(espacoUsadoDisco());
		dash.setStoragePercentage(percentualUsoDisco());
		dash.setRecentFiles(arquivosRecentes(arquivos));

		return dash;
	}

	public UserStatsDTO DashUser(Long id) {
		UserStatsDTO user = new UserStatsDTO();
		user.setTotalFiles(repositor.countByUserId(id));
		user.setTotalStorage(repositor.sumTamanhoByUserId(id));
		return user;
	}

	private Integer contarPorStatus(List<Arquivo> arquivos, String status) {
		return (int) arquivos.stream().filter(x -> status.equals(x.getStatus())).count();
	}

	private File obterDiscoRaiz() {
		String os = System.getProperty("os.name").toLowerCase();
		if (os.contains("win")) {
			return new File("C:\\");
		} else {
			return new File("/");
		}
	}

	private Long espacoTotalDisco() {
		File root = obterDiscoRaiz();
		return root.getTotalSpace() / (1024 * 1024 * 1024);
	}

	private Long espacoUsadoDisco() {
		File root = obterDiscoRaiz();
		long total = root.getTotalSpace();
		long free = root.getFreeSpace();
		return (total - free) / (1024 * 1024 * 1024);
	}

	private Integer percentualUsoDisco() {
		long total = espacoTotalDisco();
		long usada = espacoUsadoDisco();
		return total == 0 ? 0 : (int) ((usada * 100) / total);
	}

	private List<ArquivoInfoDTO> arquivosRecentes(List<Arquivo> arquivos) {
		return arquivos.stream().sorted(Comparator.comparing(Arquivo::getData_upload).reversed()).limit(5)
				.map(ArquivoInfoDTO::new).toList();
	}
}

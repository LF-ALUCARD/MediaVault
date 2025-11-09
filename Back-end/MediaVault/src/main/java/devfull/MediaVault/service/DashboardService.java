package devfull.MediaVault.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import devfull.MediaVault.entities.Arquivo;
import devfull.MediaVault.entities.User;
import devfull.MediaVault.entities.DTO.ArquivoInfoDTO;
import devfull.MediaVault.entities.DTO.DashboardStatsDTO;
import devfull.MediaVault.entities.DTO.UserStatsDTO;
import devfull.MediaVault.repositories.ArquivoRepository;

@Service
public class DashboardService {

	@Autowired
	private ArquivoRepository repositor;

	public DashboardStatsDTO buscarDados() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<Arquivo> arquivos = repositor.findAllByUserId(user.getId());

		DashboardStatsDTO dash = new DashboardStatsDTO();
		dash.setTotalFiles(arquivos.size());
		dash.setValidFiles(contarPorStatus(arquivos, "valid"));
		dash.setExpiringFiles(contarPorStatus(arquivos, "expiring"));
		dash.setExpiredFiles(contarPorStatus(arquivos, "expired"));
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



	private List<ArquivoInfoDTO> arquivosRecentes(List<Arquivo> arquivos) {
		return arquivos.stream().sorted(Comparator.comparing(Arquivo::getData_upload).reversed()).limit(5)
				.map(ArquivoInfoDTO::new).toList();
	}
}

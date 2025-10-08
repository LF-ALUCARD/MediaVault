package devfull.MediaVault.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import devfull.MediaVault.entities.Arquivo;
import devfull.MediaVault.entities.User;

public interface ArquivoRepository extends JpaRepository<Arquivo, Long>{

	User findByNome(String Nome);
	Boolean existsByNomeAndUserId(String Nome, Long id); 
}

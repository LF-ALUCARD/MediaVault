package devfull.MediaVault.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import devfull.MediaVault.entities.Arquivo;
import devfull.MediaVault.entities.User;

public interface ArquivoRepository extends JpaRepository<Arquivo, Long>{

	User findByNome(String Nome);
	Boolean existsByNomeAndUserId(String Nome, Long id);
	Integer countByUserId(Long id);

    @Query("SELECT COALESCE(SUM(a.tamanho), 0) FROM Arquivo a WHERE a.user.id = :id")
    Long sumTamanhoByUserId(@Param("id") Long id);

}

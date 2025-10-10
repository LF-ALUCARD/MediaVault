package devfull.MediaVault.entities.config;


import devfull.MediaVault.entities.Arquivo;
import devfull.MediaVault.repositories.ArquivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ArquivoScheduler {

    @Autowired
    private ArquivoRepository arquivoRepository;

    // Executa ao iniciar a API
    @PostConstruct
    public void executarAoIniciar() {
        atualizarStatusEDiasRestantes();
    }

    // Executa todo dia à meia-noite
    @Scheduled(cron = "0 0 0 * * *")
    public void atualizarStatusEDiasRestantes() {
        List<Arquivo> arquivos = arquivoRepository.findAll();

        for (Arquivo a : arquivos) {
            int dias = (int) ChronoUnit.DAYS.between(LocalDate.now(), a.getData_expiracao());
            a.setDias_restantes(dias);

            if (dias > 50) {
                a.setStatus("valid");
            } else if (dias > 0) {
                a.setStatus("expiring");
            } else {
                a.setStatus("expired");
                a.setDias_restantes(0);
            }
        }

        arquivoRepository.saveAll(arquivos);
    }
}


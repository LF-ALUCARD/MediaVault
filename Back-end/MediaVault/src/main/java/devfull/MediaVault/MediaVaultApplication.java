package devfull.MediaVault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MediaVaultApplication {

	public static void main(String[] args) {
		SpringApplication.run(MediaVaultApplication.class, args);
	}

}

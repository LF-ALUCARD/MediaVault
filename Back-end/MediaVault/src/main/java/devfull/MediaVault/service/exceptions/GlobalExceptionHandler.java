package devfull.MediaVault.service.exceptions;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(CredenciaisInvalidasException.class)
	public ResponseEntity<Map<String, Object>> handleCredenciaisInvalidas(CredenciaisInvalidasException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", ex.getMessage());
		body.put("error", "INVALID_CREDENTIALS");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
	}

	@ExceptionHandler(EmailDuplicadoException.class)
	public ResponseEntity<Map<String, Object>> handleEmailDuplicado(EmailDuplicadoException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", ex.getMessage());
		body.put("error", "EMAIL_ALREADY_EXISTS");
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
		return ResponseEntity.badRequest().body(e.getMessage());
	}

	@ExceptionHandler(IOException.class)
	public ResponseEntity<String> handleIOException(IOException e) {
		return ResponseEntity.status(500).body("Erro ao processar arquivo: " + e.getMessage());

	}
	
	@ExceptionHandler(ArquivoInvalidoException.class)
	public ResponseEntity<Map<String, Object>> handleArquivoInvalido(ArquivoInvalidoException ex) {
	    Map<String, Object> body = new HashMap<>();
	    body.put("message", ex.getMessage());
	    body.put("error", "INVALID_FILE");
	    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
	}
}

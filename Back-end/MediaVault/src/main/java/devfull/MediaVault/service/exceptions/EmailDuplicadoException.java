package devfull.MediaVault.service.exceptions;

public class EmailDuplicadoException extends RuntimeException{

	private static final long serialVersionUID = 1L;
	
	public EmailDuplicadoException(String msg) {
		super(msg);
	}
}

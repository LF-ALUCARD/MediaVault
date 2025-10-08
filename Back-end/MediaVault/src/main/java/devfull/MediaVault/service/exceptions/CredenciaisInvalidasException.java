package devfull.MediaVault.service.exceptions;

public class CredenciaisInvalidasException extends RuntimeException{

	private static final long serialVersionUID = 1L;
	
	public CredenciaisInvalidasException(String msg) {
		super(msg);
	}
}

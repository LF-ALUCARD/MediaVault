package devfull.MediaVault.service.exceptions;

public class ArquivoInvalidoException extends RuntimeException{

	private static final long serialVersionUID = 1L;
	
	public ArquivoInvalidoException(String msg) {
		super(msg);
	}
}

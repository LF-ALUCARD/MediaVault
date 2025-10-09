package devfull.MediaVault.service.exceptions;

public class AcessoNegadoException extends RuntimeException{

	private static final long serialVersionUID = 1L;
	
	public AcessoNegadoException (String msg) {
		super(msg);
	}
}

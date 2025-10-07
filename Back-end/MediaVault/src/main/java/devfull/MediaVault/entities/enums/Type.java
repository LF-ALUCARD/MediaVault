package devfull.MediaVault.entities.enums;

public enum Type {
	MP4(1),
	AVI(2),
	MOV(3),
	MP3(4),
	WAV(5),
	AAC(6);
	
	private int code;
	
	private Type (int code) {
		this.code = code;
	}
	
	public int getCode() {
		return this.code;
	}
	
	public static Type valueOf(int code) {
		for(Type x : Type.values()) {
			if (x.getCode() == code) {
				return x;
			}
		}
		throw new IllegalArgumentException("Códico invalido");
	}
}

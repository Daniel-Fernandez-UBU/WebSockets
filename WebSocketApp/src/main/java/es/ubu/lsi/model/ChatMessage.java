package es.ubu.lsi.model;

public class ChatMessage {
    private MessageType type;
    private String text;
    private String from;
    private String from_id;
    private int from_level;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

	public String getFrom_id() {
		return from_id;
	}

	public void setFrom_id(String from_id) {
		this.from_id = from_id;
	}

	public Integer getFrom_level() {
		return from_level;
	}

	public void setFrom_level(int level) {
		this.from_level = level;
	}
    
    
    
}
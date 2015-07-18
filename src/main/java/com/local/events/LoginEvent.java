package com.local.events;

import org.springframework.context.ApplicationEvent;

public class LoginEvent extends ApplicationEvent {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1175375713177387806L;
	private final String user;
	private final String message;
	  
	public LoginEvent(Object source, String user, String message) {
		super(source);
		this.user = user;
		this.message = message;
	}

	public String getUser() {
		return user;
	}

	public String getMessage() {
		return message;
	}

}

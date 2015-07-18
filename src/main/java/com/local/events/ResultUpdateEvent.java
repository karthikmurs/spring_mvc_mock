package com.local.events;

import org.springframework.context.ApplicationEvent;

public class ResultUpdateEvent extends ApplicationEvent {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1175375713177387806L;
	private final Integer resultId;
	  
	public ResultUpdateEvent(Object source, Integer resultId) {
		super(source);
		this.resultId = resultId;
	}

	public Integer getResultId() {
		return resultId;
	}

}

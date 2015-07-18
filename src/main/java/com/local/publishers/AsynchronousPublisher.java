package com.local.publishers;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;

import com.local.events.LoginEvent;

public class AsynchronousPublisher implements ApplicationEventPublisherAware {
	private ApplicationEventPublisher publisher = null;
	@Override
	public void setApplicationEventPublisher(
			ApplicationEventPublisher applicationEventPublisher) {
		publisher = applicationEventPublisher;
		
	}
	
	 /**
     * publish
     * @param message
     */
    public void publish(String user, String message) {
        publisher.publishEvent(new LoginEvent(this, user ,message));
    }
}
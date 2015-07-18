package com.local.publishers;

import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.stereotype.Component;

@Component
public class RMSEventPublisher implements ApplicationEventPublisherAware {
	private ApplicationEventPublisher publisher = null;
	
	@Override
	public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
		publisher = applicationEventPublisher;
	}
	
	 /**
     * publish
     * @param message
     */
    public void publish(ApplicationEvent event) {
        publisher.publishEvent(event);
    }

}
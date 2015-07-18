package com.local.listeners;

import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.local.events.LoginEvent;

@Component
public class LoggerEventListener implements ApplicationListener<LoginEvent>{

	@Override
	public void onApplicationEvent(LoginEvent event) {
		System.err.println("LoginEvent (LoggerEventListener) :::: User = "+event.getUser());
		System.err.println("LoginEvent (LoggerEventListener) :::: Random sleep for 5 seconds.");
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		System.err.println("LoginEvent (LoggerEventListener) :::: End of Event handler..");
		
	}

}

package com.local.listeners;

import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.local.events.LoginEvent;

@Component
public class LoginEventListener implements ApplicationListener<LoginEvent>{

	@Override
	public void onApplicationEvent(LoginEvent event) {
		System.err.println("LoginEvent (LoginEventListener) :::: User = "+event.getUser());
		System.err.println("LoginEvent (LoginEventListener) :::: End of Event handler..");
	}

}

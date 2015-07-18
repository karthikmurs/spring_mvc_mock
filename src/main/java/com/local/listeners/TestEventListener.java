package com.local.listeners;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.local.events.ResultUpdateEvent;
import com.local.model.User;
import com.local.service.DatabaseService;

@Component
public class TestEventListener implements ApplicationListener<ResultUpdateEvent>{

	@Autowired
	private DatabaseService dbService;
	
	@Override
	public void onApplicationEvent(ResultUpdateEvent event) {
		System.err.println("ResultUpdateEvent (TestEventListener) :::: Result ID = "+event.getResultId());
		System.err.println("ResultUpdateEvent (TestEventListener) :::: Random sleep for 5 seconds.");
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		List<User> usersList = dbService.getDbObjects(User.class);
		System.out.println("Total users in system: "+usersList.size());
		System.err.println("ResultUpdateEvent (TestEventListener) :::: End of Event handler..");
	}

}

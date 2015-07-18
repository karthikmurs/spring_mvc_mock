package com.local.test;

import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.local.events.LoginEvent;
import com.local.events.ResultUpdateEvent;
import com.local.model.User;
import com.local.publishers.RMSEventPublisher;
import com.local.service.DatabaseService;
import com.local.wiring.TestClass;


/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	
	@Autowired
	private ApplicationContext appContext;
	
	@Autowired
	private ApplicationEventPublisher aPublisher;
	
	@Autowired
	private RMSEventPublisher rmsEventPublisher;
	
	@Autowired
	private DatabaseService dbService;
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String login(Locale locale, Model model, HttpSession session) {
		logger.info("Checking if user is logged into session");
		if(session.getAttribute("loggedInUser") == null){
			//return "redirect:/login";
			System.err.println("No users logged in. Redirecting to login form.");
			return "redirect:/login";
		}else{
			//return "redirect:/home";
			return "loginForm";
		}
		
		
	}
	
	@RequestMapping(value = "/login", method = { RequestMethod.POST, RequestMethod.GET })
	public String login(@RequestParam (value="username", required=false) String username , HttpSession session, Model model) {
		if(username == null){
			return "loginForm";
		}
		
		User user = dbService.getRegisteredUser(username);
		if(user == null){
			model.addAttribute("loginError", "Invalid userId. Try again!" );
			return "loginForm";
		} else{
			session.setAttribute("loggedInUser", username);
			return "redirect:/home";
		}
	}
	
	@RequestMapping(value = "/logout")
	public String logout(HttpSession session, Model model) {
		session.removeAttribute("loggedInUser");
		return "redirect:/";
	}
	@RequestMapping(value = "/home", method = RequestMethod.GET)
	public String karHome(Locale locale, Model model, HttpSession session) {
		logger.info("Welcome home, "+session.getAttribute("loggedInUser")+"! The client locale is {}.", locale);
		
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
		model.addAttribute("serverTime", formattedDate );
		
		return "home";
	}

	@RequestMapping(value = "/event", method = RequestMethod.GET)
	public String eventTest(Locale locale, Model model) {
		
		//RMSEventPublisher rmsEventPublisher =  appContext.getBean("rmsEventPublisher", RMSEventPublisher.class);
		
		System.err.println("Before ResultUpdateEvent");
		rmsEventPublisher.publish(new ResultUpdateEvent(this, 12345));
		System.err.println("After ResultUpdateEvent");
		
		return "home";
	}

	@RequestMapping(value = "/hibernate", method = RequestMethod.GET)
	public String hibernateTest(Locale locale, Model model) {
		
		// Retrieve test.
		System.out.println("\n\n=============================");
		System.out.println("Retrieve test");
		System.out.println("=============================");
		List<User> usersList = dbService.getDbObjects(User.class);
		System.out.println("Total users in system: "+usersList.size());

		// Update test.
		/*
		System.out.println("\n\n=============================");
		System.out.println("Update test");
		System.out.println("=============================");
		User user = (User) dbService.getDbObject(User.class, 1);

		if(user != null){
			System.out.println("Changing password of user: "+user.getUsername());
			System.out.println("Old password: "+user.getPassword());
			user.setPassword("Password");
			
			dbService.updateDbObject(user);
			System.out.println("New password: "+user.getPassword());
		}
		*/
		
		aPublisher.publishEvent(new ResultUpdateEvent(this, 12345));
		/*
		//Create test
		System.out.println("\n\n=============================");
		System.out.println("Create test");
		System.out.println("=============================");
		
		User newUser = new User();
		
		newUser.setUsername("kar2");
		newUser.setPassword("kar");
		newUser.setLastLogin(new Date());
		newUser.setIsAdmin(true);
		dbService.createDbObject(newUser);
		*/
		
		return "home";
		
	}
	
}

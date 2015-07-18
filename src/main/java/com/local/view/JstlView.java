package com.local.view;

import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.view.InternalResourceView;

public class JstlView extends InternalResourceView{
	
	private static final Logger logger = LoggerFactory.getLogger(JstlView.class);
	
	private static final String JSP_LOC = "/WEB-INF/views/";
	/*
	@Override
	protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		// TODO Auto-generated method stub
		super.renderMergedOutputModel(model, request, response);
	}
	*/
	@Override
	protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {		

		// Expose the model object as request attributes.
		exposeModelAsRequestAttributes(model, request);

		//Determine the path for the request dispatcher
		String dispatcherPath = prepareForRendering(request, response);
		String jsp = dispatcherPath.substring(dispatcherPath.lastIndexOf("/") + 1);
		
		String url = request.getRequestURL().toString();
		
//		System.err.println("===============================================================================");
//		System.err.println("dispatcherPath = "+ dispatcherPath);
//		System.err.println("jsp = "+ jsp);
//		System.err.println("url = "+ url);
//		System.err.println("===============================================================================");

		//set the original view being asked for as a request parameter
		request.setAttribute("partial", jsp);
		//logger.info("Partial " + (String)request.getAttribute("partial"));
		
		// force everything to be template.jsp
		//RequestDispatcher requestDispatcher = request.getRequestDispatcher(JSP_LOC + jsp);
		
		RequestDispatcher requestDispatcher = request.getRequestDispatcher(JSP_LOC + "template.jsp");
		requestDispatcher.include(request, response);	
	}	


}

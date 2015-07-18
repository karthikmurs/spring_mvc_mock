package com.local.service;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.local.model.User;

@Service
@Transactional
public class DatabaseService {

	private static final Logger logger = LoggerFactory.getLogger(DatabaseService.class);
	
	@Autowired
	SessionFactory sessionFactory;
	
	
	public Integer createDbObject(Object obj){
		
		Session session = null; 
		Transaction tx = null;
		Integer insertId = null;
		
		try{
			session = sessionFactory.getCurrentSession();
			
			insertId = (Integer) session.save(obj);
			
		} catch (Exception e){
			logger.error("Exception occured: "+ e.getMessage());
			e.printStackTrace();
			return null;
		}
		
		return insertId;
		
	}

	public void updateDbObject(Object obj){
		
		Session session = null; 
		Transaction tx = null;
		
		try{
			session = sessionFactory.getCurrentSession();
			if(session.getTransaction().isActive()){
				System.err.println("TRANSACTION IS ACTIVE");
			} else{
				System.err.println("TRANSACTION IS NOT ACTIVE");
			}
			
			session.update(obj);

			session.flush();
		} catch (Exception e){
			logger.error("Exception occured: "+ e.getMessage());
			e.printStackTrace();
		}
		
	}

	public List getDbObjects(Class claz){
		List list = null;
		Session session = null;
		try{
			session = sessionFactory.getCurrentSession();
			list = session.createCriteria(claz).list();
		} catch(Exception e){
			logger.error("Exception occured: "+ e.getMessage());
			e.printStackTrace();
		}
		return list;
		
	}

	@Transactional
	public Object getDbObject(Class claz, Integer id){
		Object object = null;
		Session session = null;
		try{
			session = sessionFactory.getCurrentSession();
			object = session.get(claz, id);
		} catch(Exception e){
			logger.error("Exception occured: "+ e.getMessage());
			e.printStackTrace();
		}
		
		return object;
		
	}
	
	
	public User getRegisteredUser(String username){
		System.err.println("Searching for user:"+username);
		String hql =	"select user from User user " +
						" WHERE user.username = :username";
		
		User user = (User) sessionFactory.getCurrentSession().createQuery(hql).setString("username", username).uniqueResult();
		
		if(user != null){
			System.err.println("User found: "+user.getUsername()+"/"+user.getPassword());
		} else{
			System.err.println("User not found.");
		}
		
		return user;
	}
	
	
}


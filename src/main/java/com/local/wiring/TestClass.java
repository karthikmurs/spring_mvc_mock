package com.local.wiring;

import org.springframework.stereotype.Component;

@Component
public class TestClass {
	private Integer i;

	public TestClass() {
		this.i = 5;
	}
	public TestClass(Integer i) {
		this.i = i;
	}
	
	public void print(){
		System.out.println("Value of i = "+this.i);
	}
}

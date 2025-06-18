package com.hiddenstar.main;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Handles requests for the application home page.
 */
@Controller
public class MainController {
	
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/main", method = RequestMethod.GET)
	public String main(Model model, HttpServletRequest request, HttpServletResponse response) {
		
		
		
		model.addAttribute("", "");
		
		return "main";
	}
	
	@RequestMapping(value = "/regist", method = RequestMethod.GET)
	public String regist(Model model, HttpServletRequest request, HttpServletResponse response) {
		
		
		     
		model.addAttribute("", "");
		
		return "regist";
	}
	
}

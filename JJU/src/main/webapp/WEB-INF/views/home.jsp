<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<html>
<head>
	<title>Home</title>
	<link rel="stylesheet" type="text/css" href="<c:url value="/common/css/common.css"/>" />
	<link rel="stylesheet" type="text/css" href="<c:url value="/common/css/contents.css"/>" />
	<link rel="shortcut icon" href="/common/img/favicon.png" type="image/x-icon" />
</head>
<body>
<div class="background">
	<P>${serverTime}</P>
		<div class="logo_box">
			<img src="<c:url value="/common/img/logo.png"/>" alt="JJU 시스템">
		</div>
		<!-- 로그인 박스 -->
        <div class="login_box_w" id="content">
	        <div class="login_box_tb">
	            <div class="login_box_td logtd01">
	                <div class="loglow_01">
	                    <div class="loglow_lay">
	                        <a href="#" onclick="js_regFormPop();" class="btn_logsmbox" title="사용자 등록 새창 열림">사용자 등록</a>
	                    </div>
	                </div>
	                <div class="loglow_02">
	                    
	                    <form:form name="dataForm" method="post" autocomplete="off"
	                        action="loginAction.do" onsubmit="return js_loginAction();">
	                        <input type="hidden" name="mgrId" id="mgrId" />
	                        <input type="hidden" name="mgrEncPwd" id="mgrEncPwd" />
	                        
	                        <div class="logform_tb">                                        
	                            <div class="logform_tr">
	                                <div class="logform_cell logfth"><label for="logf01" class="logf_lab">아이디 :</label></div>
	                                <div class="logform_cell logftd"><input type="text" name="_mgrId" id="_mgrId" value="<c:out value="${cookieMgrId}" />" 
	                                    maxlength="8" class="logf_int" title="아이디 입력"></div> 
	                            </div>
	                            <div class="logform_tr">
	                                <div class="logform_cell logfth"><label for="logf02" class="logf_lab">비밀번호 :</label></div>
	                                <div class="logform_cell logftd">
	                                    <input type="password" name="_mgrEncPwd" id="_mgrEncPwd" class="logf_int" title="비밀번호 입력">
	                                    <div class="logf_else_w">
	                                        <div class="fitem">
	                                            <input type="checkbox" id="rememberMe" name="rememberMe" class="fchrd" ${not empty cookieMgrId ? 'checked=checked' : ''}>
	                                            <label for="rememberMe" class="fchrd_lab">아이디 저장</label>
	                                        </div>
	                                    </div>
	                                    <div class="btn_logfsm_w"><button type="submit" class="btn_logfsm"><span class="logfsm_in">로그인</span></button></div>
	                                </div>
	                            </div>
	                            <div id="publicKey" style="display: none;"></div>
	                        </div>
	                    </form:form>
	                    
	                    <ul class="logfdash_list">
	                        <li>비밀번호 분실 시 시스템관리자에게 문의해주세요 <span class="logfelse_sym"></span></li>
	                        <li>아이디와 비밀번호는 대소문자를 구분하니 유의하시기 바랍니다.</li>
	                    </ul>
	                </div>
	            </div>
	        </div>
	    </div>
	    <!-- // 로그인 박스 -->        
</div>


<script type="text/javascript">
	var js_regFormPop = function (){
		window.open();
	}
</script>
</body>
</html>

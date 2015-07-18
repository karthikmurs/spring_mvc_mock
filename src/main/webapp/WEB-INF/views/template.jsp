<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<html>
	<head>
		<meta charset="UTF-8">
	   	<title>SpringMVCTest</title>
	    
	    <!-- Favicon (see resources/images -->
		<link rel="icon" href="<c:url value="/resources/images/favicon.ico" />" type="image/x-icon" />
		<link rel="shortcut icon" href="<c:url value="/resources/images/favicon.ico" />" type="image/x-icon" />

	    <!-- Bootstrap core CSS -->
	    <link href="<c:url value="/resources/css/bootstrap.css" />" rel="stylesheet" type="text/css" />
	
	    <!-- Displaytag.css -->
	    <link href="<c:url value="/resources/css/displaytag.css" />" rel="stylesheet" type="text/css" />
	    
	    <!-- DataTables -->
	    <link href="<c:url value="/resources/css/jquery.dataTables.css" />" rel="stylesheet" type="text/css" />
	    <link href="<c:url value="/resources/css/jquery.dataTables.fixedHeader.css" />" rel="stylesheet" type="text/css" />
	    <link href="<c:url value="/resources/css/jquery.dataTables.colVis.css" />" rel="stylesheet" type="text/css" />
	    <link href="<c:url value="/resources/css/TableTools.css" />" rel="stylesheet" type="text/css" />
	    
	    <!-- Datepicker css -->
	    <link href="<c:url value="/resources/css/datepicker.css" />" rel="stylesheet" type="text/css" />
	    
	    <!-- Timepicker css -->
	    <link href="<c:url value="/resources/css/bootstrap-timepicker.css" />" rel="stylesheet" type="text/css" />
	    
	   	<!-- Bootstrap DateTime Picker https://github.com/Eonasdan/bootstrap-datetimepicker -->
		<link href="<c:url value="/resources/css/bootstrap-datetimepicker.css" />" rel="stylesheet" type="text/css" />
	   	
	   	<!-- Select Box CSS -->
	   	
	   	<link href="<c:url value="/resources/css/bootstrap-select.css" />" rel="stylesheet" type="text/css" />
	   	
	   	<!-- Multiselect DD CSS -->
	   	<link href="<c:url value="/resources/css/bootstrap-multiselect.css" />" rel="stylesheet" type="text/css" />
	   	
	   	<!-- Bootstrap Tags Input CSS -->
	   	<link href="<c:url value="/resources/css/bootstrap-tagsinput.css" />" rel="stylesheet" type="text/css" />
	   	
	   	<!-- HighSlide (for HTML and image transitions/popover) -->
	   	<link href="<c:url value="/resources/css/highslide/highslide.css" />" rel="stylesheet" type="text/css" />
	   	
	   	<!-- Chart Rendering -->
		<script type="text/javascript" src="<c:url value="/resources/js/rgbcolor.js" />"></script> 
		<script type="text/javascript" src="<c:url value="/resources/js/StackBlur.js" />"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/canvg.js" />"></script> 

	    <!-- jQuery, Boostrap, etc. -->
	    <script src="<c:url value="/resources/js/jquery.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/bootstrap.js" />" type="text/javascript"></script>
	    <script src="<c:url value="/resources/js/bootstrap-datepicker.js" />" type="text/javascript"></script>
	    <script src="<c:url value="/resources/js/bootstrap-timepicker.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/bootstrap-typeahead.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery.jstree.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery.jstree.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/json2html.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery.json2html.js" />" type="text/javascript"></script>	
		<script src="<c:url value="/resources/js/jquery.stalker.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/bootstrapx-clickover.js" />" type="text/javascript"></script>

		<!-- DataTables and Plugins -->
		<script src="<c:url value="/resources/js/jquery.dataTables.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery.dataTables.rowGrouping.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery.dataTables.fixedHeader.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery.dataTables.fixedColumns.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery.dataTables.scroller.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery.dataTables.fixedHeader.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery.dataTables.sortNumeric.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery.dataTables.colVis.min.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/TableTools.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/ZeroClipboard.js" />" type="text/javascript"></script>
		
		<!-- Select Box JS -->
		<script src="<c:url value="/resources/js/bootstrap-select.js" />" type="text/javascript"></script>

		<!-- Multiselect DD -->
		<script src="<c:url value="/resources/js/bootstrap-multiselect.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/bootstrap-select.js" />" type="text/javascript"></script>
		
		<!-- jEditable Datatables -->
		<script src="<c:url value="/resources/js/jquery.jeditable.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/jquery.dataTables.editable.js" />" type="text/javascript"></script>		
		
		<!-- Ajax File Upload -->
		<script type='text/javascript' src='<c:url value="/resources/js/fileupload/vendor/jquery.ui.widget.js"/>'></script>
		<script type='text/javascript' src='<c:url value="/resources/js/fileupload/jquery.iframe-transport.js"/>'></script>
		<script type='text/javascript' src='<c:url value="/resources/js/fileupload/jquery.fileupload.js"/>'></script>
		
		<!-- Growl Type Messages -->
		<script type='text/javascript' src='<c:url value="/resources/js/bootstrap-growl.js"/>'></script>

		<!-- JQuery Block UI -->
		<script type='text/javascript' src='<c:url value="/resources/js/jquery.blockUI.js"/>'></script>
		<script type='text/javascript' src='<c:url value="/resources/js/jquery.blockUI.manager.js"/>'></script>
		
		<!-- Underscore JS -->
		<script type='text/javascript' src='<c:url value="/resources/js/underscore.js"/>'></script>

		<!-- history -->
		<script src="<c:url value="/resources/js/history.js" />" type="text/javascript"></script>
		<script src="<c:url value="/resources/js/history.manager.js" />" type="text/javascript"></script>

		<!-- ScrollTo JS -->
		<script type='text/javascript' src='<c:url value="/resources/js/jquery-scrollto.js"/>'></script>
		
		<!-- JQuery ScrollTo  http://demos.flesler.com/jquery/scrollTo/ -->
		<script type='text/javascript' src='<c:url value="/resources/js/jquery.scrollTo.js"/>'></script>
		
		<!-- Moment.js http://momentjs.com/ -->
		<script type='text/javascript' src='<c:url value="/resources/js/moment.js"/>'></script>
		
		<!-- Bootstrap DateTime Picker https://github.com/Eonasdan/bootstrap-datetimepicker -->
		<script type='text/javascript' src='<c:url value="/resources/js/bootstrap-datetimepicker.min.js"/>'></script>
		
		<!-- Bootstrap Tags Input http://timschlechter.github.io/bootstrap-tagsinput/examples/ -->
		<script type='text/javascript' src='<c:url value="/resources/js/bootstrap-tagsinput.js"/>'></script>
		
		<!-- HighCharts http://www.highcharts.com -->
		<script type='text/javascript' src='<c:url value="/resources/js/highcharts/highcharts.js"/>'></script>
		<script type='text/javascript' src='<c:url value="/resources/js/highcharts/highcharts-more.js"/>'></script>
		<script type='text/javascript' src='<c:url value="/resources/js/highcharts/modules/exporting.js"/>'></script>
		

		<!-- RMS libraries (only include here if it will benefit most pages in RMS) -->

	</head>

  	<body>
  	
		 		
 		<div id="navbarProgressSpinner" style="display: none;">
 			<div class="alert alert-warning text-center" style="border: 4px solid #000000">
 				<button type="button" class="close" data-dismiss="alert" aria-hidden="true" onclick="$.unblockUI()">&times;</button>
				<img src="<c:url value="/resources/images/loading-spinner-green-bg.gif"/>" /> <h3>Loading...</h3>
			</div>
		</div>
		
		
	    <!-- Wrap all page content here -->
	    <div id="wrap">
	    
	    	<!-- Warning about DB Connection != production database -->
	    	<!-- See DbWarningInterceptor.java for details -->
	    	<!-- 
	    	<c:if test="${not prodDbConnection }">
	    		<div class="alert alert-danger alert-dismissable text-center">
	    			<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
	    			<strong>Warning!</strong> Database is not connected to dbcrpmysqlprd05:3318
	    		</div>
	    	</c:if>
 			-->

	      	<!-- Fixed navbar -->
			<jsp:include page="/WEB-INF/views/navbar.jsp" />
	
			<!-- JstlView will intercept resource loads and replace target JSP with template.jsp and put the target JSP in {partial} -->
			<jsp:include page="${partial}" />
	
	    	<!--  Footer -->
	    	<jsp:include page="/WEB-INF/views/footer.jsp" />
	    	
	    	<img id="hiddenProgressGIF" src="<c:url value="/resources/images/loading-indicator.gif" />" style="display:none" />
	    	
    	</div>

	</body>
</html>

<!-- 
***********************************************************************************************************************
**           Confidential and Proprietary - Qualcomm Technologies, Inc.
**
**           This technical data may be subject to U.S. and international export, re-export, or transfer 
**           ("export") laws. Diversion contrary to U.S. and international law is strictly prohibited. 
**
**           Restricted Distribution: Not to be distributed to anyone who is not an employee of either
**           Qualcomm or its subsidiaries without the express approval of Qualcomm's Configuration
**           Management.
**
**           Copyright © 2013-2015 Qualcomm Technologies, Inc 
************************************************************************************************************************
-->

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
<title>SpringMVCDemo: Login</title>
</head>
<body>
	<div id="content">
		<div class="container">
			<form class="form-horizontal form-signin" action="login" method="post">
				<h2 class="form-signin-heading">Please sign in</h2>
				<c:if test="${loginError != null}">
					<div class="form-group">
						<div class="alert alert-danger" role="alert">${loginError}</div>
					</div>
				</c:if>
				<div class="form-group">
					<label for="inputEmail" class="sr-only">Username</label> 
					<input type="text" id="username" name="username" class="form-control" placeholder="Username" required autofocus>
				</div> 
				<div class="form-group">
					<label for="inputPassword" class="sr-only">Password</label> 
					<input type="password" id="password" name="password" class="form-control" placeholder="Password" required>
				</div>
				<div class="form-group">
					<div class="checkbox">
						<label> <input type="checkbox" value="remember-me">
							Remember me
						</label>
					</div>
				</div>
				<div class="form-group">
					<button class="btn btn-lg btn-primary" type="submit">Sign in</button>
				</div>
			</form>
		</div>
	</div>
</body>
</html>
/**
 * A wrapper over history.js
 * 
 * history.js provides the capability to update a page's url dynamically, however you have to provide the entire url
 * to history.js.  The history.manager.js wrapper provides the capability to only provide the query parameters which must change
 * as a convinience so the developer doesn't have to build the entire query string again.
 * 
 * @author mtony
 */

/**
 * update given query parameters in the url dynamically.
 * queryParams is a map of query parameters where the keys are the parameter names and the values are the parameter values.
 * 
 */
function updateUrl(queryParams){
	if( !queryParams ){
		return;
	}
	
	var existingQueryString = window.location.search;
	
	var newParams = {};
	if(existingQueryString) {
		var existingParamPairs = existingQueryString.replace("?","").split("&");		
		
		// update existing paramaters
		for( var existingParamIndex  in existingParamPairs ){
			var existingParamPair = existingParamPairs[existingParamIndex];
			var existingParamName = existingParamPair.split("=")[0];
			var existingParamValue = existingParamPair.split("=")[1];
			if( existingParamName in queryParams ){
				newParams[existingParamName] = queryParams[existingParamName];
				delete queryParams[existingParamName];
			}else{
				newParams[existingParamName] = existingParamValue;
			}
		}
	}	
	
	// add new parameters
	for( var paramName  in queryParams ){
		newParams[paramName] = queryParams[paramName];
	}
	
	var newQueryString = "";
	if( Object.keys(newParams).length > 0 ){
		newQueryString = "?";
		for( var paramName in newParams ){
			newQueryString += (paramName + "=" + newParams[paramName] + "&");
		}
		newQueryString = newQueryString.substring(0, newQueryString.length - 1);
	}
	
	history.pushState(null, null, newQueryString);
}

/**
 * remove the given list of query parameters.
 * 
 * @param queryParams a list of parameter names
 */
function removeUrlParameters(queryParams){
	if( !queryParams ){
		return;
	}
	
	var existingParamPairs = window.location.search.replace("?","").split("&");
	var newParams = {};
	
	// update existing paramaters
	for( var existingParamIndex  in existingParamPairs ){
		var existingParamPair = existingParamPairs[existingParamIndex];
		var existingParamName = existingParamPair.split("=")[0];
		var existingParamValue = existingParamPair.split("=")[1];
		
		if( $.inArray(existingParamName, queryParams) ) {
			newParams[existingParamName] = existingParamValue;
		}
	}

	var newQueryString = buildQueryString(newParams);

	history.pushState(null, null, newQueryString);
}

function buildQueryString(queryParams){
	var newQueryString = "";
	if( Object.keys(queryParams).length > 0 ){
		newQueryString = "?";
		for( var paramName in queryParams ){
			newQueryString += (paramName + "=" + queryParams[paramName] + "&");
		}
		newQueryString = newQueryString.substring(0, newQueryString.length - 1);
	}
	return newQueryString;
}
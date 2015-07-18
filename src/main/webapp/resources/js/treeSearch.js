/**
 * 
 */

var to = false;
	
function searchTree(element, treeId){
	
	var serachQ = $(element).val();
		
	//If user Rapidly Typing Make sure you have delay in Tree Search
	if(to){ 
		clearTimeout(to); 
	}
    to = setTimeout(function () {
   		$('#' +  treeId).jstree("search",serachQ);
   	}, 250);
		
}
	
/*
	Traverese Revers Order Each level And Check it it is Highlited
	If found return true
	else false

*/
function isParentHighlited(element){
	
	var level = $(element).attr('level').split("_")[1];
	var isParentHighlited = false;
	var treeStartingLevel = 0;
	
	for(var  i = level ; i >= treeStartingLevel ; i--){
		isParentHighlited = $(element).closest("li[level='level_"+ i + "']").children(".jstree-search").length > 0;
		if(isParentHighlited)
			break;
	}
	return isParentHighlited;
}


function calCulateTreeDepth(){
	
	for(var i = 0 ; i < 10; i++){
		if($("li[level='level_"+ i + "']").length == 0){
			return i;
		}
	}
}

function startSearch(treeRef){
	
	//Remove Last Node Class Which Represent Last Element in Tree
	$(treeRef).find("li").removeClass("jstree-last"); 

	//Remove Hide on Li Elements
	$(treeRef).find("li").show();

	var startingLevel = 0;
	var treeDepth = calCulateTreeDepth();

	for(var i = startingLevel ; i < treeDepth ; i++){
		$("li[level='level_" + i + "']").each(function(){
			
			//IF Element Contains jstree-closed or open  clasess then they are Nodes not Leaves
			var isNode = $(this).hasClass('jstree-closed') || $(this).hasClass('jstree-open');
			
			//Check If Current Node Contains jstree-search class then It is Highlited
			var isHighLited  = $(this).children(".jstree-search").length > 0;
			
			//Check If Current Node Children (Not Children) Contains jstree-search class then At Lease one Children iS Highlited
			var isChildrenAreHighLited =  $(this).children("ul").find("a.jstree-search").length > 0;
			
			//Traverse Reversily To check if Any Parent (OR) Grand Parents are Highlited
			var isparentHighLited =   isParentHighlited(this);
			
			//Check Current Node Parent Contains Atleaset One Child Highlited
			var is_atleast_one_child_highlited_in_parent = $(this).parent().parent().children("ul").find(".jstree-search").length > 0;
			
			
			//if Current Element is Node and Is Highlited Then Expand Tree
			if(isNode && isHighLited){
				if($(this).hasClass('jstree-closed')){
					$(this).children("a").click();
				}
			}
			
			//If nothing(parent and children and selected node) is Highlited in This treee Node then Hide that tree
			else if(! isHighLited && ! isChildrenAreHighLited && isNode && !isparentHighLited){
				$(this).hide();
			}
			
			//*********************************
			//Below are for Tree Leaf nodes
			//*********************************
			
			//IF leaf nodes or its parents not highlited then hide that leaf node
			else if(!isNode && !isHighLited && !isparentHighLited){
				$(this).hide();
			}
			
			//Below Condition True if they satisfy
			// Current Leaf node Not Highlited &
			// Atlease One Parent NOde Not Highlited &
			//But At Same Level Under Parent node Any other leaf nodes is Highlited
			
			else if(!isNode && !isHighLited && isparentHighLited && is_atleast_one_child_highlited_in_parent){
				$(this).hide();
			}  
			  
		});
	
	}
}

function clearSearch(treeRef){
	$(treeRef).find("li").css("display","");
    $(treeRef).jstree("close_all", -1);
}


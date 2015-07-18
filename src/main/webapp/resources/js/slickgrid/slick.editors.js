/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Editors": {
        "Text": TextEditor,
        "Integer": IntegerEditor,
        "Date": DateEditor,
        "YesNoSelect": YesNoSelectEditor,
        "Checkbox": CheckboxEditor,
        "PercentComplete": PercentCompleteEditor,
        "LongText": LongTextEditor,
        "SingleDropdown": SingleDropdownEditor,
        "MultiDropdown": MultiDropdownEditor,
        "Decimal" : DecimalEditor
      }
    }
  });

  function TextEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
            if (e.keyCode === KeyCodeEnum.LEFT || e.keyCode === KeyCodeEnum.RIGHT) {
              e.stopImmediatePropagation();
            }
          })
          .focus()
          .select();
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.getValue = function () {
      return $input.val();
    };

    this.setValue = function (val) {
      $input.val(val);
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field] || "";
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function IntegerEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />");

      $input.bind("keydown.nav", function (e) {
        if (e.keyCode === KeyCodeEnum.LEFT || e.keyCode === KeyCodeEnum.RIGHT) {
          e.stopImmediatePropagation();
        }
      });

      $input.appendTo(args.container);
      $input.focus().select();
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return parseInt($input.val(), 10) || "";
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = "" + state + "";
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      if (isNaN($input.val())) {
        return {
          valid: false,
          msg: "Please enter a valid integer"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }
  
  function DecimalEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />");

      $input.bind("keydown.nav", function (e) {
        if (e.keyCode === KeyCodeEnum.LEFT || e.keyCode === KeyCodeEnum.RIGHT) {
          e.stopImmediatePropagation();
        }
      });

      $input.appendTo(args.container);
      $input.focus().select();
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val() || "";
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = "" + state + "";
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
    
    var decimalPattern = new RegExp("^[-+]?[0-9]+\.?[0-9]+([eE][-+]?[0-9]+)?$");
    var numberPattern = new RegExp("^[0-9]+$");
    
      if (decimalPattern.test($input.val()) || numberPattern.test($input.val()) || $input.val() == "") {
      
      	return {
        	valid: true,
        	msg: null
      	};
        
      } else {
      
      return {
          valid: false,
          msg: "Please enter a valid integer"
        };
      
      	
      }
    };

    this.init();
  }

  function DateEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;
    var calendarOpen = false;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />");
      $input.appendTo(args.container);
      $input.focus().select();
      $input.datepicker({
        showOn: "button",
        buttonImageOnly: true,
        buttonImage: "../images/calendar.gif",
        beforeShow: function () {
          calendarOpen = true
        },
        onClose: function () {
          calendarOpen = false
        }
      });
      $input.width($input.width() - 18);
    };

    this.destroy = function () {
      $.datepicker.dpDiv.stop(true, true);
      $input.datepicker("hide");
      $input.datepicker("destroy");
      $input.remove();
    };

    this.show = function () {
      if (calendarOpen) {
        $.datepicker.dpDiv.stop(true, true).show();
      }
    };

    this.hide = function () {
      if (calendarOpen) {
        $.datepicker.dpDiv.stop(true, true).hide();
      }
    };

    this.position = function (position) {
      if (!calendarOpen) {
        return;
      }
      $.datepicker.dpDiv
          .css("top", position.top + 30)
          .css("left", position.left);
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function YesNoSelectEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>");
      $select.appendTo(args.container);
      $select.focus();
    };

    this.destroy = function () {
      $select.remove();
    };

    this.focus = function () {
      $select.focus();
    };

    this.loadValue = function (item) {
      $select.val((defaultValue = item[args.column.field]) ? "yes" : "no");
      $select.select();
    };

    this.serializeValue = function () {
      return ($select.val() == "yes");
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return ($select.val() != defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function CheckboxEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>");
      $select.appendTo(args.container);
      $select.focus();
    };

    this.destroy = function () {
      $select.remove();
    };

    this.focus = function () {
      $select.focus();
    };

    this.loadValue = function (item) {
      defaultValue = !!item[args.column.field];
      if (defaultValue) {
        $select.attr("checked", "checked");
      } else {
        $select.removeAttr("checked");
      }
    };

    this.serializeValue = function () {
      return !!$select.attr("checked");
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (this.serializeValue() !== defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function PercentCompleteEditor(args) {
    var $input, $picker;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-percentcomplete' />");
      $input.width($(args.container).innerWidth() - 25);
      $input.appendTo(args.container);

      $picker = $("<div class='editor-percentcomplete-picker' />").appendTo(args.container);
      $picker.append("<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /></div></div>");

      $picker.find(".editor-percentcomplete-buttons").append("<button val=0>Not started</button><br/><button val=50>In Progress</button><br/><button val=100>Complete</button>");

      $input.focus().select();

      $picker.find(".editor-percentcomplete-slider").slider({
        orientation: "vertical",
        range: "min",
        value: defaultValue,
        slide: function (event, ui) {
          $input.val(ui.value)
        }
      });

      $picker.find(".editor-percentcomplete-buttons button").bind("click", function (e) {
        $input.val($(this).attr("val"));
        $picker.find(".editor-percentcomplete-slider").slider("value", $(this).attr("val"));
      })
    };

    this.destroy = function () {
      $input.remove();
      $picker.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      $input.val(defaultValue = item[args.column.field]);
      $input.select();
    };

    this.serializeValue = function () {
      return parseInt($input.val(), 10) || 0;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ((parseInt($input.val(), 10) || 0) != defaultValue);
    };

    this.validate = function () {
      if (isNaN(parseInt($input.val(), 10))) {
        return {
          valid: false,
          msg: "Please enter a valid positive number"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  /*
   * An example of a "detached" editor.
   * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
   * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
   */
  function LongTextEditor(args) {
    var $input, $wrapper;
    var defaultValue;
    var scope = this;

    this.init = function () {
      var $container = $("body");

      $wrapper = $("<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
          .appendTo($container);

      $input = $("<TEXTAREA hidefocus rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'>")
          .appendTo($wrapper);

      $("<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
          .appendTo($wrapper);

      $wrapper.find("button:first").bind("click", this.save);
      $wrapper.find("button:last").bind("click", this.cancel);
      $input.bind("keydown", this.handleKeyDown);

      scope.position(args.position);
      $input.focus().select();
    };

    this.handleKeyDown = function (e) {
      if (e.which == KeyCodeEnum.ENTER && e.ctrlKey) {
        scope.save();
      } else if (e.which == KeyCodeEnum.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == KeyCodeEnum.TAB && e.shiftKey) {
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == KeyCodeEnum.TAB) {
        e.preventDefault();
        args.grid.navigateNext();
      }
    };

    this.save = function () {
      args.commitChanges();
    };

    this.cancel = function () {
      $input.val(defaultValue);
      args.cancelChanges();
    };

    this.hide = function () {
      $wrapper.hide();
    };

    this.show = function () {
      $wrapper.show();
    };

    this.position = function (position) {
      $wrapper
          .css("top", position.top - 5)
          .css("left", position.left - 5)
    };

    this.destroy = function () {
      $wrapper.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      $input.val(defaultValue = item[args.column.field]);
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }
  
  function SingleDropdownEditor(args) {
      var $select;
      var defaultValue;
      var scope = this;
      var previousValue;

      this.init = function () {
        var html = "<SELECT tabIndex='0' style='margin-top: 4px'>";
        $.each( args.column.dropdownOptions, function(i, dropdownOption){
            html += "<OPTION value='" + dropdownOption.option + "' data-id='" + dropdownOption.id + "'>" + dropdownOption.option + "</OPTION>";
        });
        html += "</SELECT>";
        $select = $(html);
        $select.appendTo(args.container);
        $select.focus();
      };

      this.destroy = function () {
        $select.remove();
      };

      this.focus = function () {
        $select.focus();
      };

      this.loadValue = function (item) {
      	defaultValue = item[args.column.field];
          $select.val(defaultValue);
          $select[0].defaultValue = defaultValue;
          $select.select();
      };

      this.serializeValue = function () {
        return $select.val();
      };

      this.applyValue = function (item, state) {
        item[args.column.field] = state;
      };

      this.isValueChanged = function () {
        return ($select.val() != defaultValue);
      };

      this.validate = function () {
    	var testValue = $select.val();
      	if( !testValue ){
      		testValue = defaultValue;
      	}
        var inputIsValid = this.isValueValid(testValue);
      	if( inputIsValid ){
          	previousValue = $select.val();
      		return {
                valid: true,
                msg: null
              };
          }else{
          	return {
                valid: false,
                msg: "Not a valid option"
              };
          }
      };

      this.isValueValid = function (value){ 
    	// allow no options to be selected
    	// TODO: when test case meta can be team specific, remove this constraint
    	// because all valid options will be included in the dropdown ahead of time
    	if( !value ){
          return !args.column.required;
        }
    	var inputIsValid = false;
      	$.each( args.column.dropdownOptions, function(i, dropdownOption){
          	if( value == dropdownOption.option ){
          		inputIsValid = true;
          		return false;
              }
      	});
      	return inputIsValid;
      };

      this.undo = function() {
          $select.val(previousValue);
      }

      this.init();
  }
  
  function MultiDropdownEditor(args) {
      var $select;
      var defaultValue;
      var scope = this;
      var previousValue;
      var id;

      this.init = function () {
    	if( !args || !args.column || !args.item ) return;
        id = "MultiDropdownEditor-" + args.column.field + "-" + args.item.ID; 
        var html = "<SELECT id='" + id + "' tabIndex='0' style='margin-top: 4px' multiple='multiple'>";
        $.each( args.column.dropdownOptions, function(i, dropdownOption){
            html += "<OPTION value='" + dropdownOption.option + "'>" + dropdownOption.option + "</OPTION>";
        });
        html += "</SELECT>";
        $select = $(html);
        $select.appendTo(args.container);
        this.renderMultiSelect();
        $select.focus();
        field = args.column.field;
      };
      
      this.renderMultiSelect = function()	{
    	 var idString = "#" + id;
    	 $(idString).multiselect({
   				maxHeight: 300,
   				includeSelectAllOption: false,
   				enableCaseInsensitiveFiltering: true,
   				numberDisplayed: 1
   			});
   		$(idString).multiselect('rebuild');
   	  };

      this.destroy = function () {
    	$("#" + id).multiselect('destroy');
    	if( $select ){
    		$select.remove();
    	}
      };

      this.focus = function () {
        $select.focus();
      };

      this.loadValue = function (item) {
    	if( !args || !args.column || !args.item ) return;
      	var itemValue = item[args.column.field];
      	var arrayValue = this.toArray(itemValue);
      	var strValue = this.toString(itemValue);
      	defaultValue = strValue;
        $select.val(defaultValue);
        $select[0].defaultValue = defaultValue;
        
        // select the values in the dropdown
        if( arrayValue ){
        	$.each( args.column.dropdownOptions, function(i, dropdownOption){
        		if( arrayValue.indexOf( dropdownOption.option ) > -1 ){
					$("#" + id).multiselect('select', dropdownOption.option);
				}else{
					$("#" + id).multiselect('deselect', dropdownOption.option);
				}
        	});
        }
      };

      this.serializeValue = function () {
        return $select.val();
      };
      
      this.toString = function (value) {
    	if( value ){
    		if( value.constructor !== Array ){
    			return value;
    		}
    		
    		var str = "";
            for( var i=0; i<value.length; i++ ){
            	str += value[i];
            	if( i < value.length - 1 ){
            		str += ",";
            	}
            }
            return str;
    	}
    	return "";
      };
      
      this.toArray = function (value) {
  	    if( value ){
  	    	if( value.constructor === Array ){
  	    		return value;
  	    	}
  	    	return value.split(',');
  	    }
  	    return [];
      };

      this.applyValue = function (item, state) {
        item[args.column.field] = this.toString(state);
      };

      this.isValueChanged = function () {
        return ($select.val() != defaultValue);
      };

      this.validate = function () {
    	if( !$select ){
    		return {
                valid: true,
                msg: null
              };
    	}
    	var testValue = $select.val();
    	if( !testValue ){
    		testValue = defaultValue;
    	}
      	var inputIsValid = this.isValueValid(testValue);
      	if( inputIsValid ){
          	previousValue = defaultValue;
      		return {
                valid: true,
                msg: null
              };
          }else{
          	return {
                valid: false,
                msg: "Not a valid option"
              };
          }
      };

      this.isValueValid = function (value){
    	// allow no options to be selected
      	// TODO: when test case meta can be team specific, remove this constraint
      	// because all valid options will be included in the dropdown ahead of time
      	if( !value ){
          return !args.column.required;
        }
    	if( !args || !args.column || !args.item ) return false;
        var inputIsValid = false;
        
        var arrayValue = this.toArray(value); 
        
      	$.each( args.column.dropdownOptions, function(i, dropdownOption){
      		if( arrayValue.indexOf( dropdownOption.option ) > -1 ){
          		inputIsValid = true;
          		return false;
            }
      	});
      	return inputIsValid;
      };

      this.undo = function() {
          $select.val(previousValue);
      };

      this.init();
  }
})(jQuery);

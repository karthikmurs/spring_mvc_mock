(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellExternalCopyManager": CellExternalCopyManager
    }
  });
  
  


  function CellExternalCopyManager(options) {
    /*
      This manager enables users to copy/paste data from/to an external Spreadsheet application
      such as MS-Excel� or OpenOffice-Spreadsheet.
      
      Since it is not possible to access directly the clipboard in javascript, the plugin uses
      a trick to do it's job. After detecting the keystroke, we dynamically create a textarea
      where the browser copies/pastes the serialized data. 
      
      options:
        copiedCellStyle : sets the css className used for copied cells. default : "copied"
        copiedCellStyleLayerKey : sets the layer key for setting css values of copied cells. default : "copy-manager"
        dataItemColumnValueExtractor : option to specify a custom column value extractor function
        dataItemColumnValueSetter : option to specify a custom column value setter function
        clipboardCommandHandler : option to specify a custom handler for paste actions
        includeHeaderWhenCopying : set to true and the plugin will take the name property from each column (which is usually what appears in your header) and put that as the first row of the text that's copied to the clipboard
        bodyElement: option to specify a custom DOM element which to will be added the hidden textbox. It's useful if the grid is inside a modal dialog.
        onCopyInit: optional handler to run when copy action initializes
        onCopySuccess: optional handler to run when copy action is complete
        ingoreFormatting: optional array to specify fields of columns that ignore all formatters on paste
    */
    var _grid;
    var _dataView;
    var _self = this;
    var _copiedRanges;
    var _options = options || {};
    var _copiedCellStyleLayerKey = _options.copiedCellStyleLayerKey || "copy-manager";
    var _copiedCellStyle = _options.copiedCellStyle || "copied";
    var _clearCopyTI = 0;
    var _bodyElement = _options.bodyElement || document.body;
    var _onCopyInit = _options.onCopyInit || null;
    var _onCopySuccess = _options.onCopySuccess || null;
    var _ignoreFormatting = _options.ignoreFormatting || [];
    var _newRowId = 1;

    function init(grid) {
      _grid = grid;
      _dataView = options.dataView;
      _grid.onKeyDown.subscribe(handleKeyDown);
      
      // we need a cell selection model
      var cellSelectionModel = grid.getSelectionModel();
      if (!cellSelectionModel){
        throw new Error("Selection model is mandatory for this plugin. Please set a selection model on the grid before adding this plugin: grid.setSelectionModel(new Slick.CellSelectionModel())");
      }
      // we give focus on the grid when a selection is done on it.
      // without this, if the user selects a range of cell without giving focus on a particular cell, the grid doesn't get the focus and key stroke handles (ctrl+c) don't work
      cellSelectionModel.onSelectedRangesChanged.subscribe(function(e, args){
        _grid.focus();
      });
    }

    function destroy() {
      _grid.onKeyDown.unsubscribe(handleKeyDown);
    }
    
    function getDataItemValueForColumn(item, columnDef) {
      // If we initialized this with an ignoreFormatting option, don't do fancy formatting
      // on the specified fields (just return the plain JS value)
      for (var i=0; i<_ignoreFormatting.length; i++) {
        if (_ignoreFormatting[i] === columnDef.field) {
          return item[columnDef.field];
        }
      }
      if (_options.dataItemColumnValueExtractor) {
        return _options.dataItemColumnValueExtractor(item, columnDef);
      }

      var retVal = '';

      // use formatter if available; much faster than editor
      if (columnDef.formatter) {
          return columnDef.formatter(0, 0, item[columnDef.field], columnDef, item);
      }

      // if a custom getter is not defined, we call serializeValue of the editor to serialize
      if (columnDef.editor){
        var editorArgs = {
          'container':$("<p>"),  // a dummy container
          'column':columnDef,
          'position':{'top':0, 'left':0},  // a dummy position required by some editors
          'item': item
        };
        var editor = new columnDef.editor(editorArgs);
        editor.loadValue(item);
        retVal = editor.serializeValue();
        editor.destroy();
      }
      else {
        retVal = item[columnDef.field];
      }

      return retVal;
    }
    
    function setDataItemValueForColumn(item, columnDef, newValue) {
      var oldValue = _dataView.getItemById(item.id)[columnDef.id];
      var rowIndex = _dataView.getRowById(item.id);
      var columnIndex = _grid.getColumnIndex(columnDef.id);
      var field = columnDef.field;
      
      // prevent pasting into readonly cells
      var cellNode = _grid.getCellNode(rowIndex, columnIndex);
      if( $(cellNode).hasClass("readonly") ){
    	  return;
      }
      
      if (_options.dataItemColumnValueSetter) {
        _options.dataItemColumnValueSetter(item, columnDef, newValue);
        
        /*var args = {
    			rowIndex : rowIndex,
    			field : field,
    			oldValue : oldValue,
    			newValue : newValue
    	};
        _self.onPastedCellChanged.notify(args);*/
        return;
      }

      // if a custom setter is not defined, we call applyValue of the editor to unserialize
      if (columnDef.editor){
        var editorArgs = {
          'container':$("#dummyDiv"),  // a dummy container
          'column':columnDef,
          'position':{'top':0, 'left':0},  // a dummy position required by some editors
          'item': item
        };
        
        var columnIndex = _grid.getColumnIndex(columnDef.id);

        var editor = new columnDef.editor(editorArgs);
        editor.applyValue(item, newValue);
        editor.loadValue(item);
        var validation = editor.validate();
        editor.destroy();
        if( !validation.valid ){
        	_options.invalidateCell(rowIndex, columnIndex);
        }else{
        	var args = {
        			rowIndex : rowIndex,
        			columnIndex: columnIndex,
        			oldValue : oldValue,
        			newValue : newValue
        	};
        	_self.onPastedCellChanged.notify(args);
        }
      }
    }
    
    
    function _createTextBox(innerText){
      var ta = document.createElement('textarea');
      ta.style.position = 'absolute';
      ta.style.left = '0px';
      ta.style.top = (document.body.scrollBottom + 500) + 'px';
      ta.style.opacity = '0.0';
      ta.value = innerText;
      _bodyElement.appendChild(ta);
      ta.select();
      
      return ta;
    }
    
    function getCell(_grid, _dataView, y, x){
    	var columns = _grid.getColumns();
    	var row = _dataView.getItemByIdx(y);
    	var column_x = columns[x];
    	var cell = row[column_x.field];
    	return cell;
    }
    
    function getClipRows(clipText){
    	
    	if( clipText !== undefined && clipText != "" ){
    		if( clipText[0] == "\"" && clipText[clipText.length-1] == "\"" ){
    			
    		}
    	}
    }
    
    function createNewRow(){
    	var item = {};
    	$.each( _grid.getColumns(), function(i, column) {
	    	if( i == 0 ) return;  // skip first checkbox column
			item[column.field] = "";
	    });
	    item["id"] = "newrow-" + _newRowId++; // item["ID"] is cell value in the ID column, item["id"] is a unique identifier required by slickgrid for every row
	    _newRowId++;
	    _dataView.addItem(item);
	    return item;
	}
    
    function getVisibleItems(){
    	var d = [];
    	for(var visibleRowIndex = 0; visibleRowIndex < _dataView.getLength(); visibleRowIndex++){
    		var row = _dataView.getItem(visibleRowIndex);
    		d.push(row);
    	}
    	return d;
    }

    function _decodeTabularData(_grid, _dataView, ta){
      var columns = _grid.getColumns();
      var clipText = ta.value;
      var clipTextStripped = clipText.replace(/^[\r\n]*/g, '').replace(/\n$/, '').replace(/[\r\n]*$/g, '');
      var clippedRange = parseClipboard(clipTextStripped);
      
      _bodyElement.removeChild(ta);

      var selectedCell = _grid.getActiveCell();
      var ranges = _grid.getSelectionModel().getSelectedRanges();
      var selectedRange = ranges && ranges.length ? ranges[0] : null;   // pick only one selection
      var activeRow = null;
      var activeCell = null;
      
      if (selectedRange){
        activeRow = selectedRange.fromRow;
        activeCell = selectedRange.fromCell;
      } else if (selectedCell){
        activeRow = selectedCell.row;
        activeCell = selectedCell.cell;
      } else {
        // we don't know where to paste
        return;
      }
      
      var oneCellToMultiple = false;
      var destH = clippedRange.length;
      var destW = clippedRange.length ? clippedRange[0].length : 0;
      if (clippedRange.length == 1 && clippedRange[0].length == 1 && selectedRange){
        oneCellToMultiple = true;
        destH = selectedRange.toRow - selectedRange.fromRow +1;
        destW = selectedRange.toCell - selectedRange.fromCell +1;
      }
	  var availableRows = _dataView.getLength() - activeRow;
	  var addRows = 0;
	  if(availableRows < destH && _options.createNewRow == true)
	  {
		var d = getVisibleItems();
		for(addRows = 1; addRows <= destH - availableRows; addRows++){
			var newRow = createNewRow();
			d.push(newRow);
		}
		_grid.render();
		_grid.updateRowCount();
	  }  
      var clipCommand = {

        isClipboardCommand: true,
        clippedRange: clippedRange,
        oldValues: [],
        cellExternalCopyManager: _self,
        _options: _options,
        setDataItemValueForColumn: setDataItemValueForColumn,
        markCopySelection: markCopySelection,
        oneCellToMultiple: oneCellToMultiple,
        activeRow: activeRow,
        activeCell: activeCell,
        destH: destH,
        destW: destW,
        desty: activeRow,
        destx: activeCell,
        maxDestY: _dataView.getItems().length,
        maxDestX: _grid.getColumns().length,
        h: 0,
        w: 0,
          
        execute: function() {
          this.h=0;
          for (var y = 0; y < destH; y++){
            this.oldValues[y] = [];
            this.w=0;
            this.h++;
            for (var x = 0; x < destW; x++){
              this.w++;
              var desty = activeRow + y;
              var destx = activeCell + x;
              
              if (desty < this.maxDestY && destx < this.maxDestX ) {
            	var dt = _dataView.getItem(desty);
                this.oldValues[y][x] = dt[columns[destx]['id']];
                if (oneCellToMultiple)
                  this.setDataItemValueForColumn(dt, columns[destx], clippedRange[0][0]);
                else
                  this.setDataItemValueForColumn(dt, columns[destx], clippedRange[y] ? clippedRange[y][x] : '');
              }
            }
          }
          
          var bRange = {
            'fromCell': activeCell,
            'fromRow': activeRow,
            'toCell': activeCell+this.w-1,
            'toRow': activeRow+this.h-1
          }
          
          var rowIndices = [];
          for( var r=bRange['fromRow']; r<=bRange['toRow']; r++ ){
        	  rowIndices.push(r);
          }

          this.markCopySelection([bRange]);
          _grid.getSelectionModel().setSelectedRanges([bRange]);
          _self.onPasteCells.notify({ranges: [bRange]});
        },

        undo: function() {
          for (var y = 0; y < destH; y++){
            for (var x = 0; x < destW; x++){
              var desty = activeRow + y;
              var destx = activeCell + x;
              
              if (desty < this.maxDestY && destx < this.maxDestX ) {
            	var dt = _grid.getDataItem(desty);
                if (oneCellToMultiple)
                  this.setDataItemValueForColumn(dt, columns[destx], this.oldValues[0][0]);
                else
                  this.setDataItemValueForColumn(dt, columns[destx], this.oldValues[y][x]);
              }
            }
          }
          
          var bRange = {
            'fromCell': activeCell,
            'fromRow': activeRow,
            'toCell': activeCell+this.w-1,
            'toRow': activeRow+this.h-1
          }

          this.markCopySelection([bRange]);
          _grid.getSelectionModel().setSelectedRanges([bRange]);
          _self.onPasteCells.notify({ranges: [bRange]});
          
          if(addRows > 1){            
        	var d = _grid.getItems();
            for(; addRows > 1; addRows--)
              d.splice(d.length - 1, 1);
            _dataView.setItems(d);
          }
        }
      };

      if(_options.clipboardCommandHandler) {
        _options.clipboardCommandHandler(clipCommand);
      }
      else {
        clipCommand.execute();
      }
    }
    
    
    function handleKeyDown(e, args) {
      var ranges;
      var alwaysHandleKeyEvents = true;
      
      if( !_options.copyingPastingAllowed() ){
    	  return false;
      }
      
      if (alwaysHandleKeyEvents || !_grid.getEditorLock().isActive() || _grid.getOptions().autoEdit) {
        if (e.which == KeyCodeEnum.ESCAPE) {
          if (_copiedRanges) {
            e.preventDefault();
            clearCopySelection();
            _self.onCopyCancelled.notify({ranges: _copiedRanges});
            _copiedRanges = null;
          }
        }
        
        if (e.which == KeyCodeEnum.C && (e.ctrlKey || e.metaKey)) {    // CTRL + C
          _self.onBeforeCopy.notify();
          if (_onCopyInit) {
            _onCopyInit.call();
          }
          ranges = _grid.getSelectionModel().getSelectedRanges();
          if (ranges.length != 0) {
            _copiedRanges = ranges;
            markCopySelection(ranges);
            _self.onCopyCells.notify({ranges: ranges});
            
            var columns = _grid.getColumns();
            var clipText = "";

            for (var rg = 0; rg < ranges.length; rg++){
                var range = ranges[rg];
                var clipTextRows = [];
                for (var i=range.fromRow; i< range.toRow+1 ; i++){
                    var clipTextCells = [];
                    var dt = _dataView.getItemByIdx(i);
                    
                    if (clipText == "" && _options.includeHeaderWhenCopying) {
                        var clipTextHeaders = [];
                        for (var j = range.fromCell; j < range.toCell + 1 ; j++) {
                            if (columns[j].name.length > 0)
                                clipTextHeaders.push(columns[j].name);
                        }
                        clipTextRows.push(clipTextHeaders);
                    }

                    for (var j=range.fromCell; j< range.toCell+1 ; j++){
                    	if( j == 0 ) continue; // skip row selector checkbox column
                    	var field = columns[j].field;
                    	var value = dt[field];
                    	clipTextCells.push(value);
                    }
                    clipTextRows.push(clipTextCells);
                }
                clipText += stringifyClipboard(clipTextRows);
                
            }

            if(window.clipboardData) {
                window.clipboardData.setData("Text", clipText);
                _self.onAfterCopy.notify();
                return true;
            }
            else {
                var $focus = $(_grid.getActiveCellNode());
                var ta = _createTextBox(clipText);

                ta.focus();
                
                setTimeout(function(){
                     _bodyElement.removeChild(ta);
                    // restore focus
                    if ($focus && $focus.length>0) {
                        $focus.attr('tabIndex', '-1');
                        var gridActiveCell = _grid.getActiveCell();
                        _grid.gotoCell(gridActiveCell.row, gridActiveCell.cell);
                        $focus.removeAttr('tabIndex');
                    }
                }, 100);
                

                if (_onCopySuccess) {
                    var rowCount = 0;
                    // If it's cell selection, use the toRow/fromRow fields
                    if (ranges.length === 1) {
                        rowCount = (ranges[0].toRow + 1) - ranges[0].fromRow;
                    }
                    else {
                        rowCount = ranges.length;
                    }
                    _onCopySuccess.call(this, rowCount);
                }

                _self.onAfterCopy.notify();
                return false;
            }
          }
          _self.onAfterCopy.notify();
        }

        if (e.which == KeyCodeEnum.V && (e.ctrlKey || e.metaKey)) {    // CTRL + V
        	_self.onBeforePaste.notify();
            var ta = _createTextBox('');
            
            setTimeout(function(){
                _decodeTabularData(_grid, _dataView, ta);
            }, 100);
            
            _self.onAfterPaste.notify();
            return false;
        }
      }
    }
    
    function countQuotes(str) {
        return str.split('"').length - 1;
      }

    // taken from handson source code
    function parseClipboard (str) {
      var r, rlen, rows, arr = [], a = 0, c, clen, multiline, last, value;
      rows = str.split('\n');
      if (rows.length > 1 && rows[rows.length - 1] === '') {
        rows.pop();
      }
      for (r = 0, rlen = rows.length; r < rlen; r += 1) {
        rows[r] = rows[r].split('\t');
        for (c = 0, clen = rows[r].length; c < clen; c += 1) {
          if (!arr[a]) {
            arr[a] = [];
          }
          if (multiline && c === 0) {
            last = arr[a].length - 1;
            arr[a][last] = arr[a][last] + '\n' + rows[r][0];
            if (multiline && (countQuotes(rows[r][0]) & 1)) { //& 1 is a bitwise way of performing mod 2
              multiline = false;
              arr[a][last] = arr[a][last].substring(0, arr[a][last].length - 1).replace(/""/g, '"');
            }
          }
          else {
            if (c === clen - 1 && rows[r][c].indexOf('"') === 0) {
              arr[a].push(rows[r][c].substring(1).replace(/""/g, '"'));
              multiline = true;
            }
            else {
              value = rows[r][c].replace(/""/g, '"');
              value = value.replace(/\xFF\xFD/g, "_");  // replace invalid characters
              arr[a].push(value);
              multiline = false;
            }
          }
        }
        if (!multiline) {
          a += 1;
        }
      }
      return arr;
    }

    // taken from handson source code
    function stringifyClipboard(arr) {
      var r, rlen, c, clen, str = '', val, nl_search, cr_search;
      for (r = 0, rlen = arr.length; r < rlen; r += 1) {
        for (c = 0, clen = arr[r].length; c < clen; c += 1) {
          if (c > 0) {
            str += '\t';
          }
          val = arr[r][c];
          if (typeof val === 'string') {
        	  
        	// replace single \r with \r\n
        	cr_search = val.indexOf('\r');
        	if( cr_search > -1 ){
        		val = val.replace(/\r(.?)/g, '\r\n$1');
        	}
        	
        	nl_search = val.indexOf("\n");
            if (nl_search > -1) {
              str += '"' + val.replace(/"/g, '""') + '"';
            }
            else {
              str += val;
            }
          }
          else if (val === null || val === void 0) { //void 0 resolves to undefined
            str += '';
          }
          else {
            str += val;
          }
        }
        str += '\n';
      }
      return str;
    }


    function markCopySelection(ranges) {
      clearCopySelection();
      
      var columns = _grid.getColumns();
      var hash = {};
      for (var i = 0; i < ranges.length; i++) {
        for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
          hash[j] = {};
          for (var k = ranges[i].fromCell; k <= ranges[i].toCell && k<columns.length; k++) {
            hash[j][columns[k].id] = _copiedCellStyle;
          }
        }
      }
      _grid.setCellCssStyles(_copiedCellStyleLayerKey, hash);
      clearTimeout(_clearCopyTI);
      _clearCopyTI = setTimeout(function(){
        _self.clearCopySelection();
      }, 2000);
    }

    function clearCopySelection() {
      _grid.removeCellCssStyles(_copiedCellStyleLayerKey);
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,
      "clearCopySelection": clearCopySelection,
      "handleKeyDown":handleKeyDown,
      
      "onBeforeCopy": new Slick.Event(),
      "onAfterCopy": new Slick.Event(),
      "onCopyCells": new Slick.Event(),
      "onCopyCancelled": new Slick.Event(),
      "onBeforePaste": new Slick.Event(),
      "onAfterPaste": new Slick.Event(),
      "onPasteCells": new Slick.Event(),
      "onPastedCellChanged": new Slick.Event()
    });
  }
})(jQuery);
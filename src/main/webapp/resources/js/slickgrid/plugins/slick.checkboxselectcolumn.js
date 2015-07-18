(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CheckboxSelectColumn": CheckboxSelectColumn
    }
  });


  function CheckboxSelectColumn(options) {
    var _grid;
    var _dataView;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _selectedRowIds = [];
    var _defaults = {
      columnId: "_checkbox_selector",
      cssClass: null,
      toolTip: "Select/Deselect All",
      width: 30
    };

    var _options = $.extend(true, {}, _defaults, options);

    function init(grid) {
      _grid = grid;
      _handler
        .subscribe(_grid.onSelectedRowsChanged, handleSelectedRowsChanged)
        .subscribe(_grid.onClick, handleClick)
        .subscribe(_grid.onHeaderClick, handleHeaderClick)
        .subscribe(_grid.onKeyDown, handleKeyDown);
    }

    function destroy() {
      _handler.unsubscribeAll();
    }
    
    function setDataView(dataView) {
      _dataView = dataView;
    }

    // _selectedRowsLookup is an array of boolean, each item represents the row selected
    // selectedRows is an array of integers of the row id that are selected.
    function handleSelectedRowsChanged(e, args) {
    	
    	var range = selectionModel.getSelectedRanges();
    	
    	var userSelectedRangeUsingCheckbox = false;
    	if( range.length > 0 ){
    		userSelectedRangeUsingCheckbox = range[0].fromCell == 0 && range[0].toCell == (_grid.getColumns().length - 1);
    	}
    	
    	//if( )
      
        if( !userSelectedRangeUsingCheckbox ) {
        	_selectedRowIds = [];
        	_grid.updateColumnHeader(_options.columnId, "<input type='checkbox'>", _options.toolTip);
        	_grid.invalidate();
        	range = [];
        }
        
        _self.onCheckboxSelectionChange.notify(range);
    }

    function handleKeyDown(e, args) {
      if (e.which == KeyCodeEnum.ENTER) {
        if (_grid.getColumns()[args.cell].id === _options.columnId) {
          // if editing, try to commit
          if (!_grid.getEditorLock().isActive() || _grid.getEditorLock().commitCurrentEdit()) {
            toggleRowSelection(args.row);
          }
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    }

    function handleClick(e, args) {
      // clicking on a row select checkbox
      if (_grid.getColumns()[args.cell].id === _options.columnId && $(e.target).is(":checkbox")) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        toggleRowSelection(e, args.row);
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
    
    //function user

    function toggleRowSelection(e, row) {
      // if selected range, then clear selected rows
      var selectionModel = _grid.getSelectionModel();
      var range = selectionModel.getSelectedRanges();
    
      //if( range.length > 0 && (range[0].fromCell != 0 && range[0].toCell != (_grid.getColumns().length - 1))) {
    	//  setSelectedRows();
      //}
      
      if (!$(e.target).is(":checked")) {
    	_selectedRowIds = $.grep(_selectedRowIds, function (n) {
    		var item = _grid.getDataItem(row);
            return n != item.id;
        });
    	setSelectedRows();
      } else {
    	  var item = _grid.getDataItem(row);
    	  _selectedRowIds.push(item.id);
    	  setSelectedRows();
      }
    }
    
    function setSelectedRows(){
    	var rowIndex;
    	var selectedGridRows = [];
    	$.each( _selectedRowIds, function (i, selectedRowId) {
    		rowIndex = dataView.getRowById(selectedRowId);
    		selectedGridRows.push(rowIndex);
    	});
    	
    	_grid.setSelectedRows(selectedGridRows);
    }

    function handleHeaderClick(e, args) {
      if (args.column.id == _options.columnId && $(e.target).is(":checkbox")) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        _selectedRowIds = [];

        if ($(e.target).is(":checked")) {
          var item;
          var rows = [];
          for (var i = 0; i < _grid.getDataLength(); i++) {
        	item = _grid.getDataItem(i);
            rows.push(i);
            _selectedRowIds.push(item.id);
          }
          _grid.setSelectedRows(rows);
        } else {
          _grid.setSelectedRows([]);
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        if (_selectedRowIds.length && _selectedRowIds.length == _grid.getDataLength()) {
          _grid.updateColumnHeader(_options.columnId, "<input type='checkbox' checked='checked'>", _options.toolTip);
        } else {
          _grid.updateColumnHeader(_options.columnId, "<input type='checkbox'>", _options.toolTip);
        }
        
        _grid.invalidate();
      }
    }

    function getColumnDefinition() {
      return {
        id: _options.columnId,
        name: "<input type='checkbox'>",
        toolTip: _options.toolTip,
        field: "sel",
        width: _options.width,
        resizable: false,
        sortable: false,
        cssClass: _options.cssClass,
        formatter: checkboxSelectionFormatter
      };
    }

    function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
      if (dataContext) {
    	var item = _grid.getDataItem(row);
        if( _selectedRowIds.indexOf(item.id) > -1 ) {
            return "<input type='checkbox' checked='checked'>"
        }else{
            return "<input type='checkbox'>";
        }
      }
      return null;
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,
      "setDataView": setDataView,

      "getColumnDefinition": getColumnDefinition,
      
      "onCheckboxSelectionChange": new Slick.Event()
    });
  }
})(jQuery);
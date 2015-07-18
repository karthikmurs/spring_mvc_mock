
/**
 * Manager for jquery.blockUI.js
 * 
 * Design: http://qwiki.qualcomm.com/apt-linux/RMS_Design
 * 
 */

/**
 * possible states that _block_state can be in
 */
var BLOCK_STATE = {
	NOT_STARTED : 0,
	WAITING_TO_START: 1,
	STARTED : 2,
	FINISHED : 3
};

/**
 * possible states that _unblock_state can be in
 */
var UNBLOCK_STATE = {
	NOT_STARTED : 0,
	WAITING_TO_START: 1,
	STARTED : 2
};

/**
 * Tracks the block state.
 */
var _block_state = BLOCK_STATE.NOT_STARTED;

/**
 * Tracks the unblock state
 */
var _unblock_state = UNBLOCK_STATE.NOT_STARTED;

// debugging variables
var _debug_block_ui_enabled = false;
var _block_num = 0;
var _unblock_num = 0;
var _on_block_num = 0;
var _on_unblock_num = 0;

//// PUBLIC API ////

/**
 * blocks the UI so the user can't interact with it.
 */
function blockUI(){
	if( _debug_block_ui_enabled ){
		_block_num++;
		console.log("blockUI (" + _block_num + ")");
	}
	if( _block_state == BLOCK_STATE.NOT_STARTED && _unblock_state == UNBLOCK_STATE.NOT_STARTED ){
		_transitionBlockState(BLOCK_STATE.STARTED);
		_startBlock();
	}
	else if( _block_state == BLOCK_STATE.FINISHED && _unblock_state == UNBLOCK_STATE.STARTED ){
		_transitionBlockState(BLOCK_STATE.WAITING_TO_START);
	}
}

/**
 * unblocks the UI so the user can interact with it.
 */
function unblockUI(onUnblockCb){
	if( _debug_block_ui_enabled ){
		_unblock_num++;
		console.log("unblockUI (" + _unblock_num + ")");
	}
	if( _block_state == BLOCK_STATE.FINISHED && _unblock_state == UNBLOCK_STATE.NOT_STARTED ){
		_transitionUnblockState(UNBLOCK_STATE.STARTED);
		_startUnblock(onUnblockCb);
	}
	else if( _block_state == BLOCK_STATE.STARTED && _unblock_state == UNBLOCK_STATE.NOT_STARTED ){
		_transitionUnblockState(UNBLOCK_STATE.WAITING_TO_START);
	}
	else if( _block_state == BLOCK_STATE.WAITING_TO_START && _unblock_state == UNBLOCK_STATE.STARTED ){
		_transitionBlockState(BLOCK_STATE.FINISHED);
	}
}

//// END PUBLIC API ////

//// PRIVATE METHODS ////

/**
 * Cause a transition of _block_state
 */
function _transitionBlockState(newBlockState){
	if( _debug_block_ui_enabled ){
		console.log("transition (B - " + _block_state + ", U - " + _unblock_state + ") -> (B - " + newBlockState + ", U - " + _unblock_state + ") ");
	}
	_block_state = newBlockState;
}

/**
 * Cause a transition of _unblock_state
 */
function _transitionUnblockState(newUnblockState){
	if( _debug_block_ui_enabled ){
		console.log("transition (B - " + _block_state + ", U - " + _unblock_state + ") -> (B - " + _block_state + ", U - " + newUnblockState + ") ");
	}
	_unblock_state = newUnblockState;
}

/**
 * Cause a transition of both _block_state and _unblock_state
 */
function _transitionBlockUnblockState(newBlockState, newUnblockState){
	if( _debug_block_ui_enabled ){
		console.log("transition (B - " + _block_state + ", U - " + _unblock_state + ") -> (B - " + newBlockState + ", U - " + newUnblockState + ") ");
	}
	_block_state = newBlockState;
	_unblock_state = newUnblockState;
}

/**
 * initiate a block
 */
function _startBlock(){
	if( _debug_block_ui_enabled ){
		console.log("_startBlock");
	}
	$.blockUI.defaults.css = {
			padding:        0, 
	        margin:         0, 
	        width:          '30%', 
	        top:            '10%', 
	        left:           '35%', 
	        textAlign:      'center', 
	        cursor:         'wait'
	};
	$.blockUI.defaults.overlayCSS = { cursor: 'wait'  };
	$.blockUI({ fadeIn: 0, fadeOut: 0, message: $("#navbarProgressSpinner"), onBlock: _onBlock});
}

/**
 * initiate an unblock
 */
function _startUnblock(onUnblockCb){
	if( _debug_block_ui_enabled ){
		console.log("_startUnblock");
	}
	$.unblockUI({onUnblock: function(){
		_onUnblock();
		if( onUnblockCb ){
			onUnblockCb();
		}
	}});
}

/**
 * Called when blockUI finishes executing
 */
function _onBlock(){
	if( _debug_block_ui_enabled ){
		_on_block_num++;
		console.log("_onBlock (" + _on_block_num + ")");
	}
	if( _block_state == BLOCK_STATE.STARTED && _unblock_state == UNBLOCK_STATE.NOT_STARTED ){
		_transitionBlockState(BLOCK_STATE.FINISHED);
	}
	else if( _block_state == BLOCK_STATE.STARTED && _unblock_state == UNBLOCK_STATE.WAITING_TO_START ){
		_transitionBlockUnblockState(BLOCK_STATE.FINISHED, UNBLOCK_STATE.STARTED);
		_startUnblock();
	}
}

/**
 * Called when unblockUI finishes executing
 */
function _onUnblock(){
	if( _debug_block_ui_enabled ){
		_on_unblock_num++;
		console.log("_onUnblock (" + _on_unblock_num + ")");
	}
	if( _block_state == BLOCK_STATE.FINISHED && _unblock_state == UNBLOCK_STATE.STARTED ){
		_transitionBlockUnblockState(BLOCK_STATE.NOT_STARTED, UNBLOCK_STATE.NOT_STARTED);
	}
	else if( _block_state == BLOCK_STATE.WAITING_TO_START && _unblock_state == UNBLOCK_STATE.STARTED ){
		_transitionBlockUnblockState(BLOCK_STATE.STARTED, UNBLOCK_STATE.NOT_STARTED);
		_startBlock();
	}
}

//// END PRIVATE METHODS ////

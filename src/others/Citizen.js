'use strict';
/* <nowiki> */
/*
* _addText: '{{Gadget Header|license=CC-BY-SA-4.0|import=no}}'
*/
/* 这里的任何JavaScript将为使用Citizen皮肤的用户加载 */
mw.loader.using( [ 'mediawiki.util' ] ).done( function() {
	/* Trigger search box when click on the fake search button on main page */
	if ( mw.config.get( 'wgPageName' ) === '有兽档案馆:首页' ) {
		document.getElementById( 'skin-citizen-search-trigger' ).addEventListener( 'click', function() {
			var event = new Event( 'input', { bubbles: true, composed: true } ),
				checkbox = document.getElementById( 'citizen-search__checkbox' );
			checkbox.checked = true;
			checkbox.dispatchEvent( event );
		} );
	}
} );

/* </nowiki> */

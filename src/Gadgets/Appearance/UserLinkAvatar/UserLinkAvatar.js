/* <nowiki> */
/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0|import=no}}'
*/
/**
 * +--------------------------------------------------------+
 * |         === WARNING: GLOBAL GADGET FILE ===            |
 * +--------------------------------------------------------+
 * |      All changes should be made in the repository,     |
 * |              otherwise they will be lost.              |
 * +--------------------------------------------------------+
 * |        Changes to this page affect many users.         |
 * |  Please discuss changes at Talk page before editing.   |
 * +--------------------------------------------------------+
 */

$('.mw-userlink').each(function(_, item) {
	item = $(item);
	item.prepend($('<img/>').addClass('userlink-avatar').attr('src', mw.config.get('wgScriptPath') + '/extensions/Avatar/avatar.php?user=' + item.text()));
});
/* </nowiki> */

/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <https://git.qiuwen.wiki/InterfaceAdmin/Gadgets/src/branch/master/src/Gadgets/HistoryDisclaimer>
 */
/**
 * +--------------------------------------------------------+
 * |         === WARNING: GLOBAL GADGET FILE ===            |
 * +--------------------------------------------------------+
 * |      All changes should be made in the repository,     |
 * |              otherwise they will be lost.              |
 * +--------------------------------------------------------+
 * |      Changes to this page may affect many users.       |
 * |  Please discuss changes at talk page before editing.   |
 * +--------------------------------------------------------+
 */
/* <nowiki> */
'use strict';

/* History disclaimer */
$(function historyDisclaimer() {
  if ((mw.config.get('wgCurRevisionId') || -1) > 0 && (mw.config.get('wgRevisionId') || -1) > 0 && (mw.config.get('wgCurRevisionId') || -1) > (mw.config.get('wgRevisionId') || -1)) {
    $('<div>').attr('id', 'historyDisclaimer').appendTo($('body'));
  }
});
/* </nowiki> */
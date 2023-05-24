/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @base <https://zh.wikipedia.org/wiki/Special:Permalink/59753812>
 * @source <https://git.qiuwen.wiki/InterfaceAdmin/Gadgets/src/branch/master/src/Gadgets/Ding>
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
/* <nowiki> */
'use strict';

window.DingExposedInterface = function ding() {
  var dingMain = function dingMain(message) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
    var ttl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3600;
    var persist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (!document.querySelector('#ding')) {
      document.body.insertAdjacentHTML('afterbegin', '<div id="ding"></div>');
    }
    var dingElement = document.querySelector('#ding');
    var previousMessage = dingElement.lastChild;
    if (previousMessage) {
      var previousMessageStyle = previousMessage.style;
      previousMessageStyle.transform = 'translateY(-130%)';
      setTimeout(function () {
        previousMessage.remove();
      }, 500);
    }
    dingElement.insertAdjacentHTML('beforeend', "<div class=\"ding_inner ding_".concat(type, "\">").concat(message, "</div>"));
    var noticeElement = dingElement.lastChild;
    var noticeElementStyle = noticeElement.style;
    if (persist) {
      noticeElement === null || noticeElement === void 0 ? void 0 : noticeElement.addEventListener('click', function () {
        noticeElementStyle.transform = 'translateY(-130%)';
        setTimeout(function () {
          noticeElement.remove();
        }, 500);
      });
    }
    setTimeout(function () {
      noticeElementStyle.transform = 'translateY(0%)';
    }, 10);
    if (ttl !== 'long') {
      setTimeout(function () {
        noticeElementStyle.transform = 'translateY(-130%)';
      }, ttl + 10);
      setTimeout(function () {
        noticeElement === null || noticeElement === void 0 ? void 0 : noticeElement.remove();
      }, ttl + 510);
    }
  };
  return dingMain;
}();
/* </nowiki> */

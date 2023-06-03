/**
 * SPDX-License-Identifier: GPL-3.0
 * _addText: '{{Gadget Header|license=GPL-3.0}}'
 *
 * @source <https://git.qiuwen.wiki/InterfaceAdmin/Gadgets/src/branch/master/src/Gadgets/FloatTOC>
 * @author 安忆 <i@anyi.in>
 * @dependency ext.gadget.i18n, mediawiki.notification, mediawiki.util
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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
$(function floatTOC() {
  var _toc$querySelector, _toc$querySelector2;
  var $body = $('body');
  if (mw.config.get('wgAction') !== 'view' || !('IntersectionObserver' in window) || !($body.hasClass('skin-citizen') || $body.hasClass('skin-vector-legacy'))) {
    return;
  }
  var originToc = document.querySelector('#toc');
  if (!originToc) {
    return;
  }
  var i18nMessages = function i18nMessages() {
    var _i18n = i18n,
      localize = _i18n.localize;
    return {
      Close: localize({
        ja: '閉じる',
        'zh-hans': '关闭',
        'zh-hant': '關閉'
      }),
      Contents: localize({
        ja: '目次',
        'zh-hans': '目录',
        'zh-hant': '目錄'
      }),
      ' (Click to collapse)': localize({
        ja: '（クリックして折り畳み）',
        'zh-hans': '（点击以折叠）',
        'zh-hant': '（點擊以摺叠）'
      }),
      ' (Click to expand)': localize({
        ja: '（クリックして展開）',
        'zh-hans': '（点击以展开）',
        'zh-hant': '（點擊以展開）'
      })
    };
  };
  var messages = i18nMessages();
  var message = function message(key) {
    return messages[key] || key;
  };
  var id = 'floatTOC';
  var toc = originToc.cloneNode(true);
  (_toc$querySelector = toc.querySelector('input')) === null || _toc$querySelector === void 0 ? void 0 : _toc$querySelector.remove();
  (_toc$querySelector2 = toc.querySelector('.toctogglespan')) === null || _toc$querySelector2 === void 0 ? void 0 : _toc$querySelector2.remove();
  var $toc = $(toc);
  var $floatToc = $toc.clone().removeAttr('id').prepend($('<span>').attr('id', 'close').text(message('Close')));
  var $floatTocOpener = $('<div>').attr({
    id: 'floatToc-opener',
    title: message('Contents')
  }).append($('<span>').addClass('citizen-ui-icon mw-ui-icon-wikimedia-reference'), $('<span>').text(message('Contents'))).hide().appendTo($body);
  var isShow;
  var preNotification;
  var showToc = function showToc() {
    var _preNotification2;
    var _isShow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var _preNotification = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    (_preNotification2 = _preNotification) === null || _preNotification2 === void 0 ? void 0 : _preNotification2.close();
    isShow = !!_isShow;
    switch (_isShow) {
      case true:
        if (sessionStorage.getItem(id) === 'close') {
          $floatTocOpener.fadeIn();
          return;
        }
        break;
      case 'open':
        $floatTocOpener.fadeOut();
        sessionStorage.setItem(id, 'open');
        break;
      default:
        $floatTocOpener.fadeOut();
        return;
    }
    _preNotification = mw.notification.notify($floatToc, {
      id: id,
      autoHide: false
    });
    _preNotification.$notification.on('click', function (event) {
      event.stopPropagation();
      var target = event.target;
      if (target.id === 'close') {
        _preNotification.close();
        $floatTocOpener.fadeIn();
        sessionStorage.setItem(id, 'close');
      }
    });
    return _preNotification;
  };
  // eslint-disable-next-line compat/compat
  var observer = new IntersectionObserver(function (entries) {
    var _entries = _slicedToArray(entries, 1),
      entry = _entries[0];
    if (!entry) {
      return;
    }
    var intersectionRatio = entry.intersectionRatio;
    preNotification = showToc(intersectionRatio === 0, preNotification);
  });
  observer.observe(originToc);
  $floatTocOpener.on('click', function () {
    preNotification = showToc('open');
  });
  if (!$body.hasClass('skin-citizen')) {
    return;
  }
  // 使TOC默认状态为关闭，除非用户已手动指定
  sessionStorage.getItem("".concat(id, "-originTOC")) ? {} : sessionStorage.setItem("".concat(id, "-originTOC"), 'close');
  var isCollapse = sessionStorage.getItem("".concat(id, "-originTOC")) === 'close';
  var $originTocHeading = $('#toc #mw-toc-heading');
  var $originTocItem = $('#toc ul');
  var originTocHeadingText = $originTocHeading.text();
  if (isCollapse) {
    $originTocItem.fadeOut();
  }
  $originTocHeading.css('cursor', 'pointer').text("".concat(originTocHeadingText).concat(isCollapse ? message(' (Click to expand)') : message(' (Click to collapse)'))).on('click', function () {
    isCollapse = !isCollapse;
    if (isCollapse) {
      sessionStorage.setItem("".concat(id, "-originTOC"), 'close');
      $originTocHeading.text("".concat(originTocHeadingText).concat(message(' (Click to expand)')));
    } else {
      sessionStorage.setItem("".concat(id, "-originTOC"), 'open');
      $originTocHeading.text("".concat(originTocHeadingText).concat(message(' (Click to collapse)')));
    }
    $originTocItem.fadeToggle();
  });
});
/* </nowiki> */

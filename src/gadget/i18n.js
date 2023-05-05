/* <nowiki> */
'use strict';

/**
 * SPDX-License-Identifier: GPL-3.0
 * _addText: '{{Gadget Header|license=GPL-3.0}}'
 *
 * @source <git.qiuwen.wiki/AnYi/i18n>
 * @author i@anyi.in
 */
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
(function () {
  var _document$documentEle;
  var isValidKey = function isValidKey(key, object) {
    return key in object;
  };
  var i18nMessages = function i18nMessages(defaultFallbackList) {
    var FallbackTable = {
      zh: ['zh', 'zh-hans', 'zh-hant', 'zh-cn', 'zh-tw', 'zh-hk', 'zh-sg', 'zh-mo', 'zh-my', 'en'],
      'zh-hans': ['zh-hans', 'zh-cn', 'zh-sg', 'zh-my', 'zh', 'zh-hant', 'zh-tw', 'zh-hk', 'zh-mo', 'en'],
      'zh-hant': ['zh-hant', 'zh-tw', 'zh-hk', 'zh-mo', 'zh', 'zh-hans', 'zh-cn', 'zh-sg', 'zh-my', 'en'],
      'zh-cn': ['zh-cn', 'zh-hans', 'zh-sg', 'zh-my', 'zh', 'zh-hant', 'zh-tw', 'zh-hk', 'zh-mo', 'en'],
      'zh-sg': ['zh-sg', 'zh-hans', 'zh-cn', 'zh-my', 'zh', 'zh-hant', 'zh-tw', 'zh-hk', 'zh-mo', 'en'],
      'zh-my': ['zh-my', 'zh-hans', 'zh-cn', 'zh-sg', 'zh', 'zh-hant', 'zh-tw', 'zh-hk', 'zh-mo', 'en'],
      'zh-tw': ['zh-tw', 'zh-hant', 'zh-hk', 'zh-mo', 'zh', 'zh-hans', 'zh-cn', 'zh-sg', 'zh-my', 'en'],
      'zh-hk': ['zh-hk', 'zh-hant', 'zh-mo', 'zh-tw', 'zh', 'zh-hans', 'zh-cn', 'zh-sg', 'zh-my', 'en'],
      'zh-mo': ['zh-mo', 'zh-hant', 'zh-hk', 'zh-tw', 'zh', 'zh-hans', 'zh-cn', 'zh-sg', 'zh-my', 'en']
    };
    var elect = function elect(candidates, locale) {
      var _FallbackTableList;
      var FallbackTableList;
      if (isValidKey(locale, FallbackTable)) {
        FallbackTableList = FallbackTable[locale];
      }
      var _iterator = _createForOfIteratorHelper((_FallbackTableList = FallbackTableList) !== null && _FallbackTableList !== void 0 ? _FallbackTableList : defaultFallbackList),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          if (isValidKey(key, candidates) && candidates[key] !== undefined) {
            return candidates[key];
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return '';
    };
    return {
      content: function content(candidates) {
        var _mw$config$get;
        return elect(candidates, (_mw$config$get = mw.config.get('wgContentLanguage')) !== null && _mw$config$get !== void 0 ? _mw$config$get : '');
      },
      localize: function localize(candidates) {
        var _ref, _mw$config$get2;
        return elect(candidates, (_ref = (_mw$config$get2 = mw.config.get('wgUserLanguage')) !== null && _mw$config$get2 !== void 0 ? _mw$config$get2 : mw.config.get('wgContentLanguage')) !== null && _ref !== void 0 ? _ref : '');
      },
      vary: function vary(candidates) {
        var _ref2, _mw$config$get3;
        return elect(candidates, (_ref2 = (_mw$config$get3 = mw.config.get('wgUserVariant')) !== null && _mw$config$get3 !== void 0 ? _mw$config$get3 : mw.config.get('wgContentLanguage')) !== null && _ref2 !== void 0 ? _ref2 : '');
      }
    };
  };
  var i18n = i18nMessages([(_document$documentEle = document.documentElement.lang) !== null && _document$documentEle !== void 0 ? _document$documentEle : navigator.language.split('-')[0], 'en']);
  window.i18n = i18n;
  /* 用法 */
  // const wgUCS = window.i18n.content;
  // const Cancel = wgUCS({en: 'Cancel', ja: 'キャンセル', zh: '取消'});
  // const QiuWen = wgUCS({en: 'QiuWen', ja: 'ちゅううん', 'zh-cn': '求闻', 'zh-hk': '求聞'});
  /* Deprecated window.wgU*S */
  window.wgUCS = function (hans, hant, cn, tw, hk, sg, zh, mo, my, en) {
    return i18n.content({
      en: en,
      zh: zh,
      'zh-hans': hans,
      'zh-hant': hant,
      'zh-cn': cn,
      'zh-tw': tw,
      'zh-hk': hk,
      'zh-sg': sg,
      'zh-mo': mo,
      'zh-my': my
    });
  };
  window.wgULS = function (hans, hant, cn, tw, hk, sg, zh, mo, my, en) {
    return i18n.localize({
      en: en,
      zh: zh,
      'zh-hans': hans,
      'zh-hant': hant,
      'zh-cn': cn,
      'zh-tw': tw,
      'zh-hk': hk,
      'zh-sg': sg,
      'zh-mo': mo,
      'zh-my': my
    });
  };
  window.wgUVS = function (hans, hant, cn, tw, hk, sg, zh, mo, my, en) {
    return i18n.vary({
      en: en,
      zh: zh,
      'zh-hans': hans,
      'zh-hant': hant,
      'zh-cn': cn,
      'zh-tw': tw,
      'zh-hk': hk,
      'zh-sg': sg,
      'zh-mo': mo,
      'zh-my': my
    });
  };
})();
/* </nowiki> */
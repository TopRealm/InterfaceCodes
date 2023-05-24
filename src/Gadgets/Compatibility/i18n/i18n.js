/**
 * SPDX-License-Identifier: GPL-3.0
 * _addText: '{{Gadget Header|license=GPL-3.0}}'
 *
 * @source <https://git.qiuwen.wiki/InterfaceAdmin/Gadgets/src/branch/master/src/Gadgets/i18n>
 * @author 安忆 <i@anyi.in>
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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
(function i18n() {
  var _ref3, _document$documentEle;
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
          if (isValidKey(key, candidates)) {
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
  var i18nMethods = i18nMessages([(_ref3 = (_document$documentEle = document.documentElement.lang) !== null && _document$documentEle !== void 0 ? _document$documentEle : navigator.language.split('-')[0]) !== null && _ref3 !== void 0 ? _ref3 : navigator.language.toLowerCase(), 'en']);
  window.i18n = i18nMethods;
  /* Deprecated window.wgU*S */
  var wgUXS = function wgUXS(hans, hant, cn, tw, hk, sg, zh, mo, my, en, method) {
    var _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _ref12, _zh, _ref13, _ref14, _ref15, _ref16, _hans, _ref17, _ref18, _ref19, _ref20, _hant, _ref21, _cn, _ref22, _sg, _ref23, _tw, _ref24, _hk, _ref25, _mo, _ref26, _my, _ref27, _en;
    zh = ((_ref4 = (_ref5 = (_ref6 = (_ref7 = (_ref8 = (_ref9 = (_ref10 = (_ref11 = (_ref12 = (_zh = zh) !== null && _zh !== void 0 ? _zh : hans) !== null && _ref12 !== void 0 ? _ref12 : hant) !== null && _ref11 !== void 0 ? _ref11 : cn) !== null && _ref10 !== void 0 ? _ref10 : tw) !== null && _ref9 !== void 0 ? _ref9 : hk) !== null && _ref8 !== void 0 ? _ref8 : sg) !== null && _ref7 !== void 0 ? _ref7 : mo) !== null && _ref6 !== void 0 ? _ref6 : my) !== null && _ref5 !== void 0 ? _ref5 : en) !== null && _ref4 !== void 0 ? _ref4 : '').toString();
    hans = ((_ref13 = (_ref14 = (_ref15 = (_ref16 = (_hans = hans) !== null && _hans !== void 0 ? _hans : cn) !== null && _ref16 !== void 0 ? _ref16 : sg) !== null && _ref15 !== void 0 ? _ref15 : my) !== null && _ref14 !== void 0 ? _ref14 : zh) !== null && _ref13 !== void 0 ? _ref13 : '').toString();
    hant = ((_ref17 = (_ref18 = (_ref19 = (_ref20 = (_hant = hant) !== null && _hant !== void 0 ? _hant : tw) !== null && _ref20 !== void 0 ? _ref20 : hk) !== null && _ref19 !== void 0 ? _ref19 : mo) !== null && _ref18 !== void 0 ? _ref18 : zh) !== null && _ref17 !== void 0 ? _ref17 : '').toString();
    cn = ((_ref21 = (_cn = cn) !== null && _cn !== void 0 ? _cn : hans) !== null && _ref21 !== void 0 ? _ref21 : '').toString();
    sg = ((_ref22 = (_sg = sg) !== null && _sg !== void 0 ? _sg : hans) !== null && _ref22 !== void 0 ? _ref22 : '').toString();
    tw = ((_ref23 = (_tw = tw) !== null && _tw !== void 0 ? _tw : hant) !== null && _ref23 !== void 0 ? _ref23 : '').toString();
    hk = ((_ref24 = (_hk = hk) !== null && _hk !== void 0 ? _hk : hant) !== null && _ref24 !== void 0 ? _ref24 : '').toString();
    mo = ((_ref25 = (_mo = mo) !== null && _mo !== void 0 ? _mo : hant) !== null && _ref25 !== void 0 ? _ref25 : '').toString();
    my = ((_ref26 = (_my = my) !== null && _my !== void 0 ? _my : hant) !== null && _ref26 !== void 0 ? _ref26 : '').toString();
    en = ((_ref27 = (_en = en) !== null && _en !== void 0 ? _en : zh) !== null && _ref27 !== void 0 ? _ref27 : '').toString();
    return i18nMethods[method]({
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
  window.wgUCS = function (hans, hant, cn, tw, hk, sg, zh, mo, my, en) {
    return wgUXS(hans, hant, cn, tw, hk, sg, zh, mo, my, en, 'content');
  };
  window.wgULS = function (hans, hant, cn, tw, hk, sg, zh, mo, my, en) {
    return wgUXS(hans, hant, cn, tw, hk, sg, zh, mo, my, en, 'localize');
  };
  window.wgUVS = function (hans, hant, cn, tw, hk, sg, zh, mo, my, en) {
    return wgUXS(hans, hant, cn, tw, hk, sg, zh, mo, my, en, 'vary');
  };
})();
/* 用法
    // 定义多条消息
    // 支持多语言，可选值定义在index.d.ts#L-1，可直接添加其他值（RFC 5646）
    const i18nMessages = (): i18nMessages => {
        const {localize} = i18n;
        // i18n的三个方法会匹配当前语言（不含中文）和它所接收对象中的键，如果匹配失败，则返回en键的值。如果此键同样没被定义，则返回空字符串
        // 对于localize来说，假设传递给其的语言（wgUserLanguage ?? wgContentLanguage ?? HTML的lang属性 ?? 浏览器语言）最终为fr，则
        //     Cancel: localize({
        //         ja: 'キャンセル',
        //         zh: '取消',
        //     }),
        // 的返回值为空字符串，而非Cancel
        return {
            // 如果调用message(key)时，key和此处定义的目标英语文本一致，可跳过定义en的值
            Cancel: localize({
                ja: 'キャンセル',
                zh: '取消',
            }),
            QiuWen: localize({
                ja: 'ちゅううん',
                'zh-cn': '求闻',
                'zh-hk': '求聞',
            }),
            longText: localize({
                en: 'This is a very long text',
                ja: 'これは非常に長いテキストです',
                'zh-hans': '这是一段非常长的文本',
                'zh-hant': '這是一段非常長的文字',
            }),
        };
    };
    const messages = i18nMessages();
    const message = (key: string): string => messages[key] || key;
    // 调用
    message('Cancel'); // en: Cancel, ja: キャンセル, zh: 取消, zh-hans: 取消, zh-hant: 取消, zh-cn: 取消, zh-hk: 取消, zh-tw: 取消
    message('QiuWen'); // en: QiuWen, ja: ちゅううん, zh: 求闻, zh-hans: 求闻, zh-hant: 求聞, zh-cn: 求闻, zh-hk: 求聞, zh-tw: 求聞
    message('longText');
        // en: This is a very long text
        // ja: これは非常に長いテキストです
        // zh: 这是一段非常长的文本
        // zh-hans: 这是一段非常长的文本
        // zh-hant: 這是一段非常長的文字
        // zh-cn: 这是一段非常长的文本
        // zh-hk: 這是一段非常長的文字
        // zh-tw: 這是一段非常長的文字

    // 直接转换单条消息
    // 仅支持传递中文和英语。在非中文环境且未传递英语文本时，最终返回zh的值
    wgULS('求闻', '求聞'); // en: 求闻, ja: 求闻, zh: 求闻, zh-hans: 求闻, zh-hant: 求聞, zh-cn: 求闻, zh-hk: 求聞, zh-tw: 求聞
    wgULS('求闻', '求聞'); // en: 求闻, ja: 求闻, zh: 求闻, zh-hans: 求闻, zh-hant: 求聞, zh-cn: 求闻, zh-hk: 求聞, zh-tw: 求聞
*/
/* </nowiki> */

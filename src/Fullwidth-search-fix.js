/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <zh.wikipedia.org/wiki/MediaWiki:Gadget-fullwidth-search-fix.js>
 * @dependency ext.gadget.i18n, mediawiki.util
 */
/* <nowiki> */
'use strict';

(function FullwidthSearchFix() {
  // don't be too aggresive. just fix some obvious typos
  var searchTerm = mw.util.getParamValue('search');
  if (searchTerm !== null && mw.util.getParamValue('fulltext') === null) {
    // namespace names
    var colonIdx = searchTerm.indexOf('：');
    if (colonIdx !== -1) {
      var ns = searchTerm.slice(0, Math.max(0, colonIdx));
      var page = searchTerm.slice(Math.max(0, colonIdx + 1));
      if (mw.config.get('wgNamespaceIds')[ns.toLowerCase()]) {
        // valid namespace
        var url = "".concat(mw.config.get('wgScript'), "?search=").concat(encodeURIComponent("".concat(ns, ":").concat(page)));
        var localize = window.i18n.localize;
        mw.notify("".concat(localize({
          'zh-hans': '重定向',
          'zh-hant': '重新導向'
        }), "\u81F3").concat(mw.html.escape(url)));
        window.location.href = url;
      }
    }
  }
})();
/* </nowiki> */
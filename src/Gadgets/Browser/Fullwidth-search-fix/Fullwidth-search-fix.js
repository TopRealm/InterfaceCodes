/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @base <https://zh.wikipedia.org/wiki/MediaWiki:Gadget-fullwidth-search-fix.js>
 * @source <https://git.qiuwen.wiki/InterfaceAdmin/Gadgets/src/branch/master/src/Gadgets/Fullwidth-search-fix>
 * @dependency ext.gadget.i18n, mediawiki.util
 */
/* <nowiki> */
'use strict';

$(function fullWidthSearchFix() {
  // don't be too aggresive. just fix some obvious typos
  var searchTerm = mw.util.getParamValue('search');
  if (searchTerm !== null && mw.util.getParamValue('fulltext') === null) {
    // namespace names
    var colonIndex = searchTerm.indexOf('：');
    if (colonIndex !== -1) {
      var namespace = searchTerm.slice(0, Math.max(0, colonIndex));
      var pageName = searchTerm.slice(Math.max(0, colonIndex + 1));
      if (mw.config.get('wgNamespaceIds')[namespace.toLowerCase()]) {
        // valid namespace
        var url = "".concat(mw.config.get('wgScript'), "?search=").concat(encodeURIComponent("".concat(namespace, ":").concat(pageName)));
        var localize = i18n.localize;
        mw.notify("".concat(localize({
          'zh-hans': '重定向',
          'zh-hant': '重新導向'
        }), "\u81F3").concat(mw.html.escape(url)), {
          type: 'success'
        });
        location.href = url;
      }
    }
  }
});
/* </nowiki> */

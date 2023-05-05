/* <nowiki> */
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }
/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <en.wikipedia.org/wiki/MediaWiki:Gadget-markblocked.js>
 */
/**
 * This gadget will pull the user accounts and IPs from the history page
 * and will strike out the users that are currently blocked.
 */

(function markBlocked($, mw) {
  var markBlocked = function markBlocked(container) {
    var ipv6Regex = /^((?=.*::)(?!.*::.+::)(::)?([\da-f]{1,4}:(:|\b)|){5}|([\da-f]{1,4}:){6})((([\da-f]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
    // Collect all the links in the page's content
    var contentLinks = $(container).find('a');
    var localize = window.i18n.localize;
    var i18n = localize({
      en: '; blocked ($1) by $2: $3 ($4 ago)',
      'zh-hans': '；由$2封禁$1：$3（$4前）',
      'zh-hant': '；由$2封鎖$1：$3（$4前）'
    });
    var i18n_partial = localize({
      en: '; partially blocked ($1) by $2: $3 ($4 ago)',
      'zh-hans': '；由$2部分封禁$1：$3（$4前）',
      'zh-hant': '；由$2部分封鎖$1：$3（$4前）'
    });
    var mbTooltip = window.mbTooltip || i18n;
    var mbTooltipPartial = window.mbTooltipPartial || i18n_partial;
    // Get all aliases for user: & user_talk:
    var userNS = [];
    for (var ns in mw.config.get('wgNamespaceIds')) {
      if (mw.config.get('wgNamespaceIds')[ns] === 2 || mw.config.get('wgNamespaceIds')[ns] === 3) {
        userNS.push("".concat(mw.util.escapeRegExp(ns.replace(/_/g, ' ')), ":"));
      }
    }
    // Let wikis that are importing this gadget specify the local alias of Special:Contributions
    if (window.markblocked_contributions === undefined) {
      window.markblocked_contributions = 'Special:Contributions';
    }
    // RegExp for all titles that are  User:| User_talk: | Special:Contributions/ (for userscripts)
    var userTitleRX = new RegExp("^(".concat(userNS.join('|'), "|").concat(window.markblocked_contributions, "\\/)+([^\\/#]+)$"), 'i');
    // RegExp for links
    // articleRX also matches external links in order to support the noping template
    var articleRX = new RegExp("".concat(mw.config.get('wgArticlePath').replace('$1', ''), "([^#]+)"));
    var scriptRX = new RegExp("^".concat(mw.config.get('wgScript'), "\\?title=([^#&]+)"));
    var userLinks = {};
    var user;
    var url;
    var ma;
    var pgTitle;
    // Aux. functions
    // 20081226220605  or  2008-01-26T06:34:19Z   -> date
    var parseTS = function parseTS(ts) {
      var m = ts.replace(/\D/g, '').match(/(\d\d\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)/);
      return new Date(Date.UTC(m[1], m[2] - 1, m[3], m[4], m[5], m[6]));
    };
    var zz = function zz(v) {
      if (v <= 9) {
        v = "0".concat(v);
      }
      return v;
    };
    var inHours = function inHours(ms) {
      var mm = Math.floor(ms / 6e4);
      if (!mm) {
        return "".concat(Math.floor(ms / 1e3), "s");
      }
      var hh = Math.floor(mm / 60);
      mm = mm % 60;
      var dd = Math.floor(hh / 24);
      hh = hh % 24;
      if (dd) {
        return "".concat(dd + (dd < 10 ? ".".concat(zz(hh)) : ''), "d");
      }
      return "".concat(hh, ":").concat(zz(mm));
    };
    // Find all "user" links and save them in userLinks : { 'users': [<link1>, <link2>, ...], 'user2': [<link3>, <link3>, ...], ... }
    contentLinks.each(function (_i, lnk) {
      if ($(lnk).hasClass('mw-changeslist-date') || $(lnk).parent('span').hasClass('mw-history-undo') || $(lnk).parent('span').hasClass('mw-rollback-link')) {
        return;
      }
      url = $(lnk).attr('href');
      if (!url) {
        return;
      }
      if (ma === articleRX.exec(url)) {
        pgTitle = ma[1];
      } else if (ma === scriptRX.exec(url)) {
        pgTitle = ma[1];
      } else {
        return;
      }
      pgTitle = decodeURIComponent(pgTitle).replace(/_/g, ' ');
      user = userTitleRX.exec(pgTitle);
      if (!user) {
        return;
      }
      user = user[2].slice(0, 1).toUpperCase() + user[2].slice(1);
      if (ipv6Regex.test(user)) {
        user = user.toUpperCase();
      }
      $(lnk).addClass('userlink');
      if (!userLinks[user]) {
        userLinks[user] = [];
      }
      userLinks[user].push(lnk);
    });
    // Convert users into array
    var users = [];
    for (var u in userLinks) {
      users.push(u);
    }
    if (users.length === 0) {
      return;
    }
    // API request
    var serverTime;
    var apiRequests = 0;
    container.addClass('markblocked-loading');
    // Callback: receive data and mark links
    var markLinks = function markLinks(resp, _status, xhr) {
      serverTime = new Date(xhr.getResponseHeader('Date'));
      var list;
      var blk;
      var tip;
      var links;
      var lnk;
      if (!resp || !(list = resp.query) || !(list = list.blocks)) {
        return;
      }
      var _iterator = _createForOfIteratorHelper(list),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var element = _step.value;
          blk = element;
          var clss = void 0;
          var blTime = void 0;
          var partial = blk.restrictions && !Array.isArray(blk.restrictions); // Partial block
          if (blk.expiry.startsWith('in')) {
            clss = partial ? 'user-blocked-partial' : 'user-blocked-indef';
            blTime = blk.expiry;
          } else {
            clss = partial ? 'user-blocked-partial' : 'user-blocked-temp';
            blTime = inHours(parseTS(blk.expiry) - parseTS(blk.timestamp));
          }
          tip = mbTooltip;
          if (partial) {
            tip = mbTooltipPartial;
          }
          tip = tip.replace('$1', blTime).replace('$2', blk.by).replace('$3', blk.reason).replace('$4', inHours(serverTime - parseTS(blk.timestamp)));
          links = userLinks[blk.user];
          for (var k = 0; links && k < links.length; k++) {
            lnk = $(links[k]);
            lnk = lnk.addClass(clss);
            if (window.mbTipBox) {
              $('<span>').attr({
                'class': 'user-blocked-tipbox',
                title: tip
              }).text('#').insertBefore(lnk);
            } else {
              lnk.attr('title', lnk.attr('title') + tip);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (--apiRequests === 0) {
        // last response
        container.removeClass('markblocked-loading');
        $('#ca-showblocks').parent().remove(); // remove added portlet link
      }
    };
    // Main loop
    while (users.length > 0) {
      apiRequests++;
      $.post("".concat(mw.util.wikiScript('api'), "?format=json&action=query"), {
        list: 'blocks',
        bklimit: 100,
        bkusers: users.splice(0, 50).join('|'),
        bkprop: 'user|by|timestamp|expiry|reason|restrictions'
        // no need for 'id|flags'
      }, markLinks);
    }
    return; // the end
  };
  // End of main function
  // Start on some pages
  switch (mw.config.get('wgAction')) {
    case 'edit':
    case 'submit':
      break;
    default:
      {
        // 'view', 'history', 'purge', ...
        var maybeAutostart = $.Deferred();
        if (window.mbNoAutoStart) {
          var portletLink = mw.util.addPortletLink('p-cactions', '', 'XX', 'ca-showblocks');
          $(portletLink).on('click', function (e) {
            e.preventDefault();
            maybeAutostart.resolve();
          });
        } else {
          maybeAutostart.resolve();
        }
        $.when($.ready, mw.loader.using(['mediawiki.util']), maybeAutostart).then(function () {
          var firstTime = true;
          mw.hook('wikipage.content').add(function (container) {
            // On the first call after initial page load, container is mw.util.$content
            // Used to limit mainspace activity to just the diff definitions
            if (mw.config.get('wgAction') === 'view' && mw.config.get('wgNamespaceNumber') === 0) {
              container = container.find('.diff-title');
            }
            if (firstTime) {
              firstTime = false;
              // On page load, also update the namespace tab
              container = container.add('#ca-nstab-user');
              mw.util.addCSS("\t\t\t\t\t\t.markblocked-loading a.userlink {opacity:".concat(window.mbLoadingOpacity || 0.85, "}\t\t\t\t\t\ta.user-blocked-temp {").concat(window.mbTempStyle || 'opacity: 0.7; text-decoration: line-through', "}\t\t\t\t\t\ta.user-blocked-indef {").concat(window.mbIndefStyle || 'opacity: 0.4; font-style: italic; text-decoration: line-through', "}\t\t\t\t\t\ta.user-blocked-partial {").concat(window.mbPartialStyle || 'text-decoration: underline; text-decoration-style: dotted', "}\t\t\t\t\t\t.user-blocked-tipbox {").concat(window.mbTipBoxStyle || 'font-size:smaller; background:#FFFFF0; border:1px solid #FEA; padding:0 0.3em; color:#AAA', "}\t\t\t\t\t"));
            }
            markBlocked(container);
          });
        });
      }
  }
})(jQuery, mw);
/* </nowiki> */
/**
 * SPDX-License-Identifier: CC BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @base <https://www.mediawiki.org/wiki/MediaWiki:Gadget-whoisactive.js>
 * @source <https://git.qiuwen.wiki/InterfaceAdmin/Gadgets/src/branch/master/src/Gadgets/WhoIsActive>
 * @dependency ext.gadget.i18n, mediawiki.api
 */
/* <nowiki> */
'use strict';

$(function whoIsActive() {
  if (mw.config.get('wgNamespaceNumber') < 0) {
    return;
  }
  var filteredLinks = [];
  var localizedUserNamespace = mw.config.get('wgFormattedNamespaces')[2];
  $('.mw-body-content').find("a[title^=\"User:\"]:not(.mw-changeslist-date):not([href*=\"undo\"]), a[title^=\"".concat(localizedUserNamespace, ":\"]:not(.mw-changeslist-date):not([href*=\"undo\"])")).each(function (_index, element) {
    var _link$attr;
    var link = $(element);
    var href = decodeURI((_link$attr = link.attr('href')) !== null && _link$attr !== void 0 ? _link$attr : '');
    var userRegex = new RegExp("((User)|(".concat(localizedUserNamespace, ")):(.*?)(?=&|$)"));
    var username = href.match(userRegex);
    if (username) {
      var index = username[0].indexOf('/');
      if (index === -1) {
        filteredLinks.push({
          username: username[0],
          element: link
        });
      }
    }
  });
  if (filteredLinks.length === 0) {
    return;
  }
  var i18nMessages = function i18nMessages() {
    var localize = window.i18n.localize;
    return {
      thisweek: localize({
        en: 'Edited thismonthly',
        'zh-hans': '一周内有编辑',
        'zh-hant': '一周內有編輯'
      }),
      thismonth: localize({
        en: 'Edited thismonthly',
        'zh-hans': '一月内有编辑',
        'zh-hant': '一月內有編輯'
      }),
      thisyear: localize({
        en: 'Edited this year',
        'zh-hans': '一年内有编辑',
        'zh-hant': '一年內有編輯'
      }),
      overayear: localize({
        en: 'Edited over a year ago',
        'zh-hans': '一年未有编辑',
        'zh-hant': '一年未有編輯'
      })
    };
  };
  var _messages = i18nMessages();
  var messages = function messages(key) {
    return _messages[key] || key;
  };
  var getLastActiveMarker = function getLastActiveMarker(timestamp) {
    var date = Date.parse(timestamp);
    var now = Date.now();
    var diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    var timespan;
    if (diff > 365) {
      timespan = 'overayear';
    } else if (diff > 30) {
      timespan = 'thisyear';
    } else if (diff > 7) {
      timespan = 'thismonth';
    } else {
      timespan = 'thisweek';
    }
    var iconPath = "".concat(mw.config.get('wgServer') + mw.config.get('wgScriptPath'), "/resources/lib/ooui/themes/wikimediaui/images/icons/userContributions-ltr.svg");
    var marker = "<span class=\"mw-whoisactivegadget-span mw-whoisactivegadget-".concat(timespan, "\">") + "<img src=\"".concat(iconPath, "\" class=\"mw-whoisactivegadget-filter-").concat(timespan, "\" width=\"15\" height=\"15\"/> ").concat(messages(timespan), "<span>");
    return $(marker);
  };
  var _loop = function _loop() {
    var item = _filteredLinks[_i];
    var username = item.username;
    var element = item.element;
    var api = new mw.Api();
    api.get({
      format: 'json',
      action: 'query',
      list: 'usercontribs',
      uclimit: '1',
      ucuser: username
    }).then(function (result) {
      if (result['query'].usercontribs.length > 0) {
        var timestamp = result['query'].usercontribs[0].timestamp;
        getLastActiveMarker(timestamp).insertAfter(element);
      }
    });
  };
  for (var _i = 0, _filteredLinks = filteredLinks; _i < _filteredLinks.length; _i++) {
    _loop();
  }
});
/* </nowiki> */

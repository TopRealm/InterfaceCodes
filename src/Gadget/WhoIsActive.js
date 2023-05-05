"use strict";

/* <nowiki> */
/**
 * SPDX-License-Identifier: CC BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <www.mediawiki.org/wiki/MediaWiki:Gadget-whoisactive.js>
 * @dependency ext.gadget.SiteCommonJS, mediawiki.api
 */
$(function () {
  if (mw.config.get("wgNamespaceNumber") < 0) {
    return;
  }
  var filteredLinks = [];
  var localizedUserNamespace = mw.config.get("wgFormattedNamespaces")[2];
  $(".mw-body-content").find("a[title^=\"User:\"], a[title^=\"".concat(localizedUserNamespace, ":\"]")).each(function () {
    var link = $(this);
    var href = decodeURI(link.attr("href"));
    var userRegex = new RegExp("((User)|(".concat(localizedUserNamespace, ")):(.*?)(?=&|$)"));
    var username = href.match(userRegex);
    var index = username[0].indexOf("/");
    if (index === -1) {
      filteredLinks.push({
        username: username[0],
        element: link
      });
    }
  });
  if (!filteredLinks.length) {
    return;
  }
  var RECENT = "recent";
  var THISYEAR = "thisyear";
  var OVERAYEAR = "overayear";
  var messages = {
    en: {
      recent: "Edited recently",
      thisyear: "Edited this year",
      overayear: "Edited over a year ago"
    },
    zh: {
      recent: "\u8FD1\u671F".concat(wgULS("编辑", "編輯")),
      thisyear: "\u4E00\u5E74".concat(wgULS("内有编辑", "內有編輯")),
      overayear: "\u4E00\u5E74\u672A\u6709".concat(wgULS("编辑", "編輯"))
    }
  };
  messages["zh-cn"] = messages["zh-my"] = messages["zh-sg"] = messages["zh-hans"] = messages["zh-hk"] = messages["zh-mo"] = messages["zh-tw"] = messages["zh-hant"] = messages.zh;
  var localizedMessages = function () {
    var lang = mw.config.get("wgUserLanguage");
    if (lang in messages) {
      return messages[lang];
    }
    return messages.en;
  }();
  var getLastActiveMarker = function getLastActiveMarker(timestamp) {
    var date = Date.parse(timestamp);
    var now = Date.now();
    var diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    var timespan = RECENT;
    if (diff > 365) {
      timespan = OVERAYEAR;
    } else if (diff > 30) {
      timespan = THISYEAR;
    }
    var iconPath = "".concat(mw.config.get("wgServer") + mw.config.get("wgScriptPath"), "/resources/lib/ooui/themes/wikimediaui/images/icons/userContributions-ltr.svg");
    var marker = "<span class=\"mw-whoisactivegadget-span mw-whoisactivegadget-".concat(timespan, "\">") + "<img src=\"".concat(iconPath, "\" class=\"mw-whoisactivegadget-filter-").concat(timespan, "\" width=\"15\" height=\"15\"/> ").concat(localizedMessages[timespan], "<span>");
    return $(marker);
  };
  mw.loader.using(["mediawiki.api"], function () {
    filteredLinks.forEach(function (item) {
      var username = item.username;
      var element = item.element;
      var api = new mw.Api({
        ajax: {
          headers: {
            "Api-User-Agent": "Qiuwen/1.1 (WhoIsActive/1.1; ".concat(mw.config.get("wgWikiID"), ")")
          }
        }
      });
      api.get({
        format: "json",
        action: "query",
        list: "usercontribs",
        uclimit: "1",
        ucuser: username
      }).then(function (result) {
        if (result.query.usercontribs.length) {
          var timestamp = result.query.usercontribs[0].timestamp;
          getLastActiveMarker(timestamp).insertAfter(element);
        }
      });
    });
  });
});

/* </nowiki> */
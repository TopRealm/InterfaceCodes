/* eslint-disable no-unused-vars */
"use strict";

/* <nowiki> */
/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <zh.wikipedia.org/wiki/MediaWiki:Gadget-AdvancedSiteNotices.js>
 * @dependency mediawiki.storage, mediawiki.api, mediawiki.util, ext.gadget.SiteCommonJS, ext.gadget.GeoJS
 */
$(function (mw) {
  if (window.closeASNForever || $("#siteNotice").length < 0 || mw.config.get("wgAction") === "edit" || mw.config.get("wgAction") === "submit") {
    return;
  }
  if (typeof window.customASNInterval === "undefined") {
    window.customASNInterval = 7;
  }
  var cname = "dismissASN";
  var cval = mw.storage.get(cname);
  if (cval < 1) {
    cval = -1;
  }
  var rev = 0;
  var toid = null;
  var hd = $("<div>").attr("id", "asn-name").text("公告");
  var tb = $("<div>").attr("id", "asn-area");
  var tx = $("<div>").attr("id", "asn-dismissable-notice");
  var ct = $("<div>").attr("id", "advancedSiteNotices").addClass("center mw-parser-output");
  var sd = $("<div>").attr("id", "asn-dismiss").append($("<a>").attr({
    href: "#",
    role: "button"
  }).text("×"));
  tb.append(hd).append(tx.append(ct)).append(sd);
  var nts = null;
  var styles = [];
  sd.on("click", function () {
    mw.storage.set(cname, rev, 2592000); // 30 days
    clearTimeout(toid);
    mw.notify(["\u60A8\u5DF2".concat(wgULS("选择", "選擇"), "\u5728\u63A5\u4E0B").concat(wgULS("来", "來"), "30\u65E5").concat(wgULS("内关闭“高级站点通告”", "內關閉「高級站點通告」"), "\u3002<br>"), "\u82E5\u63A5\u4E0B".concat(wgULS("来", "來"), "30\u65E5").concat(wgULS("内", "內"), "\u5168\u7AD9\u516C\u544A\u672A\u6709\u66F4\u65B0\uFF0C").concat(wgULS("则", "則"), "\u4E0D\u518D").concat(wgULS("显", "顯"), "\u793A\uFF1B"), "\u4F46\u662F\uFF0C\u82E5\u5168\u7AD9\u516C\u544A".concat(wgULS("内", "內"), "\u5BB9\u66F4\u65B0\uFF0C").concat(wgULS("则将", "則將"), "\u91CD\u65B0").concat(wgULS("显", "顯"), "\u793A\u3002")]);
    tb.remove();
    return false;
  });
  var matchCriteria = function matchCriteria(nt) {
    var cache = nt.data("asn-cache");
    if (cache !== undefined) {
      return cache;
    }
    var criteria = nt.attr("data-asn-criteria");
    if (criteria === undefined) {
      criteria = nt.attr("class") ? "false" : "true";
      if (nt.hasClass("only_sysop")) {
        criteria += '||in_group("sysop")';
      }
      if (nt.hasClass("only_logged")) {
        criteria += '||in_group("user")';
      }
      if (nt.hasClass("only_anon")) {
        criteria += '||!in_group("user")';
      }
      if (nt.hasClass("only_zh_cn")) {
        criteria += '||only_for("zh-cn")';
      }
      if (nt.hasClass("only_zh_sg")) {
        criteria += '||only_for("zh-sg")';
      }
      if (nt.hasClass("only_zh_my")) {
        criteria += '||only_for("zh-my")';
      }
      if (nt.hasClass("only_zh_hk")) {
        criteria += '||only_for("zh-hk")';
      }
      if (nt.hasClass("only_zh_mo")) {
        criteria += '||only_for("zh-mo")';
      }
      if (nt.hasClass("only_zh_tw")) {
        criteria += '||only_for("zh-tw")';
      }
    } else {
      criteria = decodeURIComponent(criteria.replace(/\+/g, "%20"));
      criteria = criteria.trim();
    }
    if (criteria === "") {
      criteria = "true";
    }
    var testCriteria = function testCriteria() {
      var in_country = function in_country(country) {
          return window.Geo === undefined || Geo.country === country;
        },
        in_region = function in_region(region) {
          return window.Geo === undefined || Geo.region === region;
        },
        in_city = function in_city(city) {
          return window.Geo === undefined || Geo.city === city;
        },
        in_group = function in_group(group) {
          var user_group = mw.config.get("wgUserGroups");
          return user_group.indexOf(group) > -1;
        },
        only_for = function only_for(userlang) {
          return userlang === mw.config.get("wgUserLanguage");
        };
      // FIXME: This shouldn't be using eval on data entered in wikitext.
      // If that data is malformed it will throw an exception e.g. criteria = "(false))"
      try {
        return eval(criteria);
      } catch (_unused) {
        return false;
      }
    };
    cache = testCriteria();
    nt.data("asn-cache", cache);
    return cache;
  };
  var loadNotices = function loadNotices(pos) {
    if (!tb.length) {
      return;
    }
    if (rev.toString() === cval.toString()) {
      return;
    }
    var l = nts.length;
    var nt = null;
    var rt = 0;
    while (rt++ < l) {
      nt = $(nts[pos]);
      if (matchCriteria(nt)) {
        break;
      }
      pos = (pos + 1) % l;
    }
    if (rt >= l) {
      return;
    }
    if (typeof nt.data("asn-style") === "string") {
      var style = mw.util.addCSS(decodeURIComponent(nt.data("asn-style").replace(/\+/g, "%20")));
      nt.data("asn-style", null);
      nt.data("asn-style-id", styles.length);
      style.disabled = true;
      styles.push(style);
    }
    if (typeof nt.data("asn-html") === "string") {
      nt.data("asn-html-raw", decodeURIComponent(nt.data("asn-html").replace(/\+/g, "%20")));
      nt.data("asn-html", null);
    }
    var styleId = nt.data("asn-style-id");
    nt = nt.data("asn-html-raw") || nt.html();
    var cthtml = ct.html();
    if (cthtml) {
      if (cthtml !== nt) {
        ct.stop().fadeOut(function () {
          styles.forEach(function () {
            this.disabled = true;
          });
          if (styles[styleId]) {
            styles[styleId].disabled = false;
          }
          ct.html(nt);
          // animation try /catched to avoid TypeError: (Animation.tweeners[prop]||[]).concat is not a function error being seen in production
          try {
            ct.fadeIn();
          } catch (_unused2) {}
        });
      }
    } else {
      if ($("#localNotice").length > 0) {
        tb.appendTo($("#localNotice"));
      } else if ($("#siteNotice").length > 0) {
        tb.appendTo($("#siteNotice"));
      } else {
        tb.prependTo($("#content"));
      }
      if (styles[styleId]) {
        styles[styleId].disabled = false;
      }
      ct.html(nt).fadeIn();
    }
    toid = setTimeout(function () {
      loadNotices((pos + 1) % l);
    }, window.customASNInterval * 1000);
  };
  new mw.Api({
    ajax: {
      headers: {
        "Api-User-Agent": "Qiuwen/1.1 (AdvancedSiteNotices/1.1; ".concat(mw.config.get("wgWikiID"), ")")
      }
    }
  }).get({
    page: "Template:AdvancedSiteNotices/ajax",
    prop: "text",
    action: "parse",
    format: "json",
    uselang: mw.config.get("wgUserVariant"),
    variant: mw.config.get("wgUserVariant")
  }).then(function (json) {
    if (!json || !json.parse || !json.parse.text || !json.parse.text["*"]) {
      return;
    }
    json = $("<div>").html(json.parse.text["*"]).find("ul.sitents");
    nts = $("li", json);
    rev = json.data("asn-version");
    var l = nts.length;
    loadNotices(Math.floor(Math.random() * l));
  })["catch"](function (error) {
    console.error("[AdvancedSiteNotices]:", JSON.stringify(error));
  });
}(mediaWiki));

/* </nowiki> */
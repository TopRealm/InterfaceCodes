/**
 * SPDX-License-Identifier: GPL-3.0
 * _addText: '{{Gadget Header|license=GPL-3.0}}'
 *
 * @source <https://git.qiuwen.net.cn/InterfaceAdmin/QiuwenGadgets/src/branch/master/src/ShortURL>
 * @author 安忆 <i@anyi.in>; WaitSpring <me@waitspring.com>
 * @dependency ext.gadget.i18n, mediawiki.api, mediawiki.util, mediawiki.widgets, oojs-ui-windows
 */
/**
 * +--------------------------------------------------------+
 * |         === WARNING: GLOBAL GADGET FILE ===            |
 * +--------------------------------------------------------+
 * |      All changes should be made in the repository,     |
 * |              otherwise they will be lost.              |
 * +--------------------------------------------------------+
 * |      Changes to this page may affect many users.       |
 * |  Please discuss changes at talk page before editing.   |
 * +--------------------------------------------------------+
 */
/* <nowiki> */
(function () {

"use strict";

(function () {
  // src/ShortURL/modules/messages.ts
  var portletText = window.wgULS("短链接", "短網址");
  var alertTitle = window.wgULS("本页短链接：", "本頁短網址：");
  var portletTooltip = window.wgULS("显示该页短链接", "顯示該頁短網址");

  // src/ShortURL/modules/core.ts
  var shortURL = function shortURL() {
    var isInit = false;
    var doIns = function doIns(link) {
      var isCitizen = mw.config.get("skin") === "citizen";
      var element = document.querySelector("#t-shortlink");
      if (!element) {
        element = mw.util.addPortletLink(isCitizen ? "p-tb" : "p-cactions", "#", portletText, "t-shortlink", portletTooltip);
      }
      if (element) {
        var _element$firstElement;
        ((_element$firstElement = element.firstElementChild) !== null && _element$firstElement !== void 0 ? _element$firstElement : element).onclick = function (event) {
          event.preventDefault();
          var $element = $("<div>");
          for (var _i = 0, _arr = ["ysymh.cc", "youshou.wiki"]; _i < _arr.length; _i++) {
            var domain = _arr[_i];
            $element.append(new mw.widgets.CopyTextLayout({
              align: "top",
              copyText: "https://".concat(domain).concat(link)
            }).$element);
          }
          OO.ui.alert($element, {
            title: alertTitle,
            size: "medium"
          });
        };
        if (isCitizen && !isInit) {
          isInit = true;
          $(element).find("a").prepend('<span class="citizen-ui-icon mw-ui-icon-wikimedia-shortlink"></span>');
        }
      }
      var headerElement = document.querySelector("#mw-indicator-shortURL");
      if (!headerElement) {
        var $headerElement = $("<div>").addClass("mw-indicator").attr("id", "mw-indicator-shortURL").append($("<a>").attr({
          href: "#",
          title: portletText
        }).append($("<span>").addClass("shortlink-icon").text(portletText)));
        $headerElement.prependTo(".mw-indicators");
        headerElement = $headerElement.get(0);
      }
      headerElement.onclick = function (event) {
        var _navigator$clipboard;
        event.preventDefault();
        var shorturl = "https://ysymh.cc".concat(link);
        (_navigator$clipboard = navigator.clipboard) === null || _navigator$clipboard === void 0 || _navigator$clipboard.writeText(shorturl);
        mw.notify($("<span>").text(alertTitle).append($("<br>"), $("<a>").attr("href", "#").text(shorturl).on("click", function (_event) {
          _event.preventDefault();
          _event.stopPropagation();
        })), {
          tag: "shortURL",
          type: "info"
        });
      };
    };
    var init = function init(_ref) {
      var articleId = _ref.articleId,
        diffId = _ref.diffId,
        oldId = _ref.oldId,
        revisionId = _ref.revisionId;
      if (diffId) {
        var buildLink = function buildLink(_oldId) {
          var link = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/d";
          if (_oldId) {
            link += "/".concat(_oldId);
          }
          link += "/".concat(diffId);
          doIns(link);
        };
        buildLink(oldId);
        if (oldId) {
          var api = new mw.Api({
            ajax: {
              headers: {
                "Api-User-Agent": "Qiuwen/1.1 (ShortURL/1.1; ".concat(mw.config.get("wgWikiID"), ")")
              }
            }
          });
          var params = {
            action: "compare",
            format: "json",
            formatversion: "2",
            prop: "ids",
            fromrev: diffId,
            torelative: "prev"
          };
          api.get(params).then(function (response) {
            var _response$compare;
            if (diffId === mw.config.get("wgDiffNewId") && ((_response$compare = response["compare"]) === null || _response$compare === void 0 ? void 0 : _response$compare.fromrevid) === mw.config.get("wgDiffOldId")) {
              buildLink(false);
            }
          });
        }
      } else if (revisionId && ($("#contentSub").find("#mw-revision-nav").length || $("main#content>.pre-content #mw-revision-nav").length)) {
        doIns("/p/".concat(revisionId));
      } else if (articleId) {
        doIns("/c/".concat(articleId));
      }
    };
    mw.hook("wikipage.content").add(function ($content) {
      if ($content.attr("id") !== "mw-content-text") {
        return;
      }
      init({
        articleId: mw.config.get("wgArticleId"),
        diffId: mw.config.get("wgDiffNewId"),
        oldId: mw.config.get("wgDiffOldId"),
        revisionId: mw.config.get("wgRevisionId")
      });
    });
  };

  // src/ShortURL/ShortURL.ts
  (function () {
    if (mw.config.get("wgNamespaceNumber") === -1 || document.getElementsByClassName("noarticletext").length > 0 || mw.config.get("wgAction") !== "view") {
      return;
    }
    $(shortURL);
  })();
})();

})();
/* </nowiki> */

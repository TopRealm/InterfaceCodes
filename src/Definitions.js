/**
 * SPDX-License-Identifier: CC-BY-NC-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-NC-SA-4.0}}'
 *
 * @source <llwiki.org/zh/MediaWiki:Gadget-definitions.js>
 * @author Bhsd <https://llwiki.org/zh/User:Bhsd>
 * @dependencies: mediawiki.api, jquery.tablesorter, oojs-ui-widgets
 */
/**
 * @Function: 使用表格界面显示和编辑小工具定义
 * @Warning: 未添加繁体中文
 */
"use strict";

/* <nowiki> */
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
if (mw.config.get("wgPageName") === "MediaWiki:Gadgets-definition" && mw.config.get("wgAction") === "view") {
  mw.loader.using(["jquery.tablesorter", "mediawiki.api", "oojs-ui-widgets"]).then(function () {
    $(function () {
      // 1. 最基本的工具函数，用于text、HTML、data三种状态间转换
      var Keys = ["name", "type", "default", "peers", "dependencies", "rights", "targets", "skins", "hidden", "pages"],
        dictionary = {
          type: {
            general: "通常",
            styles: "纯CSS"
          },
          targets: {
            desktop: "桌面版",
            mobile: "移动版",
            "desktop,mobile": "通用"
          }
        },
        text2data = function text2data(text) {
          var parts = text.match(/^(.+)\[(.+)]\|(.+)$/),
            params = $.extend({
              name: parts[1],
              pages: parts[3],
              type: "general",
              targets: "desktop"
            }, Object.fromEntries(parts[2].split("|").map(function (s) {
              return s.includes("=") ? s.split("=") : [s, true];
            })));
          delete params.ResourceLoader;
          ["peers", "dependencies", "skins", "rights", "pages"].forEach(function (key) {
            params[key] = params[key] ? params[key].split(key === "pages" ? "|" : ",").sort() : [];
          });
          return params;
        },
        data2html = function data2html(params, key) {
          var val = params[key];
          switch (key) {
            case "name":
              return $("<span>").attr("id", val).html([val, new OO.ui.IndicatorWidget({
                title: "删除",
                indicator: "clear"
              }).$element]);
            case "type":
            case "targets":
              return dictionary[key][val];
            case "default":
            case "hidden":
              return val ? "是" : "否";
            case "peers":
              return val.map(function (ele) {
                return $("<div>").html($("<a>").attr("href", "#".concat(ele)).text(ele));
              });
            case "dependencies":
            case "rights":
            case "skins":
              return val.map(function (ele) {
                return $("<div>").text(ele);
              });
            case "pages":
              return val.map(function (ele) {
                return $("<div>").html($("<a>").attr("href", mw.util.getUrl("Mediawiki:Gadget-".concat(ele))).text(ele));
              });
          }
        },
        data2text = function data2text(params) {
          return "* ".concat(params.name, "[").concat(params.type === "general" ? "ResourceLoader" : "type=styles").concat(["default", "hidden"].map(function (key) {
            return params[key] ? "|".concat(key) : "";
          }).join("")).concat(["peers", "dependencies", "rights"].map(function (key) {
            return params[key].length ? "|".concat(key, "=").concat(params[key].join()) : "";
          }).join("")).concat(params.targets === "desktop" ? "" : "|targets=".concat(params.targets)).concat(params.skins.length === 3 || params.skins.length === 0 ? "" : "|skins=".concat(params.skins.join()), "]|").concat(params.pages.join("|"));
        },
        // 2. 使用表格显示小工具定义
        insertRow = function insertRow() {
          var params = text2data(this.textContent);
          return $("<tr>").attr("class", "defTr").html(Keys.map(function (key) {
            return $("<td>").html(data2html(params, key));
          })).data("params", params)[0];
        },
        // 3. 使用表格修改小工具定义
        api = new mw.Api(),
        btns = [new OO.ui.ButtonWidget({
          label: "保存",
          flags: ["primary", "progressive"]
        }), new OO.ui.ButtonWidget({
          label: "添加",
          flags: "progressive"
        })],
        $tr = $("<tr>").html($("<td>").attr("colspan", 10).html(btns.map(function (ele) {
          return ele.$element;
        }))),
        boolWidget = new OO.ui.DropdownInputWidget({
          options: [{
            data: "true",
            label: "是"
          }, {
            data: "",
            label: "否"
          }]
        }),
        freeWidget = new OO.ui.TagMultiselectWidget({
          allowArbitrary: true
        }),
        getOptions = function getOptions(key) {
          return Object.entries(dictionary[key]).map(function (ele) {
            return {
              data: ele[0],
              label: ele[1]
            };
          });
        },
        widgets = [],
        endEdit = function endEdit(widget) {
          if (!document.documentElement.getElementsByTagName("body")[0].contains(widget.$element[0])) {
            return;
          }
          var $oldTd = widget.$element.closest("td"),
            params = $oldTd.closest(".defTr").data("params"),
            key = Keys[$oldTd.index()];
          params[key] = widget.getValue();
          widget.$element.detach();
          $oldTd.html(data2html(params, key));
        },
        save = function save() {
          btns[0].setDisabled(true);
          widgets.forEach(endEdit);
          var $table = $tr.closest("table"),
            pageid = mw.config.get("wgArticleId"),
            section = $table.index(".defTable") + 1,
            // 注意可能标题自动编号
            sectionName = $(".mw-headline").eq(section - 1).contents().last().text().trim(),
            text = "==".concat(sectionName, "==\n").concat(_toConsumableArray($table.find(".defTr")).map(function (ele) {
              return data2text($(ele).data("params"));
            }).join("\n"));
          api.postWithEditToken({
            action: "edit",
            pageid: pageid,
            section: section,
            text: text,
            summary: "/*".concat(sectionName, "*/ Edit via [[MediaWiki:Gadget-Definitions.js|Definitions]]")
          }).then(function () {
            location.reload();
          }, function (reason) {
            console.error(reason);
          });
        },
        edit = function edit(e) {
          if (widgets.length === 0) {
            widgets.push.apply(widgets, [new OO.ui.TextInputWidget(), new OO.ui.DropdownInputWidget({
              options: getOptions("type")
            }), boolWidget, new OO.ui.MenuTagMultiselectWidget({
              allowArbitrary: true,
              options: _toConsumableArray($(".defTr")).map(function (ele) {
                return $(ele).data("params");
              }).filter(function (ele) {
                return ele.type === "styles";
              }).map(function (ele) {
                return {
                  data: ele.name
                };
              })
            }), freeWidget, freeWidget, new OO.ui.DropdownInputWidget({
              options: getOptions("targets")
            }), freeWidget, boolWidget, freeWidget]);
          }
          var $td = $(this),
            i = $td.index(),
            params = $td.closest(".defTr").data("params"),
            widget = widgets[i],
            table = e.delegateTarget;
          if (!params) {
            return;
          }
          if (!table.contains($tr[0])) {
            $tr.appendTo(table);
          }
          if ($td[0].contains(widget.$element[0])) {
            return;
          }
          endEdit(widget);
          widget.setValue(params[Keys[i]] || "");
          $td.html(widget.$element);
        },
        deleteRow = function deleteRow(e) {
          e.preventDefault();
          $(this).closest(".defTr").detach();
          var table = e.delegateTarget;
          if (!table.contains($tr[0])) {
            $tr.appendTo(table);
          }
        };
      $("h2:has( .mw-editsection )").next().children("ul").addBack("ul").replaceWith(function () {
        return $("<table>").attr("class", "wikitable sortable defTable").html($("<tbody>").html($("<tr>").html(["名称", "类型", "默认", "Peers", "依赖项", "权限", "范围", "皮肤", "隐藏", "链接"].map(function (ele) {
          return $("<th>").text(ele);
        })).add($(this).children().map(insertRow)))).tablesorter().on("dblclick", "td", edit).on("click", ".oo-ui-indicator-clear", deleteRow);
      });
      btns[0].on("click", save);
      btns[1].$element.on("click", function () {
        var params = {
          name: "",
          type: "general",
          peers: [],
          dependencies: [],
          rights: [],
          targets: "desktop",
          skins: [],
          pages: []
        };
        $("<tr>").attr("class", "defTr").html(Keys.map(function (key) {
          return $("<td>").html(data2html(params, key));
        })).data("params", params).insertBefore($(this).closest("tr"));
      });
    });
  });
}
/* </nowiki> */
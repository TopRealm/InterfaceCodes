/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <zh.wikipedia.org/wiki/MediaWiki:Gadget-Edittools-delh.js>
 * @dependency ext.gadget.Edittools-vector, ext.gadget.SiteCommonJS
 */
/* global customizeToolbar */
"use strict";

if (/^Qiuwen:存废讨论\//i.test(mw.config.get("wgPageName"))) {
  var getVfdText = function getVfdText(code, comment) {
    return {
      label: comment,
      action: {
        type: "encapsulate",
        options: {
          pre: "{" + "{delh|".concat(code, "}}\n"),
          post: "\n----\n: ".concat(comment, "\u3002--~~").concat("~~\n{", "{delf}}")
        }
      }
    };
  };
  var getList = function getList(list) {
    var obj = {};
    for (var item in list) {
      obj[item] = getVfdText(item, list[item]);
    }
    return obj;
  };
  customizeToolbar(function () {
    this.wikiEditor("addToToolbar", {
      sections: {
        delh: {
          type: "toolbar",
          label: wgULS("结束讨论", "結束討論")
        }
      }
    });
    this.wikiEditor("addToToolbar", {
      section: "delh",
      groups: {
        vfd: {}
      }
    });
    this.wikiEditor("addToToolbar", {
      section: "delh",
      group: "vfd",
      tools: {
        请求无效: {
          label: wgULS("请求无效", "請求無效"),
          type: "select",
          list: getList({
            ir: wgULS("请求无效", "請求無效"),
            rep: wgULS("重复提出，无效", "重複提出，無效"),
            commons: wgULS("应在维基共享资源提请", "應在維基共享資源提請"),
            ne: wgULS("目标页面或文件不存在，无效", "目標頁面或檔案不存在，無效"),
            nq: wgULS("提删者未取得提删资格，无效", "提刪者未取得提刪資格，無效")
          })
        },
        保留: {
          label: "保留",
          type: "select",
          list: getList({
            k: "保留",
            sk: "快速保留",
            tk: wgULS("暂时保留", "暫時保留"),
            rr: wgULS("请求理由消失", "請求理由消失"),
            dan: wgULS("删后重建", "刪後重建")
          })
        },
        删除: {
          label: wgULS("删除", "刪除"),
          type: "select",
          list: getList({
            d: wgULS("删除", "刪除"),
            ifd: wgULS("图像因侵权被删", "圖像因侵權被刪")
          })
        },
        快速删除: {
          label: wgULS("快速删除", "快速刪除"),
          type: "select",
          list: getList({
            sd: wgULS("快速删除", "快速刪除"),
            lssd: wgULS("无来源或版权资讯，快速删除", "無來源或版權資訊，快速刪除"),
            svg: wgULS("已改用SVG图形，删除", "已改用SVG圖形，刪除"),
            drep: wgULS("多次被删除，条目锁定", "多次被刪除，條目鎖定")
          })
        },
        其他处理方法: {
          label: wgULS("其他处理方法", "其他處理方法"),
          type: "select",
          list: getList({
            c: wgULS("转交侵权", "轉交侵權"),
            r: wgULS("重定向", "重定向"),
            cr: wgULS("分类重定向", "分類重定向"),
            m: wgULS("移动", "移動"),
            merge: wgULS("并入", "併入"),
            nc: wgULS("无共识", "無共識")
          })
        }
      }
    });
  });
}
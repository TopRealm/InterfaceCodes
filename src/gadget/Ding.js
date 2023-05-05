"use strict";

/* <nowiki> */
/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <zh.wikipedia.org/wiki/Special:Permalink/59753812>
 */
/* ding ("message here should be safe html, beacuse you can write <button>Buttons</button>", "info" | "warning" | "success" | "default", "long" | 10000 <-- expiry time in ms ) */
window.DingExposedInterface = function () {
  /**
   *
   * @param {string} message message here should be safe html, beacuse you can write <button>Buttons</button> in this
   * @param {string} type "info": dark blue/black, "warning": red/white, "success": green/white, "default": light blue/black (background/text)
   * @param {number|"long"} ttl number of microseconds before ding element disappears, "long" if the ding should not disappear after a timeout
   * @param {boolean} history does nothing currently
   * @param {boolean} persist If the element should go away when user clicks anywhere on it. If persist= true && ttl= long, make sure to include a button to allow the user to remove the banner
   */
  var ding = function ding(message, type, ttl, history, persist) {
    if (type === undefined) {
      type = "info";
    }
    if (ttl === undefined) {
      ttl = 3500;
    }
    if (history === undefined) {
      history = true;
    }
    if (persist === undefined) {
      persist = false;
    }
    if (!document.querySelector("#ding")) {
      document.body.insertAdjacentHTML("afterbegin", "<style>#ding button{box-sizing:border-box;margin:0 .2em;padding:0 .7em;border:.2em solid #fff;border-radius:9em;background:0 0;color:inherit;font-weight:inherit}#ding button:active{background:hsla(0deg 0% 100%/60%)}</style>");
      document.body.insertAdjacentHTML("afterbegin", '<div id="ding"></div>');
    }
    if (!document.querySelector("#ding_history")) {
      document.body.insertAdjacentHTML("afterbegin", '<div id="ding_history"></div>');
    }
    var dingEle = document.querySelector("#ding");
    var previousMessage = dingEle.lastChild;
    if (previousMessage) {
      previousMessage.style.transform = "translateY(-130%)";
      setTimeout(function () {
        previousMessage.remove();
      }, 500);
    }
    var color_sets = {
      warning: {
        text: "rgb(255, 255, 255)",
        background: "rgb(221, 51, 51)"
      },
      info: {
        text: "rgb(255, 255, 255)",
        background: "rgb(51, 102, 204)"
      },
      success: {
        text: "rgb(255, 255, 255)",
        background: "rgb(0, 175, 137)"
      },
      confusion: {
        text: "rgb(0, 0, 0)",
        background: "rgb(234, 236, 240)"
      },
      "default": {
        text: "rgb(0, 0, 0)",
        background: "rgb(234, 236, 240)"
      }
    };
    var retractant = persist ? "" : "onclick='this.style.transform=\"translateY(-130%)\";setTimeout(function(){this.remove()}.bind(this),500);' ";
    dingEle.insertAdjacentHTML("beforeend", "<div ".concat(retractant, "style=\"position:fixed;right:0;bottom:0;left:0;z-index:9999;margin:0 0 auto;padding:.6em 2em;height:auto;box-shadow:0 2px 5px rgb(0,0,0,.2);text-align:center;font-weight:700;font-size:86%;line-height:1.4em;opacity:1;transition:all .2s;transform:translateY(-130%);background:").concat(color_sets[type].background, ";color:").concat(color_sets[type].text, ";\">").concat(message, "</div>"));
    var noticeEle = dingEle.lastChild;
    setTimeout(function () {
      noticeEle.style.transform = "translateY(0%)";
    }, 10);
    if (ttl !== "long") {
      setTimeout(function () {
        noticeEle.style.transform = "translateY(-130%)";
      }, ttl + 10);
      setTimeout(function () {
        noticeEle.remove();
      }, ttl + 510);
    }
  };
  return ding;
}();

/* </nowiki> */
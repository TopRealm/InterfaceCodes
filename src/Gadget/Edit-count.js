/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @author 安忆
 */
"use strict";

(function (mw) {
  (function (editCount) {
    if (editCount !== null) {
      mw.loader.addStyleTag("#pt-mycontris>a::after,.menu__item--userContributions>span>span::after{content:\" (".concat(editCount, ")\"}"));
    }
  })(mw.config.get("wgUserEditCount"));
})(mediaWiki);
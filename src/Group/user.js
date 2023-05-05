'use strict';

/* <nowiki> */
/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <zh.wikipedia.org/wiki/MediaWiki:Common.js>
 * @source <meta.wikimedia.org/wiki/MediaWiki:Gadget-SousPages.js>
 */
/* 这里的任何JavaScript将只为注册用户加载 */
(function ($, mw) {
  /* 加载编辑界面脚本 */
  $(function () {
    if (mw.config.get('wgAction') === 'edit' || mw.config.get('wgAction') === 'submit' || mw.config.get('wgCanonicalSpecialPageName') === 'Search') {
      mw.loader.load(['ext.gadget.EditFormJS']);
    } else {
      mw.loader.using(['ext.visualEditor.desktopArticleTarget.init'], function () {
        mw.libs.ve.addPlugin(function () {
          mw.loader.load(['ext.gadget.EditFormJS']);
        });
      });
    }
  });
})(jQuery, mediaWiki);

/* </nowiki> */
/* <nowiki> */
'use strict';

/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <zh.wikipedia.org/wiki/MediaWiki:Common.js>
 * @source <en.wikipedia.org/wiki/MediaWiki:Gadget-exlinks.js>
 * @source <meta.wikimedia.org/wiki/MediaWiki:Gadget-ShortLink.js>
 * @source <www.mediawiki.org/wiki/MediaWiki:Gadget-workinprogress.js>
 * @source <www.mediawiki.org/wiki/Snippets/Load_JS_and_CSS_by_URL>
 * @dependency mediawiki.util
 */
(function ($, mw) {
  if (window.SiteCommonJS) {
    return;
  }
  window.SiteCommonJS = true;
  /**
   * &withCSS= and &withJS= URL parameters
   * Allow to try custom scripts from MediaWiki space
   * without editing personal .css or .js files
   */
  mw.loader.using(['mediawiki.util'], function () {
    if (mw.util.getParamValue('withCSS') || mw.util.getParamValue('withJS') || mw.util.getParamValue('withModule')) {
      var extraCSS = mw.util.getParamValue('withCSS');
      var extraJS = mw.util.getParamValue('withJS');
      var extraModule = mw.util.getParamValue('withModule');
      if (/^MediaWiki:[^#%&<=>]*\.css$/.test(extraCSS)) {
        mw.loader.load("".concat(mw.config.get('wgServer') + mw.config.get('wgScript'), "?title=").concat(mw.util.wikiUrlencode(extraCSS), "&action=raw&ctype=text/css&maxage=86400&smaxage=86400"), 'text/css');
      }
      if (/^MediaWiki:[^#%&<=>]*\.js$/.test(extraJS)) {
        mw.loader.load("".concat(mw.config.get('wgServer') + mw.config.get('wgScript'), "?title=").concat(mw.util.wikiUrlencode(extraJS), "&action=raw&ctype=text/javascript&maxage=86400&smaxage=86400"));
      }
      if (/^ext\.gadget\.[^,|]+$/.test(extraModule)) {
        mw.loader.load(extraModule);
      }
    }
  });
  /**
   * Load CSS and JS files temporarily through URL.
   * &use=File1.css|File2.css|File3.js
   */
  mw.loader.using(['mediawiki.util'], function () {
    var files = mw.util.getParamValue('use');
    if (!files) {
      return;
    }
    var user = mw.RegExp.escape(mw.config.get('wgUserName', ''));
    var FileRE = new RegExp("^(?:MediaWiki:".concat(user ? "|User:".concat(user, "/") : '', ")[^&<>=%#]*\\.(js|css)$"));
    var ExtRE = new RegExp('^ext\\.[^,]+$');
    var path = "".concat(mw.config.get('wgServer') + mw.config.get('wgScript'), "?action=raw&ctype=text/");
    files.split('|').forEach(function (k, v) {
      var f = v.toString().trim();
      var what = FileRE.exec(f) || ['', ''];
      switch (what[1]) {
        case 'js':
          mw.loader.load("".concat(path, "javascript&title=").concat(encodeURIComponent(f)));
          break;
        case 'css':
          mw.loader.load("".concat(path, "css&title=").concat(encodeURIComponent(f)));
          break;
        default:
          if (ExtRE.exec(f)) {
            mw.loader.load(f);
          }
      }
    });
  });
  /**
   * Add target="blank" to external links
   */
  $(function () {
    $('a.external, a[rel="mw:ExtLink"]').filter(function () {
      var h = String($(this).attr('href')).split('/');
      if (h.length < 3 || h[2] === location.host) {
        return false;
      }
      if (this.href.indexOf("".concat(location.protocol, "//").concat(location.hostname)) !== 0) {
        this.target = '_blank';
        if (!this.rel.includes('noopener')) {
          this.rel += ' noopener';
        }
        if (!this.rel.includes('noreferrer')) {
          this.rel += ' noreferrer';
        }
      }
      return true;
    });
  });
  /**
   * Remove title=* from permalink
   */
  $(function () {
    var permalink = document.querySelector('#t-permalink');
    if (permalink) {
      permalink.firstChild.href = permalink.firstChild.href.replace(/title=[^&]*&/, '');
    }
  });
  /**
   * Cleanup title for all pages
   */
  $(function () {
    var titleCleanUp = function titleCleanUp() {
      mw.loader.using(['mediawiki.Title'], function () {
        var title = new mw.Title(mw.config.get('wgPageName'));
        var wipTitle = title.toText();
        $('.firstHeading').text(wipTitle);
      });
    };
    switch (mw.config.get('wgNamespaceNumber')) {
      case 2:
      case 3:
      case 6:
      case 7:
      case 118:
        {
          if (mw.config.get('wgAction') === 'view' && !location.href.includes('diff=') && !location.href.includes('oldid=')) {
            titleCleanUp();
          }
          break;
        }
      default:
        {
          return;
        }
    }
  });
  /**
   * Map addPortletLink to mw.util
   *
   * @deprecated: Use mw.util.addPortletLink instead.
   */
  mw.log.deprecate(window, 'addPortletLink', function () {
    var _mw$util$addPortletLi;
    return (_mw$util$addPortletLi = mw.util.addPortletLink).apply.apply(_mw$util$addPortletLi, arguments);
  }, 'Use mw.util.addPortletLink() instead');
  /**
   * Extract a URL parameter from the current URL
   *
   * @deprecated: Use mw.util.getParamValue with proper escaping
   */
  mw.log.deprecate(window, 'getURLParamValue', function () {
    var _mw$util$getParamValu;
    return (_mw$util$getParamValu = mw.util.getParamValue).apply.apply(_mw$util$getParamValu, arguments);
  }, 'Use mw.util.getParamValue() instead');
  /**
   * Test if an element has a certain class
   *
   * @deprecated: Use $(element).hasClass() instead.
   */
  mw.log.deprecate(window, 'hasClass', function (element, className) {
    return $(element).hasClass(className);
  }, 'Use jQuery.hasClass() instead');
  /**
   * maintenance: Some user scripts may be using the following deprecated functions.
   * These functions are no longer supported and should be updated to use mw.loader.getScript.
   *
   * @deprecated: User mw.loader.load() or mw.loader.getScript() instead.
   */
  mw.log.deprecate(window, 'importScript', function (page) {
    return mw.loader.load("".concat(mw.config.get('wgServer') + mw.config.get('wgScript'), "?title=").concat(mw.util.wikiUrlencode(page), "&action=raw&ctype=text/javascript&maxage=86400&smaxage=86400"));
  }, 'Use mw.loader.load() or mw.loader.getScript() instead');
  mw.log.deprecate(window, 'importStylesheet', function (page) {
    return mw.loader.load("".concat(mw.config.get('wgServer') + mw.config.get('wgScript'), "?title=").concat(mw.util.wikiUrlencode(page), "&action=raw&ctype=text/css&maxage=86400&smaxage=86400"), 'text/css');
  }, 'Use mw.loader.load() instead');
  mw.log.deprecate(window, 'importScriptURI', function (URL) {
    return mw.loader.load(mw.util.wikiUrlencode(URL));
  }, 'Use mw.loader.load() or mw.loader.getScript() instead');
  mw.log.deprecate(window, 'importStylesheetURI', function (URL) {
    return mw.loader.load(mw.util.wikiUrlencode(URL), 'text/css');
  }, 'Use mw.loader.load() instead');
  mw.log.deprecate(window, 'importScriptCallback', function (page, ready) {
    return mw.loader.getScript("".concat(mw.config.get('wgServer') + mw.config.get('wgScript'), "?title=").concat(mw.util.wikiUrlencode(page), "&action=raw&ctype=text/javascript&maxage=86400&smaxage=86400"), ready);
  }, 'Use mw.loader.load() or mw.loader.getScript() instead');
  mw.log.deprecate(window, 'importScriptURICallback', function () {
    return mw.loader.getScript;
  }, 'Use mw.loader.getScript() instead');
  /**
   * maintenance: Some user scripts may be using the following deprecated functions.
   * These functions are kept for compability.
   */
  mw.log.deprecate(window, 'getURLParameter', function (name) {
    return mw.util.getParamValue(name);
  }, 'Use mw.util.getParamValue() instead');
  mw.log.deprecate(window, 'JSConfig', {}, 'Use {} instead');
  /**
   * wgU*S functions have been split to a seperate gadget.
   */
  mw.loader.using(['ext.gadget.i18n']);
})(jQuery, mediaWiki);
/* </nowiki> */
/**
 * HotCat V2.43
 *
 * Ajax-based simple Category manager. Allows adding/removing/changing categories on a page view.
 * Supports multiple category changes, as well as redirect and disambiguation resolution. Also
 * plugs into the upload form. Search engines to use for the suggestion list are configurable, and
 * can be selected interactively.
 *
 * Documentation: commons.wikimedia.org/wiki/Help:Gadget-HotCat
 * List of main authors: commons.wikimedia.org/wiki/Help:Gadget-HotCat/Version_history
 *
 * License: Quadruple licensed GFDL, GPL, LGPL and Creative Commons Attribution 3.0 (CC-BY-3.0; http://creativecommons.org/licenses/by/3.0)
 *
 * Choose whichever license of these you like best :-)
 *
 * This code should run on any MediaWiki installation >= MW 1.27.
 *
 * For use with older versions of MediaWiki, use the archived versions below:
 *
 * <=1.26: commons.wikimedia.org/w/index.php?title=MediaWiki:Gadget-HotCat.js&oldid=211134664
 */
(function ($, mw) {
  /* <nowiki> */
  // Don't use mw.config.get() as that takes a copy of the config, and so doesn't
  // account for values changing, e.g. wgCurRevisionId after a VE edit
  var conf = $.extend({}, mw.config.values, {
    // when running on mobile domain - do not use wgServer.
    wgServer: window.location.host.indexOf(".m.") > -1 ? "//".concat(window.location.host) : mw.config.get("wgServer")
  });

  // Guard against double inclusions (in old IE/Opera element ids become window properties)
  if (window.HotCat && !window.HotCat.nodeName || conf.wgAction === "edit") {
    return; // Not on edit mode
  }

  // Configuration stuff.
  var HC = window.HotCat = {
    // Localize these messages to the main language of your wiki.
    messages: {
      cat_removed: "removed [[Category:$1]]",
      template_removed: "removed {{[[Category:$1]]}}",
      cat_added: "added [[Category:$1]]",
      cat_keychange: 'new key for [[Category:$1]]: "$2"',
      // $2 is the new key
      cat_notFound: 'Category "$1" not found',
      cat_exists: 'Category "$1" already exists; not added.',
      cat_resolved: " (redirect [[Category:$1]] resolved)",
      uncat_removed: "removed {{uncategorized}}",
      separator: "; ",
      // Some text to prefix to the edit summary.
      prefix: "",
      // Some text to append to the edit summary. Named 'using' for historical reasons. If you prefer
      // to have a marker at the front, use prefix and set this to the empty string.
      using: " using [[Help:Gadget-HotCat|HotCat]]",
      // $1 is replaced by a number. If your language has several plural forms (c.f. [[:en:Dual (grammatical form)]]),
      // you can set this to an array of strings suitable for passing to mw.language.configPlural().
      // If that function doesn't exist, HotCat will simply fall back to using the last
      // entry in the array.
      multi_change: "$1 categories",
      // Button text. Localize to wgContentLanguage here; localize to wgUserLanguage in a subpage,
      // see localization hook below.
      commit: "Save",
      // Button text. Localize to wgContentLanguage here; localize to wgUserLanguage in a subpage,
      // see localization hook below.
      ok: "OK",
      // Button text. Localize to wgContentLanguage here; localize to wgUserLanguage in a subpage,
      // see localization hook below.
      cancel: "Cancel",
      // Localize to wgContentLanguage here; localize to wgUserLanguage in a subpage,
      // see localization hook below.
      multi_error: "Could not retrieve the page text from the server. Therefore, your category changes cannot be saved. We apologize for the inconvenience.",
      // Defaults to '[[' + category_canonical + ':$1]]'. Can be overridden if in the short edit summaries
      // not the standard category name should be used but, say, a shorter namespace alias. $1 is replaced
      // by a category name.
      short_catchange: null
    },
    // Plural of category_canonical.
    categories: "Categories",
    // Any category in this category is deemed a disambiguation category; i.e., a category that should not contain
    // any items, but that contains links to other categories where stuff should be categorized. If you don't have
    // that concept on your wiki, set it to null. Use blanks, not underscores.
    disambig_category: "Disambiguation",
    // Any category in this category is deemed a (soft) redirect to some other category defined by a link
    // to another non-blacklisted category. If your wiki doesn't have soft category redirects, set this to null.
    // If a soft-redirected category contains more than one link to another non-blacklisted category, it's considered
    // a disambiguation category instead.
    redir_category: "Category redirects",
    // The little modification links displayed after category names. U+2212 is a minus sign; U+2193 and U+2191 are
    // downward and upward pointing arrows. Do not use ↓ and ↑ in the code!
    links: {
      change: "(±)",
      remove: "(\u2212)",
      add: "(+)",
      restore: "(×)",
      undo: "(×)",
      down: "(\u2193)",
      up: "(\u2191)"
    },
    changeTag: "HotCat",
    // The tooltips for the above links
    tooltips: {
      change: "Modify",
      remove: "Remove",
      add: "Add a new category",
      restore: "Undo changes",
      undo: "Undo changes",
      down: "Open for modifying and display subcategories",
      up: "Open for modifying and display parent categories"
    },
    // The HTML content of the "enter multi-mode" link at the front.
    addmulti: "<span>+<sup>+</sup></span>",
    // Tooltip for the "enter multi-mode" link
    multi_tooltip: "Modify several categories",
    // Return true to disable HotCat.
    disable: function disable() {
      var ns = conf.wgNamespaceNumber;
      var nsIds = conf.wgNamespaceIds;
      return ns < 0 ||
      // Special pages; Special:Upload is handled differently
      ns === 10 ||
      // Templates
      ns === 828 ||
      // Module (Lua)
      ns === 8 ||
      // MediaWiki
      ns === 6 && !conf.wgArticleId ||
      // Non-existing file pages
      ns === 2 && /\.(js|css)$/.test(conf.wgTitle) ||
      // User scripts
      nsIds && (ns === nsIds.creator || ns === nsIds.timedtext || ns === nsIds.institution);
    },
    // A regexp matching a templates used to mark uncategorized pages, if your wiki does have that.
    // If not, set it to null.
    uncat_regexp: /\{\{\s*[Uu]ncategorized\s*[^}]*\}\}\s*(<!--.*?-->\s*)?/g,
    // The images used for the little indication icon. Should not need changing.
    existsYes: "//wiki.zorua.top/images/thumb/b/be/P_yes.svg/24px-P_yes.svg.png",
    existsNo: "//wiki.zorua.top/images/thumb/4/42/P_no.svg/24px-P_no.svg.png",
    // a list of categories which can be removed by removing a template
    // key: the category without namespace
    // value: A regexp matching the template name, again without namespace
    // If you don't have this at your wiki, or don't want this, set it to an empty object {}.
    template_categories: {},
    // Names for the search engines
    engine_names: {
      searchindex: "Search index",
      pagelist: "Page list",
      combined: "Combined search",
      subcat: "Subcategories",
      parentcat: "Parent categories"
    },
    // Override the decision of whether HotCat should help users by automatically
    // capitalising the title in the user input text if the wiki has case-sensitive page names.
    // Basically, this will make an API query to check the MediaWiki configuration and HotCat then sets
    // this to true for most wikis, and to false on Wiktionary.
    //
    // You can set this directly if there is a problem with it. For example, Georgian Wikipedia (kawiki),
    // is known to have different capitalisation logic between MediaWiki PHP and JavaScript. As such, automatic
    // case changes in JavaScript by HotCat would be wrong.
    capitalizePageNames: null,
    // If upload_disabled is true, HotCat will not be used on the Upload form.
    upload_disabled: false,
    // Single regular expression matching blacklisted categories that cannot be changed or
    // added using HotCat. For instance /\bstubs?$/ (any category ending with the word "stub"
    // or "stubs"), or /(\bstubs?$)|\bmaintenance\b/ (stub categories and any category with the
    // word "maintenance" in its title.
    blacklist: null,
    // Stuff changeable by users:
    // Background for changed categories in multi-edit mode. Default is a very light salmon pink.
    bg_changed: "#FCA",
    // If true, HotCat will never automatically submit changes. HotCat will only open an edit page with
    // the changes; users must always save explicitly.
    no_autocommit: false,
    // If true, the "category deletion" link "(-)" will never save automatically but always show an
    // edit page where the user has to save the edit manually. Is false by default because that's the
    // traditional behavior. This setting overrides no_autocommit for "(-)" links.
    del_needs_diff: false,
    // Time, in milliseconds, that HotCat waits after a keystroke before making a request to the
    // server to get suggestions.
    suggest_delay: 100,
    // Default width, in characters, of the text input field.
    editbox_width: 40,
    // One of the engine_names above, to be used as the default suggestion engine.
    suggestions: "combined",
    // If true, always use the default engine, and never display a selector.
    fixed_search: false,
    // If false, do not display the "up" and "down" links
    use_up_down: true,
    // Default list size
    listSize: 10,
    // If true, single category changes are marked as minor edits. If false, they're not.
    single_minor: true,
    // If true, never add a page to the user's watchlist. If false, pages get added to the watchlist if
    // the user has the "Add pages I edit to my watchlist" or the "Add pages I create to my watchlist"
    // options in his or her preferences set.
    dont_add_to_watchlist: false,
    shortcuts: null,
    addShortcuts: function addShortcuts(map) {
      var _window$HotCat;
      if (!map) {
        return;
      }
      (_window$HotCat = window.HotCat).shortcuts || (_window$HotCat.shortcuts = {});
      for (var k in map) {
        // eslint-disable-next-line no-prototype-builtins
        if (!map.hasOwnProperty(k) || typeof k !== "string") {
          continue;
        }
        var v = map[k];
        if (typeof v !== "string") {
          continue;
        }
        k = k.replace(/^\s+|\s+$/g, "");
        v = v.replace(/^\s+|\s+$/g, "");
        if (!k.length || !v.length) {
          continue;
        }
        window.HotCat.shortcuts[k] = v;
      }
    }
  };

  // More backwards compatibility. We have a few places where we test for the browser: once for
  // Safari < 3.0, and twice for WebKit (Chrome or Safari, any versions)
  var ua = navigator.userAgent.toLowerCase();
  var is_webkit = /applewebkit\/\d+/.test(ua) && ua.indexOf("spoofer") < 0;
  var cat_prefix = null;
  var noSuggestions = false;
  var LoadTrigger = function LoadTrigger(needed) {
    // Define methods in a closure so that self reference is available,
    // also allows method calls to be detached.
    var self = this;
    self.queue = [];
    self.needed = needed;
    self.register = function (callback) {
      if (self.needed <= 0) {
        callback(); // Execute directly
      } else {
        self.queue.push(callback);
      }
    };
    self.loaded = function () {
      self.needed--;
      if (self.needed === 0) {
        // Run queued callbacks once
        for (var i = 0; i < self.queue.length; i++) {
          self.queue[i]();
        }
        self.queue = [];
      }
    };
  };

  // Used to delay running the HotCat setup until /local-defaults and localizations have been loaded.
  var loadTrigger = new LoadTrigger(2);
  var load = function load(uri, callback) {
    var s = document.createElement("script");
    s.src = uri;
    var called = false;
    s.onload = s.onerror = function () {
      if (!called && callback) {
        called = true;
        callback();
      }
      if (s.parentNode) {
        s.parentNode.removeChild(s);
      }
    };
    document.head.appendChild(s);
  };
  var loadJS = function loadJS(page, callback) {
    load("".concat(conf.wgServer + conf.wgScript, "?title=").concat(encodeURIComponent(page), "&action=raw&ctype=text/javascript"), callback);
  };
  var loadURI = function loadURI(href, callback) {
    var url = href;
    if (url.slice(0, 2) === "//") {
      url = window.location.protocol + url;
    } else if (url.slice(0, 1) === "/") {
      url = conf.wgServer + url;
    }
    load(url, callback);
  };

  // Load local configurations, overriding the pre-set default values in the HotCat object above. This is always loaded
  // from the wiki where this script is executing, even if this script itself is hotlinked from Commons. This can
  // be used to change the default settings, or to provide localized interface texts for edit summaries and so on.
  loadJS("MediaWiki:Gadget-HotCat-local-defaults.js", loadTrigger.loaded);

  // Load localized UI texts. These are the texts that HotCat displays on the page itself. Texts shown in edit summaries
  // should be localized in /local-defaults above.
  if (conf.wgUserLanguage !== "en") {
    // Lupo: somebody thought it would be a good idea to add this. So the default is true, and you have to set it to false
    // explicitly if you're not on Commons and don't want that.
    if (window.hotcat_translations_from_commons === undefined) {
      window.hotcat_translations_from_commons = true;
    }

    // Localization hook to localize HotCat messages, tooltips, and engine names for wgUserLanguage.
    if (window.hotcat_translations_from_commons && conf.wgServer.indexOf("//commons") < 0) {
      loadURI("".concat(mw.config.get("wgScript"), "?title=MediaWiki:Gadget-HotCat-").concat(conf.wgUserLanguage, ".js&action=raw&ctype=text/javascript"), loadTrigger.loaded);
    } else {
      // Load translations locally
      loadJS("MediaWiki:Gadget-HotCat-".concat(conf.wgUserLanguage, ".js"), loadTrigger.loaded);
    }
  } else {
    loadTrigger.loaded();
  }

  // No further changes should be necessary here.
  // The following regular expression strings are used when searching for categories in wikitext.
  var wikiTextBlank = "[\\t _\\xA0\\u1680\\u180E\\u2000-\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000]+";
  var wikiTextBlankRE = new RegExp(wikiTextBlank, "g");
  // Regexp for handling blanks inside a category title or namespace name.
  // See http://svn.wikimedia.org/viewvc/mediawiki/trunk/phase3/includes/Title.php?revision=104051&view=markup#l2722
  // See also http://www.fileformat.info/info/unicode/category/Zs/list.htm
  //   MediaWiki collapses several contiguous blanks inside a page title to one single blank. It also replace a
  // number of special whitespace characters by simple blanks. And finally, blanks are treated as underscores.
  // Therefore, when looking for page titles in wikitext, we must handle all these cases.
  //   Note: we _do_ include the horizontal tab in the above list, even though the MediaWiki software for some reason
  // appears to not handle it. The zero-width space \u200B is _not_ handled as a space inside titles by MW.
  var wikiTextBlankOrBidi = "[\\t _\\xA0\\u1680\\u180E\\u2000-\\u200B\\u200E\\u200F\\u2028-\\u202F\\u205F\\u3000]*";
  // Whitespace regexp for handling whitespace between link components. Including the horizontal tab, but not \n\r\f\v:
  // a link must be on one single line.
  //   MediaWiki also removes Unicode bidi override characters in page titles (and namespace names) completely.
  // This is *not* handled, as it would require us to allow any of [\u200E\u200F\u202A-\u202E] between any two
  // characters inside a category link. It _could_ be done though... We _do_ handle strange spaces, including the
  // zero-width space \u200B, and bidi overrides between the components of a category link (adjacent to the colon,
  // or adjacent to and inside of "[[" and "]]").
  // First auto-localize the regexps for the category and the template namespaces.
  var formattedNamespaces = conf.wgFormattedNamespaces;
  var namespaceIds = conf.wgNamespaceIds;
  var autoLocalize = function autoLocalize(namespaceNumber, fallback) {
    var createRegexpStr = function createRegexpStr(name) {
      if (!name || !name.length) {
        return "";
      }
      var regex_name = "";
      for (var i = 0; i < name.length; i++) {
        var initial = name.charAt(i),
          ll = initial.toLowerCase(),
          ul = initial.toUpperCase();
        if (ll === ul) {
          regex_name += initial;
        } else {
          regex_name += "[".concat(ll).concat(ul, "]");
        }
      }
      return regex_name.replace(/([\\^$.?*+()])/g, "\\$1").replace(wikiTextBlankRE, wikiTextBlank);
    };
    fallback = fallback.toLowerCase();
    var canonical = formattedNamespaces[String(namespaceNumber)].toLowerCase();
    var regexp = createRegexpStr(canonical);
    if (fallback && canonical !== fallback) {
      regexp += "|".concat(createRegexpStr(fallback));
    }
    if (namespaceIds) {
      for (var cat_name in namespaceIds) {
        if (typeof cat_name === "string" && cat_name.toLowerCase() !== canonical && cat_name.toLowerCase() !== fallback && namespaceIds[cat_name] === namespaceNumber) {
          regexp += "|".concat(createRegexpStr(cat_name));
        }
      }
    }
    return regexp;
  };
  HC.category_canonical = formattedNamespaces["14"];
  HC.category_regexp = autoLocalize(14, "category");
  if (formattedNamespaces["10"]) {
    HC.template_regexp = autoLocalize(10, "template");
  }

  // Utility functions. Yes, this duplicates some functionality that also exists in other places, but
  // to keep this whole stuff in a single file not depending on any other on-wiki JavaScripts, we re-do
  // these few operations here.
  var make = function make(arg, literal) {
    if (!arg) {
      return null;
    }
    return literal ? document.createTextNode(arg) : document.createElement(arg);
  };
  var param = function param(name, uri) {
    uri || (uri = document.location.href);
    var re = new RegExp("[&?]".concat(name, "=([^&#]*)"));
    var m = re.exec(uri);
    if (m && m.length > 1) {
      return decodeURIComponent(m[1]);
    }
    return null;
  };
  var title = function title(href) {
    if (!href) {
      return null;
    }
    var script = "".concat(conf.wgScript, "?");
    if (href.indexOf(script) === 0 || href.indexOf(conf.wgServer + script) === 0 || conf.wgServer.slice(0, 2) === "//" && href.indexOf(document.location.protocol + conf.wgServer + script) === 0) {
      // href="/w/index.php?title=..."
      return param("title", href);
    }
    // href="/wiki/..."
    var prefix = conf.wgArticlePath.replace("$1", "");
    if (href.indexOf(prefix)) {
      prefix = conf.wgServer + prefix;
    } // Fully expanded URL?

    if (href.indexOf(prefix) && prefix.slice(0, 2) === "//") {
      prefix = document.location.protocol + prefix;
    } // Protocol-relative wgServer?

    if (href.indexOf(prefix) === 0) {
      return decodeURIComponent(href.slice(prefix.length));
    }
    return null;
  };
  var hasClass = function hasClass(elem, name) {
    return " ".concat(elem.className, " ").indexOf(" ".concat(name, " ")) >= 0;
  };
  var capitalize = function capitalize(str) {
    if (!str || !str.length) {
      return str;
    }
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  };
  var wikiPagePath = function wikiPagePath(pageName) {
    return (
      // Note: do not simply use encodeURI, it doesn't encode '&', which might break if wgArticlePath actually has the $1 in
      // a query parameter.
      conf.wgArticlePath.replace("$1", encodeURIComponent(pageName).replace(/%3A/g, ":").replace(/%2F/g, "/"))
    );
  };
  var escapeRE = function escapeRE(str) {
    return str.replace(/([\\^$.?*+()[\]])/g, "\\$1");
  };
  var substituteFactory = function substituteFactory(options) {
    options || (options = {});
    var lead = options.indicator || "$";
    var indicator = escapeRE(lead);
    var lbrace = escapeRE(options.lbrace || "{");
    var rbrace = escapeRE(options.rbrace || "}");
    var re = new RegExp(
    // $$
    "(?:".concat(indicator, "(").concat(indicator, "))|") + // $0, $1
    "(?:".concat(indicator, "(\\d+))|") + // ${key}
    "(?:".concat(indicator, "(?:").concat(lbrace, "([^").concat(lbrace).concat(rbrace, "]+)").concat(rbrace, "))|") + // $key (only if first char after $ is not $, digit, or { )
    "(?:".concat(indicator, "(?!(?:[").concat(indicator).concat(lbrace, "]|\\d))(\\S+?)\\b)"), "g");
    // Replace $1, $2, or ${key1}, ${key2}, or $key1, $key2 by values from map. $$ is replaced by a single $.
    return function (str, map) {
      if (!map) {
        return str;
      }
      return str.replace(re, function (match, prefix, idx, key, alpha) {
        if (prefix === lead) {
          return lead;
        }
        var k = alpha || key || idx;
        var replacement = typeof map[k] === "function" ? map[k](match, k) : map[k];
        return typeof replacement === "string" ? replacement : replacement || match;
      });
    };
  };
  var substitute = substituteFactory();
  var replaceShortcuts = function () {
    var replaceHash = substituteFactory({
      indicator: "#",
      lbrace: "[",
      rbrace: "]"
    });
    return function (str, map) {
      var s = replaceHash(str, map);
      return HC.capitalizePageNames ? capitalize(s) : s;
    };
  }();

  // Text modification
  var findCatsRE = new RegExp("\\[\\[".concat(wikiTextBlankOrBidi, "(?:").concat(HC.category_regexp, ")").concat(wikiTextBlankOrBidi, ":[^\\]]+\\]\\]"), "g");
  var replaceByBlanks = function replaceByBlanks(match) {
    return match.replace(/(\s|\S)/g, " ");
  }; // /./ doesn't match linebreaks. /(\s|\S)/ does.

  var find_category = function find_category(wikitext, category, once) {
    var cat_regex = null;
    if (HC.template_categories[category]) {
      cat_regex = new RegExp("\\{\\{".concat(wikiTextBlankOrBidi, "(").concat(HC.template_regexp, "(?=").concat(wikiTextBlankOrBidi, ":))?").concat(wikiTextBlankOrBidi, "(?:").concat(HC.template_categories[category], ")").concat(wikiTextBlankOrBidi, "(\\|.*?)?\\}\\}"), "g");
    } else {
      var cat_name = escapeRE(category);
      var initial = cat_name.slice(0, 1);
      cat_regex = new RegExp("\\[\\[".concat(wikiTextBlankOrBidi, "(").concat(HC.category_regexp, ")").concat(wikiTextBlankOrBidi, ":").concat(wikiTextBlankOrBidi).concat(initial === "\\" || !HC.capitalizePageNames ? initial : "[".concat(initial.toUpperCase()).concat(initial.toLowerCase(), "]")).concat(cat_name.slice(1).replace(wikiTextBlankRE, wikiTextBlank)).concat(wikiTextBlankOrBidi, "(\\|.*?)?\\]\\]"), "g");
    }
    if (once) {
      return cat_regex.exec(wikitext);
    }
    var copiedtext = wikitext.replace(/<!--(\s|\S)*?-->/g, replaceByBlanks).replace(/<nowiki>(\s|\S)*?<\/nowiki>/g, replaceByBlanks);
    var result = [];
    var curr_match = null;
    while ((curr_match = cat_regex.exec(copiedtext)) !== null) {
      result.push({
        match: curr_match
      });
    }
    result.re = cat_regex;
    return result; // An array containing all matches, with positions, in result[ i ].match
  };

  var interlanguageRE = null;
  var change_category = function change_category(wikitext, toRemove, toAdd, key, is_hidden) {
    var find_insertionpoint = function find_insertionpoint(wikitext) {
      var copiedtext = wikitext.replace(/<!--(\s|\S)*?-->/g, replaceByBlanks).replace(/<nowiki>(\s|\S)*?<\/nowiki>/g, replaceByBlanks);
      // Search in copiedtext to avoid that we insert inside an HTML comment or a nowiki "element".
      var index = -1;
      findCatsRE.lastIndex = 0;
      while (findCatsRE.exec(copiedtext) !== null) {
        index = findCatsRE.lastIndex;
      }
      if (index < 0) {
        // Find the index of the first interlanguage link...
        var match = null;
        if (!interlanguageRE) {
          // Approximation without API: interlanguage links start with 2 to 3 lower case letters, optionally followed by
          // a sequence of groups consisting of a dash followed by one or more lower case letters. Exceptions are "simple"
          // and "tokipona".
          match = /((^|\n\r?)(\[\[\s*(([a-z]{2,3}(-[a-z]+)*)|simple|tokipona)\s*:[^\]]+\]\]\s*))+$/.exec(copiedtext);
        } else {
          match = interlanguageRE.exec(copiedtext);
        }
        if (match) {
          index = match.index;
        }
        return {
          idx: index,
          onCat: false
        };
      }
      return {
        idx: index,
        onCat: index >= 0
      };
    };
    var summary = [],
      nameSpace = HC.category_canonical,
      // Position of removed category;
      keyChange = toRemove && toAdd && toRemove === toAdd && toAdd.length;
    var matches,
      cat_point = -1;
    if (key) {
      key = "|".concat(key);
    }
    // Remove
    if (toRemove && toRemove.length) {
      matches = find_category(wikitext, toRemove);
      if (!matches || !matches.length) {
        return {
          text: wikitext,
          summary: summary,
          error: HC.messages.cat_notFound.replace(/\$1/g, toRemove)
        };
      }
      var before = wikitext.slice(0, Math.max(0, matches[0].match.index)),
        after = wikitext.slice(Math.max(0, matches[0].match.index + matches[0].match[0].length));
      if (matches.length > 1) {
        // Remove all occurrences in after
        matches.re.lastIndex = 0;
        after = after.replace(matches.re, "");
      }
      if (toAdd) {
        // nameSpace = matches[ 0 ].match[ 1 ] || nameSpace; Canonical namespace should be always preferred
        if (key === null) {
          key = matches[0].match[2];
        }
        // Remember the category key, if any.
      }
      // Remove whitespace (properly): strip whitespace, but only up to the next line feed.
      // If we then have two linefeeds in a row, remove one. Otherwise, if we have two non-
      // whitespace characters, insert a blank.
      var i = before.length - 1;
      while (i >= 0 && before.charAt(i) !== "\n" && before.slice(i, i + 1).search(/\s/) >= 0) {
        i--;
      }
      var j = 0;
      while (j < after.length && after.charAt(j) !== "\n" && after.slice(j, j + 1).search(/\s/) >= 0) {
        j++;
      }
      if (i >= 0 && before.charAt(i) === "\n" && (!after.length || j < after.length && after.charAt(j) === "\n")) {
        i--;
      }
      if (i >= 0) {
        before = before.slice(0, Math.max(0, i + 1));
      } else {
        before = "";
      }
      if (j < after.length) {
        after = after.slice(Math.max(0, j));
      } else {
        after = "";
      }
      if (before.length && before.slice(Math.max(0, before.length - 1)).search(/\S/) >= 0 && after.length && after.slice(0, 1).search(/\S/) >= 0) {
        before += " ";
      }
      cat_point = before.length;
      if (cat_point === 0 && after.length && after.slice(0, 1) === "\n") {
        after = after.slice(1);
      }
      wikitext = before + after;
      if (!keyChange) {
        if (HC.template_categories[toRemove]) {
          summary.push(HC.messages.template_removed.replace(/\$1/g, toRemove));
        } else {
          summary.push(HC.messages.cat_removed.replace(/\$1/g, toRemove));
        }
      }
    }
    // Add
    if (toAdd && toAdd.length) {
      matches = find_category(wikitext, toAdd);
      if (matches && matches.length) {
        // Already exists
        return {
          text: wikitext,
          summary: summary,
          error: HC.messages.cat_exists.replace(/\$1/g, toAdd)
        };
      }
      var onCat = false;
      if (cat_point < 0) {
        var point = find_insertionpoint(wikitext);
        cat_point = point.idx;
        onCat = point.onCat;
      } else {
        onCat = true;
      }
      var newcatstring = "[[".concat(nameSpace, ":").concat(toAdd).concat(key || "", "]]");
      if (cat_point >= 0) {
        var suffix = wikitext.slice(Math.max(0, cat_point));
        wikitext = wikitext.slice(0, Math.max(0, cat_point)) + (cat_point > 0 ? "\n" : "") + newcatstring + (!onCat ? "\n" : "");
        if (suffix.length && suffix.slice(0, 1) !== "\n") {
          wikitext += "\n".concat(suffix);
        } else {
          wikitext += suffix;
        }
      } else {
        if (wikitext.length && wikitext.slice(wikitext.length - 1, wikitext.length - 1 + 1) !== "\n") {
          wikitext += "\n";
        }
        wikitext += (wikitext.length ? "\n" : "") + newcatstring;
      }
      if (keyChange) {
        var k = key || "";
        if (k.length) {
          k = k.slice(1);
        }
        summary.push(substitute(HC.messages.cat_keychange, [null, toAdd, k]));
      } else {
        summary.push(HC.messages.cat_added.replace(/\$1/g, toAdd));
      }
      if (HC.uncat_regexp && !is_hidden) {
        var txt = wikitext.replace(HC.uncat_regexp, ""); // Remove "uncat" templates
        if (txt.length !== wikitext.length) {
          wikitext = txt;
          summary.push(HC.messages.uncat_removed);
        }
      }
    }
    return {
      text: wikitext,
      summary: summary,
      error: null
    };
  };

  // The real HotCat UI
  var evtKeys = function evtKeys(e) {
    var code = 0;
    if (e.ctrlKey) {
      // All modern browsers
      // Ctrl-click seems to be overloaded in FF/Mac (it opens a pop-up menu), so treat cmd-click
      // as a ctrl-click, too.
      if (e.ctrlKey || e.metaKey) {
        code || (code = 1);
      }
      if (e.shiftKey) {
        code || (code = 2);
      }
    }
    return code;
  };
  var evtKill = function evtKill(e) {
    if (e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
    return false;
  };
  var catLine = null,
    onUpload = false,
    editors = [],
    commitButton = null,
    commitForm = null,
    multiSpan = null,
    pageText = null,
    pageTime = null,
    pageWatched = false,
    watchCreate = false,
    watchEdit = false,
    minorEdits = false,
    editToken = null,
    is_rtl = false,
    serverTime = null,
    lastRevId = null,
    pageTextRevId = null,
    conflictingUser = null,
    newDOM = false; // true if MediaWiki serves the new UL-LI DOM for categories

  var CategoryEditor = function CategoryEditor() {
    this.initialize.apply(this, arguments);
  };
  var setPage = function setPage(json) {
    var startTime = null;
    if (json && json.query) {
      if (json.query.pages) {
        var page = json.query.pages[!conf.wgArticleId ? "-1" : String(conf.wgArticleId)];
        if (page) {
          if (page.revisions && page.revisions.length) {
            // Revisions are sorted by revision ID, hence [ 0 ] is the one we asked for, and possibly there's a [ 1 ] if we're
            // not on the latest revision (edit conflicts and such).
            pageText = page.revisions[0]["*"];
            if (page.revisions[0].timestamp) {
              pageTime = page.revisions[0].timestamp.replace(/\D/g, "");
            }
            if (page.revisions[0].revid) {
              pageTextRevId = page.revisions[0].revid;
            }
            if (page.revisions.length > 1) {
              conflictingUser = page.revisions[1].user;
            }
          }
          if (page.lastrevid) {
            lastRevId = page.lastrevid;
          }
          if (page.starttimestamp) {
            startTime = page.starttimestamp.replace(/\D/g, "");
          }
          pageWatched = typeof page.watched === "string";
          if (json.query.tokens) {
            editToken = json.query.tokens.csrftoken;
          }
          if (page.langlinks && (!json["query-continue"] || !json["query-continue"].langlinks)) {
            // We have interlanguage links, and we got them all.
            var re = "";
            for (var i = 0; i < page.langlinks.length; i++) {
              re += (i > 0 ? "|" : "") + page.langlinks[i].lang.replace(/([\\^$.?*+()])/g, "\\$1");
            }
            if (re.length) {
              interlanguageRE = new RegExp("((^|\\n\\r?)(\\[\\[\\s*(".concat(re, ")\\s*:[^\\]]+\\]\\]\\s*))+$"));
            }
          }
        }
      }
      // Siteinfo
      if (json.query.general) {
        if (json.query.general.time && !startTime) {
          startTime = json.query.general.time.replace(/\D/g, "");
        }
        if (HC.capitalizePageNames === null) {
          // ResourceLoader's JSParser doesn't like .case, so override eslint.
          // eslint-disable-next-line dot-notation
          HC.capitalizePageNames = json.query.general["case"] === "first-letter";
        }
      }
      serverTime = startTime;
      // Userinfo
      if (json.query.userinfo && json.query.userinfo.options) {
        watchCreate = !HC.dont_add_to_watchlist && json.query.userinfo.options.watchcreations === "1";
        watchEdit = !HC.dont_add_to_watchlist && json.query.userinfo.options.watchdefault === "1";
        minorEdits = json.query.userinfo.options.minordefault === 1;
        // If the user has the "All edits are minor" preference enabled, we should honor that
        // for single category changes, no matter what the site configuration is.
        if (minorEdits) {
          HC.single_minor = true;
        }
      }
    }
  };
  var saveInProgress = false;
  var initiateEdit = function initiateEdit(doEdit, failure) {
    if (saveInProgress) {
      return;
    }
    saveInProgress = true;
    var oldButtonState;
    if (commitButton) {
      oldButtonState = commitButton.disabled;
      commitButton.disabled = true;
    }
    var fail = function fail() {
      saveInProgress = false;
      if (commitButton) {
        commitButton.disabled = oldButtonState;
      }
      failure.apply(this, arguments);
    };

    // Must use Ajax here to get the user options and the edit token.
    $.getJSON("".concat(conf.wgServer + conf.wgScriptPath, "/api.php?format=json&action=query&rawcontinue=&titles=").concat(encodeURIComponent(conf.wgPageName), "&prop=info%7Crevisions%7Clanglinks&inprop=watched&rvprop=content%7Ctimestamp%7Cids%7Cuser&lllimit=500&rvlimit=2&rvdir=newer&rvstartid=").concat(conf.wgCurRevisionId, "&meta=siteinfo%7Cuserinfo%7Ctokens&type=csrf&uiprop=options"), function (json) {
      setPage(json);
      doEdit(fail);
    }).fail(function (req) {
      fail("".concat(req.status, " ").concat(req.statusText));
    });
  };
  var multiChangeMsg = function multiChangeMsg(count) {
    var msg = HC.messages.multi_change;
    if (typeof msg !== "string" && msg.length) {
      if (mw.language && mw.language.convertPlural) {
        msg = mw.language.convertPlural(count, msg);
      } else {
        msg = msg[msg.length - 1];
      }
    }
    return substitute(msg, [null, String(count)]);
  };
  var currentTimestamp = function currentTimestamp() {
    var now = new Date();
    var ts = String(now.getUTCFullYear());
    var two = function two(s) {
      return s.slice(s.length - 2);
    };
    ts += two("0".concat(now.getUTCMonth() + 1)) + two("0".concat(now.getUTCDate())) + two("00".concat(now.getUTCHours())) + two("00".concat(now.getUTCMinutes())) + two("00".concat(now.getUTCSeconds()));
    return ts;
  };
  var performChanges = function performChanges(failure, singleEditor) {
    if (pageText === null) {
      failure(HC.messages.multi_error);
      return;
    }
    // Backwards compatibility after message change (added $2 to cat_keychange)
    if (HC.messages.cat_keychange.indexOf("$2") < 0) {
      HC.messages.cat_keychange += '"$2"';
    }

    // More backwards-compatibility with earlier HotCat versions:
    if (!HC.messages.short_catchange) {
      HC.messages.short_catchange = "[[".concat(HC.category_canonical, ":$1]]");
    }

    // Create a form and submit it. We don't use the edit API (api.php?action=edit) because
    // (a) sensibly reporting back errors like edit conflicts is always a hassle, and
    // (b) we want to show a diff for multi-edits anyway, and
    // (c) we want to trigger onsubmit events, allowing user code to intercept the edit.
    // Using the form, we can do (b) and (c), and we get (a) for free. And, of course, using the form
    // automatically reloads the page with the updated categories on a successful submit, which
    // we would have to do explicitly if we used the edit API.
    var action;
    // Normally, we don't have to care about edit conflicts. If some other user edited the page in the meantime, the
    // server will take care of it and merge the edit automatically or present an edit conflict screen. However, the
    // server suppresses edit conflicts with oneself. Hence, if we have a conflict, and the conflicting user is the
    // current user, then we set the "oldid" value and switch to diff, which gives the "you are editing an old version;
    // if you save, any more recent changes will be lost" screen.
    var selfEditConflict = (lastRevId !== null && lastRevId !== conf.wgCurRevisionId || pageTextRevId !== null && pageTextRevId !== conf.wgCurRevisionId) && conflictingUser && conflictingUser === conf.wgUserName;
    if (singleEditor && !singleEditor.noCommit && !HC.no_autocommit && editToken && !selfEditConflict) {
      // If we do have an edit conflict, but not with ourself, that's no reason not to attempt to save: the server side may actually be able to
      // merge the changes. We just need to make sure that we do present a diff view if it's a self edit conflict.
      commitForm.wpEditToken.value = editToken;
      action = commitForm.wpDiff;
      if (action) {
        action.name = action.value = "wpSave";
      }
    } else {
      action = commitForm.wpSave;
      if (action) {
        action.name = action.value = "wpDiff";
      }
    }
    var result = {
      text: pageText
    };
    var changed = [],
      added = [],
      deleted = [],
      toEdit = singleEditor ? [singleEditor] : editors;
    var edit,
      i,
      error = null,
      changes = 0;
    for (i = 0; i < toEdit.length; i++) {
      edit = toEdit[i];
      if (edit.state === CategoryEditor.CHANGED) {
        result = change_category(result.text, edit.originalCategory, edit.currentCategory, edit.currentKey, edit.currentHidden);
        if (!result.error) {
          changes++;
          if (!edit.originalCategory || !edit.originalCategory.length) {
            added.push(edit.currentCategory);
          } else {
            changed.push({
              from: edit.originalCategory,
              to: edit.currentCategory
            });
          }
        } else if (error === null) {
          error = result.error;
        }
      } else if (edit.state === CategoryEditor.DELETED && edit.originalCategory && edit.originalCategory.length) {
        result = change_category(result.text, edit.originalCategory, null, null, false);
        if (!result.error) {
          changes++;
          deleted.push(edit.originalCategory);
        } else if (error === null) {
          error = result.error;
        }
      }
    }
    if (error !== null) {
      // Do not commit if there were errors
      action = commitForm.wpSave;
      if (action) {
        action.name = action.value = "wpDiff";
      }
    }
    // Fill in the form and submit it
    commitForm.wpMinoredit.checked = minorEdits;
    commitForm.wpWatchthis.checked = !conf.wgArticleId && watchCreate || watchEdit || pageWatched;
    if (conf.wgArticleId || !!singleEditor) {
      // Prepare change-tag save
      if (action && action.value === "wpSave") {
        if (HC.changeTag) {
          commitForm.wpChangeTags.value = HC.changeTag;
          HC.messages.using = "";
          HC.messages.prefix = "";
        }
      } else {
        commitForm.wpAutoSummary.value = HC.changeTag;
      }
      if (changes === 1) {
        if (result.summary && result.summary.length) {
          commitForm.wpSummary.value = HC.messages.prefix + result.summary.join(HC.messages.separator) + HC.messages.using;
        }
        commitForm.wpMinoredit.checked = HC.single_minor || minorEdits;
      } else if (changes) {
        var summary = [];
        var shortSummary = [];
        // Deleted
        for (i = 0; i < deleted.length; i++) {
          summary.push("\u2212".concat(substitute(HC.messages.short_catchange, [null, deleted[i]])));
        }
        if (deleted.length === 1) {
          shortSummary.push("\u2212".concat(substitute(HC.messages.short_catchange, [null, deleted[0]])));
        } else if (deleted.length) {
          shortSummary.push("\u2212 ".concat(multiChangeMsg(deleted.length)));
        }
        // Added
        for (i = 0; i < added.length; i++) {
          summary.push("+".concat(substitute(HC.messages.short_catchange, [null, added[i]])));
        }
        if (added.length === 1) {
          shortSummary.push("+".concat(substitute(HC.messages.short_catchange, [null, added[0]])));
        } else if (added.length) {
          shortSummary.push("+ ".concat(multiChangeMsg(added.length)));
        }
        // Changed
        var arrow = is_rtl ? "\u2190" : "\u2192"; // left and right arrows. Don't use ← and → in the code.
        for (i = 0; i < changed.length; i++) {
          if (changed[i].from !== changed[i].to) {
            summary.push("\xB1".concat(substitute(HC.messages.short_catchange, [null, changed[i].from])).concat(arrow).concat(substitute(HC.messages.short_catchange, [null, changed[i].to])));
          } else {
            summary.push("\xB1".concat(substitute(HC.messages.short_catchange, [null, changed[i].from])));
          }
        }
        if (changed.length === 1) {
          if (changed[0].from !== changed[0].to) {
            shortSummary.push("\xB1".concat(substitute(HC.messages.short_catchange, [null, changed[0].from])).concat(arrow).concat(substitute(HC.messages.short_catchange, [null, changed[0].to])));
          } else {
            shortSummary.push("\xB1".concat(substitute(HC.messages.short_catchange, [null, changed[0].from])));
          }
        } else if (changed.length) {
          shortSummary.push("\xB1 ".concat(multiChangeMsg(changed.length)));
        }
        if (summary.length) {
          summary = summary.join(HC.messages.separator);
          if (summary.length > 200 - HC.messages.prefix.length - HC.messages.using.length) {
            summary = shortSummary.join(HC.messages.separator);
          }
          commitForm.wpSummary.value = HC.messages.prefix + summary + HC.messages.using;
        }
      }
    }
    commitForm.wpTextbox1.value = result.text;
    commitForm.wpStarttime.value = serverTime || currentTimestamp();
    commitForm.wpEdittime.value = pageTime || commitForm.wpStarttime.value;
    if (selfEditConflict) {
      commitForm.oldid.value = String(pageTextRevId || conf.wgCurRevisionId);
    }

    // Submit the form in a way that triggers onsubmit events: commitForm.submit() doesn't.
    commitForm.hcCommit.click();
  };
  var resolveOne = function resolveOne(page, toResolve) {
    var cats = page.categories,
      lks = page.links;
    var is_dab = false,
      is_redir = typeof page.redirect === "string",
      i; // Hard redirect?
    var is_hidden = page.categoryinfo && typeof page.categoryinfo.hidden === "string",
      is_missing = typeof page.missing === "string";
    for (i = 0; i < toResolve.length; i++) {
      if (i && toResolve[i].dabInputCleaned !== page.title.slice(Math.max(0, page.title.indexOf(":") + 1))) {
        continue;
      }
      // Note: the server returns in page an NFC normalized Unicode title. If our input was not NFC normalized, we may not find
      // any entry here. If we have only one editor to resolve (the most common case, I presume), we may simply skip the check.
      toResolve[i].currentHidden = is_hidden;
      toResolve[i].inputExists = !is_missing;
      toResolve[i].icon.src = is_missing ? HC.existsNo : HC.existsYes;
    }
    if (is_missing) {
      return;
    }
    if (!is_redir && cats && (HC.disambig_category || HC.redir_category)) {
      for (var c = 0; c < cats.length; c++) {
        var cat = cats[c].title;
        // Strip namespace prefix
        if (cat) {
          cat = cat.slice(Math.max(0, cat.indexOf(":") + 1)).replace(/_/g, " ");
          if (cat === HC.disambig_category) {
            is_dab = true;
            break;
          } else if (cat === HC.redir_category) {
            is_redir = true;
            break;
          }
        }
      }
    }
    if (!is_redir && !is_dab) {
      return;
    }
    if (!lks || !lks.length) {
      return;
    }
    var titles = [];
    for (i = 0; i < lks.length; i++) {
      if (
      // Category namespace -- always true since we ask only for the category links
      lks[i].ns === 14 &&
      // Name not empty
      lks[i].title && lks[i].title.length) {
        // Internal link to existing thingy. Extract the page name and remove the namespace.
        var match = lks[i].title;
        match = match.slice(Math.max(0, match.indexOf(":") + 1));
        // Exclude blacklisted categories.
        if (!HC.blacklist || !HC.blacklist.test(match)) {
          titles.push(match);
        }
      }
    }
    if (!titles.length) {
      return;
    }
    for (i = 0; i < toResolve.length; i++) {
      if (i && toResolve[i].dabInputCleaned !== page.title.slice(Math.max(0, page.title.indexOf(":") + 1))) {
        continue;
      }
      toResolve[i].inputExists = true; // Might actually be wrong if it's a redirect pointing to a non-existing category
      toResolve[i].icon.src = HC.existsYes;
      if (titles.length > 1) {
        toResolve[i].dab = titles;
      } else {
        toResolve[i].text.value = titles[0] + (toResolve[i].currentKey !== null ? "|".concat(toResolve[i].currentKey) : "");
      }
    }
  };
  var resolveRedirects = function resolveRedirects(toResolve, params) {
    if (!params || !params.query || !params.query.pages) {
      return;
    }
    for (var p in params.query.pages) {
      if (Object.prototype.hasOwnProperty.call(params.query.pages, p)) {
        resolveOne(params.query.pages[p], toResolve);
      }
    }
  };
  var resolveMulti = function resolveMulti(toResolve, callback) {
    var i;
    for (i = 0; i < toResolve.length; i++) {
      toResolve[i].dab = null;
      toResolve[i].dabInput = toResolve[i].lastInput;
    }
    if (noSuggestions) {
      callback(toResolve);
      return;
    }
    // Use %7C instead of |, otherwise Konqueror insists on re-encoding the arguments, resulting in doubly encoded
    // category names. (That is a bug in Konqueror. Other browsers don't have this problem.)
    var args = "action=query&prop=info%7Clinks%7Ccategories%7Ccategoryinfo&plnamespace=14&pllimit=".concat(toResolve.length * 10, "&cllimit=").concat(toResolve.length * 10, "&format=json&titles=");
    for (i = 0; i < toResolve.length; i++) {
      var v = toResolve[i].dabInput;
      v = replaceShortcuts(v, HC.shortcuts);
      toResolve[i].dabInputCleaned = v;
      args += encodeURIComponent("Category:".concat(v));
      if (i + 1 < toResolve.length) {
        args += "%7C";
      }
    }
    $.getJSON("".concat(conf.wgServer + conf.wgScriptPath, "/api.php?").concat(args), function (json) {
      resolveRedirects(toResolve, json);
      callback(toResolve);
    }).fail(function (req) {
      if (!req) {
        noSuggestions = true;
      }
      callback(toResolve);
    });
  };
  var makeActive = function makeActive(which) {
    if (which.is_active) {
      return;
    }
    for (var i = 0; i < editors.length; i++) {
      if (editors[i] !== which) {
        editors[i].inactivate();
      }
    }
    which.is_active = true;
    if (which.dab) {
      showDab(which);
    } else {
      // Check for programmatic value changes.
      var expectedInput = which.lastRealInput || which.lastInput || "";
      var actualValue = which.text.value || "";
      if (!expectedInput.length && actualValue.length || expectedInput.length && actualValue.indexOf(expectedInput)) {
        // Somehow the field's value appears to have changed, and which.lastSelection therefore is no longer valid. Try to set the
        // cursor at the end of the category, and do not display the old suggestion list.
        which.showsList = false;
        var v = actualValue.split("|");
        which.lastRealInput = which.lastInput = v[0];
        if (v.length > 1) {
          which.currentKey = v[1];
        }
        if (which.lastSelection) {
          which.lastSelection = {
            start: v[0].length,
            end: v[0].length
          };
        }
      }
      if (which.showsList) {
        which.displayList();
      }
      if (which.lastSelection) {
        if (is_webkit) {
          // WebKit (Safari, Chrome) has problems selecting inside focus()
          // See http://code.google.com/p/chromium/issues/detail?id=32865#c6
          window.setTimeout(function () {
            which.setSelection(which.lastSelection.start, which.lastSelection.end);
          }, 1);
        } else {
          which.setSelection(which.lastSelection.start, which.lastSelection.end);
        }
      }
    }
  };
  var showDab = function showDab(which) {
    if (!which.is_active) {
      makeActive(which);
    } else {
      which.showSuggestions(which.dab, false, null, null); // do autocompletion, no key, no engine selector
      which.dab = null;
    }
  };
  var multiSubmit = function multiSubmit() {
    var toResolve = [];
    for (var i = 0; i < editors.length; i++) {
      if (editors[i].state === CategoryEditor.CHANGE_PENDING || editors[i].state === CategoryEditor.OPEN) {
        toResolve.push(editors[i]);
      }
    }
    if (!toResolve.length) {
      initiateEdit(function (failure) {
        performChanges(failure);
      }, function (msg) {
        alert(msg);
      });
      return;
    }
    resolveMulti(toResolve, function (resolved) {
      var firstDab = null;
      var dontChange = false;
      for (var _i2 = 0; _i2 < resolved.length; _i2++) {
        if (resolved[_i2].lastInput !== resolved[_i2].dabInput) {
          // We didn't disable all the open editors, but we did asynchronous calls. It is
          // theoretically possible that the user changed something...
          dontChange = true;
        } else {
          if (resolved[_i2].dab) {
            if (!firstDab) {
              firstDab = resolved[_i2];
            }
          } else {
            if (resolved[_i2].acceptCheck(true)) {
              resolved[_i2].commit();
            }
          }
        }
      }
      if (firstDab) {
        showDab(firstDab);
      } else if (!dontChange) {
        initiateEdit(function (failure) {
          performChanges(failure);
        }, function (msg) {
          alert(msg);
        });
      }
    });
  };
  var setMultiInput = function setMultiInput() {
    if (commitButton || onUpload) {
      return;
    }
    commitButton = make("input");
    commitButton.type = "button";
    commitButton.value = HC.messages.commit;
    commitButton.onclick = multiSubmit;
    if (multiSpan) {
      multiSpan.parentNode.replaceChild(commitButton, multiSpan);
    } else {
      catLine.appendChild(commitButton);
    }
  };
  var checkMultiInput = function checkMultiInput() {
    if (!commitButton) {
      return;
    }
    var hasChanges = false;
    for (var i = 0; i < editors.length; i++) {
      if (editors[i].state !== CategoryEditor.UNCHANGED) {
        hasChanges = true;
        break;
      }
    }
    commitButton.disabled = !hasChanges;
  };
  var suggestionEngines = {
    opensearch: {
      uri: "/api.php?format=json&action=opensearch&namespace=14&limit=30&search=Category:$1",
      // $1 = search term
      // Function to convert result of uri into an array of category names
      handler: function handler(queryResult, queryKey) {
        if (queryResult && queryResult.length >= 2) {
          var key = queryResult[0].slice(Math.max(0, queryResult[0].indexOf(":") + 1));
          var titles = queryResult[1];
          var exists = false;
          if (!cat_prefix) {
            cat_prefix = new RegExp("^(".concat(HC.category_regexp, "):"));
          }
          for (var i = 0; i < titles.length; i++) {
            cat_prefix.lastIndex = 0;
            var m = cat_prefix.exec(titles[i]);
            if (m && m.length > 1) {
              titles[i] = titles[i].slice(Math.max(0, titles[i].indexOf(":") + 1)); // rm namespace
              if (key === titles[i]) {
                exists = true;
              }
            } else {
              titles.splice(i, 1); // Nope, it's not a category after all.
              i--;
            }
          }
          titles.exists = exists;
          if (queryKey !== key) {
            titles.normalized = key;
          }
          // Remember the NFC normalized key we got back from the server
          return titles;
        }
        return null;
      }
    },
    internalsearch: {
      uri: "/api.php?format=json&action=query&list=allpages&apnamespace=14&aplimit=30&apfrom=$1&apprefix=$1",
      handler: function handler(queryResult) {
        if (queryResult && queryResult.query && queryResult.query.allpages) {
          var titles = queryResult.query.allpages;
          for (var i = 0; i < titles.length; i++) {
            titles[i] = titles[i].title.slice(Math.max(0, titles[i].title.indexOf(":") + 1));
          } // rm namespace

          return titles;
        }
        return null;
      }
    },
    exists: {
      uri: "/api.php?format=json&action=query&prop=info&titles=Category:$1",
      handler: function handler(queryResult, queryKey) {
        if (queryResult && queryResult.query && queryResult.query.pages && !queryResult.query.pages[-1]) {
          // Should have exactly 1
          for (var p in queryResult.query.pages) {
            if (Object.prototype.hasOwnProperty.call(queryResult.query.pages, p)) {
              var _title = queryResult.query.pages[p].title;
              _title = _title.slice(Math.max(0, _title.indexOf(":") + 1));
              var titles = [_title];
              titles.exists = true;
              if (queryKey !== _title) {
                titles.normalized = _title;
              }
              // NFC
              return titles;
            }
          }
        }
        return null;
      }
    },
    subcategories: {
      uri: "/api.php?format=json&action=query&list=categorymembers&cmtype=subcat&cmlimit=max&cmtitle=Category:$1",
      handler: function handler(queryResult) {
        if (queryResult && queryResult.query && queryResult.query.categorymembers) {
          var titles = queryResult.query.categorymembers;
          for (var i = 0; i < titles.length; i++) {
            titles[i] = titles[i].title.slice(Math.max(0, titles[i].title.indexOf(":") + 1));
          } // rm namespace

          return titles;
        }
        return null;
      }
    },
    parentcategories: {
      uri: "/api.php?format=json&action=query&prop=categories&titles=Category:$1&cllimit=max",
      handler: function handler(queryResult) {
        if (queryResult && queryResult.query && queryResult.query.pages) {
          for (var p in queryResult.query.pages) {
            if (queryResult.query.pages[p].categories) {
              var titles = queryResult.query.pages[p].categories;
              for (var i = 0; i < titles.length; i++) {
                titles[i] = titles[i].title.slice(Math.max(0, titles[i].title.indexOf(":") + 1));
              } // rm namespace

              return titles;
            }
          }
        }
        return null;
      }
    }
  };
  var suggestionConfigs = {
    searchindex: {
      name: "Search index",
      engines: ["opensearch"],
      cache: {},
      show: true,
      temp: false,
      noCompletion: false
    },
    pagelist: {
      name: "Page list",
      engines: ["internalsearch", "exists"],
      cache: {},
      show: true,
      temp: false,
      noCompletion: false
    },
    combined: {
      name: "Combined search",
      engines: ["opensearch", "internalsearch"],
      cache: {},
      show: true,
      temp: false,
      noCompletion: false
    },
    subcat: {
      name: "Subcategories",
      engines: ["subcategories"],
      cache: {},
      show: true,
      temp: true,
      noCompletion: true
    },
    parentcat: {
      name: "Parent categories",
      engines: ["parentcategories"],
      cache: {},
      show: true,
      temp: true,
      noCompletion: true
    }
  };
  CategoryEditor.UNCHANGED = 0;
  CategoryEditor.OPEN = 1; // Open, but no input yet
  CategoryEditor.CHANGE_PENDING = 2; // Open, some input made
  CategoryEditor.CHANGED = 3;
  CategoryEditor.DELETED = 4;

  // Support: IE6
  // IE6 sometimes forgets to redraw the list when editors are opened or closed.
  // Adding/removing a dummy element helps, at least when opening editors.
  var dummyElement = make("\xa0", true);
  var forceRedraw = function forceRedraw() {
    if (dummyElement.parentNode) {
      document.documentElement.getElementsByTagName("body")[0].removeChild(dummyElement);
    } else {
      document.documentElement.getElementsByTagName("body")[0].appendChild(dummyElement);
    }
  };

  // Event keyCodes that we handle in the text input field/suggestion list.
  var BS = 8,
    TAB = 9,
    RET = 13,
    ESC = 27,
    SPACE = 32,
    PGUP = 33,
    PGDOWN = 34,
    UP = 38,
    DOWN = 40,
    DEL = 46,
    IME = 229;
  CategoryEditor.prototype = {
    initialize: function initialize(line, span, after, key, is_hidden) {
      // If a span is given, 'after' is the category title, otherwise it may be an element after which to
      // insert the new span. 'key' is likewise overloaded; if a span is given, it is the category key (if
      // known), otherwise it is a boolean indicating whether a bar shall be prepended.
      if (!span) {
        this.isAddCategory = true;
        // Create add span and append to catLinks
        this.originalCategory = "";
        this.originalKey = null;
        this.originalExists = false;
        if (!newDOM) {
          span = make("span");
          span.className = "noprint";
          if (key) {
            span.appendChild(make(" | ", true));
            if (after) {
              after.parentNode.insertBefore(span, after.nextSibling);
              after = after.nextSibling;
            } else if (line) {
              line.appendChild(span);
            }
          } else if (line && line.firstChild) {
            span.appendChild(make(" ", true));
            line.appendChild(span);
          }
        }
        this.linkSpan = make("span");
        this.linkSpan.className = "noprint nopopups hotcatlink";
        var lk = make("a");
        lk.href = "#catlinks";
        lk.onclick = this.open.bind(this);
        lk.appendChild(make(HC.links.add, true));
        lk.title = HC.tooltips.add;
        this.linkSpan.appendChild(lk);
        span = make(newDOM ? "li" : "span");
        span.className = "noprint";
        if (is_rtl) {
          span.dir = "rtl";
        }
        span.appendChild(this.linkSpan);
        if (after) {
          after.parentNode.insertBefore(span, after.nextSibling);
        } else if (line) {
          line.appendChild(span);
        }
        this.normalLinks = null;
        this.undelLink = null;
        this.catLink = null;
      } else {
        if (is_rtl) {
          span.dir = "rtl";
        }
        this.isAddCategory = false;
        this.catLink = span.firstChild;
        this.originalCategory = after;
        this.originalKey = key && key.length > 1 ? key.slice(1) : null; // > 1 because it includes the leading bar
        this.originalExists = !hasClass(this.catLink, "new");
        // Create change and del links
        this.makeLinkSpan();
        if (!this.originalExists && this.upDownLinks) {
          this.upDownLinks.style.display = "none";
        }
        span.appendChild(this.linkSpan);
      }
      this.originalHidden = is_hidden;
      this.line = line;
      this.engine = HC.suggestions;
      this.span = span;
      this.currentCategory = this.originalCategory;
      this.currentExists = this.originalExists;
      this.currentHidden = this.originalHidden;
      this.currentKey = this.originalKey;
      this.state = CategoryEditor.UNCHANGED;
      this.lastSavedState = CategoryEditor.UNCHANGED;
      this.lastSavedCategory = this.originalCategory;
      this.lastSavedKey = this.originalKey;
      this.lastSavedExists = this.originalExists;
      this.lastSavedHidden = this.originalHidden;
      if (this.catLink && this.currentKey) {
        this.catLink.title = this.currentKey;
      }
      editors[editors.length] = this;
    },
    makeLinkSpan: function makeLinkSpan() {
      this.normalLinks = make("span");
      var lk = null;
      if (this.originalCategory && this.originalCategory.length) {
        lk = make("a");
        lk.href = "#catlinks";
        lk.onclick = this.remove.bind(this);
        lk.appendChild(make(HC.links.remove, true));
        lk.title = HC.tooltips.remove;
        this.normalLinks.appendChild(make(" ", true));
        this.normalLinks.appendChild(lk);
      }
      if (!HC.template_categories[this.originalCategory]) {
        lk = make("a");
        lk.href = "#catlinks";
        lk.onclick = this.open.bind(this);
        lk.appendChild(make(HC.links.change, true));
        lk.title = HC.tooltips.change;
        this.normalLinks.appendChild(make(" ", true));
        this.normalLinks.appendChild(lk);
        if (!noSuggestions && HC.use_up_down) {
          this.upDownLinks = make("span");
          lk = make("a");
          lk.href = "#catlinks";
          lk.onclick = this.down.bind(this);
          lk.appendChild(make(HC.links.down, true));
          lk.title = HC.tooltips.down;
          this.upDownLinks.appendChild(make(" ", true));
          this.upDownLinks.appendChild(lk);
          lk = make("a");
          lk.href = "#catlinks";
          lk.onclick = this.up.bind(this);
          lk.appendChild(make(HC.links.up, true));
          lk.title = HC.tooltips.up;
          this.upDownLinks.appendChild(make(" ", true));
          this.upDownLinks.appendChild(lk);
          this.normalLinks.appendChild(this.upDownLinks);
        }
      }
      this.linkSpan = make("span");
      this.linkSpan.className = "noprint nopopups hotcatlink";
      this.linkSpan.appendChild(this.normalLinks);
      this.undelLink = make("span");
      this.undelLink.className = "nopopups hotcatlink";
      this.undelLink.style.display = "none";
      lk = make("a");
      lk.href = "#catlinks";
      lk.onclick = this.restore.bind(this);
      lk.appendChild(make(HC.links.restore, true));
      lk.title = HC.tooltips.restore;
      this.undelLink.appendChild(make(" ", true));
      this.undelLink.appendChild(lk);
      this.linkSpan.appendChild(this.undelLink);
    },
    invokeSuggestions: function invokeSuggestions(dont_autocomplete) {
      if (this.engine && suggestionConfigs[this.engine] && suggestionConfigs[this.engine].temp && !dont_autocomplete) {
        this.engine = HC.suggestions;
      } // Reset to a search upon input

      this.state = CategoryEditor.CHANGE_PENDING;
      var self = this;
      window.setTimeout(function () {
        self.textchange(dont_autocomplete);
      }, HC.suggest_delay);
    },
    makeForm: function makeForm() {
      var form = make("form");
      form.method = "POST";
      form.onsubmit = this.accept.bind(this);
      this.form = form;
      var self = this;
      var text = make("input");
      text.type = "text";
      text.size = HC.editbox_width;
      if (!noSuggestions) {
        // Be careful here to handle IME input. This is browser/OS/IME dependent, but basically there are two mechanisms:
        // - Modern (DOM Level 3) browsers use compositionstart/compositionend events to signal composition; if the
        //   composition is not canceled, there'll be a textInput event following. During a composition key events are
        //   either all suppressed (FF/Gecko), or otherwise have keyDown === IME for all keys (Webkit).
        //   - Webkit sends a textInput followed by keyDown === IME and a keyUp with the key that ended composition.
        //   - Gecko doesn't send textInput but just a keyUp with the key that ended composition, without sending keyDown
        //     first. Gecko doesn't send any keydown while IME is active.
        // - Older browsers signal composition by keyDown === IME for the first and subsequent keys for a composition. The
        //   first keyDown !== IME is certainly after the end of the composition. Typically, composition end can also be
        //   detected by a keyDown IME with a keyUp of space, tab, escape, or return.
        text.onkeyup = function (evt) {
          var key = evt.keyCode || 0;
          if (self.ime && self.lastKey === IME && !self.usesComposition && (key === TAB || key === RET || key === ESC || key === SPACE)) {
            self.ime = false;
          }
          if (self.ime) {
            return true;
          }
          if (key === UP || key === DOWN || key === PGUP || key === PGDOWN) {
            // In case a browser doesn't generate keypress events for arrow keys...
            if (self.keyCount === 0) {
              return self.processKey(evt);
            }
          } else {
            if (key === ESC && self.lastKey !== IME) {
              if (!self.resetKeySelection()) {
                // No undo of key selection: treat ESC as "cancel".
                self.cancel();
                return;
              }
            }
            // Also do this for ESC as a workaround for Firefox bug 524360
            // https://bugzilla.mozilla.org/show_bug.cgi?id=524360
            self.invokeSuggestions(key === BS || key === DEL || key === ESC);
          }
          return true;
        };
        text.onkeydown = function (evt) {
          var key = evt.keyCode || 0;
          self.lastKey = key;
          self.keyCount = 0;
          // DOM Level < 3 IME input
          if (!self.ime && key === IME && !self.usesComposition) {
            // self.usesComposition catches browsers that may emit spurious keydown IME after a composition has ended
            self.ime = true;
          } else if (self.ime && key !== IME && !(key >= 16 && key <= 20 || key >= 91 && key <= 93 || key === 144)) {
            // Ignore control keys: ctrl, shift, alt, alt gr, caps lock, windows/apple cmd keys, num lock. Only the windows keys
            // terminate IME (apple cmd doesn't), but they also cause a blur, so it's OK to ignore them here.
            // Note: Safari 4 (530.17) propagates ESC out of an IME composition (observed at least on Win XP).
            self.ime = false;
          }
          if (self.ime) {
            return true;
          }

          // Handle return explicitly, to override the default form submission to be able to check for ctrl
          if (key === RET) {
            return self.accept(evt);
          }

          // Inhibit default behavior of ESC (revert to last real input in FF: we do that ourselves)
          return key === ESC ? evtKill(evt) : true;
        };
        // And handle continued pressing of arrow keys
        text.onkeypress = function (evt) {
          self.keyCount++;
          return self.processKey(evt);
        };
        $(text).on("focus", function () {
          makeActive(self);
        });
        // On IE, blur events are asynchronous, and may thus arrive after the element has lost the focus. Since IE
        // can get the selection only while the element is active (has the focus), we may not always get the selection.
        // Therefore, use an IE-specific synchronous event on IE...
        // Don't test for text.selectionStart being defined;
        $(text).on(text.onbeforedeactivate !== undefined && text.createTextRange ? "beforedeactivate" : "blur", this.saveView.bind(this));
        // DOM Level 3 IME handling
        try {
          // Setting lastKey = IME provides a fake keyDown for Gecko's single keyUp after a cmposition. If we didn't do this,
          // cancelling a composition via ESC would also cancel and close the whole category input editor.
          $(text).on("compositionstart", function () {
            self.lastKey = IME;
            self.usesComposition = true;
            self.ime = true;
          });
          $(text).on("compositionend", function () {
            self.lastKey = IME;
            self.usesComposition = true;
            self.ime = false;
          });
          $(text).on("textInput", function () {
            self.ime = false;
            self.invokeSuggestions(false);
          });
        } catch (any) {
          // Just in case some browsers might produce exceptions with these DOM Level 3 events
        }
        $(text).on("blur", function () {
          self.usesComposition = false;
          self.ime = false;
        });
      }
      this.text = text;
      this.icon = make("img");
      var list = null;
      if (!noSuggestions) {
        list = make("select");
        list.onclick = function () {
          if (self.highlightSuggestion(0)) {
            self.textchange(false, true);
          }
        };
        list.ondblclick = function (e) {
          if (self.highlightSuggestion(0)) {
            self.accept(e);
          }
        };
        list.onchange = function () {
          self.highlightSuggestion(0);
          self.text.focus();
        };
        list.onkeyup = function (evt) {
          if (evt.keyCode === ESC) {
            self.resetKeySelection();
            self.text.focus();
            window.setTimeout(function () {
              self.textchange(true);
            }, HC.suggest_delay);
          } else if (evt.keyCode === RET) {
            self.accept(evt);
          }
        };
        if (!HC.fixed_search) {
          var engineSelector = make("select");
          for (var key in suggestionConfigs) {
            if (suggestionConfigs[key].show) {
              var opt = make("option");
              opt.value = key;
              if (key === this.engine) {
                opt.selected = true;
              }
              opt.appendChild(make(suggestionConfigs[key].name, true));
              engineSelector.appendChild(opt);
            }
          }
          engineSelector.onchange = function () {
            self.engine = self.engineSelector.options[self.engineSelector.selectedIndex].value;
            self.text.focus();
            self.textchange(true, true); // Don't autocomplete, force re-display of list
          };

          this.engineSelector = engineSelector;
        }
      }
      this.list = list;
      var button_label = function button_label(id, defaultText) {
        var label = null;
        if (onUpload && window.UFUI !== undefined && window.UIElements !== undefined && UFUI.getLabel instanceof Function) {
          try {
            label = UFUI.getLabel(id, true);
            // Extract the plain text. IE doesn't know that Node.TEXT_NODE === 3
            while (label && label.nodeType !== 3) {
              label = label.firstChild;
            }
          } catch (ex) {
            label = null;
          }
        }
        if (!label || !label.data) {
          return defaultText;
        }
        return label.data;
      };

      // Do not use type 'submit'; we cannot detect modifier keys if we do
      var OK = make("input");
      OK.type = "button";
      OK.value = button_label("wpOkUploadLbl", HC.messages.ok);
      OK.onclick = this.accept.bind(this);
      this.ok = OK;
      var cancel = make("input");
      cancel.type = "button";
      cancel.value = button_label("wpCancelUploadLbl", HC.messages.cancel);
      cancel.onclick = this.cancel.bind(this);
      this.cancelButton = cancel;
      var span = make("span");
      span.className = "hotcatinput";
      span.style.position = "relative";
      span.appendChild(text);

      // Support: IE8, IE9
      // Put some text into this span (a0 is nbsp) and make sure it always stays on the same
      // line as the input field, otherwise, IE8/9 miscalculates the height of the span and
      // then the engine selector may overlap the input field.
      span.appendChild(make("\xa0", true));
      span.style.whiteSpace = "nowrap";
      if (list) {
        span.appendChild(list);
      }
      if (this.engineSelector) {
        span.appendChild(this.engineSelector);
      }
      if (!noSuggestions) {
        span.appendChild(this.icon);
      }
      span.appendChild(OK);
      span.appendChild(cancel);
      form.appendChild(span);
      form.style.display = "none";
      this.span.appendChild(form);
    },
    display: function display(evt) {
      if (this.isAddCategory && !onUpload && this.line) {
        new CategoryEditor(this.line, null, this.span, true); // Create a new one
      }

      if (!commitButton && !onUpload) {
        for (var i = 0; i < editors.length; i++) {
          if (editors[i].state !== CategoryEditor.UNCHANGED) {
            setMultiInput();
            break;
          }
        }
      }
      if (!this.form) {
        this.makeForm();
      }
      if (this.list) {
        this.list.style.display = "none";
      }
      if (this.engineSelector) {
        this.engineSelector.style.display = "none";
      }
      this.currentCategory = this.lastSavedCategory;
      this.currentExists = this.lastSavedExists;
      this.currentHidden = this.lastSavedHidden;
      this.currentKey = this.lastSavedKey;
      this.icon.src = this.currentExists ? HC.existsYes : HC.existsNo;
      this.text.value = this.currentCategory + (this.currentKey !== null ? "|".concat(this.currentKey) : "");
      this.originalState = this.state;
      this.lastInput = this.currentCategory;
      this.inputExists = this.currentExists;
      this.state = this.state === CategoryEditor.UNCHANGED ? CategoryEditor.OPEN : CategoryEditor.CHANGE_PENDING;
      this.lastSelection = {
        start: this.currentCategory.length,
        end: this.currentCategory.length
      };
      this.showsList = false;
      // Display the form
      if (this.catLink) {
        this.catLink.style.display = "none";
      }
      this.linkSpan.style.display = "none";
      this.form.style.display = "inline";
      this.ok.disabled = false;
      // Kill the event before focussing, otherwise IE will kill the onfocus event!
      var result = evtKill(evt);
      this.text.focus();
      this.text.readOnly = false;
      checkMultiInput();
      return result;
    },
    show: function show(evt, engine, readOnly) {
      var result = this.display(evt);
      var v = this.lastSavedCategory;
      if (!v.length) {
        return result;
      }
      this.text.readOnly = !!readOnly;
      this.engine = engine;
      this.textchange(false, true); // do autocompletion, force display of suggestions
      forceRedraw();
      return result;
    },
    open: function open(evt) {
      return this.show(evt, this.engine && suggestionConfigs[this.engine].temp ? HC.suggestions : this.engine);
    },
    down: function down(evt) {
      return this.show(evt, "subcat", true);
    },
    up: function up(evt) {
      return this.show(evt, "parentcat");
    },
    cancel: function cancel() {
      if (this.isAddCategory && !onUpload) {
        this.removeEditor(); // We added a new adder when opening
        return;
      }
      // Close, re-display link
      this.inactivate();
      this.form.style.display = "none";
      if (this.catLink) {
        this.catLink.style.display = "";
      }
      this.linkSpan.style.display = "";
      this.state = this.originalState;
      this.currentCategory = this.lastSavedCategory;
      this.currentKey = this.lastSavedKey;
      this.currentExists = this.lastSavedExists;
      this.currentHidden = this.lastSavedHidden;
      if (this.catLink) {
        if (this.currentKey && this.currentKey.length) {
          this.catLink.title = this.currentKey;
        } else {
          this.catLink.title = "";
        }
      }
      if (this.state === CategoryEditor.UNCHANGED) {
        if (this.catLink) {
          this.catLink.style.backgroundColor = "transparent";
        }
      } else {
        if (!onUpload) {
          try {
            this.catLink.style.backgroundColor = HC.bg_changed;
          } catch (ex) {}
        }
      }
      checkMultiInput();
      forceRedraw();
    },
    removeEditor: function removeEditor() {
      if (!newDOM) {
        var next = this.span.nextSibling;
        if (next) {
          next.parentNode.removeChild(next);
        }
      }
      if (this.span && this.span.parentNode) {
        this.span.parentNode.removeChild(this.span);
      }
      for (var i = 0; i < editors.length; i++) {
        if (editors[i] === this) {
          editors.splice(i, 1);
          break;
        }
      }
      checkMultiInput();
    },
    rollback: function rollback(evt) {
      this.undoLink.parentNode.removeChild(this.undoLink);
      this.undoLink = null;
      this.currentCategory = this.originalCategory;
      this.currentKey = this.originalKey;
      this.currentExists = this.originalExists;
      this.currentHidden = this.originalHidden;
      this.lastSavedCategory = this.originalCategory;
      this.lastSavedKey = this.originalKey;
      this.lastSavedExists = this.originalExists;
      this.lastSavedHidden = this.originalHidden;
      this.state = CategoryEditor.UNCHANGED;
      if (!this.currentCategory || !this.currentCategory.length) {
        // It was a newly added category. Remove the whole editor.
        this.removeEditor();
      } else {
        // Redisplay the link...
        this.catLink.removeChild(this.catLink.firstChild);
        this.catLink.appendChild(make(this.currentCategory, true));
        this.catLink.href = wikiPagePath("".concat(HC.category_canonical, ":").concat(this.currentCategory));
        this.catLink.title = this.currentKey || "";
        this.catLink.className = this.currentExists ? "" : "new";
        this.catLink.style.backgroundColor = "transparent";
        if (this.upDownLinks) {
          this.upDownLinks.style.display = this.currentExists ? "" : "none";
        }
        checkMultiInput();
      }
      return evtKill(evt);
    },
    inactivate: function inactivate() {
      if (this.list) {
        this.list.style.display = "none";
      }
      if (this.engineSelector) {
        this.engineSelector.style.display = "none";
      }
      this.is_active = false;
    },
    acceptCheck: function acceptCheck(dontCheck) {
      this.sanitizeInput();
      var value = this.text.value.split("|");
      var key = null;
      if (value.length > 1) {
        key = value[1];
      }
      var v = value[0].replace(/_/g, " ").replace(/^\s+|\s+$/g, "");
      if (HC.capitalizePageNames) {
        v = capitalize(v);
      }
      this.lastInput = v;
      v = replaceShortcuts(v, HC.shortcuts);
      if (!v.length) {
        this.cancel();
        return false;
      }
      if (!dontCheck && (conf.wgNamespaceNumber === 14 && v === conf.wgTitle || HC.blacklist && HC.blacklist.test(v))) {
        this.cancel();
        return false;
      }
      this.currentCategory = v;
      this.currentKey = key;
      this.currentExists = this.inputExists;
      return true;
    },
    accept: function accept(evt) {
      this.noCommit = (evtKeys(evt) & 1) !== 0;
      var result = evtKill(evt);
      if (this.acceptCheck()) {
        var toResolve = [this];
        var original = this.currentCategory;
        resolveMulti(toResolve, function (resolved) {
          if (resolved[0].dab) {
            showDab(resolved[0]);
          } else {
            if (resolved[0].acceptCheck(true)) {
              resolved[0].commit(resolved[0].currentCategory !== original ? HC.messages.cat_resolved.replace(/\$1/g, original) : null);
            }
          }
        });
      }
      return result;
    },
    close: function close() {
      if (!this.catLink) {
        // Create a catLink
        this.catLink = make("a");
        this.catLink.appendChild(make("foo", true));
        this.catLink.style.display = "none";
        this.span.insertBefore(this.catLink, this.span.firstChild.nextSibling);
      }
      this.catLink.removeChild(this.catLink.firstChild);
      this.catLink.appendChild(make(this.currentCategory, true));
      this.catLink.href = wikiPagePath("".concat(HC.category_canonical, ":").concat(this.currentCategory));
      this.catLink.className = this.currentExists ? "" : "new";
      this.lastSavedCategory = this.currentCategory;
      this.lastSavedKey = this.currentKey;
      this.lastSavedExists = this.currentExists;
      this.lastSavedHidden = this.currentHidden;
      // Close form and redisplay category
      this.inactivate();
      this.form.style.display = "none";
      this.catLink.title = this.currentKey || "";
      this.catLink.style.display = "";
      if (this.isAddCategory) {
        if (onUpload && this.line) {
          new CategoryEditor(this.line, null, this.span, true); // Create a new one
        }

        this.isAddCategory = false;
        this.linkSpan.parentNode.removeChild(this.linkSpan);
        this.makeLinkSpan();
        this.span.appendChild(this.linkSpan);
      }
      if (!this.undoLink) {
        // Append an undo link.
        var span = make("span");
        var lk = make("a");
        lk.href = "#catlinks";
        lk.onclick = this.rollback.bind(this);
        lk.appendChild(make(HC.links.undo, true));
        lk.title = HC.tooltips.undo;
        span.appendChild(make(" ", true));
        span.appendChild(lk);
        this.normalLinks.appendChild(span);
        this.undoLink = span;
        if (!onUpload) {
          try {
            this.catLink.style.backgroundColor = HC.bg_changed;
          } catch (ex) {}
        }
      }
      if (this.upDownLinks) {
        this.upDownLinks.style.display = this.lastSavedExists ? "" : "none";
      }
      this.linkSpan.style.display = "";
      this.state = CategoryEditor.CHANGED;
      checkMultiInput();
      forceRedraw();
    },
    commit: function commit() {
      // Check again to catch problem cases after redirect resolution
      if (this.currentCategory === this.originalCategory && (this.currentKey === this.originalKey || this.currentKey === null && !this.originalKey.length) || conf.wgNamespaceNumber === 14 && this.currentCategory === conf.wgTitle || HC.blacklist && HC.blacklist.test(this.currentCategory)) {
        this.cancel();
        return;
      }
      this.close();
      if (!commitButton && !onUpload) {
        var self = this;
        initiateEdit(function (failure) {
          performChanges(failure, self);
        }, function (msg) {
          alert(msg);
        });
      }
    },
    remove: function remove(evt) {
      this.doRemove(evtKeys(evt) & 1);
      return evtKill(evt);
    },
    doRemove: function doRemove(noCommit) {
      if (this.isAddCategory) {
        // Empty input on adding a new category
        this.cancel();
        return;
      }
      if (!commitButton && !onUpload) {
        for (var i = 0; i < editors.length; i++) {
          if (editors[i].state !== CategoryEditor.UNCHANGED) {
            setMultiInput();
            break;
          }
        }
      }
      if (commitButton) {
        this.catLink.title = "";
        this.catLink.style.cssText += "; text-decoration : line-through !important;";
        try {
          this.catLink.style.backgroundColor = HC.bg_changed;
        } catch (ex) {}
        this.originalState = this.state;
        this.state = CategoryEditor.DELETED;
        this.normalLinks.style.display = "none";
        this.undelLink.style.display = "";
        checkMultiInput();
      } else {
        if (onUpload) {
          // Remove this editor completely
          this.removeEditor();
        } else {
          this.originalState = this.state;
          this.state = CategoryEditor.DELETED;
          this.noCommit = noCommit || HC.del_needs_diff;
          var self = this;
          initiateEdit(function (failure) {
            performChanges(failure, self);
          }, function (msg) {
            self.state = self.originalState;
            alert(msg);
          });
        }
      }
    },
    restore: function restore(evt) {
      // Can occur only if we do have a commit button and are not on the upload form
      this.catLink.title = this.currentKey || "";
      this.catLink.style.textDecoration = "";
      this.state = this.originalState;
      if (this.state === CategoryEditor.UNCHANGED) {
        this.catLink.style.backgroundColor = "transparent";
      } else {
        try {
          this.catLink.style.backgroundColor = HC.bg_changed;
        } catch (ex) {}
      }
      this.normalLinks.style.display = "";
      this.undelLink.style.display = "none";
      checkMultiInput();
      return evtKill(evt);
    },
    // Internal operations
    selectEngine: function selectEngine(engineName) {
      if (!this.engineSelector) {
        return;
      }
      for (var i = 0; i < this.engineSelector.options.length; i++) {
        this.engineSelector.options[i].selected = this.engineSelector.options[i].value === engineName;
      }
    },
    sanitizeInput: function sanitizeInput() {
      var v = this.text.value || "";
      v = v.replace(/^(\s|_)+/, ""); // Trim leading blanks and underscores
      var re = new RegExp("^(".concat(HC.category_regexp, "):"));
      if (re.test(v)) {
        v = v.slice(Math.max(0, v.indexOf(":") + 1)).replace(/^(\s|_)+/, "");
      }
      v = v.replace(/\u200E$/, ""); // Trim ending left-to-right mark
      if (HC.capitalizePageNames) {
        v = capitalize(v);
      }

      // Only update the input field if there is a difference. Various browsers otherwise
      // reset the selection and cursor position after each value re-assignment.
      if (this.text.value !== null && this.text.value !== v) {
        this.text.value = v;
      }
    },
    makeCall: function makeCall(url, callbackObj, engine, queryKey, cleanKey) {
      var cb = callbackObj;
      var e = engine,
        v = queryKey,
        z = cleanKey,
        thisObj = this;
      var done = function done() {
        cb.callsMade++;
        if (cb.callsMade === cb.nofCalls) {
          if (cb.exists) {
            cb.allTitles.exists = true;
          }
          if (cb.normalized) {
            cb.allTitles.normalized = cb.normalized;
          }
          if (!cb.dontCache && !suggestionConfigs[cb.engineName].cache[z]) {
            suggestionConfigs[cb.engineName].cache[z] = cb.allTitles;
          }
          thisObj.text.readOnly = false;
          if (!cb.cancelled) {
            thisObj.showSuggestions(cb.allTitles, cb.noCompletion, v, cb.engineName);
          }
          if (cb === thisObj.callbackObj) {
            thisObj.callbackObj = null;
          }
          cb = undefined;
        }
      };
      $.getJSON(url, function (json) {
        var titles = e.handler(json, z);
        if (titles && titles.length) {
          if (cb.allTitles === null) {
            cb.allTitles = titles;
          } else {
            cb.allTitles = cb.allTitles.concat(titles);
          }
          if (titles.exists) {
            cb.exists = true;
          }
          if (titles.normalized) {
            cb.normalized = titles.normalized;
          }
        }
        done();
      }).fail(function (req) {
        if (!req) {
          noSuggestions = true;
        }
        cb.dontCache = true;
        done();
      });
    },
    callbackObj: null,
    textchange: function textchange(dont_autocomplete, force) {
      // Hide all other lists
      makeActive(this);
      // Get input value, omit sort key, if any
      this.sanitizeInput();
      var v = this.text.value;
      // Disregard anything after a pipe.
      var pipe = v.indexOf("|");
      if (pipe >= 0) {
        this.currentKey = v.slice(Math.max(0, pipe + 1));
        v = v.slice(0, Math.max(0, pipe));
      } else {
        this.currentKey = null;
      }
      if (this.lastInput === v && !force) {
        return;
      } // No change
      if (this.lastInput !== v) {
        checkMultiInput();
      }
      this.lastInput = v;
      this.lastRealInput = v;

      // Mark blacklisted inputs.
      this.ok.disabled = v.length && HC.blacklist && HC.blacklist.test(v);
      if (noSuggestions) {
        // No Ajax: just make sure the list is hidden
        if (this.list) {
          this.list.style.display = "none";
        }
        if (this.engineSelector) {
          this.engineSelector.style.display = "none";
        }
        if (this.icon) {
          this.icon.style.display = "none";
        }
        return;
      }
      if (!v.length) {
        this.showSuggestions([]);
        return;
      }
      var cleanKey = v.replace(/[\u200E\u200F\u202A-\u202E]/g, "").replace(wikiTextBlankRE, " ");
      cleanKey = replaceShortcuts(cleanKey, HC.shortcuts);
      cleanKey = cleanKey.replace(/^\s+|\s+$/g, "");
      if (!cleanKey.length) {
        this.showSuggestions([]);
        return;
      }
      if (this.callbackObj) {
        this.callbackObj.cancelled = true;
      }
      var engineName = suggestionConfigs[this.engine] ? this.engine : "combined";
      dont_autocomplete || (dont_autocomplete = suggestionConfigs[engineName].noCompletion);
      if (suggestionConfigs[engineName].cache[cleanKey]) {
        this.showSuggestions(suggestionConfigs[engineName].cache[cleanKey], dont_autocomplete, v, engineName);
        return;
      }
      var engines = suggestionConfigs[engineName].engines;
      this.callbackObj = {
        allTitles: null,
        callsMade: 0,
        nofCalls: engines.length,
        noCompletion: dont_autocomplete,
        engineName: engineName
      };
      this.makeCalls(engines, this.callbackObj, v, cleanKey);
    },
    makeCalls: function makeCalls(engines, cb, v, cleanKey) {
      for (var j = 0; j < engines.length; j++) {
        var engine = suggestionEngines[engines[j]];
        var url = conf.wgServer + conf.wgScriptPath + engine.uri.replace(/\$1/g, encodeURIComponent(cleanKey));
        this.makeCall(url, cb, engine, v, cleanKey);
      }
    },
    showSuggestions: function showSuggestions(titles, dontAutocomplete, queryKey, engineName) {
      this.text.readOnly = false;
      this.dab = null;
      this.showsList = false;
      if (!this.list) {
        return;
      }
      if (noSuggestions) {
        if (this.list) {
          this.list.style.display = "none";
        }
        if (this.engineSelector) {
          this.engineSelector.style.display = "none";
        }
        if (this.icon) {
          this.icon.style.display = "none";
        }
        this.inputExists = true; // Default...
        return;
      }
      this.engineName = engineName;
      if (engineName) {
        if (!this.engineSelector) {
          this.engineName = null;
        }
      } else {
        if (this.engineSelector) {
          this.engineSelector.style.display = "none";
        }
      }
      if (queryKey) {
        if (this.lastInput.indexOf(queryKey)) {
          return;
        }
        if (this.lastQuery && this.lastInput.indexOf(this.lastQuery) === 0 && this.lastQuery.length > queryKey.length) {
          return;
        }
      }
      this.lastQuery = queryKey;

      // Get current input text
      var v = this.text.value.split("|");
      var key = v.length > 1 ? "|".concat(v[1]) : "";
      v = HC.capitalizePageNames ? capitalize(v[0]) : v[0];
      var vNormalized = v;
      var knownToExist = titles && titles.exists;
      var i;
      if (titles) {
        if (titles.normalized && v.indexOf(queryKey) === 0) {
          // We got back a different normalization than what is in the input field
          vNormalized = titles.normalized + v.slice(queryKey.length);
        }
        var vLow = vNormalized.toLowerCase();
        // Strip blacklisted categories
        if (HC.blacklist) {
          for (i = 0; i < titles.length; i++) {
            if (HC.blacklist.test(titles[i])) {
              titles.splice(i, 1);
              i--;
            }
          }
        }
        titles.sort(function (a, b) {
          if (a === b) {
            return 0;
          }
          if (a.indexOf(b) === 0) {
            return 1;
          }
          // a begins with b: a > b
          if (b.indexOf(a) === 0) {
            return -1;
          }
          // b begins with a: a < b
          // Opensearch may return stuff not beginning with the search prefix!
          var prefixMatchA = a.indexOf(vNormalized) === 0 ? 1 : 0;
          var prefixMatchB = b.indexOf(vNormalized) === 0 ? 1 : 0;
          if (prefixMatchA !== prefixMatchB) {
            return prefixMatchB - prefixMatchA;
          }

          // Case-insensitive prefix match!
          var aLow = a.toLowerCase(),
            bLow = b.toLowerCase();
          prefixMatchA = aLow.indexOf(vLow) === 0 ? 1 : 0;
          prefixMatchB = bLow.indexOf(vLow) === 0 ? 1 : 0;
          if (prefixMatchA !== prefixMatchB) {
            return prefixMatchB - prefixMatchA;
          }
          if (a < b) {
            return -1;
          }
          if (b < a) {
            return 1;
          }
          return 0;
        });
        // Remove duplicates and self-references
        for (i = 0; i < titles.length; i++) {
          if (i + 1 < titles.length && titles[i] === titles[i + 1] || conf.wgNamespaceNumber === 14 && titles[i] === conf.wgTitle) {
            titles.splice(i, 1);
            i--;
          }
        }
      }
      if (!titles || !titles.length) {
        if (this.list) {
          this.list.style.display = "none";
        }
        if (this.engineSelector) {
          this.engineSelector.style.display = "none";
        }
        if (engineName && suggestionConfigs[engineName] && !suggestionConfigs[engineName].temp) {
          if (this.icon) {
            this.icon.src = HC.existsNo;
          }
          this.inputExists = false;
        }
        return;
      }
      var firstTitle = titles[0];
      var completed = this.autoComplete(firstTitle, v, vNormalized, key, dontAutocomplete);
      var existing = completed || knownToExist || firstTitle === replaceShortcuts(v, HC.shortcuts);
      if (engineName && suggestionConfigs[engineName] && !suggestionConfigs[engineName].temp) {
        this.icon.src = existing ? HC.existsYes : HC.existsNo;
        this.inputExists = existing;
      }
      if (completed) {
        this.lastInput = firstTitle;
        if (titles.length === 1) {
          this.list.style.display = "none";
          if (this.engineSelector) {
            this.engineSelector.style.display = "none";
          }
          return;
        }
      }
      // (Re-)fill the list
      while (this.list.firstChild) {
        this.list.removeChild(this.list.firstChild);
      }
      for (i = 0; i < titles.length; i++) {
        var opt = make("option");
        opt.appendChild(make(titles[i], true));
        opt.selected = completed && i === 0;
        this.list.appendChild(opt);
      }
      this.displayList();
    },
    displayList: function displayList() {
      this.showsList = true;
      if (!this.is_active) {
        this.list.style.display = "none";
        if (this.engineSelector) {
          this.engineSelector.style.display = "none";
        }
        return;
      }
      var nofItems = this.list.options.length > HC.listSize ? HC.listSize : this.list.options.length;
      if (nofItems <= 1) {
        nofItems = 2;
      }
      this.list.size = nofItems;
      this.list.style.align = is_rtl ? "right" : "left";
      this.list.style.zIndex = 5;
      this.list.style.position = "absolute";
      // Compute initial list position. First the height.
      var anchor = is_rtl ? "right" : "left";
      var listh = 0;
      if (this.list.style.display === "none") {
        // Off-screen display to get the height
        this.list.style.top = "".concat(this.text.offsetTop, "px");
        this.list.style[anchor] = "-10000px";
        this.list.style.display = "";
        listh = this.list.offsetHeight;
        this.list.style.display = "none";
      } else {
        listh = this.list.offsetHeight;
      }
      // Approximate calculation of maximum list size
      var maxListHeight = listh;
      if (nofItems < HC.listSize) {
        maxListHeight = listh / nofItems * HC.listSize;
      }
      var viewport = function viewport(what) {
        if (is_webkit && !document.evaluate) {
          // Safari < 3.0
          return window["inner".concat(what)];
        }
        var s = "client".concat(what);
        if (window.opera) {
          return document.documentElement.getElementsByTagName("body")[0][s];
        }
        return (document.documentElement ? document.documentElement[s] : 0) || document.documentElement.getElementsByTagName("body")[0][s] || 0;
      };
      var scroll_offset = function scroll_offset(what) {
        var s = "scroll".concat(what);
        var result = (document.documentElement ? document.documentElement[s] : 0) || document.documentElement.getElementsByTagName("body")[0][s] || 0;
        if (is_rtl && what === "Left") {
          // RTL inconsistencies.
          // FF: 0 at the far right, then increasingly negative values.
          // IE >= 8: 0 at the far right, then increasingly positive values.
          // Webkit: scrollWidth - clientWidth at the far right, then down to zero.
          // Opera: don't know...
          if (result < 0) {
            result = -result;
          }
          if (!is_webkit) {
            result = scroll_offset("Width") - viewport("Width") - result;
          }

          // Now all have webkit behavior, i.e. zero if at the leftmost edge.
        }

        return result;
      };
      var position = function position(node) {
        // Stripped-down simplified position function. It's good enough for our purposes.
        if (node.getBoundingClientRect) {
          var box = node.getBoundingClientRect();
          return {
            x: Math.round(box.left + scroll_offset("Left")),
            y: Math.round(box.top + scroll_offset("Top"))
          };
        }
        var t = 0,
          l = 0;
        do {
          t += node.offsetTop || 0;
          l += node.offsetLeft || 0;
          node = node.offsetParent;
        } while (node);
        return {
          x: l,
          y: t
        };
      };
      var textPos = position(this.text),
        nl = 0;
      var nt = 0,
        offset = 0;
      // Opera 9.5 somehow has offsetWidth = 0 here?? Use the next best value...
      var textBoxWidth = this.text.offsetWidth || this.text.clientWidth;
      if (this.engineName) {
        this.engineSelector.style.zIndex = 5;
        this.engineSelector.style.position = "absolute";
        this.engineSelector.style.width = "".concat(textBoxWidth, "px");
        // Figure out the height of this selector: display it off-screen, then hide it again.
        if (this.engineSelector.style.display === "none") {
          this.engineSelector.style[anchor] = "-10000px";
          this.engineSelector.style.top = "0";
          this.engineSelector.style.display = "";
          offset = this.engineSelector.offsetHeight;
          this.engineSelector.style.display = "none";
        } else {
          offset = this.engineSelector.offsetHeight;
        }
        this.engineSelector.style[anchor] = "".concat(nl, "px");
      }
      if (textPos.y < maxListHeight + offset + 1) {
        // The list might extend beyond the upper border of the page. Let's avoid that by placing it
        // below the input text field.
        nt = this.text.offsetHeight + offset + 1;
        if (this.engineName) {
          this.engineSelector.style.top = "".concat(this.text.offsetHeight, "px");
        }
      } else {
        nt = -listh - offset - 1;
        if (this.engineName) {
          this.engineSelector.style.top = "".concat(-(offset + 1), "px");
        }
      }
      this.list.style.top = "".concat(nt, "px");
      this.list.style.width = ""; // No fixed width (yet)
      this.list.style[anchor] = "".concat(nl, "px");
      if (this.engineName) {
        this.selectEngine(this.engineName);
        this.engineSelector.style.display = "";
      }
      this.list.style.display = "block";
      // Set the width of the list
      if (this.list.offsetWidth < textBoxWidth) {
        this.list.style.width = "".concat(textBoxWidth, "px");
        return;
      }
      // If the list is wider than the textbox: make sure it fits horizontally into the browser window
      var scroll = scroll_offset("Left");
      var view_w = viewport("Width");
      var w = this.list.offsetWidth;
      var l_pos = position(this.list);
      var left = l_pos.x;
      var right = left + w;
      if (left < scroll || right > scroll + view_w) {
        if (w > view_w) {
          w = view_w;
          this.list.style.width = "".concat(w, "px");
          if (is_rtl) {
            left = right - w;
          } else {
            right = left + w;
          }
        }
        var relative_offset = 0;
        if (left < scroll) {
          relative_offset = scroll - left;
        } else if (right > scroll + view_w) {
          relative_offset = -(right - scroll - view_w);
        }
        if (is_rtl) {
          relative_offset = -relative_offset;
        }
        if (relative_offset) {
          this.list.style[anchor] = "".concat(nl + relative_offset, "px");
        }
      }
    },
    autoComplete: function autoComplete(newVal, actVal, normalizedActVal, key, dontModify) {
      if (newVal === actVal) {
        return true;
      }
      if (dontModify || this.ime || !this.canSelect()) {
        return false;
      }

      // If we can't select properly or an IME composition is ongoing, autocompletion would be a major annoyance to the user.
      if (newVal.indexOf(actVal)) {
        // Maybe it'll work with the normalized value (NFC)?
        if (normalizedActVal && newVal.indexOf(normalizedActVal) === 0) {
          if (this.lastRealInput === actVal) {
            this.lastRealInput = normalizedActVal;
          }
          actVal = normalizedActVal;
        } else {
          return false;
        }
      }
      // Actual input is a prefix of the new text. Fill in new text, selecting the newly added suffix
      // such that it can be easily removed by typing backspace if the suggestion is unwanted.
      this.text.focus();
      this.text.value = newVal + key;
      this.setSelection(actVal.length, newVal.length);
      return true;
    },
    canSelect: function canSelect() {
      return this.text.setSelectionRange || this.text.createTextRange || this.text.selectionStart !== undefined && this.text.selectionEnd !== undefined;
    },
    setSelection: function setSelection(from, to) {
      // this.text must be focused (at least on IE)
      if (!this.text.value) {
        return;
      }
      if (this.text.setSelectionRange) {
        // e.g. khtml
        this.text.setSelectionRange(from, to);
      } else if (this.text.selectionStart !== undefined) {
        if (from > this.text.selectionStart) {
          this.text.selectionEnd = to;
          this.text.selectionStart = from;
        } else {
          this.text.selectionStart = from;
          this.text.selectionEnd = to;
        }
      } else if (this.text.createTextRange) {
        // IE
        var new_selection = this.text.createTextRange();
        new_selection.move("character", from);
        new_selection.moveEnd("character", to - from);
        new_selection.select();
      }
    },
    getSelection: function getSelection() {
      var from = 0,
        to = 0;
      // this.text must be focused (at least on IE)
      if (!this.text.value) {
        // No text.
      } else if (this.text.selectionStart !== undefined) {
        from = this.text.selectionStart;
        to = this.text.selectionEnd;
      } else if (document.selection && document.selection.createRange) {
        // IE
        var rng = document.selection.createRange().duplicate();
        if (rng.parentNode() === this.text) {
          try {
            var textRng = this.text.createTextRange();
            textRng.move("character", 0);
            textRng.setEndPoint("EndToEnd", rng);
            // We're in a single-line input box: no need to care about IE's strange
            // handling of line ends
            to = textRng.text.length;
            textRng.setEndPoint("EndToStart", rng);
            from = textRng.text.length;
          } catch (notFocused) {
            from = this.text.value.length;
            to = from; // At end of text
          }
        }
      }

      return {
        start: from,
        end: to
      };
    },
    saveView: function saveView() {
      this.lastSelection = this.getSelection();
    },
    processKey: function processKey(evt) {
      var dir = 0;
      switch (this.lastKey) {
        case UP:
          dir = -1;
          break;
        case DOWN:
          dir = 1;
          break;
        case PGUP:
          dir = -HC.listSize;
          break;
        case PGDOWN:
          dir = HC.listSize;
          break;
        case ESC:
          // Inhibit default behavior (revert to last real input in FF: we do that ourselves)
          return evtKill(evt);
      }
      if (dir) {
        if (this.list.style.display !== "none") {
          // List is visible, so there are suggestions
          this.highlightSuggestion(dir);
          // Kill the event, otherwise some browsers (e.g., Firefox) may additionally treat an up-arrow
          // as "place the text cursor at the front", which we don't want here.
          return evtKill(evt);
        } else if (this.keyCount <= 1 && (!this.callbackObj || this.callbackObj.callsMade === this.callbackObj.nofCalls)) {
          // If no suggestions displayed, get them, unless we're already getting them.
          this.textchange();
        }
      }
      return true;
    },
    highlightSuggestion: function highlightSuggestion(dir) {
      if (noSuggestions || !this.list || this.list.style.display === "none") {
        return false;
      }
      var curr = this.list.selectedIndex;
      var tgt = -1;
      if (dir === 0) {
        if (curr < 0 || curr >= this.list.options.length) {
          return false;
        }
        tgt = curr;
      } else {
        tgt = curr < 0 ? 0 : curr + dir;
        tgt = tgt < 0 ? 0 : tgt;
        if (tgt >= this.list.options.length) {
          tgt = this.list.options.length - 1;
        }
      }
      if (tgt !== curr || dir === 0) {
        if (curr >= 0 && curr < this.list.options.length && dir !== 0) {
          this.list.options[curr].selected = false;
        }
        this.list.options[tgt].selected = true;
        // Get current input text
        var v = this.text.value.split("|");
        var key = v.length > 1 ? "|".concat(v[1]) : "";
        var completed = this.autoComplete(this.list.options[tgt].text, this.lastRealInput, null, key, false);
        if (!completed || this.list.options[tgt].text === this.lastRealInput) {
          this.text.value = this.list.options[tgt].text + key;
          if (this.canSelect()) {
            this.setSelection(this.list.options[tgt].text.length, this.list.options[tgt].text.length);
          }
        }
        this.lastInput = this.list.options[tgt].text;
        this.inputExists = true; // Might be wrong if from a dab list...
        if (this.icon) {
          this.icon.src = HC.existsYes;
        }
        this.state = CategoryEditor.CHANGE_PENDING;
      }
      return true;
    },
    resetKeySelection: function resetKeySelection() {
      if (noSuggestions || !this.list || this.list.style.display === "none") {
        return false;
      }
      var curr = this.list.selectedIndex;
      if (curr >= 0 && curr < this.list.options.length) {
        this.list.options[curr].selected = false;
        // Get current input text
        var v = this.text.value.split("|");
        var key = v.length > 1 ? "|".concat(v[1]) : "";
        // ESC is handled strangely by some browsers (e.g., FF); somehow it resets the input value before
        // our event handlers ever get a chance to run.
        var result = v[0] !== this.lastInput;
        if (v[0] !== this.lastRealInput) {
          this.text.value = this.lastRealInput + key;
          result = true;
        }
        this.lastInput = this.lastRealInput;
        return result;
      }
      return false;
    }
  }; // end CategoryEditor.prototype

  var initialize = function initialize() {
    // User configurations: Do this here, called from the onload handler, so that users can
    // override it easily in their own user script files by just declaring variables.
    var config = {};
    HC.dont_add_to_watchlist = window.hotcat_dont_add_to_watchlist !== undefined ? !!window.hotcat_dont_add_to_watchlist : config.HotCatDontAddToWatchlist !== undefined ? config.HotCatDontAddToWatchlist : HC.dont_add_to_watchlist;
    HC.no_autocommit = window.hotcat_no_autocommit !== undefined ? !!window.hotcat_no_autocommit : config.HotCatNoAutoCommit !== undefined ? config.HotCatNoAutoCommit // On talk namespace default autocommit off
    : conf.wgNamespaceNumber % 2 ? true : HC.no_autocommit;
    HC.del_needs_diff = window.hotcat_del_needs_diff !== undefined ? !!window.hotcat_del_needs_diff : config.HotCatDelNeedsDiff !== undefined ? config.HotCatDelNeedsDiff : HC.del_needs_diff;
    HC.suggest_delay = window.hotcat_suggestion_delay || config.HotCatSuggestionDelay || HC.suggest_delay;
    HC.editbox_width = window.hotcat_editbox_width || config.HotCatEditBoxWidth || HC.editbox_width;
    HC.suggestions = window.hotcat_suggestions || config.HotCatSuggestions || HC.suggestions;
    if (typeof HC.suggestions !== "string" || !suggestionConfigs[HC.suggestions]) {
      HC.suggestions = "combined";
    }
    HC.fixed_search = window.hotcat_suggestions_fixed !== undefined ? !!window.hotcat_suggestions_fixed : config.HotCatFixedSuggestions !== undefined ? config.HotCatFixedSuggestions : HC.fixed_search;
    HC.single_minor = window.hotcat_single_changes_are_minor !== undefined ? !!window.hotcat_single_changes_are_minor : config.HotCatMinorSingleChanges !== undefined ? config.HotCatMinorSingleChanges : HC.single_minor;
    HC.bg_changed = window.hotcat_changed_background || config.HotCatChangedBackground || HC.bg_changed;
    HC.use_up_down = window.hotcat_use_category_links !== undefined ? !!window.hotcat_use_category_links : config.HotCatUseCategoryLinks !== undefined ? config.HotCatUseCategoryLinks : HC.use_up_down;
    HC.listSize = window.hotcat_list_size || config.HotCatListSize || HC.listSize;
    if (conf.wgDBname !== "commonswiki") {
      HC.changeTag = config.HotCatChangeTag || "";
    }

    // The next whole shebang is needed, because manual tags get not submitted except of save
    if (HC.changeTag) {
      var eForm = document.editform,
        catRegExp = new RegExp("^\\[\\[(".concat(HC.category_regexp, "):"));
      var oldTxt;
      // Returns true if minor change
      var isMinorChange = function isMinorChange() {
        var newTxt = eForm.wpTextbox1;
        if (!newTxt) {
          return;
        }
        newTxt = newTxt.value;
        var oldLines = oldTxt.match(/^.*$/gm),
          newLines = newTxt.match(/^.*$/gm);
        var cArr; // changes
        var except = function except(aArr, bArr) {
          var result = [];
          var lArr,
            // larger
            sArr; // smaller
          if (aArr.length < bArr.length) {
            lArr = bArr;
            sArr = aArr;
          } else {
            lArr = aArr;
            sArr = bArr;
          }
          for (var i = 0; i < lArr.length; i++) {
            var item = lArr[i];
            var ind = sArr.indexOf(item);
            if (ind === -1) {
              result.push(item);
            } else {
              sArr.splice(ind, 1); // don't check this item again
            }
          }

          return result.concat(sArr);
        };
        cArr = except(oldLines, newLines);
        if (cArr.length) {
          cArr = $.grep(cArr, function (c) {
            c = c.trim();
            return c && !catRegExp.test(c);
          });
        }
        if (!cArr.length) {
          oldTxt = newTxt;
          return true;
        }
      };
      if (conf.wgAction === "submit" && conf.wgArticleId && eForm && eForm.wpSummary && document.getElementById("wikiDiff")) {
        var sum = eForm.wpSummary,
          sumA = eForm.wpAutoSummary;
        if (sum.value && sumA.value === HC.changeTag) {
          // HotCat diff
          // MD5 hash of the empty string, as HotCat edit is based on empty sum
          sumA.value = sumA.value.replace(HC.changeTag, "d41d8cd98f00b204e9800998ecf8427e");
          // Attr creation and event handling is not same in all (old) browsers so use $
          var $ct = $("<input>").attr({
            type: "hidden",
            name: "wpChangeTags"
          }).val(HC.changeTag);
          $(eForm).append($ct);
          oldTxt = eForm.wpTextbox1.value;
          $("#wpSave").one("click", function () {
            if ($ct.val()) {
              sum.value = sum.value.replace(HC.messages.using || HC.messages.prefix, "");
            }
          });
          var removeChangeTag = function removeChangeTag() {
            $(eForm.wpTextbox1).add(sum).one("input", function () {
              window.setTimeout(function () {
                if (!isMinorChange()) {
                  $ct.val("");
                } else {
                  removeChangeTag();
                }
              }, 500);
            });
          };
          removeChangeTag();
        }
      }
    }
    // Numeric input, make sure we have a numeric value
    HC.listSize = parseInt(HC.listSize, 10);
    if (isNaN(HC.listSize) || HC.listSize < 5) {
      HC.listSize = 5;
    }
    HC.listSize = Math.min(HC.listSize, 30); // Max size

    // Localize search engine names
    if (HC.engine_names) {
      for (var key in HC.engine_names) {
        if (suggestionConfigs[key] && HC.engine_names[key]) {
          suggestionConfigs[key].name = HC.engine_names[key];
        }
      }
    }
    // Catch both native RTL and "faked" RTL through [[MediaWiki:Rtl.js]]
    is_rtl = hasClass(document.documentElement.getElementsByTagName("body")[0], "rtl");
    if (!is_rtl) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        // Gecko etc.
        is_rtl = document.defaultView.getComputedStyle(document.documentElement.getElementsByTagName("body")[0], null).getPropertyValue("direction");
      } else if (document.documentElement.getElementsByTagName("body")[0].currentStyle) {
        // IE, has subtle differences to getComputedStyle
        is_rtl = document.documentElement.getElementsByTagName("body")[0].currentStyle.direction;
      } else {
        // Not exactly right, but best effort
        is_rtl = document.documentElement.getElementsByTagName("body")[0].style.direction;
      }
      is_rtl = is_rtl === "rtl";
    }
  };
  var can_edit = function can_edit() {
    return document.getElementById("ca-edit") !== null;
  };

  // Legacy stuff
  var closeForm = function closeForm() {
    // Close all open editors without redirect resolution and other asynchronous stuff.
    for (var i = 0; i < editors.length; i++) {
      var edit = editors[i];
      if (edit.state === CategoryEditor.OPEN) {
        edit.cancel();
      } else if (edit.state === CategoryEditor.CHANGE_PENDING) {
        edit.sanitizeInput();
        var value = edit.text.value.split("|");
        var key = null;
        if (value.length > 1) {
          key = value[1];
        }
        var v = value[0].replace(/_/g, " ").replace(/^\s+|\s+$/g, "");
        if (!v.length) {
          edit.cancel();
        } else {
          edit.currentCategory = v;
          edit.currentKey = key;
          edit.currentExists = this.inputExists;
          edit.close();
        }
      }
    }
  };
  var setup_upload = function setup_upload() {
    onUpload = true;
    // Add an empty category bar at the end of the table containing the description, and change the onsubmit handler.
    var ip = document.getElementById("mw-htmlform-description") || document.getElementById("wpDestFile");
    if (!ip) {
      ip = document.getElementById("wpDestFile");
      while (ip && ip.nodeName.toLowerCase() !== "table") {
        ip = ip.parentNode;
      }
    }
    if (!ip) {
      return;
    }
    var reupload = document.getElementById("wpForReUpload");
    var destFile = document.getElementById("wpDestFile");
    if (reupload && !!reupload.value || destFile && (destFile.disabled || destFile.readOnly)) {
      return; // re-upload form...
    }
    // Insert a table row with two fields (label and empty category bar)
    var labelCell = make("td");
    var lineCell = make("td");
    // Create the category line
    catLine = make("div");
    catLine.className = "catlinks";
    catLine.id = "catlinks";
    catLine.style.textAlign = is_rtl ? "right" : "left";
    // We'll be inside a table row. Make sure that we don't have margins or strange borders.
    catLine.style.margin = "0";
    catLine.style.border = "none";
    lineCell.appendChild(catLine);
    // Create the label
    var label = null;
    if (window.UFUI && window.UIElements && UFUI.getLabel instanceof Function) {
      try {
        label = UFUI.getLabel("wpCategoriesUploadLbl");
      } catch (ex) {
        label = null;
      }
    }
    if (!label) {
      labelCell.id = "hotcatLabel";
      labelCell.appendChild(make(HC.categories, true));
    } else {
      labelCell.id = "hotcatLabelTranslated";
      labelCell.appendChild(label);
    }
    labelCell.className = "mw-label";
    labelCell.style.textAlign = "right";
    labelCell.style.verticalAlign = "middle";
    // Change the onsubmit handler
    var form = document.getElementById("upload") || document.getElementById("mw-upload-form");
    if (form) {
      var newRow = ip.insertRow(-1);
      newRow.appendChild(labelCell);
      newRow.appendChild(lineCell);
      form.onsubmit = function (oldSubmit) {
        return function () {
          var do_submit = true;
          if (oldSubmit) {
            if (typeof oldSubmit === "string") {
              do_submit = eval(oldSubmit);
            } else if (oldSubmit instanceof Function) {
              do_submit = oldSubmit.apply(form, arguments);
            }
          }
          if (!do_submit) {
            return false;
          }
          closeForm();
          // Copy the categories
          var eb = document.getElementById("wpUploadDescription") || document.getElementById("wpDesc");
          var addedOne = false;
          for (var i = 0; i < editors.length; i++) {
            var t = editors[i].currentCategory;
            if (!t) {
              continue;
            }
            var key = editors[i].currentKey;
            var new_cat = "[[".concat(HC.category_canonical, ":").concat(t).concat(key ? "|".concat(key) : "", "]]");
            // Only add if not already present
            var _cleanedText = eb.value.replace(/<!--(\s|\S)*?-->/g, "").replace(/<nowiki>(\s|\S)*?<\/nowiki>/g, "");
            if (!find_category(_cleanedText, t, true)) {
              eb.value += "\n".concat(new_cat);
              addedOne = true;
            }
          }
          if (addedOne) {
            // Remove "subst:unc" added by Flinfo if it didn't find categories
            eb.value = eb.value.replace(/\{\{subst:unc\}\}/g, "");
          }
          return true;
        }(form.onsubmit);
      };
    }
  };
  var cleanedText = null;
  var isOnPage = function isOnPage(span) {
    if (span.firstChild.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }
    var catTitle = title(span.firstChild.getAttribute("href"));
    if (!catTitle) {
      return null;
    }
    catTitle = catTitle.slice(catTitle.indexOf(":") + 1).replace(/_/g, " ");
    if (HC.blacklist && HC.blacklist.test(catTitle)) {
      return null;
    }
    var result = {
      title: catTitle,
      match: ["", "", ""]
    };
    if (pageText === null) {
      return result;
    }
    if (cleanedText === null) {
      cleanedText = pageText.replace(/<!--(\s|\S)*?-->/g, "").replace(/<nowiki>(\s|\S)*?<\/nowiki>/g, "");
    }
    result.match = find_category(cleanedText, catTitle, true);
    return result;
  };
  var initialized = false;
  var setupTimeout = null;
  var findByClass = function findByClass(scope, tag, className) {
    var result = $(scope).find("".concat(tag, ".").concat(className));
    return result && result.length ? result[0] : null;
  };
  var setup = function setup(additionalWork) {
    if (initialized) {
      return;
    }
    initialized = true;
    if (setupTimeout) {
      window.clearTimeout(setupTimeout);
      setupTimeout = null;
    }
    // Find the category bar, or create an empty one if there isn't one. Then add -/+- links after
    // each category, and add the + link.
    catLine || (catLine = document.getElementById("mw-normal-catlinks")); // Special:Upload
    var hiddenCats = document.getElementById("mw-hidden-catlinks");
    if (!catLine) {
      var footer = null;
      if (!hiddenCats) {
        footer = findByClass(document, "div", "printfooter");
        if (!footer) {
          return;
        } // Don't know where to insert the category line
      }

      catLine = make("div");
      catLine.id = "mw-normal-catlinks";
      catLine.style.textAlign = is_rtl ? "right" : "left";
      // Add a label
      var label = make("a");
      label.href = conf.wgArticlePath.replace("$1", "Special:Categories");
      label.title = HC.categories;
      label.appendChild(make(HC.categories, true));
      catLine.appendChild(label);
      catLine.appendChild(make(":", true));
      // Insert the new category line
      var container = hiddenCats ? hiddenCats.parentNode : document.getElementById("catlinks");
      if (!container) {
        container = make("div");
        container.id = "catlinks";
        footer.parentNode.insertBefore(container, footer.nextSibling);
      }
      container.className = "catlinks noprint";
      container.style.display = "";
      if (!hiddenCats) {
        container.appendChild(catLine);
      } else {
        container.insertBefore(catLine, hiddenCats);
      }
    } // end if catLine exists
    if (is_rtl) {
      catLine.dir = "rtl";
    }

    // Create editors for all existing categories
    var createEditors = function createEditors(line, is_hidden) {
      var i;
      var cats = line.getElementsByTagName("li");
      if (cats.length) {
        newDOM = true;
        line = cats[0].parentNode;
      } else {
        cats = line.getElementsByTagName("span");
      }
      // Copy cats, otherwise it'll also magically contain our added spans as it is a live collection!
      var copyCats = new Array(cats.length);
      for (i = 0; i < cats.length; i++) {
        copyCats[i] = cats[i];
      }
      for (i = 0; i < copyCats.length; i++) {
        var test = isOnPage(copyCats[i]);
        if (test !== null && test.match !== null && line) {
          new CategoryEditor(line, copyCats[i], test.title, test.match[2], is_hidden);
        }
      }
      return copyCats.length ? copyCats[copyCats.length - 1] : null;
    };
    var lastSpan = createEditors(catLine, false);
    // Create one to add a new category

    new CategoryEditor(newDOM ? catLine.getElementsByTagName("ul")[0] : catLine, null, null, lastSpan !== null, false);
    if (!onUpload) {
      if (pageText !== null && hiddenCats) {
        if (is_rtl) {
          hiddenCats.dir = "rtl";
        }
        createEditors(hiddenCats, true);
      }
      // And finally add the "multi-mode" span. (Do this at the end, otherwise it ends up in the list above.)
      var enableMulti = make("span");
      enableMulti.className = "noprint";
      if (is_rtl) {
        enableMulti.dir = "rtl";
      }
      catLine.insertBefore(enableMulti, catLine.firstChild.nextSibling);
      enableMulti.appendChild(make("\xa0", true)); // nbsp
      multiSpan = make("span");
      enableMulti.appendChild(multiSpan);
      multiSpan.innerHTML = "(<a>".concat(HC.addmulti, "</a>)");
      var lk = multiSpan.getElementsByTagName("a")[0];
      lk.onclick = function (evt) {
        setMultiInput();
        checkMultiInput();
        return evtKill(evt);
      };
      lk.title = HC.multi_tooltip;
      lk.style.cursor = "pointer";
    }
    cleanedText = null;
    if (additionalWork instanceof Function) {
      additionalWork();
    }
    mw.hook("hotcat.ready").fire(); // Execute registered callback functions
    $("body").trigger("hotcatSetupCompleted");
  };
  var createCommitForm = function createCommitForm() {
    if (commitForm) {
      return;
    }
    var formContainer = make("div");
    formContainer.style.display = "none";
    document.documentElement.getElementsByTagName("body")[0].appendChild(formContainer);
    formContainer.innerHTML = "<form id=\"hotcatCommitForm\" method=\"post\" enctype=\"multipart/form-data\" action=\"".concat(conf.wgScript, "?title=").concat(encodeURIComponent(conf.wgPageName), "&action=submit\">") + '<input type="hidden" name="wpTextbox1">' + "<input type=\"hidden\" name=\"model\" value=\"".concat(conf.wgPageContentModel, "\">") + '<input type="hidden" name="format" value="text/x-wiki">' + '<input type="hidden" name="wpSummary" value="">' + '<input type="checkbox" name="wpMinoredit" value="1">' + '<input type="checkbox" name="wpWatchthis" value="1">' + '<input type="hidden" name="wpAutoSummary" value="d41d8cd98f00b204e9800998ecf8427e">' + '<input type="hidden" name="wpEdittime">' + '<input type="hidden" name="wpStarttime">' + '<input type="hidden" name="wpDiff" value="wpDiff">' + '<input type="hidden" name="oldid" value="0">' + '<input type="submit" name="hcCommit" value="hcCommit">' + '<input type="hidden" name="wpEditToken">' + '<input type="hidden" name="wpUltimateParam" value="1">' + '<input type="hidden" name="wpChangeTags">' + '<input type="hidden" value="ℳ𝒲♥𝓊𝓃𝒾𝒸ℴ𝒹ℯ" name="wpUnicodeCheck">' + "</form>";
    commitForm = document.getElementById("hotcatCommitForm");
  };
  var getPage = function getPage() {
    // We know we have an article here.
    if (!conf.wgArticleId) {
      // Doesn't exist yet. Disable on non-existing User pages -- might be a global user page.
      if (conf.wgNamespaceNumber === 2) {
        return;
      }
      pageText = "";
      pageTime = null;
      setup(createCommitForm);
    } else {
      var url = "".concat(conf.wgServer + conf.wgScriptPath, "/api.php?format=json&callback=HotCat.start&action=query&rawcontinue=&titles=").concat(encodeURIComponent(conf.wgPageName), "&prop=info%7Crevisions&rvprop=content%7Ctimestamp%7Cids&meta=siteinfo&rvlimit=1&rvstartid=").concat(conf.wgCurRevisionId);
      var s = make("script");
      s.src = url;
      HC.start = function (json) {
        setPage(json);
        setup(createCommitForm);
      };
      document.getElementsByTagName("head")[0].appendChild(s);
      setupTimeout = window.setTimeout(function () {
        setup(createCommitForm);
      }, 4000); // 4 sec, just in case getting the wikitext takes longer.
    }
  };

  var setState = function setState(state) {
    var cats = state.split("\n");
    if (!cats.length) {
      return null;
    }
    if (initialized && editors.length === 1 && editors[0].isAddCategory) {
      // Insert new spans and create new editors for them.
      var newSpans = [];
      var before = editors.length === 1 ? editors[0].span : null;
      var i;
      for (i = 0; i < cats.length; i++) {
        if (!cats[i].length) {
          continue;
        }
        var cat = cats[i].split("|");
        var key = cat.length > 1 ? cat[1] : null;
        cat = cat[0];
        var lk = make("a");
        lk.href = wikiPagePath("".concat(HC.category_canonical, ":").concat(cat));
        lk.appendChild(make(cat, true));
        lk.title = cat;
        var span = make("span");
        span.appendChild(lk);
        if (!i) {
          catLine.insertBefore(make(" ", true), before);
        }
        catLine.insertBefore(span, before);
        if (before && i + 1 < cats.length) {
          parent.insertBefore(make(" | ", true), before);
        }
        newSpans.push({
          element: span,
          title: cat,
          key: key
        });
      }
      // And change the last one...
      if (before) {
        before.parentNode.insertBefore(make(" | ", true), before);
      }
      for (i = 0; i < newSpans.length; i++) {
        new CategoryEditor(catLine, newSpans[i].element, newSpans[i].title, newSpans[i].key);
      }
    }
    return null;
  };
  var getState = function getState() {
    var result = null;
    for (var i = 0; i < editors.length; i++) {
      var text = editors[i].currentCategory;
      var key = editors[i].currentKey;
      if (text && text.length) {
        if (key !== null) {
          text += "|".concat(key);
        }
        if (result === null) {
          result = text;
        } else {
          result += "\n".concat(text);
        }
      }
    }
    return result;
  };
  var really_run = function really_run() {
    initialize();
    if (!HC.upload_disabled && conf.wgNamespaceNumber === -1 && conf.wgCanonicalSpecialPageName === "Upload" && conf.wgUserName) {
      setup_upload();
      setup(function () {
        // Check for state restoration once the setup is done otherwise, but before signalling setup completion
        if (window.UploadForm && UploadForm.previous_hotcat_state) {
          UploadForm.previous_hotcat_state = setState(UploadForm.previous_hotcat_state);
        }
      });
    } else {
      if (!conf.wgIsArticle || conf.wgAction !== "view" || param("diff") !== null || param("oldid") !== null || !can_edit() || HC.disable()) {
        return;
      }
      getPage();
    }
  };
  var run = function run() {
    if (HC.started) {
      return;
    }
    HC.started = true;
    loadTrigger.register(really_run);
  };

  // Export legacy functions
  window.hotcat_get_state = function () {
    return getState();
  };
  window.hotcat_set_state = function (state) {
    return setState(state);
  };
  window.hotcat_close_form = function () {
    closeForm();
  };
  HC.runWhenReady = function (callback) {
    // run user-registered code once HotCat is fully set up and ready.
    mw.hook("hotcat.ready").add(callback);
  };

  // Make sure we don't get conflicts with AjaxCategories (core development that should one day
  // replace HotCat).
  mw.config.set("disableAJAXCategories", true);

  // Run as soon as possible. This varies depending on MediaWiki version;
  // window's 'load' event is always safe, but usually we can do better than that.
  if (conf.wgCanonicalSpecialPageName !== "Upload") {
    // Reload HotCat after (VE) edits (bug T103285)
    mw.hook("postEdit").add(function () {
      // Reset HotCat in case this is a soft reload (e.g. VisualEditor edit), unless the categories
      // were not re-rendered and our interface is still there (e.g. DiscussionTools edit)
      if (document.querySelector("#catlinks .hotcatlink")) {
        return;
      }
      catLine = null;
      editors = [];
      initialized = false;
      HC.started = false;
      run();
    });
  }

  // We can safely trigger just after user configuration is loaded.
  // Use always() instead of then() to also start HotCat if the user module has problems.
  $.when(mw.loader.using("user"), $.ready).always(run);
  /* </nowiki> */
})(jQuery, mediaWiki);

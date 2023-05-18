"use strict";

/* <nowiki> */
/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <meta.wikimedia.org/wiki/MediaWiki:Gadget-autolink.js>
 * @source <en.wikipedia.org/wiki/Wikipedia:WikiProject_User_scripts/Scripts/Autolink>
 */
// Autolink [[wikilinks]], [external links] and {templates};
$(function () {
  var autolinkCronoSpecial = mw.config.get("wgCanonicalSpecialPageName") === "Recentchanges" || mw.config.get("wgCanonicalSpecialPageName") === "Watchlist" || mw.config.get("wgCanonicalSpecialPageName") === "Recentchangeslinked" || mw.config.get("wgCanonicalSpecialPageName") === "Newpages" || mw.config.get("wgCanonicalSpecialPageName") === "Log" || mw.config.get("wgCanonicalSpecialPageName") === "Contributions";
  // Special crono pages where this script is enabled

  if (mw.config.get("wgCanonicalNamespace") === "Special" && !autolinkCronoSpecial) {
    return; // Disabled in the other special pages
  }

  /* ---------------------------------------- Variables ------------------------------------------- */

  var autolinkDiff = location.href.indexOf("diff=") !== -1;
  // It says if I'm in a diff page

  var autolinkCrono = mw.config.get("wgAction") === "history" || autolinkCronoSpecial;
  // It says if I'm in a history page

  var autolinkEdit = $.inArray(mw.config.get("wgAction"), ["edit", "submit"]) !== -1;
  // It says if I'm in an edit or submit page

  var autolinkColor; // links color

  var autolinkTargetDiv = [];
  if (autolinkDiff) {
    // in diff pages
    autolinkTargetDiv[0] = $(".diff");
    autolinkTargetDiv[1] = $(".firstrevisionheader");
    autolinkColor = "inherit"; // not coloured links
  } else if (autolinkCrono || autolinkEdit) {
    // in comments
    autolinkTargetDiv[0] = $(".comment");
    autolinkColor = ""; // coloured links
  } else {
    // in code sections
    autolinkTargetDiv[0] = $("source");
    autolinkTargetDiv[1] = $(".javascript");
    autolinkTargetDiv[2] = $(".source-javascript");
    autolinkTargetDiv[3] = $(".css");
    autolinkTargetDiv[4] = $(".source-css");
    autolinkColor = ""; // coloured links
  }

  /* ------------------------------------------ Regex --------------------------------------------- */
  var autolinkRegexURLinWcodeWoLabel;
  var autolinkRegexSubstinWcodeWoLabel;
  var autolinkRegexURLinWcodeWithLabel;
  var autolinkRegexSubstinWcodeWithLabel;
  var autolinkRegexOtherPages;
  var autolinkRegexSubstOtherPages;
  var autolinkRegexTemplate;
  var autolinkRegexSubstTemplate;
  var autolinkRegexWlink1;
  var autolinkRegexSubstWlink1;
  var autolinkRegexWlink2;
  var autolinkRegexSubstWlink2;
  var autolinkActivateHTML = false;

  /*   ------------------------------------------------------------------------------------------ */

  var autolinkRegexTl = /([^{]{{2}\s*[Tt]l\|)([^[\]{}|:<>\n]+)/g;
  // For {{tl}}

  var autolinkRegexURL = /((?:[^"[]|[^=]")(?:<span class="diffchange">)?)((?:https?|ftps?):\/\/[\w._/\\~%\-+&#?!=()@:]+?)(?=(?:<\/span>)?[\s|)\]}'"])/g;
  // External links (no wikicode)

  // Regex for diffs

  autolinkRegexURLinWcodeWoLabel = /((?:[^[]|^)\[\s*(?:<\/span>)?\s*(?:<span class="diffchange">)?\s*)((?:https?|ftps?):\/\/[\w._/\\~%\-+&#?!=()@:]+)((?:<\/span>)?(?:<span class="diffchange">)?)([\w._/\\~%\-+&#?!=()@:]*)((?:<\/span>)?(?:<span class="diffchange">)?)([\w._/\\~%\-+&#?!=()@:]*)([^\]\n]*\])/gm;
  autolinkRegexSubstinWcodeWoLabel = "$1<a class=\"external autolink\" style=\"color:".concat(autolinkColor, "\" href=\"$2$4$6\">$2</a>$3<a class=\"external autolink\" style=\"color:").concat(autolinkColor, "\" href=\"$2$4$6\">$4</a>$5<a class=\"external autolink\" style=\"color:").concat(autolinkColor, "\" href=\"$2$4$6\">$6</a>$7");
  // External links in diff pages, wikicode without label

  autolinkRegexURLinWcodeWithLabel = autolinkRegexURLinWcodeWoLabel;
  autolinkRegexSubstinWcodeWithLabel = autolinkRegexSubstinWcodeWoLabel;
  // External links in diff pages, wikicode with label

  autolinkRegexOtherPages = /((?:[^{]|^)\{{2}\s*(?:<\/span>)?\s*(?:<span class="diffchange">)?\s*(?:(?:[Ss][Uu][Bb][Ss][Tt]|[Mm][Ss][Gg]|[Mm][Ss][Gg][Nn][Ww])\s*:)?\s*(?:<\/span>)?\s*(?:<span class="diffchange">)?\s*)((?:[Ss]peciale?|[Qq](?:iuwen|[Ww])|[Ww][Pp]|[Tt]emplate|[Uu](?:ser))?\s*(?: ?[Tt]alk)?\s*:[^[\]{}|:<>\n]+)((?:<\/span>)?(?:<span class="diffchange">)?)([^[\]{}|:<>\n]*)((?:<\/span>)?(?:<span class="diffchange">)?)([^[\]{}|:<>\n]*)(\||}{2})/gm;
  autolinkRegexSubstOtherPages = "$1<a class=\"autolink\" style=\"color:".concat(autolinkColor, "\" href=\"/wiki/$2$4$6\">$2</a>$3<a class=\"autolink\" style=\"color:").concat(autolinkColor, "\" href=\"/wiki/$2$4$6\">$4</a>$5<a class=\"autolink\" style=\"color:").concat(autolinkColor, "\" href=\"/wiki/$2$4$6\">$6</a>$7");
  // Other pages included in diff pages

  autolinkRegexTemplate = /((?:[^{]|^)\{{2}\s*(?:<\/span>)?\s*(?:<span class="diffchange">)?\s*(?:(?:[Ss][Uu][Bb][Ss][Tt]|[Mm][Ss][Gg]|[Mm][Ss][Gg][Nn][Ww])\s*:)?\s*(?:<\/span>)?\s*(?:<span class="diffchange">)?)([^[\]{}|:<>\n]+)((?:<\/span>)?(?:<span class="diffchange">)?)([^[\]{}|:<>\n]*)((?:<\/span>)?(?:<span class="diffchange">)?)([^[\]{}|:<>\n]*)(\||}{2}|:)/gm;
  autolinkRegexSubstTemplate = "$1<a class=\"autolink\" style=\"color:".concat(autolinkColor, "\" href=\"/wiki/Template:$2$4$6\">$2</a>$3<a class=\"autolink\" style=\"color:").concat(autolinkColor, "\" href=\"/wiki/Template:$2$4$6\">$4</a>$5<a class=\"autolink\" style=\"color:").concat(autolinkColor, "\" href=\"/wiki/Template:$2$4$6\">$6</a>$7");
  // Templates in diff pages

  autolinkRegexWlink1 = /(\[{2}\s*(?:<\/span>)?\s*(?:<span class="diffchange">)?\s*)([^[\]{}|<>\n]+)((?:<\/span>)?(?:<span class="diffchange">)?)([^[\]{}|<>\n]*)((?:<\/span>)?(?:<span class="diffchange">)?)([^[\]{}|<>\n]*)((?:[^\]\n]|\][^\]])*\]{2})/g;
  autolinkRegexSubstWlink1 = "$1<a class=\"autolink\" style=\"color:".concat(autolinkColor, "\" href=\"/wiki/$2$4$6\">$2</a>$3<a class=\"autolink\" style=\"color:").concat(autolinkColor, "\" href=\"/wiki/$2$4$6\">$4</a>$5<a class=\"autolink\" style=\"color:").concat(autolinkColor, "\" href=\"/wiki/$2$4$6\">$6</a>$7");
  // Wikilinks in diff pages

  autolinkRegexWlink2 = autolinkRegexWlink1;
  autolinkRegexSubstWlink2 = autolinkRegexSubstWlink1;

  // Regex for comments or code sections

  if (!autolinkDiff) {
    autolinkRegexURLinWcodeWoLabel = /([^[]|^)\[\s*((?:https?|ftps?):\/\/[\w._/\\~%\-+&#?!=()@:]+)\s*\]/gm;
    autolinkRegexSubstinWcodeWoLabel = "$1<a class=\"external autolink\" style=\"color:".concat(autolinkColor, "\" href=\"$2\">$2</a>");
    // External links in comments or code sections, wikicode without label

    autolinkRegexURLinWcodeWithLabel = /([^[]|^)\[\s*((?:https?|ftps?):\/\/[\w._/\\~%\-+&#?!=()@:]+)\s+([^\n]+?)\s*\]/gm;
    autolinkRegexSubstinWcodeWithLabel = "$1<a class=\"external autolink\" style=\"color:".concat(autolinkColor, "\" href=\"$2\">$3</a>");
    // External links in comments or code sections, wikicode with label (the URL will not be visible)

    autolinkRegexOtherPages = /((?:[^{]|^)\{{2}\s*(?:(?:[Ss][Uu][Bb][Ss][Tt]|[Mm][Ss][Gg]|[Mm][Ss][Gg][Nn][Ww])\s*:)?\s*)((?:[Ss]pecial|[Qq](?:iuwen|Q)|[Ww][Pp]|[Tt]emplate|[Uu](?:ser))?\s*(?: ?[Tt]alk)?\s*:[^[\]{}|:<>\n]+)(\||}{2})/gm;
    autolinkRegexSubstOtherPages = "$1<a class=\"autolink\" style=\"color:".concat(autolinkColor, "\" href=\"/wiki/$2\">$2</a>$3");
    // Other pages included in comments or code sections

    autolinkRegexTemplate = /((?:[^{]|^)\{{2}\s*(?:(?:[Ss][Uu][Bb][Ss][Tt]|[Mm][Ss][Gg]|[Mm][Ss][Gg][Nn][Ww])\s*:)?\s*)([^[\]{}|:<>\n]+)(\||}{2}|:)/gm;
    autolinkRegexSubstTemplate = "$1<a class=\"autolink\" style=\"color:".concat(autolinkColor, "\" href=\"/wiki/Template:$2\">$2</a>$3");
    // Templates in comments or code sections

    autolinkRegexWlink1 = /\[{2}\s*([^[\]{}|<>\n]+?)\s*\|\s*(.+?)\s*\]{2}/g;
    autolinkRegexSubstWlink1 = "<a class=\"autolink\" style=\"color:".concat(autolinkColor, "\" href=\"/wiki/$1\">$2</a>");
    // Wikilinks in code sections, with label

    autolinkRegexWlink2 = /\[{2}\s*([^[\]{}|<>\n]+?)\s*\|?\s*\]{2}/g;
    autolinkRegexSubstWlink2 = "<a class=\"autolink\" style=\"color:".concat(autolinkColor, "\" href=\"/wiki/$1\">$1</a>");
    // Wikilinks in code sections, without label

    autolinkActivateHTML = true;
    // Activate some HTML (inline) and wikicode for bold and italic
  }

  var autolinkRegexInternalURL = /([^=])('|"|\s)((?:\/?w\/index\.php\?|\/?wiki\/)[\w._/\\~%\-+&#?!=()@:]+)\2/g;
  // External links (no wikicode, under wgServer)

  var autolinkRegexImportScript = /([Ii]mport[Ss]cript(?:<span class="br0">)?\((?:<\/span><span class="st0">)?)('|")([^[\]{}|<>\n]+?)(\2(?:<\/span><span class="br0">)?\)(?:<\/span>)?)/g;
  // ImportScript

  /*   ---------------------------------------------------------------------------------------------- */

  for (var i = 0; i < autolinkTargetDiv.length; i++) {
    for (var j = 0; j < autolinkTargetDiv[i].length; j++) {
      var autolinkContent = autolinkTargetDiv[i][j].innerHTML;
      autolinkContent = autolinkContent.replace(/&lt;/g, "&shy;<&shy;");
      autolinkContent = autolinkContent.replace(/&gt;/g, "&shy;>&shy;");
      // &amp;lt; to &amp;shy;<&amp;shy; and &amp;gt; to &amp;shy;>&amp;shy; (&amp;shy; is a marker)

      autolinkContent = autolinkContent.replace(/&amp;/g, "&");
      // &amp;amp; to &

      /* ----------------------------------------------------------------------------------- */

      autolinkContent = autolinkContent.replace(autolinkRegexTl, "$1<a class=\"autolink\" style=\"color:".concat(autolinkColor, "\" href=\"/wiki/Template:$2\">$2</a>"));
      // For {{tl}}: make his argument into link

      autolinkContent = autolinkContent.replace(autolinkRegexURL, "$1<a class=\"external autolink\" style=\"color:".concat(autolinkColor, "\" href=\"$2\">$2</a>"));
      // Parse inactive external links (no wikicode)

      autolinkContent = autolinkContent.replace(autolinkRegexURLinWcodeWoLabel, autolinkRegexSubstinWcodeWoLabel);
      // Make external links in wikicode without label into links

      autolinkContent = autolinkContent.replace(autolinkRegexURLinWcodeWithLabel, autolinkRegexSubstinWcodeWithLabel);
      // Make external links in wikicode with label into links

      autolinkContent = autolinkContent.replace(autolinkRegexOtherPages, autolinkRegexSubstOtherPages);
      // Make other pages included code into links

      autolinkContent = autolinkContent.replace(autolinkRegexTemplate, autolinkRegexSubstTemplate);
      autolinkContent = autolinkContent.replace(/href="\/wiki\/Template:#/g, 'href="/wiki/Help:');
      // Make template code into links

      autolinkContent = autolinkContent.replace(autolinkRegexWlink1, autolinkRegexSubstWlink1);
      autolinkContent = autolinkContent.replace(autolinkRegexWlink2, autolinkRegexSubstWlink2);
      // Make wikilink code into links

      autolinkContent = autolinkContent.replace(autolinkRegexInternalURL, "$1$2<a class=\"external autolink\" style=\"color:".concat(autolinkColor, "\" href=\"").concat(mw.config.get("wgServer"), "$3\">$3</a>$2"));
      // Parse inactive external links (no wikicode, under wgServer)

      autolinkContent = autolinkContent.replace(autolinkRegexImportScript, "$1$2<a class=\"autolink\" style=\"color:".concat(autolinkColor, "\" href=\"/wiki/$3\">$3</a>$4"));
      // Parse ImportScript

      /* ----------------------------------------------------------------------------------- */

      autolinkContent = autolinkContent.replace(/&shy;<&shy;/g, "&lt;");
      autolinkContent = autolinkContent.replace(/&shy;>&shy;/g, "&gt;");
      // &amp;shy;<&amp;shy; to &amp;lt; and &amp;shy;>&amp;shy; to &amp;gt; (revert)

      if (autolinkActivateHTML) {
        autolinkContent = autolinkContent.replace(/&lt;(span|b|i|strong|small|tt|del|s|u|sub|sup)&gt;(.*?)&lt;\/(\1)&gt;/g, "<$1>$2</$3>");
        autolinkContent = autolinkContent.replace(/([^']|^)'{3}(.+?)'{3}([^']|$)/gm, "$1<b>$2</b>$3");
        autolinkContent = autolinkContent.replace(/([^']|^)'{2}(.+?)'{2}([^']|$)/gm, "$1<i>$2</i>$3");
        if (autolinkCrono || autolinkEdit) {
          autolinkContent = autolinkContent.replace(/<i>(.*?)<\/i>/g, '<span title="italic" style="border: 1px solid silver; padding: 2px;">$1</span>');
        }
        // I'm in a comment field (italic)
      }

      if (autolinkDiff) {
        autolinkContent = autolinkContent.replace(/<a [^>]+><\/a>/g, ""); // Clean
        autolinkContent = autolinkContent.replace(/([^[]|^)\[\s*(<a [^>]+>)(?:https?|ftps?):\/\/[\w._/\\~%\-+&#?!=()@:]+(<\/a>)\s+([^\]\n]+)\]/gm, "$1$2$4$3");
        autolinkContent = autolinkContent.replace(/([^[]|^)\[\s*(<a [^>]+>)((?:https?|ftps?):\/\/[\w._/\\~%\-+&#?!=()@:]+)(<\/a>)\s*\]/gm, "$1$2$3$4");
      }
      autolinkTargetDiv[i][j].innerHTML = autolinkContent; // Write it back
    }
  }
});

/* </nowiki> */
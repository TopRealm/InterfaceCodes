'use strict';

/* <nowiki> */
/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <commons.wikimedia.org/wiki/MediaWiki:Gadget-ImprovedUploadForm.js>
 */
/**
 * Enhancements for Special:Upload
 * See also: [[MediaWiki:Gadget-ImprovedUploadForm-main.js]]
 */
(function ($, mw) {
  var enableNewUploadForm = function enableNewUploadForm() {
    // Add loading spinner, as UploadForm will be first installed after document ready.
    if ($.createSpinner && !window.UploadForm) {
      $('#mw-upload-form').prepend($.createSpinner({
        id: 'UploadLoadingSpinner',
        size: 'large',
        type: 'block'
      }));
      // Max appearance
      window.setTimeout(function () {
        $.removeSpinner('UploadLoadingSpinner');
      }, 2800);
    }
    mw.loader.load('/index.php?title=MediaWiki:Gadget-ImprovedUploadForm-main.js&action=raw&ctype=text/javascript&maxage=86400&smaxage=86400');
  };
  if (mw.config.get('wgCanonicalSpecialPageName') === 'Upload' && mw.util.getParamValue('uploadformstyle') !== 'plain') {
    // (Un)comment the following line (the call to enableNewUploadForm) to globally enable/disable
    // new upload form. Leave the line *above* untouched;
    // that script provides useful default behavior if the new upload form is disabled or
    // redirects to the old form in case an error occurs.
    mw.loader.using(['jquery.spinner', 'mediawiki.util'], enableNewUploadForm);
  }
})(jQuery, mediaWiki);

$(function () {
  // Add fieid preload
  window.setTimeout(function () {
    var fields = ['wpSource', 'wpAuthor', 'wpDate', 'wpDescText1', 'wpPermission', 'wpOtherVersions', 'wpAdditionalInfo', 'wpPatent', 'wpLicense'];
    for (var i = 0; i < fields.length; i++) {
      if (mw.util.getParamValue(fields[i])) {
        $("#".concat(fields[i])).attr('value', mw.util.getParamValue(fields[i]));
      }
    }
  }, 1000);
});

/* </nowiki> */
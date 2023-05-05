"use strict";

/* <nowiki> */
/**
 * SPDX-License-Identifier: GPL-2.0-or-later
 * _addText: '{{Gadget Header|license=GPLv2+}}'
 *
 * @source <github.com/wikimedia/mediawiki-extensions-CentralNotice/blob/5ac5d25f1a6ed1fa5b35bdc6f0eca209bad4cb91/resources/subscribing/ext.centralNotice.geoIP.js>
 * @dependency mediawiki.storage
 */
(function ($, mw) {
  if (window.Geo) {
    return;
  }
  var cName = "GeoIP";
  var geoPromise;

  /**
   * Parse geo data in cValue and return an object with properties from
   * the fields therein. Returns null if the value couldn't be parsed or
   * doesn't contain location data.
   *
   * The storage item will look like one of the following:
   * - "CN-SH-Shanghai"
   * - "CN-SH-"
   * - "CN--"
   * - "--"
   *
   * @param {string} cValue
   * @return {?Object}
   */
  var parseCValue = function parseCValue(cValue) {
    // TODO Verify that these Regexes are optimal. (Why no anchors? Why the
    // semicolon in the last group?)
    // Parse storage item
    var matches = cValue.match(/([^-]*)-([^-]*)-([^-]*)/);

    // No matches...? Boo, no data.
    if (!matches) {
      return null;
    }

    // There was no info found if there's no country field, or if it's
    // empty
    if (typeof matches[1] !== "string" || matches[1].length === 0) {
      return null;
    }

    // Return a juicy Geo object
    return {
      country: matches[1],
      region: matches[2],
      city: matches[3]
    };
  };

  /**
   * Request geo data and store it in the local storage
   *
   * @param {Object} geo
   */
  var storeGeoInStorage = function storeGeoInStorage() {
    $.ajax({
      url: "https://geo.qiuwen.net.cn"
    }).done(function (data) {
      var parts = [data.country || "", data.region || "", data.city || ""];
      var cValue = parts.join("-");
      mw.storage.set(cName, cValue, 3600); // 1 hour

      // Return Geo object
      return parseCValue(cValue);
    });
  };

  /**
   * Public geoIP object
   */
  mw.geoIP = {
    /**
     * Don't call this function! It is only exposed for tests.
     *
     * Set a promise that resolves with geo. First try to get data from the
     * GeoIP storage. If that fails, and if a background lookup callback
     * module is configured, try the background lookup.
     *
     * @private
     */
    makeGeoWithPromise: function makeGeoWithPromise() {
      var cValue = mw.storage.get(cName);
      var geo;

      // Were we able to read the storage?
      if (!cValue) {
        geo = storeGeoInStorage();
      } else {
        geo = parseCValue(cValue);
      }

      // All good? Resolve with geo and get outta here.
      if (geo) {
        geoPromise = $.Deferred().resolve(geo).promise();
        return;
      }
      geoPromise = $.Deferred().reject().promise();
    },
    /**
     * Returns a promise that resolves with geo when it's available. While
     * it's usually available right away, it may not be if a background
     * call is performed.
     *
     * @return {jQuery.Promise}
     */
    getPromise: function getPromise() {
      return geoPromise;
    }
  };
  mw.geoIP.makeGeoWithPromise();
  geoPromise.done(function (geo) {
    window.Geo = geo;
  });
})(jQuery, mediaWiki);

/* </nowiki> */
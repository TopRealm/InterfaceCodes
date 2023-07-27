/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0|import=no}}'
 *
 * @source <https://github.com/TopRealm/InterfaceCodes/blob/master/src/Gadgets/Compatibility/libPolyfill>
 */
/**
 * +--------------------------------------------------------+
 * |         === WARNING: GLOBAL GADGET FILE ===            |
 * +--------------------------------------------------------+
 * |      All changes should be made in the repository,     |
 * |              otherwise they will be lost.              |
 * +--------------------------------------------------------+
 * |        Changes to this page affect many users.         |
 * |  Please discuss changes at Talk page before editing.   |
 * +--------------------------------------------------------+
 */
/* <nowiki> */
"use strict";
(function () {
    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    var validate = function (uuid) { return "string" === typeof uuid && REGEX.test(uuid); };
    var rnds8 = new Uint8Array(16);
    var rng = function () { return crypto.getRandomValues(rnds8); };
    var byteToHex = [];
    for (var i = 0; i < 256; ++i) {
        byteToHex.push((i + 256).toString(16).substring(1));
    }
    var unsafeStringify = function (arr, offset) {
        if (offset === void 0) { offset = 0; }
        return "".concat(byteToHex[arr[offset + 0]]).concat(byteToHex[arr[offset + 1]]).concat(byteToHex[arr[offset + 2]]).concat(byteToHex[arr[offset + 3]], "-").concat(byteToHex[arr[offset + 4]]).concat(byteToHex[arr[offset + 5]], "-").concat(byteToHex[arr[offset + 6]]).concat(byteToHex[arr[offset + 7]], "-").concat(byteToHex[arr[offset + 8]]).concat(byteToHex[arr[offset + 9]], "-").concat(byteToHex[arr[offset + 10]]).concat(byteToHex[arr[offset + 11]]).concat(byteToHex[arr[offset + 12]]).concat(byteToHex[arr[offset + 13]]).concat(byteToHex[arr[offset + 14]]).concat(byteToHex[arr[offset + 15]]).toLowerCase();
    };
    var v4 = function (options, buf, offset) {
        if (options === void 0) { options = {}; }
        if (offset === void 0) { offset = 0; }
        var rnds = options.random || (options.rng || rng)();
        rnds[6] = rnds[6] & 0x0f | 0x40;
        rnds[8] = rnds[8] & 0x3f | 0x80;
        if (buf) {
            for (var i = 0; i < 16; ++i) {
                buf[offset + i] = rnds[i];
            }
            return buf;
        }
        return unsafeStringify(rnds);
    };
    try {
        if (!validate(crypto.randomUUID())) {
            throw void 0;
        }
    }
    catch (_a) {
        crypto.randomUUID = function () { return v4(); };
    }
})();
/* </nowiki> */

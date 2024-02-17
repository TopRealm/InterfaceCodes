/**
 *  * SPDX-License-Identifier: MIT
 * _addText: '{{Gadget Header|license=MIT}}'
 *
 * @source <https://zh.moegirl.org.cn/MediaWiki:Gadget-jQueryLazyload.js>
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

function Scroller(element) {
    function wheelHandler(e) {
        if (e.deltaY && !e.deltaX) {
            e.preventDefault();
            requestAnimationFrame(function () {
                element.scrollBy(e.deltaY, 0);
            });
        }
    }
    element.addEventListener('wheel', wheelHandler);
    element.style.scrollSnapType = 'none';
    return function () {
        element.removeEventListener('wheel', wheelHandler);
        element.style.scrollSnapType = '';
    };
}
var scroller_containers = document.getElementsByClassName('scroller-container');
for (var index = 0; index < scroller_containers.length; index++) {
    var element = scroller_containers[index];
    Scroller(element);
}
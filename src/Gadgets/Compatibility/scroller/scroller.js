/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 * @author 白给
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
class Scroller {
    constructor() {
        this.scroller_focus_id = 0
        this.scroller_items = document.getElementsByClassName('scroller-item')
        this.scroller_item_length = this.scroller_items.length

        this.e_last_btn = document.getElementById('scroller-last-btn')
        this.e_next_Btn = document.getElementById('scroller-next-btn')

        this.scroller_items[0].classList.add('scroller-item-now')

        this.e_last_btn.addEventListener('click', () => { this.scroll_element_intoView(-1) })
        this.e_next_Btn.addEventListener('click', () => { this.scroll_element_intoView(1) })
    }
    scroll_element_intoView(jump) {
        var target = this.scroller_focus_id + jump

        if (target <= 0) { target = 0 }
        if (target >= this.scroller_item_length) { target = this.scroller_item_length - 1 }

        this.scroller_items[target].scrollIntoView()

        try { this.scroller_items[this.scroller_focus_id].classList.remove('scroller-item-now') } catch { }
        this.scroller_items[target].classList.add('scroller-item-now')

        this.scroller_focus_id = target
    }
}
(new Scroller())()

/* </nowiki> */

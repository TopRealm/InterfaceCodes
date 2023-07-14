/* <nowiki> */
/**
 * SPDX-License-Identifier: CC-BY-NC-SA-3.0-CN
 * _addText: '{{Gadget Header|license=cc-by-nc-sa-3.0-cn|import=no}}'
 * @source <https://github.com/MoegirlPediaInterfaceAdmins/MoegirlPediaInterfaceCodes/blob/master/src/gadgets/UserLinkAvatar/MediaWiki:Gadget-UserLinkAvatar.js>
 * @source <https://github.com/TopRealm/InterfaceCodes/blob/master/src/Gadgets/Appearance/UserLinkAvatar/UserLinkAvatar.js>
 * @author Mogirlpedia Contributers.
 * @author zorua<zorua@vip.qq.com>
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

/* </nowiki> */

"use strict";
// <pre>
(() => {
    const magnifierOn = +mw.user.options.get("gadget-userLinkAvatarMagnifier", 0) === 1;
    const $window = $(window);
    const loadingImage = "https://wiki.zorua.top/images/d/de/Ajax-loader.gif";
    $window.on("load.UserLinkAvatar", () => {
        const images = [];
        $(".mw-userlink:not(.user-avatar-added)").each((_, ele) => {
            const item = $(ele);
            const src = `https://wiki.zorua.top/extensions/Avatar/avatar.php?user=${encodeURIComponent(item.text())}`;
            const img = $("<img/>").on("error", () => {
                window.setTimeout(() => {
                    img.closest(".userlink-avatar").remove();
                }, 0);
            }).addClass("userlink-avatar-small").attr({
                "data-src": src,
                src: loadingImage,
            });
            images.push(img[0]);
            const bigAvatar = $("<span/>").addClass("userlink-avatar");
            item.prepend(bigAvatar.append(img));
            item.addClass("user-avatar-added");
            if (magnifierOn) {
                const magnifierImg = $("<img/>", {
                    attr: {
                        "data-src": src,
                        src: loadingImage,
                    },
                    on: {
                        error: () => {
                            window.setTimeout(() => {
                                magnifierImg.closest(".userlink-avatar-large").remove();
                            }, 0);
                        },
                    },
                });
                images.push(magnifierImg[0]);
                bigAvatar.on("click", () => {
                    window.open(`https://wiki.zorua.top/index.php?title=Special%3A查看头像&user=${encodeURIComponent(item.text())}`, "_blank");
                    return false;
                }).append($("<div/>", {
                    attr: {
                        "class": "userlink-avatar-large",
                    },
                }).prepend(magnifierImg)).addClass("userlink-avatar-hover");
                item.before(bigAvatar);
                bigAvatar.add(bigAvatar.children()).attr("title", `查看用户${item.text()}的头像`);
            }
        });
        if (typeof window.lazyload === "function") {
            window.lazyload(images);
        } else {
            images.forEach((ele) => {
                ele.src = ele.dataset.src;
            });
        }
    });
    $(() => {
        $window.trigger("load.UserLinkAvatar");
    });
})();
// </pre>


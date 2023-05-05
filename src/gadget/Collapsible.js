/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <rs.miraheze.org/wiki/MediaWiki:Gadget-collapsible.js>
 */
"use strict";

/**
 * 用法说明：
 *
 * 带有 collapsible 类的元素默认可折叠。
 * - 对于 navbox，折叠时会保留标题栏，并将折叠按钮添加在标题栏中。
 * - 对于 table，折叠时会保留 caption 或第一行，并将折叠按钮添加在 caption 末尾
 *   或者第一行最后一格末尾。
 * - 对于其他元素，
 *   - 如果其子元素有带有 collapsible-always-show 类，那么除了该子元素之外的各个
 *   子元素都会随折叠隐藏，且折叠按钮添加在该子元素末尾。
 *   - 如果没有子元素带有 collapsible-always-show 类，那么所有子元素都会被折叠，
 *   折叠按钮添加在整个 collapsible 元素的开头，且该按钮不会随折叠隐藏。
 *   - 如果子元素带有 collapsible-cascade 类，那么当折叠时，该元素自身不是隐藏，
 *   而是隐藏其所有的子元素，这些子元素同样可以受 collapsible-always-show 和
 *   collapsible-cascade 类的影响。
 *   - 注意必须是子元素，直接的文本节点不会随折叠隐藏，例如：
 *     <div class="collapsible">123<span>456</span></div>
 *   折叠时，“456”会随折叠隐藏，但“123”不会。
 * - 如果带有 collapsible-using-slide 类，那么折叠时，使用滑动动画而非淡入淡出的
 *   动画。建议当只有一个元素会被隐藏时，才加此类。
 *   - 带有 collapsible-using-slide 类的元素会自动带有 collapsible 类。
 * - 如果带有 collapsible-next 类，那么其折叠的不是其自身的子元素，而是折叠紧随
 *   其后的一个元素。
 *   - 这种情况下，折叠按钮默认附在该 collapsible-next 元素的末尾。
 *   - 带有 collapsible-next 类的元素会自动带有 collapsible 类。
 * - data-collapse-duration 属性可以设置折叠动画的时长，默认为 200 毫秒。
 * - 带有 collapsed 类的元素初始就是已折叠的。
 * - data-expandtext 和 data-collapsetext 可用于控制折叠按钮的显示文字。不支持
 *   繁简转换，但是其默认值是可以正常根据界面语言繁简转换的。
 */

/**
 * 用法说明：
 *
 * 带有 collapsible 类的元素默认可折叠。
 * - 对于 navbox，折叠时会保留标题栏，并将折叠按钮添加在标题栏中。
 * - 对于 table，折叠时会保留 caption 或第一行，并将折叠按钮添加在 caption 末尾
 *   或者第一行最后一格末尾。
 * - 对于其他元素，
 *   - 如果其子元素有带有 collapsible-always-show 类，那么除了该子元素之外的各个
 *   子元素都会随折叠隐藏，且折叠按钮添加在该子元素末尾。
 *   - 如果没有子元素带有 collapsible-always-show 类，那么所有子元素都会被折叠，
 *   折叠按钮添加在整个 collapsible 元素的开头，且该按钮不会随折叠隐藏。
 *   - 如果子元素带有 collapsible-cascade 类，那么当折叠时，该元素自身不是隐藏，
 *   而是隐藏其所有的子元素，这些子元素同样可以受 collapsible-always-show 和
 *   collapsible-cascade 类的影响。
 *   - 注意必须是子元素，直接的文本节点不会随折叠隐藏，例如：
 *     <div class="collapsible">123<span>456</span></div>
 *   折叠时，“456”会随折叠隐藏，但“123”不会。
 * - 如果带有 collapsible-using-slide 类，那么折叠时，使用滑动动画而非淡入淡出的
 *   动画。建议当只有一个元素会被隐藏时，才加此类。
 *   - 带有 collapsible-using-slide 类的元素会自动带有 collapsible 类。
 * - 如果带有 collapsible-next 类，那么其折叠的不是其自身的子元素，而是折叠紧随
 *   其后的一个元素。
 *   - 这种情况下，折叠按钮默认附在该 collapsible-next 元素的末尾。
 *   - 带有 collapsible-next 类的元素会自动带有 collapsible 类。
 * - data-collapse-duration 属性可以设置折叠动画的时长，默认为 200 毫秒。
 * - 带有 collapsed 类的元素初始就是已折叠的。
 * - data-expandtext 和 data-collapsetext 可用于控制折叠按钮的显示文字。不支持
 *   繁简转换，但是其默认值是可以正常根据界面语言繁简转换的。
 */
mw.hook("wikipage.content").add(function ($wikipageContent) {
  // 为元素添加“隐藏”和“显示”的按钮。
  var appendToggle = function appendToggle($collapsible, $toggle) {
    var appendHere;
    if ($collapsible.hasClass("collapsible-next")) {
      // 如果有 collapsible-next 类，那么被折叠的元素不在该元素内，此时直接将折叠按钮添加在末尾。
      $collapsible.append($toggle);
    } else if ((appendHere = $collapsible.find(".collapsible-toggle-append-here").not(".collapsible-toggle-appended")).length) {
      // 带有 collapsible-toggle-append-here 类的元素，如果存在，则无论可折叠元素是什么，则强制将折叠按钮添加至该元素中。
      appendHere.append($toggle);
      appendHere.addClass("collapsible-toggle-appended");
      appendHere.parentsUntil($collapsible).addClass("collapsible-always-show");
    } else if ($collapsible.hasClass("navbox")) {
      // navbox 元素的折叠按钮添加至 navbox-title 中，且该 navbox-title 会避免被折叠影响到。
      $collapsible.children(".navbox-title").first().addClass("collapsible-always-show").append($toggle);
    } else if ($collapsible.is("table")) {
      // 对于 table 对象，尝试添加到 caption 中，如果 caption 不存在，则添加到第一行的最后一列，并将第一行设为始终显示。
      var $caption = $collapsible.children("caption");
      if ($caption.length) {
        // 有caption的情况
        $caption.first().append($toggle);
      } else {
        var $trows = $collapsible.children().children("tr");
        $trows.first().addClass("collapsible-always-show").children().last().append($toggle);
      }
    } else {
      // 尝试查找带有 collapsible-always-show 类的子元素，如果存在则将折叠按钮添加至其中。
      // 否则，添加至整个可折叠元素的最前面。
      var $toToggle = $collapsible.children(".collapsible-always-show");
      if (!$toToggle.length) {
        $collapsible.prepend($toggle);
        $toggle.addClass("collapsible-always-show");
      } else {
        $toToggle.first().append($toggle);
      }
    }
  };

  // 隐藏某个可折叠的元素。
  var hide = function hide($collapsible, time) {
    var usesSlide = $collapsible.hasClass("collapsible-using-slide");
    if ($collapsible.hasClass("collapsible-next")) {
      var $element1 = $collapsible.next();
      if (usesSlide) {
        $element1.slideUp(time);
      } else {
        $element1.fadeOut(time);
      }
    } else {
      ($collapsible.is("table") ? $collapsible.children().children("tr") : $collapsible.contents()).each(function (_index, element) {
        var $element2 = $(element);
        if ($element2.hasClass("collapsible-cascade")) {
          hide($element2, time);
        } else if (!$element2.hasClass("collapsible-always-show")) {
          if (usesSlide) {
            $element2.slideUp(time);
          } else {
            $element2.fadeOut(time);
          }
        }
      });
    }
  };

  // 显示某个可折叠的元素。
  var show = function show($collapsible, time) {
    var usesSlide = $collapsible.hasClass("collapsible-using-slide");
    if ($collapsible.hasClass("collapsible-next")) {
      var $element = $collapsible.next();
      if (usesSlide) {
        $element.slideDown(time);
      } else {
        $element.fadeIn(time);
      }
    } else {
      ($collapsible.is("table") ? $collapsible.children().children("tr") : $collapsible.contents()).each(function (_index, element) {
        var $element3 = $(element);
        if ($element3.hasClass("collapsible-cascade")) {
          show($element3, time);
        } else if (!$element3.hasClass("collapsible-always-show")) {
          if (usesSlide) {
            $element3.slideDown(time);
          } else {
            $element3.fadeIn(time);
          }
        }
      });
    }
  };
  var toggle = function toggle($collapsible) {
    var collapsed = $collapsible.hasClass("collapsed");
    var duration = parseInt($collapsible.data("collapse-duration")) || 200;
    if (collapsed) {
      show($collapsible, duration);
      $collapsible.removeClass("collapsed");
    } else {
      hide($collapsible, duration);
      $collapsible.addClass("collapsed");
    }
  };
  $wikipageContent.find(".parent-collapsible, .parent-collapsible-using-slide, .parent-collapsible-next").each(function (_index, element) {
    var $element = $(element),
      $parent = $element.parent();
    element.classList.forEach(function (value) {
      if (value.slice(0, 18) === "parent-collapsible") {
        $parent.addClass(value.replace(/^parent-/, ""));
      }
    });
  });
  $wikipageContent.find(".collapsible-using-slide, .collapsible-next").addClass("collapsible");
  var $collapsibles = $wikipageContent.find(".collapsible");
  if (!$collapsibles.length) {
    return;
  }
  $collapsibles.each(function () {
    var $collapsible = $(this);
    if ($collapsible.data("made-collapsible")) {
      return true;
    }
    var showText = $collapsible.data("expandtext") || "\u5C55".concat(wgULS("开", "開"));
    var hideText = $collapsible.data("collapsetext") || "\u6298".concat(wgULS("叠", "疊"));
    var $toggleLink = $("<a>").addClass("jsLink");
    var $toggle = $("<span>").addClass("collapsetoggle").append("[", $toggleLink, "]");

    // Set the text back to hide if it's not collapsed to begin with
    if (!$collapsible.hasClass("collapsed")) {
      $toggleLink.text(hideText);
    } else {
      $toggleLink.text(showText);
    }
    appendToggle($collapsible, $toggle);

    // 初始化隐藏所有元素，该过程没有动画。
    if ($collapsible.hasClass("collapsed")) {
      hide($collapsible, 0);
    }
    $toggle.on("click", function () {
      toggle($collapsible);
      if (!$collapsible.hasClass("collapsed")) {
        $toggleLink.text(hideText);
      } else {
        $toggleLink.text(showText);
      }
    });
    $collapsible.data("made-collapsible", true);
  });
});
/* global ve */
'use strict';
/* <nowiki> */
/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <zh.wikipedia.org/wiki/MediaWiki:Common.js/edit.js>
 * @dependency ext.gadget.SiteCommonJS
 */
/**
 * 管理员注意：
 *
 * 本页面脚本在使用传统编辑器、可视化编辑器、2017 wikitext编辑器时均会加载，且只加载一次。
 *
 * 但可视化编辑器与2017 wikitext编辑器有两个问题：
 * 1. 此脚本运行时，编辑器可能尚未加载完成。
 * 2. 互相切换时，或者放弃编辑之后再次点击编辑时，浏览器页面不会刷新，本页面脚本不会再次加载。
 * 因此，如果代码与VE/2017 wikitext编辑器相关，需要在进入编辑器时运行，请集中放在后面的
 * mw.hook('ve.activationComplete').add(function () {
 * ……
 * });
 * 中。如有疑问，请到测试站进行测试。
 * 非特殊情况，不应使用。
 */
(function ($, mw) {
    /* 編輯工具欄 */
    /* tip for custom edittools */
    $(function () {
        if (mw.config.get('wgAction') === 'edit' && $('span.oo-ui-fieldLayout-header')) {
            $('span.oo-ui-fieldLayout-header').css('max-width', 'none'); // 一行显示编辑摘要
        }
    });
    $(function () {
        var veCount = 0;
        // 在提交新段落時，讓主題欄在特定情況下失效
        if ($('#no-new-title').length > 0 && $('#editform input[name=wpSection]').val() === 'new') {
            // 傳統文本編輯器
            $('#wpSummary').attr('disabled', true);
            $('#wpSummary').val('');
        }
        // 視覺化編輯器 / 新 wikitext 模式
        var noSectionTitlePages = ['LIB:过滤器处理/报告', 'LIB:字词转换处理/地区词候选'];
        if (noSectionTitlePages.includes(mw.config.get('wgPageName')) && mw.util.getParamValue('section') === 'new') {
            mw.util.addCSS('h2.ve-ui-init-desktopArticleTarget-sectionTitle { display: none; }');
        }
        // 快速选择常见编辑摘要
        // 摘要内容请到[[MediaWiki:Summary]]及相关中文变体页面维护。
        var insertSummary = function ($this, $summary) {
            var summary = $summary.val();
            var $item = $this.parent('.mw-summary-preset-item');
            summary = summary.replace(/\s+$/g, '');
            if (summary !== '') {
                summary += ' ';
            }
            summary += $item.attr('title') || $this.text();
            $this.replaceWith($this.contents());
            $summary.val(summary).trigger('change');
        };
        // 传统编辑器
        $('#wpSummaryLabel .mw-summary-preset').on('click', '.mw-summary-preset-item a', function (e) {
            e.preventDefault();
            insertSummary($(this), $('#wpSummary'));
        });
        // VE / 新Wikitext
        var isInitSummary = false;
        mw.hook('ve.saveDialog.stateChanged').add(function () {
            // 编辑摘要链接在第一次点击“发布更改”按钮之后才会加载，因此需要额外判断
            if (!isInitSummary) {
                $('div.ve-ui-mwSaveDialog-summaryLabel span.mw-summary-preset-item > a')
                    .removeAttr('target')
                    .on('click', function (e) {
                    e.preventDefault();
                    insertSummary($(this), $('div.ve-ui-mwSaveDialog-summary > textarea'));
                });
                isInitSummary = true;
            }
        });
        // 每次进入可视化/2017 wikitext编辑器都要运行的代码请集中放在此处，
        // 由于无法保证加载顺序，请避免另外实现mw.hook('ve.activationComplete').add(...)。
        mw.hook('ve.activationComplete').add(function () {
            // 由于无法保证用户是第一次进入编辑器，需记录进入次数。
            veCount = veCount + 1;
            // 编辑摘要链接初始化
            isInitSummary = false;
        });
    });
    /* 强制预览 */
    $(function () {
        var permittedGroups = ['confirmed', 'autoconfirmed'];
        if (mw.config.get('wgAction') !== 'edit' || permittedGroups.some(function (val) { return mw.config.get('wgUserGroups').includes(val); })) {
            return;
        }
        mw.loader.using(['oojs-ui-core'], function () {
            var originalLabel;
            mw.hook('wikipage.editform').add(function ($editForm) {
                var saveButton;
                try {
                    saveButton = OO.ui.infuse($editForm.find('#wpSaveWidget'));
                }
                catch (_a) {
                    return;
                }
                if (!$('#wikiPreview, #wikiDiff').is(':visible')) {
                    if (saveButton.isDisabled()) {
                        return;
                    }
                    if (originalLabel === undefined) {
                        originalLabel = saveButton.getLabel();
                    }
                    saveButton.setDisabled(true).setLabel("".concat(originalLabel, "\uFF08").concat(wgULS('请先预览', '請先預覽'), "\uFF09"));
                }
                else if (originalLabel !== undefined) {
                    saveButton.setLabel(originalLabel).setDisabled(false);
                }
            });
        });
    });
    /* 取消修訂編輯摘要修正 */
    $(function () {
        var autoSummary = document.querySelectorAll('[name=wpAutoSummary]')[0];
        if (document.location.search.includes('undo=') && autoSummary) {
            autoSummary.value = '';
        }
    });
    /* 检测客户端繁简转换 */
    $(function () {
        $('#antispam-container').append($('<input>').attr({
            id: 'wpAntiConv',
            type: 'text',
            value: '\u6C49\u6F22'
        }));
        var checkAntiConv = function () {
            var $ac = $('#wpAntiConv');
            if ($ac.length > 0 && $ac.val() !== '\u6C49\u6F22') {
                $('#editform :input').attr({ disabled: true, readOnly: true });
                mw.loader.using(['mediawiki.notification'], function () {
                    mw.notify(wgULS('系统检测到您使用了客户端繁简转换软件，且此软件对文本框中的内容进行了转换。请关闭此软件后重新打开编辑界面，再进行编辑。', '系統檢測到您使用了用戶端繁簡轉換軟體，且此軟體對文字方塊中的內容進行了轉換。請關閉此軟體後重新打開編輯介面，再進行編輯。'), { autoHide: false });
                });
            }
            else {
                setTimeout(checkAntiConv, 1000);
            }
        };
        setTimeout(checkAntiConv, 1000);
    });
    /* AI编辑、受资助编辑等特殊声明 */
    $(function () {
        var initialized = [];
        // Statement function
        var statement = function (tagName, labelName) {
            if (initialized[tagName]) {
                return;
            }
            var $layout = ve.init ? $('.ve-ui-mwSaveDialog-checkboxes') : $('#editform').find('.editCheckboxes .oo-ui-horizontalLayout');
            if ($layout.length === 0) {
                return;
            }
            initialized[tagName] = true;
            var checkbox = new OO.ui.CheckboxInputWidget({
                selected: false
            });
            var checkboxField = new OO.ui.FieldLayout(checkbox, {
                align: 'inline',
                label: labelName
            });
            checkbox.on('change', function () {
                var $changeTags;
                if (!ve.init) {
                    var $tagInput = $('<input>').attr({
                        id: 'wpChangeTags',
                        type: 'hidden',
                        name: 'wpChangeTags',
                        value: ''
                    });
                    if ($('#wpChangeTags').length === 0) {
                        $('#editform').prepend($tagInput);
                    }
                    $changeTags = $('#wpChangeTags').val();
                    $changeTags = checkbox.selected ? "".concat($changeTags, ",").concat(tagName) : $changeTags.replace(",".concat(tagName), '');
                    $('#wpChangeTags').val($changeTags);
                }
                else {
                    $changeTags = ve.init.target.saveFields.wpChangeTags ? ve.init.target.saveFields.wpChangeTags() : '';
                    $changeTags = checkbox.selected ? "".concat($changeTags, ",").concat(tagName) : $changeTags.replace(",".concat(tagName), '');
                    ve.init.target.saveFields.wpChangeTags = function () { return $changeTags; };
                }
            });
            $layout.append(checkboxField.$element);
        };
        var add_statement = function () {
            // AI-assisted edit statement
            statement('AI_assisted', wgULS('此编辑由人工智能（AI）辅助', '此編輯由人工智能（AI）輔助'));
        };
        mw.hook('wikipage.editform').add(add_statement);
        mw.hook('ve.saveDialog.stateChanged').add(add_statement);
    });
})(jQuery, mediaWiki);

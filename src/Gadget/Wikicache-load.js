/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @base <https://zh.wikipedia.org/w/index.php?oldid=65190708>
 * @source <https://git.qiuwen.wiki/InterfaceAdmin/Gadgets/src/branch/master/src/Gadgets/Wikicache>
 * @dependency jquery.ui, mediawiki.storage, mediawiki.util
 */
/* <nowiki> */
(function wikicache($, mw) {
  window.wikiCache = {
    version: '0.2.0',
    _msgs: {
      'no-reminder': '不再提醒',
      more: '更多信息',
      ok: '确定',
      load: '载入',
      ignore: '忽略',
      'bracket-left': '（',
      'bracket-right': '）',
      'not-support': '抱歉，您的浏览器无法支持WikiCache，如果您打算使用WikiCache，请更新您的浏览器。',
      'not-support-title': '浏览器过旧',
      'not-support-more-link': 'H:IE',
      'notice-init': '自动保存已启用。',
      'notice-more': '配置',
      'notice-load': '载入上次存档',
      'notice-autosave-success': '自动保存成功。',
      'notice-autosave-failed': '自动保存失败，可能是由于已超出浏览器所允许空间上限',
      'notice-autosave-failed-clear': '清理',
      'notice-load-available': '发现自动保存结果，请选择是否载入。',
      'notice-load-available-confirm': '载入',
      'notice-load-available-ignore': '忽略',
      'settings-title': 'WikiCache配置',
      'settings-autosave-interval': '自动保存间隔：',
      'settings-autosave-interval-suffix': '秒',
      'settings-autosave-interval-too-small': '错误：“自动保存间隔”所设间隔过小（<10秒），请重新设置',
      'settings-autosave-interval-invalid': '错误：请在“自动保存间隔”输入框中输入数字'
    },
    _settings: {
      'autosave-interval': 120
    },
    _style: '.wikicache-dialog{font-size:1em}.wikicache-notice{position:fixed;bottom:0;left:0;z-index:99;display:none;height:1.6em;border-right:1px solid #a7d7f9;border-bottom:1px solid #a7d7f9;white-space:nowrap;font-size:.8em;line-height:1.6em}.wikicache-notice .ui-dialog-titlebar-close{float:right;display:inline-block}.wikicache-dialog a,.wikicache-notice a{color:#0645ad}.wikicache-dialog a:visited,.wikicache-notice a:visited{color:#0b0080}.wikicache-error-message{padding-left:60px;min-height:48px;background:url("https://tu.zhongwen.wiki/images/qiuwen/thumb/0/09/Cross_Mark_(Red).svg/48px-Cross_Mark_(Red).svg.png") no-repeat 0}',
    _autoSaveArea: {
      '#wpTextbox1': function wpTextbox1(element, value) {
        if (value) {
          element.val(value);
        } else {
          return element.val();
        }
      },
      '#wpSummary': function wpSummary(element, value) {
        if (value) {
          element.val(value);
        } else {
          return element.val();
        }
      }
    },
    init: function init() {
      var action = mw.config.get('wgAction');
      if (['edit', 'submit'].indexOf(action) !== -1) {
        window.wikiCache._initEdit();
      } else if (action === 'view') {
        window.wikiCache._initView();
      }
    },
    _initView: function _initView() {
      if (window.localStorage) {
        window.wikiCache._loadStyle();
        window.wikiCache._loadSettings();
      }
    },
    _initEdit: function _initEdit() {
      window.wikiCache._loadStyle();
      var errdlg = window.wikiCache._errorDialog;
      var msgs = window.wikiCache._msgs;
      if (!window.localStorage) {
        errdlg(0, msgs['not-support-title'], msgs['not-support'], mw.util.getUrl(msgs['not-support-more-link']));
        return;
      }
      $('#editform').on('wikiCacheSettingsUpdate', window.wikiCache._autoSave).on('submit', window.wikiCache._onSubmit);
      window.wikiCache._loadSettings();
      window.wikiCache._defaultNotice();
      if (window.location.hash.indexOf('wikicache=autoload') !== -1) {
        window.wikiCache._load();
      } else {
        window.wikiCache._initLoad();
      }
    },
    _loadStyle: function _loadStyle() {
      mw.util.addCSS(window.wikiCache._style);
    },
    _loadSettings: function _loadSettings() {
      var settings = mw.storage.getObject('wikicache-settings');
      if (settings instanceof Object) {
        $.extend(window.wikiCache._settings, settings);
      }
      $('#editform').trigger('wikiCacheSettingsUpdate');
    },
    _saveSettings: function _saveSettings() {
      mw.storage.setObject('wikicache-settings', window.wikiCache._settings);
      $('#editform').trigger('wikiCacheSettingsUpdate');
    },
    _errorDialog: function _errorDialog(code, title, msg, more) {
      var noreminderid = "no-reminder-".concat(code);
      if (mw.storage.get(noreminderid)) {
        return;
      }
      var msgs = window.wikiCache._msgs;
      var buttons = {};
      buttons[msgs.ok] = function () {
        $(this).dialog('close').remove();
      };
      $('<div>').addClass('wikicache-dialog wikicache-error').attr('title', title).append($('<div>').addClass('wikicache-error-message').html("".concat(msg, "&nbsp;").concat(msgs['bracket-left'])).append($('<a>').attr('href', more).html(msgs.more)).append(msgs['bracket-right'])).append($('<p>').append($('<input>').attr({
        id: noreminderid,
        type: 'checkbox',
        name: 'noreminder'
      })).append($('<label>').attr('for', noreminderid).html(msgs['no-reminder']))).appendTo($('body')).dialog({
        buttons: buttons,
        draggable: false,
        modal: true,
        width: 450,
        beforeClose: function beforeClose() {
          if ($("#".concat(noreminderid), this).attr('checked')) {
            mw.storage.set(noreminderid, '1');
          }
        }
      });
    },
    _defaultNotice: function _defaultNotice() {
      var msgs = window.wikiCache._msgs;
      var more = {};
      more[msgs['notice-more']] = window.wikiCache._settingsDialog;
      more[msgs['notice-load']] = function () {
        window.wikiCache._load();
      };
      window.wikiCache._notice(msgs['notice-init'], more);
    },
    _notice: function _notice(msg, more) {
      var notice = $('#wikicache-notice');
      if (notice.length === 0) {
        notice = $('<div>').addClass('ui-widget-content wikicache-notice').attr('id', 'wikicache-notice');
      }
      notice.empty().off('mouseenter').off('mouseleave').append(msg).appendTo($('body')).fadeIn();
      if (more instanceof Object) {
        notice.on('mouseenter', function () {
          var msgs = window.wikiCache._msgs;
          var el = $('<span>').addClass('wikicache-more').appendTo(notice).append(msgs['bracket-left']);
          var first = true;
          el.appendTo(notice);
          for (var _msg in more) {
            if (Object.prototype.hasOwnProperty.call(more, _msg)) {
              if (first) {
                first = false;
              } else {
                el.append('&nbsp;|&nbsp;');
              }
              el.append($('<a>').attr('href', '#').html(_msg).on('click', more[_msg]));
            }
          }
          el.append(msgs['bracket-right']);
        }).on('mouseleave', function () {
          $('.wikicache-more', this).remove();
        });
      }
    },
    _settingsDialog: function _settingsDialog() {
      var msgs = window.wikiCache._msgs;
      var settings = window.wikiCache._settings;
      var buttons = {};
      buttons[msgs.ok] = function () {
        $(this).dialog('close');
      };
      var dia = $('<div>').addClass('wikicache-dialog').attr('title', msgs['settings-title']).append($('<p>').append($('<label>').attr('for', 'autosave-interval').html(msgs['settings-autosave-interval'])).append($('<input>').attr({
        id: 'autosave-interval',
        type: 'text',
        size: 5
      }).val(settings['autosave-interval'])).append("&nbsp;".concat(msgs['settings-autosave-interval-suffix'])));
      dia.appendTo($('body')).dialog({
        buttons: buttons,
        draggable: false,
        modal: true,
        width: 400,
        beforeClose: function beforeClose() {
          var interval = $('#autosave-interval', dia).val();
          if (Number.isNaN(interval)) {
            mw.notify(msgs['settings-autosave-interval-invalid'], {
              type: 'error'
            });
            return false;
          } else {
            interval = Number.parseInt(interval);
            if (interval < 10) {
              mw.notify(msgs['settings-autosave-interval-too-small'], {
                type: 'error'
              });
              return false;
            }
            settings['autosave-interval'] = interval;
          }
          window.wikiCache._saveSettings();
        }
      });
      return false;
    },
    _autoSaveId: undefined,
    _autoSave: function _autoSave() {
      clearTimeout(window.wikiCache._autoSaveId);
      window.wikiCache._autoSaveId = setTimeout(function () {
        window.wikiCache._save();
        window.wikiCache._autoSave();
      }, window.wikiCache._settings['autosave-interval'] * 1000);
    },
    _save: function _save() {
      var asarea = window.wikiCache._autoSaveArea;
      var autosave = {
        _path: window.location.pathname + window.location.search,
        _date: new Date()
      };
      for (var sele in asarea) {
        if (Object.prototype.hasOwnProperty.call(asarea, sele)) {
          autosave[sele] = asarea[sele]($(sele));
        }
      }
      var thekey = "wikicache-autosave-".concat(mw.config.get('wgPageName'));
      var section = $('input[name="wpSection"]:first').val();
      if (section) {
        thekey += "_".concat(section);
      }
      mw.storage.setObject(thekey, autosave, 2592e3); // 30 days
      setTimeout(window.wikiCache._defaultNotice, 1000);
    },
    _initLoad: function _initLoad() {
      var msgs = window.wikiCache._msgs;
      var thekey = "autosave-".concat(mw.config.get('wgPageName'));
      var section = $('input[name="wpSection"]:first').val();
      if (section) {
        thekey += "_".concat(section);
      }
      var autosave = mw.storage.getObject(thekey);
      if (autosave instanceof Object) {
        var more = {};
        more[msgs['notice-load-available-confirm']] = function () {
          window.wikiCache._load(autosave);
          return false;
        };
        more[msgs['notice-load-available-ignore']] = function () {
          window.wikiCache._defaultNotice();
          window.wikiCache._autoSave();
          return false;
        };
        window.wikiCache._notice(msgs['notice-load-available'], more);
        clearTimeout(window.wikiCache._autoSaveId);
      }
    },
    _load: function _load(autosave) {
      if (!(autosave instanceof Object)) {
        var thekey = "autosave-".concat(mw.config.get('wgPageName'));
        var section = $('input[name="wpSection"]:first').val();
        if (section) {
          thekey += "_".concat(section);
        }
        autosave = mw.storage.getObject(thekey);
      }
      var asarea = window.wikiCache._autoSaveArea;
      for (var sele in asarea) {
        if (Object.prototype.hasOwnProperty.call(asarea, sele)) {
          asarea[sele]($(sele), autosave[sele]);
        }
      }
      window.wikiCache._defaultNotice();
      window.wikiCache._autoSave();
    },
    _onSubmit: function _onSubmit() {
      window.wikiCache._save();
      var thekey = "wikicache-autosave-".concat(mw.config.get('wgPageName'));
      var section = $('input[name="wpSection"]:first').val();
      if (section) {
        thekey += "_".concat(section);
      }
      mw.storage.remove(thekey);
    }
  };
  $(window.wikiCache.init);
})($, mw);
/* </nowiki> */

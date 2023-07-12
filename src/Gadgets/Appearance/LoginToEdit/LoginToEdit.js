/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <https://git.qiuwen.wiki/InterfaceAdmin/Gadgets/src/branch/master/src/Gadgets/LoginToEdit>
 * @dependency ext.gadget.i18n, mediawiki.util, oojs-ui-core, oojs-ui-windows
 */
/**
 * +--------------------------------------------------------+
 * |         === WARNING: GLOBAL GADGET FILE ===            |
 * +--------------------------------------------------------+
 * |      All changes should be made in the repository,     |
 * |              otherwise they will be lost.              |
 * +--------------------------------------------------------+
 * |      Changes to this page may affect many users.       |
 * |  Please discuss changes at talk page before editing.   |
 * +--------------------------------------------------------+
 */
/* <nowiki> */
'use strict';

$(function loginToEdit() {
  if (mw.config.get('wgUserName')) {
    return;
  }
  var i18nMessages = function i18nMessages() {
    var _i18n = i18n,
      localize = _i18n.localize;
    return {
      Cancel: localize({
        ja: 'キャンセル',
        'zh-hans': '暂不登录账号',
        'zh-hant': '暫不登入賬戶'
      }),
      Login: localize({
        ja: 'ログイン',
        'zh-hans': '登录已有账号',
        'zh-hant': '登入已有賬戶'
      }),
      Register: localize({
        ja: 'アカウントを作成',
        'zh-hans': '注册新的账号',
        'zh-hant': '註冊新的賬戶'
      }),
      Edit: localize({
        ja: '編集',
        'zh-hans': '编辑',
        'zh-hant': '編輯'
      }),
      dialogTitle: localize({
        en: 'Welcome to Youshou Archives!',
        ja: '有獣アーカイブスへようこそ！',
        'zh-hans': '欢迎来到有兽档案馆！',
        'zh-hant': '歡迎來到有獸檔案館！'
      }),
      dialogMessage: localize({
        en: 'You have not yet logged in. Register and log in to your account to contribute.',
        ja: 'あなたはまだ有獣アーカイブスにログインしていません。アカウントを作成し、ログインして有獣アーカイブスを改善することができます。',
        'zh-hans': '您尚未登录到有兽档案馆。您可以注册并登录账号，帮助完善有兽档案馆。',
        'zh-hant': '您尚未登錄到有獸檔案館。您可以注冊並登錄賬戶，幫助完善有獸檔案館。'
      })
    };
  };
  var messages = i18nMessages();
  var message = function message(key) {
    return messages[key] || key;
  };
  var isCitizen = mw.config.get('skin') === 'citizen';
  var loginURL = "/wiki/Special:Userlogin?returnto=".concat(mw.util.rawurlencode(mw.config.get('wgPageName')));
  var registerURL = "/wiki/Special:CreateAccount?returnto=".concat(mw.util.rawurlencode(mw.config.get('wgPageName')));
  var openDialog = function openDialog() {
    var messageDialog = new OO.ui.MessageDialog();
    var windowManager = new OO.ui.WindowManager();
    var windowOpeningData = {
      title: message('dialogTitle'),
      message: message('dialogMessage'),
      actions: [{
        action: 'login',
        flags: ['primary', 'progressive'],
        label: $('<b>').text(message('Login'))
      }, {
        action: 'register',
        flags: 'progressive',
        label: $('<b>').text(message('Register'))
      }, {
        action: 'cancel',
        flags: ['safe', 'close'],
        label: $('<b>').text(message('Cancel'))
      }]
    };
    messageDialog.getActionProcess = function (action) {
      if (action === 'login') {
        if ('ontouchstart' in document) {
          location.href = loginURL;
        }
        $('#pt-login').trigger('click');
      } else if (action === 'register') {
        location.href = registerURL;
      }
      return new OO.ui.Process(function () {
        windowManager.clearWindows();
      });
    };
    windowManager.$element.appendTo(document.body);
    windowManager.addWindows([messageDialog]);
    windowManager.openWindow(messageDialog, windowOpeningData);
  };
  var $caViewsource = $('#ca-viewsource');
  if ($caViewsource.length) {
    var editIcon = isCitizen ? '<span class="citizen-ui-icon mw-ui-icon-wikimedia-edit"></span>' : '';
    $caViewsource.attr('id', 'ca-edit').find('a').attr('title', message('Edit')).html("".concat(editIcon).concat(message('Edit')));
    $('#ca-edit a').on('click', function (event) {
      event.preventDefault();
      openDialog();
    });
  }
  if (['edit', 'submit'].indexOf(mw.config.get('wgAction')) !== -1) {
    openDialog();
  }
});
/* </nowiki> */

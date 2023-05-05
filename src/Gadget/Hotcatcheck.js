/*
* CheckCategories HotCat Extension –
* removes the template when categorizing (prompts before) with HotCat and
* adds a link "Categories are OK" to the category-section
*
* <nowiki>
*
* @rev 2 (2014-03-20)
* @author [[User:Rillke]], 2012
* @source User:Rillke/checkCat2.js @wikimedia Commons
*/

/*global mw:false, $:false, alert:false */
/*jshint curly:false, smarttabs:true, nomen:false */

mw.loader.using(['mediawiki.user', 'mediawiki.util', 'jquery.cookie'], function () {
'use strict';
if (6 !== mw.config.get('wgNamespaceNumber') || window.HotCatAutoRemoveCheckCatOptOut || !$('.checkcategories')[0]) return;

var chCatRE = /\{\{[Cc]heck[ _]categories[^\}\{]*\}\}/g,
	selfName = '([[MediaWiki:Gadget-Hotcatcheck.js|Script]]): ',
	cookieName = 'checkCat',
	cookie = $.cookie(cookieName);

/**
 ** A few styling helper functions
 **
 **/
var createjIcon = function (iconClass) {
	return $('<span>')
		.attr('class', 'ui-icon ' + iconClass + ' catcheck-inline-icon')
		.text(' ');
};
var createNotifyArea = function (textNode, icon, state) {
	return $('<div>')
		.attr('class', 'ui-widget')
		.append(
			$('<div>')
			.attr({
				'class': state + ' ui-corner-all',
				style: 'margin-top: 20px; padding: 0.7em;'
			})
			.append(
				$('<p>').append(
				createjIcon(icon).css('marginRight', '0.3em'),
				textNode)));
};
mw.util.addCSS('.catcheck-inline-icon { display: inline-block; position: relative; top: 2px; }');

// Remove "check categories" when using HotCat
// Only executed on first submit
$('body').one('submit.checkCatListener', '#hotcatCommitForm', function (e) {
	if ('disabled' === cookie) return true;

	var hotCatForm = this,
		newVal = hotCatForm.wpTextbox1.value.replace(chCatRE, ''),
		dlgButtons = {},
		$dlgCheckCookie, $permaSaveHint, $textHintNode, $dlg;

	var doRemove = function () {
		hotCatForm.wpSummary.value = 'Removing [[Template:Check categories|{' + '{Check categories}}]] ' + hotCatForm.wpSummary.value;
		hotCatForm.wpTextbox1.value = newVal;
	};
	var writeCookie = function (val) {
		$.cookie(cookieName, val, {
			expires: 7,
			path: '/'
		});
	};
	dlgButtons['Yes, Remove'] = function () {
		doRemove();
		if ($dlgCheckCookie[0].checked) writeCookie('auto');
		$(this).dialog('close');
	};
	dlgButtons['No, keep it'] = function () {
		if ($dlgCheckCookie[0].checked) writeCookie('disabled');
		$(this).dialog('close');
	};
	var _addToJS = function (e) {
		e.preventDefault();
		if ($permaSaveHint.hasClass('ui-state-disabled')) return;

		var $el = $(this);

		$el.off('click').text('Please wait.');
		$permaSaveHint.addClass('ui-state-disabled');
		var params = {
			action: 'edit',
			title: 'User:' + mw.config.get('wgUserName') + '/common.js',
			summary: selfName + 'Saving HotCat configuration.',
			appendtext: $el.data('addText'),
			token: (window['wikilove-edittoken'] || mw.user.tokens.get('csrfToken')),
			format: 'json'
		};
		var editDone = function (editStat) {
			if (!editStat) return;
			if (editStat.error) {
				alert('Unable to save to your common.js using the API\n' + editStat.error.code + '\n' + editStat.error.info);
				$el.text('Edit-Error!');
			} else {
				$el.text('Done.');
				$permaSaveHint.fadeOut();
			}
		};
		$.post(mw.util.wikiScript('api'), params, editDone);
	};
	/**
	 ** On COM:VP there were people who said:
	 ** "Categorizing with HotCat does legit automated removal of the check-cat-message"
	 ** So we invented a dialog that should be readable by users even with very few English skills.
	 **/
	var prompt = function () {
		$dlgCheckCookie = $('<input type="checkbox" />').attr({
			id: 'hotCatAutoRemoveCheckCatCookie'
		}).change(function () {
			if (this.checked) {
				$permaSaveHint.fadeIn();
			} else {
				$permaSaveHint.fadeOut();
			}
		});
		$textHintNode = $('<ul>');
		$('<li>').append($('<a>', {
			href: '#',
			text: 'Disable this feature.'
		}).data('addText', '\nwindow.HotCatAutoRemoveCheckCatOptOut = true;').click(_addToJS))
			.appendTo($textHintNode);
		$('<li>').append($('<a>', {
			href: '#',
			text: 'Remove {{check categories}} when editing using HotCat without prompting.'
		}).data('addText', '\nwindow.HotCatAutoRemoveCheckCat = true;').click(_addToJS))
			.appendTo($textHintNode);

		$permaSaveHint = createNotifyArea($('<span>', {
			text: 'Save these setting in your common.js: '
		}).append($textHintNode), 'ui-icon-info', 'ui-state-highlight');
		$dlg = $('<div>').append($('<span>').attr({
			style: 'font-size: 2em; line-height: 1.8em;'
		}).append(
			$('<span>').text(" {{check categories}} ").attr({
			style: 'background-color:#F8CCB0; text-decoration:line-through !important; display:inline-block;'
		}),
			$('<span>').text(" ?")))
			.append('<br>', $dlgCheckCookie, $('<label>').attr({
				'for': 'hotCatAutoRemoveCheckCatCookie'
			}).text('Don\'t ask again'), '<br>')
			.append(mw.user.isAnon() ? '' : $permaSaveHint.hide());

		$dlg.dialog({
			modal: true,
			closeOnEscape: true,
			title: "{{check categories}} (−)?",
			width: 450,
			buttons: dlgButtons,
			close: function () {
				$('#hotcatCommitForm').submit();
			},
			open: function () {
				var $buttons = $(this).parent().find('.ui-dialog-buttonpane button');
				$buttons.eq(0).button({
					icons: {
						primary: 'ui-icon-circle-check'
					}
				});
				$buttons.eq(1).button({
					icons: {
						primary: 'ui-icon-cancel'
					}
				});
			}
		});
	};
	if (newVal !== hotCatForm.wpTextbox1.value) {
		if (window.HotCatAutoRemoveCheckCat || cookie === 'auto') {
			doRemove();
			return true;
		}
		e.preventDefault();
		mw.loader.using(['jquery.ui'], function () {
			prompt();
		});
	}
	return true;
});

// Add OK-Link to the cats panel
var $okLink = $('<a>', {
	href: '#',
	html: '<s>{{Check categories}}</s>',
	title: 'Categories are OK! Immediately remove the template.'
}).click(function (e) {
	e.preventDefault();
	var $el = $(this);
	$el.off('click');
	var doEdit = function (result) {
		if (!result) return;
		$el.text('Doing.');
		var text = result.replace(chCatRE, '');
		if (text === result) {
			$el.text('Template not found!');
			return;
		}
		var params = {
			action: 'edit',
			title: mw.config.get('wgPageName'),
			nocreate: 1,
			summary: selfName + 'Categories are checked and OK. You can help [[Category:Media needing category review|reviewing]]!',
			text: text,
			token: (window['wikilove-edittoken'] || mw.user.tokens.get('csrfToken')),
			format: 'json'
		};

		var editDone = function (editStat) {
			if (!editStat) return;
			if (editStat.error) {
				alert('Unable to remove "Check categories" with the API\n' + editStat.error.code + '\n' + editStat.error.info);
				$el.text('Edit-Error!');
			} else {
				$el.text('Edit Done.');
			}
			$('.checkcategories').fadeOut();
		};
		$el.text('Doing..');
		$.post(mw.util.wikiScript('api'), params, editDone);
	};
	$el.text('Doing');
	$.ajax({
		url: mw.config.get('wgScript'),
		data: {
			action: 'raw',
			title: mw.config.get('wgPageName').replace(/ /g, '_'),
			maxage: 0,
			smaxage: 0
		},
		dataType: 'text',
		error: function () {
			$el.text('Error!');
		},
		success: doEdit,
		type: 'GET',
		cache: false
	});
});
$(function () {
	$('#catlinks').find('ul:first').append($('<li>').append($okLink));
});

});
//</nowiki>
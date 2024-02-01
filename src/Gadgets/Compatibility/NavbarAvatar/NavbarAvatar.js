
$(function () {
    var username = mw.user.getName()
    if (username) {
        username = username.replace(' ', '_'); //避免名称带空格时无法显示头像
        var src = 'https://youshou.wiki/extensions/Avatar/avatar.php?user=' + username;
    }
    else {
        var src = 'https://youshou.wiki/images/avatars/default/default.gif'
    }
    $('.mw-ui-icon-wikimedia-userAvatar').css({
        'background-image': 'url(' + src + ')',
    });
});
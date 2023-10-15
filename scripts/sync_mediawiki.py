"""
本同步脚本文件采用GPLv3授权
@license: <https://www.gnu.org/licenses/gpl-3.0.zh-cn.html>
@author: <github@Blossomstripe>
@source: <https://github.com/TopRealm/InterfaceCodes/blob/master/scripts/sync_mediawiki.py>
"""
import os
import subprocess as sp

import mwclient

# 常量部分
# 定义src/others中需要同步的目录
DIR = ["", "Group"]
# 定义MediaWiki:Gadgets-definition页顶、页底内容
PAGE_TOP = """<div class=\"mw-message-box mw-message-box-notice\">
*[[Special:Gadgets]]
*[[Special:GadgetUsage]]
*[[Special:参数设置#mw-prefsection-gadgets]]
*本页面由[[User:Github-bot|Github-bot]]自动维护。最后一次更新时间：{{#time: Y-m-d H:i:s "(CST)"|{{REVISIONTIMESTAMP}}}}
</div>
<div style='font-family:monospace; word-break:break-all;'>
"""
PAGE_BOTTOM = """
</div>
"""

def last_commit_info(file_name: str) -> tuple:
    """调用bash的git命令，获取给定文件的最后一次commit哈希值及留言。

    Args:
        file_name (str): 文件路径

    Raises:
        Exception: 若git返回的哈希值未通过格式检查，则抛出异常

    Returns:
        tuple: (获取的完整SHA-1哈希值, 留言)
    """    
    cmd = f"git log --pretty=format:\"%H %s\" -1 -- {file_name}"
    ans = sp.run(cmd, stdout=sp.PIPE, shell=True).stdout.decode("utf-8").strip()
    commit_hash = ans.split(" ", 1)[0]
    commit_msg = ans.split(" ", 1)[1]
    # 格式检查
    if commit_hash.isalnum() and len(commit_hash) == 40:
        return (commit_hash, commit_msg)
    else:
        raise Exception("获取Commit Hash失败：格式检查未通过")


def sync_file(site: mwclient.Site, page_name: str, text_new: str, file_name=None) -> None:
    """将传入的新内容与MediaWiki对应页面内容进行比对，若不一致则对页面进行更新。

    Args:
        site (mwclient.Site): 已登录的mwclient.Site对象
        page_name (str): 目标MediaWiki页面名称
        text_new (str): 用于比对的新内容
        file_name (_type_, optional): 文件名，用于调用last_commit_hash函数获取commit记录。默认值为None，即不在编辑摘要中记录commit哈希
    """    
    page = site.pages[page_name]
    text_old = page.text()
    # MediaWiki会自动删除上传文本末尾的空白字符
    if text_old != text_new.rstrip():
        summary = "Git更新："
        if file_name is not None:
            commit_hash, commit_msg = last_commit_info(file_name)
            summary += f"([https://github.com/TopRealm/InterfaceCodes/commit/{commit_hash} {commit_hash[:7]}]) {commit_msg}"
        page.edit(text_new, summary)
        print(page_name, "\t", "changed")
    else:
        print(page_name, "\t", "not_changed")


# 登录MediaWiki
site = mwclient.Site("youshou.wiki", scheme="https", path="/")
site.login("Github-bot", os.environ["MW_BOT_PASSWORD"])


# 生成Gadgets-definition
gadgets_def = [PAGE_TOP]
blocks = os.listdir("./src/Gadgets")
blocks = [i for i in blocks if os.path.isdir(f"./src/Gadgets/{i}")]
blocks.sort()

for block_name in blocks:
    gadgets_def.append(f"\n== {block_name} ==\n")
    block_dir = os.path.join("./src/Gadgets", block_name)
    gadgets = os.listdir(block_dir)
    gadgets = [i for i in gadgets if os.path.isdir(os.path.join(block_dir, i))]
    gadgets.sort()

    for gadget_name in gadgets:
        gadget_dir = os.path.join(block_dir, gadget_name)
        with open(os.path.join(gadget_dir, ".options"), "r", encoding="utf-8") as pfile:
            gadget_options = pfile.read().strip()
        gadget_record = f"* {gadget_options}\n"
        gadgets_def.append(gadget_record)

gadgets_def.append(PAGE_BOTTOM)
sync_file(site, "MediaWiki:Gadgets-definition", "".join(gadgets_def))


# 同步src/Gadgets中的文件
blocks = os.listdir("./src/Gadgets")
blocks = [i for i in blocks if os.path.isdir(f"./src/Gadgets/{i}")]

for block_name in blocks:
    block_dir = os.path.join("./src/Gadgets", block_name)
    gadgets = os.listdir(block_dir)
    gadgets = [i for i in gadgets if os.path.isdir(os.path.join(block_dir, i))]

    for gadget_name in gadgets:
        gadget_dir = os.path.join(block_dir, gadget_name)
        gadget_files = os.listdir(gadget_dir)
        # 不同步以.为文件名开头的文件
        gadget_files = [i for i in gadget_files if (os.path.isfile(os.path.join(gadget_dir, i)) and i[0] != ".")]

        for gadget_file_name in gadget_files:
            gadget_file_whole_name = os.path.join(gadget_dir, gadget_file_name)
            with open(gadget_file_whole_name, "r", encoding="utf-8") as pfile:
                text_new = pfile.read()
            sync_file(site, f"MediaWiki:Gadget-{gadget_file_name}", text_new, gadget_file_whole_name)


# 同步src/others中的文件
for sub_dir in DIR:
    whole_dir = os.path.join("./src/others", sub_dir)
    files = os.listdir(whole_dir)
    # 不同步以.为文件名开头的文件
    files = [i for i in files if (os.path.isfile(os.path.join(whole_dir, i)) and i[0] != ".")]
    for file_name in files:
        file_whole_name = os.path.join(whole_dir, file_name)
        with open(file_whole_name, "r", encoding="utf-8") as pfile:
            text_new = pfile.read()

        if sub_dir:
            page_name = f"MediaWiki:{sub_dir}-{file_name}"
        else:
            page_name = f"MediaWiki:{file_name}"
        
        sync_file(site, page_name, text_new, file_whole_name)

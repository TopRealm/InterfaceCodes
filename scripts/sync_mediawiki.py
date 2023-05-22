import os

import mwclient

# 常量部分
# 定义src/others中需要同步的目录
DIR = ["", "Group"]
# 定义MediaWiki:Gadgets-definition页顶、页底内容
PAGE_TOP = """<div class=\"mw-message-box mw-message-box-notice\">
*[[Special:Gadgets]]
*[[Special:GadgetUsage]]
*[[Special:参数设置#mw-prefsection-gadgets]]
*本页面由[[User:Github-bot|]]自动维护。最后一次更新时间：{{#time: Y-m-d H:i:s "(CST)"|{{REVISIONTIMESTAMP}}}}
</div>
<div style='font-family:monospace; word-break:break-all;'>
"""
PAGE_BOTTOM = """
</div>
"""

def sync_file(site: mwclient.Site, page_name: str, text_new: str):
    page = site.pages[page_name]
    text_old = page.text()
    # MediaWiki会自动删除上传文本末尾的空白字符
    if text_old != text_new.rstrip():
        summary = "Git更新：代码仓库同步更新"
        page.edit(text_new, summary)
        print(page_name, "\t", "changed")
    else:
        print(page_name, "\t", "not_changed")

# 登录MediaWiki
site = mwclient.Site("wiki.zorua.top", scheme="https", path="/")
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
        gadget_files = os.listdir(gadget_dir)
        # 忽略所有以.开头的文件
        gadget_files = [i for i in gadget_files if (os.path.isfile(os.path.join(gadget_dir, i)) and i[0] != ".")]
        gadget_files.sort()
        
        with open(os.path.join(gadget_dir, ".options"), "r", encoding="utf-8") as pfile:
            gadget_options = pfile.read().strip()
        
        gadget_record = f"* {gadget_name}[{gadget_options}]|{'|'.join(gadget_files)}\n"
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
            with open(os.path.join(gadget_dir, gadget_file_name), "r", encoding="utf-8") as pfile:
                text_new = pfile.read()
            sync_file(site, f"MediaWiki:Gadget-{gadget_file_name}", text_new)


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
        
        sync_file(site, page_name, text_new)

import os

import mwclient

# Directories of files that will be checked for updates
# "src" not included
DIR = ["", "Gadget", "Group"]

def sync_file(site: mwclient.Site, page_name: str, text_new: str):
    page = site.pages[page_name]
    text_old = page.text()
    # MediaWiki will automatically strip all blank characters at the tail of codes
    if text_old != text_new.rstrip():
        summary = "Git更新：代码仓库同步更新"
        page.edit(text_new, summary)
        print(page_name, "\t", "changed")
    else:
        print(page_name, "\t", "not_changed")

site = mwclient.Site("wiki.zorua.top", scheme="https", path="/")
site.login("Github-bot", os.environ["MW_BOT_PASSWORD"])

for dir in DIR:
    dir_whole = os.path.join("src", dir)
    for file_name in os.listdir(dir_whole):
        file_whole_name = os.path.join(dir_whole, file_name)
        if os.path.isfile(file_whole_name) and (
            file_whole_name.endswith(".css") or file_whole_name.endswith(".js")
        ):
            with open(file_whole_name, "r", encoding="utf-8") as pfile:
                text_new = pfile.read()

            if dir:
                page_name = f"MediaWiki:{dir}-{file_name}"
            else:
                page_name = f"MediaWiki:{file_name}"
            
            sync_file(site, page_name, text_new)

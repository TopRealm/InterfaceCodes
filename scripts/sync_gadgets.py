import os

import mwclient

site = mwclient.Site("wiki.zorua.top", scheme="https", path="/")
site.login("Github-bot", os.environ["MW_BOT_PASSWORD"])
print(os.environ)

for filename in os.listdir("src"):
    file_whole_name = os.path.join("src", filename)
    if os.path.isfile(file_whole_name) and (
        file_whole_name.endswith(".css") or file_whole_name.endswith(".js")
    ):
        with open(file_whole_name, "r", encoding="utf-8") as pfile:
            text_new = pfile.read()

        page = site.pages[f"MediaWiki:Gadget-{filename}"]
        text_old = page.text()
        if text_old != text_new:
            summary = "bot: synchronized from Github"
            # page.edit(text_new, summary)
            page_test = site.pages[f"User:Blossomstripe/沙盒"]
            text_test = page_test.text() + "\ntest"
            page_test.edit(text_test, "github-test")
            print(filename, "\t", "changed")
        else:
            print(filename, "\t", "not_changed")

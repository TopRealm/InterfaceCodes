/* global customizeToolbar */
'use strict';

/* <nowiki> */
/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <zh.wikipedia.org/wiki/MediaWiki:Gadget-Edittools-vplus.js>
 * @dependency ext.gadget.Edittools-vector
 */
customizeToolbar(function () {
  if (mw.config.get('wgNamespaceNumber') === 8 || mw.config.get('wgNamespaceNumber') === 828) {
    return;
  }
  this.wikiEditor('addToToolbar', {
    sections: {
      pageedits: {
        type: 'toolbar',
        // Can also be 'booklet'
        label: wgULS('条目编辑', '條目編輯')
      }
    }
  });
  this.wikiEditor('addToToolbar', {
    section: 'pageedits',
    groups: {
      pageedits: {}
    }
  });
  this.wikiEditor('addToToolbar', {
    section: 'pageedits',
    group: 'pageedits',
    tools: {
      articleEdit: {
        label: wgULS('条目编辑', '條目編輯'),
        type: 'select',
        list: {
          elink: {
            label: wgULS('外部链接章节', '外部連結章節'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '\n== 外部链接 ==\n* [',
                periMsg: '网页地址 网页说明',
                post: ']\n'
              }
            }
          },
          seealso: {
            label: wgULS('参见章节', '參見章節'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '\n== 参见 ==\n* [[',
                periMsg: '参见地址',
                post: ']]\n'
              }
            }
          },
          Disambig: {
            label: wgULS('消歧义', '消歧義'),
            action: {
              type: 'encapsulate',
              options: {
                pre: "\n'''{{subst:" + "PAGENAME}}'''可以指：\n",
                periMsg: '* [[歧义1]]：描述1\n* [[歧义2]]：描述2',
                post: '\n{{disambig}}'
              }
            }
          },
          otheruses: {
            label: wgULS('条目消歧义', '條目消歧義'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{Otheruses|',
                periMsg: '条目名称|subject=本页主題描述|other=同名或類似名的其它條目描述',
                post: '}}'
              }
            }
          },
          Current: {
            label: wgULS('正在发生', '正在發生'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{Current}}'
              }
            }
          }
        }
      },
      articleMaintenance: {
        label: wgULS('页面维护', '頁面維護'),
        type: 'select',
        list: {
          stub: {
            label: '小作品',
            action: {
              type: 'encapsulate',
              options: {
                pre: '\n{{',
                post: '小作品}}'
              }
            }
          },
          inuse: {
            label: wgULS('正在编辑', '正在編輯'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{Inuse}}'
              }
            }
          },
          Substub: {
            label: wgULS('小小条目', '小小條目'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{subst:Substub'.concat('/auto', '}}')
              }
            }
          },
          mergeto: {
            label: wgULS('合并本条目到', '合併本條目到'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{mergeto|',
                periMsg: '合并本条目到的条目名称',
                post: '}}'
              }
            }
          },
          mergefrom: {
            label: wgULS('合并到本条目', '合併到本條目'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{mergefrom|',
                periMsg: '需要合并到本条目的条目名称',
                post: '}}'
              }
            }
          },
          split: {
            label: wgULS('分拆条目', '分拆條目'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{Split}}'
              }
            }
          }
          /* translation: {
          	label: wgULS("正在翻译", "正在翻譯"),
          	action: {
          		type: "encapsulate",
          		options: {
          			pre: "{{subst:Translating/auto|tfrom=",
          			periMsg: "在此填入来源",
          			post: "|tpercent=翻譯進度百分數}}"
          		}
          	}
          } */
        }
      },

      zhhanshant: {
        label: '繁简转换',
        type: 'select',
        list: {
          noconv: {
            label: wgULS('取消繁简转换', '取消繁簡轉換'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '-{',
                periMsg: '不转换内容',
                post: '}-'
              }
            }
          },
          title: {
            label: wgULS('标题错误', '標題錯誤'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '-{T|',
                periMsg: '正确标题名称',
                post: '}-'
              }
            }
          },
          noteTA: {
            label: wgULS('标题全文转换', '標題全文轉換'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{noteTA\n',
                periMsg: '|G1=公共组名\n|1=zh-cn:大陆;zh-tw:台灣;zh-hk:香港;zh-sg:新马;\n|2=zh-cn:大陆;zh-tw:台灣;zh-hk:香港;zh-sg:新马;\n',
                post: '}}'
              }
            }
          },
          image: {
            label: wgULS('地区语言图像', '地區語言圖像'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{Image\n',
                periMsg: '\t|zh=無轉換圖像名\n\t|zh-hans=简体图像名\n\t|zh-hant= 繁体圖像名\n\t|zh-cn=大陆图像名\n\t|zh-tw=臺灣圖像名\n\t|zh-hk=香港圖像名\n\t|zh=马新图像名\n\t|图像属性\n',
                post: '}}'
              }
            }
          }
        }
      },
      langTags: {
        label: wgULS('非中文标明', '非中文標明'),
        type: 'select',
        list: {
          en: {
            label: wgULS('英语', '英語'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{lang|en|',
                periMsg: wgULS('英语', '英語'),
                post: '}}'
              }
            }
          },
          de: {
            label: wgULS('德语', '德語'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{lang|de|',
                periMsg: wgULS('德语', '德語'),
                post: '}}'
              }
            }
          },
          fr: {
            label: wgULS('法语', '法語'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{lang|fr|',
                periMsg: wgULS('法语', '法語'),
                post: '}}'
              }
            }
          },
          ja: {
            label: wgULS('日语', '日語'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{lang|ja|',
                periMsg: wgULS('日语', '日語'),
                post: '}}'
              }
            }
          },
          es: {
            label: wgULS('西班牙语', '西班牙語'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{lang|es|',
                periMsg: wgULS('西班牙语', '西班牙語'),
                post: '}}'
              }
            }
          },
          ar: {
            label: wgULS('阿拉伯语', '阿拉伯語'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{lang|ar|',
                periMsg: wgULS('阿拉伯语', '阿拉伯語'),
                post: '}}'
              }
            }
          },
          ru: {
            label: wgULS('俄语', '俄語'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{lang|ru|',
                periMsg: wgULS('俄语', '俄語'),
                post: '}}'
              }
            }
          },
          he: {
            label: wgULS('希伯来语', '希伯來語'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{lang|he|',
                periMsg: wgULS('希伯来语', '希伯來語'),
                post: '}}'
              }
            }
          },
          el: {
            label: wgULS('希腊语', '希臘語'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{lang|el|',
                periMsg: wgULS('希腊语', '希臘語'),
                post: '}}'
              }
            }
          },
          pt: {
            label: wgULS('葡萄牙语', '葡萄牙語'),
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{lang|pt|',
                periMsg: wgULS('葡萄牙语', '葡萄牙語'),
                post: '}}'
              }
            }
          },
          la: {
            label: '拉丁语',
            action: {
              type: 'encapsulate',
              options: {
                pre: '{{lang|la|',
                periMsg: '拉丁语',
                post: '}}'
              }
            }
          },
          langcode: {
            label: wgULS('其他语言', '其他語言'),
            action: {
              type: 'encapsulate',
              options: {
                pre: "{{lang|".concat(wgULS('在此填上语言代码|', '在此填上語言代碼|')),
                periMsg: wgULS('其他语言', '其他語言'),
                post: '}}'
              }
            }
          }
        }
      }
    }
  });
});

/* </nowiki> */
/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: 'https://git.qiuwen.net.cn/InterfaceAdmin/QiuwenGadgets/src/branch/master/src/GeoLocationReader/rfaceAdmin/QiuwenGadgets/src/branch/master/src/GeoLocationReader/}}'
 *
 * @source {@link https://git.qiuwen.net.cn/InterfaceAdmin/QiuwenGadgets/src/branch/master/src/GeoLocationReader}
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
(function () {

    "use strict";
    
    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
    function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
    (function () {
      // src/GeoLocationReader/modules/constant.ts
      var SYSTEM_SCRIPT_LIST = ["滥用过滤器", "Example", "Maintenance script", "MediaWiki default", "MediaWiki message delivery", "New user page"];
      var WEBMASTER_LIST = [];
    
      // src/GeoLocationReader/modules/name.ts
      var getcountryOrAreaName = function getcountryOrAreaName() {
        if (["zh-hant", "zh-hk", "zh-mo"].indexOf(mw.config.get("wgUserLanguage")) !== -1) {
          return {
            AF: "阿富汗",
            AX: "奧蘭",
            AL: "阿爾巴尼亞",
            DZ: "阿爾及利亞",
            AS: "美屬薩摩亞",
            AD: "安道爾",
            AO: "安哥拉",
            AI: "安圭拉",
            AQ: "南極洲",
            AG: "安提瓜和巴布達",
            AR: "阿根廷",
            AM: "亞美尼亞",
            AW: "阿魯巴",
            AU: "澳洲",
            AT: "奧地利",
            AZ: "阿塞拜疆",
            BS: "巴哈馬",
            BH: "巴林",
            BD: "孟加拉國",
            BB: "巴巴多斯",
            BY: "白俄羅斯",
            BE: "比利時",
            BZ: "伯利茲",
            BJ: "貝寧",
            BM: "百慕達",
            BT: "不丹",
            BO: "玻利維亞",
            BQ: "荷蘭加勒比區",
            BA: "波黑",
            BW: "博茨瓦納",
            BV: "布韋島",
            BR: "巴西",
            IO: "英屬印度洋領地",
            BN: "汶萊",
            BG: "保加利亞",
            BF: "布基納法索",
            BI: "布隆迪",
            CV: "佛得角",
            KH: "柬埔寨",
            CM: "喀麥隆",
            CA: "加拿大",
            KY: "開曼群島",
            CF: "中非",
            TD: "乍得",
            CL: "智利",
            CN: "中國",
            CX: "聖誕島",
            CC: "科科斯（基林）群島",
            CO: "哥倫比亞",
            KM: "科摩羅",
            CG: "剛果共和國",
            CD: "剛果民主共和國",
            CK: "庫克群島",
            CR: "哥斯達黎加",
            CI: "科特迪瓦",
            HR: "克羅地亞",
            CU: "古巴",
            CW: "庫拉索",
            CY: "塞浦路斯",
            CZ: "捷克",
            DK: "丹麥",
            DJ: "吉布提",
            DM: "多米尼克",
            DO: "多米尼加",
            EC: "厄瓜多爾",
            EG: "埃及",
            SV: "薩爾瓦多",
            GQ: "赤道畿內亞",
            ER: "厄立特里亞",
            EE: "愛沙尼亞",
            SZ: "斯威士蘭",
            ET: "埃塞俄比亞",
            FK: "福克蘭群島",
            FO: "法羅群島",
            FJ: "斐濟",
            FI: "芬蘭",
            FR: "法國",
            GF: "法屬圭亞那",
            PF: "法屬波利尼西亞",
            TF: "法屬南部和南極領地",
            GA: "加蓬",
            GM: "岡比亞",
            GE: "格魯吉亞",
            DE: "德國",
            GH: "加納",
            GI: "直布羅陀",
            GR: "希臘",
            GL: "格陵蘭",
            GD: "格林納達",
            GP: "瓜德羅普",
            GU: "關島",
            GT: "危地馬拉",
            GG: "根西",
            GN: "畿內亞",
            GW: "畿內亞比紹",
            GY: "圭亞那",
            HT: "海地",
            HM: "赫德島和麥克唐納群島",
            VA: "梵蒂岡",
            HN: "洪都拉斯",
            HK: "中國香港",
            HU: "匈牙利",
            IS: "冰島",
            IN: "印度",
            ID: "印尼",
            IR: "伊朗",
            IQ: "伊拉克",
            IE: "愛爾蘭",
            IM: "人島",
            IL: "以色列",
            IT: "意大利",
            JM: "牙買加",
            JP: "日本",
            JE: "澤西",
            JO: "約旦",
            KZ: "哈薩克",
            KE: "肯雅",
            KI: "基里巴斯",
            KP: "北韓",
            KR: "韓國",
            KW: "科威特",
            KG: "吉爾吉斯",
            LA: "老撾",
            LV: "拉脫維亞",
            LB: "黎巴嫩",
            LS: "萊索托",
            LR: "利比里亞",
            LY: "利比亞",
            LI: "列支敦士登",
            LT: "立陶宛",
            LU: "盧森堡",
            MO: "中國澳門",
            MG: "馬達加斯加",
            MW: "馬拉維",
            MY: "馬來西亞",
            MV: "馬爾代夫",
            ML: "馬里",
            MT: "馬耳他",
            MH: "馬紹爾群島",
            MQ: "馬提尼克",
            MR: "毛里塔尼亞",
            MU: "毛里裘斯",
            YT: "馬約特",
            MX: "墨西哥",
            FM: "密克羅尼西亞聯邦",
            MD: "摩爾多瓦",
            MC: "摩納哥",
            MN: "蒙古",
            ME: "黑山",
            MS: "蒙特塞拉特",
            MA: "摩洛哥",
            MZ: "莫桑比克",
            MM: "緬甸",
            NA: "納米比亞",
            NR: "瑙魯",
            NP: "尼泊爾",
            NL: "荷蘭",
            NC: "新喀里多尼亞",
            NZ: "新西蘭",
            NI: "尼加拉瓜",
            NE: "尼日爾",
            NG: "尼日利亞",
            NU: "紐埃",
            NF: "諾福克島",
            MK: "北馬其頓",
            MP: "北馬利安納群島",
            NO: "挪威",
            OM: "阿曼",
            PK: "巴基斯坦",
            PW: "帕勞",
            PS: "巴勒斯坦",
            PA: "巴拿馬",
            PG: "巴布亞新畿內亞",
            PY: "巴拉圭",
            PE: "秘魯",
            PH: "菲律賓",
            PN: "皮特肯群島",
            PL: "波蘭",
            PT: "葡萄牙",
            PR: "波多黎各",
            QA: "卡塔爾",
            RE: "留尼汪",
            RO: "羅馬尼亞",
            RU: "俄羅斯",
            RW: "盧旺達",
            BL: "聖巴泰勒米",
            SH: "聖海倫娜、阿森松和特里斯坦-達庫尼亞",
            KN: "聖基茨和尼維斯",
            LC: "聖盧西亞",
            MF: "法屬聖馬丁",
            PM: "聖皮埃爾和密克隆",
            VC: "聖文森特和格林納丁斯",
            WS: "薩摩亞",
            SM: "聖馬力諾",
            ST: "聖多美和普林西比",
            SA: "沙地阿拉伯",
            SN: "塞內加爾",
            RS: "塞爾維亞",
            SC: "塞舌爾",
            SL: "塞拉利昂",
            SG: "新加坡",
            SX: "荷屬聖馬丁",
            SK: "斯洛伐克",
            SI: "斯洛文尼亞",
            SB: "所羅門群島",
            SO: "索馬里",
            ZA: "南非",
            GS: "南喬治亞和南桑威奇群島",
            SS: "南蘇丹",
            ES: "西班牙",
            LK: "斯里蘭卡",
            SD: "蘇丹",
            SR: "蘇里南",
            SJ: "斯瓦爾巴和揚馬延",
            SE: "瑞典",
            CH: "瑞士",
            SY: "敘利亞",
            TW: "中國臺灣",
            TJ: "塔吉克",
            TZ: "坦桑尼亞",
            TH: "泰國",
            TL: "東帝汶",
            TG: "多哥",
            TK: "托克勞",
            TO: "湯加",
            TT: "千里達和多巴哥",
            TN: "突尼西亞",
            TR: "土耳其",
            TM: "土庫曼",
            TC: "特克斯和凱科斯群島",
            TV: "圖瓦盧",
            UG: "烏干達",
            UA: "烏克蘭",
            AE: "阿聯酋",
            GB: "英國",
            US: "美國",
            UM: "美國本土外小島嶼",
            UY: "烏拉圭",
            UZ: "烏茲別克",
            VU: "瓦努阿圖",
            VE: "委內瑞拉",
            VN: "越南",
            VG: "英屬處女群島",
            VI: "美屬處女群島",
            WF: "瓦利斯和富圖納",
            EH: "西撒哈拉",
            YE: "也門",
            ZM: "贊比亞",
            ZW: "津巴布韋"
          };
        } else if (["zh-tw"].indexOf(mw.config.get("wgUserLanguage")) !== -1) {
          return {
            AF: "阿富汗",
            AX: "奧蘭",
            AL: "阿爾巴尼亞",
            DZ: "阿爾及利亞",
            AS: "美屬薩摩亞",
            AD: "安道爾",
            AO: "安哥拉",
            AI: "安圭拉",
            AQ: "南極洲",
            AG: "安地卡及巴布達",
            AR: "阿根廷",
            AM: "亞美尼亞",
            AW: "阿魯巴",
            AU: "澳洲",
            AT: "奧地利",
            AZ: "亞塞拜然",
            BS: "巴哈馬",
            BH: "巴林",
            BD: "孟加拉國",
            BB: "巴貝多",
            BY: "白俄羅斯",
            BE: "比利時",
            BZ: "貝里斯",
            BJ: "貝南",
            BM: "百慕達",
            BT: "不丹",
            BO: "玻利維亞",
            BQ: "荷蘭加勒比區",
            BA: "波赫",
            BW: "波札那",
            BV: "布韋島",
            BR: "巴西",
            IO: "英屬印度洋領地",
            BN: "汶萊",
            BG: "保加利亞",
            BF: "布吉納法索",
            BI: "蒲隆地",
            CV: "維德角",
            KH: "柬埔寨",
            CM: "喀麥隆",
            CA: "加拿大",
            KY: "開曼群島",
            CF: "中非",
            TD: "查德",
            CL: "智利",
            CN: "中國",
            CX: "聖誕島",
            CC: "科科斯（基林）群島",
            CO: "哥倫比亞",
            KM: "葛摩",
            CG: "剛果共和國",
            CD: "剛果民主共和國",
            CK: "庫克群島",
            CR: "哥斯大黎加",
            CI: "象牙海岸",
            HR: "克羅埃西亞",
            CU: "古巴",
            CW: "古拉索",
            CY: "賽普勒斯",
            CZ: "捷克",
            DK: "丹麥",
            DJ: "吉布地",
            DM: "多米尼克",
            DO: "多明尼加",
            EC: "厄瓜多",
            EG: "埃及",
            SV: "薩爾瓦多",
            GQ: "赤道幾內亞",
            ER: "厄利垂亞",
            EE: "愛沙尼亞",
            SZ: "史瓦帝尼",
            ET: "衣索比亞",
            FK: "福克蘭群島",
            FO: "法羅群島",
            FJ: "斐濟",
            FI: "芬蘭",
            FR: "法國",
            GF: "法屬圭亞那",
            PF: "法屬玻里尼西亞",
            TF: "法屬南部和南極領地",
            GA: "加彭",
            GM: "甘比亞",
            GE: "喬治亞",
            DE: "德國",
            GH: "迦納",
            GI: "直布羅陀",
            GR: "希臘",
            GL: "格陵蘭",
            GD: "格瑞那達",
            GP: "瓜德羅普",
            GU: "關島",
            GT: "瓜地馬拉",
            GG: "根西",
            GN: "幾內亞",
            GW: "幾內亞比索",
            GY: "蓋亞那",
            HT: "海地",
            HM: "赫德島和麥克唐納群島",
            VA: "梵蒂岡",
            HN: "宏都拉斯",
            HK: "中國香港",
            HU: "匈牙利",
            IS: "冰島",
            IN: "印度",
            ID: "印尼",
            IR: "伊朗",
            IQ: "伊拉克",
            IE: "愛爾蘭",
            IM: "曼島",
            IL: "以色列",
            IT: "義大利",
            JM: "牙買加",
            JP: "日本",
            JE: "澤西",
            JO: "約旦",
            KZ: "哈薩克",
            KE: "肯亞",
            KI: "吉里巴斯",
            KP: "北韓",
            KR: "韓國",
            KW: "科威特",
            KG: "吉爾吉斯",
            LA: "老撾",
            LV: "拉脫維亞",
            LB: "黎巴嫩",
            LS: "賴索托",
            LR: "賴比瑞亞",
            LY: "利比亞",
            LI: "列支敦斯登",
            LT: "立陶宛",
            LU: "盧森堡",
            MO: "中國澳門",
            MG: "馬達加斯加",
            MW: "馬拉威",
            MY: "馬來西亞",
            MV: "馬爾地夫",
            ML: "馬里",
            MT: "馬爾他",
            MH: "馬紹爾群島",
            MQ: "馬提尼克",
            MR: "茅利塔尼亞",
            MU: "模里西斯",
            YT: "馬約特",
            MX: "墨西哥",
            FM: "密克羅尼西亞聯邦",
            MD: "摩爾多瓦",
            MC: "摩納哥",
            MN: "蒙古",
            ME: "蒙特內哥羅",
            MS: "蒙哲臘",
            MA: "摩洛哥",
            MZ: "莫三比克",
            MM: "緬甸",
            NA: "納米比亞",
            NR: "諾魯",
            NP: "尼泊爾",
            NL: "荷蘭",
            NC: "新喀里多尼亞",
            NZ: "紐西蘭",
            NI: "尼加拉瓜",
            NE: "尼日",
            NG: "奈及利亞",
            NU: "紐埃",
            NF: "諾福克島",
            MK: "北馬其頓",
            MP: "北馬利安納群島",
            NO: "挪威",
            OM: "阿曼",
            PK: "巴基斯坦",
            PW: "帛琉",
            PS: "巴勒斯坦",
            PA: "巴拿馬",
            PG: "巴布亞紐幾內亞",
            PY: "巴拉圭",
            PE: "秘魯",
            PH: "菲律賓",
            PN: "皮特肯群島",
            PL: "波蘭",
            PT: "葡萄牙",
            PR: "波多黎各",
            QA: "卡達",
            RE: "留尼旺",
            RO: "羅馬尼亞",
            RU: "俄羅斯",
            RW: "盧安達",
            BL: "聖巴泰勒米",
            SH: "聖海蓮娜、阿森松和特里斯坦-達庫尼亞",
            KN: "聖克里斯多福及尼維斯",
            LC: "聖露西亞",
            MF: "法屬聖馬丁",
            PM: "聖皮耶與密克隆",
            VC: "聖文森及格瑞那丁",
            WS: "薩摩亞",
            SM: "聖馬利諾",
            ST: "聖多美普林西比",
            SA: "沙烏地阿拉伯",
            SN: "塞內加爾",
            RS: "塞爾維亞",
            SC: "塞席爾",
            SL: "獅子山",
            SG: "新加坡",
            SX: "荷屬聖馬丁",
            SK: "斯洛伐克",
            SI: "斯洛維尼亞",
            SB: "索羅門群島",
            SO: "索馬利亞",
            ZA: "南非",
            GS: "南喬治亞和南桑威奇群島",
            SS: "南蘇丹",
            ES: "西班牙",
            LK: "斯里蘭卡",
            SD: "蘇丹",
            SR: "蘇利南",
            SJ: "斯瓦爾巴和揚馬延",
            SE: "瑞典",
            CH: "瑞士",
            SY: "敘利亞",
            TW: "中國臺灣",
            TJ: "塔吉克",
            TZ: "坦尚尼亞",
            TH: "泰國",
            TL: "東帝汶",
            TG: "多哥",
            TK: "托克勞",
            TO: "東加",
            TT: "千里達及托巴哥",
            TN: "突尼西亞",
            TR: "土耳其",
            TM: "土庫曼",
            TC: "土克凱可群島",
            TV: "吐瓦魯",
            UG: "烏干達",
            UA: "烏克蘭",
            AE: "阿聯",
            GB: "英國",
            US: "美國",
            UM: "美國本土外小島嶼",
            UY: "烏拉圭",
            UZ: "烏茲別克",
            VU: "萬那杜",
            VE: "委內瑞拉",
            VN: "越南",
            VG: "英屬維京群島",
            VI: "美屬維京群島",
            WF: "瓦利斯和富圖納",
            EH: "西撒哈拉",
            YE: "葉門",
            ZM: "尚比亞",
            ZW: "辛巴威"
          };
        } else if (["zh-my", "zh-sg"].indexOf(mw.config.get("wgUserLanguage")) !== -1) {
          return {
            AF: "阿富汗",
            AX: "奥兰",
            AL: "阿尔巴尼亚",
            DZ: "阿尔及利亚",
            AS: "美属萨摩亚",
            AD: "安道尔",
            AO: "安哥拉",
            AI: "安圭拉",
            AQ: "南极洲",
            AG: "安提瓜和巴布达",
            AR: "阿根廷",
            AM: "亚美尼亚",
            AW: "阿鲁巴",
            AU: "澳大利亚",
            AT: "奥地利",
            AZ: "阿塞拜疆",
            BS: "巴哈马",
            BH: "巴林",
            BD: "孟加拉国",
            BB: "巴巴多斯",
            BY: "白俄罗斯",
            BE: "比利时",
            BZ: "伯利兹",
            BJ: "贝宁",
            BM: "百慕大",
            BT: "不丹",
            BO: "玻利维亚",
            BQ: "荷兰加勒比区",
            BA: "波黑",
            BW: "博茨瓦纳",
            BV: "布韦岛",
            BR: "巴西",
            IO: "英属印度洋领地",
            BN: "汶莱",
            BG: "保加利亚",
            BF: "布基纳法索",
            BI: "布隆迪",
            CV: "佛得角",
            KH: "柬埔寨",
            CM: "喀麦隆",
            CA: "加拿大",
            KY: "开曼群岛",
            CF: "中非",
            TD: "乍得",
            CL: "智利",
            CN: "中国",
            CX: "圣诞岛",
            CC: "科科斯（基林）群岛",
            CO: "哥伦比亚",
            KM: "科摩罗",
            CG: "刚果共和国",
            CD: "刚果民主共和国",
            CK: "库克群岛",
            CR: "哥斯达黎加",
            CI: "象牙海岸",
            HR: "克罗地亚",
            CU: "古巴",
            CW: "库拉索",
            CY: "塞浦路斯",
            CZ: "捷克",
            DK: "丹麦",
            DJ: "吉布提",
            DM: "多米尼克",
            DO: "多米尼加",
            EC: "厄瓜多尔",
            EG: "埃及",
            SV: "萨尔瓦多",
            GQ: "赤道几内亚",
            ER: "厄立特里亚",
            EE: "爱沙尼亚",
            SZ: "斯威士兰",
            ET: "埃塞俄比亚",
            FK: "福克兰群岛",
            FO: "法罗群岛",
            FJ: "斐济",
            FI: "芬兰",
            FR: "法国",
            GF: "法属圭亚那",
            PF: "法属波利尼西亚",
            TF: "法属南部和南极领地",
            GA: "加蓬",
            GM: "冈比亚",
            GE: "格鲁吉亚",
            DE: "德国",
            GH: "加纳",
            GI: "直布罗陀",
            GR: "希腊",
            GL: "格陵兰",
            GD: "格林纳达",
            GP: "瓜德罗普",
            GU: "关岛",
            GT: "危地马拉",
            GG: "根西",
            GN: "几内亚",
            GW: "几内亚比绍",
            GY: "圭亚那",
            HT: "海地",
            HM: "赫德岛和麦克唐纳群岛",
            VA: "梵蒂冈",
            HN: "洪都拉斯",
            HK: "中国香港",
            HU: "匈牙利",
            IS: "冰岛",
            IN: "印度",
            ID: "印尼",
            IR: "伊朗",
            IQ: "伊拉克",
            IE: "爱尔兰",
            IM: "马恩岛",
            IL: "以色列",
            IT: "意大利",
            JM: "牙买加",
            JP: "日本",
            JE: "泽西",
            JO: "约旦",
            KZ: "哈萨克斯坦",
            KE: "肯尼亚",
            KI: "基里巴斯",
            KP: "北韩",
            KR: "韩国",
            KW: "科威特",
            KG: "吉尔吉斯斯坦",
            LA: "老挝",
            LV: "拉脱维亚",
            LB: "黎巴嫩",
            LS: "莱索托",
            LR: "利比里亚",
            LY: "利比亚",
            LI: "列支敦士登",
            LT: "立陶宛",
            LU: "卢森堡",
            MO: "中国澳门",
            MG: "马达加斯加",
            MW: "马拉维",
            MY: "马来西亚",
            MV: "马尔代夫",
            ML: "马里",
            MT: "马耳他",
            MH: "马绍尔群岛",
            MQ: "马提尼克",
            MR: "毛里塔尼亚",
            MU: "毛里求斯",
            YT: "马约特",
            MX: "墨西哥",
            FM: "密克罗尼西亚联邦",
            MD: "摩尔多瓦",
            MC: "摩纳哥",
            MN: "蒙古",
            ME: "黑山",
            MS: "蒙特塞拉特",
            MA: "摩洛哥",
            MZ: "莫桑比克",
            MM: "缅甸",
            NA: "那米比亚",
            NR: "瑙鲁",
            NP: "尼泊尔",
            NL: "荷兰",
            NC: "新喀里多尼亚",
            NZ: "新西兰",
            NI: "尼加拉瓜",
            NE: "尼日尔",
            NG: "尼日利亚",
            NU: "纽埃",
            NF: "诺福克岛",
            MK: "北马其顿",
            MP: "北马里亚纳群岛",
            NO: "挪威",
            OM: "阿曼",
            PK: "巴基斯坦",
            PW: "帕劳",
            PS: "巴勒斯坦",
            PA: "巴拿马",
            PG: "巴布亚新几内亚",
            PY: "巴拉圭",
            PE: "秘鲁",
            PH: "菲律宾",
            PN: "皮特凯恩群岛",
            PL: "波兰",
            PT: "葡萄牙",
            PR: "波多黎各",
            QA: "卡塔尔",
            RE: "留尼汪",
            RO: "罗马尼亚",
            RU: "俄罗斯",
            RW: "卢旺达",
            BL: "圣巴泰勒米",
            SH: "圣赫勒拿、阿森松和特里斯坦-达库尼亚",
            KN: "圣基茨和尼维斯",
            LC: "圣卢西亚",
            MF: "法属圣马丁",
            PM: "圣皮埃尔和密克隆",
            VC: "圣文森特和格林纳丁斯",
            WS: "萨摩亚",
            SM: "圣马力诺",
            ST: "圣多美和普林西比",
            SA: "沙特阿拉伯",
            SN: "塞内加尔",
            RS: "塞尔维亚",
            SC: "塞舌尔",
            SL: "塞拉利昂",
            SG: "新加坡",
            SX: "荷属圣马丁",
            SK: "斯洛伐克",
            SI: "斯洛文尼亚",
            SB: "所罗门群岛",
            SO: "索马里",
            ZA: "南非",
            GS: "南乔治亚和南桑威奇群岛",
            SS: "南苏丹",
            ES: "西班牙",
            LK: "斯里兰卡",
            SD: "苏丹",
            SR: "苏里南",
            SJ: "斯瓦尔巴和扬马延",
            SE: "瑞典",
            CH: "瑞士",
            SY: "叙利亚",
            TW: "中国台湾",
            TJ: "塔吉克斯坦",
            TZ: "坦桑尼亚",
            TH: "泰国",
            TL: "东帝汶",
            TG: "多哥",
            TK: "托克劳",
            TO: "汤加",
            TT: "特立尼达和多巴哥",
            TN: "突尼斯",
            TR: "土耳其",
            TM: "土库曼斯坦",
            TC: "特克斯和凯科斯群岛",
            TV: "图瓦卢",
            UG: "乌干达",
            UA: "乌克兰",
            AE: "阿联酋",
            GB: "英国",
            US: "美国",
            UM: "美国本土外小岛屿",
            UY: "乌拉圭",
            UZ: "乌兹别克斯坦",
            VU: "瓦努阿图",
            VE: "委内瑞拉",
            VN: "越南",
            VG: "英属维尔京群岛",
            VI: "美属维尔京群岛",
            WF: "瓦利斯和富图纳",
            EH: "西撒哈拉",
            YE: "也门",
            ZM: "赞比亚",
            ZW: "津巴布韦"
          };
        }
        return {
          AF: "阿富汗",
          AX: "奥兰",
          AL: "阿尔巴尼亚",
          DZ: "阿尔及利亚",
          AS: "美属萨摩亚",
          AD: "安道尔",
          AO: "安哥拉",
          AI: "安圭拉",
          AQ: "南极洲",
          AG: "安提瓜和巴布达",
          AR: "阿根廷",
          AM: "亚美尼亚",
          AW: "阿鲁巴",
          AU: "澳大利亚",
          AT: "奥地利",
          AZ: "阿塞拜疆",
          BS: "巴哈马",
          BH: "巴林",
          BD: "孟加拉国",
          BB: "巴巴多斯",
          BY: "白俄罗斯",
          BE: "比利时",
          BZ: "伯利兹",
          BJ: "贝宁",
          BM: "百慕大",
          BT: "不丹",
          BO: "玻利维亚",
          BQ: "荷兰加勒比区",
          BA: "波黑",
          BW: "博茨瓦纳",
          BV: "布韦岛",
          BR: "巴西",
          IO: "英属印度洋领地",
          BN: "文莱",
          BG: "保加利亚",
          BF: "布基纳法索",
          BI: "布隆迪",
          CV: "佛得角",
          KH: "柬埔寨",
          CM: "喀麦隆",
          CA: "加拿大",
          KY: "开曼群岛",
          CF: "中非",
          TD: "乍得",
          CL: "智利",
          CN: "中国",
          CX: "圣诞岛",
          CC: "科科斯（基林）群岛",
          CO: "哥伦比亚",
          KM: "科摩罗",
          CG: "刚果共和国",
          CD: "刚果民主共和国",
          CK: "库克群岛",
          CR: "哥斯达黎加",
          CI: "科特迪瓦",
          HR: "克罗地亚",
          CU: "古巴",
          CW: "库拉索",
          CY: "塞浦路斯",
          CZ: "捷克",
          DK: "丹麦",
          DJ: "吉布提",
          DM: "多米尼克",
          DO: "多米尼加",
          EC: "厄瓜多尔",
          EG: "埃及",
          SV: "萨尔瓦多",
          GQ: "赤道几内亚",
          ER: "厄立特里亚",
          EE: "爱沙尼亚",
          SZ: "斯威士兰",
          ET: "埃塞俄比亚",
          FK: "福克兰群岛",
          FO: "法罗群岛",
          FJ: "斐济",
          FI: "芬兰",
          FR: "法国",
          GF: "法属圭亚那",
          PF: "法属波利尼西亚",
          TF: "法属南部和南极领地",
          GA: "加蓬",
          GM: "冈比亚",
          GE: "格鲁吉亚",
          DE: "德国",
          GH: "加纳",
          GI: "直布罗陀",
          GR: "希腊",
          GL: "格陵兰",
          GD: "格林纳达",
          GP: "瓜德罗普",
          GU: "关岛",
          GT: "危地马拉",
          GG: "根西",
          GN: "几内亚",
          GW: "几内亚比绍",
          GY: "圭亚那",
          HT: "海地",
          HM: "赫德岛和麦克唐纳群岛",
          VA: "梵蒂冈",
          HN: "洪都拉斯",
          HK: "中国香港",
          HU: "匈牙利",
          IS: "冰岛",
          IN: "印度",
          ID: "印尼",
          IR: "伊朗",
          IQ: "伊拉克",
          IE: "爱尔兰",
          IM: "马恩岛",
          IL: "以色列",
          IT: "意大利",
          JM: "牙买加",
          JP: "日本",
          JE: "泽西",
          JO: "约旦",
          KZ: "哈萨克斯坦",
          KE: "肯尼亚",
          KI: "基里巴斯",
          KP: "朝鲜",
          KR: "韩国",
          KW: "科威特",
          KG: "吉尔吉斯斯坦",
          LA: "老挝",
          LV: "拉脱维亚",
          LB: "黎巴嫩",
          LS: "莱索托",
          LR: "利比里亚",
          LY: "利比亚",
          LI: "列支敦士登",
          LT: "立陶宛",
          LU: "卢森堡",
          MO: "中国澳门",
          MG: "马达加斯加",
          MW: "马拉维",
          MY: "马来西亚",
          MV: "马尔代夫",
          ML: "马里",
          MT: "马耳他",
          MH: "马绍尔群岛",
          MQ: "马提尼克",
          MR: "毛里塔尼亚",
          MU: "毛里求斯",
          YT: "马约特",
          MX: "墨西哥",
          FM: "密克罗尼西亚联邦",
          MD: "摩尔多瓦",
          MC: "摩纳哥",
          MN: "蒙古",
          ME: "黑山",
          MS: "蒙特塞拉特",
          MA: "摩洛哥",
          MZ: "莫桑比克",
          MM: "缅甸",
          NA: "纳米比亚",
          NR: "瑙鲁",
          NP: "尼泊尔",
          NL: "荷兰",
          NC: "新喀里多尼亚",
          NZ: "新西兰",
          NI: "尼加拉瓜",
          NE: "尼日尔",
          NG: "尼日利亚",
          NU: "纽埃",
          NF: "诺福克岛",
          MK: "北马其顿",
          MP: "北马里亚纳群岛",
          NO: "挪威",
          OM: "阿曼",
          PK: "巴基斯坦",
          PW: "帕劳",
          PS: "巴勒斯坦",
          PA: "巴拿马",
          PG: "巴布亚新几内亚",
          PY: "巴拉圭",
          PE: "秘鲁",
          PH: "菲律宾",
          PN: "皮特凯恩群岛",
          PL: "波兰",
          PT: "葡萄牙",
          PR: "波多黎各",
          QA: "卡塔尔",
          RE: "留尼汪",
          RO: "罗马尼亚",
          RU: "俄罗斯",
          RW: "卢旺达",
          BL: "圣巴泰勒米",
          SH: "圣赫勒拿、阿森松和特里斯坦-达库尼亚",
          KN: "圣基茨和尼维斯",
          LC: "圣卢西亚",
          MF: "法属圣马丁",
          PM: "圣皮埃尔和密克隆",
          VC: "圣文森特和格林纳丁斯",
          WS: "萨摩亚",
          SM: "圣马力诺",
          ST: "圣多美和普林西比",
          SA: "沙特阿拉伯",
          SN: "塞内加尔",
          RS: "塞尔维亚",
          SC: "塞舌尔",
          SL: "塞拉利昂",
          SG: "新加坡",
          SX: "荷属圣马丁",
          SK: "斯洛伐克",
          SI: "斯洛文尼亚",
          SB: "所罗门群岛",
          SO: "索马里",
          ZA: "南非",
          GS: "南乔治亚和南桑威奇群岛",
          SS: "南苏丹",
          ES: "西班牙",
          LK: "斯里兰卡",
          SD: "苏丹",
          SR: "苏里南",
          SJ: "斯瓦尔巴和扬马延",
          SE: "瑞典",
          CH: "瑞士",
          SY: "叙利亚",
          TW: "中国臺湾",
          TJ: "塔吉克斯坦",
          TZ: "坦桑尼亚",
          TH: "泰国",
          TL: "东帝汶",
          TG: "多哥",
          TK: "托克劳",
          TO: "汤加",
          TT: "特立尼达和多巴哥",
          TN: "突尼斯",
          TR: "土耳其",
          TM: "土库曼斯坦",
          TC: "特克斯和凯科斯群岛",
          TV: "图瓦卢",
          UG: "乌干达",
          UA: "乌克兰",
          AE: "阿联酋",
          GB: "英国",
          US: "美国",
          UM: "美国本土外小岛屿",
          UY: "乌拉圭",
          UZ: "乌兹别克斯坦",
          VU: "瓦努阿图",
          VE: "委内瑞拉",
          VN: "越南",
          VG: "英属维尔京群岛",
          VI: "美属维尔京群岛",
          WF: "瓦利斯和富图纳",
          EH: "西撒哈拉",
          YE: "也门",
          ZM: "赞比亚",
          ZW: "津巴布韦"
        };
      };
      var getRegionName = function getRegionName() {
        if (["zh-hant", "zh-hk", "zh-mo", "zh-tw"].indexOf(mw.config.get("wgUserLanguage")) !== -1) {
          return {
            AH: "安徽",
            BJ: "北京",
            CQ: "重慶",
            FJ: "福建",
            GD: "廣東",
            GS: "甘肅",
            GX: "廣西",
            GZ: "貴州",
            HA: "河南",
            HB: "湖北",
            HE: "河北",
            HI: "海南",
            HL: "黑龍江",
            HN: "湖南",
            JL: "吉林",
            JS: "江蘇",
            JX: "江西",
            LN: "遼寧",
            NM: "內蒙古",
            NX: "寧夏",
            QH: "青海",
            SC: "四川",
            SD: "山東",
            SH: "上海",
            SN: "陝西",
            SX: "山西",
            TJ: "天津",
            XJ: "新疆",
            XZ: "西藏",
            YN: "雲南",
            ZJ: "浙江"
          };
        }
        return {
          AH: '·徽',
          BJ: '·京',
          CQ: '·渝',
          FJ: '·闽',
          GD: '·粤',
          GS: '·甘',
          GX: '·桂',
          GZ: '·贵',
          HA: '·豫',
          HB: '·鄂',
          HE: '·冀',
          HI: '·琼',
          HL: '·黑',
          HN: '·湘',
          JL: '·吉',
          JS: '·苏',
          JX: '·赣',
          LN: '·辽',
          NM: '·内蒙古',
          NX: '·宁',
          QH: '·青',
          SC: '·川',
          SD: '·鲁',
          SH: '·沪',
          SN: '·陕',
          SX: '·晋',
          TJ: '·津',
          XJ: '·新',
          XZ: '·藏',
          YN: '·云',
          ZJ: '·浙'
        };
      };
      var geocountryOrAreaName = function geocountryOrAreaName() {
        return getcountryOrAreaName();
      };
      var geoRegionName = function geoRegionName() {
        return getRegionName();
      };
    
      // src/GeoLocationReader/modules/i18n.ts
      var getI18nMessages = function getI18nMessages() {
        var _i18n = i18n,
          localize = _i18n.localize;
        return {
          ":": localize({
            en: ": ",
            ja: "：",
            zh: "："
          }),
          Bot: localize({
            en: "Bot",
            ja: "ボット",
            "zh-hans": "机器人",
            "zh-hant": "機械人"
          }),
          Unknown: localize({
            en: "Unknown Location",
            ja: "未知IP地域",
            "zh-hans": "未知IP属地",
            "zh-hant": "未知IP屬地"
          }),
          Location: localize({
            en: "IP Location",
            ja: "IP地域",
            "zh-hans": "IP属地",
            "zh-hant": "IP屬地"
          })
        };
      };
      var i18nMessages = getI18nMessages();
      var getMessage = function getMessage(key) {
        return i18nMessages[key] || key;
      };
    
      // src/util.ts
      var initMwApi = function initMwApi(userAgent) {
        return new mw.Api({
          ajax: {
            headers: {
              "Api-User-Agent": userAgent
            }
          }
        });
      };
    
      // src/GeoLocationReader/modules/core.ts
      var countryOrAreaList = geocountryOrAreaName;
      var regionList = geoRegionName;
      var _countryOrAreaList = countryOrAreaList();
      var _regionList = regionList();
      var getcountryOrAreaName2 = function getcountryOrAreaName2(key) {
        return _countryOrAreaList[key] || key;
      };
      var getRegionName2 = function getRegionName2(key) {
        return _regionList[key] || key;
      };
      var wgRelevantUserName = mw.config.get("wgRelevantUserName");
      var getLocation = function getLocation() {
        if (!wgRelevantUserName) {
          return;
        }
        var ipGeoLocationDesc = getMessage("Location");
        var appendIcon = function appendIcon(indicatorText, spanClass, icon, indicator) {
          var elementName = indicator === true ? "div" : mw.config.get("skin") === "citizen" ? "section" : ["vector", "vector-2022", "gongbi", "write"].indexOf(mw.config.get("skin")) !== -1 ? "li" : "div";
          var $indicator = $("<".concat(elementName, ">")).addClass("".concat(indicator === true ? "mw-indicator " : "", "mw-geolocation mw-geolocation-").concat(spanClass)).append($("<span>").addClass("mw-geolocation-icon mw-geolocation-icon-".concat(icon !== null && icon !== void 0 ? icon : "globe")).attr({
            alt: icon === "globe" ? "".concat(ipGeoLocationDesc).concat(getMessage(":")).concat(indicatorText) : indicatorText !== null && indicatorText !== void 0 ? indicatorText : "",
            title: icon === "globe" ? "".concat(ipGeoLocationDesc).concat(getMessage(":")).concat(indicatorText) : indicatorText !== null && indicatorText !== void 0 ? indicatorText : ""
          })).append($("<span>").addClass("mw-geolocation-text").text(icon === "globe" ? "".concat(ipGeoLocationDesc).concat(getMessage(":")).concat(indicatorText) : indicatorText !== null && indicatorText !== void 0 ? indicatorText : ""));
          if (indicator === true) {
            $indicator.appendTo($(".mw-indicators"));
          } else {
            $indicator.prependTo($("#footer-info, .page-info"));
          }
        };
        var api = initMwApi("YsArxiv/1.1 (GeoLocationReader/1.0; ".concat(mw.config.get("wgWikiID"), ")"));
        var getUserGeoIP = function getUserGeoIP() {
          var propRevisionsParams = {
            action: "query",
            format: "json",
            formatversion: "2",
            titles: "User:".concat(wgRelevantUserName, "/GeoIP.json"),
            prop: "revisions",
            rvprop: "content",
            rvslots: "main"
          };
          api.get(propRevisionsParams).then(function (data) {
            var _getcountryOrAreaName, _getRegionName;
            var response = JSON.parse(data["query"].pages[0].revisions[0].slots.main.content);
            var countryOrAreaText = (_getcountryOrAreaName = getcountryOrAreaName2(response.countryOrArea)) !== null && _getcountryOrAreaName !== void 0 ? _getcountryOrAreaName : getMessage("Unknown");
            var regionText = response.countryOrArea === "CN" ? (_getRegionName = getRegionName2(response.region)) !== null && _getRegionName !== void 0 ? _getRegionName : "" : "";
            var indicatorText = "".concat(countryOrAreaText).concat(regionText);
            var spanClass = "green";
            appendIcon(indicatorText, spanClass, "globe");
          })["catch"](function () {
            var indicatorText = getMessage("Unknown");
            var spanClass = "orange";
            appendIcon(indicatorText, spanClass, "helpNotice");
          });
        };
        var listUsersParams = {
          action: "query",
          format: "json",
          formatversion: "2",
          list: "users",
          ususers: wgRelevantUserName,
          usprop: "groups"
        };
        api.get(listUsersParams).then(function (response) {
          var _response$query$users = _slicedToArray(response["query"].users, 1),
            groups = _response$query$users[0].groups;
          if (SYSTEM_SCRIPT_LIST.indexOf(wgRelevantUserName) !== -1 || groups.indexOf("bot") !== -1) {
            appendIcon(getMessage("Bot"), "blue", "settings");
          } else if (WEBMASTER_LIST.indexOf(wgRelevantUserName) !== -1 || groups.indexOf("qiuwen") !== -1) {
            appendIcon(getMessage("Webmaster"), "blue", "userAvatar");
          } else {
            getUserGeoIP();
          }
        });
      };
    
      // src/GeoLocationReader/GeoLocationReader.ts
      var readerLoad = function readerLoad() {
        if (wgRelevantUserName && mw.config.get("wgNamespaceNumber") === 2 && mw.config.get("wgAction") === "view") {
          var relevantUserPageName = new mw.Title(wgRelevantUserName, 2).toText();
          var pageName = new mw.Title(mw.config.get("wgPageName")).toText();
          if (relevantUserPageName === pageName) {
            getLocation();
          }
        }
      };
      $(readerLoad);
    })();
    
    })();
    /* </nowiki> */
    

/* jshint esversion: 8 */

var TextInfoLst = {
    "gre": {
        'css_init': true,
        'url': "html/gre/syn/gre.html",
        'urleps': "html/gre/syn/_EPS_.html",
        'name': 'Grenoble',
        'sigla': 'G',
        'dip_id': '#gre_dip_id',
        'int_id': '#gre_int_id'
    },
    "par": {
        'css_init': true,
        'url': "html/par/syn/par.html",
        'urleps': "html/par/syn/_EPS_.html",
        'name': 'Paris',
        'sigla': 'P',
        'dip_id': '#par_dip_id',
        'int_id': '#par_int_id'
    },
    "oxf": {
        'css_init': true,
        'url': "html/oxf/syn/oxf.html",
        'urleps': "html/oxf/syn/_EPS_.html",
        'name': 'Oxford',
        'sigla': 'O',
        'dip_id': '#oxf_dip_id',
        'int_id': '#oxf_int_id'
    }
    // "ven": {
    //     'css_init': true,
    //     'url': "html/ven/syn/ven.html",
    //     'urleps': "html/ven/syn/_EPS_.html",
    //     'name': 'V (venezia)',
    //     'sigla': 'V',
    //     'dip_id': '#ven_dip_id',
    //     'int_id': '#ven_int_id'
    // }
};

var initSync = function () {
    UaBarText.show();
};

var loadPannel = function (cod) {
    console.log("\n0) loadPannel()", cod);
    let status = TextMgr.getStatusText(cod);
    if (status != 0)
        return;
    UaWait.show();
    const text_info = TextInfoLst[cod];
    const url = text_info.url || "url null";
    fetch(url)
        .then((resp) => {
            if (resp.ok) return resp.text();
        })
        .then((text) => {
            try {
                const div_id = TextMgr.addText(cod);
                document.querySelector(div_id).innerHTML = "";
                document.querySelector(div_id).innerHTML = text;
                const text_info = TextInfoLst[cod];
                const pid = text_info.dip_id;
                const eps_array = $(pid).find('div').toArray();
                EpsMgr.init(eps_array);
                UaBarVert.init(eps_array);
                UaBarText.show();
                UaBarVert.showEpisode(cod, UaFl.eps_num);
                TextScroll();
                UaWait.hide();
            }
            catch (err) {
                throw new Error("response.text\n" + err);
            }
        })
        .catch((error) => {
            alert(`ERROR loadPannel()\nurl: ${url}\n${error}`);
        });
};


var TextMgr = {
    pos_lst: ['', '', '', ''],
    info_map: {
        'gre': {
            'css': null,
            'status': 0,
            'class': null,
            'id': null
        },
        'par': {
            'css': null,
            'status': 0,
            'class': null,
            'id': null
        },
        'oxf': {
            'css': null,
            'status': 0,
            'class': null,
            'id': null
        }
    },
    div_ids: ['#ua0', '#ua1', '#ua2'],
    css_lst: [{
        'position': 'absolute',
        'top': '50px',
        'left': '61px'
    }, {
        'position': 'absolute',
        'top': '50px',
        // 'left': '462px'
        'left': '520px'
    }, {
        'position': 'absolute',
        'top': '50px',
        // 'left': '863px'
        'left': '980px'
    }
        // {
        //     'position': 'absolute',
        //     'top': '50px',
        //     'left': '1263px'
        // },
    ],
    getPos: function (cod) {
        var n = this.pos_lst.indexOf(cod);
        return n;
    },
    getDivId: function (cod) {
        var info = this.info_map[cod];
        return info.id;
    },
    getPosList: function () {
        return this.pos_lst;
    },
    getInfoLst: function () {
        return this.info_map;
    },
    getStatusText: function (cod) {
        return this.info_map[cod].status;
    },
    getPosActive: function () {
        let ls = [];
        this.pos_lst.forEach(function (x) {
            if (x != '') ls.push(x);
        });
        return ls;
    },
    getDivFree: function () {
        let id = null;
        for (let i = 0; i < this.div_ids.length; i++) {
            let h = $(this.div_ids[i]).html();
            if (h == '') {
                id = this.div_ids[i];
                break;
            }
        }
        return id;
    },
    assignClasses: function () {
        let ks = Object.keys(this.info_map);
        for (let i = 0; i < ks.length; i++) {
            let k = ks[i];
            let info = this.info_map[k];
            if (info.status == 0) continue;
            $(info.id).css(info.css);
        }
    },
    addText: function (cod) {
        let n = this.pos_lst.indexOf(cod);
        if (n > -1)
            return -1;
        n = this.pos_lst.indexOf('');
        let id = this.getDivFree();
        let css = this.css_lst[n];
        this.pos_lst[n] = cod;
        this.info_map[cod].status = 1;
        this.info_map[cod].id = id;
        this.info_map[cod].css = css;
        return id;
    },
    delText: function (cod) {
        const n = this.pos_lst.indexOf(cod);
        this.pos_lst[n] = '';
        let info = this.info_map[cod];
        info.status = 0;
        $(info.id).html('');
        info.id = null;
        info.css = null;
    },
    swapLeft: function (cod) {
        const pos = this.pos_lst.indexOf(cod);
        if (pos > 0)
            this.swapPos(cod, pos - 1);
        else
            this.swapPos(cod, 3);
    },
    swapRight: function (cod) {
        const pos = this.pos_lst.indexOf(cod);
        if (pos < this.pos_lst.length - 1)
            this.swapPos(cod, pos + 1);
        else
            this.swapPos(cod, 0);
    },
    swapPos: function (cod0, pos1) {
        const pos0 = this.pos_lst.indexOf(cod0);
        let info0 = this.info_map[cod0];
        const css0 = info0.css;
        const css1 = this.css_lst[pos1];
        info0.css = css1;
        const cod1 = this.pos_lst[pos1];
        if (!!cod1) {
            var info1 = this.info_map[cod1];
            info1.css = css0;
        }
        this.pos_lst[pos0] = cod1;
        this.pos_lst[pos1] = cod0;
        this.assignClasses();
    }
};

var EpsMgr = {
    eps_array: null,
    ref_lst: null,
    init: function (eps_array) {
        this.eps_array = eps_array;
        this.ref_lst = [];
        for (let i = 0; i < eps_array.length; i++) {
            const ref = $(eps_array[i]).attr('ref');
            this.ref_lst.push(ref);
        }
    },
    getEpsElem: function (text_id, eps_num) {
        // let ref = this.ref_lst[eps_num];
        // let es = $(text_id).find("div.div_text").toArray();
        // let elm = null;
        // for (let i = 0; i < es.length; i++) {
        //     if (ref == $(es[i]).attr('ref')) {
        //         elm = es[i];
        //         break;
        //     }
        // }
        console.log("getEpsElem()", text_id, eps_num);
        const pannel = document.querySelector(text_id);
        const div_arr = pannel.querySelectorAll("div.div_text");
        const elm = div_arr[eps_num];
        return elm;
    },
    // "gre": {
    //     'css_init': true,
    //     'url': "html/gre/syn/gre.html",
    //     'urleps': "html/gre/syn/_EPS_.html",
    //     'name': 'Grenoble',
    //     'sigla': 'G',
    //     'dip_id': '#gre_dip_id',
    //     'int_id': '#gre_int_id'
    // },

    getUrl: function (cod, eps_num) {
        // const ref = this.ref_lst[eps_num];
        // let rf = ref.replace('#', '');
        // let info = TextInfoLst[cod];
        // let url = info.urleps.replace('_EPS_', rf);

        const info = TextInfoLst[cod];
        // 'dip_id': '#gre_dip_id',
        //<div id="gre_dip_id" class="text_pannel tei_dip">
        //  <div class="div_text" type="episode" ref="#tr_gre_000"></div>
        //  <div class="div_text" type="episode" ref="#tr_gre_001"></div>
        //</div>
        const pannel = document.querySelector(info.dip_id);
        const div_arr = pannel.querySelectorAll("div.div_text");
        const div = div_arr[eps_num];
        let ref = div.getAttribute("ref");
        ref = ref.replace("#", "")
        //urleps': "html/gre/syn/_EPS_.html",
        const url = info.urleps.replace('_EPS_', ref);
        return url;
    },
    removeText: function (cod) {
        console.log("removeText()", cod);
        // let text_info = TextInfoLst[cod];
        // let eds = $(text_info.dip_id).find("div.div_text").toArray();
        // let eis = $(text_info.int_id).find("div.div_text").toArray();
        // for (let i = 0; i < eds.length; i++) {
        //     $(eds[i]).empty();
        //     $(eis[i]).empty();
        // }
        let text_info = TextInfoLst[cod];
        let pannel = document.querySelector(text_info.dip_id);
        let div_arr = pannel.querySelectorAll("div.div_text");
        div_arr.forEach(e => e.innerHTML = "");

        pannel = document.querySelector(text_info.int_id);
        div_arr = pannel.querySelectorAll("div.div_text");
        div_arr.forEach(e => e.innerHTML = "");
    }
};

var TextScrollMgr = {
    text_num: 0,
    dips: null,
    ints: null,
    setTextNum: function (n) {
        this.text_num = n;
    },
    gerTextNum: function () {
        return this.text_num;
    },
    setTop: function () {
        $("div.text_pannel").scrollTop(0);
    },
    setAlignCod: function (cod) {
        let divs = $('div.text_pannel').toArray();
        let ua_id = TextMgr.getDivId(cod);
        let di = UaFl.getDipInt();
        let tei_cls = (di == 'd') ? "div.tei_dip" : "div.tei_int";
        let top = $(ua_id + " " + tei_cls).scrollTop();
        divs.forEach(function (x) {
            $(x).scrollTop(top);
        });
    },
    store: function () {
        this.dips = [];
        this.ints = [];
        let divs = $('div.text_pannel').toArray();
        let that = this;
        divs.forEach(function (x) {
            let t = $(x).scrollTop();
            let id = $(x).prop('id');
            let item = {
                'top': t,
                'id': id
            };
            if (id.indexOf('dip') > -1)
                that.dips.push(item);
            else
                that.ints.push(item);
        });
    },
    restore: function (di) {
        if (di == 'd')
            this.ints.forEach(function (x) {
                var id = "#" + x.id.replace('int', 'dip');
                $(id).scrollTop(x.top);
            });
        else
            this.dips.forEach(function (x) {
                var id = "#" + x.id.replace('dip', 'int');
                $(id).scrollTop(x.top);
            });
    }
};

var TextScroll = function () {
    var y0 = 0;
    var tops = [];

    var scrollMouseDown = function (e) {
        e.preventDefault();
        let last_id = e.currentTarget.id;
        y0 = e.clientY;
        for (let i = 0; i < divs.length; i++) {
            if ($(divs[i]).prop('id') == last_id)
                TextScrollMgr.setTextNum(i);
            $(divs[i]).css('cursor', 'move');
            tops[i] = $(divs[i]).scrollTop();
        }
        document.onmouseup = closeScrollElement;
        document.onmousemove = elementScroll;
    };

    var elementScroll = function (e) {
        e.preventDefault();
        let dy = y0 - e.clientY;
        y0 = e.clientY;
        for (var i = 0; i < divs.length; i++) {
            var top = tops[i] + dy;
            $(divs[i]).scrollTop(top);
            tops[i] = $(divs[i]).scrollTop();
        }
    };

    var closeScrollElement = function () {
        for (let i = 0; i < divs.length; i++) {
            $(divs[i]).css('cursor', 'default');
        }
        document.onmouseup = null;
        document.onmousemove = null;
    };

    var divs = $('div.text_pannel').toArray();
    for (let i = 0; i < divs.length; i++) {
        let e = $(divs[i])[0];
        if (!e) continue;
        e.onmousedown = scrollMouseDown;
    }
};


var UaFl = {
    dip_int: 'd',
    line_status: 1,
    eps_num: 0,
    getDipInt: function () {
        return this.dip_int;
    },
    showInt: function () {
        this.setDipInt('i');
        UaBarText.show();
    },
    showDip: function () {
        this.setDipInt('d');
        UaBarText.show();
    },
    setDipInt: function (di) {
        if (this.dip_int == di) return;
        TextScrollMgr.store();
        this.dip_int = di;
        //this.showEpsNum(this.eps_num);
        this.showActiveEps();
        TextScrollMgr.restore(di);
    },
    loadShowEpisode: function (cod, eps_num) {
        EpsMgr.removeText(cod);
        console.log("loadShowEpisode()", cod, eps_num);
        UaWait.show();
        const url = EpsMgr.getUrl(cod, eps_num) || "url null";
        console.log("=> url: " + url);
        fetch(url)
            .then((resp) => {
                if (resp.ok) return resp.text();
            })
            .then((text) => {
                try {
                    // FIXE eps_id temporaneo da eliminare
                    $("#eps_id").html(text);
                    let es = $("#eps_id").find('div.div_text').toArray();
                    let hd = es[0].innerHTML;
                    // es[0].innerHTML = "";
                    let hi = es[1].innerHTML;
                    // es[1].innerHTML = "";
                    document.querySelector("#eps_id").innerHTML = "";
                    let text_info = TextInfoLst[cod];
                    let ed = EpsMgr.getEpsElem(text_info.dip_id, eps_num);
                    let ei = EpsMgr.getEpsElem(text_info.int_id, eps_num);
                    $(ed).html(hd);
                    $(ei).html(hi);

                    if (UaFl.dip_int == 'd') {
                        $(text_info.int_id).hide();
                        $(text_info.dip_id).show();
                    } else {
                        $(text_info.dip_id).hide();
                        $(text_info.int_id).show();
                    }
                    TeimedCss.init(cod);
                    UaWait.hide();
                } catch (err) {
                    throw new Error("response.text\n" + err);
                }
            })
            .catch((error) => {
                alert(`ERROR \nladShowEpisode() \n${url}\n${error}`);
            });
    },
    // legge l'episodio di un testo
    loadEpisode: function (text_cod, eps_num) {
        console.log("loadEpisode()", text_cod, eps_num);
        TextMgr.assignClasses();
        this.loadShowEpisode(text_cod, eps_num);
    },
    // legge episodio in tutt i testi attivi
    loadActiveEps: function (eps_num) {
        console.log("loadActiveEps()", eps_num);
        if (this.eps_num == eps_num)
            return;
        this.eps_num = eps_num;
        const cod_lst = TextMgr.getPosActive();
        for (const cod of cod_lst) {
            console.log("=> ", cod);
            this.loadShowEpisode(cod, eps_num);
        }
        TextScrollMgr.setTop();
    },
    showActiveEps: function () {
        console.log("showActiveEps()");
        let show = function (cod, eps_num) {
            console.log("       show()", cod, eps_num);
            var text_info = TextInfoLst[cod];
            if (UaFl.dip_int == 'd') {
                $(text_info.int_id).hide();
                $(text_info.dip_id).show();
            } else {
                $(text_info.dip_id).hide();
                $(text_info.int_id).show();
            }
        };
        let txt_lst = TextMgr.getPosActive();
        for (let i = 0; i < txt_lst.length; i++) {
            let text_cod = txt_lst[i];
            show(text_cod, this.eps_num);
        }
        TextScrollMgr.setTop();
    }
};

var UaBarText = {
    show: function () {
        let di = UaFl.getDipInt();
        let dip = (di == 'd') ? 'active' : '';
        let int = (di == 'i') ? 'active' : '';
        const h0 = `
            <div class='ul'>
            <ul>
            <li><a class='pn' href='javascript:UaBarVert.showEpsPrev();'>
            <img src='css/ico/prev.png' height='24' /></a></li>
            <li><a class='pn' href='javascript:UaBarVert.showEpsSucc();'>
            <img src='css/ico/next.png' height='24' /></a></li>
           <li><a class='${dip}' href='javascript:UaFl.showDip();'><span>Dipl.</span></a></li>
            <li><a class='${int}' href='javascript:UaFl.showInt();'><span>Int.</span></a></li>
            <li><a class='x' href='javascript:TextScrollMgr.setTop();'>
            <img src='css/ico/aligntop.png' height='23' width='35' title="aligner au top"/></a></li>
            `;
        const h1 = `
            <li><a class='tei' href='javascript:TeiHelp.toggle();'>
            <img src='css/ico/help.png' height='25' width='35' title='help' /></a></li>
            </ul>
            </div>
            <div class='text'>
            `;
        let hsyn = this.barSyn();
        let h = h0 + hsyn[0] + h1 + hsyn[1] + "</div>";
        $('#bar_text_id').html(h).show();
    },
    barSyn: function () {
        let html1 = function () {
            let sts = TextMgr.getInfoLst();
            let templ = `<li><a class='txt {class}' href='javascript:loadPannel("{cod}");'><span >{sigla}</span></a></li>`;
            let jt = UaJt();

            let ks = Object.keys(sts);
            let cs = Array(ks.length);
            cs.fill('');
            let ps = TextMgr.getPosList();
            ks.forEach(function (k) {
                let p = ps.indexOf(k);
                if (p > -1)
                    cs[p] = k;
            });
            ks.forEach(function (k) {
                let p = ps.indexOf(k);
                if (p < 0) {
                    let n = cs.indexOf('');
                    cs[n] = k;
                }
            });
            cs.forEach(function (k, i) {
                let v = sts[k];
                let sigla = TextInfoLst[k].sigla;
                let item = {
                    'n': i,
                    'cod': k,
                    'sigla': sigla,
                    'class': (v.status != 0) ? 'active' : ''
                };
                jt.append(templ, item);
            });
            return jt.text();
        };
        const html2 = function () {
            const templ = `
            <span class="textn txt{n}">
            <a class="{class}" href='javascript:UaBarText.swapLeft("{cod}")';')>{left}</a>
            <span class="sep"></span>
            <a class="{class}" href='javascript:UaBarText.swapRight("{cod}")';')>{right}</a>
            <span class="sep"></span>
            <a class="{class}" href='javascript:TextScrollMgr.setAlignCod("{cod}")';')>{align}</a>
            <span>{name}</span>
            <a class="{class}" href='javascript:UaBarText.delText("{cod}")';>{del}</a>
            </span>
            `;
            let left = `<img src='css/ico/left.png' title='déplacer à gauche' >`;
            let right = `<img src='css/ico/right.png' title='déplacer à droite' />`;
            let del = `<img src='css/ico/delete.png' title='fermer'/>`;
            let align = `<img src='css/ico/align.png' title='aligner les autres'/>`;
            let jt = UaJt();
            let lst = TextMgr.getPosList();
            for (let i = 0; i < lst.length; i++) {
                let cod = lst[i];
                let item = {};
                item.cod = cod;
                if (cod != '') {
                    let info = TextInfoLst[cod];
                    item.name = info.name;
                    item.del = del;
                    item.left = left;
                    item.right = right;
                    item.align = align;
                    item.class = 'x';
                    item.cod = cod;
                } else {
                    item.name = 'Ms.';
                    item.del = '';
                    item.left = '';
                    item.right = '';
                    item.align = '';
                    item.class = 'hide';
                    item.cod = '';
                }
                item.n = i;
                jt.append(templ, item);
            }
            return jt.text();
        };
        return [html1(), html2()];
    },
    delText: function (cod) {
        TextMgr.delText(cod);
        UaBarText.show();
    },
    swapLeft: function (cod) {
        TextMgr.swapLeft(cod);
        UaBarText.show();
    },
    swapRight: function (cod) {
        TextMgr.swapRight(cod);
        UaBarText.show();
    }
};

var UaBarVert = {
    eps_list: null,
    init: function (es) {
        this.eps_list = [];
        for (let i = 0; i < es.length; i++) {
            let type = $(es[i]).attr('type');
            let ref = $(es[i]).attr('ref');
            let item = {
                'i': i,
                'type': type,
                'ref': ref.replace('#', ''),
                'class': 'x'
            };
            this.eps_list.push(item);
        }
    },
    showEpsPrev: function () {
        let n = UaFl.eps_num;
        if (n > 0)
            this.showEpsNum(n - 1);
    },
    showEpsSucc: function () {
        let n = UaFl.eps_num;
        let eps_le = this.eps_list.length;
        if (n < eps_le - 1)
            this.showEpsNum(n + 1);
    },
    showEpsNum: function (eps_num) {
        console.log("showEpsNum()", eps_num);
        UaFl.loadActiveEps(eps_num);
        let h = this.htmlEpsList(eps_num);
        $('#barv_text_id').html(h).show();
    },
    showEpisode: function (text_cod, eps_num) {
        console.log("showEpsode()", text_cod, eps_num);
        UaFl.loadEpisode(text_cod, eps_num);
        let h = this.htmlEpsList(eps_num);
        $('#barv_text_id').html(h).show();
    },
    htmlEpsList: function (n) {
        this.eps_list[n].class = 'used';
        let template = '<li><a class="{class}" href="javascript:UaBarVert.showEpsNum({i})">{ref}</a></li>';
        let jt = UaJt();
        jt.append("<div><ul>");
        jt.appendList(template, this.eps_list);
        jt.append("</ul></div>");
        this.eps_list[n].class = 'x';
        return jt.text();
    }
};


var TeiHelp = {
    id: '#teimed_help_id',
    visible: false,
    show: function () {
        const h1 = '<div><div class="head" ><a href="javascript:TeiHelp.toggle();">x</a></div>';
        const h2 = "</div>";

        let call = function (text) {
            var html = h1 + text + h2;
            $(TeiHelp.id).addClass('teimed_help');
            $(TeiHelp.id).html(html);
            var ew = $(TeiHelp.id)[0];
            UaDrag(ew);
            TeiHelp.visible = true;
            $(TeiHelp.id).show();
        };
        const url = "html/flsynhelp.html";
        fetch(url)
            .then((resp) => {
                if (resp.ok) return resp.text();
                else throw `status:${resp.status}`;
            })
            .then((text) => {
                call(text);
            })
            .catch((error) => {
                alert(`ERROR TeiHelp.show()()\n${url}\n${error}`);
            });
    },
    hide: function () {
        $(TeiHelp.id).html("");
        $(TeiHelp.id).hide();
        this.visible = false;
    },
    toggle: function () {
        if (this.visible) TeiHelp.hide();
        else TeiHelp.show();
    }
};


var TeimedCss = {
    init: function (cod) {
        TeimedCss.setAfterPoint(cod);
        TeimedCss.setDirMon(cod);
    },
    setDirMon: function (cod) {
        let pannel_id = TextInfoLst[cod].dip_id;
        let pannel = $(pannel_id);
        let ls = $(pannel).find(".from_to").toArray();
        let fts = [];
        // let le = ls.length;
        for (let e of ls) {
            // let e = ls[i];
            let idFrom = $(e).attr('from');
            let idTo = $(e).attr('to');
            let type = $(e).attr('type');
            let item = {
                'from': idFrom,
                'to': idTo,
                'type': type
            };
            fts.push(item);
        }

        let h, h0, h1, id0, id1, e0, e1;
        let spl = '';
        let spr = '';
        let dl = '"';
        let dr = '"';
        let idml = {
            'directspeech': '«',
            'monologue': '“'
        };
        let idmr = {
            'directspeech': '»',
            'monologue': '”'
        };
        //  controllare accesso testo
        for (const item of fts) {
            try {
                id0 = item.from;
                id1 = item.to;
                let clazz = item.type;

                // diplomatica
                // directbeg / monologuebeg
                e0 = $('#' + id0);
                let s = e0.html();
                if (!!s) {
                    h0 = spl + dl + s;
                    e0.html(h0).addClass(clazz + "beg");
                }
                // directend / monologueend
                e1 = $('#' + id1);
                h = e1.html();
                if (!!h) {
                    // impone la visualizzazione quando termina con .,?,!
                    let x = !!h.match(/[.!?]/gi) || false;
                    if (x) h = h.replace(/".|\!|\?/g, '');
                    h1 = h + dr + spr;
                    e1.html(h1).addClass(clazz + "end");
                    if (x) e1.removeClass('pc_ed');
                }

                // interpretativa
                // directbeg / monologuebeg
                let ap = idml[clazz];
                e0 = $('#x' + id0);
                s = e0.html();
                if (!!s) {
                    s = s[0].toUpperCase() + s.substr(1);
                    h0 = spl + ap + s;
                    e0.html(h0).addClass(clazz + "beg");
                    e0.html(h0).addClass("tei_directspeech_beg_int ");
                }

                // directend / monologueend
                let cl = idmr[clazz];
                e1 = $('#x' + id1);
                h1 = e1.html() + cl + spr;
                e1.html(h1).addClass(clazz + "end");
            }
            catch (e) {
                console.log("setDirMon", e, id0, id1);
            }
        }

        let ws = $(pannel).find("div.w").toArray();
        let w;
        let okd = false;
        let okm = false;
        let le = ws.length;
        let id_int;
        for (let i = 0; i < le; i++) {
            w = $(ws[i]);
            id_int = '#x' + w.prop('id');
            if (w.hasClass('directspeechbeg'))
                okd = true;
            if (w.hasClass('monologuebeg'))
                okm = true;
            if (okd) {
                w.addClass('tei_directspeech');
                $(id_int).addClass('tei_directspeech');
            }
            if (okm) {
                w.addClass('tei_monologue');
                $(id_int).addClass('tei_monologue');
            }
            if (w.hasClass('directspeechend'))
                okd = false;
            if (w.hasClass('monologueend'))
                okm = false;
        }
    },
    setAfterPoint: function (cod) {
        let pannel_id = TextInfoLst[cod].int_id;
        let pannel = $(pannel_id);
        let pcs = $(pannel).find(".pc_ed_upc_int").toArray();
        for (let i = 0; i < pcs.length; i++) {
            let pc = $(pcs[i]);
            let nx = $(pc).next();
            let nxid = $(nx).prop('id');
            // non è in fondo riga
            if (!!nxid)
                continue;
            let prl = $(pc).parents('div.l')[0];
            let nxl = $(prl).nextAll('div.l').first();
            let wf = $(nxl).find("div.w").first();
            $(wf).addClass('tei_capitalize_afp_int');
        }
    }
};

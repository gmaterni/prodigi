/* jshint esversion: 6 */

/*
var puntAfterSeg = function () {
    const pannel = document.querySelector("#pannel_int_id");
    const lst = pannel.querySelectorAll(".seg");
    for (const x of lst) {
        const pc = '<span class="pc_ed_int bk0">.</span>';
        x.insertAdjacentHTML("beforeend", pc);
    }
};
*/

/*
var list = function () {
    const pannel = document.querySelector("#pannel_dip_id");
    const lst = pannel.querySelectorAll("*");
    let i = 0;
    for (const x of lst) {
        i += 1;
        if (i > 1000) break;
        const id = x.id || "?";
        const t = x.tagName;
        const c = x.className || "?";
        const cs = x.classList;
        const s = !!cs ? cs.toString() : "!";
        console.log(t, c, `(${s})`, id);
    }
};
*/

var xxx = function (pm) {
};

const show_node = (e) => {
    e.classList.remove("no_display");
};

const hide_node = (e) => {
    e.classList.add("no_display");
};


const TextInfoMap = {
    //FIXME padova nel nome immagini,
    "gre": {
        'url': "html/gre/txt/gre.html",
        'urleps': "html/gre/txt/_EPS_.html",
        'imgs': "imgs/gre/t/padova_lii16_",
        'name': 'Grenoble'
    },
    "par": {
        'url': "html/par/txt/par.html",
        'urleps': "html/par/txt/_EPS_.html",
        'imgs': "imgs/par/par_243t6_",
        'name': 'Paris'
    },
    "oxf": {
        'url': "html/oxf/txt/oxf.html",
        'urleps': "html/oxf/txt/_EPS_.html",
        'imgs': "imgs/oxf/oxf_frz22_",
        'name': 'Oxford'
    }
};


const getTeiMed = function (text_cod) {
    const info = TextInfoMap[text_cod];
    const url = info.url || "url non indefinito";
    UaWait.show();
    //legge il pannello con la barra verticale
    fetch(url)
        .then((resp) => {
            if (resp.ok) return resp.text();
        })
        .then((text) => {
            // console.log("1 getTeimed()");
            document.getElementById('ua').innerHTML = "";
            document.getElementById('ua').innerHTML = text;
            UaFl.init(text_cod);
            UaWait.hide();
        })
        .catch((error) => {
            alert(`ERROR getTeimed()\n${url}\n${error}`);
        });
};

var EpsMgr = {
    wait: false,
    ref_array: null,
    text_cod: null,
    init: function () {
        this.text_cod = UaFl.text_cod;
        this.ref_array = [];
        for (let i = 0; i < UaFl.eps_array.length; i++) {
            const ep = UaFl.eps_array[i];
            const ref = $(ep).attr('ref');
            this.ref_array.push(ref);
        }
    },
    getUrl: function (n) {
        const ref = this.ref_array[n];
        const rf = ref.replace('#', '');
        const text_cod = EpsMgr.text_cod;
        const info = TextInfoMap[text_cod];
        const url = info.urleps.replace('_EPS_', rf);
        return url;
    },
    removeAll: function () {
        let pds = $('#pannel_dip_id  div.div_text').toArray();
        let pis = $('#pannel_int_id  div.div_text').toArray();
        for (let i = 0; i < pds.length; i++)
            pds[i].innerHTML = "";
        for (let i = 0; i < pis.length; i++)
            pis[i].innerHTML = "";
    }
};

var UaFl = {
    lk_imgs_base: null,
    line_select: true,
    line_status: 1,
    pannel_version: 'd',
    pag_curr_id: '',
    eps_num: 0,
    eps_array: null,
    pannel_img_width: null,
    is_note_show: false,
    init: function (text_cod, lk_imgs) {
        this.text_cod = text_cod;
        const info = TextInfoMap[text_cod];
        this.lk_imgs_base = info.imgs;
        this.eps_array = $('#pannel_dip_id').find('div.div_text').toArray();
        this.eps_num = 0;
        this.pannel_img_width = $('#pannel_img_id').width();
        EpsMgr.init(text_cod);
        this.htmlBarText(info.name);
        this.htmlBarImg();
        TeiBarSpy.init();
        TeiBarAbr.init();
        UaBarVert.init();
        this.showInit();
    },
    htmlBarText: function (sign) {
        const html = `
            <div class='sign'><span>${sign}</span></div> 
            <div class='ul'> 
            <ul> 
            <li><a href='javascript:UaFl.showPagAll();'><span>All</span></a></li>  
            <li><a class='pn' href='javascript:UaBarVert.showPagPrev();'> 
            <img src='css/ico/prev.png' height='24' /></a></li>  
            <li><a class='pn' href='javascript:UaBarVert.showPagSucc();'> 
            <img src='css/ico/next.png' height='24' /></a></li>  
            <li><a href='javascript: UaFl.toggleLnum()'><span>Lines n.</span></a></li>  
            <li><a href='javascript:UaFl.showDip();'><span>Dipl.</span></a></li>  
            <li><a href='javascript:UaFl.showInt();'><span>Int.</span></a></li>  
            <li><a href='javascript:UaFl.showDipInt()'><span>Dipl.&Int.</span></a></li>  
            <li><a href='javascript:UaFl.showNotes()'><span>Notes</span></a></li>  
            <li><a class='tei' href='javascript:TeiBarSpy.show()'> 
            <img src='css/ico/info.png' height='25' width='35'/></a></li>  
            <li><a class='tei' href='javascript:TeiBarAbr.show()'> 
            <img src='css/ico/abr.png' height='25' width='39'/></a></li>  
            <li><a class='tei' href='javascript:TeiHelp.toggle();'> 
            <img src='css/ico/help.png' height='25' width='35' /></a></li>  
            </ul> 
            </div>
            `;
        $('#bar_text_id').html(html).show();
    },
    htmlBarImg: function () {
        const html = `
            <div class='ul'>
            <ul>
            <li><a href='javascript:UaFl.incrImgPag();'><img src='css/ico/zoom_in.png' height='24'></a></li>
            <li><a href='javascript:UaFl.decrImgPag();'><img src='css/ico/zoom_out.png' height='24'></a> </li>
            <li><a href='javascript:UaFl.defImgPag();'><img src='css/ico/zoom_eq.png' height='24'></a> </li>
            </ul>
            </div>
            `;
        $('#bar_img_id').html(html).show();
    },
    setEpsNum: function (eps_num, ep_d, ep_i) {
        UaFl.eps_num = eps_num;
        UaFl.ep_d = ep_d;
        UaFl.ep_i = ep_i;
        this.removeNotes();
    },
    // id0 <= id <=id1
    rangeIds: function (ls, id0, id1) {
        let i;
        let ok = 0;
        let ids = [];
        for (i = 0; i < ls.length; i++) {
            id = $(ls[i]).prop('id');
            if (id == id0)
                ok = 1;
            if (ok)
                ids.push(id);
            if (id == id1)
                break;
        }
        return ids;
    },
    getIdVers: function (id) {
        let p = id.indexOf('x');
        let id_int = '';
        let id_dip = '';
        if (p == 0) {
            id_dip = id.substr(1);
            id_int = id;
        } else {
            id_dip = id;
            id_int = 'x' + id;
        }
        return {
            dip: id_dip,
            int: id_int
        };
    },
    getElemIdVers: function (e) {
        const id = e.attr('id');
        const ids = UaFl.getIdVers(id);
        return ids;
    },
    syncPannelScroll: function () {
        let timeout;
        $('#pannel_dip_id, #pannel_int_id').on("scroll", function callback() {
            clearTimeout(timeout);
            const source = $(this);
            let ref = $(source.is("#pannel_dip_id") ? '#pannel_int_id' : '#pannel_dip_id');
            ref.off("scroll").scrollTop(source.scrollTop());
            timeout = setTimeout(function () {
                ref.on("scroll", callback);
            }, 100);
            //window.requestAnimationFrame(function() {ref.on("scroll", callback); }, 100);
        });
    },
    //TODO onSelectLine: function () { probabilmente inutile
    onSelectLine: function () {
        let line_enter = function (e) {
            let elm = $(e.currentTarget);
            let idx = UaFl.getElemIdVers(elm);
            $('#' + idx.dip).addClass("line_select");
            $('#' + idx.int).addClass("line_select");
        };
        let line_leave = function (e) {
            let elm = $(e.currentTarget);
            let idx = UaFl.getElemIdVers(elm);
            $('#' + idx.dip).removeClass("line_select");
            $('#' + idx.int).removeClass("line_select");
        };
        $("div.l").on("mouseenter", function (e) {
            line_enter(e);
        });
        $("div.l").on("mouseleave", function (e) {
            line_leave(e);
        });
    },
    offSelectLine: function () {
        $("div.l").off("mouseenter");
        $("div.l").off("mouseleave");
    },
    onSelectNote: function () {
        $(".ptr").on("click", function (evn) {
            UaFl.showNote(evn.target.id);
        });
    },
    toggleLnum: function () {
        $("span.lnum").toggleClass("teimed_hidden");
    },

    //TODOtoggleSelectLine: function () {
    toggleSelectLine: function () {
        alert("toggleSelectLine");
        if (this.line_select == false) {
            this.onSelectLine();
            this.line_select = true;
        } else {
            this.offSelectLine();
            this.line_select = false;
        }
    },
    showInit: function () {
        try {
            UaFl.pannel_version = 'd';
            UaFl.showPagBarImg();
            $("#pannel_dip_id").addClass("teimed1_left");
            hide_node(document.getElementById("pannel_int_id"));
            show_node(document.getElementById("pannel_dip_id"));
        }
        catch (err) {
            alert(`ERROR showInit()\n${err}`);
        }
    },
    showDip: function () {
        try {
            this.showInit();
            UaFl.showPagId(UaFl.pag_curr_id);
        }
        catch (err) {
            alert(`ERROR showDip()\n${err}`);
        }
    },
    showInt: function () {
        try {
            UaFl.pannel_version = 'i';
            UaFl.showPagBarImg();
            $("#pannel_int_id").removeClass("teimed2_left");
            $("#pannel_int_id").addClass("teimed1_left");
            hide_node(document.getElementById("pannel_dip_id"));
            show_node(document.getElementById("pannel_int_id"));
            UaFl.showPagId(UaFl.pag_curr_id);
        }
        catch (err) {
            alert(`ERROR showInt()\n${err}`);
        }
    },
    showDipInt: function () {
        try {
            const pn_dip = "#pannel_dip_id";
            const pn_int = "#pannel_int_id";
            const vers = UaFl.pannel_version;
            UaFl.pannel_version = 'di';
            UaFl.hidePagBarImg();
            $(pn_int).removeClass("teimed1_left");
            $(pn_int).removeClass("teimed2_left");
            $(pn_dip).removeClass("teimed1_left");
            $(pn_dip).removeClass("teimed2_left");

            $(pn_dip).addClass("teimed1_left");
            $(pn_int).addClass("teimed2_left");
            show_node(document.querySelector(pn_dip));
            show_node(document.querySelector(pn_int));
            if (vers == 'd') {
                const top = $(pn_dip).scrollTop();
                $(pn_int).scrollTop(top);
            } else if (vers == 'i') {
                const top = $(pn_int).scrollTop();
                $(pn_dip).scrollTop(top);
            } else {
            }
            // UaFl.syncPannelScroll();
            UaFl.showPagId(UaFl.pag_curr_id);
        }
        catch (err) {
            alert(`ERROR showDipInt()\n${err}`);
        }
    },
    showPagAll: function () {
        try {
            if (UaFl.pannel_version == 'd') {
                document.querySelectorAll("#pannel_dip_id *").forEach(e => show_node(e));
            } else if (UaFl.pannel_version == 'i') {
                document.querySelectorAll("#pannel_int_id *").forEach(e => show_node(e));
            } else {
                document.querySelectorAll("#pannel_dip_id *").forEach(e => show_node(e));
                document.querySelectorAll("#pannel_int_id *").forEach(e => show_node(e));
                UaFl.syncPannelScroll();
            }
        }
        catch (err) {
            alert(`ERROR showPagAll()\n${err}`);
        }
    },
    showPagId: function (pag_id_dip) {
        try {
            const pag_id_int = "x" + pag_id_dip;
            UaFl.pag_curr_id = pag_id_dip;
            if (UaFl.pannel_version == 'd')
                UaFl.showPagVers(pag_id_dip);
            else if (UaFl.pannel_version == 'i')
                UaFl.showPagVers(pag_id_int);
            else {
                UaFl.showPagVers(pag_id_dip);
                UaFl.showPagVers(pag_id_int);
            }
        }
        catch (err) {
            alert(`ERROR showPagId()\npag_id: ${pag_id_dip}\n${err}`);
        }
    },
    showPagVers: function (pb0_id) {
        // utility per controllo liste
        /*
        let log_lst = function (lst) {
            const arr = Array.from(lst);
            const fn = (x, i) => {
                const id = x.id || "?";
                const tag = x.tagName.toLowerCase();
                const clzz = x.className;
                const s = `${i} ${tag} ${clzz} ${id}`;
                return s;
            };
            const arr_log = arr.map((x, i) => fn(x, i));
            console.log(arr_log);
            // const arr_tc = arr.map((x) => `${x.tagName.toLowerCase()} ${x.className}`);
            // const set_tc = new Set(arr_tc);
            // const arr_set = Array.from(set_tc).sort();
            // console.log(arr_set);
        };
        */
        /*
        let siblings = function (i) {
            let lst = [];
            const i0 = Math.max(i - 10, 0);
            const i1 = Math.min(i + 10, nd_lst.length - 1);
            for (let i = i0; i <= i1; i++)
                lst.push(nd_lst[i]);
            return lst;
        };
        */
        let parents = function (e) {
            prs = [];
            while (true) {
                p = e.parentNode;
                if (p.classList.contains("chapter"))
                    break;
                prs.push(p);
                e = p;
            }
            return prs;
        };
        try {
            const pb0 = document.getElementById(pb0_id);
            const div_text = pb0.closest("div.div_text");
            const pb_lst = div_text.querySelectorAll("div.pb");
            const pb_last_n = pb_lst.length - 1;
            let nd_lst = div_text.querySelectorAll("*");
            const nd_id_lst = Array.from(nd_lst).map(x => x.id);
            const container_lst = div_text.querySelectorAll("div.chapter,div.p,div.head,div.seg,div.s");

            const pb0_i = nd_id_lst.indexOf(pb0_id);
            let pb0_n = 0;
            for (let n = 0; n < pb_lst.length; n++) {
                if (pb_lst[n].id == pb0_id) {
                    pb0_n = n;
                }
            }
            const pb1_n = pb0_n < pb_last_n ? pb0_n + 1 : pb0_n;
            const pb1 = pb_lst[pb1_n];
            const pb1_id = pb1.id;
            const pb1_i = nd_id_lst.indexOf(pb1_id);
            const pb0_parents = parents(pb0);
            // const pb1_parents = parents(pb1);
            // const pb0_siblings = siblings(pb0_i);
            // const pb1_siblings = siblings(pb1_i);
            // const pb0_prs_sbs = parents_siblings(pb0_parents, pb0_siblings);

            nd_lst.forEach(e => show_node(e));

            let nd_ok_lst = [];
            // pb unico
            if (pb_last_n == 0) {
                // console.log("unico");
                for (const nd of nd_lst)
                    nd_ok_lst.push(nd);
            }
            // pb primo con successore
            else if (pb0_n == 0) {
                // console.log("primo + succ");
                let ok = false;
                for (let i = 0; i < nd_lst.length; i++) {
                    if (i == pb0_i)
                        ok = true;
                    if (i == pb1_i)
                        break;
                    if (ok) {
                        const nd = nd_lst[i];
                        nd_ok_lst.push(nd);
                    }

                }
            }
            // pb ultimo
            else if (pb0_n == pb_last_n) {
                // console.log("ultimo");
                let ok = false;
                for (let i = 0; i < nd_lst.length; i++) {
                    if (i == pb0_i)
                        ok = true;
                    if (ok) {
                        const nd = nd_lst[i];
                        nd_ok_lst.push(nd);
                    }
                }
            }
            // pb in mezzo ad altri pb
            else {
                // console.log("in mezzo");
                let ok = false;
                for (let i = 0; i < nd_lst.length; i++) {
                    if (i == pb0_i)
                        ok = true;
                    if (i == pb1_i)
                        break;
                    if (ok) {
                        const nd = nd_lst[i];
                        nd_ok_lst.push(nd);
                    }
                }
            }
            // console.log(pb0_n, pb0.innerHTML, pb0_id, pb0_i);
            // console.log(pb1_n, pb1.innerHTML, pb1_id, pb1_i);

            nd_lst.forEach(e => hide_node(e));
            container_lst.forEach(e => show_node(e));
            nd_ok_lst.forEach(e => show_node(e));
            //show i parents che NON sono w
            pb0_parents.forEach(e => {
                show_node(e);
            });
            // b1_parents.forEach(e => show(e));
            // log_lst(pb0_parents);
            // log_lst(pb0_siblings);
            // log_lst(pb0_prs_sbs);
            // log_lst(pb1_parents);
            // log_lst(pb1_siblings);
            // console.log("------------------");
        }
        catch (err) {
            alert(`ERROR showPagVers()\n${err}`);
        }
    },
    showNote: function (ptr_id) {
        let show_note = function (ptr_id, note_id) {
            let xxid = 'xx' + ptr_id;
            let ptr = $('#' + ptr_id);
            let n = $(ptr).html();
            let pannel = ptr.parents('div.text_pannel')[0];
            let notes = $(pannel).find("div.notes")[0];
            let hn = $(note_id).html();
            let h = '<div id="' + xxid + '" class="note_show"><div class="note_n">' + n + '</div>' + hn + '</div>';
            let y = ptr.offset().top + 0;
            $(notes).append(h);
            let nn = $('#' + xxid);
            $(nn).offset({
                'top': y
            }).show();
            $(nn).on("click", function (evn) {
                $('#' + xxid).remove();
            });
        };
        let ptr = $('#' + ptr_id);
        if (!ptr) return;
        let xxid = 'xx' + ptr_id;
        let nota_w = $('#' + xxid)[0];
        if (!nota_w) {
            let note_id = $(ptr).attr("target_note");
            $("div.note_show").remove();
            this.is_note_show = true;
            show_note(ptr_id, note_id);
        } else {
            $(nota_w).remove();
            this.is_note_show = false;
        }
    },
    removeNotes: function () {
        $("div.note_show").remove();
        this.is_note_show = false;
    },
    showNotes: function () {
        if (this.is_note_show) {
            this.removeNotes();
            return;
        }
        $("div.note_show").remove();
        UaFl.showNotesVers("#pannel_dip_id");
        UaFl.showNotesVers("#pannel_int_id");
        this.is_note_show = true;
    },
    showNotesVers: function (pannel_id) {
        let eps = $(pannel_id).find('div.div_text').toArray();
        let ep = eps[UaFl.eps_num];
        let ps = $(ep).find("a.ptr").toArray();
        if (ps.length == 0)
            return;
        let ptr = ps[0];
        let pannel = $(ptr).parents('div.text_pannel')[0];
        let notes = $(pannel).find("div.notes")[0];
        for (let i = 0; i < ps.length; i++) {
            let p = ps[i];
            let n = $(p).html();
            let note_id = $(p).attr("target_note");
            let hn = $(note_id).html();
            let h = '<div class="list note_show"><div class="note_n">' + n + '</div>' + hn + '</div>';
            $(notes).append(h);
        }
    },
    hidePagBarImg: function () {
        $('#pannel_img_id').hide();
        $("#bar_img_id").hide();
    },
    showPagBarImg: function () {
        $('#pannel_img_id').show();
        $("#bar_img_id").show();
        UaFl.defImgPag();
    },
    showPagImg: function (pag_n) {
        let url_pag = function (n) {
            let lk0 = UaFl.lk_imgs_base;
            let sn = "00" + n;
            let lk1 = sn.substr(sn.length - 4);
            let lk = lk0 + lk1 + ".jpg";
            return lk;
        };
        let url = url_pag(pag_n);
        let html = `
        <div id="div_img_id"  class="zoom"  >
          <img src="${url}" />
        </div> `;
        $('#pannel_img_id').html(html);
        let ew = $("#div_img_id")[0];
        UaDrag(ew);
        $("#bar_img_id").show();
        UaFl.defImgPag();
    },
    defImgPag: function () {
        $("#div_img_id img").width("100%");
        $('#div_img_id').css({
            "left": 0,
            "top": 0
        });
    },
    incrImgPag: function () {
        let w0 = UaFl.pannel_img_width;
        let w1 = $('#div_img_id img').width() + 200;
        let w2 = (w1 / w0 * 100).toString() + "%";
        // console.log(w2);
        $("#div_img_id img").width(w2);
    },
    decrImgPag: function () {
        let w0 = UaFl.pannel_img_width;
        let w1 = $('#div_img_id img').width() - 200;
        if (w1 < UaFl.pannel_img_width) {
            UaFl.defImgPag();
            return;
        }
        let w2 = (w1 / w0 * 100).toString() + "%";
        // console.log(w2);
        $("#div_img_id img").width(w2);
    }
};

//TODO TeimedCss
var TeimedCss = {
    setTeimCss: function () {
        try {
            this.setAfterPoint();
            this.setBegEpisode();
            this.setCapitalizeName();
            this.numerateLines();
            this.wordbroken();
            this.sic_no_choice();
        }
        catch (err) {
            alert("setTeimCss()\n" + err);
        }
    },
    setCapitalizeName: function () {
        let capitalize = function (qs) {
            let lst = document.querySelectorAll(qs);
            for (const div of lst) {
                let h = div.innerHTML;
                const idx = h.indexOf("<span");
                // console.log(h, idx);
                if (idx == 0) {
                    const sp = div.querySelector("span");
                    h = sp.innerHTML;
                    sp.innerHTML = h.charAt(0).toUpperCase() + h.slice(1);
                } else {
                    div.innerHTML = h.charAt(0).toUpperCase() + h.slice(1);
                }
                // console.log(div.innerHTML + "\n\n");
            }
        };
        capitalize("div.persname_int div.forename_int .w");
        capitalize("div.persname_int div.rolename_int .w");
        capitalize("div.placename_int div.name_int .w");
        capitalize("div.geogname_int div.name_int .w");
    },
    setAfterPoint: function () {
        const pannel = document.querySelector("#pannel_int_id");
        const lst = pannel.querySelectorAll("div.w,.pc_ed_upc_int");
        let pc = false;
        for (const x of lst) {
            if (pc && x.classList.contains("w")) {
                // x.classList.add("bk0");
                let y = x;
                let i = 0;
                while (true) {
                    i += 1;
                    let h = y.innerHTML;
                    if (i > 10) {
                        console.log("setAfetrPoint()");
                        console.log(x);
                        console.log(y);
                        alert(`setAfetrPoint()\n${x.innerHTML}`);
                        break;
                    }
                    if (h.indexOf("<span") == 0) {
                        y = y.querySelector("span");
                    } else {
                        h = h.charAt(0).toUpperCase() + h.slice(1);
                        y.innerHTML = h;
                        break;
                    }
                }
                pc = false;
            }
            if (x.classList.contains("pc_ed_upc_int"))
                pc = true;
        }
    },
    // maiuscola la prima parola dell'episodio
    setBegEpisode: function () {
        const episode = document.querySelector("#pannel_int_id div.div_text div.w");
        episode.classList.add("tei_episode_beg_int");
    },
    numerateLines: function (ref) {
        const eps_dip_int = document.querySelectorAll("div.div_text");
        for (const eps of eps_dip_int) {
            const lines = eps.querySelectorAll("span.lnum");
            for (let i = 0; i < lines.length; i++) {
                lines[i].innerHTML = `${i + 1}`;
                const w = lines[i].closest("div.w");
            }
        }
    },
    wordbroken: function (ref) {
        // diplomatica rimuove tuttle le broken
        const pannel_dip = document.querySelector("#pannel_dip_id");
        const eps_dip = pannel_dip.querySelectorAll("div.div_text");
        for (const eps of eps_dip) {
            const brokens = eps.querySelectorAll("span.broken");
            for (const brk of brokens) {
                brk.remove();
            }
        }
        // XXX intrpretativa rimuove quelle che NON sono interruzioni di w
        // const pannel_int = document.querySelector("#pannel_dip_id");
        const pannel_int = document.querySelector("#pannel_int_id");
        const eps_int = pannel_int.querySelectorAll("div.div_text");
        for (const eps of eps_int) {
            const brokens = eps.querySelectorAll("span.broken");
            for (const brk of brokens) {
                if (!brk.closest("div.w"))
                    brk.remove();
            }
        }
    },
    // AAA "sic" isolato NON all'interno di una choice dove è affiancato a "corr" 
    sic_no_choice: function (ref) {
        const sic_arr = document.querySelectorAll("span.sic_int");
        for (const sic of sic_arr) {
            const prev = sic.previousSibling;
            const next = sic.nextSibling;
            const prev_corr = !prev || !prev.classList ? false : prev.classList.contains("corr_int");
            const next_corr = !next || !next.classList ? false : next.classList.contains("corr_int");
            if (!next_corr && !prev_corr) {
                sic.classList.replace("sic_int", "sic_u");
            }
        }
    }

};


var UaBarVert = {
    eps_list: null,
    eps_array: null,
    pag_list: null,
    pag_used: null,
    init: function () {
        this.epsList();
        this.showEpsNum(0);
    },
    showPagPrev: function () {
        if (this.pag_used > 0)
            this.showPagNum(this.pag_used - 1);
    },
    showPagSucc: function () {
        if (this.pag_used < this.pag_list.length - 1)
            this.showPagNum(this.pag_used + 1);
    },
    showPagNum: function (n) {
        // console.log("showPagNum: ", n);
        this.pag_used = n;
        const pb_id = this.pag_list[n].pag_id;
        UaFl.showPagId(pb_id);
        UaBarVert.showPagUsed(pb_id);
        $("#pannel_int_id").scrollTop(0);
        $("#pannel_dip_id").scrollTop(0);
    },
    showPagUsed: function (pag_id) {
        let pgs = $('#barv_text_id div.pag a').toArray();
        for (let i = 0; i < pgs.length; i++) {
            $(pgs[i]).removeClass('used');
            if (i == this.pag_used)
                $(pgs[i]).addClass('used');
        }
    },
    showEpsNum: function (eps_num) {
        UaWait.show();
        const url = EpsMgr.getUrl(eps_num);
        fetch(url)
            .then((resp) => {
                if (resp.ok) return resp.text();
            })
            .then((text) => {
                EpsMgr.removeAll();
                // TODO rimuovere in segito
                if (!text) {
                    UaWait.hide();
                    return;
                }
                try {
                    //separa diplomatica da interpretativa
                    const dip_int = text.split("\n");

                    //TODO modifiare appoggio dipèlomatica ed interpretativa
                    /*
                    //id utilizzato temporaneamente per div_tex diplomatica e interpretativa
                    let eps_tmp = document.getElementById('eps_id');
                    //dipomatica
                    eps_tmp.innerHTML = dip_int[0];
                    //TDI probabilment einutile
                    const epd = eps_tmp.querySelector(".div_text");
                    //html diplomatic
                    const hd = epd.innerHTML;
                    //interpretativa
                    eps_tmp.innerHTML = dip_int[1];
                    const epi = eps_tmp.querySelector(".div_text");
                    //html interpretativa
                    const hi = epi.innerHTML;
                    //annullamento eps_id
                    document.getElementById('eps_id').innerHTML = '';
                    */
                    const hd = dip_int[0];
                    const hi = dip_int[1];

                    let ref = EpsMgr.ref_array[eps_num];
                    let ep_d_lst = $('#pannel_dip_id  div.div_text').toArray();
                    let ep_d = null;
                    for (let i = 0; i < ep_d_lst.length; i++) {
                        if ($(ep_d_lst[i]).attr('ref') == ref) {
                            ep_d = ep_d_lst[i];
                            break;
                        }
                    }
                    $(ep_d).html(hd);

                    let ep_i_lst = $('#pannel_int_id  div.div_text').toArray();
                    let ep_i = null;
                    for (let i = 0; i < ep_i_lst.length; i++) {
                        if ($(ep_i_lst[i]).attr('ref') == ref) {
                            ep_i = ep_i_lst[i];
                            break;
                        }
                    }
                    $(ep_i).html(hi);

                    TeimedCss.setTeimCss();
                    UaFl.onSelectNote();
                    //TODO UaFl.onSelectLine(); 
                    UaFl.syncPannelScroll();
                    UaFl.setEpsNum(eps_num, ep_d, ep_i);
                    UaBarVert.pagList(eps_num);
                    const html_eps_arr = UaBarVert.htmlEpsList(eps_num);
                    const html_pag_arr = UaBarVert.htmlPagList();
                    const html = html_eps_arr + html_pag_arr;
                    $('#barv_text_id').html(html).show();
                    UaBarVert.showPagNum(0);
                    UaWait.hide();
                }
                catch (err) {
                    throw new Error("then(text)\n" + err);
                }
            })
            .catch((error) => {
                alert(`ERROR showEpsNum()\nurl:${url}\n${error}`);
            });
    },
    epsList: function () {
        let eps = $('#pannel_dip_id').find('div.div_text').toArray();
        this.eps_array = eps;
        this.eps_list = [];
        for (let i = 0; i < eps.length; i++) {
            let type = $(eps[i]).attr('type');
            let ref = $(eps[i]).attr('ref');
            let episode = $(eps[i]).attr('episode');
            let item = {
                'i': i,
                'type': type,
                'ref': ref.replace('#', ''),
                'episode': episode,
                'class': 'x'
            };
            this.eps_list.push(item);
        }
    },
    pagList: function (epn) {
        let ep = this.eps_array[epn];
        const pbs = ep.querySelectorAll(".pb");
        this.pag_list = [];
        pbs.forEach((pb, i) => {
            const n = pb.getAttribute('n');
            const id = pb.id;
            let item = {
                'i': i,
                'n': n,
                'pag_id': id
            };
            this.pag_list.push(item);
        });
    },
    htmlEpsList: function (n) {
        this.eps_list[n].class = 'used';
        //XXX const template = '<li><a class="{class}" href="javascript:UaBarVert.showEpsNum({i})">{ref}</a></li>';
        const template = '<li><a class="{class}" href="javascript:UaBarVert.showEpsNum({i})">{episode}</a></li>';
        let jt = UaJt();
        jt.append("<div><ul>");
        jt.appendList(template, this.eps_list);
        jt.append("</ul></div>");
        this.eps_list[n].class = 'x';
        return jt.text();
    },
    htmlPagList: function () {
        const template = '<li><a href="javascript:UaBarVert.showPagNum({i})">{n}</a></li>';
        let jt = UaJt();
        jt.append("<div class='pag'><ul>");
        jt.appendList(template, this.pag_list);
        jt.append("</ul></div>");
        return jt.text();
    }
};


var TeiHelp = {
    id: '#teimed_help_id',
    visible: false,
    show: function () {
        const h1 = `
        <div>
        <div class="head" >
        <a href="javascript:TeiHelp.toggle();">x</a>
        </div>`;
        const h2 = "</div>";
        const url = "html/flhelp.html";
        fetch(url)
            .then((resp) => {
                if (resp.ok)
                    return resp.text();
                else
                    throw `status:${resp.status}`;
            })
            .then((text) => {
                const html = h1 + text + h2;
                $(TeiHelp.id).addClass('teimed_help');
                $(TeiHelp.id).html(html);
                const ew = $(TeiHelp.id)[0];
                UaDrag(ew);
                TeiHelp.visible = true;
                $(TeiHelp.id).show();
            })
            .catch((error) => {
                alert(`ERROR TeiHelp.help()\n${url}\n${error}`);
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


var TeiBarSpy = {
    id: '#teimed_bar_id',
    visible: false,
    init: function () {
        const html = `
<div>
<div class='close' ><div class='title'>Cockpit</div><a href="javascript:TeiBarSpy.hide();"">x</a></div>
<ul>
<li><a href="javascript:tei_class_reset();">reset</a></li>
<li class="sez">Scriptio</li>
<li><a href="javascript:tei_class_agglx('aggl');">aggl. (all)</a></li>
<li><a href="javascript:tei_class_aggl('aggl-s');">aggl. s.</a></li>
<li><a href="javascript:tei_class_aggl('aggl-s-uncert');">aggl. s.unc.</a></li>
<li><a href="javascript:tei_class_aggl('aggl-c');">aggl. c.</a></li>
<li><a href="javascript:tei_class_aggl('aggl-c-uncert');">aggl. c.unc.</a></li>
<li><a href="javascript:tei_class_like('degl');">degl.</a></li>
<li><a href="javascript:tei_class_like('elis');">elis.</a></li>
<li><a href="javascript:tei_class_like('encl');">encl.</a></li>
<li><a href="javascript:tei_class_pc_ms();">pc. ms.</a></li>
<li><a href="javascript:tei_class_like('abrev');">abr.</a></li>
<li><a href="javascript:tei_class_like('sic');">sic</a></li>
<li><a href="javascript:tei_class_like('annotaz');">glossae</a></li>

<li class="sez">Genetic</li>
<li><a href="javascript:tei_class_like('subst');">subst.</a></li>
<li><a href="javascript:tei_class_like('add');">add.</a></li>
<li><a href="javascript:tei_class_like('del');">del.</a></li>
<li><a href="javascript:tei_class_like('app');">app.</a></li>

<li class="sez">Editorial</li>
<li><a href="javascript:tei_class_like('ramis');">ramiste</a></li>
<li><a href="javascript:tei_class_like('diacr');">diacr.</a></li>
<li><a href="javascript:tei_class_like('pc_ed');">pc. ed.</a></li>
<li><a href="javascript:tei_class_like('corr');">corr.</a></li>

<li class="sez">Analisys</li>
<li><a href="javascript:show_direct();">dialog.</a></li>
<li><a href="javascript:show_monolog();">monolog.</a></li>

<li class="sez">Index</li>
<li><a href="javascript:tei_class_like('persname');">persName</a></li>
<li><a href="javascript:tei_class_like('placename');">placeName</a></li>
<li><a href="javascript:tei_class_like('geogname');">geogName</a></li>

</ul>
</div>
`;
        $(TeiBarSpy.id).addClass('teimed_bar');
        $(TeiBarSpy.id).hide();
        $(TeiBarSpy.id).html(html);
        $(TeiBarSpy.id).find('a').click(function () {
            $(this).toggleClass('teibar_select');
        });
        const ew = $(TeiBarSpy.id)[0];
        this.visible = false;
        UaDrag(ew);
    },
    show: function () {
        // let v = this.visible;
        if (this.visible) $(TeiBarSpy.id).hide();
        else $(TeiBarSpy.id).show();
        this.visible = !this.visible;
    },
    hide: function () {
        $(TeiBarSpy.id).hide();
        this.visible = false;
    }
};

var show_direct = function () {
    $("[class*=directspeech]").toggleClass("directspeech_spy");
};

var show_monolog = function () {
    $("[class*=monologue]").toggleClass("monologue_spy");
};

var tei_class_reset = function (cls) {
    $("*").removeClass("tei_spy");
    $('#teimed_bar_id a').removeClass("teibar_select");
};

var tei_class_like = function (cls) {
    $("[class*=" + cls + "]").toggleClass("tei_spy");
};

var tei_class_eql = function (cls) {
    $("[class=" + cls + "]").toggleClass("tei_spy");
};

var tei_class_pc_ms = function (cls) {
    if (agl) $("[class*=pc_1hd]").addClass("tei_spy");
    if (agl) $("[class*=pc_2hd]").addClass("tei_spy");
};

var agl = true;
var tei_class_agglx = function () {
    if (agl) $("[class*=aggl]").addClass("tei_spy");
    else $("[class*=aggl]").removeClass("tei_spy");
    agl = !agl;
};

var tei_class_aggl = function (cls) {
    let agls = $('div.' + cls).toArray();
    for (let i = 0; i < agls.length; i++) {
        let ag = agls[i];
        $(ag).toggleClass("tei_spy");
        let x = ag;
        for (; ;) {
            let an = $(x).next();
            let ls = $(an).attr('class');
            let p = ls.indexOf('aggl');
            $(an).toggleClass('tei_spy');
            if (p < 0) break;
            x = an;
        }
    }
};


var TeiBarAbr = {
    id: '#teimed_abr_id',
    visible: false,
    init: function () {
        const html = `
<div >
<div class='close' ><div class='title'>Abréviation</div><a href="javascript:TeiBarAbr.hide();"">x</a></div>
<ul>
<li><a href="javascript:TeiBarAbr.reset();">reset</a></li>
<li class="sez">Contraction</li>
<li><a href="javascript:TeiBarAbr.spy('ab-ctr-mlt');">mlt</a></li>
<li><a href="javascript:TeiBarAbr.spy2('ab-ctr-chr|ab-ctr-chrie');">chr/chrie</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-ctr-bn');">bn</a></li>
<li><a href="javascript:TeiBarAbr.spy2('ab-ctr-nre|ab-ctr-ure');">nre/ure</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-ctr-qt');">qt</a></li>
<li class="sez">Lettre Suscrite</li>
<li><a href="javascript:TeiBarAbr.spy4('ab-sus-qe|ab-sus-qi|ab-sus-qa|ab-sus-qo');">Sur q</a></li>
<li><a href="javascript:TeiBarAbr.spy3('ab-sus-pi|ab-sus-pe|ab-sus-po');">Sur p</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-sus-to');">Sur t</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-sus-gi');">Sur g</a></li>
<li class="sez">Tironiennes</li>
<li><a href="javascript:TeiBarAbr.spy('ab-tir-7');">7</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tir-7barr');">7 barré</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tir-7var');">7 var.</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tir-9');">9</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tir-est');">est</a></li>
<li class="sez">Signes Spéciaux</li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-nas');">Tilde de nasalité</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-ap');">Tilde apostrophe</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-ang');">Tilde brisé</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-ang-q');">Tilde brisé sur q</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-curb');">Tilde crochet</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-q');">Tilde sur q</a></li>
<li class="sez">Lettre Modifiée</li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-pbarr-d');">p barré droit</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-pbarr-c');">p barré courbe</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-qbarr-d');">q barré droit</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-qbarr-c');">q barré courbe</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-dbarr');">d barré</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-lbarr');">l barré</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-sbarr');">s barré</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-tap');">t apostrophe</a></li>
</ul>
</div>
`;
        $(TeiBarAbr.id).addClass('teimed_bar');
        $(TeiBarAbr.id).hide();
        $(TeiBarAbr.id).html(html);
        $(TeiBarAbr.id).find('a').click(function () {
            $(this).toggleClass('teibar_select');
        });
        const ew = $(TeiBarAbr.id)[0];
        this.visible = false;
        UaDrag(ew);
    },
    show: function () {
        // var v = this.visible;
        if (this.visible) $(TeiBarAbr.id).hide();
        else $(TeiBarAbr.id).show();
        this.visible = !this.visible;
    },
    hide: function () {
        $(TeiBarAbr.id).hide();
        this.visible = false;
    },
    reset: function () {
        //$("abrev").removeClass("tei_spy");
        $("[class*= abrev]").removeClass("tei_spy");
        $(TeiBarAbr.id + ' a').removeClass("teibar_select");
    },
    spy: function (cls) {
        $("[class*=" + cls + "]").toggleClass("tei_spy");
    },
    spy2: function (cls) {
        let cl = cls.split('|');
        $("[class*=" + cl[0] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[1] + "]").toggleClass("tei_spy");
    },
    spy3: function (cls) {
        let cl = cls.split('|');
        $("[class*=" + cl[0] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[1] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[2] + "]").toggleClass("tei_spy");
    },
    spy4: function (cls) {
        let cl = cls.split('|');
        $("[class*=" + cl[0] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[1] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[2] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[3] + "]").toggleClass("tei_spy");
    }
};
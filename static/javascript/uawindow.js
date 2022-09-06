// jshint esversion: 8
// release 25-04-22

var UaWindowAdm = {
    ws: {},
    create: function (id, parent_id = null) {
        var w = document.getElementById(id);
        if (!w) {
            w = document.createElement("div");
            if (!parent_id)
                document.body.appendChild(w);
            else
                document.getElementById(parent_id).appendChild(w);
            w.id = id;
        }
        w.style.display = "none";
        let uaw = this.newUaWindow(w);
        this.ws[id] = uaw;
        return uaw;
    },
    get: function (id) {
        if (!this.ws[id]) return null;
        return this.ws[id];
    },
    close: function (id) {
        if (!!this.ws[id])
            this.ws[id].close();
    },
    toggle: function (id) {
        if (!!this.ws[id])
            this.ws[id].toggle();
    },
    hide: function (id) {
        if (!!this.ws[id])
            this.ws[id].hide();
    },
    showAll: function () {
        for (let k in this.ws)
            this.ws[k].show();
    },
    hideAll: function () {
        for (let k in this.ws)
            this.ws[k].hide();
    },
    closeAll: function () {
        for (let k in this.ws)
            this.ws[k].close();
    },
    remove: function (id) {
        if (!this.ws[id]) return;
        document.getElementById(id).remove();
        this.ws[id] = null;
        delete this.ws[id];
    },
    removeAll: function () {
        for (let k in this.ws)
            this.remove(k);
        this.ws = {};
    },
    newUaWindow: function (jqw) {
        let wnd = {
            initialize: function (w) {
                this.w = w;
                this.wx = '0px';
                this.wy = '0px';
                this.isVisible = false;
                this.firstShow = true;
                this.pos = 0;
                this.wz = 0;
            },
            addClassStyle: function (className) {
                if (!this.w.classList.contains(className))
                    this.w.classList.add(className);
                return this;
            },
            removeClassStyle: function (className) {
                if (this.w.classList.contains(className))
                    this.w.classList.remove(className);
                return this;
            },
            getWindow: function () {
                alert("getWindow");
                return this.w;
            },
            getId: function () {
                return this.w.id;
            },
            getElement: function () {
                return this.w;
            },
            setStyle: function (styles) {
                for (const prop in styles)
                    this.w.style[prop] = styles[prop];
                return this;
            },
            setHtml: function (html) {
                this.w.innerHTML = html;
                return this;
            },
            getHtml: function () {
                return this.w.innerHTML;
            },
            /*
            pos==1) => si posiziona ad ogni chiamata di show
            pos==0) => si posiziona ad ogni chiamata di show
                        sucessiva ad uno status hide (default)
            pos==-1)=> si posiziona solo alla prima chiamata di show

            x => 0      left=x
            x < 0       right=abs(x)
            */
            setXY: function (x, y, pos_) {
                this.wx = x;
                this.wy = y;
                if (!!pos_) this.pos = pos_;
                return this;
            },
            setCenterY: function (y, p) {
                // let xd = $(window).width();
                // const wd=this.w.width();
                // const wd=this.w.offsetWidth;
                // let x = (xd - this.w.width()) / 2;
                let xd = window.innerWidth;
                const wd = this.w.clientWidth;
                let x = (xd - wd) / 2;
                this.setXY(x, y, p);
                return this;
            },
            setCenter: function (p) {
                // let xd = $(window).width();
                // let yd = $(window).height();
                // let x = (xd - this.w.width()) / 2;
                // let y = (yd - this.w.height()) / 2;
                let xd = window.innerWidth;
                let yd = window.innerHeight;
                const wd = this.w.clientWidth;
                const wh = this.w.clientHeight;
                let x = (xd - wd) / 2;
                let y = (yd - wh) / 2;
                this.setXY(x, y, p);
                return this;
            },
            linkToId: function (linked_id, dx, dy, p) {
                let lk = document.getElementById(linked_id);
                this.linkToElement(lk, dx, dy, p);
                return this;
            },
            linkToElement: function (elm, dx, dy, p) {
                let x = elm.offsetLeft + elm.offsetWidth + dx;
                let y = elm.offsetTop + dy;
                if (y < 0) y = 0;
                this.setXY(x, y, p);
                return this;
            },
            setZ: function (z) {
                this.wz = z;
                return this;
            },
            reset: function () {
                this.firstShow = true;
                return this;
            },
            toggle: function () {
                if (!this.isVisible) this.show();
                else this.hide();
                return this;
            },
            show: function () {
                if (this.firstShow || this.pos == 1 || this.pos === 0 && this.isVisible === false) {
                    // this.w.css({
                    //     position: "absolute",
                    //     // position: "fixed",
                    //     marginLeft: 0,
                    //     marginTop: 0,
                    //     top: this.wy + 'px'
                    // });
                    // if (this.wx >= 0)
                    //     this.w.css({ left: this.wx + 'px', });
                    // else
                    //     this.w.css({ right: -this.wx + 'px', });
                    // if (this.wz > 0)
                    //     this.w.css({ zIndex: this.wz });
                    this.w.style.position = 'absolute';
                    this.w.style.marginLeft = 0;
                    this.w.style.marginTop = 0;
                    this.w.style.top = this.wy + 'px';
                    if (this.wx >= 0)
                        this.w.style.left = this.wx + 'px';
                    else
                        this.w.style.right = -this.wx + 'px';
                    if (this.wz > 0)
                        this.w.style.zIndex = this.wz;
                }
                this.w.style.display = '';
                this.firstShow = false;
                this.isVisible = true;
                return this;
            },
            hide: function () {
                this.w.style.display = "none";
                this.isVisible = false;
                return this;
            },
            close: function () {
                this.w.style.display = "none";
                // this.w.innerHTML = '';
                this.w.innerHTML = 'block'; //TODO
                return this;
            },
            remove: function () {
                const id = this.w.id;
                UaWindowAdm.remove(id);
                return null;
            },
            drag: function () {
                UaDrag(this.w);
            }
        };
        wnd.initialize(jqw);
        return wnd;
    }

};
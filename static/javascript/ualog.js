// jshint esversion: 8
// release 19-04-2022

var UaLog = {
    active: false,
    wind: null,
    x: null,
    y: null,
    z: null,
    max_length: 2000,
    msg_id: "ualogmsg_",
    new: function () {
        if (this.wind == null) {
            this.wind = UaWindowAdm.create("ualog_");
            this.wind.drag();
        }
        var h = `
         <button type="button" onclick="javascript:UaLog.cls();">clear</button>
         <button type="button" onclick="javascript:UaLog.close();">close</button>
         <div id="ualogmsg_"></div>`;
        this.wind.setHtml(h);
        this.wind.setStyle({
            width: 'auto',
            minWidth: '300px',
            maxWidth: '400px',
            height: 'auto',
            textAlign: 'center',
            padding: '2px 2px 2px 2px',
            margin: '5px 0 0 0',
            background: '#111111',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 'normal',
            borderRadius: '9px'
        });

        const msg = document.getElementById(this.msg_id);
        const msg_css = {
            width: 'auto',
            textAlign: 'left',
            fontSize: '16px',
            paddingTop: '2px ',
            marginTop: '2px',
            color: 'inherit',
            background: '#444444',
            maxHeight: '600px',
            overflow: 'auto',
            scrollbarColor: '#ff4500 #ffffff',
            scrollbarWidth: 'auto'
        };
        for (const k in msg_css)
            msg.style[k] = msg_css[k];

        const btn_css = {
            background: '#555555',
            color: '#ffffff',
            padding: '5px 5px 5px 5px',
            margin: '0 5px 0 5px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: '1px solid #ffffff',
            borderRadius: '8px'
        };
        const btns = document.querySelectorAll("#ualog_  button");
        for (const b of btns) {
            for (const k in btn_css)
                b.style[k] = btn_css[k];
            b.addEventListener("mouseover", (e) => {
                e.target.style.cursor = 'pointer';
                e.target.style.color = '#000000';
                e.target.style.background = '#aaaaaa';
            });
            b.addEventListener("mouseout", (e) => {
                for (const k in btn_css)
                    e.target.style[k] = btn_css[k];
            });
        }
        if (!!this.x)
            this.wind.setXY(this.x, this.y, -1);
        else
            this.wind.setCenter(-1);
        if (!!this.z)
            this.wind.setZ(this.z);
        return this;
    },
    setXY: function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    },
    setZ: function (z) {
        this.z = z;
        return this;
    },
    prn_: function (...args) {
        let s = args.join("<br/>");
        let e = document.getElementById(this.msg_id);
        let h = e.innerHTML + s + "<br/>";
        if (h.length > this.max_length)
            h = h.slice(-this.max_length);
        e.innerHTML = h;
    },
    print: function (...args) {
        if (this.wind == null) return;
        if (!this.active) return;
        this.prn_(...args);
    },
    log: function (...args) {
        if (this.wind == null) return;
        this.prn_(...args);
    },
    log_show: function (...args) {
        if (this.wind == null) return;
        if (!this.active)
            this.toggle();
        this.prn_(...args);
    },
    cls: function () {
        if (this.wind == null) return;
        document.getElementById(this.msg_id).innerHTML = "";
        return this;
    },
    close: function () {
        if (this.wind == null) return;
        this.wind.hide();
        this.active = false;
    },
    toggle: function () {
        if (this.wind == null)
            return;
        if (!this.active) {
            this.active = true;
            this.wind.show();
        } else {
            this.active = false;
            this.wind.hide();
        }
    }
};
/* jshint esversion: 8 */

var UaJthl = function () {
    return {
        lines: [],
        fnh: null,
        reset() {
            this.lines = [];
            return this;
        },
        set_template(fn) {
            this.fnh = fn;
            return this;
        },
        insert(...args) {
            this.lines.unshift(this.fnh.call(this, ...args));
            return this;
        },
        insert_html(t) {
            this.lines.unshift(t);
            return this;
        },
        append(...args) {
            this.lines.push(this.fnh.call(this, ...args));
            return this;
        },
        append_html(t) {
            this.lines.push(t);
            return this;
        },
        append_json_array(data, num = 0) {
            for (let item of data)
                this.lines.push(this.fnh(item, num++));
            return this;
        },
        text(linesep) {
            const sep = linesep || "";
            return this.lines.join(sep);
        },
        html(linesep) {
            const s = this.text(linesep);
            return s.replace(/\s+|\[rn]/g, ' ');
        }
    };
};

// jshint esversion: 8

var UaJt = function () {
    const jt = {
        lines: [],
        sepL: '{',
        sepR: '}',
        reset: function () {
            this.lines = [];
            return this;
        },
        delimiters: function (sL, sR) {
            this.sepL = sL;
            this.sepR = sR;
            return this;
        },
        insert: function (templ, data) {
            let t = (!data) ? templ : this.render(templ, data);
            this.lines.unshift(t);
            return this;
        },
        append: function (templ, data) {
            let t = (!data) ? templ : this.render(templ, data);
            this.lines.push(t);
            return this;
        },
        appendEnum: function(templ, list,num) {
            for(var i=0;i< list.length;i++){
                var item=list[i];
                item[num]=i;
                this.append(templ,item);
            }
             return this;
         },
         appendList: function(templ, list) {
            for(var i=0;i< list.length;i++)
                this.append(templ,list[i]);
             return this;
         },


        render: function (templ, data) {
            let spl = templ.split(this.sepL);
            let arr = [spl[0]];
            let i, j, x, ks, k, v, le;
            for (i = 1; i < spl.length; i++) {
                x = spl[i].split(this.sepR);
                ks = x[0].trim().split('.');
                le = ks.length;
                for (j = 0; j < le; j++) {
                    k = ks[j];
                    v = data[k];
                }
                if (v === undefined)
                    v = this.sepL + ks.join('.') + ':undefined' + this.sepR;
                else if (!v && v !== 0)
                    v = v || '';
                else if (typeof (v) === 'object')
                    v = this.sepL + ks.join('.') + ':json Error' + this.sepR;
                arr.push(v);
                arr.push(x[1]);
            }
            return arr.join("");
        },
        text: function (linesep) {
            const sep = linesep || "";
            return this.lines.join(sep);
        },
        html: function (linesep) {
            let s = this.text(linesep);
            return s.replace(/\s+|\[rn]/g, ' ');
        }
    };
    return jt;
};

function template(strings, ...keys) {
    return (function (...values) {
        let dict = values[values.length - 1] || {};
        let result = [strings[0]];
        keys.forEach(function (key, i) {
            let value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
}

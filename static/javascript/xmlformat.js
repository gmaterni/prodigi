var xmlpag;
var openXML = function(rsp_txt) {
    var op = `
    width=1000,height=900, top=100,left=100,
    scrollbars=1,
    resizable=1,
    toolbar=0,
    status=0,
    menubar=0,
    titlebar=0 `;
    xmlpag = window.open("", "", op);
    var s0 = `
    <!doctype html>
    <html>
    <head>
<style>
textarea {
  padding:5px;
  border:2px solid #450000;
  background:#E2E188;
  color:#333333;
  font-size:18px;

}
</style>
    </head>
    <body>
    <textarea readonly rows="400" cols="100" class="xml" id="xml_id">
    `;
    var xml_head = `
<? "1.0" encoding="UTF-8"?>
    `;
    var s1 = `
    </textarea>
    </body>
    </html>
    `;
    var xml_txt = formatXML(rsp_txt);
    xmlpag.document.write(s0);
    xmlpag.document.write(xml_head);
    xmlpag.document.write("\r\n");
    xmlpag.document.write(xml_txt);
    xmlpag.document.write(s1);
};

closeXML = function() {
    xmlpag.close();
};

var showXML = function(url) {
    var call = function(rsp) {
        openXML(rsp.responseText);
    };
    UaRq.get(url, "", call, null, 'text');
};

var  formatXML=function(xml) {
    var formatted = xml.replace("<","&lt;").replace(">","&gt;");
    return formatted;
};


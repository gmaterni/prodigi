// jshint esversion: 8

var teimed = function (sign) {
  getTeiMed(sign);
};

var florimon_init = function (url) {
  menuh_init();
  pag(url);
};

var pag = async function (pag) {
  const url = "./pag/" + pag;
  fetch(url)
  .then((resp) => {
      if (resp.ok) return resp.text();
      else throw `ERROR\n${url}`;      
  })
  .then((text) => {
    $("#ua").html(text);
  })
  .catch((error) => {
      alert(`ERROR pag()\n${url}\n${error}`);
  });
};

var menuh_init = function () {
  let mvav = null;
  $(".title,.last ,#head,#ua").mouseenter(function () {
    $(".menuv").hide();
    $(".mvdv").hide();
  });

  $("a.mvah").mouseenter(function () {
    $(".menuv").hide();
    $(".mvdv").hide();
    $("a.mvah").removeClass("active");
    var li = $(this).parents("li")[0];
    $(li).find("div").show();
    $(li).find("a.mvah").addClass("active");
  });

  $("a.mvav").mouseenter(function () {
    $(".menuv").hide();
    $("a.mvah").removeClass("active");
    $("a.mvav").removeClass("active");
    let li = $(this).parents("li")[0];
    $(li).find("a.mvah").addClass("active");
    let x = this;
    mvav = x;
    let id = $(x).attr("mv");
    let d = $(x).parents("div")[0];
    // let p = $(d).position();
    let tp = (x.offsetTop + 75).toString() + "px";
    let l = $(d).css("left");
    let w = $(d).css("width");
    // let lf;
    let lf = (parseInt(l) + parseInt(w)).toString() + "px";
    let lfr = parseInt(lf);
    if (lfr > 1200) lf = (parseInt(l) - parseInt(w) - 98).toString() + "px";
    $(".menuv ").hide();
    $("#" + id).show();
    $(".menuvs").css("left", lf);
    $(".menuvs").css("top", tp);
  });

  $(".menuv ul li a ").mouseenter(function () {
    $(mvav).addClass("active");
  });

  $(".mvav ").click(function () {
    $(".menuv").hide();
    $(".mvdv").hide();
  });

  $(".menuv ul li a ").click(function () {
    $(".menuv").hide();
    $(".mvdv").hide();
  });
};

// _blank, _parent,  _self,  _top
var wop;
var FlSynOpen = function () {
  let url = "flsyn.html";
  let op = `width=1200,height=900, top=100,left=100,
    scrollbars=1,
    resizable=1,
    toolbar=0,
    status=0,
    menubar=0,
    titlebar=0 `;
  wop = window.open("", "", op);
  wop.location.href = url;
};

FlSynClose = function () {
  wop.close();
};

var woppag;
var open_pag = function (url) {
  let op = `width=1200,height=900, top=100,left=100,
    scrollbars=1,
    resizable=1,
    toolbar=0,
    status=0,
    menubar=0,
    titlebar=0 `;
  woppag = window.open("", "", op);
  woppag.location.href = url;
};

close_pag = function () {
  woppag.close();
};

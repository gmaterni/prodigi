// jshint esversion: 8


// var UaWait = {
//   w: null,
//   show: function (urlImg) {
//     $("body").addClass("wait");
//   },
//   hide: function () {
//     $("body").removeClass("wait");
//   }
// };


var UaWait = {
  w: null,
  show: function(urlImg) {
      if(!!this.w) return;
      urlImg = urlImg || 'css/ico/wait.gif';
      this.w = $('<div></div>').attr('id', '_wait_').appendTo('body');
      this.w.css({
          position: "fixed",
          background:"#c2c288",
          left: "0",
          top: "0",
          width: "100%",
          height: "100%",
          backgroundImage: "url(" + urlImg + ")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: "0.7",
          zIndex: "90"
      }).show();
  },
  hide: function() {
      if(!this.w) return;
      this.w.remove();
      this.w=null;
  }
};

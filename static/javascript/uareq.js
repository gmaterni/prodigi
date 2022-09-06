// uareq.js release: 17/08/2021
// jshint esversion: 8

var UaReq = {

  fetch_text: function (url, call) {
    alert("fetch_text()" +url);
    fetch(url)
      .then((resp) => {
        if (resp.ok) return resp.text();
        else  throw `status:${resp.status}`;
        
      })
      .then((text) => {
        call(text);
      })
      .catch((error) => {
        alert(`ERROR \n${url}\n${error}`);
      });
  }
};

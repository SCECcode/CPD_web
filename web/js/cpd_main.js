/***
   cpd_main.js
***/

var initial_page_load = true;

const Products = {
    SLIPRATE: 'sliprate',
    CHRONOLOGY: 'chronology',
};

var activeProduct = Products.SLIPRATE;
var cpd_sliprate_sites_data=null;
var cpd_chronology_sites_data=null;

var viewermap;

jQuery(document).ready(function() {

  frameHeight=window.innerHeight;
  frameWidth=window.innerWidth;

  var uagent = navigator.userAgent.toLowerCase();

  window.console.log("WHAT am I !! >>> "+uagent);
  window.console.log("screen width..("+screen.width+") and frame width..",frameWidth);

//if (navigator.userAgentData.mobile) { // do something }

  if( screen.width <= 480 ) {
    window.console.log("OH NO.. I am on Mini.."+screen_width);
    //location.href = '/mobile.html';
  }

  viewermap=setup_viewer();

// special handle keyword's input completion
  $('#keywordTxt').on("focus", function() {

     $('#keywordTxt').on("blur mouseout", function(event) {
       $('#keywordTxt').off("mouseout");
       $('#keywordTxt').off("blur");
       if( $(this).val() != '' ) {
        searchByKeyword();
       }
       $('#keywordTxt').blur();
     });
  });

  $('.cpd-minrate-item').on("focus", function() {
     $('.cpd-minrate-item').on("blur mouseout", function() {
       $('.cpd-minrate-item').off("mouseout");
       $('.cpd-minrate-item').off("blur");
       if( $(this).val() != '' ) {
         setupSearchByMinrate();
       }
       $(this).blur();
     });
  });

  $('.cpd-maxrate-item').on("focus", function() {
     $('.cpd-maxrate-item').on("blur mouseout", function() {
       $('.cpd-maxrate-item').off("mouseout");
       $('.cpd-maxrate-item').off("blur");
       if( $(this).val() != '' ) {
         setupSearchByMaxrate();
       }
       $(this).blur();
     });
  });

  $('.cpd-latlon-item').on("focus", function() {
     $('.cpd-latlon-item').on("blur mouseout", function() {
       $('.cpd-latlon-item').off("mouseout");
       $('.cpd-latlon-item').off("blur");
       if( $(this).val() != '' ) {
         searchByLatlon(0);
       }
       $(this).blur();
     });
  });

  $("#cpd-search-type").change(function () {
      var funcToRun = $(this).val();
      if (funcToRun != "") {
          window[funcToRun]();
      }
  });

  $("#cpd-search-type").trigger("change");

  $.event.trigger({ type: "page-ready", "message": "completed", });

  window.console.log("END in main");
  let tmp =cpd_sliprate_sites_data;


/** MAIN setup **/
// XXX
//  SLIPRATE_XX setup_layers
//  setupSearch();
//  addDownloadSelect();

}); // end of MAIN




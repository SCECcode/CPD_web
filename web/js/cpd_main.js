/***
   cpd_main.js
***/

var initial_page_load = true;

const Products = {
    SLIPRATE: 'sliprate',
    CHRONOLOGY: 'chronology',
};

var activeProduct = Products.SLIPRATE;
var cpd_sliprate_site_data=null;
var cpd_chronology_site_data=null;

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
         window.console.log(" need to call search by maxrate ");

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
         window.console.log(" need to call search by latlon ");
       }
       $(this).blur();
     });
  });

  $('.cpd-sitename-item').on("focus", function() {
     $('.cpd-sitename-item').on("blur mouseout", function() {
       $('.cpd-sitename-item').off("mouseout");
       $('.cpd-sitename-item').off("blur");
       if( $(this).val() != '' ) {
         window.console.log(" need to call search by sitename ");
	 let criteria = [];
         criteria.push($(this).val());
         CPD_SLIPRATE.search(CPD_SLIPRATE.searchType.sitename, criteria);
       }
       $(this).blur();
     });
  });

  $('.cpd-faultname-item').on("focus", function() {
window.console.log("getting on the faultname item..");
     $('.cpd-faultname-item').on("blur mouseout", function() {
       $('.cpd-faultname-item').off("mouseout");
       $('.cpd-faultname-item').off("blur");
       if( $(this).val() != '' ) {
	 let criteria = [];
         criteria.push($(this).val());
         CPD_SLIPRATE.search(CPD_SLIPRATE.searchType.faultname, criteria);
         window.console.log(" need to call search by faultname ");
       }
       $(this).blur();
     });
  });


  $("#cpd-search-type").on('change', function () {
      let type=$(this).val();
  window.console.log( "initiate a search session...",type);
      if(type != "") {
        CPD_SLIPRATE.freshSearch();
      }
      //CPD_SLIPRATE.showSearch(type);
  });


  $("#cpd-model-cfm").change(function() {
      if ($("#cpd-model-cfm").prop('checked')) {
          CXM.showCFMFaults(viewermap);
          } else {
              CXM.hideCFMFaults(viewermap);
      }
  });

  $("#cpd-model-gfm").change(function() {
      if ($("#cpd-model-gfm").prop('checked')) {
          CXM.showGFMRegions(viewermap);
          } else {
              CXM.hideGFMRegions(viewermap);
      }
  });

  $.event.trigger({ type: "page-ready", "message": "completed", });


  // SETUP
  window.console.log(" --- SETUP in main");

// load the data from backend and setup layers
  CPD_SLIPRATE.generateLayers();
// setup the interface 
  CPD_SLIPRATE.setupCPDInterface();

/** MAIN setup **/
// XXX
//  SLIPRATE_XX setup_layers
//  setupSearch();
  window.console.log(" --- WRAP up in main");

}); // end of MAIN




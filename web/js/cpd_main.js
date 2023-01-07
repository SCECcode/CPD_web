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

  $('.strike-item').on("focus", function() {
     $('.strike-item').on("blur mouseout", function() {
       $('.strike-item').off("mouseout");
       $('.strike-item').off("blur");
       if( $(this).val() != '' ) {
         setupSearchByStrike();
       }
       $(this).blur();
     });
  });

  $('.dip-item').on("focus", function() {
     $('.dip-item').on("blur mouseout", function() {
       $('.dip-item').off("mouseout");
       $('.dip-item').off("blur");
       if( $(this).val() != '' ) {
         setupSearchByDip();
       }
       $(this).blur();
     });
  });

  $('.latlon-item').on("focus", function() {
     $('.latlon-item').on("blur mouseout", function() {
       $('.latlon-item').off("mouseout");
       $('.latlon-item').off("blur");
       if( $(this).val() != '' ) {
         searchByLatlon(0);
       }
       $(this).blur();
     });
  });

  $("#search-filter-type").change(function () {
      var funcToRun = $(this).val();
      if (funcToRun != "") {
          window[funcToRun]();
      }
  });

  $("#search-filter-type").trigger("change");

/** MAIN setup **/
  getGeoTraceList();
  getAllTraces();
  setupSearch();
  addDownloadSelect();

}); // end of MAIN




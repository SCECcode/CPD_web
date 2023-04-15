/**

  cpd_sidebar.js

<option value="sliprate_faultname_search">Fault Name</option>
<option value="sliprate_sitename_search">Site Name</option>
<option value="sliprate_latlon_search">Latitude &amp; Longitude Box</option>
<option value="sliprate_minrate_search">minRate</option>
<option value="sliprate_maxrate_search">maxRate</option>

**/

var fault_sidebar=false;
var site_sidebar=false;
var latlon_sidebar=false;
var minrate_sidebar=false;
var maxrate_sidebar=false;

var drawing_rectangle=false;

// initiate a click on the sidebar buttons
// to dismiss the sidebar and reset the to the searchBy mode
function dismiss_sidebar() {
  clear_popup(); 
  if(zone_sidebar) zoneClick();
  if(section_sidebar) sectionClick();
  if(area_sidebar) areaClick();
  if(name_sidebar) nameClick();
  if(keyword_sidebar) keywordClick();
  if(latlon_sidebar) latlonClick();
  if(minrate_sidebar) minrateClick();
  if(maxrate_sidebar) maxrateClick();
  if(gid_sidebar) gidClick();
  var sidebarptr=$('#sidebar');
  sidebarptr.css("display","none");
}

function dismissClick() {
  dismiss_sidebar();
}

// area sidebar js

// slide out
function areaClick() {
  if(!area_sidebar) { dismiss_sidebar(); }

  area_sidebar = !area_sidebar;
  if(area_sidebar) {
    sidebar_area_slideOut();
    } else {
      sidebar_area_slideIn();
  }
}

function sidebar_area_slideOut() {
  if (jQuery('#area').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#area');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  panelptr.removeClass('fade-out').addClass('fade-in');
}
function sidebar_area_slideIn() {
  if (jQuery('#area').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#area');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
}


// zone sidebar
// slide out
function zoneClick() {
  if(!zone_sidebar) { dismiss_sidebar(); }

  zone_sidebar = !zone_sidebar;
  if(zone_sidebar) {
    sidebar_zone_slideOut();
    } else {
      sidebar_zone_slideIn();
  }
}

function sidebar_zone_slideOut() {
  if (jQuery('#zone').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#zone');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  panelptr.removeClass('fade-out').addClass('fade-in');
}
function sidebar_zone_slideIn() {
  if (jQuery('#zone').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#zone');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
}


// section sidebar js
// slide out
function sectionClick() {
  if(!section_sidebar) { dismiss_sidebar(); }

  section_sidebar = !section_sidebar;
  if(section_sidebar) {
    sidebar_section_slideOut();
    $('#sectionBtn').addClass('pick');
    } else {
      sidebar_section_slideIn();
      $('#sectionBtn').removeClass('pick');
  }
}

function sidebar_section_slideOut() {
  if (jQuery('#section').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#section');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  panelptr.removeClass('fade-out').addClass('fade-in');
}
function sidebar_section_slideIn() {
  if (jQuery('#section').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#section');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
}

// name sidebar js
// slide out
function nameClick() {
  if(!name_sidebar) { dismiss_sidebar(); }

  name_sidebar = !name_sidebar;
  if(name_sidebar) {
    sidebar_name_slideOut();
    $('#nameBtn').addClass('pick');
    } else {
      sidebar_name_slideIn();
      $('#nameBtn').removeClass('pick');
  }
}

function sidebar_name_slideOut() {
  if (jQuery('#name').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#name');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  panelptr.removeClass('fade-out').addClass('fade-in');
}
function sidebar_name_slideIn() {
  if (jQuery('#name').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#name');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
}


// keyword sidebar js
// slide out
function keywordClick() {
  if(!keyword_sidebar) { dismiss_sidebar(); }

  keyword_sidebar = !keyword_sidebar;
  if(keyword_sidebar) {
    sidebar_keyword_slideOut();
    $('#keywordBtn').addClass('pick');
    } else {
      sidebar_keyword_slideIn();
      $('#keywordBtn').removeClass('pick');
  }
}

function sidebar_keyword_slideOut() {
  if (jQuery('#keyword').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#keyword');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  panelptr.removeClass('fade-out').addClass('fade-in');
}
function sidebar_keyword_slideIn() {
  if (jQuery('#keyword').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#keyword');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
}

// minrate sidebar js
// slide out
// if it is filtering from whole set or active list
function minrateClick() {
  if(!minrate_sidebar) { dismiss_sidebar(); }

  minrate_sidebar = !minrate_sidebar;
  if(minrate_sidebar) {
    changeSiteColor("minrate");
    // determine the new set
    set_current_minrate_range_slider();
    sidebar_minrate_slideOut();
    } else {
      changeSiteColor("");
      sidebar_minrate_slideIn();
  }
}

function sidebar_minrate_slideOut() {
  if (jQuery('#cpd-minrate-slider').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#cpd-minrate-slider');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  panelptr.removeClass('fade-out').addClass('fade-in');
}
function sidebar_minrate_slideIn() {
  if (jQuery('#cpd-minrate-slider').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#cpd-minrate-slider');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
}


// maxrate sidebar js
// slide out
function maxrateClick() {
  if(!maxrate_sidebar) { dismiss_sidebar(); }

  maxrate_sidebar = !maxrate_sidebar;
  if(maxrate_sidebar) {
    changeSiteColor("maxrate");
    sidebar_maxrate_slideOut();
    set_current_maxrate_range_slider();
    } else {
      changeSiteColor("");
      sidebar_maxrate_slideIn();
  }
}

function sidebar_maxrate_slideOut() {
  if (jQuery('#cpd-maxrate-slider').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#cpd-maxrate-slider');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  panelptr.removeClass('fade-out').addClass('fade-in');
}

function sidebar_maxrate_slideIn() {
  if (jQuery('#cpd-maxrate-slider').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#cpd-maxrate-slider');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
}

// latlon sidebar js
// slide out
function latlonClick() {
  if(!latlon_sidebar) { dismiss_sidebar(); }

  latlon_sidebar = !latlon_sidebar;
  if(latlon_sidebar) {
    sidebar_latlon_slideOut();
    $('#latlonBtn').addClass('pick');
    markLatlon();
    } else {
      // enable the popup on map
      sidebar_latlon_slideIn();
      $('#latlonBtn').removeClass('pick');
  }
}

function set_latlons(firstlat,firstlon,secondlat,secondlon) {
   // need to capture the lat lon and draw a rectangle
   if(latlon_sidebar && drawing_rectangle) {
       $( "#firstLatTxt" ).val(firstlat);
       $( "#firstLonTxt" ).val(firstlon);
       $( "#secondLatTxt" ).val(secondlat);
       $( "#secondLonTxt" ).val(secondlon);
   }
}

function draw_at()
{
   if(latlon_sidebar && drawing_rectangle) {
     drawRectangle();
   }
}

// need to capture the lat lon and draw a rectangle but
// not when in the map-marking mode : drawing_rectangle==true
function chk_and_add_bounding_rectangle() {

  if(!drawing_rectangle) {
    return;
  }

  var firstlatstr=document.getElementById("firstLatTxt").value;
  var firstlonstr=document.getElementById("firstLonTxt").value;
  var secondlatstr=document.getElementById("secondLatTxt").value;
  var secondlonstr=document.getElementById("secondLonTxt").value;

  if((secondlatstr == "optional" && secondlonstr == "optional") ||
    (secondlatstr == "" && secondlonstr == "") ||
    (secondlatstr == "0" && secondlonstr == "0")) {
    if(firstlatstr && firstlonstr) { // 2 values
       var t1=parseFloat(firstlatstr);
       var t2=parseFloat(firstlonstr);

       var park_a=t1-0.01;
       var park_b=t2-0.01;
       var park_c=t1+0.01;
       var park_d=t2+0.01;
       add_bounding_rectangle(park_a,park_b,park_c,park_d);
    } 
    } else {
       if(secondlatstr && secondlonstr) {
         if(firstlatstr && firstlonstr) { // 4 values
           var park_a=parseFloat(firstlatstr);
           var park_b=parseFloat(firstlonstr);
           var park_c=parseFloat(secondlatstr);
           var park_d=parseFloat(secondlonstr);
           add_bounding_rectangle(park_a,park_b,park_c,park_d);
         }
       }
  }
}

//dismiss all popup and suppress the popup on map
function sidebar_latlon_slideOut() {
  if (jQuery('#latlon').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#latlon');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  panelptr.removeClass('fade-out').addClass('fade-in');
}

function markLatlon() {
  if(skipPopup == false) { // enable marking
    clear_popup();
    skipPopup = true;
    drawing_rectangle=true;
    unbind_layer_popup();
    $('#markerBtn').css("color","red");
    } else {
       skipPopup = false;
       drawing_rectangle=false;
       skipRectangle();
       $('#markerBtn').css("color","blue");
       remove_bounding_rectangle_layer();
       rebind_layer_popup();
  }
}

function reset_markLatlon() {
  skipPopup = false;
  $('#markerBtn').css("color","blue");
  drawing_rectangle=false;
  skipRectangle();
  rebind_layer_popup();
  remove_bounding_rectangle_layer();
  reset_select_latlon();
}


// enable the popup on map
function sidebar_latlon_slideIn() {
  if (jQuery('#latlon').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#latlon');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
  reset_markLatlon();
}

// gid sidebar js
// slide out
function gidClick() {
  if(!gid_sidebar) { dismiss_sidebar(); }

  gid_sidebar = !gid_sidebar;
  if(gid_sidebar) {
    sidebar_gid_slideOut();
    $('#gidBtn').addClass('pick');
    } else {
      sidebar_gid_slideIn();
      $('#gidBtn').removeClass('pick');
  }
}

function sidebar_gid_slideOut() {
  if (jQuery('#gid').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#gid');
  var sidebarptr=$('#sidebar');
  panelptr.css("display","");
  sidebarptr.css("display","");
  panelptr.removeClass('fade-out').addClass('fade-in');
}
function sidebar_gid_slideIn() {
  if (jQuery('#gi').hasClass('menuDisabled')) {
    // if this menu is disabled, don't slide
    return;
  }
  var panelptr=$('#gid');
  panelptr.removeClass('fade-in').addClass('fade-out');
  panelptr.css("display","none");
}

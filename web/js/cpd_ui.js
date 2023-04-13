/***
   cpd_ui.js
***/

var showing_key = false;
var big_map=0; // 0,1(some control),2(none)

/************************************************************************************/

function _toMedView()
{
let elt = document.getElementById('banner-container');
let celt = document.getElementById('top-intro');
let c_height = elt.clientHeight+(celt.clientHeight/2);
let h=576+c_height;

$('#top-intro').css("display", "none");
$('#searchResult').css("display", "none");
$('#CPD_plot').css("height", h);
$('#infoData').removeClass('col-5').addClass('col-0');
$('#top-map').removeClass('col-7').addClass('row');
$('#top-map').removeClass('pl-1').addClass('pl-0');
$('#mapDataBig').addClass('col-12').removeClass('row');
resize_map();
}

function _toMinView()
{
let height=window.innerHeight;
let width=window.innerWidth;

$('#top-control').css("display", "none");
$('#top-select').css("display", "none");
$('.navbar').css("margin-bottom", "0px");
$('.container').css("max-width", "100%");
$('.container').css("padding-left", "0px");
$('.container').css("padding-right", "0px");
// minus the height of the container top 
let elt = document.getElementById('banner-container');
let c_height = elt.clientHeight;
let h = height - c_height-4.5;
let w = width - 15;
//window.console.log( "height: %d, %d > %d \n",height, c_height,h);
//window.console.log( "width: %d, %d  \n",width, w);
$('#CPD_plot').css("height", h);
$('#CPD_plot').css("width", w);
resize_map();
}

function _toNormalView()
{
$('#top-control').css("display", "");
$('#top-select').css("display", "");
$('#CPD_plot').css("height", "576px");
$('#CPD_plot').css("width", "635px");
$('.navbar').css("margin-bottom", "20px");
$('.container').css("max-width", "1140px");
$('.container').css("padding-left", "15px");
$('.container').css("padding-right", "15px");

$('#top-intro').css("display", "");
$('#searchResult').css("display", "");
$('#infoData').addClass('col-5').removeClass('col-0');
$('#top-map').removeClass('row').addClass('col-7');
$('#top-map').removeClass('pl-1').addClass('pl-0');
$('#mapDataBig').removeClass('col-12').addClass('row');
resize_map();
}

function toggleBigMap()
{
  switch (big_map)  {
    case 0:
      big_map=1;
      _toMedView();		   
      break;
    case 1:
      big_map=2;
      _toMinView();		   
      break;
    case 2:
      big_map=0;
      _toNormalView();		   
      break;
  }
}

/************************************************************************************/

function disable_record_btn() {
  $('#recordReferenceBtn').attr("disabled", true);
}

function enable_record_btn() {
  $('#recordReferenceBtn').attr("disabled", false);
}

function disable_last_record_btn() {
  $('#lastRecordedReferenceBtn').attr("disabled", true);
}

function enable_last_record_btn() {
  $('#lastRecordedReferenceBtn').attr("disabled", false);
}

/************************************************************************************/

function set_minrate_range_color(min,max) {
  let minRGB= makeMinrateRGB(min);
  let maxRGB= makeMinrateRGB(max);
  let myColor="linear-gradient(to right, "+minRGB+","+maxRGB+")";
  $("#slider-minrate-range .ui-slider-range" ).css( "background", myColor );
}

//??? not using the realmin and realmax
function setupMinrateRangeSlider(realmin,realmax) {
window.console.log("setup real Minrate Range",realmin," and ",realmax);
// around 0,360
  setup_minrate_range_ref(realmin,realmax);

  $( "#slider-minrate-range" ).slider({
    range: true,
    step: 1,
    min: 0,
    max: 0,
    values: [ realmin, realmax ],
    slide: function( event, ui ) {
      $("#lowMinrateTxt").val(ui.values[0]);
      $("#highMinrateTxt").val(ui.values[1]);
      set_minrate_range_color(ui.values[0],ui.values[1]);
    },
    change: function( event, ui ) {
      $("#lowMinrateTxt").val(ui.values[0]);
      $("#highMinrateTxt").val(ui.values[1]);
      set_minrate_range_color(ui.values[0],ui.values[1]);
    },
    stop: function( event, ui ) {
      searchWithMinrateRange();
    },
    create: function() {
      $("#lowMinrateTxt").val(realmin);
      $("#highMinrateTxt").val(realmax);
    }
  });

  $('#slider-minrate-range').slider("option", "min", realmin);
  $('#slider-minrate-range').slider("option", "max", realmax);
}

function set_maxrate_range_color(min,max) {
  let minRGB= makeMaxrateRGB(min);
  let maxRGB= makeMaxrateRGB(max);
  let myColor="linear-gradient(to right, "+minRGB+","+maxRGB+")";
  $("#slider-maxrate-range .ui-slider-range" ).css( "background", myColor );
}

// using the realmin and realmax
function setupMaxrateRangeSlider(realmin,realmax) {
  setup_maxrate_range_ref(realmin,realmax);
  $( "#slider-maxrate-range" ).slider({
    range: true,
    step: 1,
    min: 0,
    max: 0,
    values: [ realmin, realmax ],
    change: function( event, ui ) {
      $("#lowMaxrateTxt").val(ui.values[0]);
      $("#highMaxrateTxt").val(ui.values[1]);
      set_maxrate_range_color(ui.values[0],ui.values[1]);
    },
    slide: function( event, ui ) {
      $("#lowMaxrateTxt").val(ui.values[0]);
      $("#highMaxrateTxt").val(ui.values[1]);
      set_maxrate_range_color(ui.values[0],ui.values[1]);
    },
    stop: function( event, ui ) {
      searchWithMaxrateRange();
    },
    create: function() {
      $("#lowMaxrateTxt").val(realmin);
      $("#highMaxrateTxt").val(realmax);
    }
  });
  $('#slider-maxrate-range').slider("option", "min", realmin);
  $('#slider-maxrate-range').slider("option", "max", realmax);
}

/*********************************************************************************/

// https://www.w3schools.com/howto/howto_js_sort_table.asp
// n is which column to sort-by
// type is "a"=alpha "n"=numerical
function sortMetadataTableByRow(n,type) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("metadata-viewer");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 

window.console.log("Calling sortMetadataTableByRow..",n);

  while (switching) {
    switching = false;
    rows = table.rows;
    if(rows.length < 3) // no switching
      return;

/* loop through except first and last */
    for (i = 1; i < (rows.length - 2); i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];

      if (dir == "asc") {
        if(type == "a") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
          } else {
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
         }
      } else if (dir == "desc") {
        if(type == "a") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
          } else {
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++; 
    } else {

      window.console.log("done switching..");
      if(switchcount != 0) {

      }
     

      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  var id="#sortCol_"+n;
  var t=$(id);
  if(dir == 'asc') {
    t.removeClass("fa-angle-down").addClass("fa-angle-up");
    } else {
      t.removeClass("fa-angle-up").addClass("fa-angle-down");
  }
}


// add details button
function add_details_btn(meta,str) {
  var gid=meta['gid'];
  str=str+'<button class=\"btn btn-xs cxm-small-btn\" title=\"show more fault details\"><span id=\"detail_'+gid+'\" class=\"glyphicon glyphicon-menu-hamburger\" onclick=\"show_details('+gid+')\"></span></button>';
  return str;
}

// add details button
function add_highlight_btn(meta,str) {
  var gid=meta['gid'];
  str=str+'<button class=\"btn btn-xs cxm-small-btn\" title=\"highlight this fault\"><span id=\"detail_'+gid+'\" class=\"glyphicon glyphicon-ok\" onclick=\"toggle_highlight('+gid+',0)\"></span></button>';
  return str;
}

function add_downloads_btn(meta,str) {
  var gid=meta['gid'];
  if(in_native_gid_list(gid)) {
    var url=url_in_native_list(gid);
    if(url) {
      str=str+'<a href=\"'+url+'\" download> <button class=\"btn btn-xs cxm-btn\" title=\"download native tsurf file\"><span id=\"download_native_'+gid+'\" class=\"glyphicon glyphicon-download\"></span>native</button></a>';
    }
  }
  return str;
}

function get_downloads_btn(meta) {
    var str = "";
    var gid=meta['gid'];

    if(in_native_gid_list(gid)) {
        var url=url_in_native_list(gid);
        if(url) {
            str=str+'<a href=\"'+url+'\" download> <button class=\"btn btn-xs cxm-btn\" title=\"download native tsurf file\"><span id=\"download_native_'+gid+'\" class=\"glyphicon glyphicon-download\"></span>native</button></a>';
        }
    }
    return str;
}


function addDownloadSelect() {
  var htmlstr="<div class=\"cpd-control-download-list\"><span style=\"font-size:14px;font-weight:bold; text-align:center;\">&nbsp;Select download </span><form onchange=\"changeDownloadSet()\"><div class=\"cpd-control-download-base\"><label> <div><input type=\"radio\" class=\"cpd-control-download-selector\" name=\"cpd-sliprate-download\" value=\"meta\"><span> metadata</span></div><div><input type=\"radio\" class=\"cpd-control-download-selector\" name=\"cpd-sliprate-download\" value=\"native\"><span> native + metadata</span></div></label><label><div><input type=\"radio\" class=\"cpd-control-download-selector\" name=\"cpd-sliprate-download\" value=\"500m\" ><span> 500m + metadata</span></div></label><label><div><input type=\"radio\" class=\"cpd-control-download-selector\" name=\"cpd-sliprate-download\" value=\"1000m\" ><span> 1000m + metadata</span></div></label></div></form></div>";

   var html_div=document.getElementById('downloadSelect');
   html_div.innerHTML = htmlstr;
}


function saveAsJSONBlobFile(data, timestamp)
{
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
//   var rnd= Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var fname="CPD_metadata_"+timestamp+".json";
    var blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    //FileSaver.js
    saveAs(blob, fname);
}

function saveAsCSVBlobFile(data, timestamp)
{
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
//   var rnd= Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var fname="CPD_metadata_"+timestamp+".csv";
    var blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    //FileSaver.js
    saveAs(blob, fname);
}

function saveAsBlobFile(data)
{
    let timestamp = $.now();
    let fname="CPD_link_"+timestamp+".txt";
    let blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    //FileSaver.js
    saveAs(blob, fname);
}

function saveAsURLFile(gid,url) {
  var dname=url.substring(url.lastIndexOf('/')+1);
  var dload = document.createElement('a');
  dload.href = url;
  dload.download = dname;
  dload.type="application/octet-stream";
  dload.style.display='none';
  document.body.appendChild(dload);
  dload.click();
  document.body.removeChild(dload);
  delete dload;
}


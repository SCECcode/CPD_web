/**
    cxm_misc_util.c

contains utilities used by cxm based functions

**/

function truncateNumber(num, digits) {
    let numstr = num.toString();
    if (numstr.indexOf('.') > -1) {
        return numstr.substr(0 , numstr.indexOf('.') + digits+1 );
    } else {
        return numstr;
    }
}

function isObject(objV) {
  return objV && typeof objV === 'object' && objV.constructor === Object;
}

// color from blue to red
function makeRGB(val, maxV, minV) {
    let v= (val-minV) / (maxV-minV);
    let blue = Math.round(255 * v);
    let green = 0;
    let red = Math.round((1-v)*255);
    let color="RGB(" + red + "," + green + "," + blue + ")";
    return color;
}

// should be a very small file and used for testing and so can ignore
// >>Synchronous XMLHttpRequest on the main thread is deprecated
// >>because of its detrimental effects to the end user's experience.
//     url=http://localhost/data/synapse/segments-dummy.csv
function ckExist(url) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (this.readyState == 4) {
 // okay
    }
  }
  http.open("GET", url, false);
  http.send();
  if(http.status !== 404) {
    return http.responseText;
    } else {
      return null;
  }
}

// return true if target is in the glist
// glist=[]
// target any item
function inList(target, glist) {
   var found=0;
   if(glist.length == 0)
     return found;

   glist.forEach(function(element) {
     if ( element == target )
        found=1;
   });
   return found;
}


/***************************************
  not sure where this is used (from cgm_util.js)

  function MapFeature(gid, properties, geometry, scec_properties) {
    this.type = "FeatureCollection";
    this.gid = gid;
    this.features =[{
        type: "Feature",
        id: gid,
        properties: properties,
        geometry: geometry,
    }];
    this.layer = null;
    this.scec_properties = scec_properties;
  }
****************************************/


function updateDownloadCounter(select_count) {
//    window.console.log("download counter updated.."+select_count);
    let downloadCounterElem = $("#download-counter");
    let downloadBtnElem = $("#download-all");
    let placeholderTextElem = $("#placeholder-row");
    if (select_count <= 0) {
        downloadCounterElem.hide();
        downloadBtnElem.prop("disabled", true);
        placeholderTextElem.show();
    } else {
       downloadCounterElem.show();
       downloadBtnElem.prop("disabled", false);
       placeholderTextElem.hide();
    }
    downloadCounterElem.html("(" + select_count + ")");
}


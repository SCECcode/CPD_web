/**
    cxm_model_util.c

  1) show models' external view, 
  2) housekeeping displaying/creating via some geoJson format or formatted txt files 

a) export 'active' fault's geo out into an external file 
b) import external geoJson.txt and create a groupLayer with optional name popup
c) import external latlon.csv with 'name' and create a group Layerof mulitple groups of points with different color 

**/

var CXM = new function () {

  const CFM_FNAME="CFM6.0_geoJson.txt";
  const CTM_FNAME="CTM_geoJson.txt";
  const CRM_FNAME="CRM_geoJson.txt";

  const CFM_URL="data/CFM6.0_geoJson.txt";
  const CTM_URL="data/CTM_geoJson.txt";
  const CRM_URL="data/CRM_geoJson.txt";
  const CRM_POLYGON_URL="data/CRM_polygons_points_with_corrected_Rift_names_Mar112019.csv";

  let cxm_cfm_layer=null;
  let cxm_ctm_layer=null;
  let cxm_crm_layer=null;
  let cxm_crm_polygon_layer=null;


this.showCFMFaults = function (viewermap) {
  if(cxm_cfm_layer == null) {
    cxm_cfm_layer=this.readLocalAndProcessActiveCFMGeo();
  }
  viewermap.addLayer(cxm_cfm_layer);
}

this.hideCFMFaults = function (viewermap) {
  if(cxm_cfm_layer == null) {
    cxm_cfm_layer=this.readLocalAndProcessActiveCFMGeo();
  }
  viewermap.removeLayer(cxm_cfm_layer);
}

// actually using CRM geo
this.showGFMRegions = function (viewermap) {
  if(cxm_crm_layer == null) {
    cxm_crm_layer=this.readLocalAndProcessActiveCRMGeo();
  }
  viewermap.addLayer(cxm_crm_layer);
}

this.hideGFMRegions = function (viewermap) {
  if(cxm_crm_layer == null) {
    cxm_crm_layer=this.readLocalAndProcessActiveCRMGeo();
  }
  viewermap.removeLayer(cxm_crm_layer);
}

/* color from blue to red */
this.makeRGB = function (val, maxV, minV) {
    let v= (val-minV) / (maxV-minV);
    let blue = Math.round(255 * v);
    let green = 0;
    let red = Math.round((1-v)*255);
    let color="RGB(" + red + "," + green + "," + blue + ")";
    return color;
}

/******************************************************************/

// should be a very small file and used for testing and so can ignore
// >>Synchronous XMLHttpRequest on the main thread is deprecated
// >>because of its detrimental effects to the end user's experience.
//     url=http://localhost/data/synapse/segments-dummy.csv
function _ckExist(url) {
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

// for trace that has metadataRow
function _trim_metadataRow(atrace) {
  var tmp = JSON.parse(JSON.stringify(atrace));
  var ttmp = tmp.features;
  var tttmp = ttmp[0].properties;
  var ttttmp = tttmp["metadataRow"];
  delete tttmp["metadataRow"];
  return tmp;
}

/* return true if target is in the active list */
function _in_list(target, glist) {
   var found=0;
   if(glist.length == 0)
     return found;

   glist.forEach(function(element) {
     if ( element == target )
        found=1;
   });
   return found;
}

function _downloadActiveGeo(dumpname, trace_list, label_list) {

  var tsz=trace_list.length;
  var tlist=[];
  var i;
  for(var i=0; i< tsz; i++) {
    var atrace=trace_list[i];
    var tracename=label_list[i];
    var fsz=atrace.features.length;
    for(var j=0;j<fsz;j++) {
      atrace.features[j].properties.name=tracename;
    }
    tlist.push(atrace);
  }

  var dump={ 'trace_list': tlist };
  var dumpstring=JSON.stringify(dump);
  var dumpblob = new Blob([dumpstring], { type: "text/plain;charset=utf-8" });
  saveAs(dumpblob,dumpname);
}

/******************************************************************/
// specifically for CFM_web 
// create CFM_geoJson.txt json file from cfm_trace_list.json
this.dumpActiveCFMGeo = function () {
  var tracelist = [];
  var labellist = [];

  var csz=cfm_active_gid_list.length; // this is a search list result
  var tsz=cfm_trace_list.length;
  for(var i=0; i< tsz; i++) {
    var titem=trace_list[i];
    var gid=titem['gid'];
    var tracename=find_cfm_name_by_gid(gid);
    var atrace=titem['trace'];
    // either all, or has a active list
    if(!csz || _in_list(gid,cfm_active_gid_list)) {
      labellist.push(tracename);
      var btrace=_trim_metadataRow(atrace);
      tracelist.push(btrace);
    }
  }
  if(tracelist.length) {
    _downloadActiveGeo(this.CFM_FNAME, tracelist, labellist);
  }
}

/******************************************************************/
// specifically for GFM_web 
function dumpActiveCRMGeo() {
  var tracelist = [];
  var labellist = [];

  var tsz=crm_trace_list.length;
  for(var i=0; i< tsz; i++) {
    var titem=crm_trace_list[i];
    var gid=titem['gid'];
    var tracename=find_crm_name_by_gid(gid);
    var atrace=titem['trace'];
    // either all, or has a active list
    labellist.push(tracename);
    tracelist.push(atrace);
  }

  if(tracelist.length) {
     _downloadActiveGeo(this.CRM_FNAME, tracelist, labellist);
  }
}


// from a local file
this.readLocalAndProcessActiveCFMGeo = function () {
  let url=CFM_URL;
  var blob=_ckExist(url);
  var jblob=JSON.parse(blob);

  var trace_list= jblob["trace_list"];
  var cnt=trace_list.length;
  var i;
  for(i=0;i<cnt;i++) { 
     var atrace=trace_list[i];

// change the color
     var tcnt=atrace.features.length;
     for(var j=0; j<tcnt; j++) {
       atrace.features[j].properties.style.color="black";
       atrace.features[j].properties.style.weight=1;
     }
// SPECIAL CASE
//   atrace.features[0].properties.style.color="red"; // the first one in all traces
     var name= atrace.features[0].properties.name;
//     window.console.log("adding trace.. ",name);
  }
  return makeGeoGroup(trace_list);
}


// from an user selected client side file
function readAndProcessActiveGeo(urls) {
  var reader = new FileReader();

  reader.onload=function(event) {
    var evt = event.target.result; 
    var jblob= JSON.parse(reader.result);
    var trace_list= jblob["trace_list"];
    var cnt=trace_list.length;
    var i;
    for(i=0;i<cnt;i++) { 
       var atrace=trace_list[i];

       // change the color
       var tcnt=atrace.features.length;
       for(var j=0; j<tcnt; j++) {
         atrace.features[j].properties.style.color="orange";
       }
       var name= atrace.features[0].properties.name;
//       window.console.log("adding trace.. ",name);
    }
    return makeGeoGroup(trace_list);
  };
  reader.readAsText(urls[0]);
}

function addGeoGroupToMap(traceList, mymap) {
   var group=makeGeoGroup(traceList);
   mymap.addLayer(group);
   return group;
}

function makeGeoGroup(traceList) {
   var cnt=traceList.length;
   window.console.log("number of importing traces ",cnt);
   var group = L.layerGroup();
   for(var i=0; i< cnt; i++) {
     var trace=traceList[i];
       var geoLayer=L.geoJSON(trace, {
         filter: function (feature, layer) {
           if (feature.properties) {
             var tmp=feature.properties.show_on_map != undefined ? !feature.properties.show_on_map : true;
             return tmp;
           }
           return false;
         },
         style: function(feature) {
           var tmp=feature.properties.style;
           if(feature.properties.style != undefined) {
             return feature.properties.style;
             } else {
               return {color: "#0000ff", "weight":2}
           }
         },
         onEachFeature: bindPopupEachFeatureName
     });
     group.addLayer(geoLayer);
   } 

   group.eachLayer(function(layer) {
     var popUp= layer._popup;
     if(popUp) {
       window.console.log("layergroup got a popup...", popUp);
     }
   });


   return group;
}


// binding the 'detail' fault content
function bindPopupEachFeatureName(feature, layer) {
    var popupContent="";
    layer.on({
        mouseover: function(e) {
          layer.setStyle({weight: 5});
          if (feature.properties != undefined) {
            popupContent = feature.properties.name;
          }
          layer.bindPopup(popupContent);
        },
        mouseout: function(e) {
          layer.setStyle({weight: 1});
        },
        click: function(e) {
          if (feature.properties != undefined) {
            popupContent = feature.properties.name;
          }
          layer.bindPopup(popupContent);
        },
    });
   
}

// from a local file
this.readLocalAndProcessActiveCRMGeo = function () {
  let url=CRM_URL;
  var blob=_ckExist(url);
  var jblob=JSON.parse(blob);

  var trace_list= jblob["trace_list"];
  var cnt=trace_list.length;
  var i;
  for(i=0;i<cnt;i++) { 
     var atrace=trace_list[i];
     var tcnt=atrace.features.length;
     for(var j=0; j<tcnt; j++) {
// make it lighter
       atrace.features[j].properties.style.weight=0.3;
     }
     var name= atrace.features[0].properties.name;
//     window.console.log("adding trace.. ",name);
  }
  return makeGeoGroup(trace_list);
}

function loadCRMRegions() {
  getCRMAllTraces();
}

// from a local file
this.readLocalAndProcessActiveCTMGeo = function() {
  let url=CTM_URL;
  var blob=_ckExist(url);
  var jblob=JSON.parse(blob);

  var trace_list= jblob["trace_list"];
  var cnt=trace_list.length;
  var i;
  for(i=0;i<cnt;i++) {
     var atrace=trace_list[i];
     var tcnt=atrace.features.length;
     for(var j=0; j<tcnt; j++) {
// make it lighter
       atrace.features[j].properties.style.weight=0.3;
     }
     var name= atrace.features[0].properties.name;
//     window.console.log("adding trace.. ",name);
  }
  return makeGeoGroup(trace_list);
}

function loadCTMRegions() {
  getCTMAllTraces();
}

/*** --> needs gfm_regions.js ***/
function getGFMRegionColorWithName(name) {
   var tb=GFM_tb['regions'];
   var cnt=tb.length;
   var i;
   for(i=0; i<cnt;i++) {
      var region=tb[i];
      if(region['name'] == name)
        return region['color'];
   }
   return undefined;
}

//domain,xcoord,ycoord
//Peninsular Range (E),-114.53244,29.43361
function readAndProcessActiveLatlon(urls) {
  var reader = new FileReader();

  reader.onload=function(event) {
    var evt = event.target.result; 
    var ffline = reader.result.split('\n');
    var cnt=ffline.length;
    var fdata=[];
    if(cnt == 0) {
      window.console.log("ERROR, can not process the upload file ");
      return;
    }
    var is_csv=0;
    if(ffline[0].includes(","))
      is_csv=1;

    // skip the first one
    for(i=1;i<cnt;i++) {
       var fline=ffline[i];

       if(is_csv) {
         $.csv.toArray(fline, {}, function(err, data) {
           var v=data;
           if( v != "" ) {
             fdata.push(v);
           }
         });
       } else {
// space separated format
           var v=fline.split(' ');
           if( v != "" ) {
             fdata.push(v);
           } 
       }   
    }  
    return makeRawLatlonGroup(fdata);

  };
  reader.readAsText(urls[0]);
}

function readLocalAndProcessActiveLatlon() {
  let url=CRM_POLYGON_URL;
  var blob=_ckExist(url);
  var ffline = blob.split('\n');
  var cnt=ffline.length;
  var fdata=[];
  if(cnt == 0) {
    window.console.log("ERROR, can not process the upload file ");
    return;
  }
  var is_csv=0;
  if(ffline[0].includes(","))
    is_csv=1;

  // skip the first one
  for(i=1;i<cnt;i++) {
     var fline=ffline[i];

     if(is_csv) {
       $.csv.toArray(fline, {}, function(err, data) {
         var v=data;
         if( v != "" ) {
           fdata.push(v);
         }
       });
     } else {
// space separated format
         var v=fline.split(' ');
         if( v != "" ) {
           fdata.push(v);
         } 
     }   
  }  
  return makeRawLatlonGroup(fdata);
}

function addRawLatlonGroupToMap(fdataList, mymap) {
   var group=makeRawLatlonGroup(fdataList);
   mymap.addLayer(group);
   return group;
}

function makeRawLatlonGroup(fdataList) {
   var cnt=fdataList.length;
   window.console.log("number of importing points ",cnt);
   var group = L.layerGroup();

   for(var i=0; i<cnt;i++) {
     var item=fdataList[i];

     var name=item[0];
     var lon=parseFloat(item[1]);
     var lat=parseFloat(item[2]);
    
     var color=getGFMRegionColorWithName(name);
     if(color == undefined) {
        window.console.log("BAD -- no color for ", name);
        continue;
     }

const myCustomColour = '#583470'
const markerHtmlStyles = `
  background-color: ${color};
  width: 0.2rem;
  height: 0.2rem;
  display: block;
  opacity: 80%;
  position: relative;
  border-radius: 50%;
  border: 1px solid ${color};
  transform: rotate(45deg)`

const newIcon = L.divIcon({
  className: '',
  html: `<span style="${markerHtmlStyles}" />`
})

     var small_point_options = { icon : newIcon};

     var bounds = [lat,lon ];
     var marker = L.marker(bounds, small_point_options);

     var icon = marker.options.icon;
     icon.options.iconSize = [5, 5];
     marker.setIcon(icon);

     group.addLayer(marker);

   } 
   return group;
}


}

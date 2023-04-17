/**
    cxm_model_util.c

  other models' import/export views, 

housekeeping utilities 

a) export 'active' fault's geo out into an external file 
b) import external geoJson.txt and create a groupLayer with optional name popup
c) import external latlon.csv with 'name' and create a group Layerof mulitple groups of points with different color 

might need cxm_misc_util.js

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
    cxm_cfm_layer=_readLocalAndProcessActiveCFMGeo();
  }
  viewermap.addLayer(cxm_cfm_layer);
}

this.hideCFMFaults = function (viewermap) {
  if(cxm_cfm_layer == null) {
    cxm_cfm_layer=_readLocalAndProcessActiveCFMGeo();
  }
  viewermap.removeLayer(cxm_cfm_layer);
}

// actually using CRM geo
this.showGFMRegions = function (viewermap) {
  if(cxm_crm_layer == null) {
    cxm_crm_layer=_readLocalAndProcessActiveCRMGeo();
  }
  viewermap.addLayer(cxm_crm_layer);
}

this.hideGFMRegions = function (viewermap) {
  if(cxm_crm_layer == null) {
    cxm_crm_layer=_readLocalAndProcessActiveCRMGeo();
  }
  viewermap.removeLayer(cxm_crm_layer);
}

/******************************************************************/
// for leaflet trace that has metadataRow
// CFM trace= { features: [ { "id":gid,
//                            "type":"Feature",
//                            "properties": {
//                               "metadataRow": getMetadataRowForDisplay(meta),
//                               "style": style
//                                          },
//                            "geometry": g
//                          }
//                        ]
//            }
function trim_metadataRow(atrace) {
  let tmp = JSON.parse(JSON.stringify(atrace));
  let tmp1 = tmp.features;
  let tmp2 = tmp1[0].properties;
  if( "metadataRow" in tmp2 ) {
      delete tmp2["metadataRow"];
  }
  return tmp;
}

// fill each features in a trace with a label
// download into file >> fname
// trace_list is a list trace structures
// label_list is a matching label for each trace structure
function downloadActiveGeo(fname, trace_list, label_list) {
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
  saveAs(dumpblob,fname);
}

// create a popupContent from the name of properties
// binding it to the layer
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

function makeGeoGroup(traceList) {
   var cnt=traceList.length;
   window.console.log("number of importing external traces ",cnt);
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

function addGeoGroupToMap(traceList, mymap) {
   var group=makeGeoGroup(traceList);
   mymap.addLayer(group);
   return group;
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
    if(!csz || inList(gid,cfm_active_gid_list)) {
      labellist.push(tracename);
      var btrace=_trim_metadataRow(atrace);
      tracelist.push(btrace);
    }
  }
  if(tracelist.length) {
    downloadActiveGeo(this.CFM_FNAME, tracelist, labellist);
  }
}

// from a local file
function _readLocalAndProcessActiveCFMGeo() {
  let url=CFM_URL;
  var blob=ckExist(url);
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
// used by CFM_web to upload user trace code
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

/******************************************************************/
// specifically for GFM_web 
// from a local file
// for CTM, CRM
this.dumpActiveCRMGeo = function() {
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
     downloadActiveGeo(this.CRM_FNAME, tracelist, labellist);
  }
}

//
function _readLocalAndProcessActiveCRMGeo() {
  let url=CRM_URL;
  var blob=ckExist(url);
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
function _readLocalAndProcessActiveCTMGeo() {
  let url=CTM_URL;
  var blob=ckExist(url);
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

function _readLocalAndProcessActiveLatlon() {
  let url=CRM_POLYGON_URL;
  var blob=ckExist(url);
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

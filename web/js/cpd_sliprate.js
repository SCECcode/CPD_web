/***
   cpd_sliprate.js
***/

var CPD_SLIPRATE = new function () {
    window.console.log("in CPD_SLIPRATE..");

    // complete set of sliprate layers, one marker layer for one site, 
    // setup once from viewer.php
    this.cpd_layers;
    this.cpd_markerLocations = [];

    // searched layers being actively looked at -- result of a search
    this.cpd_active_layers= new L.FeatureGroup();
    this.cpd_markerLocations = [];
    this.cpd_active_gid = [];

    // selected some layers from active layers
    // to be displayed at the metadata_table
    this.cpd_selected_gid = [];

    // locally used, floats
    var cpd_minrate_min=undefined;
    var cpd_minrate_max=undefined;
    var cpd_maxrate_min=undefined;
    var cpd_maxrate_max=undefined;

    var site_colors = {
        normal: '#006E90', // original
        selected: '#B02E0C',
        abnormal: '#00FFFF',
    };

    var site_marker_style = {
        normal: {
//          color: site_colors.normal,
            color: "white",
            fillColor: site_colors.normal,
            fillOpacity: 1,
            radius: 3,
            riseOnHover: true,
            weight: 1,
        },
        selected: {
//          color: site_colors.selected,
            color: "white",
            fillColor: site_colors.selected,
            fillOpacity: 1,
            radius: 3,
            riseOnHover: true,
            weight: 1,
        },
        hover: {
            fillOpacity: 1,
            radius: 10,
            weight: 2,
        },
    };

// coordinates: [34.28899, -118.399],
    this.defaultMapView = {
        coordinates: [37.73, -119.9],
        zoom: 10 
    };

    this.searchType = {
        none: 'none',
        faultname: 'faultname',
        sitename: 'sitename',
        latlon: 'latlon',
        minrate: 'minrate',
        maxrate: 'maxrate'
    };

    var sliprate_csv_keys= {
fault_name: 'Fault Name',
fault_id: 'NSHM23 Fault ID',
state: 'State',
site_name: 'Site Name',
cpd_id: 'CPD ID',
sliprate_id: 'NSHM23 Slip Rate ID',
longitude: 'Longitude',
latitud: 'Latitude',
dist_to_cfmfault: 'Distance To Nearest CFM Fault (km)',
cfm6_objectname: 'CFM6.0 Object Name',
data_type: 'Data Type',
observation: 'Observation',
pref_rate: 'Preferred Rate',
low_rate: 'Low Rate',
high_rate: 'High Rate',
rate_unct: 'Rate Uncertainty',
rate_type: 'Rate Type',
rept_reint: 'ReptReint',
offset_type: 'Offset Type',
age_type: 'Age Type',
num_events: 'Num Events',
rate_age: 'Rate Age',
q_bin_min: 'Qbin Min',
q_bin_max: 'Qbin Max',
reference: 'Reference'
        };

    this.searchingType=this.searchType.none;

    var tablePlaceholderRow = `<tr id="placeholder-row">
                        <td colspan="10">Metadata for selected sliprate sites will appear here.</td>
                    </tr>`;

    this.activateData = function() {
        activeProduct = Products.SLIPRATE;
        this.showOnMap();
        $("div.control-container").hide();
        $("#cpd-controls-container").show();

    };

/********** show layer/select functions *********************/

// cpd_sliprate_site_data is from viewer.php, which is the JSON 
// result from calling php getAllSiteData script
    this.generateLayers = function () {

window.console.log( "generate the initial cpd_layers");
        this.cpd_layers = [];
        this.cpd_markerLocations = [];
        this.cpd_active_markerLocations = [];

// SELECT * FROM tb ORDER BY gid ASC;
        for (const index in cpd_sliprate_site_data) {
          if (cpd_sliprate_site_data.hasOwnProperty(index)) {
                let gid = cpd_sliprate_site_data[index].gid;
                let cpd_id = cpd_sliprate_site_data[index].cpdid;
                let sliprate_id = cpd_sliprate_site_data[index].sliprateid;
                let longitude = parseFloat(cpd_sliprate_site_data[index].longitude);
                let latitude = parseFloat(cpd_sliprate_site_data[index].latitude);
                let fault_name = cpd_sliprate_site_data[index].faultname;
                let state = cpd_sliprate_site_data[index].state;
                let site_name = cpd_sliprate_site_data[index].sitename;
                let low_rate = parseFloat(cpd_sliprate_site_data[index].lowrate);
                let high_rate = parseFloat(cpd_sliprate_site_data[index].highrate);
                let reference = cpd_sliprate_site_data[index].reference;

                let marker = L.circleMarker([latitude, longitude], site_marker_style.normal);

                let site_info = `${fault_name}`;
                marker.bindTooltip(site_info).openTooltip();

                marker.scec_properties = {
                    idx: index,
                    active: true,
                    selected: false,
                    gid: gid,
                    cpd_id: cpd_id,
                    sliprate_id:sliprate_id,
                    longitude: longitude,
                    latitude: latitude,
                    fault_name: fault_name,
                    state: state,
                    site_name: site_name,
                    low_rate: low_rate,
                    high_rate: high_rate,
                    reference: reference
                };

// all layers
                this.cpd_layers.push(marker);
                this.cpd_markerLocations.push(marker.getLatLng())                      
// current active layers
                this.cpd_active_layers.addLayer(marker);
                this.cpd_active_gid.push(gid);
                this.cpd_active_markerLocations.push(marker.getLatLng())                      

                if(cpd_minrate_min == undefined) {
                   cpd_minrate_min = low_rate;
                   cpd_minrate_max = low_rate;
                  } else {
                    if(low_rate < cpd_minrate_min) {
                      cpd_minrate_min=low_rate;  
                    }
                    if(low_rate > cpd_minrate_max) {
                      cpd_minrate_max=low_rate;
                    }
                }
                if(cpd_maxrate_min == undefined) {
                   cpd_maxrate_min = high_rate;
                   cpd_maxrate_max = high_rate;
                  } else {
                    if(high_rate < cpd_maxrate_min) {
                      cpd_maxrate_min=high_rate;  
                    }
                    if(high_rate > cpd_maxrate_max) {
                      cpd_maxrate_max=high_rate;
                    }
                }
            }
        }

        this.cpd_active_layers.on('click', function(event) {
            if(activeProduct == Products.SLIPRATE) { 
               CPD_SLIPRATE.toggleSiteSelected(event.layer, true);
            }
        });

        this.cpd_active_layers.on('mouseover', function(event) {
            let layer = event.layer;
            layer.setRadius(site_marker_style.hover.radius);
        });

        this.cpd_active_layers.on('mouseout', function(event) {
            let layer = event.layer;
            layer.setRadius(site_marker_style.normal.radius);
        });

        // now update the scec_properties's color
        this.makeLayerColors(1);
    };

// recreate a new active_layers using a glist
// glist is a sorted ascending list
// this.cpd_layers should be also ascending
    this.createActiveLayerGroupWithGids = function(glist) {

        // remove the old ones and remove from result table
        this.clearAllSelections()
        this.cpd_active_layers.remove();
        this.cpd_active_layers= new L.FeatureGroup();
        this.cpd_active_gid=[];
        this.cpd_active_markerLocations = [];

        let gsz=glist.length;
        let lsz= this.cpd_layers.length;
        let i_start=0;

        for (let j=0; j<gsz; j++) {
          let gid=glist[j];
          for (let i=i_start; i< lsz; i++) {
            let layer = this.cpd_layers[i];
            if (layer.hasOwnProperty("scec_properties")) {
               if (gid == layer.scec_properties.gid) {
                  this.replaceColor(layer);
                  this.cpd_active_layers.addLayer(layer);
                  this.cpd_active_gid.push(gid);
                  this.cpd_active_markerLocations.push(layer.getLatLng())                      
                  i_start=i+1;
                  break;
               }
            }
          }
        }
        replaceResultTableBodyWithGids(glist);
        this.cpd_active_layers.addTo(viewermap);

        if(this.cpd_active_markerLocations.length > 0) {
          let bounds = L.latLngBounds(this.cpd_active_markerLocations);
window.console.log("flyingBounds --new list");
          viewermap.flyToBounds(bounds);
        }
    };

// recreate the original map state
// original state  toOriginal use normal color
    this.recreateActiveLayerGroup = function(toOriginal) {

        if(this.cpd_active_gid.length != this.cpd_layers.length 
               || this.searchingType == this.searchType.minrate
               || this.searchingType == this.searchType.maxrate) {
          this.cpd_active_layers= new L.FeatureGroup();
          this.cpd_active_gid=[];
        
          for (let i=0; i< this.cpd_layers.length; i++) {
            let marker = this.cpd_layers[i];
            if (marker.hasOwnProperty("scec_properties")) {
               let gid = marker.scec_properties.gid;
               if(!toOriginal) {
                 this.replaceColor(marker);
               }
               this.cpd_active_layers.addLayer(marker);
               this.cpd_active_gid.push(gid);
               this.cpd_active_markerLocations.push(marker.getLatLng())                      
            }
          }
          replaceResultTableBodyWithGids(this.cpd_active_gid);
          this.cpd_active_layers.addTo(viewermap);
          } else {
            this.cpd_active_layers.addTo(viewermap);
       }
window.console.log("flyingBounds --recreateActiveLayer");
       let bounds = L.latLngBounds(this.cpd_active_markerLocations);
       viewermap.flyToBounds(bounds);
    }

// search for a layer from master list by gid
    this.getLayerByGid = function(gid) {
        let foundLayer = false;
        for (let i=0; i< this.cpd_layers.length; i++) {
          let layer = this.cpd_layers[i];
          if (layer.hasOwnProperty("scec_properties")) {
             if (gid == layer.scec_properties.gid) {
                 return layer;     
             }
          }
       }
       return foundLayer;
    };


    function _resetRadius(layer) {
      layer.setRadius(site_marker_style.normal.radius);
    }

// select from currently active sites
    this.toggleSiteSelected = function(layer, clickFromMap=false) {

if(clickFromMap) {
window.console.log("toggleSiteSlected from map");             
} else {
window.console.log("toggleSiteSlected from tables");             
}
        if (typeof layer.scec_properties.selected === 'undefined') {
            layer.scec_properties.selected = true;
        } else {
            layer.scec_properties.selected = !layer.scec_properties.selected;
        }
        if (layer.scec_properties.selected) {
            this.selectSiteByLayer(layer, clickFromMap);
            if(!clickFromMap) {  
               layer.setRadius(site_marker_style.hover.radius);
               setTimeout(_resetRadius, 500, layer);
            }

        } else {
            this.unselectSiteByLayer(layer);
        }
        return layer.scec_properties.selected;
    };

    this.toggleSiteSelectedByGid = function(gid) {
        let layer = this.getLayerByGid(gid);
        return this.toggleSiteSelected(layer, false);
    };

    this.hoverSiteSelectedByGid = function(gid) {
        let layer = this.getLayerByGid(gid);
        layer.setRadius(site_marker_style.hover.radius);
        setTimeout(_resetRadius, 500, layer);

    };

    this.selectSiteByLayer = function (layer, moveTableRow=false) {
        layer.scec_properties.selected = true;
        layer.setStyle(site_marker_style.selected);
        let gid = layer.scec_properties.gid;

        this.upSelectedCount(gid);

        // metatable table
        let $row = $(`tr[sliprate-metadata-gid='${gid}'`);
        let rowHTML = "";
        if ($row.length == 0) {
           this.addToMetadataTable(layer);
        }
        // move row to top
        if (moveTableRow) {
            let $rowHTML = $row.prop('outerHTML');
            $row.remove();
            $("#metadata-table.sliprate tbody").prepend($rowHTML);
        }

        // search result table 
        let label="sliprate-result-gid_"+gid;
        let $elt=$(`#${label}`);
        if ($elt) {
            $elt.addClass('glyphicon-check').removeClass('glyphicon-unchecked');
        }
    };

    this.unselectSiteByLayer = function (layer) {
        layer.scec_properties.selected = false;
	this.replaceColor(layer);
        //layer.setStyle(site_marker_style.normal);

        let gid = layer.scec_properties.gid;

        this.downSelectedCount(gid);

        let $row = $(`tr[sliprate-metadata-gid='${gid}'`);
        if ($row.length != 0) {
           this.removeFromMetadataTable(gid);
        }

        let label="sliprate-result-gid_"+gid;
        let $elt=$(`#${label}`);
        if ($elt) {
            $elt.addClass('glyphicon-unchecked').removeClass('glyphicon-check');
        }
    };

    this.unselectSiteByGid = function (gid) {
        let layer = this.getLayerByGid(gid);
        return this.unselectSiteByLayer(layer);
    };

// selectAll button - toggle
    this.toggleSelectAll = function() {
        var sliprate_object = this;

        let $selectAllButton = $("#cpd-allBtn span");
        if (!$selectAllButton.hasClass('glyphicon-check')) {
            this.cpd_active_layers.eachLayer(function(layer){
                sliprate_object.selectSiteByLayer(layer);
            });
            $selectAllButton.addClass('glyphicon-check').removeClass('glyphicon-unchecked');
        } else {
            this.clearSelectAll();
        }
    };

// selectAll button  - clear
    this.clearSelectAll = function() {
        this.clearAllSelections();
        let $selectAllButton = $("#cpd-allBtn span");
        $selectAllButton.removeClass('glyphicon-check').addClass('glyphicon-unchecked');
    };

// unselect every active layer
    this.clearAllSelections = function() {
        var sliprate_object = this;
        this.cpd_active_layers.eachLayer(function(layer){
            sliprate_object.unselectSiteByLayer(layer);
        });
        let $selectAllButton = $("#cpd-allBtn span");
        $selectAllButton.removeClass('glyphicon-check').addClass('glyphicon-unchecked');
    };

    this.upSelectedCount = function(gid) {
       let i=this.cpd_selected_gid.indexOf(gid); 
       if(i != -1) {
         window.console.log("this is bad.. already in selected list "+gid);
         return;
       }
       window.console.log("=====adding to list "+gid);
       this.cpd_selected_gid.push(gid);
       updateDownloadCounter(this.cpd_selected_gid.length);
    };

    this.downSelectedCount = function(gid) {
       if(this.cpd_selected_gid.length == 0) { // just ignore..
         return;
       }
       let i=this.cpd_selected_gid.indexOf(gid); 
       if(i == -1) {
         window.console.log("this is bad.. not in selected list "+gid);
         return;
       }
       window.console.log("=====remove from list "+gid);
       this.cpd_selected_gid.splice(i,1);
       updateDownloadCounter(this.cpd_selected_gid.length);
    };

    this.zeroSelectedCount = function() {
       this.cpd_selected_gid = [];
       updateDownloadCounter(0);
    };


/********** search/layer  functions *********************/
    this.showSearch = function (type) {
        const $all_search_controls = $("#cpd-sliprate-search-control ul li");
        $all_search_controls.hide();
        switch (type) {
            case this.searchType.faultname:
                $("#cpd-fault-name").show();
                break;
            case this.searchType.sitename:
                $("#cpd-site-name").show();
                break;
            case this.searchType.latlon:
                $("#cpd-latlon").show();
                drawRectangle();
                break;
            case this.searchType.minrate:
                $("#cpd-minrate-slider").show();
                showKey(cpd_minrate_min, cpd_minrate_max, "Min Slip Rate");
                break;
            case this.searchType.maxrate:
                $("#cpd-maxrate-slider").show();
                showKey(cpd_maxrate_min, cpd_maxrate_max, "Max Slip Rate");
                break;
            default:
                // no action
        }
    };

    this.showOnMap = function () {
        this.cpd_active_layers.addTo(viewermap);
    };

    this.hideOnMap = function () {
        this.cpd_active_layers.remove();
    };

// reset from the reset button
// reset option button, the map to original state
// but leave the external model state the same
    this.reset = function () {

window.console.log("calling reset");
        this.resetSearch();

        if ($("#cpd-model-cfm").prop('checked')) {
          CXM.showCFMFaults(viewermap);
          } else {
          CXM.hideCFMFaults(viewermap);
        }

        if ($("#cpd-model-gfm").prop('checked')) {
          CXM.showGFMRegions(viewermap);
          } else {
          CXM.hideGFMRegions(viewermap);
        }

        $("#cpd-search-type").val("");
        this.searchingType = this.searchType.none;
    };

// reset just the search only
    this.resetSearch = function (){

window.console.log("sliprate calling --->> resetSearch.");

        this.clearAllSelections();

        this.resetMinrate();
        this.resetMaxrate();
        this.resetLatLon();
        this.resetFaultname();
        this.resetSitename();

        this.hideOnMap();
        this.recreateActiveLayerGroup(true);

    };

// a complete fresh search
    this.freshSearch = function (t){

        this.resetSearch();

        const $all_search_controls = $("#cpd-controls-container ul li")
window.console.log("sliprate --- calling freshSearch..");
        switch (t) {
            case "faultname": 
               this.searchingType = this.searchType.faultname;
               $all_search_controls.hide();
               $("#cpd-fault-name").show();
               break;
            case "sitename": 
               this.searchingType = this.searchType.sitename;
               $all_search_controls.hide();
               $("#cpd-site-name").show();
               break;
            case "minrate": 
               this.searchingType = this.searchType.minrate;
               $all_search_controls.hide();
               $("#cpd-minrate-slider").show();
               showKey(cpd_minrate_min, cpd_minrate_max, "Min Slip Rate");
               this.recreateActiveLayerGroup(false);
               break;
            case "maxrate": 
               this.searchingType = this.searchType.maxrate;
               $all_search_controls.hide();
               $("#cpd-maxrate-slider").show();
               showKey(cpd_maxrate_min, cpd_maxrate_max, "Max Slip Rate");
               this.recreateActiveLayerGroup(false);
               break;
            case "latlon": 
               this.searchingType = this.searchType.latlon;
               $all_search_controls.hide();
               $("#cpd-latlon").show();
               drawRectangle();
               break;
            default:
               this.searchingType = this.searchType.none;
               break;
        }

        if ($("#cpd-model-cfm").prop('checked')) {
          CXM.showCFMFaults(viewermap);
          } else {
          CXM.hideCFMFaults(viewermap);
        }

        if ($("#cpd-model-gfm").prop('checked')) {
          CXM.showGFMRegions(viewermap);
          } else {
          CXM.hideGFMRegions(viewermap);
        }
    };

    this.getMarkerBySiteId = function (site_id) {
        for (const index in cpd_sliprate_site_data) {
            if (cpd_sliprate_site_data[index].cpd_id == site_id) {
                return cpd_sliprate_site_data[index];
            }
        }

        return [];
    };

    this.search = function(type, criteria) {

        if(type != this.searchingType)
          return;

        $searchResult = $("#searchResult");
        if (!type || !criteria) {
            $searchResult.html("");
        }
        if (!Array.isArray(criteria)) {
            criteria = [criteria];
        }

        let JSON_criteria = JSON.stringify(criteria);

// not used:        $("#wait-spinner").show();

        $.ajax({
            url: "php/search.php",
            data: {t: type, q: JSON_criteria},
        }).done(function(sliprate_result) {
            let glist=[];
            if(sliprate_result === "[]") {
window.console.log("Did not find any PHP result");
            } else {
                let tmp=JSON.parse(sliprate_result); 
                if(type == CPD_SLIPRATE.searchType.faultname
                     ||  type == CPD_SLIPRATE.searchType.sitename
                     ||  type == CPD_SLIPRATE.searchType.minrate
                     ||  type == CPD_SLIPRATE.searchType.maxrate
                     ||  type == CPD_SLIPRATE.searchType.latlon) {
//expected [{'gid':'2'},{'gid':'10'}]
                    let sz=tmp.length;
                    for(let i=0; i<sz; i++) {
                        let gid= parseInt(tmp[i]['gid']); 
                        glist.push(gid);
                    }
                    } else {
window.console.log( "BAD, unknown search type \n");
                }
            }
            CPD_SLIPRATE.createActiveLayerGroupWithGids(glist);
        });
    };

    // special case, Latlon can be from text inputs or from the map
    // fromWhere=0 is from text
    // fromWhere=1 from drawRectangle call
    this.searchLatlon = function (fromWhere, rect) {
        let criteria = [];
        if( fromWhere == 0) {
            let lat1=$("#cpd-firstLatTxt").val();
            let lon1=$("#cpd-firstLonTxt").val();
            let lat2=$("#cpd-secondLatTxt").val();
            let lon2=$("#cpd-secondLonTxt").val();
            if(lat1=='' || lon1=='' || lat2=='' || lon2=='') return;
            remove_bounding_rectangle_layer();
            add_bounding_rectangle(lat1,lon1,lat2,lon2);
            criteria.push(lat1);
            criteria.push(lon1);
            criteria.push(lat2);
            criteria.push(lon2);
            } else {
                var loclist=rect[0];
                var sw=loclist[0];
                var ne=loclist[2];
                criteria.push(sw['lat']);
                criteria.push(sw['lng']);
                criteria.push(ne['lat']);
                criteria.push(ne['lng']);

                $("#cpd-firstLatTxt").val(criteria[0]);
                $("#cpd-firstLonTxt").val(criteria[1]);
                $("#cpd-secondLatTxt").val(criteria[2]);
                $("#cpd-secondLonTxt").val(criteria[3]);
        }
                 
        this.search(CPD_SLIPRATE.searchType.latlon, criteria);

        let markerLocations = [];
        markerLocations.push(L.latLng(criteria[0],criteria[1]));
        markerLocations.push(L.latLng(criteria[2],criteria[3]));
        let bounds = L.latLngBounds(markerLocations);
window.console.log("flyingBounds --latlon");
        viewermap.flyToBounds(bounds);
//        setTimeout(skipRectangle, 500);
    };

/********** metadata  functions *********************/
/* create a metadata list using selected gid list
FaultName,FaultID,State,SiteName,CPDId,SliprateId,Longitude,Latitude,DistToCFMFault,CFM6ObjectName,DataType,Observation,PrefRate,LowRate,HighRate,RateUnct,RateType,ReptReint,OffsetType,AgeType,NumEvents,RateAge,QbinMin,QbinMax,Reference

gid
faultname
faultid
state
sitename
cpdid
sliprateid
longitude
latitud
disttocfmfault
cfm6objectname
datatype
observation
prefrate
lowrate
highrate
rateunct
ratetype
reptreint
offsettype
agetype
numevents
rateage
qbinmin
qbinmax
reference
*/
    function createMetaData(properties) {
        var meta={};
        meta.fault_name = properties.faultname;
        meta.fault_id = properties.faultid;
        meta.state = properties.state;
        meta.site_name = properties.sitename;
        meta.cpd_id= properties.cpdid;
        meta.sliprate_id= properties.sliprateid;
        meta.longitude = properties.longitude;
        meta.latitude = properties.latitude;
        meta.dist_to_cfmfault = properties.disttocfmfault;
        meta.cfm6_objectname = properties.cfm6objectname;
        meta.data_type = properties.datatype;
        meta.observation = properties.observation;
        meta.pref_rate = properties.prefrate;
        meta.low_rate = properties.lowrate;
        meta.high_rate = properties.highrate;
        meta.rate_unct = properties.rateunct;
        meta.rate_type = properties.ratetype;
        meta.rept_reint = properties.reptreint;
        meta.offset_type = properties.offsettype;
        meta.age_type = properties.agetype;
        meta.num_events = properties.numevents;
        meta.rate_age = properties.rateage;
        meta.q_bin_min = properties.qbinmin;
        meta.q_bin_max = properties.qbinmax;
        meta.reference = properties.reference;

        return meta;
    }

    this.addToMetadataTable = function(layer) {
        let $table = $("#metadata-table.sliprate tbody");
        let gid = layer.scec_properties.gid;
        if ($(`tr[sliprate-metadata-gid='${gid}'`).length > 0) {
            return;
        }
        let html = generateMetadataTableRow(layer);
        $table.prepend(html);
    };

    this.removeFromMetadataTable = function (gid) {
        $(`#metadata-table tbody tr[sliprate-metadata-gid='${gid}']`).remove();
    };

    var generateMetadataTableRow = function(layer) {
        let $table = $("#metadata-table");
        let html = "";

        html += `<tr sliprate-metadata-gid="${layer.scec_properties.gid}">`;

        html += `<td><button class=\"btn btn-sm cxm-small-btn\" id=\"button_meta_${layer.scec_properties.gid}\" title=\"remove the site\" onclick=CPD_SLIPRATE.unselectSiteByGid("${layer.scec_properties.gid}");><span id=\"sliprate_metadata_${layer.scec_properties.gid}\" class=\"glyphicon glyphicon-trash\"></span></button></td>`;
        html += `<td class="meta-data">${layer.scec_properties.cpd_id}</td>`;
        html += `<td class="meta-data">${layer.scec_properties.fault_name} </td>`;
        html += `<td class="meta-data">${layer.scec_properties.site_name}</td>`;
        html += `<td class="meta-data">${layer.scec_properties.latitude} </td>`;
        html += `<td class="meta-data">${layer.scec_properties.longitude} </td>`;

        html += `<td class="meta-data" align='center' >${layer.scec_properties.low_rate} </td>`;
        html += `<td class="meta-data" align='center' >${layer.scec_properties.high_rate}</td>`;
        html += `<td class="meta-data">${layer.scec_properties.reference}</td>`;

        html += `<td class="meta-data">......</td>`;
        html += `</tr>`;
        return html;
    };

    var generateMetadataTable = function (results) {
window.console.log("generateMetadataTable..");
            var html = "";
            html+=`
<thead>
<tr>
        <th class="text-center button-container" style="width:2rem">
        </th>
        <th class="hoverColor" style="width:4rem" >Id&nbsp<span></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(2,'a')">Fault Name&nbsp<span id='sortCol_2' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(3,'a')">Site Name&nbsp<span id='sortCol_3' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(4,'n')" style="width:9rem">Longitude&nbsp<span id='sortCol_4' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(5,'n')" style="width:9rem">Latitude&nbsp<span id='sortCol_5' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(6,'n')" style="width:4rem">Low<br>Rate&nbsp<span id='sortCol_6' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(7,'n')" style="width:4rem">High<br>Rate&nbsp<span id='sortCol_7' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(8,'a')" style="width:9rem">Reference&nbsp<span id='sortCol_8' class="fas fa-angle-down"></span></th>
        <th style="width:12%;"><div class="text-center">
<!--download all -->
                <div class="btn-group download-now">
                    <button id="download-all" type="button" class="btn btn-dark" value="metadata"
		            style="padding:0 0.5rem 0 0.5rem;" 
                            onclick="CPD_SLIPRATE.downloadURLsAsZip(this.value);" disabled>
                            DOWNLOAD&nbsp<span id="download-counter"></span>
                    </button>
<!--
                    <button id="download-all" type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false" disabled>
                            DOWNLOAD&nbsp<span id="download-counter"></span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
                       <button class="dropdown-item" type="button" value="metadata"
                            onclick="CPD_SLIPRATE.downloadURLsAsZip(this.value);">metadata
                       </button>
                    </div>
-->
                </div>
        </th>
</tr>
</thead>
<tbody>`;

            for (let i = 0; i < results.length; i++) {
                html += generateMetadataTableRow(results[i]);
            }
            if (results.length == 0) {
                html += tablePlaceholderRow;
            }
            html=html+"</tbody>";
            return html;
        };

       var changeMetadataTableBody = function (results) {

            var html = "";
            for (let i = 0; i < results.length; i++) {
                html += generateMetadataTableRow(results[i]);
            }
            if (results.length == 0) {
                html += tablePlaceholderRow;
            }
            return html;
        };

   
        this.replaceMetadataTableBody = function(results) {
            $("#metadata-table tbody").html(changeMetadataTableBody(results));
        };

        this.replaceMetadataTable = function(results) {
            $("#metadata-table").html(generateMetadataTable(results));
        };

/********************* reset functions **************************/
        this.toDraw = function () {
          if( this.searchingType == this.searchType.latlon) { 
            return true;
          }
          return false;
        }

        this.resetLatLon = function () {
          if( this.searchingType != this.searchType.latlon) return;
          $("#cpd-firstLatTxt").val("");
          $("#cpd-firstLonTxt").val("");
          $("#cpd-secondLatTxt").val("");
          $("#cpd-scecondLonTxt").val("");
          skipRectangle();
          remove_bounding_rectangle_layer();
          $("#cpd-latlon").hide();
        }

        this.resetFaultname = function () {
          if( this.searchingType != this.searchType.faultname) return;
          $("#cpd-faultnameTxt").val("");
          $("#cpd-fault-name").hide();
        }
        this.resetSitename = function () {
          if( this.searchingType != this.searchType.sitename) return;
          $("#cpd-sitenameTxt").val("");
          $("#cpd-site-name").hide();
        }

        this.resetMinrate = function () {
          if( this.searchingType != this.searchType.minrate) return;
          this.resetMinrateSlider();
          resetMinrateRangeColor(cpd_minrate_min, cpd_minrate_max);
          removeKey(); 
	  $("#cpd-minrate-slider").hide();
        }

        this.resetMaxrate = function () {
          if( this.searchingType != this.searchType.maxrate) return;
          this.resetMaxrateSlider();
          resetMaxrateRangeColor(cpd_maxrate_min, cpd_maxrate_max);
          removeKey();
	  $("#cpd-maxrate-slider").hide();
        }

        var resetMinrateRangeColor = function (target_min, target_max){
          let minRGB= makeRGB(target_min, cpd_minrate_max, cpd_minrate_min );
          let maxRGB= makeRGB(target_max, cpd_minrate_max, cpd_minrate_min );
          let myColor="linear-gradient(to right, "+minRGB+","+maxRGB+")";
          $("#slider-minrate-range .ui-slider-range" ).css( "background", myColor );
        }

        this.resetMinrateSlider = function () {
          if( this.searchingType != this.searchType.minrate) return;
          $("#slider-minrate-range").slider('values', 
                              [cpd_minrate_min, cpd_minrate_max]);
          $("#cpd-minMinrateSliderTxt").val(cpd_minrate_min);
          $("#cpd-maxMinrateSliderTxt").val(cpd_minrate_max);
        }

        var resetMaxrateRangeColor = function (target_min, target_max){
          let minRGB= makeRGB(target_min, cpd_maxrate_max, cpd_maxrate_min );
          let maxRGB= makeRGB(target_max, cpd_maxrate_max, cpd_maxrate_min );
          let myColor="linear-gradient(to right, "+minRGB+","+maxRGB+")";
          $("#slider-maxrate-range .ui-slider-range" ).css( "background", myColor );
        }

        this.resetMaxrateSlider = function () {
          if( this.searchingType != this.searchType.maxrate) return;
          $("#slider-maxrate-range").slider('values', 
                              [cpd_maxrate_min, cpd_maxrate_max]);
          $("#cpd-minMaxrateSliderTxt").val(cpd_maxrate_min);
          $("#cpd-maxMaxrateSliderTxt").val(cpd_maxrate_max);
        }

        this.refreshMaxrateSlider = function () {
          if( this.searchingType != this.searchType.maxrate) return;
          let maxrate_min=$("#cpd-minMaxrateSliderTxt").val();
          let maxrate_max=$("#cpd-maxMaxrateSliderTxt").val();
          $("#slider-maxrate-range").slider('values', 
                              [maxrate_min, maxrate_max]);
        }

        this.refreshMinrateSlider = function () {
          if( this.searchingType != this.searchType.minrate) return;
          let minrate_min=$("#cpd-minMinrateSliderTxt").val();
          let minrate_max=$("#cpd-maxMinrateSliderTxt").val();
          $("#slider-minrate-range").slider('values', 
                              [minrate_min, minrate_max]);
        }

/********************* marker color function **************************/
// marker.scec_properties.high_rate_color, marker.sce_properties.low_rate_color
// toMake == 1, set the scec_properties color values
        this.makeLayerColors = function() {
            let lsz = this.cpd_layers.length;
            for(let i=0; i<lsz; i++) {
                let layer=this.cpd_layers[i];
                let hr = layer.scec_properties.high_rate;
                let lr = layer.scec_properties.low_rate;
                layer.scec_properties.low_rate_color = makeRGB(lr, cpd_minrate_max, cpd_minrate_min );
                layer.scec_properties.high_rate_color = makeRGB(hr, cpd_maxrate_max, cpd_maxrate_min );
            }
        }

        this.replaceColor = function(layer) {
            let myColor = site_colors.normal;

            let hr = layer.scec_properties.high_rate;
            let lr = layer.scec_properties.low_rate;
            if( this.searchingType == this.searchType.minrate) {
                myColor = layer.scec_properties.low_rate_color;
            }
            if( this.searchingType == this.searchType.maxrate) {
                myColor = layer.scec_properties.high_rate_color;
            }
            if(layer.scec_properties.selected) {
                myColor = site_colors.selected;
            }
            layer.setStyle({fillColor:myColor, color:"white"});
          //  layer.setStyle({fillColor:myColor, color:myColor});
       }

       this.resetActiveLayerColor = function () {
            this.cpd_active_layers.remove();

window.console.log(" ==> here in replace color");
            let layers=this.cpd_active_layers;

            layers.eachLayer(function(layer) {
              layer.resetStyle();
            });

            this.cpd_active_layers.addTo(viewermap);
       }


/********************* sliprate INTERFACE function **************************/
        this.setupCPDInterface = function() {

            var $result_table = $('#result-table');
            $result_table.floatThead('destroy');
            $("#result-table").html(makeResultTable(cpd_sliprate_site_data));
            $result_table.floatThead({
                 scrollContainer: function ($table) {
                     return $table.closest('div#result-table-container');
                 },
            });

            let elt=document.getElementById("dataset_sliprate");
            elt.click();

            $("#cpd-controlers-container").css('display','');
            $("#cpd-sliprate-controlers-container").css('display','none');

            $("div.mapData div.map-container").css('padding-left','30px');

            var $download_queue_table = $('#metadata-table');
            $download_queue_table.floatThead('destroy');
            this.replaceMetadataTable([]);
            $download_queue_table.addClass('sliprate');
            $download_queue_table.floatThead({
                 scrollContainer: function ($table) {
                     return $table.closest('div#metadata-table-container');
                 },
            });

            this.activateData();

            viewermap.invalidateSize();
            let bounds = L.latLngBounds(this.cpd_markerLocations);
            viewermap.fitBounds(bounds);

/* setup  sliders */
            $("#slider-minrate-range").slider({ 
                  range:true, step:0.01, min:cpd_minrate_min, max:cpd_minrate_max, values:[cpd_minrate_min, cpd_minrate_max],
              slide: function( event, ui ) {
                           $("#cpd-minMinrateSliderTxt").val(ui.values[0]);
                           $("#cpd-maxMinrateSliderTxt").val(ui.values[1]);
                           resetMinrateRangeColor(ui.values[0],ui.values[1]);
                     },
              change: function( event, ui ) {
                           $("#cpd-minMinrateSliderTxt").val(ui.values[0]);
                           $("#cpd-maxMinrateSliderTxt").val(ui.values[1]);
                           resetMinrateRangeColor(ui.values[0],ui.values[1]);
                     },
              stop: function( event, ui ) {
                           let searchType = CPD_SLIPRATE.searchType.minrate;
                           CPD_SLIPRATE.search(searchType, ui.values);
                     },
              create: function() {
                          $("#cpd-minMinrateSliderTxt").val(cpd_minrate_min);
                          $("#cpd-maxMinrateSliderTxt").val(cpd_minrate_max);
                    }
            });
            $('#slider-minrate-range').slider("option", "min", cpd_minrate_min);
            $('#slider-minrate-range').slider("option", "max", cpd_minrate_max);

/* setup  sliders */
            $("#slider-maxrate-range").slider({ 
                  range:true, step:0.01, min:cpd_maxrate_min, max:cpd_maxrate_max, values:[cpd_maxrate_min, cpd_maxrate_max],
              slide: function( event, ui ) {
                           $("#cpd-minMaxrateSliderTxt").val(ui.values[0]);
                           $("#cpd-maxMaxrateSliderTxt").val(ui.values[1]);
                           resetMaxrateRangeColor(ui.values[0],ui.values[1]);
                     },
              change: function( event, ui ) {
                           $("#cpd-minMaxrateSliderTxt").val(ui.values[0]);
                           $("#cpd-maxMaxrateSliderTxt").val(ui.values[1]);
                           resetMaxrateRangeColor(ui.values[0],ui.values[1]);
                     },
              stop: function( event, ui ) {
                           let searchType = CPD_SLIPRATE.searchType.maxrate;
                           CPD_SLIPRATE.search(searchType, ui.values);
                     },
              create: function() {
                          $("#cpd-minMaxrateSliderTxt").val(cpd_maxrate_min);
                          $("#cpd-maxMaxrateSliderTxt").val(cpd_maxrate_max);
                    }
            });
            $('#slider-maxrate-range').slider("option", "min", cpd_maxrate_min);
            $('#slider-maxrate-range').slider("option", "max", cpd_maxrate_max);
    };

/******************  Result table functions **************************/
    function makeResultTableBody(json) {

        var html="<tbody id=\"result-table-body\">";
        var sz=json.length;

        var tmp="";
        for( var i=0; i< sz; i++) {
           var s=json[i];
           var gid=parseInt(s.gid);
           var name=s.faultname + " | " +s.sitename;
           var t="<tr id=\"row_"+gid+"\"><td style=\"width:25px\"><button class=\"btn btn-sm cxm-small-btn\" id=\"button_"+gid+"\" title=\"highlight the fault\" onclick=CPD_SLIPRATE.toggleSiteSelectedByGid("+gid+") onhoover=CPD.hooverSiteSlectedByGid("+gid+")><span id=\"sliprate-result-gid_"+gid+"\" class=\"glyphicon glyphicon-unchecked\"></span></button></td><td><label for=\"button_"+gid+"\">" + name + "</label></td></tr>";
           tmp=tmp+t;
        }
        html=html+ tmp + "</tbody>";

        return html;
    }

    function replaceResultTableBodyWithGids(glist) {

        var html="";
        var sz=glist.length;

        for( var i=0; i< sz; i++) {
           let gid=glist[i];
           let layer=CPD_SLIPRATE.getLayerByGid(gid);
           let s=layer.scec_properties;
           let name= s.fault_name + " | " +s.site_name;

           var t="<tr id=\"row_"+gid+"\"><td style=\"width:25px\"><button class=\"btn btn-sm cxm-small-btn\" id=\"button_"+gid+"\" title=\"highlight the fault\" onclick=CPD_SLIPRATE.toggleSiteSelectedByGid("+gid+")><span id=\"sliprate-result-gid_"+gid+"\" class=\"glyphicon glyphicon-unchecked\"></span></button></td><td><label for=\"button_"+gid+"\">" + name + "</label></td></tr>";
           html=html+t;
        }

        document.getElementById("result-table-body").innerHTML = html;
    }


    function makeResultTable(json) {
        var html="";
        html+=`
<thead>
<tr>
   <th class='text-center'><button id=\"cpd-allBtn\" class=\"btn btn-sm cxm-small-btn\" title=\"select all visible sliprate sites\" onclick=\"CPD_SLIPRATE.toggleSelectAll();\"><span class=\"glyphicon glyphicon-unchecked\"></span></button></th>
<th class='myheader'>CPD Site Location ( fault | site )</th>
</tr>
</thead>`;
        var body=makeResultTableBody(json);
        html=html+ "<tbody>" + body + "</tbody>";

        return html;
    }

/********************** zip utilities functions *************************/
    this.downloadURLsAsZip = function(ftype) {
        var nzip=new JSZip();
        var layers=CPD_SLIPRATE.cpd_active_layers.getLayers();
        let timestamp=$.now();
        let mlist=[];
      
        var cnt=layers.length;
        for(var i=0; i<cnt; i++) {
          let layer=layers[i];

          if( !layer.scec_properties.selected ) {
            continue;
          }

          if(ftype == "metadata" || ftype == "all") {
          // create metadata from layer.scec_properties
            let m=createMetaData(cpd_sliprate_site_data[layer.scec_properties.idx]);
            mlist.push(m);
          }
      
/***** this is for downloading some generated file from the result directory..
          if(ftype == "extra") {
            let downloadURL = getDataDownloadURL(layer.scec_properties.cpd_id);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            let promise = $.get(downloadURL);
            nzip.file(dname,promise);
          }
***/
        }

/**
        var zipfname="CPD_SLIPRATE_"+timestamp+".zip"; 
        nzip.generateAsync({type:"blob"}).then(function (content) {
          // see FileSaver.js
          saveAs(content, zipfname);
        })
***/

        if(mlist.length != 0) {
//        saveAsJSONBlobFile(mlist, timestamp)
          var data=getCSVFromMeta(mlist);
          saveAsCSVBlobFile(data, timestamp);
        }
    };


    function getCSVFromMeta(mlist) {
        var len=mlist.length;  // each data is a meta data format
        var last=len-1;

    // grab the first meta data and generate the title..
        var meta=mlist[0];
        var keys=Object.keys(meta);
        var jlen=keys.length;
        
//        var csvblob = keys.join(",");
        var csvblob=sliprate_csv_keys[keys[0]];
        for(let k=1; k< jlen; k++) {
           csvblob += (','+sliprate_csv_keys[keys[k]]);
        }
        csvblob +='\n';

        for(let i=0; i< len; i++) {
            let j=0;
            meta=mlist[i];
            var values=Object.values(meta)
            var vblob=JSON.stringify(values[0]);
            for(j=1; j< jlen; j++) {
                var vv=values[j];
                if(vv != null) {
                  if(isNaN(vv)) {
                    vblob=vblob+","+ JSON.stringify(vv);
                    } else {
                      vblob=vblob+","+vv;
                  }
                  } else {
                    vblob=vblob+",";
                }
            }
            csvblob += vblob;
            if(i != last) {
            csvblob +='\n';
            }
        }
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        return csvblob;
    }
	      
};

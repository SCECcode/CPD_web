/***
   cpd_sliprate.js
***/

var CPD_SLIPRATE = new function () {
    window.console.log("in CPD_SLIPRATE..");

    // complete set of sliprate layers, one marker layer for one site, 
    // setup once from viewer.php
    this.cpd_layers;

    // searched layers being actively looked at -- result of a search
    this.cpd_active_layers= new L.FeatureGroup();
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
        normal: '#006E90',
        selected: '#B02E0C',
        abnormal: '#00FFFF',
    };

    var site_marker_style = {
        normal: {
            color: site_colors.normal,
            fillColor: site_colors.normal,
            fillOpacity: 0.5,
            radius: 3,
            riseOnHover: true,
            weight: 1,
        },
        selected: {
            color: site_colors.selected,
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

    this.defaultMapView = {
        // coordinates: [34.3, -118.4],
        coordinates: [34.16, -118.57],
        zoom: 7
    };

    this.searchType = {
        none: 'none',
        faultname: 'faultname',
        sitename: 'sitename',
        latlon: 'latlon',
        minrate: 'minrate',
        maxrate: 'maxrate'
    };
    this.searchingType=this.searchType.none;

    var tablePlaceholderRow = `<tr id="placeholder-row">
                        <td colspan="9">Metadata for selected sliprate sites will appear here.</td>
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
        this.cpd_layers = [];

// SELECT * FROM tb ORDER BY gid ASC;
        for (const index in cpd_sliprate_site_data) {
          if (cpd_sliprate_site_data.hasOwnProperty(index)) {
                let gid = cpd_sliprate_site_data[index].gid;
                let sliprate_id = cpd_sliprate_site_data[index].sliprateid;
                let x = parseFloat(cpd_sliprate_site_data[index].x);
                let y = parseFloat(cpd_sliprate_site_data[index].y);
                let fault_name = cpd_sliprate_site_data[index].faultname;
                let site_name = cpd_sliprate_site_data[index].sitename;
                let low_rate = parseFloat(cpd_sliprate_site_data[index].lowrate);
                let high_rate = parseFloat(cpd_sliprate_site_data[index].highrate);
                let state = cpd_sliprate_site_data[index].state;
                let data_type = cpd_sliprate_site_data[index].datatype;
                let q_bin_min = parseFloat(cpd_sliprate_site_data[index].qbinmin);
                let q_bin_max = parseFloat(cpd_sliprate_site_data[index].qbinmax);
                let x_2014_dip = parseFloat(cpd_sliprate_site_data[index].x2014dip);
                let x_2014_rake = parseFloat(cpd_sliprate_site_data[index].x2014rake);
                let x_2014_rate = parseFloat(cpd_sliprate_site_data[index].x2014rate);
                let reference = cpd_sliprate_site_data[index].reference;

                let marker = L.circleMarker([y, x], site_marker_style.normal);

                let site_info = `${sliprate_id}`;
                marker.bindTooltip(site_info).openTooltip();

                marker.scec_properties = {
                    idx: index,
                    gid: gid,
                    active: true,
                    selected: false,
                    sliprate_id: sliprate_id,
                    x: x,
                    y: y,
                    fault_name: fault_name,
                    site_name: site_name,
                    low_rate: low_rate,
                    high_rate: high_rate,
                    data_type: data_type,
                    reference: reference
                };

                this.cpd_layers.push(marker);
                this.cpd_active_layers.addLayer(marker);
                this.cpd_active_gid.push(gid);

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
window.console.log(" Clicked on a layer--->"+ event.layer.scec_properties.sliprate_id);
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

    };

// recreate a new active_layers using a glist
// glist is a sorted ascending list
// this.cpd_layers should be also ascending
    this.createActiveLayerGroupByGids = function(gidlist) {

        this.cpd_active_layers= new L.FeatureGroup();
        this.cpd_active_gid=[];

        let gsz=gidlist.length;
	let lsz= this.cpd_layers.length;
        let i_start=0;

        for (let j=0; j<gsz; j++) {
          let gid=gidlist[j];
          for (let i=i_start; i< lsz; i++) {
            let layer = this.cpd_layers[i];
            if (layer.hasOwnProperty("scec_properties")) {
               if (gid == layer.scec_properties.gid) {
		   this.cpd_active_layers.addLayer(layer);
                   this.cpd_active_gid.push(gid);
                   i_start=i+1;
               }
            }
          }
        }
    };

// recreate the original map state
    this.recreateActiveLayerGroup = function() {

        this.cpd_active_layers= new L.FeatureGroup();
        this.cpd_active_gid=[];
        
        for (let i=0; i< this.cpd_layers.length; i++) {
          let marker = this.cpd_layers[i];
          if (marker.hasOwnProperty("scec_properties")) {
             let gid = marker.scec_properties.gid;
             this.cpd_active_layers.addLayer(marker);
             this.cpd_active_gid.push(gid);
          }
        }
        this.cpd_active_layers.addTo(viewermap);
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
        } else {
            this.unselectSiteByLayer(layer);
        }
        return layer.scec_properties.selected;
    };

    this.toggleSiteSelectedByGid = function(gid) {
        let layer = this.getLayerByGid(gid);
        return this.toggleSiteSelected(layer, false);
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
window.console.log("HERE moving table Row ???");
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
        layer.setStyle(site_marker_style.normal);

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
        const $all_search_controls = $("#cpd-controls-container ul li");
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
                break;
            case this.searchType.maxrate:
                $("#cpd-maxrate-slider").show();
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

window.console.log("calling reset..");

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

	// put all original markers back
        if(this.cpd_active_gid.length != this.cpd_layers.length) {
          this.hideOnMap();
          this.recreateActiveLayerGroup();
          } else {
window.console.log("active layers is original.. no need to recreate");
        }

        skipRectangle();
        remove_bounding_rectangle_layer();

        this.resetMinrateSlider();
        this.resetMaxrateSlider();
        this.resetLatLon();
        this.resetFaultname();
        this.resetSitename();

        viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
    };

// a complete fresh search
    this.freshSearch = function (){

window.console.log("sliprate --- calling freshSearch..");
	    
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
    };


    this.getMarkerBySiteId = function (site_id) {
        for (const index in cpd_sliprate_site_data) {
            if (cpd_sliprate_site_data[index].sliprate_id == site_id) {
                return cpd_sliprate_site_data[index];
            }
        }

        return [];
    };

    this.search = function(type, criteria) {

        $searchResult = $("#searchResult");
        if (!type || !criteria) {
            $searchResult.html("");
        }
        if (!Array.isArray(criteria)) {
            criteria = [criteria];
        }

        let JSON_criteria = JSON.stringify(criteria);

window.console.log("calling search() with the type.."+type);
window.console.log("calling search() with the string.."+JSON_criteria);

        $("#wait-spinner").show();

        $.ajax({
            url: "php/search.php",
            data: {t: type, q: JSON_criteria},
        }).done(function(sliprate_result) {

            let results=[];
            let ncriteria=[];
window.console.log(sliprate_result);
            if(sliprate_result === "[\"[]\"]") {
window.console.log("Did not find any PHP result");
            } else {
                let tmp=JSON.parse(sliprate_result); 
                let jblob=JSON.parse(tmp[0].replace(/'/g,'"'));
                let glist=[];
/*****
[{'gidlist': [ gid1, gid2 ...] } ]
****/
                if(type==SLIPRATE.searchType.faultname) {
                    let item=jblob[0];
                    gidlist=item['gidlist]'];
window.console.log("WHAT are the result..");
                    } else { // hanle othe types
                }
	        this.createActiveLayerGroupByGids(glist);
            }
        });
    };

    this.search00 = function (type, criteria) {
window.console.log("sliprate --->> calling search.. <<----");
        this.searchingType = type;
        let results = [];
        switch (type) {
            case CPD_SLIPRATE.searchType.maxrate:
                {
                }
                break;
            case CPD_SLIPRATE.searchType.minrate:
                {
                }
                break;
            case CPD_SLIPRATE.searchType.faultname:
                {
                let new_faultname=criteria[0];
 window.console.log(" fultname HERE...");
		this.createActiveLayerGroupByGids(glist);
                }
                break;
            case CPD_SLIPRATE.searchType.sitename:
                {
                }
                break;
            case CPD_SLIPRATE.searchType.latlon:
                {
window.console.log( "   HERE -- search by latlon");
                $("#cpd-firstLatTxt").val(criteria[0]);
                $("#cpd-firstLonTxt").val(criteria[1]);
                $("#cpd-secondLatTxt").val(criteria[2]);
                $("#cpd-secondLonTxt").val(criteria[3]);
                remove_bounding_rectangle_layer();
                add_bounding_rectangle(criteria[0],criteria[1],criteria[2],criteria[3]);

                let glist=_foo();
		this.createActiveLayerGroupByGids(glist);
                }
                break;
            default : 
                {
                window.console.log("BAD... search");
                }
        }
    };

    this.searchBox = function (type, criteria) {
window.console.log("sliprate --->> calling searchBox");
        this.resetSearch();

        this.searching = true;
        let results = this.search(type, criteria);

        if (results.length === 0) {
            viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
        } else {
            let markerLocations = [];

            for (let i = 0; i < results.length; i++) {
                markerLocations.push(results[i].getLatLng());
                this.search_result.addLayer(results[i]);
            }

            this.showSitesByLayers(this.search_result);

            switch (type) {
                case this.searchType.latlon:
                    {
                    this.unselectAll();
                    markerLocations.push(L.latLng(criteria[0],criteria[1]));
                    markerLocations.push(L.latLng(criteria[2],criteria[3]));

                    let bounds = L.latLngBounds(markerLocations);
                    viewermap.fitBounds(bounds, {maxZoom: 12});
                    setTimeout(skipRectangle, 500);
                    } 
                    break;
                case this.searchType.sitename:
                case this.searchType.faultname:
                case this.searchType.minrate:
                case this.searchType.maxrate:
                    {
                    let bounds = L.latLngBounds(markerLocations);
                    viewermap.flyToBounds(bounds, {maxZoom: 12 });
                    }
                    break;
            };

        }

       this.replaceMetadataTableBody(results);
window.console.log("DONE with BoxSearch..");
    };

/********** metadata  functions *********************/
// create a metadata list using selected gid list
    function createMetaData(properties) {
        var meta={};
        meta.gid = properties.gid;
        meta.sliprate_id = properties.sliprateid;
        meta.x = properties.x;
        meta.y = properties.y;
        meta.fault_name = properties.faultname;
        meta.site_name = properties.sitename;
        meta.y = properties.y;
        meta.fault_name = properties.faultname;
        meta.site_name = properties.sitename;
        meta.low_rate = properties.lowrate;
        meta.high_rate = properties.highrate;
        meta.state = properties.state;
        meta.data_type = properties.datatype;
        meta.q_bin_min = properties.qbinmin;
        meta.q_bin_max = properties.qbinmax;
        meta.x_2014_dip = properties.x2014dip;
        meta.x_2014_rake = properties.x2014rake;
        meta.x_2014_rate = properties.x2014rate;
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
        html += `<td class="meta-data">${layer.scec_properties.sliprate_id}</td>`;
        html += `<td class="meta-data">${layer.scec_properties.site_name} </td>`;
        html += `<td class="meta-data">${layer.scec_properties.fault_name}</td>`;
        html += `<td class="meta-data">${layer.scec_properties.x} </td>`;
        html += `<td class="meta-data">${layer.scec_properties.y} </td>`;

        html += `<td class="meta-data" align='center' >${layer.scec_properties.low_rate} </td>`;
        html += `<td class="meta-data" align='center' >${layer.scec_properties.high_rate}</td>`;

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
        <th class="hoverColor" style="width:5rem" >Id&nbsp<span></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(2,'a')">Site Name&nbsp<span id='sortCol_2' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(3,'a')">Fault Name&nbsp<span id='sortCol_3' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(4,'n')" style="width:9rem">X&nbsp<span id='sortCol_4' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(5,'n')" style="width:9rem">Y&nbsp<span id='sortCol_5' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(6,'n')" style="width:5rem">Low<br>Rate&nbsp<span id='sortCol_6' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(7,'n')" style="width:5rem">High<br>Rate&nbsp<span id='sortCol_7' class="fas fa-angle-down"></span></th>
        <th style="width:20%;"><div class="col text-center">
<!--download all -->
                <div class="btn-group download-now">
                    <button id="download-all" type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false" disabled>
                            DOWNLOAD&nbsp<span id="download-counter"></span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
                       <button class="dropdown-item" type="button" value="metadata"
                            onclick="CPD_SLIPRATE.downloadURLsAsZip(this.value);">metadata
                       </button>
                       <button class="dropdown-item" type="button" value="all"
                            onclick="CPD_SLIPRATE.downloadURLsAsZip(this.value);">All of the Above
                       </button>
                    </div>
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
        this.resetLatLon = function () {
          if( this.searchingType != this.searchType.latlon) return;
          $("#cpd-firstLatTxt").val("");
          $("#cpd-firstLonTxt").val("");
          $("#cpd-secondLatTxt").val("");
          $("#cpd-scecondLonTxt").val("");
        }
        this.resetFaultname = function () {
          if( this.searchingType != this.searchType.faultname) return;
          $("#cpd-faultnameTxt").val("");
        }
        this.resetSitename = function () {
          if( this.searchingType != this.searchType.sitename) return;
          $("#cpd-sitenameTxt").val("");
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
            viewermap.invalidateSize();
            viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);

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
                           CPD_SLIPRATE.searchBox(searchType, ui.values);
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
                           resetMinrateRangeColor(ui.values[0],ui.values[1]);
                     },
              change: function( event, ui ) {
                           $("#cpd-minMaxrateSliderTxt").val(ui.values[0]);
                           $("#cpd-maxMaxrateSliderTxt").val(ui.values[1]);
                           resetMinrateRangeColor(ui.values[0],ui.values[1]);
                     },
              stop: function( event, ui ) {
                           let searchType = CPD_SLIPRATE.searchType.maxrate;
                           CPD_SLIPRATE.searchBox(searchType, ui.values);
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
           var name=s.sliprateid;
           var t="<tr id=\"row_"+gid+"\"><td style=\"width:25px\"><button class=\"btn btn-sm cxm-small-btn\" id=\"button_"+gid+"\" title=\"highlight the fault\" onclick=CPD_SLIPRATE.toggleSiteSelectedByGid("+gid+")><span id=\"sliprate-result-gid_"+gid+"\" class=\"glyphicon glyphicon-unchecked\"></span></button></td><td><label for=\"button_"+gid+"\">" + name + "</label></td></tr>";
           tmp=tmp+t;
        }
        html=html+ tmp + "</tbody>";

        if (visibleSiteObjects.getBounds().isValid()) {
            viewermap.fitBounds(visibleSiteObjects.getBounds());
        }

        return html;
    }

    function makeResultTable(json) {
        var html="";
        html+=`
<thead>
<tr>
   <th class='text-center'><button id=\"cpd-allBtn\" class=\"btn btn-sm cxm-small-btn\" title=\"select all visible sliprate sites\" onclick=\"CPD_SLIPRATE.toggleSelectAll();\"><span class=\"glyphicon glyphicon-unchecked\"></span></button></th>
<th class='myheader'>CPD Site Location</th>
</tr>
</thead>`;
        var body=makeResultTableBody(json);
        html=html+ "<tbody>" + body + "</tbody>";

        return html;
    }

// using existing gid_list,
    function makeResultTableWithList(glist) {
        window.console.log("calling makeResultTableWithList..");

        if(glist.length > 0) {
          toggle_layer_with_list(glist);
          var newhtml = _makeResultTableBodyWithGList(glist);
          document.getElementById("result-table-body").innerHTML = newhtml;
        }
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
            let downloadURL = getDataDownloadURL(layer.scec_properties.sliprate_id);
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
          var data=getCSVFromMeta(mlist, timestamp);
          saveAsCSVBlobFile(data, timestamp);
        }
    };
};

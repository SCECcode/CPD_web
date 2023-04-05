/***
   cpd_sliprate.js
***/
var TTT_SLIPRATE=10;

var CPD_SLIPRATE = new function () {
    window.console.log("in CPD_SLIPRATE..");

    // searching mode, would show all active layers with 
    //    selected ones in highlights
    // non-searching mode, would be showing all layers
    this.searching = false;

    // complete sliprate layers, one marker layer for one site, 
    // setup once from viewer.php
    this.cpd_layers= new L.FeatureGroup();

    // searched layers being actively looked at -- result of a search
    this.cpd_active_layers= new L.FeatureGroup();
    this.cpd_active_gid = [];

    // selected some layers from active layers
    // to be displayed at the metadata_table
    this.cpd_selected_gid = [];

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
        faultName: 'faultname',
        siteName: 'sitename',
        latlon: 'latlon',
        minrateSlider: 'minrateslider',
        maxrateSlider: 'maxrateslider'
    };

    var tablePlaceholderRow = `<tr id="placeholder-row">
                        <td colspan="5">Metadata for selected sliprate sites will appear here.</td>
                    </tr>`;

    this.activateData = function() {
        activeProduct = Products.SLIPRATE;
        this.showProduct();
        $("div.control-container").hide();
        $("#cpd-controls-container").show();

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


// cpd_sliprate_site_data is from viewer.php, which is the JSON 
// result from calling php getAllSiteData script
    this.generateLayers = function () {
        this.cpd_layers = new L.FeatureGroup();

        for (const index in cpd_sliprate_site_data) {
          if (cpd_sliprate_site_data.hasOwnProperty(index)) {
                let gid = cpd_sliprate_site_data[index].gid;
                let sliprate_id = cpd_sliprate_site_data[index].sliprate_id;
                let x = parseFloat(cpd_sliprate_site_data[index].x);
                let y = parseFloat(cpd_sliprate_site_data[index].y);
                let fault_name = cpd_sliprate_site_data[index].fault_name;
                let site_name = cpd_sliprate_site_data[index].site_name;
                let low_rate = parseFloat(cpd_sliprate_site_data[index].low_rate);
                let high_rate = parseFloat(cpd_sliprate_site_data[index].high_rate);
                let state = cpd_sliprate_site_data[index].state;
                let data_type = cpd_sliprate_site_data[index].data_type;
                let q_bin_min = parseFloat(cpd_sliprate_site_data[index].q_bin_min);
                let q_bin_max = parseFloat(cpd_sliprate_site_data[index].q_bin_max);
                let x_2014_dip = parseFloat(cpd_sliprate_site_data[index].x_2014_dip);
                let x_2014_rake = parseFloat(cpd_sliprate_site_data[index].x_2014_rake);
                let x_2014_rate = parseFloat(cpd_sliprate_site_data[index].x_2014_rate);
                let reference = cpd_sliprate_site_data[index].reference;

                let marker = L.circleMarker([y, x], site_marker_style.normal);

                let site_info = `site name: ${site_name}`;
                marker.bindTooltip(site_info).openTooltip();

                marker.scec_properties = {
                    gid: gid,
                    sliprate_id: sliprate_id,
                    x: x,
                    y: y,
                    fault_name: fault_name,
                    site_name: site_name,
                    low_rate: low_rate,
                    high_rate: high_rate,
                    reference: reference,
                    active: true,
                    selected: false
      
                };

		  XX
                this.cpd_layers.push(marker);
                this.cpd_active_layers.push(marker);
                this.cpd_active_gid.push(gid);
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

// select from currently active sites
    this.toggleSiteSelected = function(layer, clickFromMap=false) {
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
window.console.log("HERE.. selectSiteByLayer..");
        layer.scec_properties.selected = true;
        layer.setStyle(site_marker_style.selected);
        let gid = layer.scec_properties.gid;

// ResultsTable is the metadata-viewer
        let $row = $(`tr[sliprate-data-point-gid='${gid}'`);
        let rowHTML = "";
        if ($row.length == 0) {
           this.addToResultsTable(layer);
        }

        $row = $(`tr[sliprate-data-point-gid='${gid}'`);
        $row.addClass('row-selected');

// this is the selected table
        let $glyphElem = $row.find('span.cpd-data-row');
        $glyphElem.removeClass('glyphicon-unchecked').addClass('glyphicon-check');

        this.upSelectCount(gid);

        // move row to top
        if (moveTableRow) {
            let $rowHTML = $row.prop('outerHTML');
            $row.remove();
            $("#metadata-viewer.sliprate tbody").prepend($rowHTML);
        }
    };

    this.unselectSiteByLayer = function (layer) {
        layer.scec_properties.selected = false;
        layer.setStyle(site_marker_style.normal);

        let gid = layer.scec_properties.gid;

        let $row = $(`tr[sliprate-data-point-gid='${gid}'`);
        $row.removeClass('row-selected');
        let $glyphElem = $row.find('span.sliprate-data-row');
        $glyphElem.addClass('glyphicon-unchecked').removeClass('glyphicon-check');

        this.downSelectCount(gid);
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
        $("#metadata-viewer.sliprate tr.row-selected button span.glyphicon.glyphicon-check").removeClass('glyphicon-check').addClass('glyphicon-unchecked');
        $("#metadata-viewer.sliprate tr.row-selected").removeClass('row-selected');
    };

// search for a layer from master list by gid
    this.getLayerByGid = function(gid) {
        let foundLayer = false;
        let cnt=cpd_layers.length;
        for(let i=0; i<cnt; i++) {
          let layer=cpd_layers[i];
          if (layer.hasOwnProperty("scec_properties")) {
             if (gid == layer.scec_properties.gid) {
                 foundLayer = layer;
             }
          }
        }
        return foundLayer;
    };

    this.addToResultsTable = function(layer) {
        let $table = $("#metadata-viewer.sliprate tbody");
        let gid = layer.scec_properties.gid;
        if ($(`tr[sliprate-data-point-gid='${gid}'`).length > 0) {
            return;
        }
        let html = generateTableRow(layer);
        $table.find("tr#placeholder-row").remove();
        $table.prepend(html);
    };

    this.removeFromResultsTable = function (gid) {
        $(`#metadata-viewer tbody tr[sliprate-data-point-gid='${gid}']`).remove();
    };

    this.downloadURLsAsZip = function(ftype) {
        var nzip=new JSZip();
        var layers=CPD_SLIPRATE.cpd_active_layers.getLayers();
        let timestamp=$.now();
      
        var cnt=layers.length;
        for(var i=0; i<cnt; i++) {
          let layer=layers[i];

          if( !layer.scec_properties.selected ) {
            continue;
          }
      
          if(ftype == "all") {
            let downloadURL = getDataDownloadURL(layer.scec_properties.sliprate_id);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            let promise = $.get(downloadURL);
            nzip.file(dname,promise);
          }
        }
      
      
        var zipfname="CPD_SLIPRATE_"+timestamp+".zip"; 
        nzip.generateAsync({type:"blob"}).then(function (content) {
          // see FileSaver.js
          saveAs(content, zipfname);
        })
    }

var generateTableRow = function(layer) {
        let $table = $("#metadata-viewer");
        let html = "";

        html += `<tr sliprate-data-point-gid="${layer.scec_properties.gid}">`;

        html += `<td style="width:25px" class="cpd-data-click button-container"> <button class="btn btn-sm cxm-small-btn" id="" title="highlight the sliprate site" onclick=''>
            <span class="cpd-data-row glyphicon glyphicon-unchecked"></span>
        </button></td>`;

        html += `<td class="cpd-data-click">${layer.scec_properties.site_name}</td>`;
        html += `<td class="cpd-data-click">${layer.scec_properties.fault_name}</td>`;
        html += `<td class="cpd-data-click">${layer.scec_properties.x} </td>`;
        html += `<td class="cpd-data-click">${layer.scec_properties.y} </td>`;
        html += `<td class="cpd-data-click">${layer.scec_properties.low_rate} </td>`;
        html += `<td class="cpd-data-click">${layer.scec_properties.high_rate}</td>`;

        html += `</tr>`;

        return html;
    };

    this.showSearch = function (type) {
        const $all_search_controls = $("#cpd-controls-container ul li");
        $all_search_controls.hide();
        switch (type) {
            case this.searchType.faultName:
                $("#cpd-fault-name").show();
                break;
            case this.searchType.siteName:
                $("#cpd-site-name").show();
                break;
            case this.searchType.latlon:
                $("#cpd-latlon").show();
                drawRectangle();
                break;
            case this.searchType.minrateSlider:
                $("#cpd-minrate-slider").show();
                break;
            case this.searchType.maxrateSlider:
                $("#cpd-maxrate-slider").show();
                break;
            default:
                // no action
        }
        $all_search_controls.hide();
    };

    this.showProduct = function () {

        let $cpd_site_sliprate = $("#cpd-site-sliprate");

        if (!$cpd_site_sliprate.prop('checked')) {
            $cpd_site_sliprate.prop('checked', true);
        }

window.console.log("SHOW product");
        if (this.searching) {
            this.cpd_active_layers.addTo(viewermap);
        } else {
            this.cpd_layers.addTo(viewermap);
        }

        if (currentLayerName != 'shaded relief') {
            switchLayer('shaded relief');
            $("#mapLayer").val('shaded relief');
        }

    };

    
    this.hideProduct = function () {
        let $cpd_site_sliprate = $("#cpd-site-sliprate");
        if ($cpd_site_sliprate.prop('checked')) {
            $cpd_site_sliprate.prop('checked', false);
        }

        if (CPD_SLIPRATE.searching) {
            this.cpd_active_layers.remove();
        } else {
            this.cpd_layers.remove();
        }
    };

// reset everything
    this.reset = function() {
window.console.log("sliprate calling --->> reset");
        $("#wait-spinner").hide();
        this.zeroSelectCount();
        this.showSearch('none');
        this.searching = false;
        this.cpd_active_layers.removeLayer();
        this.cpd_active_layers = new L.FeatureGroup();
        this.cpd_active_gid=[];

        this.showProduct();

        remove_bounding_rectangle_layer();
        this.replaceResultsTableBody([]);
        skipRectangle();
        viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
        $("#cpd-controls-container input, #cpd-controls-container select").val("");

        this.resetMinRateSlider();
        this.resetMaxRateSlider();
        this.clearAllSelections();
    };

// reset just the search only
    this.resetSearch = function (){
window.console.log("sliprate calling --->> resetSearch.");
        $("#wait-spinner").hide();
        viewermap.removeLayer(this.cpd_active_layers);
        this.searching = false;

        this.cpd_active_layers.removeLayer();
        this.cpd_active_layers = new L.FeatureGroup();
        this.cpd_active_gid=[];

        this.replaceResultsTableBody([]);
        skipRectangle();
        remove_bounding_rectangle_layer();

        viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
        this.clearAllSelections();
    };

// a complete fresh search
    this.freshSearch = function (){

window.console.log("sliprate --- calling freshSearch..");
        $("#cpd-controls-container input").val("");
        this.resetMinRateSlider();
        this.resetMaxRateSlider();
        this.resetSearch();

        // show sliprate product
        if ($("#cpd-site-sliprate").prop('checked')) {
          this.showProduct();
          } else {
          this.hideProduct();
        }

        // show chrono product
        if ($("#cpd-site-chronology").prop('checked')) {
          CPD_CHRONOLOGY.showProduct();
          } else {
          CPD_CHRONOLOGY.hideProduct();
        }

        if ($("#cpd-model-cfm").prop('checked')) {
          CXM.showCFMFaults(viewermap);
          } else {
          CXM.hideCFMFaults(viewermap);
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

    this.calculateDistanceMeter = function (start_latlng, end_latlng) {
        let start_lat = start_latlng.lat;
        let start_lng = start_latlng.lng;
        let end_lat = end_latlng.lat;
        let end_lng = end_latlng.lng;

        // from http://www.movable-type.co.uk/scripts/latlong.html
        const R = 6371e3; // metres
        const theta1 = start_lat * Math.PI/180; // φ, λ in radians
        const theta2 = end_lat * Math.PI/180;   
        const deltaTheta = (end_lat-start_lat) * Math.PI/180;
        const deltaLamda = (end_lng-start_lng) * Math.PI/180;

        const a = Math.sin(deltaTheta/2) * Math.sin(deltaTheta/2) +
                       Math.cos(theta1) * Math.cos(theta2) *
                       Math.sin(deltaLamda/2) * Math.sin(deltaLamda/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // in metres
        return d;
    }

    this.search = function (type, criteria) {
window.console.log("sliprate --->> calling search.. <<----");
        let results = [];
        switch (type) {
            case CPD_SLIPRATE.searchType.maxrateSlider:
                {
                }
                break;
            case CPD_SLIPRATE.searchType.minrateSlider:
                {
                }
                break;
            case CPD_SLIPRATE.searchType.faultName:
                {
                }
                break;
            case CPD_SLIPRATE.searchType.siteName:
                {
                }
                break;
            case CPD_SLIPRATE.searchType.latlon:
                {
                $("#cpd-firstLatTxt").val(criteria[0]);
                $("#cpd-firstLonTxt").val(criteria[1]);
                $("#cpd-secondLatTxt").val(criteria[2]);
                $("#cpd-secondLonTxt").val(criteria[3]);
                remove_bounding_rectangle_layer();
                add_bounding_rectangle(criteria[0],criteria[1],criteria[2],criteria[3]);

                var new_active_layers = new L.FeatureGroup();
                var new_active_gid=[];
                var layers=CPD_SLIPRATE.cpd_active_layers.getLayers();
                let cnt=this.cpd_active_gid.length();

                let glist=_foo();

                for(let i=0; i<cnt; i++) {
                    let g=this.cpd_active_gid[i];
                    if(g in glist) {
                        let layer=layers[i];
                        results.push(layer); 
                    }
                }
                }
                return results;
                break;
        }
    };

    // private function
var _foo = function (){
   var foolist=[];
   foolist.push(1);
   return foolist;
}

    this.searchBox = function (type, criteria) {
window.console.log("sliprate --->> calling searchBox");
        this.hideProduct();
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

            if( !modelVisible()) {
                this.showProduct();
            }

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
                case this.searchType.siteName:
                case this.searchType.faultName:
                case this.searchType.minrateSlider:
                case this.searchType.maxrateSlider:
                    {
                    let bounds = L.latLngBounds(markerLocations);
                    viewermap.flyToBounds(bounds, {maxZoom: 12 });
                    }
                    break;
            };
        }

    this.replaceResultsTableBody(results);
window.console.log("DONE with BoxSearch..");

        $("#wait-spinner").hide();
    };

    // private function
    var modelVisible = function (){
        return $("#cpd-sliprate-model").prop('checked');
    };

    // private function
    var generateResultsTable = function (results) {
window.console.log("generateResultsTable..");
            var html = "";
            html+=`
<thead>
<tr>
        <th class="text-center button-container" style="width:2rem">
            <button id="cpd-allBtn" class="btn btn-sm cxm-small-btn" title="select all visible stations" onclick="CPD_SLIPRATE.toggleSelectAll();">
              <span class="glyphicon glyphicon-unchecked"></span>
            </button>
        </th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(1,'a')">Site Name&nbsp<span id='sortCol_1' class="fas fa-angle-down"></span><br>Name</th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(2,'n')">Fault Name&nbsp<span id='sortCol_2' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(3,'n')">X&nbsp<span id='sortCol_3' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(4,'n')">Y&nbsp<span id='sortCol_4' class="fas fa-angle-down"></span></th>
        <th style="width:6rem">Type</th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(5,'n')">Low Rate&nbsp<span id='sortCol_5' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(6,'n')">High Rate&nbsp<span id='sortCol_6' class="fas fa-angle-down"></span></th>
        <th style="width:20%;"><div class="col text-center">
<!--download all -->
                <div class="btn-group download-now">
                    <button id="download-all" type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false" disabled>
                            DOWNLOAD&nbsp<span id="download-counter"></span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
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
                html += generateTableRow(results[i]);
            }
            if (results.length == 0) {
                html += tablePlaceholderRow;
            }
            html=html+"</tbody>";
            return html;
        };

       var changeResultsTableBody = function (results) {
window.console.log("changeResultsTableBody..");
            var html = "";
            for (let i = 0; i < results.length; i++) {
                html += generateTableRow(results[i]);
            }
            if (results.length == 0) {
                html += tablePlaceholderRow;
            }
            return html;
        };

   
        this.replaceResultsTableBody = function(results) {
            window.console.log("calling replaceResultsTableBody");
            $("#metadata-viewer tbody").html(changeResultsTableBody(results));
        };

        this.replaceResultsTable = function(results) {
            window.console.log("calling replaceResultsTable");
            $("#metadata-viewer").html(generateResultsTable(results));
        };

        var getDataDownloadURL = function(station_id, frame)  {
//??? XX
            window.console.log("calling getDtaDownlaodURL.. TODO");
        };

        var resetMinrateRangeColor = function (target_min, target_max){
          let minRGB= makeRGB(target_min, CPD_SLIPRATE.cpd_minrate_max, CPD_SLIPRATE.cpd_minrate_min );
          let maxRGB= makeRGB(target_max, CPD_SLIPRATE.cpd_minrate_max, CPD_SLIPRATE.cpd_minrate_min );
          let myColor="linear-gradient(to right, "+minRGB+","+maxRGB+")";
          $("#slider-minrate-range .ui-slider-range" ).css( "background", myColor );
        }

        this.resetMinrateSlider = function () {
          $("#slider-minrate-range").slider('values', 
                              [CPD_SLIPRATE.cpd_minrate_min, CPD_SLIPRATE.cpd_minrate_max]);
          $("#cpd-minMinrateSliderTxt").val(CPD_SLIPRATE.cpd_minrate_min);
          $("#cpd-maxMinrateSliderTxt").val(CPD_SLIPRATE.cpd_minrate_max);
        }

        var resetMaxrateRangeColor = function (target_min, target_max){
          let minRGB= makeRGB(target_min, CPD_SLIPRATE.cpd_maxrate_max, CPD_SLIPRATE.cpd_maxrate_min );
          let maxRGB= makeRGB(target_max, CPD_SLIPRATE.cpd_maxrate_max, CPD_SLIPRATE.cpd_maxrate_min );
          let myColor="linear-gradient(to right, "+minRGB+","+maxRGB+")";
          $("#slider-maxrate-range .ui-slider-range" ).css( "background", myColor );
        }

        this.resetMaxrateSlider = function () {
          $("#slider-maxrate-range").slider('values', 
                              [CPD_SLIPRATE.cpd_maxrate_min, CPD_SLIPRATE.cpd_maxrate_max]);
          $("#cpd-minMaxrateSliderTxt").val(CPD_SLIPRATE.cpd_maxrate_min);
          $("#cpd-maxMaxrateSliderTxt").val(CPD_SLIPRATE.cpd_maxrate_max);
        }

        this.setupCPDInterface = function() {
            var $download_queue_table = $('#metadata-viewer');
            var sz=0;
            if($download_queue_table != null) {
                sz=cpd_sliprate_site_data.length;
            }
window.console.log("setupCPDInterface: retrieved sites "+sz);

            this.activateData();

            $("#cpd-controlers-container").css('display','');
            $("#cpd-sliprate-controlers-container").css('display','none');

            $("div.mapData div.map-container").css('padding-left','30px');
            $("#CPD_plot").css('height','500px');
            viewermap.invalidateSize();
            viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
            $download_queue_table.floatThead('destroy');

            this.replaceResultsTable([]);
            $download_queue_table.addClass('sliprate');
            $("#data-product-select").val("sliprate");

            $download_queue_table.floatThead({
                 scrollContainer: function ($table) {
                     return $table.closest('div#metadata-viewer-container');
                 },
            });

/* setup  sliders */
        $("#slider-minrate-range").slider({ 
                  range:true, step:0.01, min:CPD_SLIPRATE.cpd_minrate_min, max:CPD_SLIPRATE.cpd_minrate_max, values:[CPD_SLIPRATE.cpd_minrate_min, CPD_SLIPRATE.cpd_minrate_max],
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
                           let searchType = CPD_SLIPRATE.searchType.minrateSlider;
                           CPD_SLIPRATE.searchBox(searchType, ui.values);
                     },
              create: function() {
                          $("#cpd-minMinrateSliderTxt").val(CPD_SLIPRATE.cpd_minrate_min);
                          $("#cpd-maxMinrateSliderTxt").val(CPD_SLIPRATE.cpd_minrate_max);
                    }
        });
        $('#slider-minrate-range').slider("option", "min", CPD_SLIPRATE.cpd_minrate_min);
        $('#slider-minrate-range').slider("option", "max", CPD_SLIPRATE.cpd_minrate_max);

        $("#slider-minrate-range").slider({ 
                  range:true, step:0.01, min:CPD_SLIPRATE.cpd_minrate_min, max:CPD_SLIPRATE.cpd_minrate_max, values:[CPD_SLIPRATE.cpd_minrate_min, CPD_SLIPRATE.cpd_minrate_max],
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
                           let searchType = CPD_SLIPRATE.searchType.minrateSlider;
                           CPD_SLIPRATE.searchBox(searchType, ui.values);
                     },
              create: function() {
                          $("#cpd-minMaxrateSliderTxt").val(CPD_SLIPRATE.cpd_minrate_min);
                          $("#cpd-maxMaxrateSliderTxt").val(CPD_SLIPRATE.cpd_minrate_max);
                    }
        });
        $('#slider-minrate-range').slider("option", "min", CPD_SLIPRATE.cpd_minrate_min);
        $('#slider-minrate-range').slider("option", "max", CPD_SLIPRATE.cpd_minrate_max);

        $("#wait-spinner").hide();

    };

};

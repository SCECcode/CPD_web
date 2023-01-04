<?php

require_once("php/navigation.php");
require_once("php/CGM_GNSS.php");
require_once("php/CGM_INSAR.php");

$header = getHeader("Viewer");
$cgm_gnss = new CGM_GNSS();
$cgm_insar = new CGM_INSAR();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Community Geodetic Viewer (Provisional)</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/vendor/font-awesome.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/vendor/leaflet.awesome-markers.css">
    <link rel="stylesheet" href="css/vendor/leaflet.css">
    <link rel="stylesheet" href="css/vendor/jquery-ui.css">
    <link rel="stylesheet" href="css/vendor/glyphicons.css">
    <link rel="stylesheet" href="css/vendor/all.css">
    <link rel="stylesheet" href="css/cgm-ui.css?v=1">
    <link rel="stylesheet" href="css/sidebar.css?v=1">

    <script type="text/javascript" src="js/vendor/leaflet-src.js"></script>
    <script type='text/javascript' src='js/vendor/leaflet.awesome-markers.min.js'></script>
    <script type='text/javascript' src='js/vendor/popper.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.min.js'></script>
    <script type='text/javascript' src='js/vendor/bootstrap.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery-ui.js'></script>
    <script type='text/javascript' src='js/vendor/ersi-leaflet.js'></script>
    <script type='text/javascript' src='js/vendor/FileSaver.js'></script>
    <script type='text/javascript' src='js/vendor/jszip.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.floatThead.min.js'></script>
    <script type='text/javascript' src='js/vendor/html2canvas.js'></script>

    <!--
    https://leaflet.github.io/Leaflet.draw/docs/Leaflet.draw-latest.html#l-draw
    this is for including the Leaflet.draw plugin
    -->
    <link rel="stylesheet" href="plugin/Leaflet.draw/leaflet.draw.css">
    <script type='text/javascript' src="plugin/Leaflet.draw/Leaflet.draw.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Leaflet.Draw.Event.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Toolbar.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Tooltip.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/GeometryUtil.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/LatLngUtil.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/LineUtil.Intersect.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/Polygon.Intersect.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/Polyline.Intersect.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/TouchEvents.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/DrawToolbar.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Feature.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.SimpleShape.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Polyline.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Marker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Circle.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.CircleMarker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Polygon.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Rectangle.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/EditToolbar.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/EditToolbar.Edit.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/EditToolbar.Delete.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Control.Draw.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Poly.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.SimpleShape.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Rectangle.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Marker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.CircleMarker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Circle.js"></script>
    <script type='text/javascript' src="plugin/leaflet.polylineDecorator.js"></script>

    <!-- cgm js -->
    <script type="text/javascript" src="js/debug.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_main.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_gnss.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_insar.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_util.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_viewTS_util.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_viewTS.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_leaflet.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_misc_util.js?v=1"></script>

   <!-- pixi pixiOverlay -->
    <script type="text/javascript" src="js/vendor/pixi.js"></script>
    <script type="text/javascript" src="js/vendor/pixiOverlay/L.PixiOverlay.js"></script>
    <script type="text/javascript" src="js/vendor/pixiOverlay/MarkerContainer.js"></script>
    <script type="text/javascript" src="js/vendor/pixiOverlay/bezier-easing.js"></script>
    <script type="text/javascript" src="js/cgm_pixi.js"></script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-495056-12"></script>
    <script type="text/javascript">
        $ = jQuery;
        var tableLoadCompleted = false;
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        gtag('config', 'UA-495056-12');

        $(document).on("tableLoadCompleted", function () {
window.console.log("HERE..");
            tableLoadCompleted = true;

            var $download_queue_table = $('#metadata-viewer');
            $download_queue_table.floatThead({
                scrollContainer: function ($table) {
                    return $table.closest('div#metadata-viewer-container');
                },
            });

        });

    </script>

</head>
<body>
<?php echo $header; ?>


<div class="container main">
    <div class="row">
        <div class="col-12">
            <p>The Community Geodetic Model (CGM) provides displacement time series and velocities of the Earth’s surface over southern California using data from Global Navigation Satellite Systems (GNSS), which includes the Global Positioning System (GPS), and interferometric synthetic aperture radar (InSAR), both space-based geodetic observation techniques.</p>
        </div>
    </div>

    <div class="row" style="display:none;">
        <div class="col justify-content-end custom-control-inline">
            <div style="display:none;" id="external_leaflet_control"></div>
            <div id="downloadSelect" class="cfm-control-download" onMouseLeave="removeDownloadControl()"></div>
        </div>
    </div>

<!-- GNSS select -->
    <div class="row control-container mt-1" id="cgm-controls-container" style="display:;">
            <div class="col-4 input-group filters mb-3">
                <select id="cgm-search-type" class="custom-select">
                    <option value="">Search the GNSS ...</option>
                    <option value="stationname">Station Name</option>
                    <option value="latlon">Latitude &amp; Longitude Box</option>
                    <option value="vectorslider">Vector</option>
                </select>
                <div class="input-group-append">
                    <button id="refresh-all-button" onclick="CGM_GNSS.reset();" class="btn btn-dark pl-4 pr-4"
                            type="button">Reset</button>
                </div>
            </div>
            <div class="col-8">
                <ul>
                    <li id='cgm-station-name' class='navigationLi ' style="display:none">
                        <div class='menu row justify-content-center'>
                            <div class="col-12">
                                <div class="d-flex">
                                    <input placeholder="Enter Station Name" type="text"
                                            class="cgm-search-item form-control"
                                            style=""/>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li id='cgm-latlon' class='navigationLi ' style="display:none">
                        <div id='cgm-latlonMenu' class='menu'>
                            <div class="row">
                                <div class="col-4">
                                    <p>Draw a rectangle on the map or enter latitudes and longitudes</p>
                                </div>
                                <div class="col-8">
                                    <div class="form-inline latlon-input-boxes">
                                        <input type="text"
                                                placeholder="Latitude"
                                                id="cgm-firstLatTxt"
                                                title="first lat"
                                                onfocus="this.value=''"
                                                class="cgm-search-item form-control">
                                        <input type="text" 
                                                placeholder='Longitude' 
                                                id="cgm-firstLonTxt" 
                                                title="first lon"
                                                onfocus="this.value=''" 
                                                class="cgm-search-item form-control">
                                        <input type="text"
                                                id="cgm-secondLatTxt"
                                                title="second lat"
                                                placeholder='2nd Latitude'
                                                onfocus="this.value=''"
                                                class="cgm-search-item form-control">
                                        <input type="text"
                                                id="cgm-secondLonTxt"
                                                title="second lon"
                                                placeholder='2nd Longitude'
                                                onfocus="this.value=''"
                                                class="cgm-search-item form-control">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li id='cgm-vector-slider' class='navigationLi' style="display:none">
                        <div id='cgm-vector-sliderMenu' class='menu'>
                            <div class="row">
                                <div class="col-4">
                                    <p>Select a vector range on the slider or enter the two boundaries</p>
                                </div>
                                <div class="col-8">
                                   <div class="form-inline vector-slider-input-boxes">
                                       <input type="text"
                                              id="cgm-minVectorSliderTxt"
                                              title="min vector slider"
                                              onfocus="this.value=''"
                                              class="cgm-search-item form-control">
                                       <div class="col-5">
                                         <div id="slider-vector-range" style="border:2px solid black"></div>
		           <div id="min-vector-slider-handle" class="ui-slider-handle"></div>
		           <div id="max-vector-slider-handle" class="ui-slider-handle"></div>
                                       </div>
                                       <input type="text"
                                              id="cgm-maxVectorSliderTxt"
                                              title="max vector slider"
                                              onfocus="this.value=''"
                                              class="cgm-search-item form-control">
                                  </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
    </div>
<!-- INSAR select -->
    <div class="row control-container mt-1" id="cgm-insar-controls-container" style="display:none;">
            <div class="col-4 input-group filters mb-3">
                <select id="cgm-insar-search-type" class="custom-select">
                    <option value="">Search the InSAR</option>
                    <option value="location">Point Location</option>
                    <option value="latlon">Latitude &amp; Longitude Box</option>
                </select>
                <div class="input-group-append">
                    <button id="refresh-insar-all-button" onclick="CGM_INSAR.reset()" class="btn btn-dark pl-4 pr-4"
                            type="button">Reset</button>
                </div>
            </div>
            <div class="col-8">
                <ul>
                    <li id='cgm-insar-location' class='navigationLi' style="display:none">
                        <div id='cgm-insar-locationMenu' class='menu'>
                            <div class="row">
                                <div class="col-4">
                                    <p>Select a location on the map or enter latitude and longitude</p>
                                </div>
                                <div class="col-8">
                                    <div class="form-inline latlon-input-boxes">
                                        <input type="text"
                                                placeholder='Latitude'
                                                id="cgm-insar-LatTxt"
                                                title="insar lat"
                                                onfocus="this.value=''"
                                                class="cgm-insar-search-item form-control">
                                        <input type="text" 
                                                placeholder='Longitude' 
                                                id="cgm-insar-LonTxt" 
                                                title="insar lon"
                                                onfocus="this.value=''" 
                                                class="cgm-insar-search-item form-control">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li id='cgm-insar-latlon' class='navigationLi' style="display:none">
                        <div id='cgm-insar-latlonMenu' class='menu'>
                            <div class="row">
                                <div class="col-4">
                                    <p>Draw a rectangle on the map or enter latitudes and longitudes</p>
                                </div>
                                <div class="col-8">
                                    <div class="form-inline latlon-input-boxes">
                                        <input type="text"
                                                placeholder="Latitude"
                                                id="cgm-insar-firstLatTxt"
                                                title="first lat"
                                                onfocus="this.value=''"
                                                class="cgm-insar-search-item form-control">
                                        <input type="text" 
                                                placeholder='Longitude' 
                                                id="cgm-insar-firstLonTxt" 
                                                title="first lon"
                                                onfocus="this.value=''" 
                                                class="cgm-insar-search-item form-control">
                                        <input type="text"
                                                id="cgm-insar-secondLatTxt"
                                                title="second lat"
                                                placeholder='2nd Latitude'
                                                onfocus="this.value=''"
                                                class="cgm-insar-search-item form-control">
                                        <input type="text"
                                                id="cgm-insar-secondLonTxt"
                                                title="second lon"
                                                placeholder='2nd Longitude'
                                                onfocus="this.value=''"
                                                class="cgm-insar-search-item form-control">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
    </div>
<!-- -->
    <div class="row">
        <div class="col-12 text-right pr-0">
<!--- no need for this right now
                <div class="input-group input-group-sm custom-control-inline ml-0" id="tract-controls" style="max-width:180px">
                         <div class="input-group-prepend">
                                 <label style='border-bottom:1;' class="input-group-text" for="inar-track-select">Select Track</label>
                         </div>
                         <select id='insar-track-select' class="custom-select custom-select-sm">
                                 <option selected value="all">ALL</option>
                                 <option value="D071">D071</option>
                                 <option value="D173" disabled>D173</option>
                                 <option value="D064" disabled>D064</option>
                                 <option value="D166" disabled>D166</option>
                         </select>
                </div>
--->
                <div class="input-group input-group-sm custom-control-inline ml-0" id="dataset-controls" style="max-width:180px">
                         <div class="input-group-prepend">
                                 <label style='border-bottom:1;' class="input-group-text" for="data-product-select">Select Dataset</label>
                         </div>
                         <select id='data-product-select' class="custom-select custom-select-sm">
                                 <option selected value="gnss">GNSS</option>
                                 <option value="insar">InSAR</option>
                         </select>
                </div>
                <div id='model-options' class="form-check-inline mr-0">
                    <div class="form-check form-check-inline">
                         <label class='form-check-label'
                                 for="cgm-model">
                         <input class='form-check-inline mr-1'
                                 type="checkbox"
                                 id="cgm-model"/>GNSS
                         </label>
                    </div>
                    <div class="form-check form-check-inline">
                         <label class='form-check-label ml-1 mini-option'
                                 for="cgm-model-vectors">
                         <input class='form-check-inline mr-1'
                                 type="checkbox"
                                 id="cgm-model-vectors" value="1" />GNSS vectors
                         </label>
                    </div>
                    <div class="form-check form-check-inline">
                         <label class='form-check-label ml-1 mini-option'
                                 for="cgm-model-insar">
                         <input class='form-check-inline mr-1'
                                 type="checkbox"
                                 id="cgm-model-insar" value="1" />InSAR
                         </label>
                    </div>
                    <div class="form-check form-check-inline">
                         <label class='form-check-label ml-1 mini-option'
                                 for="cgm-model-cfm">
                         <input class='form-check-inline mr-1'
                                 type="checkbox"
                                 id="cgm-model-cfm" value="1" />CFM faults
                         </label>
                    </div>
                    <div class="input-group input-group-sm custom-control-inline mr-0" id="map-controls">
                        <div class="input-group-prepend">
                            <label style='border-bottom:1;' class="input-group-text" for="mapLayer">Select Map Type</label>
                        </div>
                        <select id="mapLayer" class="custom-select custom-select-sm"
                                onchange="switchLayer(this.value);">
                            <option selected value="esri topo">ESRI Topographic</option>
                            <option value="esri NG">ESRI National Geographic</option>
                            <option value="esri imagery">ESRI Imagery</option>
                            <option value="otm topo">OTM Topographic</option>
                            <option value="osm street">OSM Street</option>
                            <option value="shaded relief">Shaded Relief</option>
                        </select>
                    </div>
                </div>
        </div>
    </div>
    <div class="row mapData">
<!-- NO NEED FOR THIS ??
        <div class="col-5 button-container d-flex flex-column cgm-search-result-container pr-1" style="overflow:hidden;">
            <div id="searchResult" class="mb-1" style="display:none">
            </div>
        </div>
--->
        <div class="col-12 map-container">

            <div class="row" >

                <div class="col" id='CGM_plot'
                        style="position:relative;border:solid 1px #ced4da; height:500px;">
                    <div  id='wait-spinner' style="">
                        <div class="d-flex justify-content-center" >
                          <div class="spinner-border text-light" role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
    <div class="row mt-1">
        <div class="col-12" style="padding-right:0px">
            <div id="metadata-viewer-container" style="border:solid 1px #ced4da; overflow-x:hidden">
                <table id="metadata-viewer">
                    <thead>
                      <tr>
                      </tr>
                    </thead>
                    <tbody>
                      <tr id="placeholder-row">
                          <td colspan="11">Metadata for selected piont will appear here. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
        </div>
    </div>
</div>

<!--Modal: Name Azimuth  -->
<div class="modal" id="modalazimuth" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalazimuthDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalazimuthContent">
      <!--Body-->
      <div class="modal-body" id="modalazimuthBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
         <p> Talk about what is this azimuth about...</p>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal">Close</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->


<!--Modal: Name TS(time series)-->
<div class="modal" id="modalTS" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="modalTS" aria-hidden="true">
  <div class="modal-dialog modal-full" id="modalTSDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalTSContent">
      <!--Header-->
      <div class="modal-header">
        <button id="viewTSTogglebtn" class="btn btn-outline-primary btn-sm" type="button" onclick="toggleTSview()">Switch Frame Type</button>
      </div>

      <!--Body-->
      <div class="modal-body" id="modalTSBody">
        <div id="iframe-container" class="row col-12" style="overflow:hidden;">
          <iframe id="viewTSIfram" title="SCEC CGM Time series viewer" src="" onload="setIframHeight(this.id)" height="10" width="100%" allowfullscreen></iframe>
        </div>
        <div id="paramsTS" value="" style="display:none"></div>
      </div>

      <div class="modal-footer justify-content-center" id="modalTSFooter">
        <button id="viewTSClosebtn" class="btn btn-outline-primary btn-sm" data-dismiss="modal">Close</button>
        <button id="viewTSRefreshbtn" class="btn btn-outline-primary btn-sm" type="button" onclick="refreshTSview()">Reset</button>
        <button id="viewTSMovebtn" class="btn btn-outline-primary btn-sm" type="button" onclick="moveTSview()">New Window</button>
        <button id="viewTSWarnbtn" class="btn btn-outline-primary btn-sm" style="display:none" data-toggle="modal" data-target="#modalwarnTS"></button>
<!-- Plotly's toImage does not work for surface-contour plot -->
        <button id="viewTSSavebtn" class="btn btn-outline-primary btn-sm" type="button" onclick="saveTSview()">Save Image</button>
        <button id="viewTSHelpbtn" class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#modalinfoTS" onclick="$('#modalTS').modal('hide');">Help</button>
      </div> <!-- footer -->

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->

<!--Modal: ModelType -->
<div class="modal" id="modalinfoTS" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xlg" id="modalinfoTSDialog" role="document">
    <!--Content-->
    <div class="modal-content" id="modalinfoTSContent">
      <!--Body-->
      <div class="modal-body" id="modalinfoTSBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="infoTSTable-container"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal" onclick="$('#modalTS').modal('show');"
>Close</button>
      </div>
    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->

<!--Modal: ModelType -->
<div class="modal" id="modalwarnTS" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalwarnTSDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalwarnTSContent">
      <!--Body-->
      <div class="modal-body" id="modalwarnTSBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="warnTSTable-container"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal">Close</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name-->


<!-- -->
    <script type="text/javascript">
            cgm_gnss_station_data = <?php print $cgm_gnss->getAllStationData()->outputJSON(); ?>;
            cgm_insar_track_data = <?php print $cgm_insar->getAllTrackData()->outputJSON(); ?>;
    </script>
</body>
</html>


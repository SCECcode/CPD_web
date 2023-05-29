<?php
require_once("php/navigation.php");
require_once("php/CPD_SLIPRATE.php");
$header = getHeader("Viewer");

$cpd_sliprate = new SLIPRATE();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Community Paleoseismic Database (Provisional)</title>
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
    <link rel="stylesheet" href="css/cxm-ui.css?v=1">

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

    <script type='text/javascript' src='js/vendor/togeojson.js'></script>
    <script type='text/javascript' src='js/vendor/leaflet-kmz-src.js'></script>

    <link rel="stylesheet" href="js/vendor/plugin/Leaflet.draw/leaflet.draw.css">
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Leaflet.draw.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Leaflet.Draw.Event.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Toolbar.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Tooltip.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/GeometryUtil.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/LatLngUtil.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/LineUtil.Intersect.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/Polygon.Intersect.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/Polyline.Intersect.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/TouchEvents.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/DrawToolbar.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Feature.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.SimpleShape.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Polyline.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Marker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Circle.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.CircleMarker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Polygon.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Rectangle.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/EditToolbar.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/EditToolbar.Edit.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/EditToolbar.Delete.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Control.Draw.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Poly.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.SimpleShape.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Rectangle.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Marker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.CircleMarker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Circle.js"></script>

<!-- cpd js -->
    <script type="text/javascript" src="js/debug.js?v=1"></script>
    <script type="text/javascript" src="js/cpd_main.js?v=1"></script>
    <script type="text/javascript" src="js/cpd_sliprate.js?v=1"></script>
    <script type="text/javascript" src="js/cpd_leaflet.js?v=1"></script>
    <script type="text/javascript" src="js/cpd_ui.js?v=1"></script>

<!-- cxm js -->
    <script type="text/javascript" src="js/cxm_kml.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_model_util.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_misc_util.js?v=1"></script>

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
            tableLoadCompleted = true;

	    var $result_table = $('#result_table');
            $result_table.floatThead({
                scrollContainer: function ($table) {
                    return $table.closest('div#result-table-container');
                },
            });
        });

    </script>

</head>
<body>
<?php echo $header; ?>

<div class="container main" id="cpdMain">

<!-- trace dumping buttons 
    <div style="display:none">
      <button id="dumpMarkerLatlngBtn" class="btn cxm-small-btn" onClick="toFileMarkerLatlng()">
                <span class="glyphicon glyphicon-share"></span> Export Marker Latlng</button>
    </div>
-->

<!-- top-intro -->
   <div id="top-intro" style="display:">
<p>
The sites of the <a href="https://www.scec.org/research/cpd">SCEC Community PaleoSeismic Database Model</a> are 
...  See the <a href="guide">user guide</a> for more details and usage instructions.
</p>
   </div>

<!-- leaflet control -->
   <div class="row" style="display:none;">
        <div class="col justify-content-end custom-control-inline">
            <div style="display:none;" id="external_leaflet_control"></div>
        </div>
   </div>

<!-- top-control -->
   <div id="top-control" class="row">
      <div id="cpd-controls-container" class="col" >
<!-- control-row-1 -->
        <div id="top-control-row-1" class="col-12">

          <div class="row mb-1">
             <form id="id_select_dataset">
               <label for="dataset"> Choose CPD Dataset : </label>
               <label><input type="radio" id="dataset_sliprate" name=dataset />
                        <span>Sliprate sites</span></label>
<!--
               <label><input type="radio" id="dataset_chronology" name=dataset />
                        <span>Chronology sites</span></label>
-->
             </form>
          </div>

<!-- SLIPRATE select -->
          <div id="cpd-sliprate-search-control" class="row mt-1 container-control" style="margin-left:-30px">
            <div class="col-4 input-group filters mb-3">
              <select id="cpd-search-type" class="custom-select">
                  <option value="">Search the Slip Rate Sites</option>
                  <option value="faultname">Fault Name</option>
                  <option value="sitename">Site Name</option>
                  <option value="latlon">Latitude &amp; Longitude</option>
                  <option value="minrate">minRate</option>
                  <option value="maxrate">maxRate</option>
              </select>
	      <div class="input-group-append">
                  <button id="refresh-all-button" onclick="CPD_SLIPRATE.reset();"
                           class="btn btn-dark pl-4 pr-4" type="button">Reset</button>
              </div>
            </div>

<!-- SLIPRATE option expand -->
            <div class="col-8">
              <ul>
                <li id='cpd-fault-name' class='navigationLi' style="display:none">
                  <div class='menu row justify-content-center'>
                    <div class="col-12">
                      <div class="d-flex">
                           <input id="cpd-faultnameTxt" placeholder="Enter Fault Name" type="text"
                                  onfocus="this.value=''"
                                  class="cpd-faultname-item form-control">
                      </div>
                    </div>
                  </div>
                </li>
                <li id='cpd-site-name' class='navigationLi ' style="display:none">
                  <div class='menu row justify-content-center'>
                    <div class="col-12">
                      <div class="d-flex">
                           <input id="cpd-sitenameTxt" placeholder="Enter Site Name" type="text"
                                  onfocus="this.value=''"
                                  class="cpd-sitename-item form-control">
                      </div>
                    </div>
                  </div>
                </li>
                <li id='cpd-latlon' class='navigationLi ' style="display:none">
                  <div id='cpd-latlonMenu' class='menu'>
                    <div class="row">
                      <div class="col-4">
                          <p>Draw a rectangle on the map or enter latitudes and longitudes</p>
                      </div>
                      <div class="col-8">
                        <div class="form-inline latlon-input-boxes">
                            <input type="text"
                                   placeholder="Latitude"
                                   id="cpd-firstLatTxt"
                                   title="first lat"
                                   onfocus="this.value=''"
                                   class="cpd-latlon-item form-control">
                            <input type="text" 
                                   placeholder='Longitude' 
                                   id="cpd-firstLonTxt" 
                                   title="first lon"
                                   onfocus="this.value=''" 
                                   class="cpd-latlon-item form-control">
                            <input type="text"
                                   id="cpd-secondLatTxt"
                                   title="second lat"
                                   placeholder='2nd Latitude'
                                   onfocus="this.value=''"
                                   class="cpd-latlon-item form-control">
                            <input type="text"
                                   id="cpd-secondLonTxt"
                                   title="second lon"
                                   placeholder='2nd Longitude'
                                   onfocus="this.value=''"
                                   class="cpd-latlon-item form-control">
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

<!-- minrate slider -->
                <li id='cpd-minrate-slider' class='navigationLi' style="display:none;">
                  <div id='cpd-minrate-sliderMenu' class='menu'>
                    <div class="row">
                      <div class="col-4">
                          <p>Select a range on the minRate slider or enter the two boundaries</p>
                      </div>
                      <div class="col-8">
                        <div class="form-inline vector-slider-input-boxes">
                          <input type="text"
                              id="cpd-minMinrateSliderTxt"
                              title="min minrate slider"
                              onfocus="this.value=''"
                              class="cpd-minrate-item form-control">
                          <div class="col-5">
                            <div id="slider-minrate-range" style="border:2px solid black"></div>
		            <div id="min-minrate-slider-handle" class="ui-slider-handle"></div>
		            <div id="max-minrate-slider-handle" class="ui-slider-handle"></div>
                          </div>
                          <input type="text"
                              id="cpd-maxMinrateSliderTxt"
                              title="max minrate slider"
                              onfocus="this.value=''"
                              class="cpd-minrate-item form-control">
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
<!-- maxrate slider -->
                <li id='cpd-maxrate-slider' class='navigationLi' style="display:none">
                  <div id='cpd-maxrate-sliderMenu' class='menu'>
                    <div class="row">
                      <div class="col-4">
                          <p>Select a range on the maxRate slider or enter the two boundaries</p>
                      </div>
                      <div class="col-8">
                        <div class="form-inline vector-slider-input-boxes">
                          <input type="text"
                              id="cpd-minMaxrateSliderTxt"
                              title="min maxrate slider"
                              onfocus="this.value=''"
                              class="cpd-maxrate-item form-control">
                          <div class="col-5">
                            <div id="slider-maxrate-range" style="border:2px solid black"></div>
		            <div id="min-maxrate-slider-handle" class="ui-slider-handle"></div>
		            <div id="max-maxrate-slider-handle" class="ui-slider-handle"></div>
                          </div>
                          <input type="text"
                              id="cpd-maxMaxrateSliderTxt"
                              title="max maxrate slider"
                              onfocus="this.value=''"
                              class="cpd-maxrate-item form-control">
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div> <!-- SLIPRATE option expand -->
         </div> <!-- cpd-sliprate-search-control -->

        </div> <!-- top-control-row-1 -->

<!-- top-control-row 2 -->
        <div id="top-control-row-2" class="row justify-content-end mb-1">

          <div id='model-options' class="form-check-inline">
            <div class="form-check form-check-inline">
                <label class='form-check-label ml-1 mini-option'
                               for="cpd-model-cfm">
                <input class='form-check-inline mr-1'
                               type="checkbox"
			       id="cpd-model-cfm" value="1" />CFM6.0
                </label>
            </div>
            <div class="form-check form-check-inline">
                <label class='form-check-label ml-1 mini-option'
                               for="cpd-model-gfm">
                <input class='form-check-inline mr-1'
                               type="checkbox"
			       id="cpd-model-gfm" value="1" />GFM
                </label>
            </div>
          </div>

<!-- KML/KMZ overlay -->
          <div id="kml-row" class="col-2 custom-control-inline">
             <input id="fileKML" type='file' multiple onchange='uploadKMLFile(this.files)' style='display:none;'></input>
             <button id="kmlBtn" class="btn"
                      onclick='javascript:document.getElementById("fileKML").click();'
                      title="Upload your own kml/kmz file to be displayed on the map interface. We currently support points, lines, paths, polygons, and image overlays (kmz only)."
                      style="color:#395057;background-color:#f2f2f2;border:1px solid #ced4da;border-radius:0.2rem;padding:0.15rem 0.5rem;"><span>Upload kml/kmz</span></button>
             <button id="kmlSelectBtn" class="btn cxm-small-no-btn"
                      title="Show/Hide uploaded kml/kmz files"
                      style="display:none;" data-toggle="modal" data-target="#modalkmlselect">
                      <span id="eye_kml"  class="glyphicon glyphicon-eye-open"></span></button>
          </div> <!-- kml-row -->

          <div class="input-group input-group-sm custom-control-inline" id="map-controls" style="margin-right:15px">
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
        </div> <!-- top-control-row-2 -->

      </div> <!-- cpd-controls-container -->
    </div> <!-- top-control -->

<!-- map space -->
    <div id="mapDataBig" class="row mapData">
      <div id="infoData" class="col-5 button-container d-flex flex-column pr-0" style="overflow:hidden">
	<div id="searchResult" style="overflow:hidden; display:" class="mb-1">
          <div id="result-table-container" style="border:solid 1px #ced4da;overflow-x:hidden">
            <table id="result-table">
              <thead>
              </thead>
            </table>
          </div> 
        </div>
        <div id="phpResponseTxt"></div>
      </div>

      <div id="top-map" class="col-7 pl-1">
        <div class="w-100 mb-1" id='CPD_plot'
             style="position:relative;border:solid 1px #ced4da; height:576px;">
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

    <div id="top-select" class="row mb-2">
      <div class="col-12">
         <div id="metadata-table-container" style="border:solid 1px #ced4da;overflow-x:hidden">
            <table id="metadata-table">
              <thead>
              </thead>    
              <tbody>
                <tr id="placeholder-row">
                  <td colspan="10">Metadata for selected sites will appear here. </td>
                </tr>
            </table>
         </div>
      </div>
    </div> <!-- top-select -->

</div> <!-- main -->

<div id="plot-range-key-container" style="display:none;">
    <div id="plot-range-key" class="row" style="opacity:0.8">
        <div class="col" style="width:110px;height:24px;">
           <span class="min" style="width:1rem"></span>
           <span class="ui-slider-range" style="border:1px solid grey; width:60px;height:20px;"></span>
           <span class="max"></span>
        </div>
    </div>
</div>

<!-- modal list -->
<!--Modal: Model (modalkmlselect) -->
<div class="modal" id="modalkmlselect" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-small" id="modalkmlselectDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalkmlselectContent">
      <!--Body-->
      <div class="modal-body" id="modalkmlselectBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="kmlselectTable-container" style="font-size:14pt"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal">Close</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalkmlselect-->

<!--call php directly-->
    <script type="text/javascript">
            cpd_sliprate_site_data = <?php print $cpd_sliprate->getAllStationData()->outputJSON(); ?>;
    </script>
</body>
</html>


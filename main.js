$(document).ready(function () {
    var format = "image/png";
    var bounds = [529328.625,2274006.0,605704.0,2364945.75];

    // Initialize WMS layers from GeoServer
    var uybanhcLayer = createLayer('HaNoi:uybanhc');
    var ranhGioiTinhLayer = createLayer('HaNoi:ranh gioi tinh');
    var ranhGioiHuyenLayer = createLayer('HaNoi:ranh gioi huyen');
    var diaPhanLayer = createLayer('HaNoi:diaphan');

    function createLayer(layerName){
        return new ol.layer.Image({
            source: new ol.source.ImageWMS({
                ratio: 1,
                url: "http://localhost:8082/geoserver/HaNoi/wms",
                params: {'FORMAT': format, 'VERSION': '1.1.0', 'LAYERS': layerName}
            }),
            visible: true
        });
    }

    var projection = new ol.proj.Projection({
        code: 'EPSG:3405',
        units: 'm',
        axisOrientation: 'neu',
        extent: bounds
    });

    var view = new ol.View({
        projection: projection,
        center: ol.extent.getCenter(bounds),
        zoom: 16.5,
        rotation: 0
    });

    var map = new ol.Map({
        target: 'map',
        layers: [ranhGioiTinhLayer, ranhGioiHuyenLayer, diaPhanLayer, uybanhcLayer],
        view: view
    });

    map.getView().fit(bounds, map.getSize());

          // Thiết lập điều khiển layer
    setupLayerToggle('uybanhc', uybanhcLayer);
    setupLayerToggle('ranhgioitinh', ranhGioiTinhLayer);
    setupLayerToggle('diaphan', diaPhanLayer);
    setupLayerToggle('ranhgioihuyen', ranhGioiHuyenLayer);

  
    function setupLayerToggle(layerId, layer){
        document.getElementById(layerId).addEventListener('change', function(){
            layer.setVisible(this.checked);
        });
    }

    // Layer for highlighting
    var highlightLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 0, 0.5)' // Highlight màu vàng trong suốt
            }),
            stroke: new ol.style.Stroke({
                color: 'yellow',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({ color: 'yellow' })
            })
        })
    });
    map.addLayer(highlightLayer);

    // Single click event for both highlight and popup
    map.on('singleclick', function (evt) {
        var viewResolution = map.getView().getResolution();
        var source = diaPhanLayer.getSource();
        var url = source.getFeatureInfoUrl(
            evt.coordinate, viewResolution, map.getView().getProjection(), {
                'INFO_FORMAT': 'application/json',
                'FEATURE_COUNT': 50
            }
        );

        if (url) {
            $.getJSON(url, function (data) {
                // Highlight feature
                var vectorSource = new ol.source.Vector({
                    features: new ol.format.GeoJSON().readFeatures(data)
                });
                highlightLayer.setSource(vectorSource);

                // Show popup content
                displayFeatureInfo(data, evt.coordinate);
            }).fail(function () {
                console.error("Error fetching data from GeoServer.");
            });
        }
    });

    function displayFeatureInfo(data, coordinate) {
        var content = "<table>";
        data.features.forEach(function (feature) {
            var props = feature.properties;
            content += `<tr>
            <td>Huyện: ${props['tenhc']}</td>
            <td>Diện tích: ${props['dientich']}</td>
            <td>Số dân: ${props['sodan']}</td>
            </tr>`;
        });
        content += "</table>";
        $("#popup-content").html(content);

        // Update popup position
        overlay.setPosition(coordinate);
    }

    var overlay = new ol.Overlay({
        element: document.getElementById('popup'),
        autoPan: true,
        autoPanAnimation: { duration: 250 }
    });
    map.addOverlay(overlay);

    // Close popup functionality
    document.getElementById('popup-closer').onclick = function () {
        overlay.setPosition(undefined);
        return false;
    };

    // Highlight and zoom on button click
    window.moveMap = function (x, y) {
        // Xóa các highlight cũ
        highlightLayer.getSource().clear();
    
        // Chuyển đổi tọa độ sang hệ tọa độ bản đồ
        let coordinate = ol.proj.transform([x, y], 'EPSG:4326', projection);
    
        // Gửi request lấy thông tin đối tượng từ GeoServer
        let viewResolution = map.getView().getResolution();
        let source = diaPhanLayer.getSource();
        let url = source.getFeatureInfoUrl(
            coordinate, viewResolution, map.getView().getProjection(), {
                'INFO_FORMAT': 'application/json',
                'FEATURE_COUNT': 50
            }
        );
    
        if (url) {
            $.getJSON(url, function (data) {
                // Highlight đối tượng
                let vectorSource = new ol.source.Vector({
                    features: new ol.format.GeoJSON().readFeatures(data)
                });
                highlightLayer.setSource(vectorSource);
    
                // Hiển thị popup thông tin
                displayFeatureInfo(data, coordinate);
            }).fail(function () {
                console.error("Error fetching data from GeoServer.");
            });
        }
    
        // Phóng to vị trí
        let view = map.getView();
        let currentZoom = view.getZoom();
    
        view.animate({
            center: coordinate,
            zoom: Math.min(currentZoom + 2, 20), // Tăng zoom
            duration: 1000 // Thời gian zoom
        });
    };
    
});

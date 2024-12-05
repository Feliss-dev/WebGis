<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="main.css">
    <link rel="stylesheet" href="ol.css">

    <!-- jQuery Library -->
    <script src="jquery.min.js"></script>

    <!-- OpenLayers Library -->
    <script src="ol.js"></script>

    <title>Interactive Map</title>
</head>

<body>
    <div id="container">

        <div class="intro">
            <!-- Intro -->
            <h3>WebGis - Interactive Map</h3>

            <!-- Search Form -->
            <form action="" name="search-form">
                <input type="text" size="30" onkeyup="showResult(this.value)" placeholder="Tìm kiếm...">
                <div id="livesearch" style="position: absolute; background-color: white; border: 1px solid #ddd; z-index: 1000; max-height: 200px; overflow-y: auto;"></div>
            </form>
        </div>





        <!-- Thêm nút quay lại vị trí ban đầu -->
        <button onclick="window.location.reload();" style="margin-top: 10px; padding: 8px 12px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Quay lại vị trí ban đầu
        </button>

        <p><strong>Họ và tên:</strong> <span>Hoàng Minh Thành</span></p>






        <!-- Map and Controls -->
        <div class="map-container">
            <div id="map" class="map"></div>

            <!-- Legend and Layer Control -->
            <div>


                <div id="layer-control">
                    <h3>Layer Control</h3>
                    <label><input type="checkbox" id="uybanhc" checked> UBND Hà Nội</label><br>
                    <label><input type="checkbox" id="ranhgioitinh" checked> Ranh Giới Tỉnh</label><br>
                    <label><input type="checkbox" id="diaphan" checked> Địa Phận</label><br>
                    <label><input type="checkbox" id="ranhgioihuyen" checked> Ranh Giới Huyện</label><br>
                    <img src="http://localhost:8082/geoserver/HaNoi/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=HaNoi:HaNoi&format=image/png&width=20&height=20" alt="">
                </div>


            </div>
        </div>

        <!-- Popup -->
        <div id="popup" class="ol-popup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content"></div>
        </div>
    </div>

    <!-- JavaScript Files -->
    <script src="main.js"></script>
    <script src="search.js"></script>
</body>

</html>
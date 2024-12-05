<?php
include 'connection.php';

// Ensure $connection is a valid PgSql\Connection resource
if (!$conn) {
    die("Connection failed: " . pg_last_error());
}

if (isset($_GET['area_name'])) {
    $area_name = strtolower($_GET['area_name']);

    $query = "SELECT *, st_x(ST_Centroid(geom)) as x, st_y(ST_Centroid(geom)) as y FROM public.diaphan WHERE LOWER(tenhc) LIKE '%$area_name%'";
    $result = pg_query($conn, $query);

    if (!$result) {
        die("Query failed: " . pg_last_error($conn));
    }

    if (pg_num_rows($result) > 0) {
        while ($row = pg_fetch_row($result, null, PGSQL_ASSOC)) {
            $x = $row["x"];
            $y = $row["y"];

            $link = "<a href='#' onclick='window.moveMap($x, $y); return false;' class='link-redirect'>Here</a>";

            print("<div class='data-row'>
            <span class='label'>Tên huyện:</span> <span class='value'>" . $row['tenhc'] . "</span> |
            <span class='label'>Diện tích:</span> <span class='value'>" . $row['dientich'] . " km²</span> |
            <span class='label'>Số dân:</span> <span class='value'>" . $row['sodan'] . "</span> |
            <span class='link'>" . $link . "</span>
        </div>");
        
        }
    } else {
        print("NOT FOUND");
    }
} else {
    print("NOT FOUND");
}

pg_close($conn);

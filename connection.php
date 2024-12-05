<?php
define('PG_DB', 'HaNoi');
define('PG_HOST', 'localhost');
define('PG_USER', 'postgres');
define('PG_PORT', '5432');
define('PG_PASS', 'ndc132');

$conn = pg_connect("host=".PG_HOST." dbname=".PG_DB." user=".PG_USER." password=".PG_PASS." port=".PG_PORT)
    or die("Không thể kết nối đến cơ sở dữ liệu.");
?>

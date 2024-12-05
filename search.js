function showResult(str) {
    if(str.length === 0){
        let livesearch = document.getElementById("livesearch");

        livesearch.innerHTML = "";
        livesearch.style.border = "0px";

        return;
    }

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let livesearch = document.getElementById("livesearch");

            livesearch.innerHTML = this.responseText;
            livesearch.style.border = "1px solid #A5ACB2";
        }
    };
    xmlhttp.open("GET", "live_search.php?area_name=" + str, true);
    xmlhttp.send();
}
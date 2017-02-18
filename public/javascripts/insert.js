xhr('POST', '/bible/listall', '', function (response) {
    var json = JSON.parse(response);
    var bibleName = document.getElementById('bibleName')
    bibleName.innerHTML = '';
    json.map(function (value, index) {
        bibleName.innerHTML += '<option value="' + value.ChSimple + '">' + value.Ch + '</option>';
    })
});

document.getElementById('bibleName').addEventListener('change', function () {
    var chapter = document.getElementById('chapter');
    var chapter2 = document.getElementById('chapter2');
    chapter.innerHTML = '';
    chapter2.innerHTML = '';
    xhr('POST', '/bible/listall', 'name=' + this.value, function (response) {
        var json = JSON.parse(response);
        var array = listNum(json[document.getElementById('bibleName').selectedIndex].cnum);
        array.map(function (value, index) {
            chapter.innerHTML += '<option>' + value + '</option>';
            chapter2.innerHTML += '<option>' + value + '</option>';
        });
    })
})

function xhr(method, url, data, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) callback(this.responseText);
    }

    xhttp.open(method, url, true);
    if (method === 'POST') xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(data);
}

function listNum(integer) {
    var data = [];
    for (var i = 0; i < integer; i++) data.push(i + 1);
    return data;
}
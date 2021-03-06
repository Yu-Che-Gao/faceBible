document.getElementById('uploadBtn').addEventListener('change', function () {
    previewImg();
})

xhr('POST', '/bible/listall', '', function (response) {
    var json = JSON.parse(response);
    var bibleName = document.getElementById('bibleName');
    var bibleName2 = document.getElementById('bibleName2');
    bibleName.innerHTML = '';
    json.map(function (value, index) {
        bibleName.innerHTML += '<option value="' + value.ChSimple + '">' + value.Ch + '</option>';
        bibleName2.innerHTML += '<option value="' + value.ChSimple + '">' + value.Ch + '</option>';
    })
});

document.getElementById('bibleName').addEventListener('change', function () {
    waitingDialog.show('waiting');
    var chapter = document.getElementById('chapter');
    chapter.innerHTML = '';
    listChapter(this.value, function (array) {
        array.map(function (value, index) { chapter.innerHTML += '<option>' + value + '</option>'; });
        waitingDialog.hide();
    });

    listSection(this.value, 1, function (array) {
        array.map(function (value, index) { section.innerHTML += '<option>' + value + '</option>'; });
    });
});

document.getElementById('bibleName2').addEventListener('change', function () {
    waitingDialog.show('waiting');
    var chapter2 = document.getElementById('chapter2');
    chapter2.innerHTML = '';
    listChapter(this.value, function (array) {
        array.map(function (value, index) { chapter2.innerHTML += '<option>' + value + '</option>'; });
        waitingDialog.hide();
    });

    listSection(this.value, 1, function (array) {
        array.map(function (value, index) { section2.innerHTML += '<option>' + value + '</option>'; });
    });
});

document.getElementById('chapter').addEventListener('change', function () {
    waitingDialog.show('waiting');
    var section = document.getElementById('section');
    section.innerHTML = '';
    listSection(document.getElementById('bibleName').value, this.value, function (array) {
        array.map(function (value, index) {
            section.innerHTML += '<option>' + value + '</option>';
        });
        waitingDialog.hide();
    });
})

document.getElementById('chapter2').addEventListener('change', function () {
    waitingDialog.show('waiting');
    var section2 = document.getElementById('section2');
    section2.innerHTML = '';
    listSection(document.getElementById('bibleName2').value, this.value, function (array) {
        array.map(function (value, index) {
            section2.innerHTML += '<option>' + value + '</option>';
        });
        waitingDialog.hide();
    });

})

document.getElementById('sendBtn').addEventListener('click', function () {
    waitingDialog.show('waiting');
    var bibleName = document.getElementById('bibleName');
    var bibleName2 = document.getElementById('bibleName2');
    var start = bibleName.options[bibleName.selectedIndex].innerHTML + document.getElementById('chapter').value + '章' + document.getElementById('section').value + '節';
    var end = bibleName2.options[bibleName2.selectedIndex].innerHTML + document.getElementById('chapter2').value + '章' + document.getElementById('section2').value + '節';
    var content = document.getElementById('content').value;
    var date = document.getElementById('myDate').value;
    xhr('POST', '/log/insert', 'start=' + start + '&end=' + end + '&content=' + content + '&date=' + date, function (response) {
        if (response === 'success') {
            clearUI();
            waitingDialog.hide();
        }
        else {
            alert('傳輸失敗!');
            waitingDialog.hide();
        }
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

function previewImg() {
    waitingDialog.show('解析中...');
    var preview = document.getElementById('previewImg');
    var file = document.getElementById('uploadBtn').files[0];
    var reader = new FileReader();

    reader.addEventListener('load', function () {
        preview.src = this.result;
        xhr('POST', '/google/image2text', 'image=' + encodeURIComponent(this.result.split('base64,')[1].toString()), function (response) {
            var json = JSON.parse(response);
            document.getElementById('content').innerHTML = json.responses[0].textAnnotations[0].description;
            waitingDialog.hide();
        });
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

function listChapter(name, callback) {
    xhr('POST', '/bible/listall', 'name=' + name, function (response) {
        var json = JSON.parse(response);
        var array = listNum(json[document.getElementById('bibleName').selectedIndex].cnum);
        callback(array);
    })
}

function listSection(name, chap, callback) {
    xhr('POST', '/bible/content', 'name=' + name + '&chap=' + chap, function (response) {
        var json = JSON.parse(response);
        var array = listNum(json.record_count);
        callback(array);
    })
}

function listNum(integer) {
    var data = [];
    for (var i = 0; i < integer; i++) data.push(i + 1);
    return data;
}

function clearUI() {
    document.getElementById('myDate').value = '';
    document.getElementById('content').value = '';
}
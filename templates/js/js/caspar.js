$(function () {
    play(); // For demo purposes
});

var dataCaspar = {};

function update(str) {
    parseCaspar(str);
    dataInsert(dataCaspar);
    if (typeof templatePlay == 'function') {
        templatePlay();
    }
}

function stop() {
    if (typeof templateStop == 'function') {
        templateStop();
    }
}

/* Helpers */

function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}


function parseCaspar(str) {
    var xmlDoc;

    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(str, "text/xml");
    }

    dataCaspar = XML2JSON(xmlDoc.documentElement.childNodes);
}


function XML2JSON(node) {
    var data = {};

    for (var k = 0; k < node.length; k++) {
        var idCaspar = node[k].getAttribute("id");
        var valCaspar = node[k].childNodes[0].getAttribute("value");
        if (idCaspar != undefined && valCaspar != undefined) {
            data[idCaspar] = valCaspar;
        }
    }

    return data;
}

function dataInsert(dataCaspar) {
    for (var idCaspar in dataCaspar) {
        var idTemplate = document.getElementById(idCaspar);
        if (idTemplate != undefined) {
            idTemplate.innerHTML = escapeHtml(dataCaspar[idCaspar]);
        }
    }
}

function play(str) {
    parseCaspar(str);
    dataInsert(dataCaspar);

    if (typeof templatePlay == 'function') {
        templatePlay();
    }
}

//=============================================================================
// tools/renumber.js — Renumera ids secuencialmente (1..N) en el orden actual
// Uso: node tools/renumber.js
// Solo toca los campos "id" de los archivos listados. El engine usa claves,
// no ids, así que es seguro.
//=============================================================================
'use strict';

var fs = require('fs');
var path = require('path');

var PMZ = path.join(__dirname, '..', 'PMZ');
var TARGETS = ['items', 'moves', 'abilities'];

TARGETS.forEach(function(name) {
    var file = path.join(PMZ, name + '.json');
    var data = JSON.parse(fs.readFileSync(file, 'utf8'));
    var keys = Object.keys(data).filter(function(k) {
        return data[k] && typeof data[k] === 'object' && !k.startsWith('_');
    });
    // Ordenar por id actual (estable: empates por clave)
    keys.sort(function(a, b) {
        var ida = data[a].id === undefined ? Infinity : data[a].id;
        var idb = data[b].id === undefined ? Infinity : data[b].id;
        if (ida !== idb) return ida - idb;
        return a < b ? -1 : 1;
    });
    var changed = 0;
    keys.forEach(function(k, i) {
        if (data[k].id !== i + 1) {
            data[k].id = i + 1;
            changed++;
        }
    });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    console.log(name + ': ' + keys.length + ' entradas, ' + changed + ' ids cambiados → secuencial 1-' + keys.length);
});

var delete_check = 0,
    show_anim = 0;
var start_col = 0,
    start_row = 0,
    start_check = 0;
var finish_col = 0,
    finish_row = 0,
    finish_check = 0;
var di = [-1, 1, 0, 0],
    dj = [0, 0, 1, -1];
var colors = ["#ff0000", "ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ee82ee"];
var rainbow_check = 0,
    rnb = 0;
var show_distances = 0;
var down = 0;
var dark_check = 0;
var size_n = 35,
    size_m = 35;
var portal_check = 0,
    portal_col = 0,
    portal_row = 0,
    exit_col = 0,
    exit_row = 0;
class node {
    constructor(x, y, distance) {
        this.x = x;
        this.y = y;
        this.distance = distance;
    }
}
var map = new Array(size_n + 5); // asa fac matrice in js
for (var i = 0; i < map.length; i++) { 
    map[i] = new Array(size_n + 5);
}
for (var i = 0; i <= size_n + 1; i++) { 
    for (var j = 0; j <= size_m + 1; j++) {
        map[i][j] = 0;
    }
}
var reconstruct = new Array(size_n + 5);
for (var i = 0; i < reconstruct.length; i++) { 
    reconstruct[i] = new Array(size_n + 5);
}
var grid = clickableGrid(size_n, size_m, function(el, row, col, i) {
    console.log("You clicked on element:", el);
    console.log("You clicked on row:", row);
    console.log("You clicked on col:", col);
    console.log("You clicked on item #:", i);
    console.log("mouse state", down);
    console.log("rgb state", rainbow_check);
    if (finish_check == 1) {
        finish_col = col + 1;
        finish_row = row + 1;
        el.className = 'finish';
        finish_check = 0;
        document.getElementById("selected").innerHTML = "ai ales finishul";
        return;

    }
    if (start_check == 1) {
        start_col = col + 1;
        start_row = row + 1;
        el.className = 'start';
        start_check = 0;
        document.getElementById("selected").innerHTML = "ai ales sartul";
        return;

    }
    if (portal_check == 1) {
        portal_col = col + 1;
        portal_row = row + 1;
        el.className = 'portal';
        portal_check = 2;
        document.getElementById("selected").innerHTML = "acum alege exitul";
        return;

    }
    if (portal_check == 2) {
        exit_col = col + 1;
        exit_row = row + 1;
        el.className = 'portal';
        portal_check = 0;
        document.getElementById("selected").innerHTML = "ai ales portalul";
        return;

    }
    if (delete_check) { 
        el.style.backgroundColor = "";
        el.className = '';
        reset_sf(row, col); 
        document.getElementById("selected").innerHTML = "Esti pe modul stergere";
        map[row + 1][col + 1] = 0;
    }
    if (!delete_check) { 
        map[row + 1][col + 1] = 1;
        reset_sf(row, col); 
        document.getElementById("selected").innerHTML = "Esti pe modul construire";
        if (rainbow_check) {
            el.className = 'clicked';
            el.style.backgroundColor = colors[rnb % 7];
            rnb++;
        } else
            el.className = 'clicked';
    }
});
document.body.appendChild(grid);
function clickableGrid(rows, cols, callback) {
    var i = 0;
    var grid = document.createElement('table');
    grid.className = 'grid';
    for (var r = 0; r < rows; ++r) {
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c = 0; c < cols; ++c) {
            var cell = tr.appendChild(document.createElement('td'));
            ++i;
            cell.setAttribute("id", i);
            cell.addEventListener('click', function(el, r, c, i) {
                return function() {
                    callback(el, r, c, i);
                }
            }(cell, r, c, i));
            document.addEventListener('mouseup', e => {
                down = 0;

            });
            cell.addEventListener('mousedown', e => {
                if (!start_check && !finish_check) 
                    down = 1;

            });
            cell.addEventListener('mousemove', function(el, r, c, i) {
                return function() {
                    document.addEventListener('mouseup', e => {
                        down = 0;

                    });
                    if (down) {
                        callback(el, r, c, i);
                    }
                }
            }(cell, r, c, i));


        }
    }
    return grid;
}

function reset_sf(row, col) {
    if (row + 1 == start_row && col + 1 == start_col) {
        start_row = 0;
        start_col = 0;
        start_check = 0;
    }
    if (row + 1 == finish_row && col + 1 == finish_col) {
        finish_row = 0;
        finish_col = 0;
        finish_check = 0;
    }
}

function rainbow() {
    rainbow_check = !rainbow_check;
}

function erase() { 
    if (delete_check == 1) { 
        delete_check = 0;
        document.getElementById("selected").innerHTML = "Esti pe modul construire";
    } else {
        delete_check = 1;
        document.getElementById("selected").innerHTML = "Esti pe modul stergere";
    }

}

function start() { 
    if (start_col != 0 && start_row != 0)
        alert("De ce pui mai mult de un start ¿ \n vrei sa-l strici??");
    else {
        start_check = 1;
        document.getElementById("selected").innerHTML = "Esti pe modul select start";
    }
}

function portal() { 
    if (portal_col != 0 && portal_row != 0)
        alert("De ce pui mai mult de un portal ¿ \n vrei sa-l strici??");
    else {
        portal_check = 1;
        document.getElementById("selected").innerHTML = "Esti pe modul select portal";
    }
}

function finish() { 
    if (finish_col != 0 && finish_row != 0)
        alert("De ce pui mai mult de un finish ¿ \n vrei sa-l strici??");
    else {
        finish_check = 1;
        document.getElementById("selected").innerHTML = "Esti pe modul select finish";
    }
}

function convert_to_id(i, j) {
    return i * size_n + j;
}

map[start_row][start_col] = 1;
map[finish_row][finish_col] = 1;

function solve() {
    
    if ((start_row == 0 && start_col == 0) || (finish_row == 0 && finish_col == 0)) {
        alert("labirintul nu este complet") 
        return;
    }
    var queue = [];
    [start_col, finish_col] = [finish_col, start_col]; 
    [start_row, finish_row] = [finish_row, start_row];
    var x = new node(start_row, start_col, 2);
    queue.push(x);
    var urgenta = 0;
    while (queue.length) {
        urgenta++;
        if (urgenta > 100000)
            break;
        var i = queue[queue.length - 1].x; 
        var j = queue[queue.length - 1].y;
        console.log(i, j);
        if (i == finish_row && j == finish_col) {
            break; 
        }
        var dist = queue[queue.length - 1].distance;

        if (show_distances) { 
            var el = document.getElementById((i - 1) * size_n + j);
            el.innerHTML = dist - 2;
        }
        map[i][j] = dist;
        queue.pop();
        for (var t = 0; t < 4; t++) {
            var i2 = i + di[t];
            var j2 = j + dj[t];
            if (i2 >= 0 && j2 >= 0 && i2 < size_n + 1 && j2 < size_m + 1 && map[i2][j2] == 0) {
                map[i2][j2] = dist + 1;
                x = new node(i, j, 0)
                reconstruct[i2][j2] = x;
                x = new node(i2, j2, dist + 1);
                queue.unshift(x);
            }
        }
    }
    if (reconstruct[finish_row][finish_col] == null) 
        alert("nu e drum");
    a = reconstruct[finish_row][finish_col].x, b = reconstruct[finish_row][finish_col].y;

    while (a != start_row || b != start_col) {
        var el = document.getElementById((a - 1) * size_n + b);
        animate(el);
        if (show_anim)
            for (var i = 1; i <= 100000000; i++)
        ; //simulate wait function 
        var aaux = reconstruct[a][b].x;
        var baux = reconstruct[a][b].y;
        a = aaux;
        b = baux;
    }
    [start_col, finish_col] = [finish_col, start_col];
    [start_row, finish_row] = [finish_row, start_row];
}

function animate(el) {
    if (show_anim)
        var timer = setInterval(frame, 1000);
    else
        var timer = setInterval(frame, 0);

    function frame() {
        el.className = 'path';
        clearInterval(timer);
    }
}

function clean() {
    for (var i = 0; i <= size_n; i++)
        for (var j = 0; j <= size_m; j++) {
            map[i][j] = 0;
        }
    for (var i = 1; i <= size_n * size_m; i++) {
        var el = document.getElementById(i); 
        el.style.backgroundColor = ""; 
        el.className = '';
    }
    start_row = 0, start_col = 0, finish_col = 0, finish_row = 0, start_check = 0, finish_check = 0; //reset other variables
}

function dark_mode() {
    var el = document.body;
    el.classList.toggle("dark-mode");
}
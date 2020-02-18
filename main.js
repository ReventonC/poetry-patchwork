var poemText
var poemWords
var poemPrs = [[]]

$(document).ready(() => {
    $("#poemsubmit").click(function (e) {
        e.preventDefault()
        poemText = $("#poementry").val()
        poemWords = poemText.split(/\r?\n/)
        for (var i = 0; i < poemWords.length; i++) {
            poemWords[i] = poemWords[i].split(/ +/);
        }
        //console.log(poemWords)

        drawPoem();
    });
})


function drawPoem() {
    //console.log($("#patchwork")[0])

    ctx = $("#patchwork")[0].getContext("2d")
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //console.log(ctx)

    poemPrs = [[]]
    const getPrsPromise = new Promise(function (resolve, reject) {
        for (var i = 0; i < poemWords.length; i++) {
            // go through each word
            ((i) => {
                for (var j = 0; j < poemWords[i].length; j++) {
                    //console.log(poemWords[i][j] + " " +  i + " " + j)
                    ((i, j) => {
                        $.ajax({
                            url: 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + poemWords[i][j] + '?key=7dc81562-f7c1-4b89-bf78-94e620647001',
                            method: "GET"
                        }).done(function (response) {
                            //console.log(response);
                            var mw
                            try {
                                mw = response[0].hwi.prs[0].mw
                            }
                            catch (err) {
                                //console.log("Word not found.")
                                //mw = "404"
                                mw = ""
                            }
                            //console.log(i+"  "+j+"  "+mw);
                            
                            if (!poemPrs[i]) poemPrs[i] = [];
                            poemPrs[i][j] = mw;
                            //console.log(mw)
                            if ((j == (poemWords[poemWords.length-1].length)-1) && (i == (poemWords.length-1))) {
                                resolve();
                            }
                        });
                    })(i, j)
                }
            })(i)
        }
    })
    getPrsPromise.then(() => {
        console.log(poemPrs);
        $("#test").append(poemPrs[0][0])
        drawQuilt();
    })
}

function drawQuilt() {
    // go through each line
    for (var i = 0; i < poemPrs.length; i++) {
        var blockNum = 0;
        // go through each word
        for (var j = 0; j < poemPrs[i].length; j++) {
            // go through each syllable
            for (var k = 0; k < poemPrs[i][j].length; k++) {
                var rot = 0;
                // TODO: Is this syllable stressed or unstressed?

                if (poemPrs[i][j][k][0] == '\u02c8')
                    rot = 1;
                // draw each syllable as an HST
                drawHST(blockNum, i, rot);
                blockNum++;

            }
        }
    }
}
var blockWidth = 25;
var margin = 10;


function drawHST(x, y, rot) {
    // draw the top left part of the HST
    x = x * blockWidth;
    y = y * blockWidth;

    if (rot == 1) {
        // stressed
        // draw top left part of HST black
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(margin + x, margin + y);
        ctx.lineTo(margin + x + blockWidth, margin + y);
        ctx.lineTo(margin + x, margin + y + blockWidth);
        ctx.closePath();
        ctx.fill();

        // draw the bottom right part of the HST - white
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(margin + x + blockWidth, margin + y);
        ctx.lineTo(margin + x + blockWidth, margin + y + blockWidth);
        ctx.lineTo(margin + x, margin + y + blockWidth);
        ctx.closePath();
        ctx.fill();

    } else if (rot == 0) {
        // unstressed
        // draw bottom left part of HST
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(margin + x, margin + y);
        ctx.lineTo(margin + x + blockWidth, margin + y + blockWidth);
        ctx.lineTo(margin + x, margin + y + blockWidth);
        ctx.closePath();
        ctx.fill();

        // draw the top right part of the HST
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(margin + x, margin + y);
        ctx.lineTo(margin + x + blockWidth, margin + y);
        ctx.lineTo(margin + x + blockWidth, margin + y + blockWidth);
        ctx.closePath();
        ctx.fill();
    }
}
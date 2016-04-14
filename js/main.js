console.info('updated');
(function(pub, $, undefined) {
    "use strict";
    // default values
    window.onload = function() {
        pub.updateWrap();
    };


    pub.updateWrap = function() {
        var f = dataWrapForm(); //check form
          console.info(f.canvasX, f.canvasY);
        
        draw(f.imageId, f.nodesX, f.nodesY, f.text); //draw new image
    };

    // gets data from wrapper Form
    function dataWrapForm() {
        var f = {};
        f.nodesX = +document.getElementById('nodesX').value;
        f.nodesY = +document.getElementById('nodesY').value;

        var wrapper = document.getElementById('nodeWrapper');
        wrapper.style.width = document.getElementById('wrapperX').value + "px";
        wrapper.style.height = document.getElementById('wrapperY').value + "px";

        f.text = document.getElementById('text').value;
        f.radios = document.getElementsByClassName('imgRadio');

        for (var i = 0; i < f.radios.length; i++) {
            if (f.radios[i].type === 'radio' && f.radios[i].checked) {
                // get value, set checked flag or do whatever you need to
                f.image = f.radios[i].value;
            }
        }

        //canvas
        f.canvasX = +document.getElementById('canvasX').value;
        f.canvasY = +document.getElementById('canvasY').value;

        console.log(f);
        console.log(f.canvasX);
        return { imageId: f.image, nodesX: f.nodesX, nodesY: f.nodesY, text: f.text, canvasX: f.canvasX, canvasY: f.canvasY };
    }




    // create canvas
    function renewCanvas(x, y) {
        var wrapperCv = document.getElementById("canvasWp");
        var oldCv = document.getElementById("myCanvas");

        // new canvas
        var canvas = document.createElement('canvas');
        canvas.id = "myCanvas";
        canvas.width = x;
        canvas.height = y;

        wrapperCv.removeChild(oldCv);
        wrapperCv.appendChild(canvas);

    }


    /* draws the image using nodes
     *  - nodesX / nodesY   are the amount of nodes to display
     *  - inNode will be printed inside the node (string)
     */
    function draw(imageId, jumpX, jumpY, inNode) {
        if (jumpX < 1 || isNaN(jumpX)) jumpX = 1;
        if (jumpY < 1 || isNaN(jumpY)) jumpY = 1;

        // image to use
        var img = document.getElementById(imageId);

        // canvas of the same size of image
        renewCanvas(img.width, img.height);

        // canvas (origin) and wrapper (HTML node wrapper)
        var canvas = document.getElementById('myCanvas');
        var nodeWrap = document.getElementById('nodeWwrapper');
        



        // draw img in canvas (getPixelColor gets info from it)
        var ctx = canvas.getContext("2d");
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        /*  bucle to set structure 
         *  for better performance setted all up in an array and appended afterwards
         */
        var structure = "<ul id='mainVerticalUl'>";

        // double loop
        var x, y;
        var nodeX = 0;
        var nodeY = 0;

        //ROWS
        for (y = 0; y < canvasHeight; y += jumpY, nodeY++) {
            structure += "<ul class='row" + nodeY + "'>  ";
            // COLUMNS
            nodeX = 0; //restart X
            for (x = 0; x < canvasWidth; x += jumpX, nodeX++) {
                structure += "<li id='li:" + nodeX + "." + nodeY +
                    "'' style='background:rgba(" +
                    getPixelColor(canvas, x, y) +
                    ");'>" + inNode + "</li>";
            }
            structure += " </ul>";
        }
        structure += "</ul>";

        nodeWrap.innerHTML = structure;
    } // \draw function

    function getPixelColor(canvas, x, y) {
        var pixel = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
        pixel[3] = pixel[3] / 250; // rgba opacity value <1
        return pixel;
    }



})(pub = window.pub || {}, jQuery);

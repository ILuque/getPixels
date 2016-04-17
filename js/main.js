/*  Iker Luque  - getPixels 
 *   Draw an image on a canvas. Later read pixel content of that image. Finally creates an image using HTML nodes
 *    Canvas is drawn on the fly as it needs to resize to the original image size
 *    Note user can choose if algorithm will read all pixels one by one, or just read one of x pixels.
 */



(function(pub, $, undefined) {
    "use strict";

    // uses default values at form
    window.onload = function() {
        pub.updateWrap();
    };


    pub.updateWrap = function() {
        var f = dataWrapForm(); //check form        
        draw(f.imageId, f.nodesX, f.nodesY, f.text, f.type); //draw new image
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
        f.radiosOrigin = document.getElementsByClassName('imgRadio');

        for (var i = 0; i < f.radiosOrigin.length; i++) {
            if (f.radiosOrigin[i].type === 'radio' && f.radiosOrigin[i].checked) {
                // get value, set checked flag or do whatever you need to
                f.image = f.radiosOrigin[i].value;
            }
        }
        f.radiosType = document.getElementsByClassName('typeRadio');

        for (i = 0; i < f.radiosType.length; i++) {
            if (f.radiosType[i].type === 'radio' && f.radiosType[i].checked) {
                // get value, set checked flag or do whatever you need to
                f.type = f.radiosType[i].value;
            }
        }

        /* ########################### */
        console.log(f);

        return { imageId: f.image, nodesX: f.nodesX, nodesY: f.nodesY, text: f.text, type: f.type };

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
     *  -  jumpX and jumpY are the multiple. It will read 1 in X pixels of the original image.
     */
    function draw(imageId, jumpX, jumpY, inNode, type) {
        if (jumpX < 1 || isNaN(jumpX)) jumpX = 1;
        if (jumpY < 1 || isNaN(jumpY)) jumpY = 1;

        // image to use
        var img = document.getElementById(imageId);

        // canvas of the same size of image
        renewCanvas(img.width, img.height);

        // canvas (origin) and wrapper (HTML node wrapper)
        var canvas = document.getElementById('myCanvas');
        var nodeWrap = document.getElementById('nodeWrapper');




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
            structure += "<ul class='row" + nodeY + " " + evenOddRow(y) + "'>  ";
            // COLUMNS
            nodeX = 0; //restart X
            for (x = 0; x < canvasWidth; x += jumpX, nodeX++) {
                switch (type) {

                    case "plain":
                        /*pain*/
                        structure += "<li id='li:" + nodeX + "." + nodeY +
                            "'' style='background:rgba(" +
                            getPixelColor(canvas, x, y) +
                            ");'>" + inNode + "</li>";
                        break;
                    case "hex":
                        /*  hexagon structure */
                        structure += '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="27"><a xlink:href="http://luquemichel.com"><polygon points="11 1.5 21.8 7.8 21.8 20.3 11 26.5 0.2 20.3 0.2 7.8" style="fill:rgba(' + getPixelColor(canvas, x, y) + ');stroke:blue"/></a></svg>';
                        break;
                    default:
                        throw " type of node  not defined. @switch in draw function";
                        //break; //unreachable break after 'throw'
                }



            }
            structure += " </ul>";
        }
        structure += "</ul>";

        nodeWrap.innerHTML = structure;
        pub.structure = structure; //object fot the user
    } // \draw function

    function evenOddRow(y) {
        if (y % 2 === 0) {
            return "evenRow" ;
        } else {
            return "oddRow" ;
        }
    }

    function getPixelColor(canvas, x, y) {
        var pixel = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
        pixel[3] = pixel[3] / 250; // rgba opacity value <1
        return pixel;
    }



})(pub = window.pub || {}, jQuery);

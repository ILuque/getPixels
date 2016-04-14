console.info('updated');
(function(pub, $, undefined) { 
    "use strict";
    // default values
    window.onload = function() {
        pub.updateWrap();
    };

    pub.updateWrap = function() {
        var d = dataWrapForm();
        draw(d.imageId, d.nodesX, d.nodesY, d.text);
    };
    // gets data from wrapper Form
    function dataWrapForm() {
        var form = {};
        form.nodesX = document.getElementById('nodesX').value;
        form.nodesY = document.getElementById('nodesY').value;

        var wrapper = document.getElementById('wrapper');
        wrapper.style.width = document.getElementById('wrapperX').value + "px";
        wrapper.style.height = document.getElementById('wrapperY').value + "px";

        form.text = document.getElementById('text').value;
        form.radios = document.getElementsByClassName('imgRadio');

        for (var i = 0; i < form.radios.length; i++) {
            if (form.radios[i].type === 'radio' && form.radios[i].checked) {
                // get value, set checked flag or do whatever you need to
                form.image = form.radios[i].value;
            }
        }
        console.log(form);
        return { imageId: form.image, nodesX: form.nodesX, nodesY: form.nodesY, text: form.text };
    }


    //Canvas in variables


    /* draws the image using nodes
     **  nodesX / nodesY   are the amount of nodes to display
     **  inNode is what is inside the node (string)
     */
    function draw(imageId, nodesX, nodesY, inNode) {
        var canvas = document.getElementById('myCanvas');
        var wrapper = document.getElementById('wrapper');
        var img = document.getElementById(imageId);

        // draw img in canvas (getPixelColor gets info from it)
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);

        /*  bucle to set structure 
         ** for better performance setted all up in an array and appended afterwards
         */
        var structure = "<ul id='mainVerticalUl'>";

        // double loop
        var x, y;
        for (y = 0; y < nodesY; y++) {
            structure += "<ul class='row" + y + "'>  ";
            for (x = 0; x < nodesX; x++) {
                structure += "<li id='li:" + x + "." + y +
                    "'' style='background:rgba(" +
                    getPixelColor(canvas, x * 3, y * 3) +
                    ");'>" + inNode + "</li>";
            }
            structure += " </ul>";
        }
        structure += "</ul>";

        wrapper.innerHTML = structure;
    } // \draw function

    function getPixelColor(canvas, x, y) {
        var pixel = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
        pixel[3] = pixel[3] / 250; // rgba opacity value <1
        return pixel;
    }



})(pub = window.pub || {}, jQuery);

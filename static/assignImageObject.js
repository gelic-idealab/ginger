var current={};
var listOfFiles = {};
function loadImages(numberOfRows,numberOfColumns,fileLocation,image_type, is_file_ready, downloaded_file_location) {
        var numberOfRows = numberOfRows;
        //{{numberOfRows}};
        var numberOfColumns = numberOfColumns;
        //{{numberOfCol}};
        var fileLocation = fileLocation;
        //{{path|tojson}};
        var image_type = image_type;

        console.log(numberOfRows + " " + numberOfColumns + " " + fileLocation + " " + image_type);

        var img, right, left, forward, backward, row_num, col_num;

        for (var i = 1; i <= numberOfColumns; i++) {
            for (j = 1; j <= numberOfRows; j++) {
                listOfFiles[j + '_' + i] = {};
            }
        }

        for (var i = 1; i <= numberOfColumns; i++) {
            for (j = 1; j <= numberOfRows; j++) {
                img = fileLocation + "/" + j + "_" + i + "." + image_type;
                if (i == 1) {
                    backward = null;
                } else {
                    col_num = i - 1;
                    backward = j + '_' + col_num;
                }
                if (i == numberOfColumns) {
                    forward = null;
                } else {
                    col_num = i + 1;
                    forward = j + '_' + col_num;
                }
                if (j == 1) {
                    left = null;
                } else {
                    row_num = j - 1;
                    left = row_num + '_' + i;
                }
                if (j == numberOfRows) {
                    right = null
                } else {
                    row_num = j + 1;
                    right = row_num + '_' + i;
                }
                var img_html = "<img id='"+j+"_"+i+"' alt='"+j+"_"+i+"' crossorigin='anonymous' src ="+ img +">"
                $('#preloaded').append(img_html) 
                listOfFiles[j + '_' + i] = {img: img, left: left, right: right, backward: backward, forward: forward};
            }
        }
        console.log(listOfFiles);

        var start = listOfFiles['1_1'];
        current = start;

        document.getElementById('this-image').src = start.img;

        if(is_file_ready=='Yes') {
            window.location = downloaded_file_location;
            setTimeout(function () {
                window.location = $('a#redirect_home').attr('href');
            }, 5000);


        }
    }

var current={};
var listOfFiles = {};
function loadImages(numberOfRows,numberOfColumns,fileLocation,image_type) {
        var numberOfRows = numberOfRows;
        var numberOfColumns = numberOfColumns;
        var fileLocation = fileLocation;
        var image_type = image_type;

        var img, right, left, forward, backward, row_num, col_num;

        for (var i = 1; i <= numberOfColumns; i++) {
            for (j = 1; j <= numberOfRows; j++) {
                listOfFiles[j + '_' + i] = {};
            }
        }

        for (var i = 1; i <= numberOfColumns; i++) {
            for (j = 1; j <= numberOfRows; j++) {
                img = fileLocation + j + "_" + i + image_type;
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
                listOfFiles[j + '_' + i] = {img: img, here: j + '_' + i, left: left, right: right, backward: backward, forward: forward};
            }
        }

        var node = config.start.node;
        var start = listOfFiles[node];
        current = start;
        
        applyOrientation(node);
        renderAnnontations(node);

        document.getElementById('this-image').src = start.img;

    }

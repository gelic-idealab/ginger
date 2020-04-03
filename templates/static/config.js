var config = {
    "annotations": {
        "1_1": [
            {
                "type": "text",
                "value": "THIS IS A TEST",
                "width": 10,
                "height": 10,
                "color": "red",
                "xoffset": 0,
                "yoffset": 0,
                "zoffset": -2
            },
            {
                "type": "text",
                "value": "THIS IS ALSO A TEST",
                "width": 10,
                "height": 10,
                "color": "blue",
                "xoffset": 0,
                "yoffset": 0,
                "zoffset": -10
            },
            {
                "type": "highlight",
                "geometry": "'primitive: plane; height: 10; width: 10'",
                "xoffset": 0,
                "yoffset": 0,
                "zoffset": 10
            }
        ],
        "1_2": [
            {
                "type": "a-text",
                "value": "THIS IS A 1_2 TEST",
                "width": 10,
                "height": 10,
                "color": "pink",
                "xoffset": 0,
                "yoffset": 0,
                "zoffset": -5
            }
        ]
    },
    "orientations": {
        "2_1": {
            "rotation": "0 180 0"
        }
    }        
}

try {
    module.exports = config;
} catch {

};

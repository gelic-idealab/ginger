# Ginger includes
- a command line tool to generate web-embeddable 360/VR tours from a directory of 360 photos. 
- a desktop application to preview, edit, and annotate the tours. 

## Usage
```
./ginger.exe -p test/ -t "My VR Building Tour"
```
## Flags
```
-p  Path to the directory of 360 images to be used
-t  Custom title to be displayed on the loading page
-c  Number of columns in the layout matrix (see below)
-s  Whether to start the preview server
```

## Layout matrix
Ginger parses the images in the target directory based on the 'layout' you give it. 
For example, to create a tour of a space from 9 images, you would capture them in this order:

```
-------------
| 1 | 6 | 7 |
-------------
| 2 | 5 | 8 |
-------------
| 3 | 4 | 9 |
-------------
```
You would then indicate that your layout matrix has 3 columns: 
```
./ginger.exe -p nine_images/ -t "My 9 image tour" -c 3
```

## Dev server
To use the -s (serve) argument, you must first generate self-signed certificates. You can use the cert.sh script to do this. 
```
chmod +x cert.sh
./cert.sh
```

## A-frame
We use the [A-frame](https://github.com/aframevr/aframe) WebXR library to create web-embeddable VR tours.
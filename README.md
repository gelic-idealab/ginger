# Ginger includes
- a command line tool to generate web-embeddable 360/VR tours from a directory of 360 photos. 
- a desktop application to preview, edit, and annotate the tours. 

## Usage
```
./ginger.exe -p test/ -t "My VR Building Tour"
```
## Dev server
To use the -s (serve) argument, you must first generate self-signed certificates. You can use the cert.sh script to do this. 
```
chmod +x cert.sh
./cert.sh
```

## A-frame
We use the [A-frame](https://github.com/aframevr/aframe) WebXR library to create web-embeddable VR tours.
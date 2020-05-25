// Ginger - a command line tool to generate web-embeddable 360/VR building tours
package main

import (
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
)

func main() {

	dir := flag.String("p", "NONE", "the path to the directory of 360 images")
	title := flag.String("t", "360 Tour", "the title for the generated tour")
	columns := flag.Int("c", 1, "the number of columns in the image matrix")
	serve := flag.Bool("s", false, "serve generated package on localhost")
	reverse := flag.Bool("r", false, "reverse the order of images in the target directory")
	outputDir := flag.String("o", "out", "the directory to output generated files to")

	flag.Parse()

	if *dir == "NONE" {
		fmt.Println("please provide the path to the image directory")
		os.Exit(2)
	}

	OUTPUT := path.Join(*outputDir, *title)
	OUTPUT_STATIC := path.Join(OUTPUT, "static")
	OUTPUT_IMG_DIR := path.Join(OUTPUT_STATIC, "img")

	IMG_STATIC_REL_PATH := "static/img/"

	TEMPLATES := "templates"
	TEMPLATES_STATIC := path.Join(TEMPLATES, "static")

	_ = os.MkdirAll(OUTPUT_IMG_DIR, 0755)

	var files []string
	var fileCounter = -1

	var nodeIds []string

	pathErr := filepath.Walk(*dir, func(path string, info os.FileInfo, err error) error {
		files = append(files, path)
		fileCounter++
		return nil
	})
	if pathErr != nil {
		panic(pathErr)
	}

	// pop directory off the front of files slice
	_, files = files[0], files[1:]

	var matrixRows int
	if *columns > 1 {
		matrixRows = fileCounter / *columns
	} else {
		matrixRows = fileCounter
	}
	fmt.Println("Image layout is:", matrixRows, "row(s) by", *columns, "column(s):", fileCounter, "images")

	fmt.Println("Copy and rename images -->", OUTPUT_IMG_DIR)
	fileIndex := 0
	row_counter := 1
	column_counter := 1
	is_incrementing := true

	if *reverse {
		for i := len(files)/2 - 1; i >= 0; i-- {
			opp := len(files) - 1 - i
			files[i], files[opp] = files[opp], files[i]
		}
	}

	// TODO(rob): explicitly sort files by name ascending
	for f := 0; f < fileCounter; f++ {
		if row_counter <= matrixRows {
			if column_counter <= *columns {
				copyAndRenameImg(OUTPUT_IMG_DIR, files[fileIndex], row_counter, column_counter)
				nodeIds = append(nodeIds, (strconv.Itoa(row_counter) + "_" + strconv.Itoa(column_counter)))
				fileIndex++
				if is_incrementing {
					if row_counter < matrixRows {
						row_counter += 1
					} else {
						column_counter += 1
						is_incrementing = false
					}
				} else {
					if row_counter > 1 {
						row_counter -= 1
					} else {
						column_counter += 1
						is_incrementing = true
					}
				}
			}
		}
	}

	fmt.Println("Copy static assets -->", OUTPUT_STATIC)
	var static_files []string
	ts_pathErr := filepath.Walk(TEMPLATES_STATIC, func(path string, info os.FileInfo, err error) error {
		static_files = append(static_files, path)
		return nil
	})
	if ts_pathErr != nil {
		panic(ts_pathErr)
	}

	for p := 1; p < len(static_files); p++ {
		filename := strings.Replace(static_files[p], "templates", OUTPUT, 1)
		copyFile(static_files[p], filename)
	}

	fmt.Println("Format and generate index.html...")
	htmlTemplatePath := path.Join(TEMPLATES, "template.html")
	htmlTemplateText := readHtmlTemplate(htmlTemplatePath)
	// TODO(rob): use http/template to format and execute template.html
	html := strings.Replace(htmlTemplateText, "{{num_rows}}", strconv.Itoa(matrixRows), 1)
	html = strings.Replace(html, "{{num_cols}}", strconv.Itoa(*columns), 1)
	html = strings.Replace(html, "{{img_dir}}", "'"+IMG_STATIC_REL_PATH+"'", 1)
	html = strings.Replace(html, "{{img_ext}}", "'.jpg'", 1)
	html = strings.Replace(html, "{{title}}", *title, 1)

	err := ioutil.WriteFile(path.Join(OUTPUT, "index.html"), []byte(html), 0644)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("Generate config.js...")
	config := "var config = {"
	nodes := []string{`"start": {"node": "1_1", "cameraRotation": "0 0 0"}`}
	for i := 0; i < len(nodeIds); i++ {
		nodes = append(nodes, `"`+nodeIds[i]+`"`+`: {"annotations": [], "rotation": "0 0 0"}`)
	}
	config += strings.Join(nodes, ",")
	config += "}"
	configErr := ioutil.WriteFile(path.Join(OUTPUT_STATIC, "config.js"), []byte(config), 0644)
	if configErr != nil {
		fmt.Println(configErr)
	}

	fmt.Println("Done.\n")

	if *serve {
		// Set up the handler to serve the generated files
		fs := http.FileServer(http.Dir(OUTPUT))
		http.Handle("/", fs)

		fmt.Println("Serving. Go to http://localhost:5000/")
		http.ListenAndServe(":5000", nil)
	}
}

func copyAndRenameImg(outputImgDir string, srcPath string, r int, c int) string {
	id := strconv.Itoa(r) + "_" + strconv.Itoa(c)
	ext := filepath.Ext(srcPath)
	newPath := path.Join(outputImgDir, id+ext)
	copyFile(srcPath, newPath)
	return newPath
}

func copyFile(src string, dst string) {

	from, err := os.Open(src)
	if err != nil {
		log.Fatal(err)
	}
	defer from.Close()

	to, err := os.OpenFile(dst, os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {
		log.Fatal(err)
	}
	defer to.Close()

	_, err = io.Copy(to, from)
	if err != nil {
		log.Fatal(err)
	}
}

func readHtmlTemplate(path string) string {
	content, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}

	text := string(content)
	return text
}

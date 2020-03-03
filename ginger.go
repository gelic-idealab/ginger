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

	flag.Parse()

	if *dir == "NONE" {
		fmt.Println("please provide the path to the image directory")
		os.Exit(2)
	}

	OUTPUT := *title
	OUTPUT_STATIC := path.Join(OUTPUT, "static")
	OUTPUT_IMG_DIR := path.Join(OUTPUT_STATIC, "img")

	IMG_STATIC_REL_PATH := "static/img/"

	TEMPLATES := "templates"
	TEMPLATES_STATIC := path.Join(TEMPLATES, "static")

	_ = os.MkdirAll(OUTPUT_IMG_DIR, 0666)

	var files []string
	var fileCounter = -1

	pathErr := filepath.Walk(*dir, func(path string, info os.FileInfo, err error) error {
		files = append(files, path)
		fileCounter++
		return nil
	})
	if pathErr != nil {
		panic(pathErr)
	}

	var matrixRows int
	if *columns > 1 {
		matrixRows = fileCounter / *columns
	} else {
		matrixRows = fileCounter
	}
	fmt.Println("Image layout is:", matrixRows, "row(s) by", *columns, "column(s):", fileCounter, "images")

	fmt.Println("Copy and rename images -->", OUTPUT_IMG_DIR)
	fileIndex := 1
	row_counter := 1
	column_counter := 1
	is_incrementing := true
	for f := 0; f < fileCounter; f++ {
		if row_counter <= matrixRows {
			if column_counter <= *columns {
				copyAndRenameImg(OUTPUT_IMG_DIR, files[fileIndex], row_counter, column_counter)
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
		filename := strings.Replace(static_files[p], "templates", *title, 1)
		copyFile(static_files[p], filename)
	}

	fmt.Println("Format and generate index.html...")
	htmlTemplatePath := path.Join(TEMPLATES, "template.html")
	htmlTemplateText := readHtmlTemplate(htmlTemplatePath)

	html := strings.Replace(htmlTemplateText, "{{num_rows}}", strconv.Itoa(matrixRows), 1)
	html = strings.Replace(html, "{{num_cols}}", strconv.Itoa(*columns), 1)
	html = strings.Replace(html, "{{img_dir}}", "'"+IMG_STATIC_REL_PATH+"'", 1)
	html = strings.Replace(html, "{{img_ext}}", "'.jpg'", 1)
	html = strings.Replace(html, "{{title}}", *title, 1)

	err := ioutil.WriteFile(path.Join(OUTPUT, "index.html"), []byte(html), 0644)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("Done.")

	if *serve {
		// Set up the handler to serve the generated files
		fs := http.FileServer(http.Dir(*title))
		http.Handle("/", fs)

		fmt.Println("Serving. Go to https://127.0.0.1:8443/")
		http.ListenAndServeTLS(":8443", "cert.pem", "key.pem", nil)
	}
}

func copyAndRenameImg(outputImgDir string, srcPath string, r int, c int) string {
	ext := strings.Split(srcPath, ".")
	var newPath string
	newPath = path.Join(outputImgDir, strconv.Itoa(r)+"_"+strconv.Itoa(c)+"."+ext[1])
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

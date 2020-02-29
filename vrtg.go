// vr tour generator - command line tool

package main

import (
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func main() {

	OUTPUT := "out/"
	OUTPUT_STATIC := OUTPUT + "static/"
	OUTPUT_IMG_DIR := OUTPUT_STATIC + "img/"

	IMG_STATIC_REL_PATH := "static/img/"

	TEMPLATES := "templates/"
	TEMPLATES_STATIC := TEMPLATES + "static/"

	_ = os.MkdirAll(OUTPUT_IMG_DIR, 0666)

	dir := flag.String("p", "NONE", "the path to the directory of 360 images")
	title := flag.String("t", "360 Tour", "the title for the generated tour")
	columns := flag.Int("c", 1, "the number of columns in the image matrix")
	// rows := flag.Int("r", 1, "the number of rows in the image matrix")

	flag.Parse()
	// fmt.Println("args:", *dir, *columns, *rows, *title)

	if *dir == "NONE" {
		fmt.Println("please provide the path to the image directory")
		os.Exit(2)
	}

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

	fmt.Println("Number of files:", fileCounter)

	var matrixRows int
	if *columns > 1 {
		matrixRows = fileCounter / *columns
	} else {
		matrixRows = fileCounter
	}
	fmt.Println("Image matrix is:", matrixRows, "row(s) by", *columns, "column(s)")

	var fileIndex = 1
	// fmt.Println("Copy and rename images -->", OUTPUT_IMG_DIR)
	// for r := 1; r <= matrixRows; r++ {
	// 	for c := 1; c <= *columns; c++ {
	// 		copyAndRenameImg(OUTPUT_IMG_DIR, files[fileIndex], r, c)
	// 		fileIndex++
	// 	}
	// }

	row_counter := 1
	column_counter := 1
	is_incrementing := true
	for f := 0; f < fileCounter; f++ {
        if (row_counter <= matrixRows) {
            if (column_counter <= *columns) {
				copyAndRenameImg(OUTPUT_IMG_DIR, files[fileIndex], row_counter, column_counter)
				fileIndex++
				if (is_incrementing) {
					if (row_counter < matrixRows) {
						row_counter += 1
					} else {
						column_counter += 1
						is_incrementing = false
					}
				} else {
					if (row_counter > 1) {
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
		filename := strings.Replace(static_files[p], "templates", "out", 1)
		copyFile(static_files[p], filename)
		// fmt.Println(static_files[p], "-->", filename)
	}

	fmt.Println("Format and generate index.html...")
	htmlTemplatePath := TEMPLATES + "template.html"
	htmlTemplateText := readHtmlTemplate(htmlTemplatePath)

	html := strings.Replace(htmlTemplateText, "{{num_rows}}", strconv.Itoa(matrixRows), 1)
	html = strings.Replace(html, "{{num_cols}}", strconv.Itoa(*columns), 1)
	html = strings.Replace(html, "{{img_dir}}", "'"+IMG_STATIC_REL_PATH+"'", 1)
	html = strings.Replace(html, "{{img_ext}}", "'.jpg'", 1)
	html = strings.Replace(html, "{{title}}", *title, 1)

	err := ioutil.WriteFile(OUTPUT+"index.html", []byte(html), 0644)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("Done.")

}

func copyAndRenameImg(outputImgDir string, path string, r int, c int) string {
	ext := strings.Split(path, ".")
	var newPath string
	newPath = outputImgDir + strconv.Itoa(r) + "_" + strconv.Itoa(c) + "." + ext[1]
	copyFile(path, newPath)
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

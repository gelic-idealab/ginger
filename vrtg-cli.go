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

	// cwd, err := os.Getwd()
	// if err != nil {
	// 	log.Println(err)
	// }

	outputDir := "static/"
	outputImgDir := outputDir + "img/"

	dir := flag.String("p", "NONE", "the path to the directory of 360 images")
	title := flag.String("t", "360 Tour", "the title for the generated tour")
	columns := flag.Int("c", 1, "the number of columns in the image matrix")
	rows := flag.Int("r", 1, "the number of rows in the image matrix")

	flag.Parse()
	fmt.Println("args:", *dir, *columns, *rows, *title)

	if *dir == "NONE" {
		fmt.Println("please provide the path to the image directory")
		os.Exit(2)
	}

	var files []string
	var fileCounter = -1

	pathErr := filepath.Walk(*dir, func(path string, info os.FileInfo, err error) error {
		files = append(files, path)
		return nil
	})
	if pathErr != nil {
		panic(pathErr)
	}
	for _, file := range files {
		fmt.Println(file)
		fileCounter++
	}

	fmt.Println("Number of files:", fileCounter)

	matrixRows := fileCounter / *columns
	fmt.Println("Image matrix is:", matrixRows, "by", *columns)

	var fileIndex = 1
	for r := 1; r <= matrixRows; r++ {
		for c := 1; c <= *columns; c++ {
			fmt.Println(r, c)
			copyImg(outputImgDir, files[fileIndex], r, c)
			fileIndex++
		}
	}

	htmlTemplatePath := "template.html"
	htmlTemplateText := readHtmlTemplate(htmlTemplatePath)

	html := strings.Replace(htmlTemplateText, "{{num_rows}}", strconv.Itoa(matrixRows), 1)
	html = strings.Replace(html, "{{num_cols}}", strconv.Itoa(*columns), 1)
	html = strings.Replace(html, "{{img_dir}}", "'"+outputImgDir+"'", 1)
	html = strings.Replace(html, "{{img_ext}}", "'.jpg'", 1)
	fmt.Println(html)

	err := ioutil.WriteFile("index.html", []byte(html), 0644)
	if err != nil {
		fmt.Println(err)
	}

}

func copyImg(outputImgDir string, path string, r int, c int) string {
	from, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	defer from.Close()

	ext := strings.Split(path, ".")

	var newPath string
	newPath = outputImgDir + strconv.Itoa(r) + "_" + strconv.Itoa(c) + "." + ext[1]

	to, err := os.OpenFile(newPath, os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {
		log.Fatal(err)
	}
	defer to.Close()

	_, err = io.Copy(to, from)
	if err != nil {
		log.Fatal(err)
	}

	return newPath
}

func readHtmlTemplate(path string) string {
	content, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}

	// Convert []byte to string and print to screen
	text := string(content)
	return text
}

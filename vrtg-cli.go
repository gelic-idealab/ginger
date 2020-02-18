// vr tour generator - command line tool

package main

import (
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strconv"
)

func main() {

	cwd, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}

	dir := flag.String("p", cwd, "the path to the directory of 360 images")
	title := flag.String("t", "360 Tour", "the title for the generated tour")
	columns := flag.Int("c", 1, "the number of columns in the image matrix")
	rows := flag.Int("r", 1, "the number of rows in the image matrix")

	flag.Parse()
	fmt.Println(*dir, *columns, *rows, *title)

	var files []string
	var fileCounter = -1

	pathErr := filepath.Walk(*dir, func(path string, info os.FileInfo, err error) error {
		files = append(files, path)
		return nil
	})
	if err != nil {
		panic(pathErr)
	}
	for _, file := range files {
		fmt.Println(file)
		fileCounter++
	}

	fmt.Println("Number of files:", fileCounter)

	matrixRows := fileCounter / *columns
	fmt.Println("image matrix is:", matrixRows, "by", *columns)

	for r := 0; r < matrixRows; r++ {
		for c := 0; c < *columns; c++ {
			fmt.Println(r, c)
		}
	}

	var p string
	p = "img/1.jpg"
	var np string
	np = copyImg(p, 1, 1)
	fmt.Println("new img path:", np)

}

func copyImg(path string, r int, c int) string {
	from, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	defer from.Close()

	var newPath string
	newPath = strconv.Itoa(r) + "_" + strconv.Itoa(c) + ".jpg"

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

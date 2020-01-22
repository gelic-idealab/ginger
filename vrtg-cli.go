// vr tour generator - command line tool

package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
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

	pathErr := filepath.Walk(*dir, func(path string, info os.FileInfo, err error) error {
		files = append(files, path)
		return nil
	})
	if err != nil {
		panic(pathErr)
	}
	for _, file := range files {
		fmt.Println(file)
	}
}

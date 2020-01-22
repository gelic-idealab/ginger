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

	var path = flag.String("p", cwd, "the path to the directory of 360 images")
	var columns = flag.Int("c", 1, "the number of columns in the image matrix")
	var rows = flag.Int("r", 1, "the number of rows in the image matrix")

	flag.Parse()
	fmt.Println(*path, *columns, *rows)

	var files []string

	root := *path
	pathErr := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
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

package main

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strings"
)

func getBrowserPath(url string) string {
	out := url
	if strings.HasSuffix(url, "/index.html") {
		out = out[:len(out)-len("index.html")]
	} else if ext := filepath.Ext(url); ext == ".html" {
		out = out[:len(out)-len(".html")]
	}
	return out
}

func getFSPath(url string) string {
	out := url
	if strings.HasSuffix(url, "/") {
		out += "index.html"
	} else if ext := filepath.Ext(url); ext == "" {
		out += ".html"
	}
	return out
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if ext := filepath.Ext(r.URL.Path); ext == "" {
			http.ServeFile(w, r, "out/index.html")
			return
		}
		// r.Header.Set("Content-Type", mime.TypeByExtension(ext))
		http.ServeFile(w, r, filepath.Join("out", r.URL.Path))
	})

	fmt.Printf("ready on port %d\n", 8000)
	if err := http.ListenAndServe(":8000", nil); err != nil {
		panic(err)
	}
}

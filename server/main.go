package main

import (
	"log"
	"net/http"

	"github.com/tmuelli/godac-web/server/internal/server"
	"github.com/tmuelli/godac/models"
)

func main() {
	const port = "8080"

	data, err := models.NewData()
	if err != nil {
		log.Fatal("Error while loading data:", err)
	}

	sCfg, err := server.NewConfig(data)
	if err != nil {
		log.Fatal(err)
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: sCfg.Routes(),
	}

	log.Printf("Serving on port: %s\n", port)
	log.Fatal(srv.ListenAndServe())
}

package main

import (
	"TinderDosFilmes/internal/config"
	"TinderDosFilmes/internal/handlers"
	"TinderDosFilmes/internal/services"
	"log"
	"net/http"
)

func main() {

	cfg := config.LoadConfig()

	tmdbService := &services.TMDBService{
		ApiKey: cfg.TMDBApiKey,
	}

	movieHandler := &handlers.MovieHandler{
		Service: tmdbService,
	}

	http.HandleFunc("/discover", movieHandler.Discover)

	log.Println("Servidor rodando na porta 8080 🚀")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

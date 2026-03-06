package main

import (
	"TinderDosFilmes/internal/config"
	"TinderDosFilmes/internal/database"
	"TinderDosFilmes/internal/handlers"
	"TinderDosFilmes/internal/services"
	"log"
	"net/http"
	"strings"
)

func main() {
	cfg := config.LoadConfig()

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal("Erro ao conectar no banco:", err)
	}
	defer db.Close()
	log.Println("✅ Banco conectado!")

	tmdbService := &services.TMDBService{
		ApiKey: cfg.TMDBApiKey,
	}

	movieHandler := &handlers.MovieHandler{
		Service: tmdbService,
	}

	salaHandler := &handlers.SalaHandler{
		DB:          db,
		TMDBService: tmdbService,
	}

	http.HandleFunc("/discover", movieHandler.Discover)
	http.HandleFunc("/sala", salaHandler.CriarSala)
	
	http.HandleFunc("/sala/", func(w http.ResponseWriter, r *http.Request) {
	if strings.HasSuffix(r.URL.Path, "/filmes") {
		salaHandler.BuscarFilmesDaSala(w, r)
	} else {
		salaHandler.BuscarSala(w, r)
	}
})
	

	log.Println("🚀 Servidor rodando na porta 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
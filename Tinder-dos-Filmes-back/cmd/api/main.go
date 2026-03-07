package main

import (
	"TinderDosFilmes/internal/config"
	"TinderDosFilmes/internal/database"
	"TinderDosFilmes/internal/handlers"
	"TinderDosFilmes/internal/services"
	"TinderDosFilmes/internal/socket"
	"log"
	"net/http"
	"strings"
)

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

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

	hub := socket.NewHub()

	http.HandleFunc("/discover", corsMiddleware(movieHandler.Discover))
	http.HandleFunc("/sala", corsMiddleware(salaHandler.CriarSala))
	http.HandleFunc("/sala/", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/filmes") {
			salaHandler.BuscarFilmesDaSala(w, r)
		} else {
			salaHandler.BuscarSala(w, r)
		}
	}))
	http.HandleFunc("/ws/", socket.ServeWS(hub))

	log.Println("🚀 Servidor rodando na porta 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
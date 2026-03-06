package handlers

import (
	"TinderDosFilmes/internal/services"
	"encoding/json"
	"net/http"
)

type MovieHandler struct {
	Service *services.TMDBService
}

func (h *MovieHandler) Discover(w http.ResponseWriter, r *http.Request) {

	genero := r.URL.Query().Get("genero")
	streaming := r.URL.Query().Get("streaming")

	movies, err := h.Service.DiscoverMovies(genero, streaming)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(movies)
}

package handlers

import (
	"TinderDosFilmes/internal/services"
	"database/sql"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

type SalaHandler struct {
	DB          *sql.DB
	TMDBService *services.TMDBService
}

type CriarSalaRequest struct {
	Generos    []int `json:"generos"`
	Streamings []int `json:"streamings"`
}

type CriarSalaResponse struct {
	SalaId string `json:"salaId"`
}

// POST /sala
func (h *SalaHandler) CriarSala(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var req CriarSalaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Body inválido", http.StatusBadRequest)
		return
	}

	salaId := gerarCodigo()

	_, err := h.DB.Exec(
		`INSERT INTO salas (id, generos, streamings, status, criado_em)
		 VALUES ($1, $2, $3, 'lobby', NOW())`,
		salaId,
		intSliceToArray(req.Generos),
		intSliceToArray(req.Streamings),
	)
	if err != nil {
		http.Error(w, "Erro ao salvar sala: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	json.NewEncoder(w).Encode(CriarSalaResponse{SalaId: salaId})
}

// GET /sala/{id}
func (h *SalaHandler) BuscarSala(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	salaId := strings.TrimPrefix(r.URL.Path, "/sala/")
	if salaId == "" {
		http.Error(w, "ID da sala não informado", http.StatusBadRequest)
		return
	}

	var sala struct {
		ID     string `json:"id"`
		Status string `json:"status"`
	}

	err := h.DB.QueryRow(
		`SELECT id, status FROM salas WHERE id = $1`, salaId,
	).Scan(&sala.ID, &sala.Status)

	if err == sql.ErrNoRows {
		http.Error(w, "Sala não encontrada", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Erro ao buscar sala", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	json.NewEncoder(w).Encode(sala)
}

// GET /sala/{id}/filmes
func (h *SalaHandler) BuscarFilmesDaSala(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 3 {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}
	salaId := parts[2]

	var generosRaw, streamingsRaw string
	err := h.DB.QueryRow(
		`SELECT generos::text, streamings::text FROM salas WHERE id = $1`, salaId,
	).Scan(&generosRaw, &streamingsRaw)

	if err == sql.ErrNoRows {
		http.Error(w, "Sala não encontrada", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Erro ao buscar sala", http.StatusInternalServerError)
		return
	}

	genero := strings.Trim(generosRaw, "{}")
	streaming := strings.Trim(streamingsRaw, "{}")

	movies, err := h.TMDBService.DiscoverMovies(genero, streaming)
	if err != nil {
		http.Error(w, "Erro ao buscar filmes", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	json.NewEncoder(w).Encode(movies)
}

// Gera código aleatório de 6 caracteres ex: XKTZ91
func gerarCodigo() string {
	rand.Seed(time.Now().UnixNano())
	letras := "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	codigo := make([]byte, 6)
	for i := range codigo {
		codigo[i] = letras[rand.Intn(len(letras))]
	}
	return string(codigo)
}

// Converte []int para formato do PostgreSQL ex: {28,35}
func intSliceToArray(nums []int) string {
	if len(nums) == 0 {
		return "{}"
	}
	parts := make([]string, len(nums))
	for i, n := range nums {
		parts[i] = fmt.Sprintf("%d", n)
	}
	return "{" + strings.Join(parts, ",") + "}"
}
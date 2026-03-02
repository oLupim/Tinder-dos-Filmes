package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

type Filme struct {
	ID       int
	Title    string
	Overview string
}
type DiscoverResponse struct {
	Page    int     `json:"page"`
	Results []Filme `json:"results"`
}

func main() {

	// Carrega .env
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Erro ao carregar .env")
		return
	}

	apiKey := os.Getenv("TMDB_API_KEY")
	if apiKey == "" {
		fmt.Println("API key não encontrada")
		return
	}
	var streaming = escolherStreaming()
	url := "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey + "&language=pt-BR&with_watch_providers=" + streaming +
		"&watch_region=BR"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("Erro ao criar requisição:", err)
		return
	}

	req.Header.Add("accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Erro na requisição:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Println("Erro: status code", resp.StatusCode)
		return
	}
	var discover DiscoverResponse
	var data Filme
	err = json.NewDecoder(resp.Body).Decode(&discover)
	if err != nil {
		fmt.Println("Erro ao decodificar JSON:", err)
		return
	}
	data = discover.Results[1]

	fmt.Println()
	fmt.Printf("ID: %d, nome: %s\n descrição: %s", data.ID, data.Title, data.Overview)
}

func escolherStreaming() string {
	fmt.Println("Escolha seu streaming")
	fmt.Printf(`netfilx: 1
	disney plus: 2
	Amazon Prime Video: 3
	Paramount Plus: 4
	HBO Max: 5
	Apple TV Store: 6
	Globoplay: 7`)
	var streaming int
	fmt.Scan(&streaming)
	var escolhido string
	switch streaming {
	case 1:
		escolhido = "8"
	case 2:
		escolhido = "337"
	case 3:
		escolhido = "119"
	case 4:
		escolhido = "531"
	case 5:
		escolhido = "1899"
	case 6:
		escolhido = "2"
	case 7:
		escolhido = "7"
	default:
		escolhido = "8"

	}
	return escolhido
}

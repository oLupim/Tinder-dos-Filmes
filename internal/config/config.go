package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	TMDBApiKey string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Erro ao carregar .env")
	}

	return &Config{
		TMDBApiKey: os.Getenv("TMDB_API_KEY"),
	}

}

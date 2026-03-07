package services

import (
	"encoding/json"
	"net/http"
)

type Movie struct {
	ID           int     `json:"id"`
	Title        string  `json:"title"`
	Overview     string  `json:"overview"`
	PosterPath   string  `json:"poster_path"`
	VoteAverage  float64 `json:"vote_average"`
	ReleaseDate  string  `json:"release_date"`
}

type DiscoverResponse struct {
	Results []Movie `json:"results"`
}

type TMDBService struct {
	ApiKey string
}

func (s *TMDBService) DiscoverMovies(genero, streaming string) ([]Movie, error) {
	url := "https://api.themoviedb.org/3/discover/movie?api_key=" + s.ApiKey +
		"&language=pt-BR" +
		"&with_genres=" + genero +
		"&with_watch_providers=" + streaming +
		"&watch_region=BR"

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var discover DiscoverResponse
	err = json.NewDecoder(resp.Body).Decode(&discover)
	if err != nil {
		return nil, err
	}

	return discover.Results, nil
}
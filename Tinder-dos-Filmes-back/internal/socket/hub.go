package socket

import (
	"sync"
)

// Representa um player conectado
type Player struct {
	ID   string
	Conn *Client
}

// Sala com seus players e votos
type Room struct {
	Players map[string]*Client  // playerID → conexão
	Votos   map[int]map[string]bool // filmeID → { playerID: curtiu }
	mu      sync.Mutex
}

// Hub central que gerencia todas as salas
type Hub struct {
	Rooms map[string]*Room // salaID → sala
	mu    sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		Rooms: make(map[string]*Room),
	}
}

func (h *Hub) GetOrCreateRoom(salaId string) *Room {
	h.mu.Lock()
	defer h.mu.Unlock()

	if _, ok := h.Rooms[salaId]; !ok {
		h.Rooms[salaId] = &Room{
			Players: make(map[string]*Client),
			Votos:   make(map[int]map[string]bool),
		}
	}
	return h.Rooms[salaId]
}

func (h *Hub) RemovePlayer(salaId, playerId string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	room, ok := h.Rooms[salaId]
	if !ok {
		return
	}
	room.mu.Lock()
	defer room.mu.Unlock()
	delete(room.Players, playerId)
}
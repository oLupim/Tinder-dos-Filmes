package socket

import (
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // aceita qualquer origem
	},
}

func gerarPlayerID() string {
	rand.Seed(time.Now().UnixNano())
	letras := "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, 6)
	for i := range b {
		b[i] = letras[rand.Intn(len(letras))]
	}
	return fmt.Sprintf("player_%s", string(b))
}

// GET /ws/{salaId}
func ServeWS(hub *Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Pega o salaId da URL ex: /ws/XKTZ91
		salaId := strings.TrimPrefix(r.URL.Path, "/ws/")
		if salaId == "" {
			http.Error(w, "salaId obrigatório", http.StatusBadRequest)
			return
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}

		playerId := gerarPlayerID()

		client := &Client{
			ID:     playerId,
			SalaID: salaId,
			Hub:    hub,
			Conn:   conn,
			Send:   make(chan []byte, 256),
		}

		// Registra o player na sala
		room := hub.GetOrCreateRoom(salaId)
		room.mu.Lock()
		room.Players[playerId] = client
		room.mu.Unlock()

		// Avisa todos que entrou novo player
		client.broadcastPlayers()

		go client.WritePump()
		go client.ReadPump()
	}
}
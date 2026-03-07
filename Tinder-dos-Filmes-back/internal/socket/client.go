package socket

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID     string
	SalaID string
	Hub    *Hub
	Conn   *websocket.Conn
	Send   chan []byte
}

type Message struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

func (c *Client) ReadPump() {
	defer func() {
		c.Hub.RemovePlayer(c.SalaID, c.ID)
		c.Conn.Close()
		c.broadcastPlayers()
	}()

	for {
		_, raw, err := c.Conn.ReadMessage()
		if err != nil {
			break
		}

		var msg Message
		if err := json.Unmarshal(raw, &msg); err != nil {
			continue
		}

		switch msg.Type {
		case "voto":
			c.handleVoto(msg.Payload)
		}
	}
}

func (c *Client) WritePump() {
	defer c.Conn.Close()
	for msg := range c.Send {
		if err := c.Conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			break
		}
	}
}

func (c *Client) handleVoto(payload json.RawMessage) {
	var voto struct {
		FilmeID int    `json:"filmeId"`
		Voto    string `json:"voto"` // "like" ou "dislike"
	}
	if err := json.Unmarshal(payload, &voto); err != nil {
		return
	}

	room := c.Hub.GetOrCreateRoom(c.SalaID)
	room.mu.Lock()

	// Registra o voto
	if voto.Voto == "like" {
		if room.Votos[voto.FilmeID] == nil {
			room.Votos[voto.FilmeID] = make(map[string]bool)
		}
		room.Votos[voto.FilmeID][c.ID] = true

		// Verifica se todos curtiram
		totalPlayers := len(room.Players)
		totalLikes := len(room.Votos[voto.FilmeID])
		room.mu.Unlock()

		if totalPlayers > 0 && totalLikes >= totalPlayers {
			c.broadcastMatch(voto.FilmeID)
			return
		}
	} else {
		room.mu.Unlock()
	}

	// Avisa todos sobre o status do voto
	c.broadcastVotoStatus(voto.FilmeID)
}

func (c *Client) broadcastPlayers() {
	room := c.Hub.GetOrCreateRoom(c.SalaID)
	room.mu.Lock()
	players := make([]string, 0, len(room.Players))
	for id := range room.Players {
		players = append(players, id)
	}
	room.mu.Unlock()

	msg, _ := json.Marshal(map[string]any{
		"type":    "players",
		"payload": map[string]any{"players": players},
	})
	c.broadcast(msg)
}

func (c *Client) broadcastVotoStatus(filmeID int) {
	room := c.Hub.GetOrCreateRoom(c.SalaID)
	room.mu.Lock()
	likes := len(room.Votos[filmeID])
	total := len(room.Players)
	room.mu.Unlock()

	msg, _ := json.Marshal(map[string]any{
		"type": "voto_status",
		"payload": map[string]any{
			"filmeId": filmeID,
			"likes":   likes,
			"total":   total,
		},
	})
	c.broadcast(msg)
}

func (c *Client) broadcastMatch(filmeID int) {
	msg, _ := json.Marshal(map[string]any{
		"type":    "match",
		"payload": map[string]any{"filmeId": filmeID},
	})
	c.broadcast(msg)
	log.Printf("🎉 MATCH na sala %s! Filme %d", c.SalaID, filmeID)
}

func (c *Client) broadcast(msg []byte) {
	room := c.Hub.GetOrCreateRoom(c.SalaID)
	room.mu.Lock()
	defer room.mu.Unlock()
	for _, player := range room.Players {
		select {
		case player.Send <- msg:
		default:
		}
	}
}
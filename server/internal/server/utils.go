package server

import (
	"encoding/json"
	"log"
	"net/http"
)

func writeErr(w http.ResponseWriter, code int, msg string) {
	type repsonseError struct {
		Message string `json:"message"`
	}

	body := repsonseError{
		Message: msg,
	}

	writeJSON(w, code, body)
}

func writeJSON(w http.ResponseWriter, code int, payload any) {
	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling JSON: %s", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(data)
}

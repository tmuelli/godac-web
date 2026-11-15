package server

import (
	"cmp"
	"encoding/json"
	"fmt"
	"net/http"
	"slices"

	"github.com/tmuelli/godac/calc"
	"github.com/tmuelli/godac/models"
)

type Config struct {
	Data       *models.Data
	specieByID map[string]*models.Specie
	movesByID  map[string]*models.Move
}

func NewConfig(data *models.Data) (*Config, error) {
	c := &Config{
		Data:       data,
		specieByID: make(map[string]*models.Specie, len(data.Species)),
		movesByID:  make(map[string]*models.Move, len(data.Moves)),
	}

	for name := range data.Species {
		s := data.Species[name]
		if _, dup := c.specieByID[s.ID]; dup {
			return nil, fmt.Errorf("duplicate specie id %q", s.ID)
		}
		c.specieByID[s.ID] = &s
	}

	for name := range data.Moves {
		m := data.Moves[name]
		if _, dup := c.movesByID[m.ID]; dup {
			return nil, fmt.Errorf("duplicate move id: %q", m.ID)
		}
		c.movesByID[m.ID] = &m
	}

	return c, nil
}

func (c *Config) Routes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/species", c.ListSpecies)
	mux.HandleFunc("GET /api/species/{id}/defaults", c.GetSpecieDefaults)
	mux.HandleFunc("GET /api/moves", c.ListMoves)
	mux.HandleFunc("GET /api/moves/{id}/defaults", c.GetMoveDefaults)
	mux.HandleFunc("GET /api/abilities", c.ListAbilities)
	mux.HandleFunc("GET /api/items", c.ListItems)
	mux.HandleFunc("GET /api/natures", c.ListNatures)
	mux.HandleFunc("GET /api/types", c.ListTypes)
	mux.HandleFunc("POST /api/calc", c.CalculateDamage)

	return mux
}

// TODO: load lists once at server startup to improve performance
func (c *Config) ListSpecies(w http.ResponseWriter, r *http.Request) {
	list := listEntries(c.Data.Species, func(s models.Specie) entrySummary {
		return entrySummary{
			ID:   s.ID,
			Name: s.Name,
		}
	})

	writeJSON(w, http.StatusOK, list)
}

func (c *Config) ListMoves(w http.ResponseWriter, r *http.Request) {
	list := listEntries(c.Data.Moves, func(m models.Move) entrySummary {
		return entrySummary{
			ID:   m.ID,
			Name: m.Name,
		}
	})

	writeJSON(w, http.StatusOK, list)
}

func (c *Config) ListAbilities(w http.ResponseWriter, r *http.Request) {
	list := listEntries(c.Data.Abilities, func(a models.Ability) entrySummary {
		return entrySummary{
			ID:   a.Id,
			Name: a.Name,
		}
	})

	writeJSON(w, http.StatusOK, list)
}

func (c *Config) ListItems(w http.ResponseWriter, r *http.Request) {
	list := listEntries(c.Data.Items, func(i models.Item) entrySummary {
		return entrySummary{
			ID:   i.Id,
			Name: i.Name,
		}
	})

	writeJSON(w, http.StatusOK, list)
}

func (c *Config) ListNatures(w http.ResponseWriter, r *http.Request) {
	list := listEntries(c.Data.Natures, func(n models.Nature) entrySummary {
		return entrySummary{
			ID:   n.ID,
			Name: n.Name,
		}
	})

	writeJSON(w, http.StatusOK, list)
}

func (c *Config) ListTypes(w http.ResponseWriter, r *http.Request) {
	list := listEntries(c.Data.Types, func(t models.Type) entrySummary {
		return entrySummary{
			ID:   t.ID,
			Name: t.Name,
		}
	})

	writeJSON(w, http.StatusOK, list)
}

func listEntries[T any](entryMap map[string]T, fn func(T) entrySummary) []entrySummary {
	list := make([]entrySummary, 0, len(entryMap))

	for _, entry := range entryMap {
		list = append(list, fn(entry))
	}

	slices.SortFunc(list, func(a, b entrySummary) int {
		return cmp.Compare(a.Name, b.Name)
	})

	return list
}

func (c *Config) GetSpecieDefaults(w http.ResponseWriter, r *http.Request) {
	requestID := r.PathValue("id")
	if requestID == "" {
		writeErr(w, http.StatusBadRequest, "Invalid specie id")
		return
	}

	specie, ok := c.specieByID[requestID]
	if !ok {
		writeErr(w, http.StatusNotFound, "Invalid specie id")
		return
	}

	defaults := c.Data.DefaultUserInput(specie)

	if defaults.Moves == nil {
		defaults.Moves = []string{}
	}

	writeJSON(w, http.StatusOK, defaults)
}

func (c *Config) GetMoveDefaults(w http.ResponseWriter, r *http.Request) {
	requestID := r.PathValue("id")
	if requestID == "" {
		writeErr(w, http.StatusBadRequest, "Invalid move id")
		return
	}

	move, ok := c.movesByID[requestID]
	if !ok {
		writeErr(w, http.StatusNotFound, "Invalid move id")
		return
	}

	defaults := c.Data.DefaultMoveInput(move)
	writeJSON(w, http.StatusOK, defaults)
}

type CalcRequest struct {
	Attacker models.UserInput      `json:"attacker"`
	Defender models.UserInput      `json:"defender"`
	Field    models.UserFieldInput `json:"field"`
}

func (c *Config) CalculateDamage(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	request := CalcRequest{}
	err := decoder.Decode(&request)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "Invalid input")
		return
	}

	request.Attacker.InputSide = string(models.Attacker)
	request.Defender.InputSide = string(models.Defender)
	calc, err := calc.NewCalc(c.Data, &request.Attacker, &request.Defender, &request.Field)
	if err != nil {
		writeErr(w, http.StatusBadRequest, fmt.Sprintf("Invalid input: %v", err))
		return
	}

	if err := calc.Calc(); err != nil {
		writeErr(w, http.StatusInternalServerError, fmt.Sprintf("Calculation error: %v", err))
		return
	}

	writeJSON(w, http.StatusOK, calc.Result)
}

package server

import (
	"cmp"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"slices"
	"strings"
	"testing"

	"github.com/tmuelli/godac/models"
)

var testHandler http.Handler

func TestMain(m *testing.M) {
	data, err := models.NewData()
	if err != nil {
		log.Fatal(err)
	}

	cfg, err := NewConfig(data)
	if err != nil {
		log.Fatal(err)
	}

	testHandler = cfg.Routes()
	os.Exit(m.Run())
}

func do(t *testing.T, method, path, body string) *httptest.ResponseRecorder {
	t.Helper()
	req := httptest.NewRequest(method, path, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	testHandler.ServeHTTP(rec, req)
	return rec
}

func getJSON[T any](t *testing.T, path string) T {
	t.Helper()

	rec := do(t, "GET", path, "")
	if rec.Code != http.StatusOK {
		t.Fatalf("GET: %s: status = %d, body: %s", path, rec.Code, rec.Body)
	}

	var data T
	if err := json.Unmarshal(rec.Body.Bytes(), &data); err != nil {
		t.Fatalf("GET %s: %v", path, err)
	}

	return data
}

func createCalcRequest(t *testing.T, atkSpecie, defSpecie, usedMove string) CalcRequest {
	t.Helper()

	atk := getJSON[models.UserInput](t, fmt.Sprintf("/api/species/%s/defaults", atkSpecie))
	def := getJSON[models.UserInput](t, fmt.Sprintf("/api/species/%s/defaults", defSpecie))
	move := getJSON[models.MoveDefaults](t, fmt.Sprintf("/api/moves/%s/defaults", idByName(t, "/api/moves", usedMove)))

	atk.AttackMove = usedMove
	atk.Moves = []string{usedMove}
	atk.MoveOverride = move.Override
	atk.Hits = move.Hits
	atk.MetronomeHits = move.MetronomeHits

	return CalcRequest{
		Attacker: atk,
		Defender: def,
		Field: models.UserFieldInput{
			Type:      string(models.Singles),
			Level:     int(models.Level100),
			Terrain:   string(models.Clear),
			IsGravity: false,
		},
	}
}

func idByName(t *testing.T, listPath, name string) string {
	t.Helper()
	for _, e := range getJSON[[]entrySummary](t, listPath) {
		if e.Name == name {
			return e.ID
		}
	}
	t.Fatalf("%s: no entry named %q", listPath, name)
	return ""
}

func TestListEndpoints(t *testing.T) {
	for _, path := range []string{"/api/species", "/api/moves", "/api/items", "/api/natures", "/api/types", "/api/abilities"} {
		t.Run(path, func(t *testing.T) {
			rec := do(t, "GET", path, "")
			if rec.Code != http.StatusOK {
				t.Fatalf("status = %d", rec.Code)
			}

			var got []entrySummary
			if err := json.Unmarshal(rec.Body.Bytes(), &got); err != nil {
				t.Fatal(err)
			}

			if len(got) == 0 {
				t.Fatalf("invalid length of list: %s", path)
			}

			for _, e := range got {
				if e.ID == "" || e.Name == "" {
					t.Errorf("empty id or name for list: %s", path)
					break
				}
			}

			if !slices.IsSortedFunc(got, func(a, b entrySummary) int {
				return cmp.Compare(a.Name, b.Name)
			}) {
				t.Errorf("invalid sorting of list: %s", path)
			}

			if rec.Header().Get("Content-Type") != "application/json" {
				t.Errorf("invalid content type in response header")
			}
		})
	}
}

func testDefaultErrorCase(t *testing.T, data []byte) {
	t.Helper()

	var e responseError

	if err := json.Unmarshal(data, &e); err != nil {
		t.Fatal(err)
	}

	if e.Message == "" {
		t.Errorf("invalid error message - message is empty")
	}
}

func TestSpecieDefautls(t *testing.T) {
	const path = "/api/species"

	testReqs := []struct {
		desc     string
		id       string
		wantCode int
	}{
		{desc: "default specie ok", id: "poochyena", wantCode: http.StatusOK},
		{desc: "default specie nok", id: "zekrom", wantCode: http.StatusNotFound},
	}

	for _, req := range testReqs {
		t.Run(req.desc, func(t *testing.T) {
			rec := do(t, "GET", fmt.Sprintf("%s/%s/defaults", path, req.id), "")
			if rec.Code != req.wantCode {
				t.Fatalf("Invalid defaults for %s got %d want %d", req.desc, rec.Code, req.wantCode)
			}

			switch rec.Code {
			case http.StatusOK:
				var defaults models.UserInput

				if err := json.Unmarshal(rec.Body.Bytes(), &defaults); err != nil {
					t.Fatal(err)
				}

				if defaults.Moves == nil {
					t.Error("invalid default moves slice on specie, should be empty slice instead of nil")
				}
			case http.StatusNotFound:
				testDefaultErrorCase(t, rec.Body.Bytes())
			}
		})
	}
}

func TestMoveDefaults(t *testing.T) {
	const path = "/api/moves"

	testReqs := []struct {
		desc     string
		id       string
		wantCode int
	}{
		{desc: "default move ok", id: "bite", wantCode: http.StatusOK},
		{desc: "default move nok", id: "leaftornado", wantCode: http.StatusNotFound},
	}

	for _, req := range testReqs {
		t.Run(req.desc, func(t *testing.T) {
			rec := do(t, "GET", fmt.Sprintf("%s/%s/defaults", path, req.id), "")
			if rec.Code != req.wantCode {
				t.Fatalf("Invalid defaults for %s got %d want %d", req.desc, rec.Code, req.wantCode)
			}

			switch rec.Code {
			case http.StatusOK:
				var defaults models.MoveDefaults

				if err := json.Unmarshal(rec.Body.Bytes(), &defaults); err != nil {
					t.Fatal(err)
				}

				if defaults.Override == nil {
					t.Fatalf("invalid override on move defaults")
				}

				if defaults.Hits == nil {
					t.Fatalf("invalid hits on move defaults")
				}

				if *defaults.Hits != 1 {
					t.Errorf("invalid hits on move defaults")
				}
			case http.StatusNotFound:
				testDefaultErrorCase(t, rec.Body.Bytes())
			}
		})
	}
}

func TestCalcValid(t *testing.T) {
	testCases := []struct {
		atkSpecies string
		defSpecies string
		usedMove   string
		wantMin    int
		wantMax    int
	}{
		{atkSpecies: "poochyena", usedMove: "Bite", defSpecies: "poochyena", wantMin: 45, wantMax: 53},
		{atkSpecies: "poochyena", usedMove: "Fire Fang", defSpecies: "poochyena", wantMin: 65, wantMax: 77},
	}

	for _, tc := range testCases {
		t.Run(fmt.Sprintf("Calc attacker: %s vs defender: %s", tc.atkSpecies, tc.defSpecies), func(t *testing.T) {
			calcReq := createCalcRequest(t, tc.atkSpecies, tc.defSpecies, tc.usedMove)

			postBody, err := json.Marshal(calcReq)
			if err != nil {
				t.Fatal(err)
			}

			resultRec := do(t, "POST", "/api/calc", string(postBody))
			if resultRec.Code != http.StatusOK {
				t.Fatalf("post status = %d error: %v", resultRec.Code, resultRec.Body)
			}

			var calcResult models.BattleResult
			if err := json.Unmarshal(resultRec.Body.Bytes(), &calcResult); err != nil {
				t.Fatal(err)
			}

			if calcResult.Range.Min != tc.wantMin || calcResult.Range.Max != tc.wantMax {
				t.Errorf("Invalid calulcation result - got min: %d, want min: %d - got max: %d, want max: %d", calcResult.Range.Min, tc.wantMin, calcResult.Range.Max, tc.wantMax)
			}
		})
	}
}

func TestCalcInvalid(t *testing.T) {
	const atk = "poochyena"
	const def = "poochyena"
	const usedMove = "Bite"

	tests := []struct {
		name       string
		raw        string
		mutate     func(*CalcRequest)
		wantStatus int
	}{
		{name: "broken JSON", raw: `{`, wantStatus: 400},
		{name: "unknown key", raw: `{"attacker": {}, "bogus": 1}`, wantStatus: 400},
		{name: "empty object", raw: `{}`, wantStatus: 400},
		{name: "level 0", mutate: func(r *CalcRequest) { r.Attacker.Level = 0 }, wantStatus: 400},
		{name: "unknown species", mutate: func(r *CalcRequest) { r.Defender.Name = "Nope" }, wantStatus: 400},
		{name: "unknown move", mutate: func(r *CalcRequest) { r.Attacker.AttackMove = "Nope" }, wantStatus: 400},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			body := tc.raw
			if body == "" {
				req := createCalcRequest(t, atk, def, usedMove)
				tc.mutate(&req)
				b, err := json.Marshal(req)
				if err != nil {
					t.Fatal(err)
				}
				body = string(b)
			}
			rec := do(t, "POST", "/api/calc", body)
			if rec.Code != tc.wantStatus {
				t.Fatalf("status = %d, want %d (body: %s)", rec.Code, tc.wantStatus, rec.Body)
			}

			testDefaultErrorCase(t, rec.Body.Bytes())
		})
	}
}

func TestCalcUnknownKey(t *testing.T) {
	tests := []struct {
		name   string
		mutate func(m map[string]any)
	}{
		{"top level", func(m map[string]any) { m["bogus"] = 1 }},
		{"nested", func(m map[string]any) { m["attacker"].(map[string]any)["bogus"] = 1 }},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			b, err := json.Marshal(createCalcRequest(t, "poochyena", "poochyena", "Bite"))
			if err != nil {
				t.Fatal(err)
			}

			var m map[string]any
			if err := json.Unmarshal(b, &m); err != nil {
				t.Fatal(err)
			}
			tc.mutate(m)

			body, err := json.Marshal(m)
			if err != nil {
				t.Fatal(err)
			}

			rec := do(t, "POST", "/api/calc", string(body))
			if rec.Code != http.StatusBadRequest {
				t.Fatalf("status = %d, want 400 (body: %s)", rec.Code, rec.Body)
			}

			testDefaultErrorCase(t, rec.Body.Bytes())
		})
	}
}

func TestInputSide(t *testing.T) {
	testCases := []struct {
		atkSpecies string
		defSpecies string
		usedMove   string
		wantMin    int
		wantMax    int
	}{
		{atkSpecies: "poochyena", defSpecies: "poochyena", usedMove: "Bite", wantMin: 45, wantMax: 53},
	}

	for _, tc := range testCases {
		t.Run(fmt.Sprintf("Calc attacker: %s vs defender: %s", tc.atkSpecies, tc.defSpecies), func(t *testing.T) {
			calcReq := createCalcRequest(t, tc.atkSpecies, tc.defSpecies, tc.usedMove)

			calcReq.Attacker.InputSide = string(models.Defender)
			calcReq.Defender.InputSide = string(models.Attacker)

			postBody, err := json.Marshal(calcReq)
			if err != nil {
				t.Fatal(err)
			}

			resultRec := do(t, "POST", "/api/calc", string(postBody))
			if resultRec.Code != http.StatusOK {
				t.Fatalf("post status = %d error: %v", resultRec.Code, resultRec.Body)
			}

			var calcResult models.BattleResult
			if err := json.Unmarshal(resultRec.Body.Bytes(), &calcResult); err != nil {
				t.Fatal(err)
			}

			if calcResult.Range.Min != tc.wantMin || calcResult.Range.Max != tc.wantMax {
				t.Errorf("Invalid calulcation result - got min: %d, want min: %d - got max: %d, want max: %d", calcResult.Range.Min, tc.wantMin, calcResult.Range.Max, tc.wantMax)
			}
		})
	}
}

func TestCalcWrongMethod(t *testing.T) {
	rec := do(t, "GET", "/api/calc", "")
	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d, want 405", rec.Code)
	}
	if !strings.Contains(rec.Header().Get("Allow"), "POST") {
		t.Errorf("Allow header = %q, want it to contain POST", rec.Header().Get("Allow"))
	}
}

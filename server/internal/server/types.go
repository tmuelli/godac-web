package server

type entrySummary struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type responseError struct {
	Message string `json:"message"`
}

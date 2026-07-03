import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/boards", () => {
    return HttpResponse.json([]);
  }),
  http.get("/api/tasks", () => {
    return HttpResponse.json([]);
  }),
  http.post("/api/boards", () => {
    return HttpResponse.json({ id: Date.now().toString() });
  }),
];

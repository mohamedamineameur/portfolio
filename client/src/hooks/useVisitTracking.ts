import { useEffect } from "react";
import { visitService } from "../services/visit.service.js";

const VISITOR_KEY = "portfolio_visitor_id";
const LAST_VISIT_KEY = "portfolio_last_visit";
const WINDOW_MS = 30 * 60 * 1000; // 30 minutes

function getOrCreateVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function shouldRecordVisit(): boolean {
  try {
    const last = localStorage.getItem(LAST_VISIT_KEY);
    if (!last) return true;
    const elapsed = Date.now() - parseInt(last, 10);
    return elapsed >= WINDOW_MS;
  } catch {
    return true;
  }
}

function setLastVisit(): void {
  try {
    localStorage.setItem(LAST_VISIT_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

/**
 * Tracks page visits: sends a POST to /api/visits with a UUID stored in the browser,
 * at most once per 30-minute window.
 */
export function useVisitTracking(): void {
  useEffect(() => {
    if (!shouldRecordVisit()) return;

    const visitorId = getOrCreateVisitorId();
    visitService
      .record(visitorId)
      .then((data) => {
        if (data.recorded) {
          setLastVisit();
        }
      })
      .catch(() => {
        // Silent fail: do not block the app
      });
  }, []);
}

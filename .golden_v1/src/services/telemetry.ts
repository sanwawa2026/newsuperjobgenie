// SuperJobGenie V1.0 Telemetry & Event Analytics Bus
// Real-time tracking of the core conversion chain & user behavior for V1.1 data-driven iterations

export type TelemetryEventType =
  | 'resume_uploaded'
  | 'candidate_profile_switched'
  | 'job_extracted_auto'
  | 'job_extracted_manual'
  | 'match_score_viewed'
  | 'panel_expanded'
  | 'gap_matrix_inspected'
  | 'pivot_analysis_viewed'
  | 'cover_letter_copied'
  | 'bullet_rewrite_copied'
  | 'paywall_modal_hit'
  | 'decision_action_clicked'
  | 'session_export_clicked';

export interface TelemetryEvent {
  id: string;
  eventType: TelemetryEventType;
  timestamp: string;
  payload: Record<string, any>;
}

export interface TelemetrySummary {
  resumesUploaded: number;
  jobsAnalyzed: number;
  deepPanelExpands: number;
  gapMatrixInspects: number;
  pivotViews: number;
  lettersCopied: number;
  rewritesCopied: number;
  paywallHits: number;
  decisionActions: number;
}

const STORAGE_KEY = 'superjobgenie_telemetry_events_v1';

export class TelemetryManager {
  private static events: TelemetryEvent[] = [];
  private static listeners: ((events: TelemetryEvent[]) => void)[] = [];

  static init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.events = JSON.parse(saved);
      }
    } catch (e) {
      this.events = [];
    }
  }

  static track(eventType: TelemetryEventType, payload: Record<string, any> = {}) {
    const event: TelemetryEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      eventType,
      timestamp: new Date().toISOString(),
      payload
    };

    this.events.unshift(event);
    if (this.events.length > 500) {
      this.events = this.events.slice(0, 500);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
    } catch (e) {
      // fallback
    }

    this.listeners.forEach((cb) => cb([...this.events]));
    console.log(`[SuperJobGenie Telemetry] ${eventType}:`, payload);
  }

  static subscribe(listener: (events: TelemetryEvent[]) => void) {
    this.listeners.push(listener);
    listener([...this.events]);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  static getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  static getSummary(): TelemetrySummary {
    const evts = this.events;
    return {
      resumesUploaded: evts.filter(e => e.eventType === 'resume_uploaded').length,
      jobsAnalyzed: evts.filter(e => e.eventType === 'job_extracted_auto' || e.eventType === 'job_extracted_manual').length,
      deepPanelExpands: evts.filter(e => e.eventType === 'panel_expanded').length,
      gapMatrixInspects: evts.filter(e => e.eventType === 'gap_matrix_inspected').length,
      pivotViews: evts.filter(e => e.eventType === 'pivot_analysis_viewed').length,
      lettersCopied: evts.filter(e => e.eventType === 'cover_letter_copied').length,
      rewritesCopied: evts.filter(e => e.eventType === 'bullet_rewrite_copied').length,
      paywallHits: evts.filter(e => e.eventType === 'paywall_modal_hit').length,
      decisionActions: evts.filter(e => e.eventType === 'decision_action_clicked').length,
    };
  }

  static clear() {
    this.events = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    this.listeners.forEach((cb) => cb([]));
  }
}

// Auto init in browser
if (typeof window !== 'undefined') {
  TelemetryManager.init();
}

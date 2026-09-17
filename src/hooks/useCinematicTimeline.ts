import { useRef, useEffect, useCallback } from 'react';

type TimelineCallback = () => void;

interface TimelineEvent {
  timeMs: number;
  callback: TimelineCallback;
  executed: boolean;
}

export function useCinematicTimeline(events: { timeMs: number; callback: TimelineCallback }[], isPlaying: boolean) {
  const eventsRef = useRef<TimelineEvent[]>(
    events.map(e => ({ ...e, executed: false }))
  );
  
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    eventsRef.current = events.map(e => ({ ...e, executed: false }));
  }, [events]);

  const reset = useCallback(() => {
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    eventsRef.current.forEach(e => { e.executed = false; });
  }, []);

  const update = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current + pausedTimeRef.current;

    eventsRef.current.forEach(evt => {
      if (!evt.executed && elapsed >= evt.timeMs) {
        evt.callback();
        evt.executed = true;
      }
    });

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(update);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(update);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
        if (startTimeRef.current) {
          pausedTimeRef.current += performance.now() - startTimeRef.current;
          startTimeRef.current = null;
        }
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, update]);

  return { reset };
}

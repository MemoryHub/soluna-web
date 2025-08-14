'use client';

import { useObservationEffects } from '@/hooks/useObservationEffects';

interface EventTickerProps {
  events: string[];
}

export default function EventTicker({ events }: EventTickerProps) {
  const { tickerRef } = useObservationEffects();

  return (
    <div className="mt-8 border-t border-b border-[#2d3748] py-3 overflow-hidden">
      <div ref={tickerRef} className="flex gap-6 animate-marquee" id="event-ticker">
        {events.map((event, index) => (
          <div key={index} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[#38b2ac]">
              <i className="fa fa-bolt"></i>
            </span>
            <span className="text-xs">{event}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

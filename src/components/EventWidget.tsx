import React from 'react';

interface EventWidgetProps {
  onSubscribeClick: () => void;
}

export const EventWidget: React.FC<EventWidgetProps> = ({ onSubscribeClick }) => {
  return (
    <section className="event-widget">
      <h4>Kalender Event</h4>
      <p style={{ fontSize: '12px', color: '#3b82f6', marginBottom: '12px' }}>
        Dapatkan pengingat jadwal pameran & expo ekonomi terkini.
      </p>
      <button type="button" onClick={onSubscribeClick}>
        Subscribe Event
      </button>
    </section>
  );
};

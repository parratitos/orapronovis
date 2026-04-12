'use client';

import { supabase } from '@/lib/supabaseClient';

interface Attendee {
  user_id: string;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  location: string;
  image_path?: string;
  attendees?: Attendee[];
}

interface EventCardProps {
  event: EventItem;
  userId?: string | null;
  onJoin: (eventId: string) => Promise<void>;
}

export default function EventCard({ event, userId, onJoin }: EventCardProps) {
  const imageUrl = event.image_path
    ? supabase.storage.from('event-images').getPublicUrl(event.image_path).data.publicUrl
    : null;

  const joined = Boolean(userId && event.attendees?.some((attendee) => attendee.user_id === userId));

  return (
    <article className="card">
      {imageUrl && <img className="event-image" src={imageUrl} alt={event.title} />}
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>
        <strong>Fecha:</strong> {new Date(event.starts_at).toLocaleString('es-ES')}
      </p>
      <p>
        <strong>Ubicación:</strong> {event.location}
      </p>
      <p>
        <strong>Participantes:</strong> {event.attendees?.length ?? 0}
      </p>
      <button
        className={joined ? 'secondary' : 'primary'}
        onClick={() => onJoin(event.id)}
        disabled={!userId || joined}
      >
        {joined ? 'Ya te has unido' : userId ? 'Unirme' : 'Inicia sesión para unirte'}
      </button>
    </article>
  );
}

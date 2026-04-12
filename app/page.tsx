'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Auth from '@/components/Auth';
import EventForm from '@/components/EventForm';
import EventCard from '@/components/EventCard';

interface EventItem {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  location: string;
  image_path?: string;
  attendees?: { user_id: string }[];
}

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadSession = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    setSession(session);
  };

  const loadEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*, attendees(user_id)')
      .order('starts_at', { ascending: true });

    if (error) {
      setErrorMessage(error.message);
      setEvents([]);
    } else {
      setEvents(data ?? []);
      setErrorMessage('');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSession();
    loadEvents();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleJoin = async (eventId: string) => {
    if (!session?.user) {
      setErrorMessage('Inicia sesión para unirte al evento.');
      return;
    }

    const { error: existsError, data: existing } = await supabase
      .from('attendees')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (existsError) {
      setErrorMessage(existsError.message);
      return;
    }

    if (existing) {
      setErrorMessage('Ya estás inscrito en este evento.');
      return;
    }

    const { error } = await supabase.from('attendees').insert([
      { event_id: eventId, user_id: session.user.id }
    ]);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('Te has unido al evento.');
      loadEvents();
    }
  };

  return (
    <main>
      <section className="card">
        <h1>Ora Pro Novis</h1>
        <p>
          Comparte y únete a reuniones de oración en línea. Crea eventos, mira el calendario y participa cuando llegue
          la hora.
        </p>
      </section>

      <section className="card">
        <Auth session={session} />
      </section>

      <section>
        <EventForm userId={session?.user?.id ?? null} onCreated={loadEvents} />
      </section>

      <section className="card">
        <h2>Eventos programados</h2>
        {loading ? (
          <p>Cargando eventos...</p>
        ) : errorMessage ? (
          <p className="notice">{errorMessage}</p>
        ) : events.length === 0 ? (
          <p>No hay eventos programados todavía.</p>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                userId={session?.user?.id ?? null}
                onJoin={handleJoin}
              />
            ))}
          </div>
        )}
      </section>

      <footer>
        <p>Lista de eventos sincronizada con Supabase. Usa el dominio gratuito del proveedor para publicar.</p>
      </footer>
    </main>
  );
}

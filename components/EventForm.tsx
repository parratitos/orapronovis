'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface EventFormProps {
  userId: string | null;
  onCreated: () => void;
}

export default function EventForm({ userId, onCreated }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [location, setLocation] = useState('En línea');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      setStatus('Debes iniciar sesión para crear un evento.');
      return;
    }

    setStatus('Guardando evento...');

    let imagePath: string | null = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('event-images')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

      if (error) {
        setStatus(`Error al subir imagen: ${error.message}`);
        return;
      }

      imagePath = data.path;
    }

    const { error } = await supabase.from('events').insert([
      {
        title,
        description,
        starts_at: startsAt,
        location,
        owner_id: userId,
        image_path: imagePath
      }
    ]);

    if (error) {
      setStatus(`Error al guardar evento: ${error.message}`);
      return;
    }

    setTitle('');
    setDescription('');
    setStartsAt('');
    setLocation('En línea');
    setImageFile(null);
    setStatus('Evento creado con éxito');
    onCreated();
  };

  return (
    <div className="card">
      <h2>Crear evento de oración</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Título</label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Nombre del evento"
          required
        />

        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Breve descripción de la oración"
          rows={4}
        />

        <label htmlFor="startsAt">Fecha y hora</label>
        <input
          id="startsAt"
          type="datetime-local"
          value={startsAt}
          onChange={(event) => setStartsAt(event.target.value)}
          required
        />

        <label htmlFor="location">Ubicación</label>
        <input
          id="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Por ejemplo: Zoom o enlace de reunión"
        />

        <label htmlFor="image">Imagen del evento (opcional)</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
        />

        <button className="primary" type="submit">
          Crear evento
        </button>
        {status && <p className="notice">{status}</p>}
      </form>
    </div>
  );
}

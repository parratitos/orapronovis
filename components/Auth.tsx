'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface AuthProps {
  session: any;
}

export default function Auth({ session }: AuthProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Enviando enlace mágico...');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage('Revisa tu correo para iniciar sesión.');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleGoogleSignIn = async () => {
    setMessage('Redirigiendo a Google...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      setMessage(error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    setMessage('Redirigiendo a Facebook...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="card">
      <h2>Acceso</h2>
      {session?.user ? (
        <div>
          <p>Conectado como <strong>{session.user.email}</strong></p>
          <button className="primary" onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSignIn}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
            />
            <button className="primary" type="submit">
              Enviar enlace mágico
            </button>
          </form>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="secondary" type="button" onClick={handleGoogleSignIn}>
              Iniciar con Google
            </button>
            <button className="secondary" type="button" onClick={handleFacebookSignIn}>
              Iniciar con Facebook
            </button>
          </div>
          {message && <p className="notice">{message}</p>}
        </div>
      )}
    </div>
  );
}

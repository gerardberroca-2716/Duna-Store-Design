import React, { useState } from 'react';
import { Button } from './ui';
import { DunaStoreLogo } from './Logo';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === 'Yorle2716' || username === 'Duvan2716') && password === 'juan2716') {
      const user = username === 'Yorle2716' ? 'Yorle' : 'Duvan';
      onLoginSuccess(user);
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark overflow-hidden">
       {/* New Faint Background Image */}
       <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 dark:opacity-20 scale-105"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/dlrwldqhr/image/upload/v1762492221/Wan_Image_Remix_dame_esta_imagen_en_mejor_calidad_PicCopilot_1a2ac_h7hdcy.png")' }}
      ></div>
      {/* Overlay */}
       <div className="absolute inset-0 z-0" style={{backgroundImage: 'radial-gradient(rgba(228, 9, 106, 0.1) 0.5px, transparent 0.5px), radial-gradient(rgba(8, 145, 178, 0.05) 0.5px, transparent 0.5px)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px'}}></div>
      
      <div className="relative z-10 w-full max-w-md rounded-xl bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-800/50 shadow-2xl shadow-primary/10 dark:shadow-black/20">
        <div className="flex flex-col items-center justify-center p-8 md:p-12 gap-8">
          
          <div className="flex flex-col items-center justify-center w-32 h-32 rounded-2xl bg-white shadow-lg mb-4">
              <DunaStoreLogo />
          </div>

          <div className="flex w-full flex-col items-center gap-2 text-center -mt-8">
            <h1 className="text-text-primary-light dark:text-text-primary-dark text-3xl md:text-4xl font-black">Duna Store Studio</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">Tu centro de creación IA.</p>
          </div>

          <form className="w-full flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-text-primary-light dark:text-text-primary-dark font-medium pb-2" htmlFor="user">Usuario</label>
                <input
                  id="user"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input w-full rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-background-dark/50 focus:border-primary h-14 placeholder:text-text-secondary-light px-4 text-lg"
                  placeholder="Tu nombre de usuario"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-text-primary-light dark:text-text-primary-dark font-medium pb-2" htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input w-full rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-background-dark/50 focus:border-primary h-14 placeholder:text-text-secondary-light px-4 text-lg"
                  placeholder="••••••••••"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="pt-2">
              <Button type="submit" icon="login">
                Iniciar Sesión
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
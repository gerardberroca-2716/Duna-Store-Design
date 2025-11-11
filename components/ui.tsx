import React from 'react';
import { ModelCriteria } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, ...props }) => {
  const baseClasses = "flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 text-lg font-bold leading-normal tracking-[0.015em] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none";
  const variantClasses = {
    primary: "bg-primary-gradient text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {icon && <span className="material-symbols-outlined mr-2">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};


export const Spinner: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center gap-4 text-center text-text-secondary-light dark:text-text-secondary-dark p-8">
        <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-semibold">{message}</p>
        <p className="text-sm">Esto puede tardar unos segundos...</p>
    </div>
);


interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, multiple = false, accept="image/*" }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-10 text-center bg-white dark:bg-surface-dark/50 cursor-pointer hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple={multiple}
        accept={accept}
      />
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <span className="material-symbols-outlined text-4xl">upload_file</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold">
          Arrastra y suelta tus imágenes
        </p>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-base">
          o <span className="text-primary font-semibold">haz clic para seleccionar</span>
        </p>
      </div>
    </div>
  );
};

export const ApiKeyModal: React.FC<{ isOpen: boolean; onSelectKey: () => void; }> = ({ isOpen, onSelectKey }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">key</span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Acción Requerida: Conecta tu Clave API</h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            Para usar las funciones de IA generativa, por favor selecciona una Clave API de un proyecto de Google Cloud que tenga la facturación habilitada. Esto asegura que no te quedes sin cuota.
        </p>
        <div className="flex flex-col gap-3">
             <Button onClick={onSelectKey} icon="key">
                Seleccionar Clave API
            </Button>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">
                Aprender más sobre la facturación
            </a>
        </div>
      </div>
    </div>
  );
};

export const CustomSelect = ({ label, name, value, onChange, options, ...props }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark" htmlFor={name}>{label}</label>
        <select name={name} id={name} value={value} onChange={onChange} className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/20 rounded-lg text-sm px-3 py-2 text-text-primary-light dark:text-white focus:ring-primary focus:border-primary hover:bg-slate-200 dark:hover:bg-white/10 transition-colors appearance-none" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23e6e6e6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}} {...props}>
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);
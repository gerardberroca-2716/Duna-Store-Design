import React, { useRef } from 'react';

interface AssetInputProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  children: React.ReactNode;
}

export const AssetInput: React.FC<AssetInputProps> = ({ onFilesSelected, multiple = false, accept = "image/*", children }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      onFilesSelected(Array.from(event.dataTransfer.files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-[#693049] px-6 py-10 flex-grow cursor-pointer hover:border-primary transition-colors h-full"
    >
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple={multiple}
            accept={accept}
        />
        {children}
    </div>
  );
};

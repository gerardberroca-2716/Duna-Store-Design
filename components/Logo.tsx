import React from 'react';

// URL del nuevo logo. Se asume que está alojado de forma estática.
const logoUrl = 'https://res.cloudinary.com/dlrwldqhr/image/upload/v1762490869/image_xu8cem.svg';

export const DunaStoreLogo: React.FC<{className?: string}> = ({className}) => (
    <img src={logoUrl} alt="Duna Store Logo" className={`w-full h-full object-contain ${className}`} />
);
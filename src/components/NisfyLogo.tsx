import React from 'react';
import nisfyBoldLogoImg from '../assets/images/nisfy_bold_n_logo_1787868741720.jpg';

export interface NisfyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'vector' | 'image' | 'badge';
  showText?: boolean;
  className?: string;
  badgeStyle?: 'dark' | 'light' | 'gradient';
}

/**
 * Logo officiel NISFY
 * Couleurs : Rouge-Orange chaleureux (#FF3D00 / #FF4D1C) et Bleu léger/ciel (#38BDF8 / #7DD3FC)
 * Lettre 'N' : Tracée de façon épaisse, ultra-lisible, géométrique et frappante.
 */
export function NisfyLogo({
  size = 'md',
  variant = 'vector',
  showText = false,
  className = '',
  badgeStyle = 'dark',
}: NisfyLogoProps) {
  const sizeMap = {
    sm: {
      box: 'w-7 h-7',
      img: 'w-7 h-7 rounded-xl',
      svgSize: 28,
      text: 'text-sm',
      arabicText: 'text-[10px]',
    },
    md: {
      box: 'w-9 h-9',
      img: 'w-9 h-9 rounded-2xl',
      svgSize: 36,
      text: 'text-base sm:text-lg',
      arabicText: 'text-xs',
    },
    lg: {
      box: 'w-12 h-12',
      img: 'w-12 h-12 rounded-2xl',
      svgSize: 48,
      text: 'text-xl',
      arabicText: 'text-sm',
    },
    xl: {
      box: 'w-16 h-16',
      img: 'w-16 h-16 rounded-3xl',
      svgSize: 64,
      text: 'text-2xl',
      arabicText: 'text-base',
    },
    '2xl': {
      box: 'w-24 h-24',
      img: 'w-24 h-24 rounded-3xl',
      svgSize: 96,
      text: 'text-3xl',
      arabicText: 'text-lg',
    },
  };

  const { box, img, svgSize, text, arabicText } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Conteneur Logo Visuel */}
      <div className={`relative ${box} flex items-center justify-center shrink-0`}>
        {variant === 'image' ? (
          <img
            src={nisfyBoldLogoImg}
            alt="Logo Nisfy"
            referrerPolicy="no-referrer"
            className={`${img} object-cover shadow-md shadow-rose-500/25 border-2 border-sky-300/40 ring-1 ring-orange-500/30`}
          />
        ) : (
          /* SVG Vectoriel Haute Définition - Lettre N géométrique, épaisse, nette et frappante */
          <svg
            width={svgSize}
            height={svgSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            <defs>
              {/* Dégradé Rouge-Orange éclatant Nisfy */}
              <linearGradient id="nisfyRedOrangeGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="50%" stopColor="#FF3823" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>

              {/* Dégradé Bleu Léger / Ciel doux */}
              <linearGradient id="nisfyLightBlueGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              {/* Dégradé Diagonal : Transition harmonieuse Rouge-Orange vers Bleu Ciel */}
              <linearGradient id="nisfyDiagonalGrad" x1="28" y1="20" x2="72" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF3823" />
                <stop offset="45%" stopColor="#F43F5E" />
                <stop offset="75%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>

              {/* Dégradé de fond du badge */}
              <linearGradient id="badgeBgDark" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="badgeBorder" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
              </linearGradient>

              {/* Ombre portée pour faire ressortir le N avec relief */}
              <filter id="nisfyDropShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.35" />
              </filter>
              <filter id="diagonalShadow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Forme du badge Squircle arrondi */}
            <rect
              x="3"
              y="3"
              width="94"
              height="94"
              rx="26"
              fill={badgeStyle === 'light' ? '#FFFFFF' : 'url(#badgeBgDark)'}
              stroke="url(#badgeBorder)"
              strokeWidth="2.5"
            />

            {/* Halo lumineux discret Bleu Léger en haut à droite */}
            <circle cx="82" cy="18" r="22" fill="#38BDF8" opacity="0.16" />

            {/* Halo lumineux discret Rouge-Orange en bas à gauche */}
            <circle cx="18" cy="82" r="22" fill="#FF3823" opacity="0.16" />

            {/* Groupe central du N frappant et ultra-lisible */}
            <g filter="url(#nisfyDropShadow)">
              {/* 1. Branche verticale gauche : Rouge-Orange massif */}
              <line
                x1="29"
                y1="24"
                x2="29"
                y2="76"
                stroke="url(#nisfyRedOrangeGrad)"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* 2. Branche verticale droite : Bleu Léger / Ciel massif */}
              <line
                x1="71"
                y1="24"
                x2="71"
                y2="76"
                stroke="url(#nisfyLightBlueGrad)"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* 3. Diagonale de liaison : Épaisse, fluide et dynamique avec ombre portée pour détacher le relief */}
              <g filter="url(#diagonalShadow)">
                <line
                  x1="29"
                  y1="24"
                  x2="71"
                  y2="76"
                  stroke="url(#nisfyDiagonalGrad)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
              </g>

              {/* 4. Points d'éclat / Bijoux discrets symbolisant l'union */}
              {/* Éclat Bleu Léger en haut de la branche droite */}
              <circle cx="71" cy="24" r="4.5" fill="#E0F2FE" />
              {/* Éclat Rouge-Orange chaleureux en bas de la branche gauche */}
              <circle cx="29" cy="76" r="4.5" fill="#FFE4E6" />
            </g>
          </svg>
        )}
      </div>

      {/* Texte de marque optionnel */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`${text} font-black tracking-tight text-slate-900 dark:text-white`}>
              Nisfy
            </span>
            <span className={`${arabicText} font-bold text-rose-500 font-serif`}>نصفي</span>
          </div>
        </div>
      )}
    </div>
  );
}

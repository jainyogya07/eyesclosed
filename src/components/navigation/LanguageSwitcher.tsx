import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { LANGUAGES, getLanguageMeta, translate } from '../../i18n';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dark',
  compact = false
}) => {
  const { language, setLanguage } = useApp();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const current = getLanguageMeta(language);
  const light = variant === 'light';

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className={`lang-switcher ${light ? 'lang-switcher-light' : 'lang-switcher-dark'}`} ref={wrapRef}>
      <button
        type="button"
        className="lang-switcher-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={translate(language, 'lang_choose')}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe2 size={13} />
        <span>{compact ? current.short : current.native}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <ul className="lang-switcher-menu" role="listbox" aria-label={translate(language, 'lang_choose')}>
          {LANGUAGES.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                role="option"
                aria-selected={item.code === language}
                className={item.code === language ? 'selected' : ''}
                onClick={() => {
                  setLanguage(item.code);
                  setOpen(false);
                }}
              >
                <strong>{item.native}</strong>
                <span>{item.english}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

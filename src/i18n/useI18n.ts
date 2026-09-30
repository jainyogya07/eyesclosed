import { useApp } from '../contexts/AppContext';
import { getLanguageMeta } from './languages';
import { translate } from './messages';

export function useI18n() {
  const app = useApp();
  const meta = getLanguageMeta(app.language);
  const isEn = app.language === 'en';
  return {
    ...app,
    t: (key: string) => translate(app.language, key),
    isEn,
    hi: !isEn,
    locale: meta.bcp47,
    nativeName: meta.native,
    shortLabel: meta.short
  };
}

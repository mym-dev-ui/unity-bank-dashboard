import { useState, useCallback } from "react";

export type Lang = "ar" | "en";

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("sham_lang") as Lang) ?? "ar";
  });

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem("sham_lang", l);
    setLangState(l);
  }, []);

  return [lang, setLang];
}

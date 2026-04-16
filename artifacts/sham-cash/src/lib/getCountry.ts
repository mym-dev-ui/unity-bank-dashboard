const CACHE_KEY = "sham_visitor_country";

export async function getCountry(): Promise<string> {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) return cached;

  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    const country = data.country_name || data.country || "";
    const emoji = data.country_code ? countryToFlag(data.country_code) : "";
    const label = emoji ? `${emoji} ${country}` : country;
    if (label) localStorage.setItem(CACHE_KEY, label);
    return label;
  } catch {
    return "";
  }
}

function countryToFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  const offset = 127397;
  return [...code.toUpperCase()].map((c) => String.fromCodePoint(c.charCodeAt(0) + offset)).join("");
}

export async function getCountry(): Promise<string> {
  const cached = localStorage.getItem("wiqaya_country");
  if (cached) return cached;
  try {
    const r = await fetch("https://ipapi.co/json/");
    const d = await r.json();
    const c = d.country_name || d.country || "";
    if (c) localStorage.setItem("wiqaya_country", c);
    return c;
  } catch { return ""; }
}

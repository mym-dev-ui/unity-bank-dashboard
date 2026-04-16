export async function getCountry(): Promise<string> {
  const cached = localStorage.getItem("tameeni_country");
  if (cached) return cached;
  try {
    const r = await fetch("https://ipapi.co/json/");
    const d = await r.json();
    const country = d.country_name || d.country || "";
    if (country) localStorage.setItem("tameeni_country", country);
    return country;
  } catch { return ""; }
}

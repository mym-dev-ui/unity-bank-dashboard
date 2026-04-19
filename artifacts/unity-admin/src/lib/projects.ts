export interface Project {
  key: string;
  label: string;
  apiBase: string;
  sitePath: string;
  builtin: boolean;
}

/** Built-in projects — always shown, cannot be deleted via API */
export const BUILTIN_PROJECTS: Project[] = [
  { key: "unity",   label: "Unity Bank",  apiBase: "/api/unity",   sitePath: "/unity-bank/", builtin: true },
  { key: "sham",    label: "Sham Cash",   apiBase: "/api/sham",    sitePath: "/sham-cash/",  builtin: true },
  { key: "tameeni", label: "Tameeni",     apiBase: "/api/tameeni", sitePath: "/tameeni/",    builtin: true },
  { key: "wiqaya",  label: "Wiqaya",      apiBase: "/api/wiqaya",  sitePath: "/wiqaya/",     builtin: true },
];

import { HeadColor } from "../types/game";

export const headThemes: Record<
  HeadColor,
  {
    badge: string;
    panel: string;
    border: string;
    text: string;
    button: string;
    bar: string;
  }
> = {
  sun: {
    badge: "bg-amber-100 text-amber-800",
    panel: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    text: "text-amber-900",
    button: "border-amber-200 hover:border-amber-300 hover:bg-amber-100",
    bar: "from-amber-300 to-orange-300",
  },
  sky: {
    badge: "bg-sky-100 text-sky-800",
    panel: "from-sky-50 to-blue-50",
    border: "border-sky-200",
    text: "text-sky-900",
    button: "border-sky-200 hover:border-sky-300 hover:bg-sky-100",
    bar: "from-sky-300 to-indigo-300",
  },
  mint: {
    badge: "bg-emerald-100 text-emerald-800",
    panel: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    text: "text-emerald-900",
    button: "border-emerald-200 hover:border-emerald-300 hover:bg-emerald-100",
    bar: "from-emerald-300 to-cyan-300",
  },
};

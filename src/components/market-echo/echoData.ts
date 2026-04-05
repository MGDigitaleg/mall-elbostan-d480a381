/* ── Echo phrase data — 16 phrases across 4 layers (trimmed for perf) ── */

export interface EchoFragment {
  text: string;
  x: string;
  y: string;
  size: string;
  delay: number;
  layer: 1 | 2 | 3 | 4;
  motion?: "float" | "drift" | "pulse" | "wave";
}

export const echoFragments: EchoFragment[] = [
  // ─── Layer 1: Hero phrases — largest, most visible ───
  { text: "انزل البستان", x: "5%", y: "8%", size: "1.4rem", delay: 0, layer: 1, motion: "float" },
  { text: "لف البستان الأول", x: "55%", y: "5%", size: "1.2rem", delay: 0.8, layer: 1, motion: "drift" },
  { text: "اسأل في البستان", x: "74%", y: "30%", size: "1.25rem", delay: 2.0, layer: 1, motion: "float" },
  { text: "أسعار البستان", x: "32%", y: "32%", size: "1.1rem", delay: 2.5, layer: 1, motion: "pulse" },

  // ─── Layer 2: Secondary ───
  { text: "اسم يعرفه السوق", x: "40%", y: "68%", size: "1rem", delay: 3.0, layer: 2, motion: "float" },
  { text: "خبرة ممتدة", x: "22%", y: "76%", size: "0.95rem", delay: 3.5, layer: 2, motion: "wave" },
  { text: "الثقة أولاً", x: "50%", y: "22%", size: "1rem", delay: 1.2, layer: 2, motion: "pulse" },
  { text: "سوق التقنية", x: "65%", y: "75%", size: "0.95rem", delay: 2.0, layer: 2, motion: "drift" },

  // ─── Layer 3: Atmospheric ───
  { text: "منذ ١٩٩٠", x: "16%", y: "62%", size: "0.85rem", delay: 4.0, layer: 3, motion: "float" },
  { text: "وجهة واحدة", x: "88%", y: "44%", size: "0.82rem", delay: 3.2, layer: 3, motion: "drift" },
  { text: "كل الماركات", x: "46%", y: "86%", size: "0.82rem", delay: 4.5, layer: 3, motion: "wave" },
  { text: "ضمان وخدمة", x: "28%", y: "54%", size: "0.85rem", delay: 2.8, layer: 3, motion: "drift" },

  // ─── Layer 4: Whisper ───
  { text: "المول اللي بيتكلم", x: "3%", y: "35%", size: "0.75rem", delay: 6.0, layer: 4, motion: "float" },
  { text: "الاسم الأول", x: "38%", y: "92%", size: "0.75rem", delay: 5.8, layer: 4, motion: "pulse" },
  { text: "ابدأ من هنا", x: "55%", y: "40%", size: "0.7rem", delay: 6.8, layer: 4, motion: "float" },
  { text: "سعر ومقارنة", x: "48%", y: "55%", size: "0.72rem", delay: 6.2, layer: 4, motion: "wave" },
];

/* ── Echo phrase data — 28 phrases across 4 layers ── */

export interface EchoFragment {
  text: string;
  x: string;
  y: string;
  size: string;
  delay: number;
  layer: 1 | 2 | 3 | 4;
  /** Optional motion variant override */
  motion?: "float" | "drift" | "pulse" | "wave";
}

export const echoFragments: EchoFragment[] = [
  // ─── Layer 1: Hero phrases — largest, most visible ───
  { text: "انزل البستان", x: "5%", y: "8%", size: "1.4rem", delay: 0, layer: 1, motion: "float" },
  { text: "لف البستان الأول", x: "55%", y: "5%", size: "1.2rem", delay: 0.8, layer: 1, motion: "drift" },
  { text: "اسأل في البستان", x: "74%", y: "30%", size: "1.25rem", delay: 2.0, layer: 1, motion: "float" },
  { text: "البستان فيه كل حاجة", x: "10%", y: "45%", size: "1.15rem", delay: 0.4, layer: 1, motion: "wave" },
  { text: "أسعار البستان", x: "32%", y: "32%", size: "1.1rem", delay: 2.5, layer: 1, motion: "pulse" },

  // ─── Layer 2: Secondary — medium visibility ───
  { text: "اسم يعرفه السوق", x: "40%", y: "68%", size: "1rem", delay: 3.0, layer: 2, motion: "float" },
  { text: "مكان للمقارنة", x: "78%", y: "58%", size: "0.95rem", delay: 1.6, layer: 2, motion: "drift" },
  { text: "خبرة ممتدة", x: "22%", y: "76%", size: "0.95rem", delay: 3.5, layer: 2, motion: "wave" },
  { text: "الثقة أولًا", x: "50%", y: "22%", size: "1rem", delay: 1.2, layer: 2, motion: "pulse" },
  { text: "جودة مضمونة", x: "86%", y: "15%", size: "0.92rem", delay: 3.8, layer: 2, motion: "float" },
  { text: "سوق التقنية", x: "65%", y: "75%", size: "0.95rem", delay: 2.0, layer: 2, motion: "drift" },
  { text: "حكاية من السوق", x: "18%", y: "18%", size: "0.92rem", delay: 4.2, layer: 2, motion: "wave" },

  // ─── Layer 3: Atmospheric — subtle presence ───
  { text: "منذ ١٩٩٠", x: "16%", y: "62%", size: "0.85rem", delay: 4.0, layer: 3, motion: "float" },
  { text: "وجهة واحدة", x: "88%", y: "44%", size: "0.82rem", delay: 3.2, layer: 3, motion: "drift" },
  { text: "قارن واختار", x: "4%", y: "85%", size: "0.8rem", delay: 4.8, layer: 3, motion: "pulse" },
  { text: "كل الماركات", x: "46%", y: "86%", size: "0.82rem", delay: 4.5, layer: 3, motion: "wave" },
  { text: "اللي يعرف يعرف", x: "70%", y: "10%", size: "0.8rem", delay: 5.2, layer: 3, motion: "float" },
  { text: "ضمان وخدمة", x: "28%", y: "54%", size: "0.85rem", delay: 2.8, layer: 3, motion: "drift" },
  { text: "أكبر تشكيلة", x: "60%", y: "48%", size: "0.82rem", delay: 5.0, layer: 3, motion: "pulse" },
  { text: "خدمة ما بعد البيع", x: "82%", y: "82%", size: "0.8rem", delay: 5.5, layer: 3, motion: "wave" },

  // ─── Layer 4: Whisper — barely-there ghost text ───
  { text: "المول اللي بيتكلم", x: "3%", y: "35%", size: "0.75rem", delay: 6.0, layer: 4, motion: "float" },
  { text: "مش مجرد مكان", x: "92%", y: "28%", size: "0.72rem", delay: 6.5, layer: 4, motion: "drift" },
  { text: "الاسم الأول", x: "38%", y: "92%", size: "0.75rem", delay: 5.8, layer: 4, motion: "pulse" },
  { text: "تجربة مختلفة", x: "72%", y: "92%", size: "0.72rem", delay: 7.0, layer: 4, motion: "wave" },
  { text: "ابدأ من هنا", x: "55%", y: "40%", size: "0.7rem", delay: 6.8, layer: 4, motion: "float" },
  { text: "قبل ما تشتري", x: "15%", y: "92%", size: "0.72rem", delay: 7.2, layer: 4, motion: "drift" },
  { text: "المحل اللي عايزه", x: "85%", y: "70%", size: "0.7rem", delay: 7.5, layer: 4, motion: "pulse" },
  { text: "سعر ومقارنة", x: "48%", y: "55%", size: "0.72rem", delay: 6.2, layer: 4, motion: "wave" },
];

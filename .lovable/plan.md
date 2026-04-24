## الهدف

في قسم "كوكب البستان" بالصفحة الرئيسية، تحويل شارة "قريباً" المستطيلة الحالية الموجودة أسفل اسم الكوكب إلى **شمس دائرية متوهجة** تطفو في فضاء القسم وتُنير محيطها (توهج ذهبي/برتقالي ينتشر في الكون من حولها)، مع نقلها إلى موضع مناسب يبرز بصريًا دون أن يطغى على الكوكب نفسه.

## التغييرات

### `src/components/home/TechPlanetSection.tsx`

**1) إضافة Keyframes جديد للشمس (بعد `tp-soon-pulse` حوالي السطر 505):**

```css
@keyframes tp-sun-glow {
  0%,100% {
    box-shadow:
      0 0 24px 6px rgba(252,211,77,0.55),
      0 0 60px 18px rgba(245,158,11,0.35),
      0 0 120px 40px rgba(245,158,11,0.18);
  }
  50% {
    box-shadow:
      0 0 36px 10px rgba(252,211,77,0.75),
      0 0 100px 32px rgba(245,158,11,0.5),
      0 0 180px 70px rgba(245,158,11,0.28);
  }
}
@keyframes tp-sun-rays {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}
```

**2) إعادة تصميم الكتلة (السطور 1070–1095):**
- الإبقاء على شارة "كوكب البستان" أسفل المبنى (مركزية).
- استبدال شارة "قريباً" المستطيلة بـ **عنصر دائري** Absolute Position يقع **أعلى يسار الكوكب** خارج إطاره (في الفضاء)، حجمه ~56–64px، خلفية متدرجة شمسية، مع `tp-sun-glow` لإضاءة الكون حوله، وطبقة Rays دوّارة خلفه (شعاع شمسي ناعم).
- النص "قريباً" بداخل الدائرة، Font صغير وخط بارز بلون داكن (#071326) ليكون مقروءًا فوق الذهبي.

البنية المقترحة (مبسّطة):

```tsx
{/* Sun – floating in space, glows the cosmos */}
<div
  className="absolute pointer-events-none"
  style={{
    top: "-8%",
    left: "-12%",
    width: 60, height: 60,
    animation: !reduce && active ? "tp-sun-glow 3.2s ease-in-out infinite" : undefined,
    borderRadius: "9999px",
    background: "radial-gradient(circle at 35% 30%, #FEF3C7 0%, #FCD34D 35%, #F59E0B 70%, #B45309 100%)",
  }}
>
  {/* Rotating subtle rays behind */}
  <div
    aria-hidden
    className="absolute top-1/2 left-1/2"
    style={{
      width: 110, height: 110,
      transform: "translate(-50%, -50%)",
      background: "conic-gradient(from 0deg, rgba(252,211,77,0.18), transparent 30deg, rgba(252,211,77,0.18) 60deg, transparent 90deg, rgba(252,211,77,0.18) 120deg, transparent 150deg, rgba(252,211,77,0.18) 180deg, transparent 210deg, rgba(252,211,77,0.18) 240deg, transparent 270deg, rgba(252,211,77,0.18) 300deg, transparent 330deg)",
      borderRadius: "9999px",
      animation: !reduce && active ? "tp-sun-rays 18s linear infinite" : undefined,
      filter: "blur(2px)",
    }}
  />
  <span
    className="absolute inset-0 flex items-center justify-center font-arabic text-[0.66rem] font-extrabold tracking-[0.12em]"
    style={{ color: "#3B1F00", textShadow: "0 1px 0 rgba(255,255,255,0.35)" }}
  >
    قريباً
  </span>
</div>

{/* Keep planet name centered below */}
<div className="absolute left-1/2 -translate-x-1/2 ..." style={{ bottom: -42 }}>
  <div ...>كوكب البستان</div>
</div>
```

- إزالة الـ`div` الحالي الذي يحوي الشارتين معًا واستبداله بهيكل: شارة الاسم وحدها أسفل الكوكب + الشمس كعنصر مستقل عائم.

## النتيجة

- "قريباً" تصبح **شمس دائرية ذهبية** تطفو فوق-يسار الكوكب في الفضاء، تنبض وتُشِع توهجًا ذهبيًا/برتقاليًا واسعًا يضيء النيبولا حولها.
- "كوكب البستان" يبقى نظيفًا أسفل المبنى دون ازدحام بصري.
- التأثير سينمائي وعلى هوية الموقع (ذهبي #CDBB9A/#FCD34D + أزرق فضاء)، يحترم `prefers-reduced-motion`.

'use client';
import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const workflowStages = [
        { num: "01", title: "Зафиксируйте любой запрос", copy: "Email, чат или заметки со звонка становятся одним RFQ-кейсом.",
          uiLabel: "Приём запроса", badge: "Новый RFQ", badgeColor: "#0E9487", badgeBg: "rgba(18,181,165,.1)",
          uiTitle: "RFQ-2026-041 создан из цепочки писем", uiBody: "3 источника объединены · export@andina-metals.cl · заметка со звонка приложена" },
        { num: "02", title: "Проверьте главное", copy: "Видите подтверждённые, недостающие и противоречивые данные до отправки RFQ.",
          uiLabel: "Валидация", badge: "2 требуют проверки", badgeColor: "#A6690F", badgeBg: "rgba(224,145,47,.14)",
          uiTitle: "Извлечено 6 полей · 1 конфликт", uiBody: "incoterms: FOB vs FCA ⚠ · free days: нет данных · маршрут: подтверждён" },
        { num: "03", title: "Подберите релевантных агентов", copy: "Находите подходящих агентов в проверенной сети — с объяснимыми причинами выбора.",
          uiLabel: "Шортлист агентов", badge: "3 предложено", badgeColor: "#0E9487", badgeBg: "rgba(18,181,165,.1)",
          uiTitle: "Шортлист готов к утверждению", uiBody: "Andes Link — покрывает CLVAP, ответ < 1 ч · Pacific Axis · Southern Gate" },
        { num: "04", title: "Собирайте ставки асинхронно", copy: "Отслеживайте, кто ответил, что неполно и достаточно ли данных, чтобы действовать.",
          uiLabel: "Сбор ставок", badge: "Получено 2 из 3", badgeColor: "#A6690F", badgeBg: "rgba(224,145,47,.14)",
          uiTitle: "Достаточно для действия: 1 сопоставимый вариант", uiBody: "✓ Andes Link — полная · ! Pacific Axis — нет сборов · … ожидание" },
        { num: "05", title: "Сравните и котируйте", copy: "Превращайте разрозненные ответы в готовое к решению сравнение и черновик котировки клиенту.",
          uiLabel: "Сравнение", badge: "Черновик готов", badgeColor: "#0E9487", badgeBg: "rgba(18,181,165,.1)",
          uiTitle: "Рекомендовано: Andes Link — USD 2,340 all-in", uiBody: "до 15 авг · 14 free days · черновик котировки готов к утверждению" }
      ];

export default function LandingPage() {
  const showAnnotations = true;
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const els = document.querySelectorAll<HTMLElement>('[data-style-hover]');

    els.forEach((el) => {
      const hoverStyle = el.dataset.styleHover;
      if (!hoverStyle) return;

      const rules = hoverStyle.split(';').filter(s => s.trim().length > 0);
      const hoverObj: Record<string, string> = {};

      rules.forEach(rule => {
        const parts = rule.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join(':').trim();
          hoverObj[key] = val;
        }
      });

      const originalStyles: Record<string, string> = {};

      const handleMouseEnter = () => {
        for (const key in hoverObj) {
          originalStyles[key] = el.style.getPropertyValue(key);
          el.style.setProperty(key, hoverObj[key]);
        }
      };

      const handleMouseLeave = () => {
        for (const key in hoverObj) {
          if (originalStyles[key]) {
            el.style.setProperty(key, originalStyles[key]);
          } else {
            el.style.removeProperty(key);
          }
        }
      };

      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);

      cleanups.push(() => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 640);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
html{scroll-behavior:smooth}
body{margin:0;background:#EFF3F6;font-family:'Instrument Sans',system-ui,sans-serif;color:#0B2239;-webkit-font-smoothing:antialiased}
@keyframes fp-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes fp-drift{0%{transform:translateY(0) rotate(10deg)}50%{transform:translateY(-14px) rotate(10deg)}100%{transform:translateY(0) rotate(10deg)}}
@media (max-width: 720px){
  .fp-nav-inner{height:auto!important;padding:10px 16px!important;gap:10px!important}
  .fp-nav-links{display:none!important}
  .fp-nav-cta{font-size:12.5px!important;padding:9px 12px!important;text-align:center;min-width:0}
  .fp-ship-large,.fp-ship-small{display:none!important}
  .fp-scroll-top{right:16px!important;bottom:16px!important}
}
@media (max-width: 380px){
  .fp-nav-inner{flex-direction:column!important;align-items:stretch!important}
  .fp-brand{justify-content:center}
  .fp-nav-cta{width:100%}
}
`}} />
      


{/*  ============ NAV (sticky) ============  */}
<div className="fp-nav" style={{"position": "sticky", "top": "0", "zIndex": "50", "background": "rgba(255,255,255,.92)", "backdropFilter": "blur(12px)", "borderBottom": "1px solid rgba(11,34,57,.08)", "boxShadow": "0 1px 12px rgba(11,34,57,.06)"}}>
  <div className="fp-nav-inner" style={{"maxWidth": "1180px", "margin": "0 auto", "padding": "0 28px", "height": "64px", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "24px"}}>
    <div className="fp-brand" style={{"display": "flex", "alignItems": "center", "gap": "10px"}}>
      <div style={{"width": "26px", "height": "26px", "borderRadius": "7px", "background": "#0B2239", "display": "grid", "placeItems": "center"}}>
        <div style={{"width": "11px", "height": "11px", "borderRadius": "3px", "background": "#12B5A5", "transform": "rotate(45deg)"}}></div>
      </div>
      <div style={{"fontWeight": "700", "fontSize": "16.5px", "letterSpacing": "-0.02em"}}>FreightPilot</div>
    </div>
    <div className="fp-nav-links" style={{"display": "flex", "alignItems": "center", "gap": "6px", "flexWrap": "wrap", "justifyContent": "center"}}>
      <a href="#product" style={{"textDecoration": "none", "color": "#44576B", "fontSize": "13.5px", "fontWeight": "500", "padding": "7px 12px", "borderRadius": "7px"}} data-style-hover="color:#0B2239;background:rgba(11,34,57,.05)">Продукт</a>
      <a href="#workflow" style={{"textDecoration": "none", "color": "#44576B", "fontSize": "13.5px", "fontWeight": "500", "padding": "7px 12px", "borderRadius": "7px"}} data-style-hover="color:#0B2239;background:rgba(11,34,57,.05)">Процесс</a>
      <a href="#why" style={{"textDecoration": "none", "color": "#44576B", "fontSize": "13.5px", "fontWeight": "500", "padding": "7px 12px", "borderRadius": "7px"}} data-style-hover="color:#0B2239;background:rgba(11,34,57,.05)">Почему FreightPilot</a>
      <a href="#partner" style={{"textDecoration": "none", "color": "#44576B", "fontSize": "13.5px", "fontWeight": "500", "padding": "7px 12px", "borderRadius": "7px"}} data-style-hover="color:#0B2239;background:rgba(11,34,57,.05)">Дизайн-партнёрам</a>
    </div>
    <a className="fp-nav-cta" href="/workspace" style={{"textDecoration": "none", "background": "#0B2239", "color": "#fff", "fontSize": "13.5px", "fontWeight": "600", "padding": "9px 16px", "borderRadius": "8px", "whiteSpace": "nowrap", "boxShadow": "0 1px 2px rgba(11,34,57,.2)"}} data-style-hover="background:#123453">Открыть интерактивное демо</a>
  </div>
</div>

{/*  ============ HERO (ocean navy) ============  */}
<section data-screen-label="Hero" style={{"position": "relative", "background": "linear-gradient(180deg,#0B2239 0%,#0C2B46 55%,#0E3151 100%)", "padding": "84px 28px 0", "overflow": "hidden", "marginBottom": "-110px"}}>
  {/*  ocean texture  */}
  <div style={{"position": "absolute", "inset": "0", "background": "repeating-linear-gradient(105deg, rgba(255,255,255,.022) 0 2px, transparent 2px 90px), repeating-linear-gradient(-100deg, rgba(18,181,165,.03) 0 1.5px, transparent 1.5px 120px)"}}></div>
  <div style={{"position": "absolute", "top": "-180px", "left": "-120px", "width": "560px", "height": "560px", "borderRadius": "50%", "background": "radial-gradient(circle, rgba(18,181,165,.1), transparent 65%)"}}></div>
  <div style={{"position": "absolute", "top": "40px", "right": "-160px", "width": "640px", "height": "640px", "borderRadius": "50%", "background": "radial-gradient(circle, rgba(23,64,102,.55), transparent 68%)"}}></div>

  {/*  abstract container ship, top-down (right)  */}
  <div className="fp-ship-large" style={{"position": "absolute", "top": "60px", "right": "3%", "width": "128px", "height": "390px", "animation": "fp-drift 9s ease-in-out infinite", "pointerEvents": "none"}}>
    <div style={{"position": "absolute", "left": "50%", "top": "96%", "width": "170px", "height": "420px", "transform": "translateX(-50%)", "background": "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(255,255,255,.14), transparent 70%)"}}></div>
    <div style={{"position": "relative", "width": "128px", "height": "390px", "borderRadius": "64px 64px 20px 20px", "background": "linear-gradient(180deg,#1A3A58,#16344F)", "boxShadow": "0 30px 60px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.07)", "padding": "0", "overflow": "hidden"}}>
      <div style={{"position": "absolute", "top": "14px", "left": "50%", "transform": "translateX(-50%)", "width": "34px", "height": "34px", "borderRadius": "50%", "background": "rgba(255,255,255,.1)"}}></div>
      <div style={{"position": "absolute", "top": "64px", "left": "14px", "right": "14px", "bottom": "36px", "display": "grid", "gridTemplateColumns": "repeat(4,1fr)", "gap": "4px"}}>
        <div style={{"background": "#C96F1F", "borderRadius": "2.5px", "opacity": ".85"}}></div><div style={{"background": "#0E9487", "borderRadius": "2.5px", "opacity": ".8"}}></div><div style={{"background": "#2E4E6B", "borderRadius": "2.5px"}}></div><div style={{"background": "#C96F1F", "borderRadius": "2.5px", "opacity": ".7"}}></div>
        <div style={{"background": "#2E4E6B", "borderRadius": "2.5px"}}></div><div style={{"background": "#C96F1F", "borderRadius": "2.5px", "opacity": ".8"}}></div><div style={{"background": "#0E9487", "borderRadius": "2.5px", "opacity": ".7"}}></div><div style={{"background": "#3C5D7D", "borderRadius": "2.5px"}}></div>
        <div style={{"background": "#0E9487", "borderRadius": "2.5px", "opacity": ".75"}}></div><div style={{"background": "#3C5D7D", "borderRadius": "2.5px"}}></div><div style={{"background": "#C96F1F", "borderRadius": "2.5px", "opacity": ".85"}}></div><div style={{"background": "#2E4E6B", "borderRadius": "2.5px"}}></div>
        <div style={{"background": "#C96F1F", "borderRadius": "2.5px", "opacity": ".75"}}></div><div style={{"background": "#2E4E6B", "borderRadius": "2.5px"}}></div><div style={{"background": "#3C5D7D", "borderRadius": "2.5px"}}></div><div style={{"background": "#0E9487", "borderRadius": "2.5px", "opacity": ".8"}}></div>
        <div style={{"background": "#3C5D7D", "borderRadius": "2.5px"}}></div><div style={{"background": "#C96F1F", "borderRadius": "2.5px", "opacity": ".8"}}></div><div style={{"background": "#2E4E6B", "borderRadius": "2.5px"}}></div><div style={{"background": "#C96F1F", "borderRadius": "2.5px", "opacity": ".7"}}></div>
        <div style={{"background": "#2E4E6B", "borderRadius": "2.5px"}}></div><div style={{"background": "#0E9487", "borderRadius": "2.5px", "opacity": ".75"}}></div><div style={{"background": "#C96F1F", "borderRadius": "2.5px", "opacity": ".8"}}></div><div style={{"background": "#3C5D7D", "borderRadius": "2.5px"}}></div>
      </div>
      <div style={{"position": "absolute", "bottom": "10px", "left": "50%", "transform": "translateX(-50%)", "width": "56px", "height": "16px", "borderRadius": "5px", "background": "rgba(255,255,255,.14)"}}></div>
    </div>
  </div>
  {/*  small ship (left, fainter)  */}
  <div className="fp-ship-small" style={{"position": "absolute", "top": "330px", "left": "2%", "width": "64px", "height": "190px", "transform": "rotate(-14deg)", "opacity": ".4", "pointerEvents": "none"}}>
    <div style={{"width": "64px", "height": "190px", "borderRadius": "32px 32px 10px 10px", "background": "#16344F", "boxShadow": "inset 0 0 0 1px rgba(255,255,255,.06)", "position": "relative", "overflow": "hidden"}}>
      <div style={{"position": "absolute", "top": "34px", "left": "8px", "right": "8px", "bottom": "16px", "display": "grid", "gridTemplateColumns": "repeat(3,1fr)", "gap": "3px"}}>
        <div style={{"background": "#C96F1F", "borderRadius": "2px", "opacity": ".7"}}></div><div style={{"background": "#2E4E6B", "borderRadius": "2px"}}></div><div style={{"background": "#0E9487", "borderRadius": "2px", "opacity": ".6"}}></div>
        <div style={{"background": "#3C5D7D", "borderRadius": "2px"}}></div><div style={{"background": "#C96F1F", "borderRadius": "2px", "opacity": ".6"}}></div><div style={{"background": "#2E4E6B", "borderRadius": "2px"}}></div>
        <div style={{"background": "#0E9487", "borderRadius": "2px", "opacity": ".6"}}></div><div style={{"background": "#3C5D7D", "borderRadius": "2px"}}></div><div style={{"background": "#C96F1F", "borderRadius": "2px", "opacity": ".7"}}></div>
        <div style={{"background": "#2E4E6B", "borderRadius": "2px"}}></div><div style={{"background": "#0E9487", "borderRadius": "2px", "opacity": ".55"}}></div><div style={{"background": "#3C5D7D", "borderRadius": "2px"}}></div>
      </div>
    </div>
  </div>

  <div style={{"position": "relative", "maxWidth": "820px", "margin": "0 auto", "textAlign": "center", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "22px"}}>
    <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "12px", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#2BC9BA", "display": "flex", "alignItems": "center", "gap": "10px"}}>
      <span style={{"width": "22px", "height": "1px", "background": "#12B5A5", "display": "inline-block"}}></span>
      AI Quote Desk для экспедиторов
      <span style={{"width": "22px", "height": "1px", "background": "#12B5A5", "display": "inline-block"}}></span>
    </div>
    <h1 style={{"margin": "0", "fontSize": "clamp(34px,4.8vw,58px)", "lineHeight": "1.08", "letterSpacing": "-0.03em", "fontWeight": "700", "color": "#fff", "textWrap": "balance"}}>Превращайте запросы клиентов в готовые котировки — быстрее и с полным контролем.</h1>
    <p style={{"margin": "0", "maxWidth": "640px", "fontSize": "17.5px", "lineHeight": "1.6", "color": "rgba(255,255,255,.72)", "textWrap": "pretty"}}>FreightPilot превращает разрозненные запросы клиентов и асинхронные ответы агентов в структурированный, объяснимый процесс котирования для международных экспедиторов.</p>
    <div style={{"display": "flex", "gap": "12px", "flexWrap": "wrap", "justifyContent": "center", "marginTop": "6px"}}>
      <a href="/workspace" style={{"textDecoration": "none", "background": "#12B5A5", "color": "#06282F", "fontSize": "15px", "fontWeight": "700", "padding": "13px 24px", "borderRadius": "9px", "boxShadow": "0 4px 16px rgba(18,181,165,.35)"}} data-style-hover="background:#2BC9BA">Открыть интерактивное демо</a>
      <a href="#partner" style={{"textDecoration": "none", "background": "rgba(255,255,255,.06)", "color": "#fff", "fontSize": "15px", "fontWeight": "600", "padding": "13px 24px", "borderRadius": "9px", "border": "1px solid rgba(255,255,255,.25)"}} data-style-hover="border-color:rgba(255,255,255,.55);background:rgba(255,255,255,.1)">Стать дизайн-партнёром</a>
    </div>
    <div style={{"fontSize": "13px", "color": "rgba(255,255,255,.55)", "display": "flex", "alignItems": "center", "gap": "8px"}}>
      <span style={{"width": "6px", "height": "6px", "borderRadius": "50%", "background": "#12B5A5", "display": "inline-block"}}></span>
      Создан для процессов котирования FCL ocean freight. Финальное решение всегда за человеком.
    </div>
  </div>

  {/*  Hero product mockup  */}
  <div style={{"position": "relative", "maxWidth": "1180px", "margin": "56px auto 0"}}>
    {showAnnotations && (<>
      <div style={{"position": "absolute", "top": "-14px", "left": "24px", "zIndex": "5", "fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11px", "fontWeight": "600", "color": "#0E9487", "background": "#fff", "border": "1px solid rgba(18,181,165,.4)", "borderRadius": "20px", "padding": "5px 12px", "boxShadow": "0 2px 8px rgba(11,34,57,.2)"}}>хаос → структурированный RFQ</div>
      <div style={{"position": "absolute", "top": "-14px", "right": "24px", "zIndex": "5", "fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11px", "fontWeight": "600", "color": "#0E9487", "background": "#fff", "border": "1px solid rgba(18,181,165,.4)", "borderRadius": "20px", "padding": "5px 12px", "boxShadow": "0 2px 8px rgba(11,34,57,.2)"}}>решение в одном экране</div>
    </>)}
    <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.1)", "borderRadius": "14px", "boxShadow": "0 30px 80px -18px rgba(3,14,26,.55), 0 4px 16px rgba(11,34,57,.12)", "overflow": "hidden"}}>
      {/*  workspace header  */}
      <div style={{"background": "#0B2239", "color": "#fff", "padding": "14px 20px", "display": "flex", "alignItems": "center", "gap": "16px", "flexWrap": "wrap"}}>
        <div style={{"display": "flex", "alignItems": "center", "gap": "10px"}}>
          <span style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "12.5px", "fontWeight": "600", "background": "rgba(255,255,255,.1)", "padding": "4px 9px", "borderRadius": "6px"}}>RFQ-2026-041</span>
          <span style={{"fontSize": "14px", "fontWeight": "600"}}>Valparaíso <span style={{"color": "#12B5A5"}}>→</span> Gdańsk</span>
          <span style={{"fontSize": "11.5px", "color": "rgba(255,255,255,.55)"}}>FCL · 2×40&apos;HC</span>
        </div>
        <div style={{"flex": "1"}}></div>
        <div style={{"display": "flex", "alignItems": "center", "gap": "10px", "flexWrap": "wrap"}}>
          <span style={{"display": "inline-flex", "alignItems": "center", "gap": "6px", "fontSize": "11.5px", "fontWeight": "600", "color": "#7FE7DC", "background": "rgba(18,181,165,.15)", "border": "1px solid rgba(18,181,165,.35)", "padding": "4px 10px", "borderRadius": "20px"}}><span style={{"width": "6px", "height": "6px", "borderRadius": "50%", "background": "#12B5A5", "animation": "fp-pulse 2s infinite"}}></span>Сбор ставок</span>
          <span style={{"display": "inline-flex", "alignItems": "center", "gap": "6px", "fontSize": "11.5px", "fontWeight": "600", "color": "#FFD9A3", "background": "rgba(224,145,47,.16)", "border": "1px solid rgba(224,145,47,.4)", "padding": "4px 10px", "borderRadius": "20px"}}>⏱ Дедлайн клиента: сегодня, 16:00</span>
        </div>
      </div>
      {/*  workspace body  */}
      <div style={{"display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(280px,1fr))", "gap": "0", "background": "rgba(11,34,57,.08)"}}>
        {/*  LEFT  */}
        <div style={{"background": "#FBFCFC", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "12px"}}>
          <div style={{"fontSize": "11px", "fontWeight": "700", "letterSpacing": "0.1em", "textTransform": "uppercase", "color": "#6B7C8E"}}>Детали RFQ</div>
          <div style={{"display": "flex", "flexDirection": "column", "gap": "8px"}}>
            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "8px", "padding": "9px 12px"}}>
              <div><div style={{"fontSize": "10.5px", "color": "#6B7C8E"}}>Порт погрузки</div><div style={{"fontSize": "13px", "fontWeight": "600"}}>Valparaíso, CL (CLVAP)</div></div>
              <span style={{"fontSize": "10px", "fontWeight": "600", "color": "#0E9487", "background": "rgba(18,181,165,.1)", "padding": "3px 8px", "borderRadius": "12px"}}>Подтверждено</span>
            </div>
            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "8px", "padding": "9px 12px"}}>
              <div><div style={{"fontSize": "10.5px", "color": "#6B7C8E"}}>Порт выгрузки</div><div style={{"fontSize": "13px", "fontWeight": "600"}}>Gdańsk, PL (PLGDN)</div></div>
              <span style={{"fontSize": "10px", "fontWeight": "600", "color": "#0E9487", "background": "rgba(18,181,165,.1)", "padding": "3px 8px", "borderRadius": "12px"}}>Подтверждено</span>
            </div>
            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "8px", "padding": "9px 12px"}}>
              <div><div style={{"fontSize": "10.5px", "color": "#6B7C8E"}}>Груз</div><div style={{"fontSize": "13px", "fontWeight": "600"}}>Медные катоды · 21 400 кг</div></div>
              <span style={{"fontSize": "10px", "fontWeight": "600", "color": "#0E9487", "background": "rgba(18,181,165,.1)", "padding": "3px 8px", "borderRadius": "12px"}}>Подтверждено</span>
            </div>
            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "8px", "padding": "9px 12px"}}>
              <div><div style={{"fontSize": "10.5px", "color": "#6B7C8E"}}>Incoterms</div><div style={{"fontSize": "13px", "fontWeight": "600"}}>FOB Valparaíso</div></div>
              <span style={{"fontSize": "10px", "fontWeight": "600", "color": "#0E9487", "background": "rgba(18,181,165,.1)", "padding": "3px 8px", "borderRadius": "12px"}}>Подтверждено</span>
            </div>
            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "background": "#FFF9F1", "border": "1px solid rgba(224,145,47,.35)", "borderRadius": "8px", "padding": "9px 12px"}}>
              <div><div style={{"fontSize": "10.5px", "color": "#A6690F"}}>Free days в порту назначения</div><div style={{"fontSize": "13px", "fontWeight": "600", "color": "#8A5306"}}>Не указано</div></div>
              <span style={{"fontSize": "10px", "fontWeight": "600", "color": "#A6690F", "background": "rgba(224,145,47,.14)", "padding": "3px 8px", "borderRadius": "12px"}}>Нет данных</span>
            </div>
            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "8px", "padding": "9px 12px"}}>
              <div><div style={{"fontSize": "10.5px", "color": "#6B7C8E"}}>Дата готовности</div><div style={{"fontSize": "13px", "fontWeight": "600"}}>18.07.2026</div></div>
              <span style={{"fontSize": "10px", "fontWeight": "600", "color": "#0E9487", "background": "rgba(18,181,165,.1)", "padding": "3px 8px", "borderRadius": "12px"}}>Подтверждено</span>
            </div>
          </div>
          <div style={{"fontSize": "11px", "color": "#6B7C8E", "borderTop": "1px dashed rgba(11,34,57,.12)", "paddingTop": "10px"}}>Источник: email клиента · распознано 09:42 · <span style={{"color": "#0E9487", "fontWeight": "600"}}>показать подтверждение</span></div>
        </div>
        {/*  CENTER  */}
        <div style={{"background": "#fff", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "12px"}}>
          <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center"}}>
            <div style={{"fontSize": "11px", "fontWeight": "700", "letterSpacing": "0.1em", "textTransform": "uppercase", "color": "#6B7C8E"}}>Активность</div>
            <span style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "10.5px", "fontWeight": "600", "color": "#0B2239", "background": "rgba(11,34,57,.06)", "padding": "4px 10px", "borderRadius": "14px"}}>получено 2 из 3 ответов</span>
          </div>
          <div style={{"display": "flex", "flexDirection": "column", "gap": "0", "position": "relative"}}>
            <div style={{"position": "absolute", "left": "9px", "top": "12px", "bottom": "12px", "width": "2px", "background": "rgba(11,34,57,.08)"}}></div>
            <div style={{"display": "flex", "gap": "12px", "padding": "8px 0", "position": "relative"}}>
              <div style={{"width": "20px", "height": "20px", "borderRadius": "50%", "background": "#fff", "border": "2px solid #12B5A5", "display": "grid", "placeItems": "center", "flex": "none", "fontSize": "10px", "color": "#0E9487", "fontWeight": "700"}}>✓</div>
              <div style={{"flex": "1"}}><div style={{"fontSize": "13px", "fontWeight": "600"}}>Ставка получена — Andes Link Freight</div><div style={{"fontSize": "11.5px", "color": "#6B7C8E"}}>All-in USD 2,340 / 40&apos;HC · до 15 авг · ответ за 12 мин</div></div>
              <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "10.5px", "color": "#9AA8B5", "flex": "none"}}>10:18</div>
            </div>
            <div style={{"display": "flex", "gap": "12px", "padding": "8px 0", "position": "relative"}}>
              <div style={{"width": "20px", "height": "20px", "borderRadius": "50%", "background": "#fff", "border": "2px solid #E0912F", "display": "grid", "placeItems": "center", "flex": "none", "fontSize": "10px", "color": "#A6690F", "fontWeight": "700"}}>!</div>
              <div style={{"flex": "1"}}><div style={{"fontSize": "13px", "fontWeight": "600"}}>Неполная ставка — Pacific Axis Logistics</div><div style={{"fontSize": "11.5px", "color": "#6B7C8E"}}>Только ocean freight · нет сборов в порту назначения · follow-up подготовлен</div></div>
              <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "10.5px", "color": "#9AA8B5", "flex": "none"}}>10:02</div>
            </div>
            <div style={{"display": "flex", "gap": "12px", "padding": "8px 0", "position": "relative"}}>
              <div style={{"width": "20px", "height": "20px", "borderRadius": "50%", "background": "#fff", "border": "2px solid rgba(11,34,57,.2)", "display": "grid", "placeItems": "center", "flex": "none"}}><span style={{"width": "6px", "height": "6px", "borderRadius": "50%", "background": "rgba(11,34,57,.25)", "display": "block"}}></span></div>
              <div style={{"flex": "1"}}><div style={{"fontSize": "13px", "fontWeight": "600", "color": "#44576B"}}>Ожидание — Southern Gate Forwarding</div><div style={{"fontSize": "11.5px", "color": "#6B7C8E"}}>Напоминание в 13:30, если не будет ответа</div></div>
              <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "10.5px", "color": "#9AA8B5", "flex": "none"}}>—</div>
            </div>
            <div style={{"display": "flex", "gap": "12px", "padding": "8px 0", "position": "relative"}}>
              <div style={{"width": "20px", "height": "20px", "borderRadius": "50%", "background": "#0B2239", "display": "grid", "placeItems": "center", "flex": "none", "fontSize": "9px", "color": "#12B5A5", "fontWeight": "700"}}>→</div>
              <div style={{"flex": "1"}}><div style={{"fontSize": "13px", "fontWeight": "600"}}>RFQ утверждён и отправлен 3 агентам</div><div style={{"fontSize": "11.5px", "color": "#6B7C8E"}}>Утвердила M. Kowalska · шортлист проверен</div></div>
              <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "10.5px", "color": "#9AA8B5", "flex": "none"}}>09:51</div>
            </div>
          </div>
        </div>
        {/*  RIGHT  */}
        <div style={{"background": "#FBFCFC", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "12px"}}>
          <div style={{"fontSize": "11px", "fontWeight": "700", "letterSpacing": "0.1em", "textTransform": "uppercase", "color": "#6B7C8E"}}>Панель решений</div>
          <div style={{"background": "#fff", "border": "1px solid rgba(224,145,47,.35)", "borderRadius": "10px", "padding": "12px"}}>
            <div style={{"fontSize": "11px", "fontWeight": "700", "color": "#A6690F", "marginBottom": "6px"}}>1 поле блокирует котировку</div>
            <div style={{"fontSize": "12.5px", "color": "#44576B", "lineHeight": "1.5"}}>Free days в порту назначения — уточнение отправлено клиенту в 09:58.</div>
          </div>
          <div style={{"background": "#fff", "border": "1.5px solid #12B5A5", "borderRadius": "10px", "padding": "12px", "boxShadow": "0 4px 14px rgba(18,181,165,.14)", "position": "relative"}}>
            <div style={{"position": "absolute", "top": "-9px", "left": "12px", "fontSize": "9.5px", "fontWeight": "700", "letterSpacing": "0.08em", "textTransform": "uppercase", "color": "#fff", "background": "#0E9487", "padding": "3px 8px", "borderRadius": "10px"}}>Рекомендовано</div>
            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "marginTop": "4px"}}>
              <div style={{"fontSize": "13px", "fontWeight": "700"}}>Andes Link Freight</div>
              <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "13px", "fontWeight": "600"}}>USD 2,340</div>
            </div>
            <div style={{"fontSize": "11px", "color": "#6B7C8E", "marginTop": "2px"}}>за 40&apos;HC · all-in · до 15 авг · 14 free days</div>
            <div style={{"marginTop": "8px", "fontSize": "11px", "fontWeight": "600", "color": "#0E9487", "display": "flex", "alignItems": "center", "gap": "6px"}}><span style={{"width": "5px", "height": "5px", "borderRadius": "50%", "background": "#12B5A5"}}></span>Полная и сопоставимая</div>
          </div>
          <div style={{"background": "#0B2239", "borderRadius": "10px", "padding": "12px", "color": "#fff"}}>
            <div style={{"fontSize": "10.5px", "fontWeight": "700", "letterSpacing": "0.08em", "textTransform": "uppercase", "color": "#7FE7DC", "marginBottom": "6px"}}>Следующий шаг</div>
            <div style={{"fontSize": "12.5px", "lineHeight": "1.5", "color": "rgba(255,255,255,.85)"}}>Подготовьте предварительную котировку по рекомендованному варианту, не дожидаясь Southern Gate.</div>
            <div style={{"display": "flex", "gap": "8px", "marginTop": "10px"}}>
              <span style={{"flex": "1", "textAlign": "center", "fontSize": "11.5px", "fontWeight": "600", "background": "#12B5A5", "color": "#06282F", "padding": "7px 0", "borderRadius": "7px", "cursor": "pointer"}}>Черновик котировки</span>
              <span style={{"flex": "1", "textAlign": "center", "fontSize": "11.5px", "fontWeight": "600", "background": "rgba(255,255,255,.1)", "padding": "7px 0", "borderRadius": "7px", "cursor": "pointer"}}>Ждать</span>
            </div>
          </div>
          <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "fontSize": "11px", "color": "#6B7C8E"}}><span>Статус котировки</span><span style={{"fontWeight": "600", "color": "#0B2239"}}>Черновик не начат</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  ============ PROBLEM ============  */}
<section id="why" data-screen-label="Problem" style={{"padding": "220px 28px 0"}}>
  <div style={{"maxWidth": "1180px", "margin": "0 auto"}}>
    <div style={{"maxWidth": "680px", "display": "flex", "flexDirection": "column", "gap": "14px"}}>
      <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11.5px", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0E9487"}}>Проблема</div>
      <h2 style={{"margin": "0", "fontSize": "clamp(28px,3.4vw,40px)", "lineHeight": "1.15", "letterSpacing": "-0.025em", "fontWeight": "700", "textWrap": "balance"}}>Работа над котировками до сих пор живёт в почте, чатах, таблицах и памяти.</h2>
    </div>
    <div style={{"display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(300px,1fr))", "gap": "20px", "marginTop": "44px"}}>
      <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.09)", "borderRadius": "14px", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "16px"}} data-style-hover="box-shadow:0 8px 24px rgba(11,34,57,.08)">
        <div style={{"height": "120px", "background": "#F1F5F7", "borderRadius": "10px", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "7px", "overflow": "hidden"}}>
          <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "7px", "padding": "7px 10px", "fontSize": "10.5px", "color": "#44576B", "transform": "rotate(-1.2deg)"}}>📧 &nbsp;«нужна цена 2 конт Чили → Польша срочно…»</div>
          <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "7px", "padding": "7px 10px", "fontSize": "10.5px", "color": "#44576B", "transform": "rotate(0.8deg)", "marginLeft": "18px"}}>💬 &nbsp;«медь, ~21 т, вроде FOB?»</div>
          <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "7px", "padding": "7px 10px", "fontSize": "10.5px", "color": "#44576B", "transform": "rotate(-0.6deg)", "marginLeft": "6px"}}>📞 &nbsp;заметка со звонка: «дедлайн пятница 16:00»</div>
        </div>
        <div><div style={{"fontSize": "17px", "fontWeight": "700", "marginBottom": "6px"}}>Разрозненные запросы</div><div style={{"fontSize": "14px", "lineHeight": "1.55", "color": "#44576B"}}>Запросы клиентов приходят как неполные письма, сообщения в чатах и заметки со звонков.</div></div>
      </div>
      <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.09)", "borderRadius": "14px", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "16px"}} data-style-hover="box-shadow:0 8px 24px rgba(11,34,57,.08)">
        <div style={{"height": "120px", "background": "#F1F5F7", "borderRadius": "10px", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "7px", "overflow": "hidden"}}>
          <div style={{"display": "flex", "alignItems": "center", "gap": "8px", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "7px", "padding": "7px 10px"}}><span style={{"width": "18px", "height": "18px", "borderRadius": "50%", "background": "rgba(11,34,57,.1)"}}></span><span style={{"fontSize": "10.5px", "color": "#44576B", "flex": "1"}}>Агент из таблицы 2023 года…?</span><span style={{"fontSize": "10px", "color": "#9AA8B5"}}>?</span></div>
          <div style={{"display": "flex", "alignItems": "center", "gap": "8px", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "7px", "padding": "7px 10px"}}><span style={{"width": "18px", "height": "18px", "borderRadius": "50%", "background": "rgba(11,34,57,.1)"}}></span><span style={{"fontSize": "10.5px", "color": "#44576B", "flex": "1"}}>Контакт, который уволился в прошлом году</span><span style={{"fontSize": "10px", "color": "#9AA8B5"}}>✕</span></div>
          <div style={{"display": "flex", "alignItems": "center", "gap": "8px", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "7px", "padding": "7px 10px"}}><span style={{"width": "18px", "height": "18px", "borderRadius": "50%", "background": "rgba(11,34,57,.1)"}}></span><span style={{"fontSize": "10.5px", "color": "#44576B", "flex": "1"}}>«Спроси Петра, он кого-то знает»</span><span style={{"fontSize": "10px", "color": "#9AA8B5"}}>?</span></div>
        </div>
        <div><div style={{"fontSize": "17px", "fontWeight": "700", "marginBottom": "6px"}}>Ручной поиск агентов</div><div style={{"fontSize": "14px", "lineHeight": "1.55", "color": "#44576B"}}>Менеджеры теряют время на поиск подходящих локальных агентов и выбор, кому отправить запрос.</div></div>
      </div>
      <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.09)", "borderRadius": "14px", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "16px"}} data-style-hover="box-shadow:0 8px 24px rgba(11,34,57,.08)">
        <div style={{"height": "120px", "background": "#F1F5F7", "borderRadius": "10px", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "7px", "overflow": "hidden", "fontFamily": "'IBM Plex Mono',monospace"}}>
          <div style={{"display": "flex", "justifyContent": "space-between", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "7px", "padding": "7px 10px", "fontSize": "10px", "color": "#44576B"}}><span>USD 2,340 all-in</span><span style={{"color": "#0E9487"}}>до 15 авг</span></div>
          <div style={{"display": "flex", "justifyContent": "space-between", "background": "#fff", "border": "1px solid rgba(224,145,47,.35)", "borderRadius": "7px", "padding": "7px 10px", "fontSize": "10px", "color": "#44576B"}}><span>«2100 + local charges»</span><span style={{"color": "#A6690F"}}>EUR? USD?</span></div>
          <div style={{"display": "flex", "justifyContent": "space-between", "background": "#fff", "border": "1px solid rgba(224,145,47,.35)", "borderRadius": "7px", "padding": "7px 10px", "fontSize": "10px", "color": "#44576B"}}><span>rates_final_v3.xlsx</span><span style={{"color": "#A6690F"}}>нет validity</span></div>
        </div>
        <div><div style={{"fontSize": "17px", "fontWeight": "700", "marginBottom": "6px"}}>Хаос в сравнении ставок</div><div style={{"fontSize": "14px", "lineHeight": "1.55", "color": "#44576B"}}>Ставки приходят в разное время, в разных форматах, с недостающими сборами и неясными условиями.</div></div>
      </div>
    </div>
  </div>
</section>

{/*  ============ WORKFLOW ============  */}
<section id="workflow" data-screen-label="Workflow" style={{"padding": "110px 28px 0"}}>
  <div style={{"maxWidth": "1180px", "margin": "0 auto"}}>
    <div style={{"maxWidth": "680px", "display": "flex", "flexDirection": "column", "gap": "14px"}}>
      <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11.5px", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0E9487"}}>Процесс</div>
      <h2 style={{"margin": "0", "fontSize": "clamp(28px,3.4vw,40px)", "lineHeight": "1.15", "letterSpacing": "-0.025em", "fontWeight": "700"}}>Один workspace: от запроса до котировки клиенту.</h2>
    </div>
    <div style={{"marginTop": "44px", "display": "flex", "flexDirection": "column", "gap": "0", "position": "relative"}}>
      {workflowStages.map((stage, index) => (<React.Fragment key={index}>
        <div style={{"display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(280px,1fr))", "gap": "24px", "alignItems": "center", "padding": "22px 0", "borderTop": "1px solid rgba(11,34,57,.08)"}}>
          <div style={{"display": "flex", "gap": "18px", "alignItems": "flex-start"}}>
            <div style={{"width": "34px", "height": "34px", "borderRadius": "10px", "background": "#0B2239", "color": "#12B5A5", "display": "grid", "placeItems": "center", "fontFamily": "'IBM Plex Mono',monospace", "fontSize": "13px", "fontWeight": "600", "flex": "none"}}>{stage.num}</div>
            <div><div style={{"fontSize": "18px", "fontWeight": "700", "marginBottom": "5px"}}>{stage.title}</div><div style={{"fontSize": "14.5px", "lineHeight": "1.55", "color": "#44576B", "maxWidth": "420px", "textWrap": "pretty"}}>{stage.copy}</div></div>
          </div>
          <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.09)", "borderRadius": "12px", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "7px", "boxShadow": "0 2px 8px rgba(11,34,57,.04)"}}>
            <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center"}}><span style={{"fontSize": "10px", "fontWeight": "700", "letterSpacing": "0.08em", "textTransform": "uppercase", "color": "#9AA8B5"}}>{stage.uiLabel}</span><span style={{"fontSize": "10px", "fontWeight": "600", "padding": "3px 8px", "borderRadius": "10px", "color": "{stage.badgeColor}", "background": "{stage.badgeBg}"}}>{stage.badge}</span></div>
            <div style={{"fontSize": "12.5px", "fontWeight": "600", "color": "#0B2239"}}>{stage.uiTitle}</div>
            <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11px", "color": "#44576B", "background": "#F1F5F7", "borderRadius": "7px", "padding": "8px 10px", "lineHeight": "1.6"}}>{stage.uiBody}</div>
          </div>
        </div>
      </React.Fragment>))}
    </div>
  </div>
</section>

{/*  ============ CAPABILITIES ============  */}
<section id="product" data-screen-label="Capabilities" style={{"padding": "110px 28px 0"}}>
  <div style={{"maxWidth": "1180px", "margin": "0 auto"}}>
    <div style={{"maxWidth": "720px", "display": "flex", "flexDirection": "column", "gap": "14px"}}>
      <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11.5px", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0E9487"}}>Продукт</div>
      <h2 style={{"margin": "0", "fontSize": "clamp(28px,3.4vw,40px)", "lineHeight": "1.15", "letterSpacing": "-0.025em", "fontWeight": "700", "textWrap": "balance"}}>Создан для реальных операций котирования, а не демонстраций AI.</h2>
    </div>
    <div style={{"display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(400px,1fr))", "gap": "20px", "marginTop": "44px"}}>
      <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.09)", "borderRadius": "14px", "padding": "26px", "display": "flex", "flexDirection": "column", "gap": "18px"}}>
        <div><div style={{"fontSize": "18px", "fontWeight": "700", "marginBottom": "6px"}}>RFQ Intelligence</div><div style={{"fontSize": "14.5px", "lineHeight": "1.55", "color": "#44576B"}}>Извлекает маршрут, груз, контейнеры, Incoterms, дедлайны и недостающие данные из неструктурированных запросов.</div></div>
        <div style={{"background": "#F1F5F7", "borderRadius": "10px", "padding": "14px", "display": "flex", "flexWrap": "wrap", "gap": "7px"}}>
          <span style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11px", "fontWeight": "500", "background": "#fff", "border": "1px solid rgba(18,181,165,.4)", "color": "#0B2239", "padding": "5px 10px", "borderRadius": "14px"}}>route: CLVAP → PLGDN</span>
          <span style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11px", "fontWeight": "500", "background": "#fff", "border": "1px solid rgba(18,181,165,.4)", "color": "#0B2239", "padding": "5px 10px", "borderRadius": "14px"}}>containers: 2×40&apos;HC</span>
          <span style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11px", "fontWeight": "500", "background": "#fff", "border": "1px solid rgba(18,181,165,.4)", "color": "#0B2239", "padding": "5px 10px", "borderRadius": "14px"}}>incoterms: FOB</span>
          <span style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11px", "fontWeight": "500", "background": "#fff", "border": "1px solid rgba(18,181,165,.4)", "color": "#0B2239", "padding": "5px 10px", "borderRadius": "14px"}}>deadline: пт 16:00</span>
          <span style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11px", "fontWeight": "500", "background": "#FFF9F1", "border": "1px dashed rgba(224,145,47,.5)", "color": "#A6690F", "padding": "5px 10px", "borderRadius": "14px"}}>free days: нет данных</span>
        </div>
      </div>
      <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.09)", "borderRadius": "14px", "padding": "26px", "display": "flex", "flexDirection": "column", "gap": "18px"}}>
        <div><div style={{"fontSize": "18px", "fontWeight": "700", "marginBottom": "6px"}}>Agent Intelligence</div><div style={{"fontSize": "14.5px", "lineHeight": "1.55", "color": "#44576B"}}>Подбирает агентов по покрытию, скорости ответов, полноте котировок и операционной истории.</div></div>
        <div style={{"background": "#F1F5F7", "borderRadius": "10px", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "7px"}}>
          <div style={{"display": "flex", "alignItems": "center", "gap": "10px", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "8px", "padding": "8px 11px"}}>
            <span style={{"width": "24px", "height": "24px", "borderRadius": "7px", "background": "#0B2239", "color": "#12B5A5", "display": "grid", "placeItems": "center", "fontSize": "10px", "fontWeight": "700", "flex": "none"}}>AL</span>
            <span style={{"fontSize": "12px", "fontWeight": "600", "flex": "1"}}>Andes Link Freight</span>
            <span style={{"fontSize": "10.5px", "color": "#0E9487", "fontWeight": "600"}}>Покрывает CLVAP · ответ &lt; 1 ч</span>
          </div>
          <div style={{"display": "flex", "alignItems": "center", "gap": "10px", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "8px", "padding": "8px 11px"}}>
            <span style={{"width": "24px", "height": "24px", "borderRadius": "7px", "background": "#0B2239", "color": "#12B5A5", "display": "grid", "placeItems": "center", "fontSize": "10px", "fontWeight": "700", "flex": "none"}}>PA</span>
            <span style={{"fontSize": "12px", "fontWeight": "600", "flex": "1"}}>Pacific Axis Logistics</span>
            <span style={{"fontSize": "10.5px", "color": "#6B7C8E", "fontWeight": "500"}}>Силён в reefer · часто неполные ставки</span>
          </div>
        </div>
      </div>
      <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.09)", "borderRadius": "14px", "padding": "26px", "display": "flex", "flexDirection": "column", "gap": "18px"}}>
        <div><div style={{"fontSize": "18px", "fontWeight": "700", "marginBottom": "6px"}}>Rate Normalization</div><div style={{"fontSize": "14.5px", "lineHeight": "1.55", "color": "#44576B"}}>Превращает ответы по email, свободный текст и rate sheets в структурированное сравнение.</div></div>
        <div style={{"background": "#F1F5F7", "borderRadius": "10px", "padding": "14px", "fontFamily": "'IBM Plex Mono',monospace"}}>
          <div style={{"display": "grid", "gridTemplateColumns": "1.3fr 1fr 1fr 1fr", "gap": "6px", "fontSize": "9.5px", "fontWeight": "600", "color": "#9AA8B5", "textTransform": "uppercase", "letterSpacing": "0.06em", "padding": "0 10px 6px"}}>
            <span>Агент</span><span>All-in / 40&apos;HC</span><span>Validity</span><span>Free days</span>
          </div>
          <div style={{"display": "grid", "gridTemplateColumns": "1.3fr 1fr 1fr 1fr", "gap": "6px", "fontSize": "11px", "background": "#fff", "border": "1px solid rgba(18,181,165,.45)", "borderRadius": "7px", "padding": "8px 10px", "color": "#0B2239"}}>
            <span style={{"fontWeight": "600"}}>Andes Link</span><span>USD 2,340</span><span>15 авг</span><span>14</span>
          </div>
          <div style={{"display": "grid", "gridTemplateColumns": "1.3fr 1fr 1fr 1fr", "gap": "6px", "fontSize": "11px", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "7px", "padding": "8px 10px", "color": "#44576B", "marginTop": "6px"}}>
            <span style={{"fontWeight": "600"}}>Pacific Axis</span><span>USD 2,180*</span><span>8 авг</span><span style={{"color": "#A6690F"}}>—</span>
          </div>
          <div style={{"fontSize": "9.5px", "color": "#A6690F", "padding": "7px 10px 0"}}>* нет сборов в порту назначения — пока не сопоставимо</div>
        </div>
      </div>
      <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.09)", "borderRadius": "14px", "padding": "26px", "display": "flex", "flexDirection": "column", "gap": "18px"}}>
        <div><div style={{"fontSize": "18px", "fontWeight": "700", "marginBottom": "6px"}}>Human-Controlled Decisions</div><div style={{"fontSize": "14.5px", "lineHeight": "1.55", "color": "#44576B"}}>FreightPilot рекомендует следующие шаги, но RFQ утверждает, ставки выбирает и финальные котировки создаёт менеджер.</div></div>
        <div style={{"background": "#F1F5F7", "borderRadius": "10px", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "8px"}}>
          <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "8px", "padding": "9px 12px", "gap": "8px", "flexWrap": "wrap"}}>
            <span style={{"fontSize": "12px", "color": "#44576B"}}>Шортлист RFQ — предложено 3 агента</span>
            <span style={{"display": "flex", "gap": "6px"}}><span style={{"fontSize": "11px", "fontWeight": "600", "background": "#0B2239", "color": "#fff", "padding": "5px 12px", "borderRadius": "6px", "cursor": "pointer"}}>Утвердить и отправить</span><span style={{"fontSize": "11px", "fontWeight": "600", "background": "rgba(11,34,57,.06)", "color": "#0B2239", "padding": "5px 12px", "borderRadius": "6px", "cursor": "pointer"}}>Изменить</span></span>
          </div>
          <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "background": "#fff", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "8px", "padding": "9px 12px", "gap": "8px", "flexWrap": "wrap"}}>
            <span style={{"fontSize": "12px", "color": "#44576B"}}>Черновик котировки — ждёт вашей проверки</span>
            <span style={{"fontSize": "10.5px", "fontWeight": "600", "color": "#0E9487", "background": "rgba(18,181,165,.1)", "padding": "4px 10px", "borderRadius": "12px"}}>Нужно утверждение менеджера</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  ============ ASYNC ============  */}
<section data-screen-label="Async workflow" style={{"padding": "110px 28px 0"}}>
  <div style={{"maxWidth": "1180px", "margin": "0 auto", "display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(340px,1fr))", "gap": "56px", "alignItems": "center"}}>
    <div style={{"display": "flex", "flexDirection": "column", "gap": "16px"}}>
      <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11.5px", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0E9487"}}>Асинхронность по умолчанию</div>
      <h2 style={{"margin": "0", "fontSize": "clamp(28px,3.4vw,40px)", "lineHeight": "1.15", "letterSpacing": "-0.025em", "fontWeight": "700", "textWrap": "balance"}}>Не ждите вслепую ответа от каждого агента.</h2>
      <p style={{"margin": "0", "fontSize": "16px", "lineHeight": "1.6", "color": "#44576B", "maxWidth": "460px", "textWrap": "pretty"}}>FreightPilot помогает менеджерам действовать в условиях реальных дедлайнов, сохраняя видимость поздних ответов и ревизий котировок.</p>
    </div>
    <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.1)", "borderRadius": "14px", "padding": "22px", "boxShadow": "0 16px 40px -16px rgba(11,34,57,.18)", "display": "flex", "flexDirection": "column", "gap": "12px"}}>
      <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "paddingBottom": "12px", "borderBottom": "1px solid rgba(11,34,57,.08)", "gap": "8px", "flexWrap": "wrap"}}>
        <span style={{"fontSize": "12px", "fontWeight": "700", "letterSpacing": "0.06em", "textTransform": "uppercase", "color": "#6B7C8E"}}>Сбор ставок — RFQ-2026-041</span>
        <span style={{"display": "inline-flex", "alignItems": "center", "gap": "6px", "fontSize": "11px", "fontWeight": "600", "color": "#A6690F", "background": "rgba(224,145,47,.12)", "border": "1px solid rgba(224,145,47,.35)", "padding": "4px 10px", "borderRadius": "14px"}}>⏱ дедлайн 16:00 · осталось 3 ч 12 м</span>
      </div>
      <div style={{"display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 12px", "background": "#FBFCFC", "border": "1px solid rgba(11,34,57,.07)", "borderRadius": "10px"}}>
        <span style={{"width": "22px", "height": "22px", "borderRadius": "50%", "background": "rgba(18,181,165,.14)", "border": "1.5px solid #12B5A5", "display": "grid", "placeItems": "center", "fontSize": "11px", "color": "#0E9487", "fontWeight": "700", "flex": "none"}}>✓</span>
        <span style={{"flex": "1"}}><span style={{"display": "block", "fontSize": "13.5px", "fontWeight": "600"}}>Andes Link Freight</span><span style={{"display": "block", "fontSize": "11.5px", "color": "#6B7C8E"}}>Ставка получена за 12 мин</span></span>
        <span style={{"fontSize": "10.5px", "fontWeight": "600", "color": "#0E9487", "background": "rgba(18,181,165,.1)", "padding": "4px 10px", "borderRadius": "12px"}}>Полная</span>
      </div>
      <div style={{"display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 12px", "background": "#FBFCFC", "border": "1px solid rgba(224,145,47,.3)", "borderRadius": "10px"}}>
        <span style={{"width": "22px", "height": "22px", "borderRadius": "50%", "background": "rgba(224,145,47,.14)", "border": "1.5px solid #E0912F", "display": "grid", "placeItems": "center", "fontSize": "11px", "color": "#A6690F", "fontWeight": "700", "flex": "none"}}>!</span>
        <span style={{"flex": "1"}}><span style={{"display": "block", "fontSize": "13.5px", "fontWeight": "600"}}>Pacific Axis Logistics</span><span style={{"display": "block", "fontSize": "11.5px", "color": "#6B7C8E"}}>Неполная ставка — нет сборов в порту назначения</span></span>
        <span style={{"fontSize": "10.5px", "fontWeight": "600", "color": "#A6690F", "background": "rgba(224,145,47,.12)", "padding": "4px 10px", "borderRadius": "12px"}}>Нужен follow-up</span>
      </div>
      <div style={{"display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 12px", "background": "#FBFCFC", "border": "1px solid rgba(11,34,57,.07)", "borderRadius": "10px"}}>
        <span style={{"width": "22px", "height": "22px", "borderRadius": "50%", "background": "rgba(11,34,57,.05)", "border": "1.5px dashed rgba(11,34,57,.25)", "display": "grid", "placeItems": "center", "flex": "none"}}><span style={{"width": "6px", "height": "6px", "borderRadius": "50%", "background": "rgba(11,34,57,.3)", "display": "block", "animation": "fp-pulse 2s infinite"}}></span></span>
        <span style={{"flex": "1"}}><span style={{"display": "block", "fontSize": "13.5px", "fontWeight": "600", "color": "#44576B"}}>Southern Gate Forwarding</span><span style={{"display": "block", "fontSize": "11.5px", "color": "#6B7C8E"}}>Ответа пока нет · напоминание в 13:30</span></span>
        <span style={{"fontSize": "10.5px", "fontWeight": "600", "color": "#6B7C8E", "background": "rgba(11,34,57,.06)", "padding": "4px 10px", "borderRadius": "12px"}}>Ожидание</span>
      </div>
      <div style={{"background": "#0B2239", "borderRadius": "10px", "padding": "14px", "display": "flex", "gap": "12px", "alignItems": "flex-start"}}>
        <span style={{"width": "22px", "height": "22px", "borderRadius": "7px", "background": "rgba(18,181,165,.2)", "display": "grid", "placeItems": "center", "fontSize": "11px", "color": "#12B5A5", "flex": "none", "fontWeight": "700"}}>→</span>
        <span><span style={{"display": "block", "fontSize": "10.5px", "fontWeight": "700", "letterSpacing": "0.08em", "textTransform": "uppercase", "color": "#7FE7DC", "marginBottom": "4px"}}>Рекомендуемое действие</span><span style={{"display": "block", "fontSize": "13px", "lineHeight": "1.5", "color": "rgba(255,255,255,.88)"}}>Подготовьте предварительную котировку по лучшему сопоставимому варианту.</span></span>
      </div>
    </div>
  </div>
</section>

{/*  ============ EXPLAINABILITY ============  */}
<section data-screen-label="Explainability" style={{"padding": "110px 28px 0"}}>
  <div style={{"maxWidth": "1180px", "margin": "0 auto"}}>
    <div style={{"maxWidth": "680px", "display": "flex", "flexDirection": "column", "gap": "14px"}}>
      <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11.5px", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0E9487"}}>Объяснимость</div>
      <h2 style={{"margin": "0", "fontSize": "clamp(28px,3.4vw,40px)", "lineHeight": "1.15", "letterSpacing": "-0.025em", "fontWeight": "700"}}>AI-помощь без решений «чёрного ящика».</h2>
      <p style={{"margin": "0", "fontSize": "16px", "lineHeight": "1.6", "color": "#44576B", "textWrap": "pretty"}}>FreightPilot не скрывает неопределённость: видно, что известно, чего не хватает и что требует проверки человеком.</p>
    </div>
    <div style={{"display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(340px,1fr))", "gap": "20px", "marginTop": "44px", "alignItems": "stretch"}}>
      <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.09)", "borderRadius": "14px", "overflow": "hidden", "display": "flex", "flexDirection": "column"}}>
        <div style={{"padding": "12px 18px", "borderBottom": "1px solid rgba(11,34,57,.08)", "display": "flex", "justifyContent": "space-between", "alignItems": "center", "background": "#FBFCFC"}}>
          <span style={{"fontSize": "11px", "fontWeight": "700", "letterSpacing": "0.08em", "textTransform": "uppercase", "color": "#6B7C8E"}}>Исходное письмо клиента</span>
          <span style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "10.5px", "color": "#9AA8B5"}}>получено 09:41</span>
        </div>
        <div style={{"padding": "20px", "fontSize": "13.5px", "lineHeight": "1.85", "color": "#44576B", "flex": "1"}}>
          <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11px", "color": "#9AA8B5", "marginBottom": "12px"}}>From: <a href="/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="e2879a928d9096a2838c868b8c83cf8f8796838e91cc818e">[email&#160;protected]</a><br />Subject: RE: RE: shipment poland</div>
          Hola, we need pricing for <mark style={{"background": "rgba(18,181,165,.16)", "color": "#0B2239", "padding": "1px 4px", "borderRadius": "4px", "fontWeight": "500"}}>2 containers 40HC</mark> of <mark style={{"background": "rgba(18,181,165,.16)", "color": "#0B2239", "padding": "1px 4px", "borderRadius": "4px", "fontWeight": "500"}}>copper cathodes</mark> from <mark style={{"background": "rgba(18,181,165,.16)", "color": "#0B2239", "padding": "1px 4px", "borderRadius": "4px", "fontWeight": "500"}}>Valparaíso to Gdansk</mark>. Cargo ready <mark style={{"background": "rgba(224,145,47,.18)", "color": "#8A5306", "padding": "1px 4px", "borderRadius": "4px", "fontWeight": "500"}}>around the 18th</mark>. Terms <mark style={{"background": "rgba(224,145,47,.18)", "color": "#8A5306", "padding": "1px 4px", "borderRadius": "4px", "fontWeight": "500"}}>FOB like last time (or was it FCA?)</mark>. Need your quote by Friday afternoon latest. Gracias!
        </div>
      </div>
      <div style={{"background": "#fff", "border": "1px solid rgba(11,34,57,.09)", "borderRadius": "14px", "overflow": "hidden", "display": "flex", "flexDirection": "column"}}>
        <div style={{"padding": "12px 18px", "borderBottom": "1px solid rgba(11,34,57,.08)", "display": "flex", "justifyContent": "space-between", "alignItems": "center", "background": "#FBFCFC"}}>
          <span style={{"fontSize": "11px", "fontWeight": "700", "letterSpacing": "0.08em", "textTransform": "uppercase", "color": "#6B7C8E"}}>Извлечённые поля RFQ</span>
          <span style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "10.5px", "color": "#0E9487", "fontWeight": "600"}}>6 полей · 2 требуют проверки</span>
        </div>
        <div style={{"padding": "18px", "display": "flex", "flexDirection": "column", "gap": "8px", "flex": "1"}}>
          <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "8px", "padding": "9px 12px"}}>
            <span><span style={{"display": "block", "fontSize": "10.5px", "color": "#6B7C8E"}}>Маршрут</span><span style={{"display": "block", "fontSize": "13px", "fontWeight": "600"}}>Valparaíso → Gdańsk</span></span>
            <span style={{"fontSize": "10px", "fontWeight": "600", "color": "#0E9487", "background": "rgba(18,181,165,.1)", "padding": "3px 9px", "borderRadius": "12px"}}>Подтверждено</span>
          </div>
          <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "border": "1px solid rgba(11,34,57,.08)", "borderRadius": "8px", "padding": "9px 12px"}}>
            <span><span style={{"display": "block", "fontSize": "10.5px", "color": "#6B7C8E"}}>Контейнеры</span><span style={{"display": "block", "fontSize": "13px", "fontWeight": "600"}}>2 × 40&apos;HC</span></span>
            <span style={{"fontSize": "10px", "fontWeight": "600", "color": "#0E9487", "background": "rgba(18,181,165,.1)", "padding": "3px 9px", "borderRadius": "12px"}}>Подтверждено</span>
          </div>
          <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "border": "1px solid rgba(224,145,47,.35)", "background": "#FFF9F1", "borderRadius": "8px", "padding": "9px 12px"}}>
            <span><span style={{"display": "block", "fontSize": "10.5px", "color": "#A6690F"}}>Дата готовности</span><span style={{"display": "block", "fontSize": "13px", "fontWeight": "600", "color": "#8A5306"}}>«около 18-го»</span></span>
            <span style={{"fontSize": "10px", "fontWeight": "600", "color": "#A6690F", "background": "rgba(224,145,47,.14)", "padding": "3px 9px", "borderRadius": "12px"}}>Требует подтверждения</span>
          </div>
          <div style={{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "border": "1px solid rgba(224,145,47,.5)", "background": "#FFF9F1", "borderRadius": "8px", "padding": "9px 12px"}}>
            <span><span style={{"display": "block", "fontSize": "10.5px", "color": "#A6690F"}}>Incoterms</span><span style={{"display": "block", "fontSize": "13px", "fontWeight": "600", "color": "#8A5306"}}>FOB или FCA — клиент не уверен</span></span>
            <span style={{"fontSize": "10px", "fontWeight": "600", "color": "#fff", "background": "#E0912F", "padding": "3px 9px", "borderRadius": "12px"}}>Обнаружен конфликт</span>
          </div>
          <div style={{"marginTop": "6px", "background": "#F1F5F7", "borderRadius": "10px", "padding": "12px 14px"}}>
            <div style={{"fontSize": "11px", "fontWeight": "700", "color": "#0B2239", "marginBottom": "5px", "display": "flex", "alignItems": "center", "gap": "6px"}}><span style={{"width": "14px", "height": "14px", "borderRadius": "4px", "background": "#0B2239", "color": "#12B5A5", "display": "inline-grid", "placeItems": "center", "fontSize": "9px"}}>?</span>Почему такой результат?</div>
            <div style={{"fontSize": "12px", "lineHeight": "1.55", "color": "#44576B"}}>Incoterms помечены, потому что в письме сказано <em>«FOB like last time (or was it FCA?)»</em>, а последние 4 отправки клиента по этому маршруту шли на FCA. Однострочное уточнение уже подготовлено.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  ============ DESIGN PARTNER CTA ============  */}
<section id="partner" data-screen-label="Design partner CTA" style={{"padding": "110px 28px 0"}}>
  <div style={{"maxWidth": "1180px", "margin": "0 auto", "background": "linear-gradient(180deg,#0B2239,#0D2C48)", "borderRadius": "20px", "padding": "clamp(48px,7vw,84px) clamp(28px,6vw,80px)", "position": "relative", "overflow": "hidden"}}>
    <div style={{"position": "absolute", "top": "0", "right": "0", "width": "340px", "height": "340px", "background": "radial-gradient(circle at top right, rgba(18,181,165,.16), transparent 65%)"}}></div>
    {/*  small container motif  */}
    <div style={{"position": "absolute", "right": "56px", "bottom": "48px", "display": "grid", "gridTemplateColumns": "repeat(3,26px)", "gap": "5px", "opacity": ".5"}}>
      <div style={{"height": "16px", "borderRadius": "3px", "background": "#C96F1F"}}></div><div style={{"height": "16px", "borderRadius": "3px", "background": "#12B5A5", "opacity": ".7"}}></div><div style={{"height": "16px", "borderRadius": "3px", "background": "#2E4E6B"}}></div>
      <div style={{"height": "16px", "borderRadius": "3px", "background": "#2E4E6B"}}></div><div style={{"height": "16px", "borderRadius": "3px", "background": "#C96F1F", "opacity": ".8"}}></div><div style={{"height": "16px", "borderRadius": "3px", "background": "#3C5D7D"}}></div>
      <div style={{"height": "16px", "borderRadius": "3px", "background": "#12B5A5", "opacity": ".6"}}></div><div style={{"height": "16px", "borderRadius": "3px", "background": "#3C5D7D"}}></div><div style={{"height": "16px", "borderRadius": "3px", "background": "#C96F1F", "opacity": ".7"}}></div>
    </div>
    <div style={{"position": "relative", "maxWidth": "640px", "display": "flex", "flexDirection": "column", "gap": "20px"}}>
      <div style={{"fontFamily": "'IBM Plex Mono',monospace", "fontSize": "11.5px", "fontWeight": "600", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#12B5A5"}}>Программа дизайн-партнёров</div>
      <h2 style={{"margin": "0", "fontSize": "clamp(28px,3.6vw,44px)", "lineHeight": "1.12", "letterSpacing": "-0.025em", "fontWeight": "700", "color": "#fff", "textWrap": "balance"}}>Помогите сформировать новое поколение операций котирования в логистике.</h2>
      <p style={{"margin": "0", "fontSize": "16px", "lineHeight": "1.65", "color": "rgba(255,255,255,.72)", "textWrap": "pretty"}}>Мы работаем с экспедиторами, чтобы проверить самые значимые сценарии котирования — на реальных операционных паттернах, с контролируемым пилотом и измеримыми базовыми метриками.</p>
      <div style={{"display": "flex", "alignItems": "center", "gap": "18px", "flexWrap": "wrap", "marginTop": "8px"}}>
        <a href="#" style={{"textDecoration": "none", "background": "#12B5A5", "color": "#06282F", "fontSize": "15px", "fontWeight": "700", "padding": "13px 24px", "borderRadius": "9px"}} data-style-hover="background:#2BC9BA">Запросить разговор о дизайн-партнёрстве</a>
        <span style={{"fontSize": "13px", "color": "rgba(255,255,255,.55)"}}>Для интерактивного демо не нужны реальные данные клиентов.</span>
      </div>
    </div>
  </div>
</section>

{/*  ============ FOOTER ============  */}
<div data-screen-label="Footer" style={{"padding": "80px 28px 40px"}}>
  <div style={{"maxWidth": "1180px", "margin": "0 auto", "display": "flex", "flexDirection": "column", "gap": "32px"}}>
    <div style={{"display": "flex", "justifyContent": "space-between", "gap": "32px", "flexWrap": "wrap", "alignItems": "flex-start"}}>
      <div style={{"display": "flex", "flexDirection": "column", "gap": "8px"}}>
        <div style={{"display": "flex", "alignItems": "center", "gap": "10px"}}>
          <div style={{"width": "24px", "height": "24px", "borderRadius": "7px", "background": "#0B2239", "display": "grid", "placeItems": "center"}}><div style={{"width": "10px", "height": "10px", "borderRadius": "3px", "background": "#12B5A5", "transform": "rotate(45deg)"}}></div></div>
          <span style={{"fontWeight": "700", "fontSize": "15px"}}>FreightPilot</span>
        </div>
        <div style={{"fontSize": "13px", "color": "#6B7C8E"}}>AI Quote Desk для международных экспедиторов</div>
      </div>
      <div style={{"display": "flex", "gap": "28px", "flexWrap": "wrap"}}>
        <a href="#product" style={{"textDecoration": "none", "color": "#44576B", "fontSize": "13.5px", "fontWeight": "500"}} data-style-hover="color:#0B2239">Продукт</a>
        <a href="#workflow" style={{"textDecoration": "none", "color": "#44576B", "fontSize": "13.5px", "fontWeight": "500"}} data-style-hover="color:#0B2239">Процесс</a>
        <a href="#partner" style={{"textDecoration": "none", "color": "#44576B", "fontSize": "13.5px", "fontWeight": "500"}} data-style-hover="color:#0B2239">Дизайн-партнёрам</a>
        <a href="/workspace" style={{"textDecoration": "none", "color": "#44576B", "fontSize": "13.5px", "fontWeight": "500"}} data-style-hover="color:#0B2239">Интерактивное демо</a>
      </div>
    </div>
    <div style={{"borderTop": "1px solid rgba(11,34,57,.08)", "paddingTop": "20px", "fontSize": "12px", "color": "#9AA8B5"}}>© 2026 FreightPilot. Концепт-демонстрация продукта.</div>
  </div>
</div>

<button
  type="button"
  className="fp-scroll-top"
  onClick={scrollToTop}
  aria-label="Наверх"
  title="Наверх"
  data-style-hover="background:#123453;transform:translateY(-2px)"
  style={{
    "position": "fixed",
    "right": "24px",
    "bottom": "24px",
    "zIndex": "60",
    "width": "46px",
    "height": "46px",
    "border": "1px solid rgba(255,255,255,.34)",
    "borderRadius": "12px",
    "background": "#0B2239",
    "color": "#fff",
    "boxShadow": "0 14px 34px rgba(11,34,57,.24)",
    "display": "grid",
    "placeItems": "center",
    "cursor": "pointer",
    "opacity": showScrollTop ? "1" : "0",
    "pointerEvents": showScrollTop ? "auto" : "none",
    "transform": showScrollTop ? "translateY(0)" : "translateY(10px)",
    "transition": "opacity .18s ease, transform .18s ease, background .18s ease"
  }}
>
  <ArrowUp aria-hidden="true" size={20} strokeWidth={2.4} />
</button>

    </>
  );
}

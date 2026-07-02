'use strict';

/* ===================== 색상 (지역 관례에 따라 전환) =====================
   KR/동아시아: 빨강=상승·과열 / 파랑=하락   ·   EN/서구: 초록=상승 / 빨강=하락
   LANG 토글에 따라 히트맵·게이지·추이 색이 통째로 뒤집힘.                  */
const HEAT_STOPS_KO = [
  [-100, [49, 130, 246]],  // 파랑 (낮음=약세)
  [-50,  [70, 120, 205]],
  [-10,  [98, 116, 158]],
  [0,    [122, 126, 136]], // 중립 회색
  [10,   [180, 92, 102]],
  [56,   [220, 46, 71]],   // 빨강
  [100,  [165, 28, 46]],   // 진빨강 (높음=강세)
];
const HEAT_STOPS_EN = [
  [-100, [220, 46, 71]],   // 빨강 (낮음=약세/하락)
  [-50,  [196, 64, 80]],
  [-10,  [150, 108, 116]],
  [0,    [122, 126, 136]], // 중립 회색
  [10,   [96, 160, 118]],
  [56,   [34, 197, 94]],   // 초록
  [100,  [22, 150, 72]],   // 진초록 (높음=강세/상승)
];
function heatColor(score){
  const STOPS = (LANG === 'en') ? HEAT_STOPS_EN : HEAT_STOPS_KO;
  const s = Math.max(-100, Math.min(100, score));
  for (let i = 0; i < STOPS.length - 1; i++){
    const [p0, c0] = STOPS[i], [p1, c1] = STOPS[i + 1];
    if (s >= p0 && s <= p1){
      const t = (s - p0) / (p1 - p0);
      return [0,1,2].map(k => Math.round(c0[k] + (c1[k] - c0[k]) * t));
    }
  }
  return STOPS[STOPS.length - 1][1];
}
function rgb(c){ return `rgb(${c[0]},${c[1]},${c[2]})`; }
function luminance(c){ return (0.299*c[0] + 0.587*c[1] + 0.114*c[2]) / 255; }

/* ===================== 다국어 (i18n.js 사전 사용) ===================== */
let LANG = 'ko';
try { LANG = (localStorage.getItem('lang') === 'en') ? 'en' : 'ko'; } catch (e) {}
const L = (k) => (typeof I18N !== 'undefined' && I18N[LANG] && I18N[LANG][k] != null) ? I18N[LANG][k] : k;
const CAT_DISPLAY_KO = { '매크로·규제': '매크로·규제·유동성' };   // KO 카테고리 표시명만 오버라이드(내부 키·데이터는 그대로)
const catName = (c) => (LANG === 'en' && typeof CATS_EN !== 'undefined' && CATS_EN[c]) ? CATS_EN[c] : ((typeof CAT_DISPLAY_KO !== 'undefined' && CAT_DISPLAY_KO[c]) || c);
const enItem = (it) => (LANG === 'en' && typeof ITEMS_EN !== 'undefined') ? (ITEMS_EN[it.short] || {}) : {};
const shortOf = (it) => enItem(it).short || it.short || it.name;
const nameOf  = (it) => enItem(it).name  || it.name;
const descOf  = (it) => enItem(it).desc  || it.desc || '';
function transVal(s){
  if (LANG !== 'en' || !s || typeof VAL_TOKENS === 'undefined') return s;
  let out = String(s);
  for (const [k, v] of VAL_TOKENS) out = out.split(k).join(v);
  return out;
}
function valOf(it){
  if (LANG !== 'en') return it.value != null ? String(it.value) : '';
  const e = enItem(it);
  return e.value != null ? e.value : transVal(it.value != null ? String(it.value) : '');
}

const ZONE_COLORS = {
  ko: ['#3182f6', '#4391ff', '#9498a4', '#f5445a', '#dc2e47'],
  en: ['#dc2e47', '#f5445a', '#9498a4', '#22c55e', '#16a34a'],
};
const ZONE_EMOJI = {
  ko: ['🥶', '🐧', '😴', '🥵', '🚀'],
  en: ['🐻', '🐻', '😐', '🐂', '🐂'],   // 곰=약세 / 황소=강세
};
function zoneFor(s){
  const zi = s < 200 ? 0 : s < 400 ? 1 : s < 600 ? 2 : s < 800 ? 3 : 4;
  return { zi, emoji: (ZONE_EMOJI[LANG] || ZONE_EMOJI.ko)[zi], color: (ZONE_COLORS[LANG] || ZONE_COLORS.ko)[zi] };
}
const zoneLab = (z) => (typeof ZONES !== 'undefined') ? ZONES[LANG].lab[z.zi] : '';
const zoneTag = (z) => (typeof ZONES !== 'undefined') ? ZONES[LANG].msg[z.zi] : '';

/* ===================== 점수 체계 (측정 0~100 ↔ 표시 −100~+100) =====================
   measure(it) : 내부 측정 점수 0~100  (raw 를 lo→0·hi→100 선형정규화 / 총점 계산의 기준)
   표시 점수    : −100~+100 = 2·측정 − 100   (0=중립, 전 항목 동일 스케일)
   역변환       : 측정 = (표시 + 100) / 2
   총점(0~1000) : Σ(weight·측정) / Σweight × 10                                          */
function measure(it){   // 내부 측정: 0~100
  if (it.shape === 'binary') return it.raw > 0 ? 100 : 0;
  let s;
  if (it.shape === 'bell') s = 100 - Math.abs(it.raw - 15) * 4.5;   // 종형(피크 12~18)
  else if (it.lo == null || it.hi == null || it.raw == null) s = 50;
  else s = (it.raw - it.lo) / (it.hi - it.lo) * 100;   // 역방향은 lo>hi 자동
  return Math.max(0, Math.min(100, s));
}
const toDisplay = m => Math.round(m * 2 - 100);   // 측정 0~100 → 표시 −100~+100
const toMeasure = d => (d + 100) / 2;             // 표시 −100~+100 → 측정 0~100 (역변환)
function scoreOf(it){ return toDisplay(measure(it)); }   // 화면 표시(−100~+100, 전 항목 동일)
function normScore(it){ return toDisplay(measure(it)); } // 색·게이지(= 표시 점수와 동일)

/* ===================== 총점 ===================== */
const SENSITIVITY = 1.8;   // 게이지 민감도(스프레드): 중립서 벗어난 정도 ×배. 1=원본. record_history.mjs 와 동일 유지!
function totalScore(){   // 측정(0~100) 가중평균 → 민감도 스프레드 → 0~1000
  let ws = 0, w = 0;
  CONFIG.items.forEach(it => { if (it.pending) return; ws += it.weight * measure(it); w += it.weight; });   // 미정(pending) 제외
  const avgMeasure = w ? ws / w : 50;          // 0~100 (50=중립)
  const spread = 50 + (avgMeasure - 50) * SENSITIVITY;
  return Math.max(0, Math.min(1000, Math.round(spread * 10)));   // → 0~1000 (500=중립)
}

/* ===================== 게이지 (직선 가로 바) ===================== */
function renderGauge(score){
  const host = document.getElementById('gauge');
  const z = zoneFor(score);
  const pct = Math.max(0, Math.min(100, score / 10));   // 0~1000 → 0~100%
  const mk  = Math.max(2, Math.min(98, pct));            // 마커 위치(끝 잘림 방지)
  host.innerHTML = `
    <div class="lg-head">
      <span class="lg-emoji">${z.emoji}</span>
      <span class="lg-score">${score}</span>
      <span class="lg-out">/ 1000</span>
    </div>
    <div class="lg-track">
      <div class="lg-marker" style="left:${mk}%"><div class="lg-knob"></div></div>
    </div>
    <div class="lg-ticks">
      <span>${LANG==='en'?'🐻 0':'❄️ 0'}</span><span>250</span><span>500</span><span>750</span><span>${LANG==='en'?'1000 🐂':'1000 🌋'}</span>
    </div>`;
}

/* ===================== 트리맵(squarified) ===================== */
function squarify(data, rect){
  const items = data.filter(d => d.value > 0).slice().sort((a, b) => b.value - a.value);
  const totalVal = items.reduce((s, d) => s + d.value, 0) || 1;
  const totalArea = Math.max(0, rect.w) * Math.max(0, rect.h);
  const nodes = items.map(d => ({ payload: d.payload, area: d.value / totalVal * totalArea }));
  const result = [];
  let x = rect.x, y = rect.y, w = rect.w, h = rect.h;

  function worst(row, side){
    const sum = row.reduce((s, n) => s + n.area, 0);
    let mx = -Infinity, mn = Infinity;
    for (const n of row){ if (n.area > mx) mx = n.area; if (n.area < mn) mn = n.area; }
    const s2 = sum * sum, d2 = side * side;
    return Math.max(d2 * mx / s2, s2 / (d2 * mn));
  }
  function place(row, wide){
    const sum = row.reduce((s, n) => s + n.area, 0);
    if (wide){
      const colW = sum / h;
      let cy = y;
      for (const n of row){ const nh = n.area / colW; result.push({ payload:n.payload, x, y:cy, w:colW, h:nh }); cy += nh; }
      x += colW; w -= colW;
    } else {
      const rowH = sum / w;
      let cx = x;
      for (const n of row){ const nw = n.area / rowH; result.push({ payload:n.payload, x:cx, y, w:nw, h:rowH }); cx += nw; }
      y += rowH; h -= rowH;
    }
  }

  let i = 0, row = [];
  while (i < nodes.length){
    const wide = w >= h;
    const side = wide ? h : w;
    const cand = row.concat([nodes[i]]);
    if (row.length === 0 || worst(cand, side) <= worst(row, side)){ row = cand; i++; }
    else { place(row, wide); row = []; }
  }
  if (row.length) place(row, w >= h);
  return result;
}

/* 타일 크기에 맞춰 글씨 크기 자동 계산 (최대한 크게) */
function fitFont(w, h, text){
  const len = Math.max(1, [...text].length);
  const byW = (w - 10) / (len * 0.92);   // 한글 폭 ≈ 0.92em
  const byH = (h - 12) * 0.58;
  return Math.max(9, Math.min(34, Math.floor(Math.min(byW, byH))));
}

/* 타일에 ±점수 대신 '실제 수치' 한 줄 — value의 핵심부(첫 '(' 또는 '·' 앞). placeholder/빈값이면 raw+단위 */
function headlineMetric(it){
  let v = valOf(it).trim();
  if (!v || v.indexOf('대기') >= 0 || v.indexOf('Loading') >= 0){
    v = (it.raw != null && !Number.isNaN(+it.raw))
      ? ((+it.raw > 0 ? '+' : '') + it.raw + (it.unit || ''))
      : '—';
  }
  return v.split(/\s*[(·]/)[0].trim();
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));

/* ── 전일(아침 7시 KST) 대비 등락 배지 — 중요도 7+ 항목만 ──
   데이터: deltas.json(live.js 가 로드, collect 가 append). 각 항목의 '표시 지표' 기준 변화량.
   색은 점수 방향(코인 우호=초록/약세=빨강), 화살표는 지표 자체의 증감. */
const DELTA_SPEC = {
  '김프':          { m: o => +o.raw,          f: v => v.toFixed(2) + '%p', min: 0.05 },
  '코인베이스 프리미엄': { m: o => +o.raw,     f: v => v.toFixed(2) + '%p', min: 0.05 },
  // ETF 는 전일비가 아니라 '전일 하루 순플로우' 절대값을 그대로 배지로: 유입=▲(초록)/유출=▼(빨강)
  'ETF 플로우':    { direct: it => (it.day == null ? null : { v: +it.day, good: +it.day >= 0 }),
                    f: v => v >= 0.995 ? '$' + v.toFixed(2) + 'B' : '$' + Math.round(v * 1000) + 'M',
                    min: 0.01, lab: { ko: '전일 ETF 순플로우', en: 'Prev-day ETF net flow' } },
  '$STRC':        { m: o => +o.raw,          f: v => '$' + v.toFixed(2), min: 0.05 },
  '$MSTR':        { m: o => { const x = /\$\s?([\d,]+(?:\.\d+)?)/.exec(o.value || ''); return x ? +x[1].replace(/,/g, '') : NaN; },
                    f: v => '$' + (Math.round(v * 10) / 10), min: 0.5 },
  'CLARITY':      { m: o => +o.raw / 2 + 50,  f: v => v.toFixed(0) + '%p', min: 1 },
  '반도체 독주장':  { m: o => +o.raw,          f: v => v.toFixed(1) + '%p', min: 0.1 },
  'FED 유동성':    { m: o => { const x = /\$\s?([\d.]+)\s*조/.exec(o.value || ''); return x ? +x[1] : NaN; },
                    f: v => '$' + v.toFixed(2) + '조', min: 0.01 },
  'M2 유동성':     { m: o => +o.raw,          f: v => v.toFixed(2) + '%p', min: 0.02 },
};
function deltaBase(){   // 기준선: '전날(KST) 아침 7시'에 가장 가까운 스냅샷 (±4h 없으면 null)
  const snaps = window.__deltas; if (!snaps || !snaps.length) return null;
  const k = new Date(Date.now() + 9 * 3600e3);   // KST 시프트
  const target = Date.UTC(k.getUTCFullYear(), k.getUTCMonth(), k.getUTCDate() - 1, 7, 0) - 9 * 3600e3;
  let best = null, bd = Infinity;
  for (const s of snaps){ const d = Math.abs(Date.parse(s.at) - target); if (d < bd){ bd = d; best = s; } }
  return bd <= 4 * 3600e3 ? best : null;
}
function deltaOf(it){   // → { txt, up(지표↑), good(점수↑), lab? } | null
  const spec = DELTA_SPEC[it.short]; if (!spec || it.pending) return null;
  if (spec.direct){                     // 절대값형(예: ETF 전일 하루 플로우) — 기준선 스냅샷 불필요
    const d = spec.direct(it);
    if (!d || !isFinite(d.v) || Math.abs(d.v) < (spec.min || 0)) return null;
    return { txt: spec.f(Math.abs(d.v)), up: d.v > 0, good: d.good, lab: spec.lab };
  }
  const base = deltaBase(); if (!base) return null;
  const b = base.items[it.short]; if (!b) return null;
  const cur = spec.m(it), prev = spec.m(b);
  if (!isFinite(cur) || !isFinite(prev)) return null;
  const d = cur - prev;
  if (Math.abs(d) < spec.min) return null;
  const good = (measure(it) - measure({ ...it, raw: +b.raw })) >= 0;
  return { txt: spec.f(Math.abs(d)), up: d > 0, good };
}

let tooltipEl;
const isMobile = () => window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 640;

/* 지표 한 줄 코멘트 (commentary.js) — 현재 표시점수로 우호/중립/약세 골라 노란 글씨 */
function commentOf(it){
  // 1) AI 일일 코멘트 우선 (commentary-daily.js, 매일 갱신). 있으면 그대로 사용.
  if (typeof COMMENT_DAILY !== 'undefined' && COMMENT_DAILY){
    const dc = COMMENT_DAILY[it.short];
    if (dc){
      const line = (LANG === 'en' && dc.en) ? dc.en : dc.ko;
      if (line) return line;
    }
  }
  // 2) 룰베이스 fallback (commentary.js) — 현재 점수로 버킷 선택, 항상 동작.
  const c = (typeof COMMENT !== 'undefined') ? COMMENT[it.short] : null;
  if (!c) return '';
  const arr = (LANG === 'en' && c.en) ? c.en : c.ko;
  const d = scoreOf(it);
  return arr[d >= 20 ? 0 : d <= -20 ? 2 : 1] || '';
}

/* 일일 AI 상세 (commentary-daily.js) — why: BTC 연관성 / now: 지금 영향. 없으면 폴백. */
function dailyOf(it){ return (typeof COMMENT_DAILY !== 'undefined' && COMMENT_DAILY) ? COMMENT_DAILY[it.short] : null; }
function whyOf(it){
  const d = dailyOf(it);
  if (d && d.why){ const t = (LANG === 'en' && d.why.en) ? d.why.en : d.why.ko; if (t) return t; }
  return descOf(it);                  // 폴백: 기존 설명(왜/무엇을 재는지)
}
function nowOf(it){
  const d = dailyOf(it);
  if (d && d.now){ const t = (LANG === 'en' && d.now.en) ? d.now.en : d.now.ko; if (t) return t; }
  return '';                          // AI 생성 전엔 비움(워크플로 돌면 채워짐)
}

/* 모바일: 툴팁을 탭한 타일 근처에 배치(아래 우선 → 공간 없으면 위 → 항상 화면 안으로 클램프) */
function placeNearTile(el){
  const r = el.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight, gap = 8, m = 8;
  const tw = Math.min(300, vw - m * 2);
  tooltipEl.style.width = tw + 'px';
  const th = tooltipEl.offsetHeight;
  const left = Math.min(Math.max(r.left, m), vw - tw - m);
  let top;
  if (r.bottom + gap + th <= vh - m) top = r.bottom + gap;          // 타일 바로 아래
  else if (r.top - gap - th >= m)    top = r.top - gap - th;         // 공간 없으면 위로 뒤집기
  else                               top = Math.max(m, vh - th - m); // 그래도 안 되면 화면 안 최대
  top = Math.max(m, Math.min(top, vh - th - m));   // 최종 클램프: 항상 화면 안(상·하단 잘림 방지)
  tooltipEl.style.left = left + 'px';
  tooltipEl.style.top  = top + 'px';
}

function bindTooltip(el, it, catColor){
  el.addEventListener('mouseenter', () => {
    const cmt = commentOf(it);
    const why = whyOf(it);
    const now = nowOf(it);
    const dl = deltaOf(it);
    // AI 코멘트는 하루 2회(아침/저녁) 생성 — 실시간 타일 수치와 시점이 달라 작성 시각을 함께 표시
    const dc = dailyOf(it);
    const atM = (cmt && dc && ((LANG === 'en' && dc.en) || dc.ko) && typeof COMMENT_DAILY_AT !== 'undefined')
      ? String(COMMENT_DAILY_AT).match(/(\d{1,2}:\d{2})/) : null;
    const cmtAt = atM ? atM[1] : '';
    tooltipEl.innerHTML =
      `<h4>${nameOf(it)} <span class="chip" style="background:${catColor}">${catName(it.cat)}</span></h4>` +
      (cmt ? `<div class="cmt">💬 ${esc(cmt)}${cmtAt ? ` <span class="cmt-at">· ${LANG === 'en' ? 'as of ' + cmtAt : cmtAt + ' 기준'}</span>` : ''}</div>` : '') +
      (dl ? `<div class="tt-delta">${dl.lab ? (LANG === 'en' ? dl.lab.en : dl.lab.ko) : L('deltaVs')} <b class="${dl.good ? 'g' : 'b'}">${dl.up ? '▲' : '▼'} ${esc(dl.txt)}</b></div>` : '') +
      (it.pending ? `<div class="row" style="color:#fbbf24;font-weight:700;margin:0 0 6px">⊘ ${L('excluded')}</div>` : '') +
      (why ? `<div class="tt-sec"><div class="tt-lab why">🔗 ${L('whyBtc')}</div><div class="tt-txt">${esc(why)}</div></div>` : '') +
      (now ? `<div class="tt-sec"><div class="tt-lab now">📊 ${L('nowImpact')}</div><div class="tt-txt">${esc(now)}</div></div>` : '');
    tooltipEl.classList.add('show');
    tooltipEl.setAttribute('aria-hidden', 'false');
    if (isMobile()){                         // 모바일: 탭한 타일 근처에 앵커(아래 우선→공간없으면 위→화면 안으로 클램프)
      tooltipEl.classList.remove('sheet');
      tooltipEl.classList.add('pin');
      placeNearTile(el);
    } else {
      tooltipEl.classList.remove('sheet', 'pin');
      tooltipEl.style.width = '';
    }
  });
  el.addEventListener('mousemove', (e) => {
    if (isMobile()) return;                  // 시트는 위치 고정 — 커서 추적 안 함
    const pad = 14, tw = tooltipEl.offsetWidth, th = tooltipEl.offsetHeight;
    let x = e.clientX + pad, y = e.clientY + pad;
    if (x + tw > window.innerWidth  - 8) x = e.clientX - tw - pad;
    if (y + th > window.innerHeight - 8) y = e.clientY - th - pad;
    x = Math.max(8, Math.min(x, window.innerWidth  - tw - 8));   // 좌우 잘림 방지(데스크탑 가장자리)
    y = Math.max(8, Math.min(y, window.innerHeight - th - 8));
    tooltipEl.style.left = x + 'px';
    tooltipEl.style.top  = y + 'px';
  });
  el.addEventListener('mouseleave', () => {
    tooltipEl.classList.remove('show', 'sheet', 'pin');
    tooltipEl.setAttribute('aria-hidden', 'true');
  });
}

let _heatSig = '';   // 히트맵 레이아웃 시그니처(폭·높이·언어·항목). 같으면 재생성 없이 색·수치만 갱신.
function updateHeatmapData(host){    // 90초 라이브 갱신: 전체 재생성 없이 타일 색/수치만 업데이트(깜빡임 방지)
  CONFIG.items.forEach(it => {
    const tile = host.querySelector('.tile[data-short="' + it.short + '"]');
    if (!tile) return;
    tile.style.backgroundColor = rgb(heatColor(normScore(it)));
    const mEl = tile.querySelector('.t-metric');
    if (mEl) mEl.textContent = headlineMetric(it);
    const dl = mEl ? deltaOf(it) : null;             // 전일비 배지도 제자리 갱신(생성/삭제 포함)
    let dEl = tile.querySelector('.t-delta');
    if (dl){
      if (!dEl){ dEl = document.createElement('div'); tile.appendChild(dEl); }
      dEl.className = 't-delta ' + (dl.good ? 'g' : 'b');
      dEl.textContent = (dl.up ? '▲ ' : '▼ ') + dl.txt;
    } else if (dEl) dEl.remove();
  });
}
function renderHeatmap(){
  const host = document.getElementById('heatmap');
  const W = host.clientWidth, H = host.clientHeight;
  if (!W || !H) return;
  const sig = `${W}x${H}|${LANG}|${CONFIG.items.map(i => i.short).join(',')}`;
  if (sig === _heatSig && host.querySelector('.tile')){
    updateHeatmapData(host);          // 레이아웃 동일 → 색·수치만 제자리 갱신(재생성 X)
    return;
  }
  _heatSig = sig;
  host.innerHTML = '';

  const order = Object.keys(CONFIG.categories);
  const groups = {};
  CONFIG.items.forEach(it => { (groups[it.cat] = groups[it.cat] || []).push(it); });
  const cats = order.filter(c => groups[c]).map(c => ({
    name: c, items: groups[c], value: groups[c].reduce((s, i) => s + i.weight, 0),
  }));

  const PAD = 1, HEAD = 24;
  const catRects = squarify(cats.map(c => ({ value: c.value, payload: c })), { x:0, y:0, w:W, h:H });

  catRects.forEach(cr => {
    const cat = cr.payload;
    const col = (CONFIG.categories[cat.name] || {}).color || '#64748b';

    const box = document.createElement('div');
    box.className = 'cat-box';
    box.style.cssText = `left:${cr.x}px;top:${cr.y}px;width:${Math.max(0,cr.w)}px;height:${Math.max(0,cr.h)}px`;
    host.appendChild(box);

    const head = document.createElement('div');
    head.className = 'cat-head';
    head.style.cssText = `left:${cr.x}px;top:${cr.y}px;width:${cr.w}px;height:${HEAD}px;--cc:${col}`;
    head.innerHTML = `<span class="ch-name">${catName(cat.name)}</span>`;
    host.appendChild(head);

    const inner = { x: cr.x + PAD, y: cr.y + PAD + HEAD, w: cr.w - 2*PAD, h: cr.h - 2*PAD - HEAD };
    if (inner.w <= 2 || inner.h <= 2) return;

    const itemRects = squarify(cat.items.map(it => ({ value: it.weight, payload: it })), inner);
    itemRects.forEach(ir => {
      const it = ir.payload;
      const nv = normScore(it);
      const c = heatColor(nv);
      const g = 1;
      const tw = Math.max(0, ir.w - g), th = Math.max(0, ir.h - g);
      const tile = document.createElement('div');
      tile.className = it.pending ? 'tile pending' : 'tile';
      tile.dataset.short = it.short;
      tile.style.cssText = `left:${ir.x+g/2}px;top:${ir.y+g/2}px;width:${tw}px;height:${th}px;background-color:${rgb(c)}`;
      tile.style.color = '#fff';                       // 핀비즈식: 항상 흰 글씨
      tile.style.textShadow = '0 1px 3px rgba(0,0,0,.55)';

      const label = shortOf(it);
      const metric = headlineMetric(it);               // 점수 대신 실수치
      const showMetric = th >= 46 && tw >= 50 && metric;
      let fs = fitFont(tw, th, label);
      if (showMetric) fs = Math.min(fs, fitFont(tw, th * 0.62, label));   // 이름은 위쪽만 차지
      const L = Math.max(1, [...metric].length);
      const mfs = Math.max(8, Math.min(15, Math.floor(fs * 0.7), Math.floor((tw - 4) / (L * 0.62))));
      const dl = showMetric ? deltaOf(it) : null;    // 전일비 배지(중요도 7+·기준선 있을 때만)
      tile.innerHTML =
        `<div class="t-name" style="font-size:${fs}px">${label}</div>` +
        (showMetric ? `<div class="t-metric" style="font-size:${mfs}px">${esc(metric)}</div>` : '') +
        (dl ? `<div class="t-delta ${dl.good ? 'g' : 'b'}">${dl.up ? '▲' : '▼'} ${esc(dl.txt)}</div>` : '');
      bindTooltip(tile, it, col);
      host.appendChild(tile);
    });
  });
}

/* ===================== 요약 / 카테고리 / 데이터상태 ===================== */
function renderStatus(t){
  const z = zoneFor(t);
  document.getElementById('status').innerHTML =
    `${z.emoji} <b style="color:${z.color}">${zoneLab(z)}</b> <span class="st-msg">· ${zoneTag(z)}</span>`;
}
function renderCatBreak(){
  const host = document.getElementById('catbreak'); if (!host) return;
  const order = Object.keys(CONFIG.categories).filter(c => CONFIG.items.some(i => i.cat === c));
  host.innerHTML = order.map(c => {
    let ws = 0, w = 0;
    CONFIG.items.filter(i => i.cat === c && !i.pending).forEach(i => { ws += i.weight * normScore(i); w += i.weight; });
    const sc = w ? Math.round(ws / w) : 0;
    const col = rgb(heatColor(sc));
    return `<div class="cb-chip"><span class="cb-dot" style="background:${col}"></span>`
      + `<span class="cb-name">${catName(c)}</span><span class="cb-score" style="color:${col}">${sc>0?'+':''}${sc}</span></div>`;
  }).join('');
}
function renderDataStat(){
  const host = document.getElementById('datastat'); if (!host) return;
  let live = 0, app = 0, tmp = 0;
  CONFIG.items.forEach(i => { if (i.live === '실시간') live++; else if (i.live === '추정') app++; else tmp++; });
  const dot = c => `<span class="ds-dot" style="background:${c}"></span>`;
  const stamp = window.__liveAt ? `⟳ ${window.__liveAt} ${L('updated')}` : (CONFIG.updated ? `${L('asof')} ${CONFIG.updated}` : '');
  host.innerHTML =
    `<span class="ds-item">${dot('#15c47e')}${L('live')} ${live}</span>` +
    `<span class="ds-item">${dot('#e0922f')}${L('est')} ${app}</span>` +
    `<span class="ds-item">${dot('#6b6f7a')}${L('tmp')} ${tmp}</span>` +
    (stamp ? `<span class="ds-item" style="color:var(--muted)">${stamp}</span>` : '');
}

/* ===================== init ===================== */
function renderTrend(){
  const host = document.getElementById('trend'); if (!host) return;
  const h = (typeof HISTORY !== 'undefined' ? HISTORY : []).slice();
  if (h.length < 2) {
    host.innerHTML = `<div class="trend-empty">${L('trendEmpty')}</div>`;
    return;
  }
  h[h.length - 1] = { d: h[h.length - 1].d, s: totalScore() };   // 끝점 = 현재 총점
  const VW = 1000, H = 96, padT = 14, padB = 18, padX = 6;
  const vals = h.map(p => p.s);
  let lo = Math.min(500, ...vals), hi = Math.max(500, ...vals);
  const pad = Math.max(15, (hi - lo) * 0.18); lo = Math.max(0, lo - pad); hi = Math.min(1000, hi + pad);
  if (hi === lo) hi = lo + 1;
  const X = i => padX + i * (VW - 2 * padX) / (h.length - 1);
  const Y = v => padT + (H - padT - padB) * (1 - (v - lo) / (hi - lo));
  const pts = h.map((p, i) => `${X(i).toFixed(1)},${Y(p.s).toFixed(1)}`);
  const last = h[h.length - 1], lx = X(h.length - 1), ly = Y(last.s);
  const zc = zoneFor(last.s).color;
  const delta = last.s - h[h.length - 2].s;
  const area = `M ${X(0).toFixed(1)},${H - padB} L ${pts.join(' L ')} L ${lx.toFixed(1)},${H - padB} Z`;
  const y500 = Y(500).toFixed(1);
  host.innerHTML =
    `<div class="trend-head"><span class="trend-title">${L('trendTitle')}</span>`
    + `<span class="trend-now" style="color:${zc}">${last.s}<small> ${delta >= 0 ? '▲ +' + delta : '▼ ' + delta}</small></span></div>`
    + `<svg viewBox="0 0 ${VW} ${H}" preserveAspectRatio="none" class="trend-svg">`
    + `<defs><linearGradient id="trendg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${zc}" stop-opacity=".28"/><stop offset="100%" stop-color="${zc}" stop-opacity="0"/></linearGradient></defs>`
    + `<line x1="${padX}" y1="${y500}" x2="${VW - padX}" y2="${y500}" stroke="rgba(214,224,239,.18)" stroke-width="1" stroke-dasharray="5 5"/>`
    + `<path d="${area}" fill="url(#trendg)"/>`
    + `<polyline points="${pts.join(' ')}" fill="none" stroke="${zc}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`
    + `<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="5" fill="${zc}"/>`
    + `</svg>`
    + `<div class="trend-x"><span>${h[0].d}</span><span class="trend-mid">· · · ${L('neutral500')} · · ·</span><span>${last.d}</span></div>`;
}
function render(){ const t = totalScore(); renderGauge(t); renderStatus(t); renderTrend(); renderCatBreak(); renderHeatmap(); renderDataStat(); }
function applyStatic(){
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  set('title', LANG === 'en' ? `🐂 ${L('title')} 🐻` : `🔥 ${L('title')}`);
  set('subtitle', L('subtitle'));
  set('footContact', `${L('footContact')} · <a href="https://t.me/PARKA44">${LANG==='ko'?'텔레그램':'Telegram'} @PARKA44</a> · <a href="mailto:PARKA44@NAVER.COM">PARKA44@NAVER.COM</a>`);
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = LANG === 'ko' ? 'EN' : '한국어';
  document.documentElement.lang = LANG;
  document.title = L('title') + (LANG === 'en' ? ' 🐂' : ' 🔥');
}
function setLang(lng){
  LANG = (lng === 'en') ? 'en' : 'ko';
  try { localStorage.setItem('lang', LANG); } catch (e) {}
  applyStatic(); render();
}
function init(){
  tooltipEl = document.getElementById('tooltip');
  document.addEventListener('click', (e) => {   // 모바일: 빈 곳/시트 밖 탭하면 닫기
    if (isMobile() && tooltipEl && !e.target.closest('.tile') && !e.target.closest('.tooltip'))
      tooltipEl.classList.remove('show', 'sheet', 'pin');
  });
  const btn = document.getElementById('langToggle');
  if (btn) btn.addEventListener('click', () => setLang(LANG === 'ko' ? 'en' : 'ko'));
  applyStatic();
  render();
  let t, lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastW) return;     // 높이만 변한 resize(모바일 주소창 토글 등)는 무시 — 트리맵 재배치 깜빡임 방지
    lastW = window.innerWidth;
    clearTimeout(t); t = setTimeout(renderHeatmap, 120);
  });
}
if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

'use strict';
// 브라우저에서 직접 무료·CORS 공개 API 호출 → CONFIG.items 의 raw/value 갱신 → 재렌더
// ※ 키 불필요. 실패한 피드는 기존(스냅샷/임시) 값 유지. 90초마다 갱신.

const FEEDS = {
  // 김치 프리미엄 — 업비트 직접호출은 CORS 차단이라 CoinGecko 업비트 티커로 우회 + Coinbase + 환율(ECB).
  // 실패하면 서버 수집값(live-extra.json, 3시간마다)이 그대로 유지된다.
  '김프': async () => {
    const [tk, cb, fx] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/exchanges/upbit/tickers?coin_ids=bitcoin').then(r => r.json()),
      fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot').then(r => r.json()),
      fetch('https://api.frankfurter.app/latest?from=USD&to=KRW').then(r => r.json()),
    ]);
    const t = (tk.tickers || []).find(x => x.base === 'BTC' && x.target === 'KRW');
    const krw = +t.last, usd = +cb.data.amount, rate = +fx.rates.KRW;
    const kp = (krw / (usd * rate) - 1) * 100;
    if (!isFinite(kp)) throw new Error('kimp NaN');
    return { raw: Math.round(kp * 100) / 100,
             value: `${kp >= 0 ? '+' : ''}${kp.toFixed(2)}% (vs 환율 ₩${rate.toFixed(0)})` };
  },
  // 공포·탐욕 (0~100)
  '공포·탐욕': async () => {
    const j = await (await fetch('https://api.alternative.me/fng/')).json();
    const d = j.data[0], v = +d.value;
    return { raw: v, value: `${v} · ${d.value_classification}` };
  },
  // 비트코인 ATH 대비 낙폭(%) + 현재가
  'ATH 낙폭': async () => {
    const a = await (await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin')).json();
    const m = a[0], dd = m.ath_change_percentage;
    return { raw: Math.round(dd * 10) / 10,
             value: `${dd.toFixed(1)}% (현 $${(m.current_price/1000).toFixed(1)}k / ATH $${(m.ath/1000).toFixed(0)}k)` };
  },
  // 테더 도미넌스(%)
  'USDT.D': async () => {
    const j = await (await fetch('https://api.coingecko.com/api/v3/global')).json();
    const d = j.data.market_cap_percentage.usdt;
    return { raw: Math.round(d * 100) / 100, value: `${d.toFixed(2)}%` };
  },
  // BTC 펀딩비(%/8h)
  '펀딩비': async () => {
    const j = await (await fetch('https://fapi.binance.com/fapi/v1/premiumIndex?symbol=BTCUSDT')).json();
    const f = +j.lastFundingRate * 100;
    return { raw: Math.round(f * 1000) / 1000, value: `${f>=0?'+':''}${f.toFixed(3)}%/8h` };
  },
  // 상위 트레이더 롱/숏 포지션 비율 (전체계정 globalLongShortAccountRatio 아님)
  '롱/숏': async () => {
    const a = await (await fetch('https://fapi.binance.com/futures/data/topLongShortPositionRatio?symbol=BTCUSDT&period=1h&limit=1')).json();
    const r = +a[0].longShortRatio;
    return { raw: Math.round(r * 100) / 100, value: `${r.toFixed(2)} (상위 트레이더)` };
  },
  // 미결제약정(OI) 30일 변화율(%) — 바이낸스 선물
  'OI': async () => {
    const a = await (await fetch('https://fapi.binance.com/futures/data/openInterestHist?symbol=BTCUSDT&period=1d&limit=30')).json();
    const f = +a[0].sumOpenInterest, l = +a[a.length - 1].sumOpenInterest;
    const m = (l / f - 1) * 100;
    return { raw: Math.round(m * 10) / 10, value: `MoM ${m >= 0 ? '+' : ''}${m.toFixed(1)}%` };
  },
  // 옵션 변동성 지수(DVOL) — Deribit
  'DVOL': async () => {
    const end = Date.now(), start = end - 24 * 3600 * 1000;
    const u = `https://www.deribit.com/api/v2/public/get_volatility_index_data?currency=BTC&start_timestamp=${start}&end_timestamp=${end}&resolution=3600`;
    const j = await (await fetch(u)).json();
    const d = j.result.data;
    let last = d[d.length - 1][4];
    if (last < 2) last *= 100;   // 혹시 0~1 스케일로 오면 % 환산
    return { raw: Math.round(last * 10) / 10, value: `${last.toFixed(1)}` };
  },
  // 옵션 풋/콜 미결제약정 비율 — Deribit
  '풋/콜': async () => {
    const j = await (await fetch('https://www.deribit.com/api/v2/public/get_book_summary_by_currency?currency=BTC&kind=option')).json();
    let call = 0, put = 0;
    for (const o of j.result) {
      const oi = o.open_interest || 0;
      if (o.instrument_name.endsWith('-C')) call += oi;
      else if (o.instrument_name.endsWith('-P')) put += oi;
    }
    const pc = call ? put / call : 1;
    return { raw: Math.round(pc * 100) / 100, value: `${pc.toFixed(2)} (P/C OI)` };
  },
  // 코인베이스 프리미엄(%) = (Coinbase - Binance) / Binance
  // Binance 가격은 공식 공개미러(binance.vision) — api.binance.com 은 미국 등 일부 지역 IP 차단이라 전세계 방문자 커버.
  '코인베이스 프리미엄': async () => {
    const [cb, bn] = await Promise.all([
      fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot').then(r => r.json()),
      fetch('https://data-api.binance.vision/api/v3/ticker/price?symbol=BTCUSDT').then(r => r.json()),
    ]);
    const c = +cb.data.amount, b = +bn.price, p = (c - b) / b * 100;
    return { raw: Math.round(p * 1000) / 1000, value: `${p>=0?'+':''}${p.toFixed(3)}% (CB $${(c/1000).toFixed(1)}k)` };
  },
};

// 서버 수집기(GitHub Actions)가 만든 live-extra.json 을 읽어 병합 (주식·매크로·스테이블·Puell·M2)
async function applyExtra(){
  try {
    const j = await (await fetch('live-extra.json?t=' + Date.now(), { cache: 'no-store' })).json();
    if (!j || !j.items) return 0;
    let n = 0;
    for (const [sh, o] of Object.entries(j.items)) {
      const it = CONFIG.items.find(i => i.short === sh);
      if (it && o && o.raw != null && !Number.isNaN(+o.raw)) {
        it.raw = +o.raw;
        if (o.value) it.value = o.value;
        if (o.day != null) it.day = +o.day;   // ETF 전일 하루 순플로우($B) — 배지용
        it.live = '실시간';
        n++;
      }
    }
    return n;
  } catch (e) { return 0; }
}

// 전일비 배지 데이터(deltas.json) — collect 가 3시간(미 장중 1시간)마다 append. app.js deltaOf 가 사용.
async function loadDeltas(){
  try {
    const j = await (await fetch('deltas.json?t=' + Date.now(), { cache: 'no-store' })).json();
    if (j && Array.isArray(j.snaps)) window.__deltas = j.snaps;
  } catch (e) {}
}

async function refreshLive(){
  if (typeof CONFIG === 'undefined') return;
  const [res, extra] = await Promise.all([
    Promise.allSettled(Object.entries(FEEDS).map(async ([sh, fn]) => ({ sh, out: await fn() }))),
    applyExtra(),
    loadDeltas(),
  ]);
  let ok = 0;
  res.forEach(r => {
    if (r.status !== 'fulfilled') return;
    const { sh, out } = r.value;
    const it = CONFIG.items.find(i => i.short === sh);
    if (it && out && out.raw != null && !Number.isNaN(out.raw)) {
      it.raw = out.raw;
      if (out.value) it.value = out.value;
      it.live = '실시간';
      ok++;
    }
  });
  window.__liveAt = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  console.log(`[live] ${ok}/${Object.keys(FEEDS).length} 피드 + 수집 ${extra}종 갱신`);
  if (typeof render === 'function') render();
}

if (document.readyState !== 'loading') refreshLive();
else document.addEventListener('DOMContentLoaded', refreshLive);
setInterval(refreshLive, 90000);   // 90초마다

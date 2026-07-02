'use strict';
/* ============================================================
   다국어 사전 (KR/EN) — app.js 가 LANG 에 따라 사용.
   data.js(한글 원본)·수집기는 그대로 두고, 여기서 영어를 덮어씌움.
   · I18N    : UI 고정 문구
   · ZONES   : 게이지 존 라벨/태그 (index 0=가장 추움 → 4=가장 뜨거움)
   · CATS_EN : 카테고리명
   · ITEMS_EN: 지표별 {short,name,desc,(value)} — value 는 수동(고정)항목만
   · VAL_TOKENS: 동적 value 문자열(수집기 생성)의 한글 토큰 치환 (긴 것 먼저)
   ============================================================ */

const I18N = {
  ko: {
    title: '지금 불장이야?', subtitle: '지금 시장은 어디쯤?',
    trendTitle: '총점 추이', neutral500: '500=중립',
    trendEmpty: '📈 오늘부터 총점 기록 시작 — 며칠 쌓이면 추이가 그려져요',
    live: '실시간', est: '추정', tmp: '임시', updated: '갱신(자동)', asof: '기준',
    excluded: '총점 미반영 (미정)', whyBtc: 'BTC와의 관계', nowImpact: '지금 BTC 영향',
    deltaVs: '전일 아침 7시 대비',
    footContact: '문의',
  },
  en: {
    title: 'Is it a bull market?', subtitle: "Where's the market now?",
    trendTitle: 'Score trend', neutral500: '500 = neutral',
    trendEmpty: '📈 Recording started today — the trend line appears in a few days',
    live: 'live', est: 'est.', tmp: 'tmp', updated: 'auto-updated', asof: 'as of',
    excluded: 'excluded — pending', whyBtc: 'Why it matters for BTC', nowImpact: 'Impact on BTC now',
    deltaVs: 'vs yesterday 7AM KST',
    footContact: 'Contact',
  },
};

const ZONES = {
  ko: { lab: ['꽁꽁 얼음', '오들오들', '노잼 구간', '후끈후끈', '떡상 불장'],
        msg: ['줍줍각?', '관망각', '눈치게임', '불장 예열', '가즈아'] },
  en: { lab: ['Frozen', 'Shivering', 'Meh', 'Heating up', 'Moon mode'],
        msg: ['buy the dip?', 'wait & see', 'standoff', 'warming up', 'LFG 🚀'] },
};

const CATS_EN = {
  '리테일·심리': 'Retail · Sentiment',
  '기관·자금': 'Institutions · Flows',
  '레버리지·파생': 'Leverage · Derivatives',
  '온체인': 'On-chain',
  '시장구조·사이클': 'Market Structure · Cycle',
  '매크로·규제': 'Macro · Reg · Liquidity',
};

const ITEMS_EN = {
  '김프': { short: 'Kimchi P.', name: 'Kimchi Premium', desc: "How much pricier Korea (Upbit) BTC is vs global (USD×FX). Large + = domestic overheating/bullish." },
  '공포·탐욕': { short: 'Fear&Greed', name: 'Fear & Greed', desc: 'Fear & Greed Index (0~100). 75+ extreme greed = overheated, 25- extreme fear = bottom.' },
  '소셜 멘션': { short: 'Social', name: 'Social Mentions', desc: 'Coin mentions on X/Reddit. Spikes = retail interest/FOMO.', value: '−20% vs avg (retail interest fading)' },
  '구글 검색': { short: 'Google', name: 'Google Trends', desc: "'bitcoin' etc. search volume. New retail inflow signal.", value: '−25% vs avg (rebound after May low)' },
  '앱 순위': { short: 'App Rank', name: 'Coinbase App Rank', desc: 'App store ranking — higher = new retail onboarding.', value: 'US Finance ~#35 (bear: 30-50)' },
  'ETF 플로우': { short: 'ETF Flow', name: 'ETF Net Flow', desc: 'US spot BTC ETF 7-day net flow ($B) — LookOnChain daily. +inflow=institutional buying, −outflow=exit. Range ±$2B/7d.' },
  '코인베이스 프리미엄': { short: 'CB Prem.', name: 'Coinbase Premium', desc: 'Coinbase(USD) premium vs global. + = US institutional strength. Range ±0.4%.' },
  'CME 선물': { short: 'CME Fut.', name: 'CME Futures OI', desc: 'Chicago BTC futures OI/basis. Institutional leverage & interest.', value: 'OI ≈$6.8B · 14.6% share' },
  '스테이블 공급': { short: 'Stables', name: 'Stablecoin Supply', desc: 'USDT+USDC market cap. Growth = dry powder (buyers waiting).' },
  '$STRC': { short: '$STRC', name: '$STRC Price', desc: "Strategy(MSTR) 'Stretch' preferred. ~$100 par design → above par = strong demand. $90↓=−100, $100=+100." },
  '$MSTR': { short: '$MSTR', name: '$MSTR Price', desc: 'MicroStrategy (BTC treasury stock) position in its 52-week range (%). Near high = strong institutional leverage demand (100), near low = weak (0).' },
  '펀딩비': { short: 'Funding', name: 'Funding Rate', desc: 'Perp futures funding. High + = long overheating (pullback risk).' },
  'OI': { short: 'OI', name: 'Open Interest', desc: 'Futures open interest. Rising = market heating up.' },
  '롱/숏': { short: 'L/S', name: 'Long/Short Ratio', desc: 'Top-trader long vs short positioning.' },
  '풋/콜': { short: 'P/C', name: 'Put/Call Ratio', desc: 'Options put/call OI. Deribit ~0.7 neutral (1.0=bearish / 0.4=bullish). Lower = more bullish.' },
  'DVOL': { short: 'DVOL', name: 'Options Vol (DVOL)', desc: 'BTC options volatility index & skew. Gauges overheating/panic.' },
  'SOPR': { short: 'SOPR', name: 'SOPR', desc: 'Spent Output Profit Ratio. Above 1 = profit-taking dominant.', value: '0.99 (near breakeven)' },
  '거래소 보유량': { short: 'Exch. Bal.', name: 'Exchange BTC Balance', desc: 'Coins leaving exchanges = supply squeeze / long-term holding (bullish).', value: '7yr low 2.21M BTC (declining)' },
  '채굴자 매도': { short: 'Miner Sell', name: 'Miner Selling (Puell)', desc: 'Miner revenue / sell pressure. High = distribution pressure.' },
  '고래 축적': { short: 'Whales', name: 'Whale Accumulation', desc: 'Large-wallet net accumulation/distribution trend.', value: 'Strong accumulation (30d +270K BTC)' },
  'USDT.D': { short: 'USDT.D', name: 'Tether Dominance', desc: 'Stablecoin share of market. ↓ = risk-on (inverse indicator).' },
  'ATH 낙폭': { short: 'ATH Draw', name: 'Drawdown from ATH', desc: 'Distance from all-time high. Cycle position.' },
  '증시 쏠림': { short: 'Concen.', name: 'Market Concentration', desc: 'SPY(cap-weight) ÷ RSP(equal-weight) position in its 52-week range. Top = capital crowded into a few megacaps (AI/semis) = risk capital locked out of crypto (inverse). Bottom = broad (bullish).' },
  'FED 유동성': { short: 'FED Liq.', name: 'FED Net Liquidity', desc: 'Core framework. Fed balance sheet − TGA − RRP. Easing ↑ = risk-on. Scored on 3-month change.' },
  'M2 유동성': { short: 'M2', name: 'Global M2 Liquidity', desc: 'Global money supply. Very high correlation with crypto (lagging).' },
  '미국 증시 추세': { short: 'US Stocks', name: 'US Stock Trend (1w)', desc: 'S&P 500 (SPY) last 5-day (~1w) change. + uptrend = risk-on (crypto-friendly), − downtrend. ±4%/1w = ±100.' },
  'CLARITY': { short: 'CLARITY', name: 'CLARITY Act Odds', desc: "US market-structure law (CLARITY Act) '2026 signing' odds — Polymarket YES price. 50%=neutral, 100%=+100, 0%=−100." },
  '7월 FOMC': { short: 'Jul FOMC', name: 'July FOMC Rate', desc: 'Jul 28-29 FOMC rate decision (announced Jul 29, 2pm ET = Jul 30, 3am KST). Hike(hawkish)=−100, cut(dovish)=+100, undecided=0.', value: 'Jul 30, 3am KST' },
  'DXY': { short: 'DXY', name: 'Dollar Index (DXY)', desc: 'Strong dollar = headwind, weak dollar = tailwind.' },
  '반도체 독주장': { short: 'Semis', name: 'Semis vs S&P (SMH/SPY)', desc: 'Semiconductor ETF (SMH) ÷ S&P500 (SPY) 1-month relative return. Semis outperforming = capital concentrating in semis = crypto starved (inverse). +10%/1M=−100, −10%/1M=+100.' },
};

// 동적 value(수집기/브라우저 생성) 한글 토큰 → 영어. 긴 구절 먼저(부분치환 방지).
const VAL_TOKENS = [
  ['수집 대기…', 'Loading…'],
  ['vs 환율', 'vs FX'],
  ['상위 트레이더', 'top traders'],
  ['극단적 공포', 'Extreme Fear'], ['극도의 탐욕', 'Extreme Greed'],
  ['7년래 최저', '7yr low'], ['강한 매집', 'Strong accum.'],
  ['통과확률', 'Pass prob'],
  ['반도체 독주', 'semis leading'],
  ['쏠림 심함', 'high concen.'], ['쏠림 보통', 'moderate concen.'],
  ['상승추세', 'uptrend'], ['하락추세', 'downtrend'],
  ['달러지수', 'USD idx'], ['미 M2', 'US M2'],
  ['52주범위', '52w range'], ['52주', '52w'],
  ['3개월', '3mo'], ['4주', '4w'], ['1주', '1w'], ['주간', 'wk'],
  ['순유출', 'outflow'], ['순유입', 'inflow'],
  ['확산', 'broad'], ['횡보', 'flat'], ['약세', 'weak'], ['동행', 'in-line'],
  ['감소세', 'declining'], ['중립', 'neutral'], ['공포', 'Fear'], ['탐욕', 'Greed'],
  ['현 ', 'now '], ['조', 'T'],
];

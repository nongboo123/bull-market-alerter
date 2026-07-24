// ============================================================
//  암호화폐 불장 알림이 — 데이터
//  점수: 측정(내부)=0~100, 화면표시=−100~+100 = 2·측정−100 (전 항목 동일, 0=중립).
//  raw 를 lo→측정0 · hi→측정100 으로 선형정규화. 역변환 측정=(표시+100)/2. (range 필드 미사용)
//  총점 = Σ(weight·측정)/Σweight × 10 → 0~1000 (500=중립)
// ============================================================
const CONFIG = {
  updated: "2026-06-24 (추정치 웹검색 갱신)",
  categories: {
    "리테일·심리": { color: "#a78bfa" },
    "기관·자금": { color: "#60a5fa" },
    "레버리지·파생": { color: "#f472b6" },
    "온체인": { color: "#34d399" },
    "시장구조·사이클": { color: "#22d3ee" },
    "매크로·규제": { color: "#fbbf24" },
  },

  items: [
    // ── 리테일·심리 ──
    { short:"김프", name:"김치 프리미엄", cat:"리테일·심리", weight:7, lo:-4, hi:4, raw:0, unit:"%", live:"실시간", range:"pm100", value:"수집 대기…", desc:"한국(업비트) BTC가 해외(달러×환율)보다 비싼 정도. 환율 기준 헤드라인 김프(실시간·실패 시 서버값). 크게 +면 국내 과열·불장." },
    { short:"공포·탐욕", name:"공포·탐욕 지수", cat:"리테일·심리", weight:2, lo:0, hi:100, raw:23, unit:"", live:"실시간", range:"z100", value:"23 · 극단적 공포", desc:"Fear & Greed(0~100). 75+ 극탐욕은 과열, 25- 극공포는 바닥." },
    { short:"소셜 멘션", name:"소셜 멘션", cat:"리테일·심리", weight:4, lo:-80, hi:80, raw:-20, unit:"% vs평균", live:"추정", range:"z100", value:"평균比 −20% (리테일 관심 약화)", desc:"X·레딧 등 코인 언급량. 급증하면 리테일 관심·FOMO." },
    { short:"구글 검색", name:"구글 검색어 추이", cat:"리테일·심리", weight:6, lo:-80, hi:80, raw:-25, unit:"% vs평균", live:"추정", range:"z100", value:"평균比 −25% (5월 바닥 후 반등 조짐)", desc:"'bitcoin' 등 검색량. 신규 개인 유입 신호." },
    { short:"앱 순위", name:"코인베이스 앱순위", cat:"리테일·심리", weight:3, lo:50, hi:1, raw:35, unit:"위", live:"추정", range:"z100", value:"미국 금융 ~35위 (침체기 30~50위)", desc:"앱스토어 순위 상위 = 신규 리테일 온보딩." },
    // ── 기관·자금 ──
    { short:"ETF 플로우", name:"ETF 순유입/유출", cat:"기관·자금", weight:9, lo:-2, hi:2, raw:0, unit:"$B/7d", live:"실시간", range:"pm100", value:"수집 대기…", desc:"미국 현물 BTC ETF 7일 순플로우($B) — LookOnChain 텔레그램 일일 업데이트. +유입=기관 매수·−유출=이탈. 범위 ±$2B/7d(±$2B=극단)." },
    { short:"코인베이스 프리미엄", name:"코인베이스 프리미엄", cat:"기관·자금", weight:5, lo:-0.4, hi:0.4, raw:0.05, unit:"%", live:"실시간", range:"pm100", value:"+0.05%", desc:"코인베이스(USD)가 글로벌 대비 프리미엄. +면 미국 기관 강세. 범위 ±0.4%(노이즈 과민 완화)." },
    { short:"CME 선물", name:"CME 선물 OI·베이시스", cat:"기관·자금", weight:4, lo:-20, hi:40, raw:-8, unit:"% MoM", live:"추정", range:"z100", value:"OI ≈$6.8B·점유14.6% (옵션 OI 급감)", desc:"시카고상품거래소 비트코인 선물. 기관 레버리지·관심." },
    { short:"스테이블 공급", name:"스테이블코인 공급량", cat:"기관·자금", weight:6, lo:-2, hi:6, raw:1, unit:"%/4wk", live:"실시간", range:"z100", value:"≈ $298B (추정 +1%/4wk)", desc:"USDT+USDC 시총. 늘면 대기 매수자금(마른 장작) 증가." },
    { short:"$STRC", name:"$STRC 가격", cat:"기관·자금", weight:9, lo:90, hi:100, raw:88.59, unit:"$", live:"실시간", range:"pm100", value:"수집 대기…", desc:"Strategy(MSTR) ‘Stretch’ 우선주. ~$100 액면 유지 설계 → 액면 위=수요 강함/아래=약함. $90↓=−100·$100=+100." },
    { short:"$MSTR", name:"$MSTR 가격", cat:"기관·자금", weight:9, lo:0, hi:100, raw:4, unit:"% 52wk", live:"실시간", range:"z100", value:"수집 대기…", desc:"MSTR(마이크로스트래티지·BTC 트레저리 주식)의 52주 범위 내 위치(%). 고점 근처=기관 레버리지 수요 강함(100), 저점 근처=약세(0)." },
    // ── 레버리지·파생 ──
    { short:"펀딩비", name:"펀딩비", cat:"레버리지·파생", weight:6, lo:-0.1, hi:0.1, raw:0.018, unit:"%/8h", live:"실시간", range:"pm100", value:"+0.018%/8h", desc:"무기한 선물 펀딩비. 높게 +면 롱 과열(되돌림 위험↑)." },
    { short:"OI", name:"미결제약정(OI)", cat:"레버리지·파생", weight:4, lo:-50, hi:50, raw:12, unit:"% MoM", live:"실시간", range:"pm100", value:"MoM +12%", desc:"선물 미결제약정. 시장의 과열을 의미." },
    { short:"롱/숏", name:"롱/숏 비율", cat:"레버리지·파생", weight:6, lo:0.5, hi:2, raw:1.4, unit:"", live:"실시간", range:"pm100", value:"1.4", desc:"상위 트레이더 롱/숏 포지션 쏠림." },
    { short:"풋/콜", name:"옵션 풋/콜 비율", cat:"레버리지·파생", weight:3, lo:1.0, hi:0.4, raw:0.61, unit:"", live:"실시간", range:"pm100", value:"0.61 (P/C OI)", desc:"옵션 풋/콜 미결제(OI). Deribit은 콜 OI가 많아 ~0.7이 중립(1.0=약세 / 0.4=강세). 낮을수록 강세." },
    { short:"DVOL", name:"옵션 변동성(DVOL)·스큐", cat:"레버리지·파생", weight:3, lo:10, hi:80, raw:52, unit:"", live:"실시간", range:"z100", value:"52", desc:"비트코인 옵션 변동성지수·스큐. 과열/패닉 가늠." },
    { short:"SOPR", name:"SOPR", cat:"레버리지·파생", weight:3, lo:0.9, hi:1.1, raw:0.99, unit:"", live:"추정", range:"pm100", value:"0.99 (손익분기 부근)", desc:"실현손익 비율. 1 위면 이익실현 우위." },
    // ── 온체인 ──
    { short:"거래소 보유량", name:"거래소 BTC 보유량", cat:"온체인", weight:6, lo:10, hi:-10, raw:-6, unit:"%/90d", live:"추정", range:"pm100", value:"7년래 최저 2.21M BTC (감소세)", desc:"거래소에서 코인 인출 = 공급 축소·장기 보유(강세)." },
    { short:"채굴자 매도", name:"채굴자 매도압력(Puell)", cat:"온체인", weight:3, lo:0.3, hi:4, raw:1.3, unit:"", live:"실시간", range:"z100", value:"1.3", desc:"채굴자 수익/매도압력. 높으면 분배 압력." },
    { short:"고래 축적", name:"고래 지갑 축적", cat:"온체인", weight:5, lo:0, hi:1, raw:0.92, unit:"", live:"추정", range:"z100", value:"강한 매집 (30일 +270K BTC)", desc:"대형 지갑의 순매집/분배 추세." },
    // ── 시장구조·사이클 ──
    { short:"USDT.D", name:"테더 도미넌스(USDT.D)", cat:"시장구조·사이클", weight:5, lo:10, hi:4, raw:8.5, unit:"%", live:"실시간", range:"pm100", value:"8.5%", desc:"스테이블 비중. ↓면 위험선호↑(역지표)." },
    { short:"ATH 낙폭", name:"비트코인 낙폭", cat:"시장구조·사이클", weight:5, lo:-80, hi:20, raw:-49, unit:"%", live:"실시간", range:"z100", value:"−49% (현 $64.2k / ATH $126k)", desc:"사상 최고가로부터 거리. 사이클 위치." },
    { short:"증시 쏠림", name:"증시 쏠림(대형주 집중)", cat:"시장구조·사이클", weight:5, lo:100, hi:0, raw:50, unit:"", live:"실시간", range:"pm100", value:"수집 대기…", desc:"시총가중 S&P(SPY) ÷ 동일가중(RSP) 비율의 52주 범위 내 위치(0~100). 상단=대형주(AI·반도체)에 자금 쏠림 극심=위험자본이 코인 밖에 묶임(약세·역방향), 하단=확산(강세). 100=−100 / 0=+100." },
    // ── 매크로·규제 ──
    { short:"FED 유동성", name:"FED 순유동성 (Net Liquidity)", cat:"매크로·규제", weight:10, lo:-10, hi:10, raw:0, unit:"%/3mo", live:"실시간", range:"pm100", value:"≈ $5.4조 (추정)", desc:"핵심 프레임워크. Fed 대차대조표 − TGA − RRP. 연준이 풀면↑(위험자산 우호), TGA·RRP에 잠기면 시중에서 빠져↓. BTC·기술주와 상관 높음. 3개월 변화로 점수." },
    { short:"M2 유동성", name:"글로벌 M2 유동성", cat:"매크로·규제", weight:8, lo:-10, hi:15, raw:4.72, unit:"% YoY", live:"실시간", range:"z100", value:"+4.72% YoY", desc:"글로벌 통화량. 코인과 상관 매우 높음(후행)." },
    { short:"미국 증시 추세", name:"미국 증시 추세(1주)", cat:"매크로·규제", weight:4, lo:-4, hi:4, raw:0, unit:"%/1주", live:"실시간", range:"pm100", value:"수집 대기…", desc:"S&P500(SPY) 최근 5거래일(≈1주) 변화율. +면 상승추세=위험선호(코인 우호), −면 하락추세=위험회피. ±4%/1주=±100. 단기 증시 방향." },
    { short:"CLARITY", name:"CLARITY 법안 통과확률", cat:"매크로·규제", weight:10, lo:-100, hi:100, raw:0, unit:"", live:"실시간", range:"pm100", value:"수집 대기…", desc:"미국 시장구조법(CLARITY Act) ‘2026년 내 서명’ 통과확률 — Polymarket 예측시장 YES가격. 50%=중립(0)·90%=+80·100%=+100·0%=−100. 서버가 3시간마다 수집." },
    { short:"7월 FOMC", name:"7월 FOMC 금리", cat:"매크로·규제", weight:10, lo:-100, hi:100, raw:0, unit:"", live:"추정", pending:true, range:"pm100", value:"30일 새벽3시", desc:"7/28-29 FOMC 금리결정(발표 7/29 14:00 ET = 한국 7/30 새벽 3시). 인상(매파)=−100 / 인하(비둘기)=+100 / 미정=0. 결정 나면 갱신." },
    { short:"DXY", name:"달러 인덱스(DXY)", cat:"매크로·규제", weight:5, lo:5, hi:-5, raw:-3.5, unit:"%/3mo", live:"실시간", range:"pm100", value:"100.8 (3개월 ≈ −3.5%)", desc:"달러 강세는 역풍, 약세는 우호." },
    { short:"반도체 독주장", name:"반도체 독주장(SMH/SPY)", cat:"매크로·규제", weight:9, lo:10, hi:-10, raw:0, unit:"%/1M", live:"실시간", range:"pm100", value:"수집 대기…", desc:"반도체 ETF(SMH) ÷ S&P500(SPY) 1개월 상대수익률. 반도체가 시장을 앞설수록(상대강도↑) 자금이 반도체로 쏠려 코인 약세(역방향). +10%/1M=−100 / −10%/1M=+100. 절대수익률·3배레버리지(SOXL) 대신 상대강도." },
  ],
};

'use strict';
/* AI 일일 코멘트 — daily-commentary.yml 자동 생성. app.js 가 우선 사용, 없으면 commentary.js/desc 로 fallback. */
const COMMENT_DAILY = {
  "김프": {
    ko: "역김프인데 살짝 반등",
    en: "Reverse premium ticking up",
    why: {
      ko: "김프는 국내 투자자들의 매수 열기를 보여주는 지표다. 국내가 해외보다 비싸질수록(+) 국내 리테일 과열·불장 신호로 읽는다.",
      en: "Kimchi premium shows Korean retail buying heat. When local prices run above global, it signals domestic FOMO and a hotter market."
    },
    now: {
      ko: "현재 -0.87%로 국내가 오히려 더 싸 리테일 수요가 약한 편이다. 다만 하루새 +0.36%p 올라 살짝 회복 흐름을 보인다.",
      en: "Currently -0.87%, Korea trades cheaper, meaning local demand is soft. But it rose +0.36pp in a day, a small sign of recovery."
    }
  },
  "공포·탐욕": {
    ko: "공포존 진입, 다들 쫄았다",
    en: "Fear zone, everyone's spooked",
    why: {
      ko: "공포·탐욕 지수는 변동성·모멘텀·SNS 등을 종합한 시장 심리 온도계다. 극탐욕은 과열, 극공포는 바닥 심리를 뜻한다.",
      en: "The Fear & Greed index blends volatility and momentum into one mood gauge. Extreme greed flags overheating, extreme fear flags panic."
    },
    now: {
      ko: "현재 28로 극공포에 가까운 구간이다. 투자심리가 크게 위축돼 있어 단기적으로는 역풍에 가깝다.",
      en: "At 28, it's edging into extreme-fear territory. Sentiment is quite depressed, acting as a near-term headwind."
    }
  },
  "소셜 멘션": {
    ko: "코인 얘기 뜸해짐",
    en: "Coin chatter's quieting down",
    why: {
      ko: "SNS 언급량은 리테일 관심도의 선행지표다. 언급이 급증하면 신규 유입·FOMO가 뒤따르는 경우가 많다.",
      en: "Social mention volume is a leading gauge of retail attention — spikes often precede new-money inflows and FOMO."
    },
    now: {
      ko: "평균 대비 -20%로 관심이 식은 상태다. 신규 리테일 유입 동력이 약해 우호적인 신호는 아니다.",
      en: "Down 20% vs average, interest has cooled. Weak momentum for fresh retail inflows right now."
    }
  },
  "구글 검색": {
    ko: "검색량도 시들시들",
    en: "Search interest fading too",
    why: {
      ko: "'비트코인' 등 검색량은 신규 개인투자자 유입을 가늠하는 선행지표다. 검색 급증은 대중적 관심 폭발을 뜻한다.",
      en: "Search volume for bitcoin-related terms leads new retail entry — spikes usually mean mainstream buzz is building."
    },
    now: {
      ko: "평균 대비 -25%로 검색 관심이 낮은 편이다. 신규 개인 유입 신호는 뚜렷하지 않다.",
      en: "Down 25% vs average, search interest is subdued. No strong signal of fresh retail entry."
    }
  },
  "앱 순위": {
    ko: "코베 앱 순위 밀림",
    en: "Coinbase app slipping in rank",
    why: {
      ko: "코인베이스 앱 순위는 신규 유저 대량 유입 여부를 보여준다. 순위가 오를수록 리테일 온보딩이 활발하다는 뜻이다.",
      en: "Coinbase's app store rank tracks new user onboarding — climbing higher means retail sign-ups are surging."
    },
    now: {
      ko: "35위로 중위권에 머물러 있다. 신규 리테일 유입이 폭발적인 상황은 아니다.",
      en: "Sitting at #35, a middling rank. New retail onboarding isn't showing an explosive surge."
    }
  },
  "ETF 플로우": {
    ko: "ETF 순유입 꾸준히 지속",
    en: "ETF inflows keep rolling in",
    why: {
      ko: "미국 현물 ETF 순플로우는 기관 매수세를 가장 직접적으로 보여주는 지표다. 유입 지속은 실질 매수 수요를 뜻한다.",
      en: "US spot ETF net flows directly track institutional buying — sustained inflows mean real demand hitting the market."
    },
    now: {
      ko: "최근 7일 +$0.71B 순유입에 전일도 +$69M으로 플러스 흐름이 이어지고 있다. 기관 수요가 견조한 편이다.",
      en: "Net +$0.71B over 7 days, with another +$69M yesterday — inflows are holding steady, a solid institutional signal."
    }
  },
  "코인베이스 프리미엄": {
    ko: "美 매수세 약간 시들",
    en: "US buying looking soft",
    why: {
      ko: "코인베이스(달러) 가격이 해외보다 비싸면 미국 기관 매수 우위를 뜻한다. 반대면 미국 쪽 수요가 약하다는 신호다.",
      en: "When Coinbase (USD) trades above global prices, it signals US institutional buying strength; below means weaker US demand."
    },
    now: {
      ko: "-0.067%로 소폭 마이너스라 미국 매수세가 강하진 않다. 다만 폭이 작아 뚜렷한 역풍은 아니다.",
      en: "At -0.067%, slightly negative — US buying isn't strong, though the gap is too small to call a real headwind."
    }
  },
  "CME 선물": {
    ko: "CME OI 뚝, 기관 발뺌?",
    en: "CME OI dropping, funds pulling back?",
    why: {
      ko: "CME는 기관 트레이더 비중이 큰 선물 시장이라 OI 증감이 기관들의 관심·레버리지 변화를 잘 보여준다.",
      en: "CME futures skew heavily institutional, so its open interest swings reflect changing fund-level interest and leverage."
    },
    now: {
      ko: "한달새 OI가 -8%로 줄어 기관 참여가 위축된 흐름이다. 코인엔 다소 역풍으로 볼 수 있다.",
      en: "OI is down 8% over a month, suggesting institutional participation is cooling — a mild headwind for coin."
    }
  },
  "스테이블 공급": {
    ko: "대기자금 마르는 중, 경고",
    en: "Sidelined cash is drying up",
    why: {
      ko: "USDT·USDC 시총은 코인 매수 대기자금(마른 장작)이다. 공급이 늘면 잠재 매수여력이 커진다는 뜻이다.",
      en: "USDT+USDC market cap is the dry powder waiting to buy coin — a bigger supply means more potential buying firepower."
    },
    now: {
      ko: "4주간 -1.9%로 오히려 대기자금이 줄고 있다. 잠재 매수여력이 약해지는 흐름이라 뚜렷한 역풍이다.",
      en: "Down 1.9% over 4 weeks, sidelined cash is actually shrinking — a clear headwind as buying firepower fades."
    }
  },
  "$STRC": {
    ko: "STRC 액면가 이탈 심화",
    en: "STRC sinking further below par",
    why: {
      ko: "Strategy의 우선주 STRC는 액면가 $100 유지를 노린 설계다. 액면 근처 유지는 BTC 트레저리 수요가 안정적이란 뜻이다.",
      en: "Strategy's STRC preferred is designed to hold near its $100 par — staying near par signals steady demand for BTC treasury exposure."
    },
    now: {
      ko: "$84.94로 액면가와 격차가 크고 전일도 -$2.37 더 빠졌다. 수요 위축이 뚜렷해 강한 역풍으로 읽힌다.",
      en: "At $84.94, well below par, and down another -$2.37 yesterday — demand is clearly fading, a strong headwind."
    }
  },
  "$MSTR": {
    ko: "MSTR 52주 최저권 근접",
    en: "MSTR near 52-week lows",
    why: {
      ko: "MSTR은 BTC 보유·레버리지를 대표하는 주식이다. 52주 범위 내 위치는 기관들의 BTC 익스포저 심리를 보여준다.",
      en: "MSTR is the go-to proxy for leveraged BTC exposure — its 52-week range position mirrors institutional appetite for that bet."
    },
    now: {
      ko: "52주 범위 하위 3%로 저점권에 머물고 전일도 -$6 하락했다. 기관 레버리지 수요가 매우 약한 상태다.",
      en: "Sitting at just 3% of its 52-week range, down another -$6 yesterday — institutional leverage appetite looks very weak."
    }
  },
  "펀딩비": {
    ko: "펀딩비, 실시간이라 유동적",
    en: "Funding rate—always shifting",
    why: {
      ko: "무기한 선물 펀딩비는 롱·숏 어느 쪽이 과열됐는지 보여준다. 펀딩비가 크게 플러스면 롱 쏠림·되돌림 위험이 커진다.",
      en: "Perpetual funding rates show whether longs or shorts are overheated — a big positive rate flags long crowding and reversal risk."
    },
    now: {
      ko: "실시간으로 계속 바뀌는 지표라 이번 수치는 참고만 하자. 원리상 펀딩비가 크게 플러스로 쏠릴 때가 경계 신호다.",
      en: "This one shifts constantly, so treat the current reading as a rough gauge. In principle, a big positive spike is the real warning."
    }
  },
  "OI": {
    ko: "OI도 실시간 변동 지표",
    en: "OI moves fast, check live",
    why: {
      ko: "미결제약정(OI) 증가는 선물시장 레버리지가 커지고 있다는 뜻이다. 과도하게 쌓이면 급변동 위험도 함께 커진다.",
      en: "Rising open interest means more leverage is building in futures — too much buildup raises the risk of a sharp move either way."
    },
    now: {
      ko: "실시간 변동 지표라 지금 수치보다 추세를 봐야 한다. OI가 계속 불어나는 중이면 과열 경계 신호로 보면 된다.",
      en: "This is a fast-moving live metric — watch the trend, not the snapshot. Steadily rising OI is the overheating warning to watch."
    }
  },
  "롱/숏": {
    ko: "롱숏비율 실시간 체크 요망",
    en: "Long/short ratio shifts fast",
    why: {
      ko: "상위 트레이더 롱/숏 비율은 포지션 쏠림 정도를 보여준다. 한쪽으로 쏠릴수록 반대방향 청산 위험이 커진다.",
      en: "The top-trader long/short ratio shows how one-sided positioning is — heavier skew means bigger liquidation risk if it snaps back."
    },
    now: {
      ko: "실시간으로 자주 바뀌는 값이라 지금 수치는 참고 정도로 보자. 쏠림이 한쪽으로 굳어지는지가 핵심이다.",
      en: "This updates often, so take the current number as a rough guide. What matters is whether the skew is holding one direction."
    }
  },
  "풋/콜": {
    ko: "옵션판 강세베팅 뚜렷",
    en: "Options betting bullish hard",
    why: {
      ko: "옵션 풋/콜 미결제 비율은 트레이더들이 상승·하락 어디에 베팅했는지 보여준다. Deribit은 콜이 많아 낮을수록 강세다.",
      en: "The options put/call OI ratio shows which way traders are betting — since Deribit skews call-heavy, a lower ratio means bullish."
    },
    now: {
      ko: "0.43으로 강세 기준(0.4)에 바짝 붙어 있다. 옵션시장은 상승 쪽에 무게를 싣고 있어 코인에 우호적이다.",
      en: "At 0.43, right near the bullish threshold (0.4) — options traders are leaning toward upside, a supportive sign for coin."
    }
  },
  "DVOL": {
    ko: "변동성 낮아 심심한 장",
    en: "Vol's low, market's sleepy",
    why: {
      ko: "옵션 내재변동성(DVOL)은 시장이 앞으로의 급변동을 얼마나 예상하는지 보여준다. 극단적으로 높으면 패닉·기대가 큰 상태다.",
      en: "DVOL, options-implied volatility, shows how big a move the market is pricing in — extreme readings mean panic or big expectations."
    },
    now: {
      ko: "37.5로 비교적 낮은 변동성 구간이다. 시장의 관심·긴장감이 낮아 코인엔 약한 역풍 정도로 볼 수 있다.",
      en: "At 37.5, volatility is on the lower side — muted market attention and tension, a mild headwind at best."
    }
  },
  "SOPR": {
    ko: "SOPR 1 밑돌아 손절 우세",
    en: "SOPR under 1, losses realized",
    why: {
      ko: "SOPR은 코인을 옮긴 시점의 실현손익 비율이다. 1보다 크면 이익실현 우위, 작으면 손절매물 우위를 뜻한다.",
      en: "SOPR tracks realized profit/loss on moved coins — above 1 means profit-taking dominates, below 1 means losses are being cut."
    },
    now: {
      ko: "0.99로 1을 살짝 밑돌아 손절 물량이 소폭 우세한 상태다. 다만 편차가 작아 큰 영향은 아니다.",
      en: "At 0.99, just under 1, loss-cutting slightly dominates — though the gap is small, so the impact isn't major."
    }
  },
  "거래소 보유량": {
    ko: "거래소서 코인 줄줄 빠짐",
    en: "Coins draining off exchanges",
    why: {
      ko: "거래소 보유량 감소는 투자자들이 코인을 개인지갑으로 옮겨 장기보유한다는 뜻이다. 유통 물량이 줄어드는 신호다.",
      en: "Falling exchange reserves mean coins are moving to private wallets for long-term holding — less coin available to sell."
    },
    now: {
      ko: "90일간 -6%로 꾸준히 빠져나가는 흐름이다. 유통물량 축소가 이어지고 있어 코인에 우호적이다.",
      en: "Down 6% over 90 days, a steady outflow trend — shrinking exchange supply is a supportive backdrop for coin."
    }
  },
  "채굴자 매도": {
    ko: "채굴자 매도압력 경계",
    en: "Miner sell pressure building",
    why: {
      ko: "Puell Multiple은 채굴자 수익성 대비 매도압력을 보여준다. 평균 대비 낮으면 수익성이 나빠져 매도 필요성이 커진다.",
      en: "The Puell Multiple tracks miner revenue vs. average — a low reading means squeezed profitability, pushing miners to sell more."
    },
    now: {
      ko: "0.74로 평균을 밑돌아 채굴자 수익성이 부진한 상태다. 매도압력 우려가 있는 구간으로 볼 수 있다.",
      en: "At 0.74, below average, miner profitability looks squeezed — a zone where sell-pressure concerns are elevated."
    }
  },
  "고래 축적": {
    ko: "고래들 조용히 담는 중",
    en: "Whales quietly stacking up",
    why: {
      ko: "대형 지갑(고래)의 순매집·분배 추세는 스마트머니의 방향을 보여준다. 매집이 늘수록 향후 상승 기대가 커진다.",
      en: "Whale wallet accumulation/distribution tracks smart-money direction — more accumulation often precedes future upside."
    },
    now: {
      ko: "0.92로 매집 우위가 강한 편이다. 고래 자금이 순매수 쪽에 무게를 싣고 있어 코인에 우호적이다.",
      en: "At 0.92, accumulation is clearly dominant — whale money is leaning toward net buying, a supportive sign for coin."
    }
  },
  "USDT.D": {
    ko: "테더 비중 여전히 높음",
    en: "Stablecoin share still high",
    why: {
      ko: "스테이블코인 도미넌스가 커지면 자금이 현금성 자산에 머물러 있다는 뜻으로, 위험선호 약화의 역지표로 쓰인다.",
      en: "Rising stablecoin dominance means money is parked in cash-like assets — an inverse gauge of fading risk appetite."
    },
    now: {
      ko: "8.01%로 비교적 높은 수준을 유지하고 있다. 자금이 아직 관망세라 위험선호가 강하게 살아난 상태는 아니다.",
      en: "Holding at a relatively high 8.01% — capital is still on the sidelines, so risk appetite hasn't strongly returned."
    }
  },
  "ATH 낙폭": {
    ko: "고점 대비 반토막권",
    en: "Down near half from ATH",
    why: {
      ko: "사상 최고가 대비 낙폭은 현재 사이클이 어느 위치에 있는지 가늠하는 지표다. 낙폭이 크면 사이클 후반·저평가 논의가 나온다.",
      en: "Drawdown from the all-time high gauges where the cycle stands — a deep drawdown fuels late-cycle or undervaluation debate."
    },
    now: {
      ko: "고점 대비 -48.4%로 상당한 조정 상태다. 저평가 구간 논의는 가능하나 뚜렷한 반등 신호는 아니다.",
      en: "Down 48.4% from the peak, a substantial correction — undervaluation talk is plausible, but no clear rebound signal yet."
    }
  },
  "증시 쏠림": {
    ko: "대형주 쏠림 보통 수준",
    en: "Mega-cap crowding, mid-range",
    why: {
      ko: "시총가중 대비 동일가중 S&P 비율은 자금이 소수 대형주에 몰렸는지 보여준다. 쏠림이 심하면 위험자금이 그쪽에 묶여 코인엔 역풍이다.",
      en: "Cap-weighted vs equal-weight S&P compares how concentrated money is in mega-caps — heavy crowding traps risk capital away from coin."
    },
    now: {
      ko: "52주 범위 중간인 42/100로 쏠림이 극단적이지 않다. 코인에 미치는 영향은 지금은 제한적인 편이다.",
      en: "At 42/100 of its 52-week range, crowding isn't extreme — the read-through to coin looks limited for now."
    }
  },
  "FED 유동성": {
    ko: "연준 유동성 완만히 확대",
    en: "Fed liquidity easing up slowly",
    why: {
      ko: "Fed 순유동성(대차대조표-TGA-RRP)은 시중에 실제로 풀린 자금 규모다. 늘어나면 위험자산으로 흘러들어 코인에 우호적이다.",
      en: "Fed net liquidity (balance sheet minus TGA minus RRP) is the cash actually loose in markets — more of it tends to flow into risk assets like coin."
    },
    now: {
      ko: "3개월 +3.5%로 완만한 증가세지만, 최근 하루는 -0.06조로 소폭 줄었다. 큰 흐름은 우호적이나 단기 숨고르기다.",
      en: "Up 3.5% over 3 months, a gentle uptrend, though it dipped -$0.06T just yesterday — the big picture is supportive, short-term pause."
    }
  },
  "M2 유동성": {
    ko: "M2 통화량 꾸준히 증가",
    en: "Global M2 keeps growing",
    why: {
      ko: "글로벌 통화량(M2)이 늘면 시중 유동성이 커진다는 뜻이며, 코인 가격과 후행적으로 강한 상관관계를 보여왔다.",
      en: "Rising global M2 means more liquidity sloshing around markets, and it has historically tracked coin prices with a lag."
    },
    now: {
      ko: "전년대비 +5.58%로 꾸준히 늘고 있다. 유동성 배경은 완만하지만 우호적인 흐름을 유지하고 있다.",
      en: "Up 5.58% year-over-year, steadily growing — the liquidity backdrop stays mildly supportive."
    }
  },
  "미국 증시 추세": {
    ko: "증시 하락세, 위험회피",
    en: "Stocks sliding, risk-off mood",
    why: {
      ko: "S&P500의 단기 추세는 투자자들의 위험선호 심리를 보여준다. 증시가 오르면 코인 같은 위험자산에도 온기가 퍼진다.",
      en: "S&P500's short-term trend mirrors risk appetite — when stocks rally, that warmth tends to spread to assets like coin."
    },
    now: {
      ko: "최근 1주 -1.7%로 하락추세다. 위험회피 분위기가 번지고 있어 코인에도 약한 역풍으로 작용 중이다.",
      en: "Down 1.7% over the past week, a downtrend — spreading risk-off mood is acting as a mild headwind for coin too."
    }
  },
  "CLARITY": {
    ko: "CLARITY 법안 안갯속",
    en: "CLARITY Act odds still murky",
    why: {
      ko: "CLARITY 법안은 미국 코인 시장구조 규제를 명확히 하는 법안이다. 통과 확률이 오를수록 기관 진입장벽 완화 기대가 커진다.",
      en: "The CLARITY Act would clarify US crypto market-structure rules — higher passage odds raise hopes of easier institutional entry."
    },
    now: {
      ko: "Polymarket 기준 통과확률 38%로 중립선(50%)을 밑돈다. 규제 불확실성이 남아 있어 약한 역풍으로 본다.",
      en: "Polymarket odds sit at 38%, below the neutral 50% line — lingering regulatory uncertainty makes this a mild headwind."
    }
  },
  "DXY": {
    ko: "달러 강세, 코인엔 부담",
    en: "Dollar strength weighs on coin",
    why: {
      ko: "달러가 강세면 상대적으로 코인 같은 대체자산의 매력이 줄어 역풍이 되고, 약세면 반대로 우호적인 배경이 된다.",
      en: "A stronger dollar tends to dim the relative appeal of alternative assets like coin, while dollar weakness works the other way."
    },
    now: {
      ko: "3개월간 +1.8%로 달러 강세 흐름이 이어지고 있다. 코인엔 다소 부담이 되는 배경으로 볼 수 있다.",
      en: "Up 1.8% over 3 months, the dollar keeps strengthening — a bit of a drag on the backdrop for coin."
    }
  },
  "반도체 독주장": {
    ko: "반도체 쏠림 다시 스멀스멀",
    en: "Semis clawing back share",
    why: {
      ko: "반도체(SMH)가 S&P를 크게 앞서면 자금이 그쪽에 쏠려 코인 같은 위험자산엔 역풍이 되고, 반도체가 부진하면 자금이 분산돼 숨통이 트인다.",
      en: "When semis (SMH) sharply outpace the S&P, money crowds into that trade and away from assets like coin; when semis lag, capital spreads out."
    },
    now: {
      ko: "최근 1개월 -7.3%로 반도체가 부진해 쏠림은 완화된 편이다. 다만 하루새 +5.3%p 반등해 다시 쏠림이 커지는 조짐이다.",
      en: "Down 7.3% over the past month, semis have lagged and crowding eased — but a +5.3pp bounce in a day hints it may be creeping back."
    }
  }
};
const COMMENT_DAILY_AT = "2026-07-24 21:15 KST";

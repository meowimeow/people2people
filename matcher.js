// 매칭 엔진: 브라우저(index.html)와 Node(테스트)에서 같은 코드로 동작합니다.
// 외모(사진)는 점수화하지 않습니다. 프로필에 입력된 항목끼리만 비교합니다.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Matcher = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const FACTORS = [
    { key: 'age', label: '나이' },
    { key: 'height', label: '키' },
    { key: 'region', label: '거주지' },
    { key: 'style', label: '스타일' },
    { key: 'stability', label: '직업 안정성' },
    { key: 'conversation', label: '대화 코드' },
    { key: 'mbti', label: 'MBTI' },
    { key: 'hobbies', label: '취미' },
    { key: 'values', label: '생활·가치관' }
  ];

  const GROUP = { 서울: '수도권', 경기: '수도권', 인천: '수도권', 대전: '충청', 충북: '충청', 부산: '영남', 대구: '영남', 광주: '호남' };
  const DRINK = { '안 마심': 0, '가끔': 1, '자주': 2 };
  const clamp = (x) => Math.max(0, Math.min(1, x));

  // ── 1단계: 필수 조건(하드 필터). 한 군데라도 걸리면 점수 계산 없이 제외 ──
  function filterReasons(owner, target, mine) {
    const w = owner.want, who = mine ? '내 조건' : owner.nickname + '의 조건', r = [];
    if (target.age < w.ageMin || target.age > w.ageMax)
      r.push(`${who}: 나이 ${w.ageMin}~${w.ageMax}세 (${mine ? '상대' : '나'} ${target.age}세)`);
    if (!w.acceptSmoker && target.smoking === '흡연') r.push(`${who}: 흡연자 제외`);
    if (w.excludeReligions.includes(target.religion)) r.push(`${who}: ${target.religion} 제외`);
    if (w.sameAreaOnly && GROUP[owner.region] !== GROUP[target.region])
      r.push(`${who}: 같은 권역(${GROUP[owner.region]})만 희망`);
    return r;
  }

  // ── 2단계: 한 방향 점수 (owner가 target을 얼마나 원하는가) ──
  function oneWay(owner, target) {
    const w = owner.want, wt = w.weights, parts = [];
    const add = (key, applicable, raw, detail) => {
      const f = FACTORS.find((x) => x.key === key);
      parts.push({ key, label: f.label, weight: wt[key] ?? 3, applicable, raw: applicable ? clamp(raw) : 0, detail });
    };

    const ideal = (w.ageMin + w.ageMax) / 2, half = (w.ageMax - w.ageMin) / 2 || 1;
    add('age', true, 1 - 0.6 * Math.abs(target.age - ideal) / half,
      `${target.age}세 (희망 ${w.ageMin}~${w.ageMax}세, 중심 ${ideal}세)`);

    if (w.heightMin == null) add('height', false, 0, '키 조건을 정하지 않아 제외');
    else add('height', true, target.height >= w.heightMin ? 1 : 1 - (w.heightMin - target.height) / 10,
      `${target.height}cm (희망 ${w.heightMin}cm 이상)`);

    const sameRegion = owner.region === target.region, sameGroup = GROUP[owner.region] === GROUP[target.region];
    add('region', true, sameRegion ? 1 : sameGroup ? 0.6 : 0.2,
      `${target.region} (${sameRegion ? '같은 지역' : sameGroup ? '같은 권역' : '먼 지역'})`);

    if (!w.styles.length) add('style', false, 0, '선호 스타일을 정하지 않아 제외');
    else add('style', true, w.styles.includes(target.style) ? 1 : 0.3,
      `${target.style} (선호: ${w.styles.join('·')})`);

    add('stability', true, target.stability / 5, `${target.stability}/5 (${target.job})`);

    const talkRaw = w.talk === 'humor' ? target.humor / 5 : w.talk === 'empathy' ? target.empathy / 5
      : (target.humor + target.empathy) / 10;
    add('conversation', true, talkRaw,
      `유머 ${target.humor}/5 · 공감 ${target.empathy}/5 (중시: ${{ humor: '유머', empathy: '공감', both: '유머+공감' }[w.talk]})`);

    // MBTI: '궁합표'는 쓰지 않고, 내가 고른 선호 성향(E/I·N/S·T/F·J/P)과 상대 유형이 몇 개 맞는지만 센다
    const wanted = [...(w.mbti || '----')].map((c, i) => (c === '-' ? null : { c, i })).filter(Boolean);
    if (!wanted.length) add('mbti', false, 0, '선호 MBTI 성향을 정하지 않아 제외');
    else if (!target.mbti) add('mbti', false, 0, '상대 MBTI 미입력이라 제외');
    else {
      const hit = wanted.filter((x) => target.mbti[x.i] === x.c).length;
      add('mbti', true, hit / wanted.length,
        `${target.mbti} (선호 성향 ${wanted.map((x) => x.c).join('·')} 중 ${hit}/${wanted.length} 일치)`);
    }

    const shared = owner.hobbies.filter((h) => target.hobbies.includes(h));
    add('hobbies', true, shared.length / Math.min(3, owner.hobbies.length),
      shared.length ? `겹침: ${shared.join('·')}` : '겹치는 취미 없음');

    const drink = 1 - Math.abs(DRINK[owner.drinking] - DRINK[target.drinking]) / 2;
    const rel = owner.religion === target.religion ? 1 : (owner.religion === '무교' || target.religion === '무교') ? 0.6 : 0.2;
    const mar = owner.marriage === target.marriage ? 1 : (owner.marriage === '미정' || target.marriage === '미정') ? 0.5 : 0;
    const en = 1 - Math.abs(owner.energy - target.energy) / 4;
    add('values', true, (drink + rel + mar + en) / 4,
      `음주 ${Math.round(drink * 100)}% · 종교 ${Math.round(rel * 100)}% · 결혼관 ${Math.round(mar * 100)}% · 활동성 ${Math.round(en * 100)}%`);

    const sumW = parts.filter((p) => p.applicable).reduce((s, p) => s + p.weight, 0);
    parts.forEach((p) => {
      p.share = p.applicable ? (p.weight / sumW) * 100 : 0;   // 이 항목의 배점
      p.points = p.applicable ? p.share * p.raw : 0;           // 실제 획득 점수
    });
    return { total: Math.round(parts.reduce((s, p) => s + p.points, 0)), parts };
  }

  // ── 3단계: 설명 문장 생성 ──
  function explain(me, other, ab, ba) {
    const lines = [];
    const top = ab.parts.filter((p) => p.applicable).sort((x, y) => y.points - x.points).slice(0, 2);
    lines.push(`내 기준 ${ab.total}점: ${top.map((p) => `${p.label}(+${Math.round(p.points)})`).join(', ')}에서 점수를 가장 많이 얻었습니다.`);
    lines.push('근거: ' + top.map((p) => `${p.label} ${p.detail}`).join(' / '));
    const weak = ab.parts.filter((p) => p.applicable && p.weight >= 3 && p.raw < 0.5);
    lines.push(weak.length
      ? `중요하게 본 항목 중 ${weak.map((p) => p.label).join(', ')}은(는) 낮게 반영됐습니다.`
      : '중요도 3 이상으로 둔 항목 중 크게 낮은 항목은 없습니다.');
    lines.push(`${other.nickname} 기준 ${ba.total}점으로, 서로의 점수를 곱해 제곱근을 취한 값이 종합점수입니다.`);
    if (Math.abs(ab.total - ba.total) >= 15)
      lines.push('두 점수 차이가 커서 종합점수가 낮은 쪽으로 끌려갔습니다. 한쪽만 원하는 매칭입니다.');
    return lines;
  }

  // ── 전체: me에 대해 모든 후보를 평가 ──
  function rank(me, all) {
    const matches = [], excluded = [];
    for (const other of all) {
      if (other.id === me.id) continue;
      // 성별 조건이 서로 맞지 않는 후보는 목록에 올리지 않음 (잡음 방지)
      if (me.want.seeking !== other.gender || other.want.seeking !== me.gender) continue;
      const reasons = [...filterReasons(me, other, true), ...filterReasons(other, me, false)];
      if (reasons.length) { excluded.push({ profile: other, reasons }); continue; }
      const ab = oneWay(me, other), ba = oneWay(other, me);
      matches.push({
        profile: other, ab, ba,
        score: Math.round(Math.sqrt(ab.total * ba.total)),
        lines: explain(me, other, ab, ba)
      });
    }
    matches.sort((x, y) => y.score - x.score);
    return { matches, excluded };
  }

  return { FACTORS, rank, oneWay, filterReasons };
});

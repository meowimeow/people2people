// 모든 프로필은 가상의 인물입니다. 실제 사람과 무관합니다.
// 성별은 '남' / '여' 두 가지만 사용합니다.
//
// 필드 설명
//   stability : 직업 안정성 자가평가 (1~5)  ← 연봉 대신 쓰는 완화된 항목
//   humor / empathy / energy : 자가평가 (1~5)
//   want.seeking      : 만나고 싶은 상대의 성별 ('남' | '여')
//   want.heightMin    : 선호 최소 키 (없으면 null → 이 항목은 점수에서 제외)
//   want.styles       : 선호 스타일 목록 (비어 있으면 이 항목은 점수에서 제외)
//   mbti              : 본인 MBTI 유형 (예: 'INFJ', 미입력이면 '')
//   want.mbti         : 선호 성향 4글자. 순서는 E/I, N/S, T/F, J/P. '-'는 무관 (예: '-NF-' = N과 F 선호)
//   want.talk         : 대화에서 중시하는 것 ('humor' | 'empathy' | 'both')
//   want.acceptSmoker / excludeReligions / sameAreaOnly : 필수 조건(하드 필터)
//   want.weights      : 8개 항목 중요도 (1~5), 사용자가 직접 설정

const w = (age, height, region, style, stability, conversation, hobbies, values, mbti) =>
  ({ age, height, region, style, stability, conversation, mbti, hobbies, values });

const PROFILES = [
  // ───────── 남성 (이성 선호 8명) ─────────
  {
    id: 'p01', nickname: '도윤', gender: '남', mbti: 'INTP', age: 29, height: 178, region: '서울',
    job: '개발자', stability: 4, style: '깔끔', humor: 4, empathy: 3, energy: 3,
    hobbies: ['러닝', '영화', '카페'], smoking: '비흡연', drinking: '가끔', religion: '무교', marriage: '미정',
    bio: '주말 아침 러닝 후 카페 가는 걸 좋아해요.',
    want: { mbti: '-N--', seeking: '여', ageMin: 26, ageMax: 32, heightMin: null, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['깔끔', '차분'], talk: 'both', weights: w(3, 1, 4, 3, 2, 5, 3, 3, 2) }
  },
  {
    id: 'p02', nickname: '서준', gender: '남', mbti: 'ISFJ', age: 32, height: 182, region: '경기',
    job: '공무원', stability: 5, style: '캐주얼', humor: 3, empathy: 4, energy: 2,
    hobbies: ['등산', '독서', '요리'], smoking: '비흡연', drinking: '안 마심', religion: '기독교', marriage: '원함',
    bio: '결혼을 전제로 천천히 알아가고 싶어요.',
    want: { mbti: '-S-J', seeking: '여', ageMin: 28, ageMax: 34, heightMin: null, acceptSmoker: false, excludeReligions: ['불교'],
      sameAreaOnly: false, styles: ['차분', '깔끔'], talk: 'empathy', weights: w(2, 2, 3, 2, 3, 5, 3, 5, 3) }
  },
  {
    id: 'p03', nickname: '하준', gender: '남', mbti: 'ENFP', age: 27, height: 175, region: '대전',
    job: '대학원생', stability: 2, style: '스포티', humor: 5, empathy: 3, energy: 5,
    hobbies: ['헬스', '게임', '여행'], smoking: '비흡연', drinking: '자주', religion: '무교', marriage: '미정',
    bio: '같이 운동하고 같이 떠들 사람 찾아요.',
    want: { mbti: 'E---', seeking: '여', ageMin: 24, ageMax: 30, heightMin: null, acceptSmoker: true, excludeReligions: [],
      sameAreaOnly: false, styles: ['스포티', '트렌디'], talk: 'humor', weights: w(4, 3, 2, 4, 1, 4, 4, 2, 3) }
  },
  {
    id: 'p04', nickname: '지호', gender: '남', mbti: 'INFJ', age: 31, height: 180, region: '부산',
    job: '간호사', stability: 4, style: '깔끔', humor: 3, empathy: 5, energy: 3,
    hobbies: ['수영', '캠핑', '영화'], smoking: '비흡연', drinking: '가끔', religion: '천주교', marriage: '원함',
    bio: '얘기 잘 들어주는 편이라는 말을 자주 들어요.',
    want: { mbti: '-NF-', seeking: '여', ageMin: 27, ageMax: 33, heightMin: null, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['깔끔'], talk: 'empathy', weights: w(2, 1, 4, 3, 3, 5, 3, 4, 2) }
  },
  {
    id: 'p05', nickname: '민재', gender: '남', mbti: 'ESTP', age: 34, height: 176, region: '인천',
    job: '자영업', stability: 3, style: '캐주얼', humor: 4, empathy: 3, energy: 4,
    hobbies: ['낚시', '맛집탐방', '골프'], smoking: '흡연', drinking: '자주', religion: '무교', marriage: '미정',
    bio: '맛있는 거 먹고 웃는 게 제일 좋아요.',
    want: { mbti: '----', seeking: '여', ageMin: 28, ageMax: 36, heightMin: null, acceptSmoker: true, excludeReligions: [],
      sameAreaOnly: false, styles: [], talk: 'humor', weights: w(3, 1, 3, 1, 3, 4, 3, 2, 1) }
  },
  {
    id: 'p06', nickname: '현우', gender: '남', mbti: 'INFP', age: 26, height: 183, region: '서울',
    job: '디자이너', stability: 3, style: '트렌디', humor: 4, empathy: 4, energy: 4,
    hobbies: ['전시회', '사진', '카페'], smoking: '비흡연', drinking: '가끔', religion: '무교', marriage: '미정',
    bio: '전시 보고 사진 찍으러 다니는 걸 좋아해요.',
    want: { mbti: 'E-F-', seeking: '여', ageMin: 24, ageMax: 30, heightMin: null, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['트렌디', '깔끔'], talk: 'both', weights: w(4, 2, 4, 5, 2, 4, 4, 2, 3) }
  },
  {
    id: 'p07', nickname: '태양', gender: '남', mbti: 'INTJ', age: 30, height: 174, region: '충북',
    job: '연구원', stability: 4, style: '차분', humor: 2, empathy: 4, energy: 2,
    hobbies: ['독서', '보드게임', '산책'], smoking: '비흡연', drinking: '안 마심', religion: '무교', marriage: '원함',
    bio: '조용한 동네 산책과 보드게임을 좋아합니다.',
    want: { mbti: 'INF-', seeking: '여', ageMin: 26, ageMax: 33, heightMin: null, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: true, styles: ['차분'], talk: 'empathy', weights: w(2, 1, 5, 3, 3, 5, 4, 4, 3) }
  },
  {
    id: 'p08', nickname: '건우', gender: '남', mbti: 'ESFP', age: 28, height: 179, region: '대구',
    job: '영업직', stability: 3, style: '캐주얼', humor: 5, empathy: 3, energy: 5,
    hobbies: ['축구', '여행', '맛집탐방'], smoking: '비흡연', drinking: '자주', religion: '무교', marriage: '미정',
    bio: '분위기 메이커 담당입니다.',
    want: { mbti: 'E---', seeking: '여', ageMin: 25, ageMax: 31, heightMin: null, acceptSmoker: true, excludeReligions: [],
      sameAreaOnly: false, styles: ['스포티', '캐주얼'], talk: 'humor', weights: w(3, 2, 2, 3, 2, 5, 4, 2, 2) }
  },

  // ───────── 남성 (동성 선호 2명) ─────────
  {
    id: 'p09', nickname: '시온', gender: '남', mbti: 'ENFJ', age: 29, height: 177, region: '서울',
    job: '마케터', stability: 3, style: '트렌디', humor: 4, empathy: 4, energy: 4,
    hobbies: ['전시회', '러닝', '카페'], smoking: '비흡연', drinking: '가끔', religion: '무교', marriage: '미정',
    bio: '주말엔 전시와 러닝으로 채웁니다.',
    want: { mbti: '-N--', seeking: '남', ageMin: 27, ageMax: 33, heightMin: null, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['트렌디', '깔끔'], talk: 'both', weights: w(3, 1, 4, 4, 2, 5, 4, 3, 2) }
  },
  {
    id: 'p10', nickname: '준서', gender: '남', mbti: 'ISTJ', age: 31, height: 181, region: '경기',
    job: '엔지니어', stability: 4, style: '깔끔', humor: 3, empathy: 4, energy: 3,
    hobbies: ['러닝', '영화', '요리'], smoking: '비흡연', drinking: '가끔', religion: '무교', marriage: '원함',
    bio: '요리해서 같이 영화 보는 저녁을 좋아해요.',
    want: { mbti: '--F-', seeking: '남', ageMin: 27, ageMax: 34, heightMin: null, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['깔끔', '차분'], talk: 'empathy', weights: w(2, 1, 4, 3, 3, 5, 3, 4, 2) }
  },

  // ───────── 여성 (이성 선호 8명) ─────────
  {
    id: 'p11', nickname: '서연', gender: '여', mbti: 'ESFJ', age: 27, height: 165, region: '서울',
    job: '교사', stability: 5, style: '깔끔', humor: 4, empathy: 5, energy: 3,
    hobbies: ['카페', '영화', '요리'], smoking: '비흡연', drinking: '가끔', religion: '무교', marriage: '원함',
    bio: '안정적이고 따뜻한 관계를 원해요.',
    want: { mbti: '-S-J', seeking: '남', ageMin: 28, ageMax: 34, heightMin: 175, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['깔끔', '차분'], talk: 'both', weights: w(2, 4, 4, 3, 5, 5, 3, 4, 3) }
  },
  {
    id: 'p12', nickname: '지우', gender: '여', mbti: 'ENFJ', age: 29, height: 160, region: '경기',
    job: '간호사', stability: 4, style: '캐주얼', humor: 4, empathy: 5, energy: 4,
    hobbies: ['등산', '캠핑', '맛집탐방'], smoking: '비흡연', drinking: '가끔', religion: '천주교', marriage: '원함',
    bio: '캠핑 장비 모으는 게 취미예요.',
    want: { mbti: '-NF-', seeking: '남', ageMin: 29, ageMax: 35, heightMin: 172, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: [], talk: 'empathy', weights: w(2, 3, 3, 2, 4, 5, 4, 5, 2) }
  },
  {
    id: 'p13', nickname: '하윤', gender: '여', mbti: 'ENTP', age: 25, height: 168, region: '대전',
    job: '대학원생', stability: 2, style: '스포티', humor: 5, empathy: 3, energy: 5,
    hobbies: ['헬스', '여행', '게임'], smoking: '비흡연', drinking: '자주', religion: '무교', marriage: '미정',
    bio: '운동 끝나고 치킨 먹는 사람이면 됩니다.',
    want: { mbti: 'E---', seeking: '남', ageMin: 24, ageMax: 30, heightMin: null, acceptSmoker: true, excludeReligions: [],
      sameAreaOnly: false, styles: ['스포티', '트렌디'], talk: 'humor', weights: w(3, 2, 3, 4, 1, 5, 5, 2, 3) }
  },
  {
    id: 'p14', nickname: '수아', gender: '여', mbti: 'ISTJ', age: 31, height: 163, region: '부산',
    job: '회계사', stability: 5, style: '깔끔', humor: 3, empathy: 4, energy: 2,
    hobbies: ['독서', '수영', '영화'], smoking: '비흡연', drinking: '안 마심', religion: '기독교', marriage: '원함',
    bio: '차분하고 성실한 사람이 좋아요.',
    want: { mbti: 'I--J', seeking: '남', ageMin: 31, ageMax: 38, heightMin: 175, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['깔끔', '차분'], talk: 'empathy', weights: w(3, 3, 4, 2, 5, 4, 2, 5, 4) }
  },
  {
    id: 'p15', nickname: '예은', gender: '여', mbti: 'INFJ', age: 28, height: 166, region: '충북',
    job: '연구원', stability: 4, style: '차분', humor: 3, empathy: 4, energy: 2,
    hobbies: ['독서', '산책', '보드게임'], smoking: '비흡연', drinking: '가끔', religion: '무교', marriage: '미정',
    bio: '말수는 적지만 오래 이야기하면 웃긴 편이에요.',
    want: { mbti: 'IN--', seeking: '남', ageMin: 27, ageMax: 34, heightMin: null, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['차분', '깔끔'], talk: 'empathy', weights: w(2, 1, 4, 3, 3, 5, 5, 4, 3) }
  },
  {
    id: 'p16', nickname: '다은', gender: '여', mbti: 'INFP', age: 26, height: 170, region: '서울',
    job: '프리랜서', stability: 2, style: '트렌디', humor: 4, empathy: 4, energy: 4,
    hobbies: ['전시회', '사진', '카페'], smoking: '비흡연', drinking: '가끔', religion: '무교', marriage: '미정',
    bio: '취향이 맞는 사람이 최고예요.',
    want: { mbti: '-NF-', seeking: '남', ageMin: 26, ageMax: 32, heightMin: 178, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['트렌디', '깔끔'], talk: 'both', weights: w(3, 4, 5, 5, 2, 4, 4, 2, 3) }
  },
  {
    id: 'p17', nickname: '채원', gender: '여', mbti: 'ESTJ', age: 33, height: 162, region: '인천',
    job: '자영업', stability: 3, style: '캐주얼', humor: 4, empathy: 3, energy: 4,
    hobbies: ['맛집탐방', '여행', '골프'], smoking: '비흡연', drinking: '자주', religion: '불교', marriage: '미정',
    bio: '작은 카페를 운영해요. 손님 얘기 듣는 게 재밌어요.',
    want: { mbti: '----', seeking: '남', ageMin: 32, ageMax: 40, heightMin: null, acceptSmoker: true, excludeReligions: [],
      sameAreaOnly: false, styles: [], talk: 'humor', weights: w(2, 2, 3, 1, 3, 5, 3, 3, 1) }
  },
  {
    id: 'p18', nickname: '유나', gender: '여', mbti: 'ESFP', age: 27, height: 172, region: '대구',
    job: '항공사 직원', stability: 3, style: '스포티', humor: 5, empathy: 3, energy: 5,
    hobbies: ['축구', '여행', '헬스'], smoking: '비흡연', drinking: '자주', religion: '무교', marriage: '미정',
    bio: '직관 같이 갈 사람 구해요.',
    want: { mbti: 'E---', seeking: '남', ageMin: 26, ageMax: 32, heightMin: 180, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['스포티', '캐주얼'], talk: 'humor', weights: w(3, 4, 2, 3, 2, 5, 4, 2, 2) }
  },

  // ───────── 여성 (동성 선호 2명) ─────────
  {
    id: 'p19', nickname: '보라', gender: '여', mbti: 'INTJ', age: 28, height: 164, region: '서울',
    job: '개발자', stability: 4, style: '깔끔', humor: 4, empathy: 4, energy: 3,
    hobbies: ['러닝', '영화', '카페'], smoking: '비흡연', drinking: '가끔', religion: '무교', marriage: '미정',
    bio: '조용한 카페에서 오래 이야기하는 걸 좋아해요.',
    want: { mbti: '-N--', seeking: '여', ageMin: 26, ageMax: 32, heightMin: null, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['깔끔', '차분'], talk: 'both', weights: w(3, 1, 4, 3, 3, 5, 4, 3, 2) }
  },
  {
    id: 'p20', nickname: '나현', gender: '여', mbti: 'INFJ', age: 30, height: 167, region: '경기',
    job: '연구원', stability: 4, style: '차분', humor: 3, empathy: 5, energy: 2,
    hobbies: ['독서', '요리', '영화'], smoking: '비흡연', drinking: '안 마심', religion: '무교', marriage: '원함',
    bio: '집에서 요리하고 영화 보는 시간이 소중해요.',
    want: { mbti: 'INF-', seeking: '여', ageMin: 27, ageMax: 34, heightMin: null, acceptSmoker: false, excludeReligions: [],
      sameAreaOnly: false, styles: ['차분', '깔끔'], talk: 'empathy', weights: w(2, 1, 3, 3, 3, 5, 4, 5, 3) }
  }
];

if (typeof module === 'object' && module.exports) module.exports = PROFILES;

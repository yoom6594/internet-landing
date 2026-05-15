export type CarrierKey = "SK" | "LG";

export type Plan = {
  id: string;
  speed: string;
  name: string;
  monthly: string;
  contracted: string;
  cashback: string;
  features: string[];
  highlight?: boolean;
};

export type CarrierContent = {
  key: CarrierKey;
  brand: string;
  shortBrand: string;
  tagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPoints: string[];
  benefits: { title: string; desc: string }[];
  plans: Plan[];
  faqs: { q: string; a: string }[];
  steps: { title: string; desc: string }[];
};

export const CARRIERS: Record<CarrierKey, CarrierContent> = {
  SK: {
    key: "SK",
    brand: "SK브로드밴드",
    shortBrand: "SK",
    tagline: "끊김 없는 속도, 검증된 안정성",
    heroEyebrow: "SK브로드밴드 공식 신청 상담",
    heroTitle: "지금 신청하면\n현금 최대 60만원",
    heroSubtitle:
      "SK브로드밴드 인터넷·결합 가입 시 즉시 지급되는 현금 사은품과 위약금 지원까지 한 번에 안내해 드립니다.",
    heroPoints: [
      "현금 사은품 즉시 지급",
      "타사 위약금 100% 지원",
      "전문 상담사 1:1 매칭",
    ],
    benefits: [
      {
        title: "현금 최대 60만원",
        desc: "인터넷 단독·결합 조건에 따라 가입 즉시 현금으로 지급해 드립니다.",
      },
      {
        title: "타사 위약금 지원",
        desc: "기존 통신사 약정 위약금을 100% 지원하여 부담 없이 전환할 수 있습니다.",
      },
      {
        title: "당일·익일 설치",
        desc: "지역에 따라 신청 후 24~48시간 내 빠른 설치가 가능합니다.",
      },
      {
        title: "최저가 보장",
        desc: "공식 채널 동일 조건 대비 더 좋은 혜택을 약속합니다.",
      },
    ],
    plans: [
      {
        id: "sk-100",
        speed: "100M",
        name: "라이트",
        monthly: "22,000",
        contracted: "3년 약정",
        cashback: "현금 25만원",
        features: ["1인 가구 추천", "기본 와이파이 포함", "무료 설치"],
      },
      {
        id: "sk-500",
        speed: "500M",
        name: "스탠다드",
        monthly: "29,700",
        contracted: "3년 약정",
        cashback: "현금 40만원",
        features: ["가족·재택 추천", "프리미엄 공유기", "결합할인 가능"],
        highlight: true,
      },
      {
        id: "sk-1g",
        speed: "1G",
        name: "프리미엄",
        monthly: "38,500",
        contracted: "3년 약정",
        cashback: "현금 60만원",
        features: ["스트리밍·게이밍", "Wi-Fi 6 공유기", "IPTV 결합 추천"],
      },
    ],
    steps: [
      { title: "01 상담 신청", desc: "이름·연락처·주소 입력 후 1분 만에 접수" },
      { title: "02 전문 상담", desc: "1시간 이내 전담 상담사가 연락드립니다" },
      { title: "03 설치 예약", desc: "원하시는 날짜와 시간에 맞춰 예약" },
      { title: "04 현금 지급", desc: "개통 확인 후 약정 사은품 즉시 지급" },
    ],
    faqs: [
      {
        q: "현금 사은품은 언제 받나요?",
        a: "개통 확인 후 평균 1~2영업일 이내 입금되며, 약정 조건에 따라 차이가 있을 수 있습니다.",
      },
      {
        q: "지금 사용 중인 통신사가 있어요. 위약금은요?",
        a: "타사 위약금은 100% 지원되며, 상담 시 정확한 금액 산정을 도와드립니다.",
      },
      {
        q: "설치는 얼마나 걸리나요?",
        a: "신청 후 평균 1~3일 이내 설치가 진행되며, 지역에 따라 당일 설치도 가능합니다.",
      },
      {
        q: "결합할인은 어떻게 되나요?",
        a: "휴대폰·IPTV·인터넷전화와의 결합 시 회선당 최대 월 11,000원까지 할인됩니다.",
      },
    ],
  },
  LG: {
    key: "LG",
    brand: "LG U+",
    shortBrand: "LG",
    tagline: "기가 인터넷의 새로운 기준",
    heroEyebrow: "LG U+ 공식 신청 상담",
    heroTitle: "LG U+ 인터넷\n현금 65만원 + 사은품",
    heroSubtitle:
      "LG U+ 기가 인터넷·IPTV 결합 시 업계 최대 수준의 현금과 상품권을 한 번에 받아보세요.",
    heroPoints: [
      "현금 최대 65만원",
      "IPTV 결합 추가 혜택",
      "당일 설치 가능 지역 다수",
    ],
    benefits: [
      {
        title: "업계 최대 현금",
        desc: "LG U+ 공식 제휴 채널의 프로모션을 통해 최대 65만원 현금을 지급합니다.",
      },
      {
        title: "U+tv 결합 혜택",
        desc: "U+tv 결합 시 추가 상품권과 월 요금 추가 할인을 받을 수 있습니다.",
      },
      {
        title: "기가 와이파이",
        desc: "전 가구 기가 Wi-Fi 6 공유기 무상 제공으로 빠르고 안정적인 환경.",
      },
      {
        title: "안심 상담",
        desc: "강매·과장 없는 정직한 안내. 모든 비용을 사전에 투명하게 안내합니다.",
      },
    ],
    plans: [
      {
        id: "lg-100",
        speed: "100M",
        name: "베이직",
        monthly: "22,000",
        contracted: "3년 약정",
        cashback: "현금 28만원",
        features: ["1~2인 가구", "기본 와이파이", "무료 설치"],
      },
      {
        id: "lg-500",
        speed: "500M",
        name: "기가 라이트",
        monthly: "30,800",
        contracted: "3년 약정",
        cashback: "현금 45만원",
        features: ["3~4인 가구 추천", "Wi-Fi 6 공유기", "IPTV 결합 추천"],
        highlight: true,
      },
      {
        id: "lg-1g",
        speed: "1G",
        name: "기가 프리미엄",
        monthly: "39,600",
        contracted: "3년 약정",
        cashback: "현금 65만원",
        features: ["고화질 스트리밍·게이밍", "프리미엄 셋톱", "최대 결합 할인"],
      },
    ],
    steps: [
      { title: "01 상담 신청", desc: "간단한 정보 입력으로 1분 접수" },
      { title: "02 맞춤 상담", desc: "전담 상담사가 가구 환경에 맞춰 안내" },
      { title: "03 설치 예약", desc: "원하시는 일정으로 정확한 설치 예약" },
      { title: "04 사은품 지급", desc: "개통 확인 즉시 현금·상품권 지급" },
    ],
    faqs: [
      {
        q: "U+tv를 같이 가입하면 더 좋은가요?",
        a: "네, IPTV 결합 시 추가 상품권과 회선당 월 요금 할인이 적용되어 가장 큰 혜택을 받을 수 있습니다.",
      },
      {
        q: "약정 기간은 몇 년인가요?",
        a: "표준 약정은 3년이며, 1년·2년 약정도 가능하나 사은품 금액이 달라집니다.",
      },
      {
        q: "기존 LG U+ 사용자도 신청할 수 있나요?",
        a: "기존 회선 만료 또는 해지 후 재가입 시 신규 가입자와 동일한 혜택이 가능합니다.",
      },
      {
        q: "신청 후 취소 가능한가요?",
        a: "개통 전까지는 자유롭게 취소 가능하며, 어떠한 위약금도 발생하지 않습니다.",
      },
    ],
  },
};

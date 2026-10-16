export type CalculatorMeta = {
  slug: string;
  title: string;
  desc: string;
  emoji: string;
  category: "노무·급여" | "날짜·생활" | "금융·환율" | "단위·건강";
};

export const calculators: CalculatorMeta[] = [
  { slug: "unemployment-benefit", title: "실업급여 계산기", desc: "평균임금과 수급일수로 예상 실업급여를 계산합니다.", emoji: "💼", category: "노무·급여" },
  { slug: "annual-leave-pay", title: "연차수당 계산기", desc: "미사용 연차에 대한 연차수당을 계산합니다.", emoji: "🌴", category: "노무·급여" },
  { slug: "severance-pay", title: "퇴직금 계산기", desc: "재직일수와 평균임금으로 예상 퇴직금을 계산합니다.", emoji: "🏦", category: "노무·급여" },
  { slug: "weekly-holiday-pay", title: "주휴수당 계산기", desc: "주 근무시간과 시급으로 주휴수당을 계산합니다.", emoji: "📅", category: "노무·급여" },
  { slug: "hourly-to-monthly", title: "시급 → 월급 계산기", desc: "시급과 근무시간으로 예상 월급을 계산합니다.", emoji: "⏱️", category: "노무·급여" },
  { slug: "net-salary", title: "실수령액 간이 계산기", desc: "4대보험 등 공제 항목을 반영해 예상 실수령액을 계산합니다.", emoji: "💸", category: "노무·급여" },
  { slug: "korean-age", title: "만 나이 계산기", desc: "생년월일과 기준일로 만 나이를 계산합니다.", emoji: "🎂", category: "날짜·생활" },
  { slug: "d-day", title: "D-Day 계산기", desc: "목표일까지 남은 날짜 또는 지난 날짜를 계산합니다.", emoji: "⏳", category: "날짜·생활" },
  { slug: "discharge-date", title: "전역일 계산기", desc: "입대일과 복무기간으로 전역일과 D-Day를 계산합니다.", emoji: "🎖️", category: "날짜·생활" },
  { slug: "exchange-rate", title: "환율 계산기", desc: "직접 입력한 환율로 원화와 외화를 변환합니다.", emoji: "💱", category: "금융·환율" },
  { slug: "loan-payment", title: "대출 월 상환액 계산기", desc: "원리금균등 방식의 월 상환액과 총 이자를 계산합니다.", emoji: "🏠", category: "금융·환율" },
  { slug: "compound-interest", title: "예금 복리 계산기", desc: "원금, 이율, 기간으로 복리 예상 금액을 계산합니다.", emoji: "📈", category: "금융·환율" },
  { slug: "percent", title: "퍼센트 계산기", desc: "비율, 비중, 증감률을 빠르게 계산합니다.", emoji: "％", category: "금융·환율" },
  { slug: "vat", title: "부가세 계산기", desc: "공급가액과 부가세 포함가를 상호 변환합니다.", emoji: "🧾", category: "금융·환율" },
  { slug: "unit-converter", title: "단위 변환기", desc: "평·제곱미터, 섭씨·화씨, 길이, 무게, 데이터를 변환합니다.", emoji: "📐", category: "단위·건강" },
  { slug: "bmi", title: "BMI 계산기", desc: "키와 몸무게로 BMI와 체중 범위를 확인합니다.", emoji: "⚖️", category: "단위·건강" }
];

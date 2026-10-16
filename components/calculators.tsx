"use client";

import { useMemo, useState } from "react";

const num = (v: string) => {
  const x = parseFloat(String(v).replace(/,/g, ""));
  return Number.isFinite(x) ? x : 0;
};
const won = (v: number) => Math.round(v).toLocaleString("ko-KR") + "원";
const fmt = (v: number, d = 2) =>
  Number.isFinite(v) ? v.toLocaleString("ko-KR", { maximumFractionDigits: d }) : "-";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="label">{label}</label>
      {children}
      {hint && <p className="note">{hint}</p>}
    </div>
  );
}

function Result({ main, rows, note }: { main: string; rows?: [string, string][]; note?: string }) {
  return (
    <div className="result">
      <div className="text-sm text-slate-600 mb-1">계산 결과</div>
      <div className="result-main">{main}</div>
      {rows && (
        <div className="mt-3">
          {rows.map(([k, v]) => (
            <div key={k} className="result-row">
              <span>{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      )}
      {note && <p className="note">{note}</p>}
    </div>
  );
}

function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" className="input" {...props} />;
}

/* ---------- 노무·급여 ---------- */

function UnemploymentBenefit() {
  const [avg, setAvg] = useState("");
  const [days, setDays] = useState("180");
  const [minD, setMinD] = useState("");
  const [maxD, setMaxD] = useState("");
  const avgN = num(avg);
  let daily = avgN > 0 ? (avgN / 30) * 0.6 : 0;
  if (minD) daily = Math.max(daily, num(minD) / 30);
  if (maxD) daily = Math.min(daily, num(maxD) / 30);
  const total = daily * num(days);
  return (
    <div className="card">
      <Field label="퇴직 전 3개월 평균 월급 (원)" hint="근로소득 총액 ÷ 3 기준으로 입력하세요.">
        <NumberInput value={avg} onChange={e => setAvg(e.target.value)} placeholder="예: 3000000" />
      </Field>
      <Field label="예상 수급일수 (일)" hint="일반적으로 120~270일 범위이며, 나이·퇴직사유·가입기간에 따라 달라집니다.">
        <NumberInput value={days} onChange={e => setDays(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="1일 최저급여 (선택)">
          <NumberInput value={minD} onChange={e => setMinD(e.target.value)} placeholder="예: 60000" />
        </Field>
        <Field label="1일 최고급여 (선택)">
          <NumberInput value={maxD} onChange={e => setMaxD(e.target.value)} placeholder="예: 69000" />
        </Field>
      </div>
      <Result
        main={won(total)}
        rows={[["1일 소정급여일액", won(daily)], ["적용 일수", num(days) + "일"]]}
        note="실업급여는 통상 1일 평균임금의 60%이며, 최저·최고 금액은 매년 변동됩니다. 실제 수급 요건과 금액은 고용노동부 또는 워크넷에서 확인하세요."
      />
    </div>
  );
}

function AnnualLeavePay() {
  const [days, setDays] = useState("");
  const [daily, setDaily] = useState("");
  const total = num(days) * num(daily);
  return (
    <div className="card">
      <Field label="미사용 연차 일수">
        <NumberInput value={days} onChange={e => setDays(e.target.value)} placeholder="예: 10" />
      </Field>
      <Field label="1일 통상임금 (원)" hint="통상 월 통상임금 ÷ 209로 계산하는 방식이 널리 사용됩니다.">
        <NumberInput value={daily} onChange={e => setDaily(e.target.value)} placeholder="예: 100000" />
      </Field>
      <Result main={won(total)} rows={[["대상 연차", num(days) + "일"], ["1일 금액", won(num(daily))]]} note="연차수당은 사용·촉진 절차와 취업규칙에 따라 달라질 수 있습니다." />
    </div>
  );
}

function SeverancePay() {
  const [days, setDays] = useState("");
  const [monthly, setMonthly] = useState("");
  const daily = num(monthly) / 30;
  const total = (num(days) / 365) * 30 * daily;
  return (
    <div className="card">
      <Field label="재직일수 (일)" hint="입사일부터 퇴직일까지의 총 일수를 입력하세요.">
        <NumberInput value={days} onChange={e => setDays(e.target.value)} placeholder="예: 1095" />
      </Field>
      <Field label="퇴직 전 3개월 평균 월급 (원)">
        <NumberInput value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="예: 3000000" />
      </Field>
      <Result
        main={won(total)}
        rows={[["1일 평균임금", won(daily)], ["30일분 평균임금", won(daily * 30)], ["근속연수", fmt(num(days) / 365) + "년"]]}
        note="퇴직금은 1년 미만 근무자는 원칙적으로 대상이 아니며, 평균임금 산정 방식에 따라 실제 금액은 달라질 수 있습니다."
      />
    </div>
  );
}

function WeeklyHolidayPay() {
  const [hours, setHours] = useState("40");
  const [wage, setWage] = useState("10030");
  const h = num(hours), w = num(wage);
  const eligible = h >= 15;
  const pay = eligible ? (h / 40) * 8 * w : 0;
  return (
    <div className="card">
      <Field label="1주 근무시간 (시간)">
        <NumberInput value={hours} onChange={e => setHours(e.target.value)} />
      </Field>
      <Field label="시급 (원)">
        <NumberInput value={wage} onChange={e => setWage(e.target.value)} />
      </Field>
      <Result
        main={won(pay)}
        rows={[["주휴 대상", eligible ? "해당" : "미해당 (15시간 미만)"], ["주휴 시간", eligible ? fmt((h / 40) * 8) + "시간" : "-"]]}
        note="주휴수당은 1주 개근 시 발생하며, 주 소정근로시간이 15시간 이상인 경우에 적용됩니다."
      />
    </div>
  );
}

function HourlyToMonthly() {
  const [wage, setWage] = useState("10030");
  const [dailyH, setDailyH] = useState("8");
  const [daysW, setDaysW] = useState("5");
  const [includeHoliday, setIncludeHoliday] = useState(true);
  const weekly = num(dailyH) * num(daysW);
  const holiday = includeHoliday && weekly >= 15 ? (weekly / 40) * 8 : 0;
  const monthly = (weekly + holiday) * num(wage) * 4.345;
  return (
    <div className="card">
      <Field label="시급 (원)">
        <NumberInput value={wage} onChange={e => setWage(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="1일 근무시간">
          <NumberInput value={dailyH} onChange={e => setDailyH(e.target.value)} />
        </Field>
        <Field label="주 근무일수">
          <NumberInput value={daysW} onChange={e => setDaysW(e.target.value)} />
        </Field>
      </div>
      <label className="flex items-center gap-2 mb-4 text-sm">
        <input type="checkbox" checked={includeHoliday} onChange={e => setIncludeHoliday(e.target.checked)} />
        주휴수당 포함
      </label>
      <Result
        main={won(monthly)}
        rows={[["주 근무시간", fmt(weekly) + "시간"], ["주휴 포함 주간 시간", fmt(weekly + holiday) + "시간"], ["적용 주 수", "4.345주"]]}
        note="4.345주는 1년의 평균 주 수를 반영한 간이 계산 방식입니다."
      />
    </div>
  );
}

function NetSalary() {
  const [gross, setGross] = useState("3000000");
  const [pension, setPension] = useState("4.5");
  const [health, setHealth] = useState("3.545");
  const [employ, setEmploy] = useState("0.9");
  const [tax, setTax] = useState("3");
  const g = num(gross);
  const p = g * num(pension) / 100;
  const h = g * num(health) / 100;
  const e = g * num(employ) / 100;
  const t = g * num(tax) / 100;
  const net = g - p - h - e - t;
  return (
    <div className="card">
      <Field label="월 급여 (세전, 원)">
        <NumberInput value={gross} onChange={e => setGross(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="국민연금 (%)"><NumberInput value={pension} onChange={e => setPension(e.target.value)} /></Field>
        <Field label="건강보험 (%)"><NumberInput value={health} onChange={e => setHealth(e.target.value)} /></Field>
        <Field label="고용보험 (%)"><NumberInput value={employ} onChange={e => setEmploy(e.target.value)} /></Field>
        <Field label="소득세 등 (%)"><NumberInput value={tax} onChange={e => setTax(e.target.value)} /></Field>
      </div>
      <Result
        main={won(net)}
        rows={[["국민연금", won(p)], ["건강보험", won(h)], ["고용보험", won(e)], ["소득세 등", won(t)]]}
        note="장기요양보험, 지방소득세, 소득세 누진공제 등은 반영되지 않은 간이 계산입니다."
      />
    </div>
  );
}

/* ---------- 날짜·생활 ---------- */

function parseDate(v: string) {
  const d = new Date(v + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}
const dateStr = (d: Date) => d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

function KoreanAge() {
  const today = new Date().toISOString().slice(0, 10);
  const [birth, setBirth] = useState("");
  const [ref, setRef] = useState(today);
  const b = parseDate(birth), r = parseDate(ref);
  let age: number | null = null;
  if (b && r) {
    age = r.getFullYear() - b.getFullYear();
    const m = r.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && r.getDate() < b.getDate())) age--;
    if (age < 0) age = null;
  }
  return (
    <div className="card">
      <Field label="생년월일"><input type="date" className="input" value={birth} onChange={e => setBirth(e.target.value)} /></Field>
      <Field label="기준일"><input type="date" className="input" value={ref} onChange={e => setRef(e.target.value)} /></Field>
      <Result main={age === null ? "-" : age + "세"} note="만 나이는 생일이 지나야 한 살씩 증가합니다." />
    </div>
  );
}

function DDay() {
  const [target, setTarget] = useState("");
  const t = parseDate(target);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let diff: number | null = null;
  if (t) diff = Math.round((t.getTime() - today.getTime()) / 86400000);
  const label = diff === null ? "-" : diff > 0 ? "D-" + diff : diff === 0 ? "D-DAY" : "D+" + Math.abs(diff);
  return (
    <div className="card">
      <Field label="목표일"><input type="date" className="input" value={target} onChange={e => setTarget(e.target.value)} /></Field>
      <Result main={label} rows={t ? [["목표일", dateStr(t)]] : []} note="오늘을 기준으로 남은 날 또는 지난 날을 계산합니다." />
    </div>
  );
}

function addMonths(d: Date, m: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + m);
  return x;
}

function DischargeDate() {
  const types = [
    ["육군", 18], ["해군", 20], ["공군", 21],
    ["사회복무요원", 21], ["직접 입력", 0]
  ] as [string, number][];
  const [enlist, setEnlist] = useState("");
  const [type, setType] = useState("육군");
  const [months, setMonths] = useState("18");
  const e = parseDate(enlist);
  const m = type === "직접 입력" ? num(months) : types.find(t => t[0] === type)![1];
  const discharge = e ? new Date(addMonths(e, m).getTime() - 86400000) : null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = discharge ? Math.round((discharge.getTime() - today.getTime()) / 86400000) : null;
  return (
    <div className="card">
      <Field label="입대일"><input type="date" className="input" value={enlist} onChange={e => setEnlist(e.target.value)} /></Field>
      <Field label="복무 형태">
        <select className="input" value={type} onChange={ev => setType(ev.target.value)}>
          {types.map(([t]) => <option key={t}>{t}</option>)}
        </select>
      </Field>
      {type === "직접 입력" && (
        <Field label="복무기간 (개월)"><NumberInput value={months} onChange={e => setMonths(e.target.value)} /></Field>
      )}
      <Result
        main={discharge ? dateStr(discharge) : "-"}
        rows={diff !== null ? [["전역 D-Day", diff > 0 ? "D-" + diff : diff === 0 ? "D-DAY" : "전역 완료"]] : []}
        note="복무기간은 제도 변경, 휴가·포상 등에 따라 실제 전역일과 다를 수 있습니다."
      />
    </div>
  );
}

/* ---------- 금융·환율 ---------- */

function ExchangeRate() {
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState("1350");
  const [dir, setDir] = useState("toKRW");
  const a = num(amount), r = num(rate);
  const result = dir === "toKRW" ? a * r : r > 0 ? a / r : 0;
  return (
    <div className="card">
      <Field label="변환 방향">
        <select className="input" value={dir} onChange={e => setDir(e.target.value)}>
          <option value="toKRW">외화 → 원화</option>
          <option value="toForeign">원화 → 외화</option>
        </select>
      </Field>
      <Field label={dir === "toKRW" ? "외화 금액" : "원화 금액"}>
        <NumberInput value={amount} onChange={e => setAmount(e.target.value)} />
      </Field>
      <Field label="적용 환율 (1 외화 = ? 원)" hint="실시간 환율은 API 없이 자동 조회되지 않으므로, 현재 환율을 입력하세요.">
        <NumberInput value={rate} onChange={e => setRate(e.target.value)} />
      </Field>
      <Result main={dir === "toKRW" ? won(result) : fmt(result, 2)} note="환전 수수료와 카드사 환율은 별도로 적용될 수 있습니다." />
    </div>
  );
}

function LoanPayment() {
  const [principal, setPrincipal] = useState("300000000");
  const [rate, setRate] = useState("3.5");
  const [months, setMonths] = useState("360");
  const P = num(principal), r = num(rate) / 12 / 100, n = num(months);
  const payment = P > 0 && n > 0 ? (r > 0 ? (P * r) / (1 - Math.pow(1 + r, -n)) : P / n) : 0;
  const total = payment * n;
  return (
    <div className="card">
      <Field label="대출원금 (원)"><NumberInput value={principal} onChange={e => setPrincipal(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="연 이자율 (%)"><NumberInput value={rate} onChange={e => setRate(e.target.value)} /></Field>
        <Field label="대출기간 (개월)"><NumberInput value={months} onChange={e => setMonths(e.target.value)} /></Field>
      </div>
      <Result main={won(payment) + " / 월"} rows={[["총 상환액", won(total)], ["총 이자", won(total - P)]]} note="원리금균등 상환 기준이며, 중도상환수수료와 변동금리는 반영되지 않습니다." />
    </div>
  );
}

function CompoundInterest() {
  const [principal, setPrincipal] = useState("10000000");
  const [rate, setRate] = useState("3");
  const [years, setYears] = useState("3");
  const [n, setN] = useState("12");
  const P = num(principal), r = num(rate) / 100, t = num(years), k = num(n);
  const amount = P * Math.pow(1 + r / k, k * t);
  return (
    <div className="card">
      <Field label="원금 (원)"><NumberInput value={principal} onChange={e => setPrincipal(e.target.value)} /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="연 이자율 (%)"><NumberInput value={rate} onChange={e => setRate(e.target.value)} /></Field>
        <Field label="기간 (년)"><NumberInput value={years} onChange={e => setYears(e.target.value)} /></Field>
        <Field label="연 복리 횟수"><NumberInput value={n} onChange={e => setN(e.target.value)} /></Field>
      </div>
      <Result main={won(amount)} rows={[["총 이자", won(amount - P)]]} note="세전 기준이며, 실제 예금은 이자소득세가 적용될 수 있습니다." />
    </div>
  );
}

function Percent() {
  const [mode, setMode] = useState("of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const x = num(a), y = num(b);
  let result = 0, unit = "", desc = "";
  if (mode === "of") { result = x * y / 100; unit = ""; desc = `${fmt(x)}의 ${fmt(y)}%`; }
  else if (mode === "share") { result = y > 0 ? x / y * 100 : 0; unit = "%"; desc = `${fmt(x)}은 ${fmt(y)}의 몇 %?`; }
  else { result = x > 0 ? (y - x) / x * 100 : 0; unit = "%"; desc = `${fmt(x)} → ${fmt(y)} 증감률`; }
  return (
    <div className="card">
      <Field label="계산 방식">
        <select className="input" value={mode} onChange={e => setMode(e.target.value)}>
          <option value="of">어떤 수의 퍼센트</option>
          <option value="share">비율(몇 %인지)</option>
          <option value="change">증감률</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={mode === "of" ? "기준 수" : mode === "share" ? "값" : "이전 값"}>
          <NumberInput value={a} onChange={e => setA(e.target.value)} />
        </Field>
        <Field label={mode === "of" ? "퍼센트 (%)" : mode === "share" ? "전체 값" : "이후 값"}>
          <NumberInput value={b} onChange={e => setB(e.target.value)} />
        </Field>
      </div>
      <Result main={fmt(result) + unit} note={desc} />
    </div>
  );
}

function Vat() {
  const [mode, setMode] = useState("supply");
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState("10");
  const a = num(amount), r = num(rate) / 100;
  const supply = mode === "supply" ? a : a / (1 + r);
  const vat = supply * r;
  const total = supply + vat;
  return (
    <div className="card">
      <Field label="입력 기준">
        <select className="input" value={mode} onChange={e => setMode(e.target.value)}>
          <option value="supply">공급가액 입력</option>
          <option value="total">부가세 포함가 입력</option>
        </select>
      </Field>
      <Field label="금액 (원)"><NumberInput value={amount} onChange={e => setAmount(e.target.value)} /></Field>
      <Field label="부가세율 (%)"><NumberInput value={rate} onChange={e => setRate(e.target.value)} /></Field>
      <Result main={won(mode === "supply" ? total : supply)} rows={[["공급가액", won(supply)], ["부가세", won(vat)], ["공급가액 + 부가세", won(total)]]} />
    </div>
  );
}

/* ---------- 단위·건강 ---------- */

const unitGroups: Record<string, { units: [string, number][]; base: string }> = {
  "면적": { units: [["평", 3.30579], ["제곱미터 (m²)", 1], ["제곱킬로미터 (km²)", 1000000], ["제곱피트 (ft²)", 0.092903]], base: "m²" },
  "길이": { units: [["미터 (m)", 1], ["킬로미터 (km)", 1000], ["센티미터 (cm)", 0.01], ["피트 (ft)", 0.3048], ["인치 (in)", 0.0254], ["마일 (mi)", 1609.344]], base: "m" },
  "무게": { units: [["킬로그램 (kg)", 1], ["그램 (g)", 0.001], ["파운드 (lb)", 0.45359237], ["온스 (oz)", 0.028349523]], base: "kg" },
  "데이터": { units: [["메가바이트 (MB)", 1], ["킬로바이트 (KB)", 1 / 1024], ["기가바이트 (GB)", 1024], ["테라바이트 (TB)", 1048576]], base: "MB" }
};

function UnitConverter() {
  const [group, setGroup] = useState("면적");
  const [tempMode, setTempMode] = useState(false);
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("평");
  const [to, setTo] = useState("제곱미터 (m²)");
  const [tempFrom, setTempFrom] = useState("섭씨 (°C)");
  const [tempTo, setTempTo] = useState("화씨 (°F)");

  const groups = Object.keys(unitGroups);
  const changeGroup = (g: string) => {
    setGroup(g); setTempMode(false);
    const u = unitGroups[g].units;
    setFrom(u[0][0]); setTo(u[1][0]);
  };

  let out = NaN;
  const v = num(value);
  if (tempMode) {
    const toC = tempFrom.startsWith("섭씨") ? v : (v - 32) * 5 / 9;
    out = tempTo.startsWith("섭씨") ? toC : toC * 9 / 5 + 32;
  } else {
    const g = unitGroups[group];
    const f = g.units.find(u => u[0] === from)?.[1] ?? 1;
    const t = g.units.find(u => u[0] === to)?.[1] ?? 1;
    out = v * f / t;
  }

  return (
    <div className="card">
      <div className="flex flex-wrap gap-2 mb-4">
        {[...groups, "온도"].map(g => (
          <button key={g} onClick={() => g === "온도" ? setTempMode(true) : changeGroup(g)}
            className={"px-3 py-1.5 rounded-full text-sm border " + ((tempMode && g === "온도") || (!tempMode && group === g) ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-300")}>
            {g}
          </button>
        ))}
      </div>
      <Field label="값"><NumberInput value={value} onChange={e => setValue(e.target.value)} /></Field>
      {tempMode ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="변환 전">
            <select className="input" value={tempFrom} onChange={e => setTempFrom(e.target.value)}>
              <option>섭씨 (°C)</option><option>화씨 (°F)</option>
            </select>
          </Field>
          <Field label="변환 후">
            <select className="input" value={tempTo} onChange={e => setTempTo(e.target.value)}>
              <option>섭씨 (°C)</option><option>화씨 (°F)</option>
            </select>
          </Field>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Field label="변환 전 단위">
            <select className="input" value={from} onChange={e => setFrom(e.target.value)}>
              {unitGroups[group].units.map(([u]) => <option key={u}>{u}</option>)}
            </select>
          </Field>
          <Field label="변환 후 단위">
            <select className="input" value={to} onChange={e => setTo(e.target.value)}>
              {unitGroups[group].units.map(([u]) => <option key={u}>{u}</option>)}
            </select>
          </Field>
        </div>
      )}
      <Result main={fmt(out, 4)} note="1평은 약 3.30579제곱미터입니다." />
    </div>
  );
}

function Bmi() {
  const [h, setH] = useState("170");
  const [w, setW] = useState("65");
  const hm = num(h) / 100;
  const bmi = hm > 0 ? num(w) / (hm * hm) : 0;
  const cat = bmi === 0 ? "-" : bmi < 18.5 ? "저체중" : bmi < 23 ? "정상" : bmi < 25 ? "과체중" : bmi < 30 ? "경도 비만" : "중등도 이상 비만";
  const normalMin = hm > 0 ? 18.5 * hm * hm : 0;
  const normalMax = hm > 0 ? 23 * hm * hm : 0;
  return (
    <div className="card">
      <div className="grid grid-cols-2 gap-3">
        <Field label="키 (cm)"><NumberInput value={h} onChange={e => setH(e.target.value)} /></Field>
        <Field label="몸무게 (kg)"><NumberInput value={w} onChange={e => setW(e.target.value)} /></Field>
      </div>
      <Result main={fmt(bmi) + " · " + cat} rows={[["권장 체중 범위", won(normalMin).replace("원", "kg") + " ~ " + won(normalMax).replace("원", "kg")]]} note="BMI는 참고 지표이며, 근육량·건강 상태에 따라 해석이 달라질 수 있습니다." />
    </div>
  );
}

const registry: Record<string, () => JSX.Element> = {
  "unemployment-benefit": UnemploymentBenefit,
  "annual-leave-pay": AnnualLeavePay,
  "severance-pay": SeverancePay,
  "weekly-holiday-pay": WeeklyHolidayPay,
  "hourly-to-monthly": HourlyToMonthly,
  "net-salary": NetSalary,
  "korean-age": KoreanAge,
  "d-day": DDay,
  "discharge-date": DischargeDate,
  "exchange-rate": ExchangeRate,
  "loan-payment": LoanPayment,
  "compound-interest": CompoundInterest,
  "percent": Percent,
  "vat": Vat,
  "unit-converter": UnitConverter,
  "bmi": Bmi
};

export default function CalculatorClient({ slug }: { slug: string }) {
  const C = registry[slug];
  return C ? <C /> : <p className="text-slate-500">계산기를 찾을 수 없습니다.</p>;
}

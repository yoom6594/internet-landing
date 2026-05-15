# Project TODO — 인터넷 가입 랜딩페이지 (SK/LG)

## 핵심 기능
- [x] DB: leads 테이블 스키마 (carrier, name, phone, address, plan, installDate, status, createdAt)
- [x] DB: 동일 사용자 중복 신청 방지(같은 carrier + phone, 24시간 내 중복 거절)
- [x] tRPC: leads.create (공개) — 유효성 검사 + 중복 체크 + notifyOwner 호출
- [x] tRPC: leads.list (관리자 전용) — 신청 목록 조회
- [x] tRPC: leads.updateStatus (관리자 전용) — 대기/연락완료/계약완료 상태 변경
- [x] notifyOwner: 신규 신청 시 오너 알림 (제목 + 신청 요약 본문)

## 페이지/라우팅
- [x] / — 메인 랜딩 (통신사 선택: SK / LG)
- [x] /sk — SK 인터넷 가입 랜딩 + 신청 폼
- [x] /lg — LG 인터넷 가입 랜딩 + 신청 폼
- [x] /admin — 관리자 대시보드 (인증 필수, role=admin)
- [x] 404 처리

## 랜딩 구성 (SK/LG 공통 패턴)
- [x] 히어로 섹션 (대형 타이포 + 핵심 가치 + 1차 CTA)
- [x] 혜택/특징 섹션 (현금 지원, 결합할인, 빠른 설치, 최저가 보장)
- [x] 요금제 카드 비교 (3개 플랜: 100M / 500M / 1G)
- [x] 가입 절차 안내 (1.상담신청 → 2.전화상담 → 3.설치예약 → 4.사은품)
- [x] FAQ 섹션
- [x] 신청 폼 섹션
- [x] 모바일 하단 고정 CTA 바

## DB 게더링 폼
- [x] 이름 (2자 이상)
- [x] 연락처 (010-XXXX-XXXX 형식 검증)
- [x] 주소 (10자 이상)
- [x] 희망 요금제 (선택형: 100M / 500M / 1G)
- [x] 설치 희망일 (날짜 선택)
- [x] 개인정보 수집 동의 체크박스
- [x] 제출 후 성공 화면

## 디자인
- [x] 모노톤 (블랙/화이트/그레이) 테마 적용 (index.css)
- [x] 고대비 타이포그래피 (Pretendard)
- [x] 반응형 (모바일 우선)
- [x] 스크롤 자연스러운 여정 + 미세 애니메이션

## 관리자
- [x] /admin 페이지: 신청 목록 테이블
- [x] 통신사/상태 필터
- [x] 상태 드롭다운 즉시 변경
- [x] 권한 가드 (admin 아닐 시 안내 + 로그인 유도)

## 검증
- [x] vitest: leads.create 유효성/중복 검증 테스트
- [x] vitest: leads.updateStatus 권한 테스트

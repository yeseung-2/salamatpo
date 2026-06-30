# Project Structure

SalamatPo는 frontend와 backend를 하나의 GitHub 저장소에서 관리하는 monorepo 구조입니다.

## Root Structure

```txt
salamatpo/
├─ frontend/
├─ backend/
├─ docs/
├─ README.md
└─ .gitignore
```

## Frontend Structure

```txt
frontend/
├─ src/
│  ├─ app/
│  ├─ lib/
│  ├─ components/
│  ├─ features/
│  └─ types/
├─ public/
├─ package.json
└─ tsconfig.json
```

### `src/app`

Next.js App Router 기반 페이지를 관리합니다.

예시:

```txt
src/app/page.tsx
src/app/layout.tsx
src/app/search/page.tsx
src/app/community/page.tsx
```

### `src/lib`

공통 라이브러리와 API 클라이언트를 관리합니다.

예시:

```txt
src/lib/api.ts
```

### `src/components`

여러 화면에서 재사용하는 공통 컴포넌트를 관리합니다.

예시:

```txt
Button
Input
Card
Header
BottomNav
```

### `src/features`

기능별 UI와 로직을 관리합니다.

예시:

```txt
features/search
features/government
features/community
features/medication
```

### `src/types`

TypeScript 타입을 관리합니다.

예시:

```txt
Medicine
Pharmacy
GovernmentProgram
Recommendation
CommunityPost
```

## Backend Structure

```txt
backend/
├─ app/
│  ├─ api/
│  │  └─ v1/
│  ├─ core/
│  ├─ models/
│  ├─ schemas/
│  ├─ services/
│  ├─ repositories/
│  ├─ utils/
│  └─ main.py
└─ requirements.txt
```

### `app/api/v1`

API 라우터를 관리합니다.

예시:

```txt
health.py
search.py
government.py
community.py
medication.py
```

### `app/core`

공통 설정, 환경변수, 보안 관련 코드를 관리합니다.

예시:

```txt
config.py
security.py
```

### `app/models`

DB 모델을 관리합니다.

예시:

```txt
user.py
medicine.py
pharmacy.py
community_post.py
```

### `app/schemas`

요청과 응답 데이터 형식을 관리합니다.

예시:

```txt
SearchRequest
RecommendationResponse
CommunityPostCreate
```

### `app/services`

비즈니스 로직을 관리합니다.

예시:

```txt
recommendation_service.py
eligibility_service.py
medication_service.py
```

### `app/repositories`

DB 접근 로직을 관리합니다.

예시:

```txt
medicine_repository.py
pharmacy_repository.py
community_repository.py
```

### `app/utils`

공통 유틸 함수를 관리합니다.

예시:

```txt
distance.py
scoring.py
date.py
```

## Development Principle

초기에는 서비스를 여러 개로 나누지 않고, FastAPI 단일 백엔드 안에서 기능별 모듈로 분리합니다.

```txt
서비스 분리 X
기능별 폴더 분리 O
```

이 구조를 통해 MVP를 빠르게 만들고, 나중에 OCR, 알림, 추천 기능이 커질 경우 별도 서비스로 분리할 수 있습니다.
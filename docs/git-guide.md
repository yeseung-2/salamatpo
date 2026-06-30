# Git Collaboration Guide

이 문서는 SalamatPo 프로젝트의 Git 협업 규칙입니다.

## Branch Strategy

```txt
main
└─ 배포용 브랜치

develop
└─ 개발 통합 브랜치

feature/*
└─ 기능 개발 브랜치
```

## Basic Rules

- `main` 브랜치에 직접 push하지 않습니다.
- `develop` 브랜치에 직접 push하지 않습니다.
- 모든 기능 작업은 `feature/*` 브랜치에서 진행합니다.
- 작업 완료 후 Pull Request를 생성합니다.
- `.env`, `.env.local`, `.venv`, `node_modules`, `.next`, `__pycache__`는 절대 올리지 않습니다.

## Start New Work

작업을 시작하기 전 항상 `develop`을 최신 상태로 맞춥니다.

```bash
git checkout develop
git pull origin develop
```

새 기능 브랜치를 만듭니다.

```bash
git checkout -b feature/작업이름
```

예시:

```bash
git checkout -b feature/home-ui
git checkout -b feature/search-flow
git checkout -b feature/community
```

## Save Work

작업 중 변경사항을 확인합니다.

```bash
git status
```

변경사항을 저장합니다.

```bash
git add .
git commit -m "feat: add home ui"
```

원격 저장소에 push합니다.

```bash
git push origin feature/home-ui
```

그 후 GitHub에서 Pull Request를 생성합니다.

## Commit Message Rule

```txt
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: UI/style 수정
refactor: 코드 구조 개선
chore: 설정, 패키지, 환경 작업
```

예시:

```txt
feat: add medicine search form
fix: resolve api connection error
docs: update setup guide
style: update home card layout
chore: update gitignore
```

## Pull Request Rule

PR 제목은 작업 내용을 명확히 적습니다.

좋은 예시:

```txt
feat: add home page UI
feat: implement medicine search form
docs: add Windows setup guide
```

나쁜 예시:

```txt
수정
작업함
최종
진짜최종
```

## Conflict Rule

충돌이 발생하면 혼자 임의로 해결하지 말고 팀원에게 먼저 공유합니다.

특히 아래 파일은 공통 파일이므로 수정 전 공유합니다.

```txt
README.md
.gitignore
frontend/src/app/layout.tsx
frontend/src/lib/api.ts
backend/app/main.py
backend/app/core/config.py
```

## First Task Recommendation

Git이 처음인 팀원은 작은 UI 작업부터 시작합니다.

추천 첫 브랜치:

```bash
git checkout -b feature/home-ui
```

첫 작업 범위:

```txt
Home 화면 UI 만들기
- “오늘 약이 필요하세요?” 문구
- [약 찾기] 버튼
- 무료약 가능 카드
- 가까운 GAMOT 카드
- 오늘 재고 확인된 약국 카드
- 정부지원 가능 카드
```

## Recommended Workflow for Yeonwoo

처음 프로젝트를 받을 때:

```bash
git clone https://github.com/yeseung-2/salamatpo.git
cd salamatpo
git checkout develop
```

작업을 시작할 때:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/home-ui
```

작업을 저장할 때:

```bash
git status
git add .
git commit -m "feat: add home ui"
git push origin feature/home-ui
```

그 후 GitHub에서 Pull Request를 생성합니다.

## Important Notes

- 작업 전에는 항상 `git pull origin develop`을 먼저 실행합니다.
- 한 브랜치에서는 하나의 기능만 작업합니다.
- 모르는 충돌이 생기면 바로 공유합니다.
- `.env.local`, `.venv`, `node_modules` 같은 개인 환경 파일은 절대 올리지 않습니다.
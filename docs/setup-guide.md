# Setup Guide

이 문서는 SalamatPo 프로젝트를 로컬에서 실행하기 위한 가이드입니다.

## 1. Repository Clone

```bash
git clone https://github.com/yeseung-2/salamatpo.git
cd salamatpo
git checkout develop
```

## 2. Required Tools

### macOS - 예승

macOS에서는 아래 도구가 필요합니다.

```bash
git --version
node -v
npm -v
python3.11 --version
pip3.11 --version
```

필요한 도구:

```txt
Git
Node.js
npm
Python 3.11
Cursor
```

### Windows - 연우

Windows에서는 아래 도구가 필요합니다.

```powershell
git --version
node -v
npm -v
python --version
pip --version
```

필요한 도구:

```txt
Git
Node.js
npm
Python 3.11
Cursor
```

Python 명령어가 작동하지 않으면 아래 명령어를 사용합니다.

```powershell
py --version
py -3.11 --version
```

## 3. Frontend Setup

Frontend는 Next.js 기반입니다.

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 확인합니다.

```txt
http://localhost:3000
```

## 4. Backend Setup - macOS

Backend는 FastAPI 기반입니다.

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

가상환경이 정상적으로 켜지면 터미널 앞에 `(.venv)`가 표시됩니다.

## 5. Backend Setup - Windows

Windows에서는 PowerShell 또는 Cursor Terminal을 사용합니다.

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

만약 `python` 명령어가 작동하지 않으면 아래 명령어를 사용합니다.

```powershell
cd backend
py -3.11 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

가상환경이 정상적으로 켜지면 터미널 앞에 `(.venv)`가 표시됩니다.

## 6. Backend Check

Backend 서버 실행 후 아래 주소를 확인합니다.

```txt
http://localhost:8000
http://localhost:8000/api/v1/health
http://localhost:8000/docs
```

정상 응답 예시:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  },
  "message": "SalamatPo API is running"
}
```

## 7. Environment Variables

Frontend 폴더에서 `.env.local.example` 파일을 참고해 `.env.local` 파일을 생성합니다.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

주의:

```txt
.env.local 파일은 GitHub에 올리지 않습니다.
.env.local.example 파일만 GitHub에 올립니다.
```

## 8. Local Development Flow

로컬 개발 시 터미널을 2개 열어 사용합니다.

### Terminal 1 - Backend

macOS:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

Windows:

```powershell
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload
```

Backend runs at:

```txt
http://localhost:8000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at:

```txt
http://localhost:3000
```

## 9. Common Issues

### 1. Frontend에서 API 연결이 실패할 때

Backend 서버가 켜져 있는지 확인합니다.

```txt
http://localhost:8000/api/v1/health
```

위 주소가 정상적으로 열려야 frontend에서도 API 연결이 됩니다.

### 2. macOS에서 `python3.11` 명령어가 안 될 때

Python 3.11이 설치되어 있는지 확인합니다.

```bash
python3.11 --version
```

설치가 필요하면 Homebrew로 설치합니다.

```bash
brew install python@3.11
```

### 3. Windows에서 `python` 명령어가 안 될 때

아래 명령어를 사용합니다.

```powershell
py -3.11 --version
```

가상환경 생성도 아래처럼 진행합니다.

```powershell
py -3.11 -m venv .venv
```

### 4. 패키지 설치 후에도 실행이 안 될 때

가상환경이 켜져 있는지 확인합니다.

macOS:

```bash
source .venv/bin/activate
```

Windows:

```powershell
.venv\Scripts\activate
```

그다음 다시 실행합니다.

```bash
uvicorn app.main:app --reload
```

### 5. `.env.local`을 만들었는데 적용이 안 될 때

Frontend 개발 서버를 껐다가 다시 실행합니다.

```bash
npm run dev
```

Next.js는 환경변수 변경 후 서버를 재시작해야 반영됩니다.

## 10. Do Not Commit

아래 파일과 폴더는 GitHub에 올리지 않습니다.

```txt
.env
.env.local
.env.*.local
.venv/
node_modules/
.next/
__pycache__/
*.pyc
```

이 파일들은 개인 개발 환경에서 자동으로 생성되는 파일이거나 민감한 환경변수를 포함할 수 있습니다.
# PromptShield — LLM Prompt-Injection Firewall

Research-oriented Full Stack application for real-time prompt-injection detection, rule verification, risk-based security enforcement, and audit analytics.

---

## Architecture

```text
React Frontend
      ↓
FastAPI Backend (REST API + AI Security Gateway)
      ↓
PromptShield Security Pipeline
      ↓
DistilBERT V2 + Rule Detector + Risk Engine
      ↓
Decision: ALLOW / WARN / BLOCK
      ↓
MongoDB Atlas / Local (Scan Logs & User Accounts)
```

---

## Multi-Layered Security Engine

1. **ML Detector**: Fine-tuned `distilbert-base-uncased` (PromptShield V2) running in evaluation mode with `max_length=256` and PyTorch `no_grad()`. Returns softmax probability distributions (`benign_probability` and `malicious_probability`).
2. **Rule Detector**: Fast regex engine covering 8 distinct attack categories from the research notebook:
   - Direct Injection
   - System Prompt Extraction
   - Jailbreak
   - Role Manipulation
   - Safety Bypass
   - Instruction Override
   - Indirect Injection
   - Obfuscation
3. **Risk Engine**: Hybrid risk-scoring algorithm combining ML confidence with category-specific severity:
   - If no attack category: $\text{Risk} = \text{ML\_Score} \times 100$
   - If attack category matched: $\text{Risk} = (0.60 \times \text{ML\_Score} + 0.25 \times \text{Severity}_{\text{max}} + 0.15) \times 100$
4. **Decision Thresholds**:
   - `Risk < 30` &rarr; **ALLOW**
   - `30 ≤ Risk < 70` &rarr; **WARN**
   - `Risk ≥ 70` &rarr; **BLOCK**

---

## Getting Started

### 1. Environment Setup

```powershell
cd d:\Projects\PromptShield
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your MongoDB connection string (or leave empty for in-memory mode):

```env
APP_NAME=PromptShield
APP_VERSION=1.0.0
MODEL_PATH=../ml/models/promptshield-distilbert-v2
RISK_ALLOW_THRESHOLD=30
RISK_BLOCK_THRESHOLD=70
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=promptshield
JWT_SECRET=your_secure_secret_key
```

### 3. Run the FastAPI Server

```powershell
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 4. Interactive API Documentation
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## API Endpoints Reference

### Security & Scanning

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service status, ML model loaded state, MongoDB status |
| `POST` | `/api/v1/scan` | Analyze a single prompt, evaluate risk, asynchronously log audit |
| `POST` | `/api/v1/batch-scan` | High-throughput vectorized batch prompt analysis |

### Authentication (JWT)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user account |
| `POST` | `/api/v1/auth/login` | Login with username/password, returns JWT bearer token |
| `POST` | `/api/v1/auth/token` | OAuth2 password flow endpoint for Swagger UI Authorize modal |
| `GET` | `/api/v1/auth/me` | Protected route returning authenticated user profile |

*Default seed credentials: `admin` / `promptshield123`*

### Audit Logging & Analytics

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/scans` | Query paginated historical scan records (filter by `ALLOW`, `WARN`, `BLOCK`) |
| `GET` | `/api/v1/analytics/summary` | Aggregate metrics (total scans, decision breakdown, top attack categories) |

---

## Running Automated Tests

Run the complete 18-test suite covering health, detection, risk calculation, batching, authentication, and audit queries:

```powershell
cd backend
pytest -v tests/
```

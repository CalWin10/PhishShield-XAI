# PhishShield-XAI

PhishShield is an advanced AI-powered phishing detection and analysis platform. It leverages state-of-the-art machine learning to identify, analyze, and mitigate phishing threats in real-time.

## Project Structure

* **backend**: Spring Boot application managing core business logic, API routing, and integrations.
* **frontend-1**: The user interface, built with modern web technologies for an intuitive dashboard and analysis views.
* **ml-service**: Machine learning microservice dedicated to real-time URL and content prediction using cached ONNX models.
* **deep-scan-worker**: Python-based worker service for intensive, asynchronous background scanning tasks and deep threat analysis.
* **contracts**: API contracts, fixtures, and OpenAPI specifications.
* **infra**: Docker Compose setup and deployment configurations for orchestrating the services.
* **docs**: Comprehensive project documentation including architecture and security guides.
* **model_cache**: Local storage for cached ML models to ensure fast inference.

## Prerequisites

To run this project locally, ensure you have the following tools installed:

* **Docker & Docker Compose**: The easiest and recommended way to run the entire stack.
* **Java 17+**: Required if you plan to run or develop the Spring Boot backend standalone.
* **Node.js (18+) / npm / Bun**: Required for running the frontend standalone.
* **Python 3.10+**: Required for the `ml-service` and `deep-scan-worker`.

## How to Run

### Method 1: Using Docker Compose (Recommended)

The entire application stack is containerized for seamless and consistent deployment.

1. Navigate to the infrastructure directory:
   ```bash
   cd infra
   ```
2. Start the services in detached mode using Docker Compose:
   ```bash
   docker-compose up --build -d
   ```
3. Access the platform:
   * **Frontend Dashboard**: Usually accessible at `http://localhost:5173` or `http://localhost:3000`.
   * **Backend API**: Accessible at `http://localhost:8080`.

### Method 2: Running Services Standalone (For Development)

If you prefer to run services individually for active development and debugging:

**1. Backend (Spring Boot)**
```bash
cd backend
./mvnw spring-boot:run
```

**2. Frontend**
```bash
cd frontend-1
npm install  # or bun install
npm run dev  # or bun dev
```

**3. ML Service (Python)**
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**4. Deep Scan Worker (Python)**
```bash
cd deep-scan-worker
pip install -r requirements.txt
python -m app.worker
```

## Documentation

For detailed technical information, architecture diagrams, API specifications, and the ML model card, please refer to the markdown files in the `docs/` directory.

## License

Please refer to the [LICENSE](LICENSE) file in the root directory for licensing information.
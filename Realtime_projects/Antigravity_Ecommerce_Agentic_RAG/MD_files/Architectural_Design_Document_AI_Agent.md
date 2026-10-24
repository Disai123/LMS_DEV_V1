# Architectural Design Document (ADD) - AI Assistant Agent Extension

## 1. Introduction

### Purpose of the System
The AI Assistant Agent is an intelligent extension to the existing e-commerce platform. Its purpose is to reduce friction in the shopping journey by allowing users to navigate catalogs, manage carts, and checkout using natural language. This document defines the architectural strategy to integrate this agent seamlessly into the current FastAPI/React ecosystem.

### High-Level Description
The system consists of a **React-based Chat Widget** (Frontend) that communicates with a specialized **Agent Service** (Backend) running on FastAPI. The core intelligence is powered by **LangGraph**, which orchestrates the conversation flow and determines when to call internal E-commerce APIs (Product, Cart, Checkout). The system persists conversational history and agent state in the existing **PostgreSQL (Neon)** database.

## 2. Architecture Overview

### System Architecture
The architecture follows a **Micro-service / Modular Monolith hybrid approach**:
*   **Client Layer**: The Web Browser running the React Application with the embedded Agent Widget.
*   **API Gateway / Reverse Proxy**: Handles incoming requests and routes them to either the Core E-commerce endpoints or the Agent endpoints.
*   **Service Layer**:
    *   **Core E-commerce Service**: Existing functionality (Auth, Product, Orders).
    *   **Agent Service**: New module handling NLU, Intent Classification, and Tool execution.
*   **Data Layer**: Shared PostgreSQL database with logically separated schemas/tables for Agent data.

### Architecture Diagram (Component Interactions)

```mermaid
graph TD
    User[End User] -->|Interacts| Client[React Frontend + Agent Widget]
    Client -->|HTTP/REST| API[FastAPI Application]
    
    subgraph "Backend System"
        API -->|Route: /agent| AgentService[AI Agent Service (LangGraph)]
        API -->|Route: /api| CoreService[Core E-commerce Service]
        
        AgentService -->|Calls Tools| Tools[Agent Tools]
        Tools -->|Query/Mutate| CoreService
        
        AgentService -->|Read/Write| DB[(PostgreSQL - Neon)]
        CoreService -->|Read/Write| DB
    end
    
    subgraph "External AI Provider"
        AgentService -->|LLM Inference| LLM[LLM Provider (e.g., OpenAI/Gemini)]
    end
```

## 3. Application Architecture

### Frontend: React.js (Agent UI)
*   **Component**: `AgentWidget`
*   **State Management**: Local React state or compatible store (Zustand/Context) to handle message history ephemeral state.
*   **Communication**: Uses `fetch` or `axios` to communicate with `@/agent` endpoints.
*   **Features**:
    *   Collapsible floating button.
    *   Markdown rendering for rich text responses.
    *   Custom rendering for "Product Card" JSON responses.

### Backend: FastAPI (Agent Service)
*   **Framework**: FastAPI (Async).
*   **Role**: Exposes endpoints for the frontend conversation loop.
*   **Endpoint**: `POST /agent/chat`
    *   Input: `user_message`, `session_id`, `user_context`.
    *   Output: `agent_response`, `structured_data` (for UI cards).

### Agent Framework: LangGraph
*   **Orchestration**: Uses **LangGraph** to define the decision-making graph.
    *   **Nodes**: `InputParser`, `ToolSelector`, `ResponseGenerator`.
    *   **Edges**: Conditional logic based on identified intent (e.g., if intent="checkout", go to CheckoutNode).
*   **Memory**: Short-term memory (conversation window) stored in-memory during processing, long-term history persisted in DB.

### APIs & Integrations
*   **Internal Tools**: The Agent will utilize "Tool" wrappers around existing Service functions:
    *   `search_products(query: str)`
    *   `add_to_cart(product_id: int, qty: int)`
    *   `get_cart()`
    *   `checkout(payment_token: str)`
*   **ORM Layer**: SQLAlchemy (Async) used for all database interactions.

### Database: PostgreSQL (Neon DB)
*   **Agent Data Scope**:
    *   `agent_sessions`: Stores session metadata.
    *   `agent_messages`: Logs conversation history for context and auditing.
*   **Integration**: Connects to the existing Neon DB cluster. New tables will be created via Alembic migrations.

## 4. Deployment Architecture

### Hosting Environment
*   **Platform**: Render (Cloud Platform).
*   **Configuration**: The Agent Service will likely run as part of the main `web_service` worker or as a sidecar worker process depending on load.
*   **Environment Variables**: Secure injection of API Keys (LLM Provider) and Database URL.

### Scalability and Performance
*   **Scalability**: The stateless nature of the FastAPI agent layer allows horizontal scaling (adding more workers/replicas) on Render.
*   **Performance**:
    *   **Caching**: Implement Redis (optional future step) for frequent product queries.
    *   **Async/Await**: Full utilization of Python's `asyncio` to handle I/O bound LLM calls without blocking the server.

### CI/CD Pipeline
*   **Source Control**: GitHub.
*   **Pipeline**: GitHub Actions or Render Blueprints.
    *   Steps: Lint -> Test (Unit/Integration) -> Build -> Deploy.
    *   **Migration**: Database migrations run automatically on successful build before traffic cut-over.

## 5. Non-Functional Considerations

### Reliability
*   **Fallbacks**: If the LLM service is down, the Agent must fail gracefully ("I'm having trouble thinking, please try manual search").
*   **Retries**: Implement exponential backoff for failed LLM or Database connections.

### Maintainability
*   **Modular Code**: Agent logic separated into `routers/agent.py`, `services/agent_service.py`, and `tools/*.py`.
*   **Typed Python**: Use Pydantic models for all Data Transfer Objects (DTOs) and strict type hinting.

### Performance
*   **Latency Target**: < 2.0s for text responses.
*   **Resource Efficiency**: Connection pooling for database to prevent exhaustion.

### Availability
*   **Uptime**: Target 99.9% uptime, aligned with the core e-commerce platform.
*   **Monitoring**: Integration with logging tools (e.g., Sentry, Cloud Watch) to track Agent error rates and response anomalies.

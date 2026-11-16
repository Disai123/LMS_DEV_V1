# Stage 2 — Labs map, hours, and prompt source

## Section 1 hours

| Stage | Hours |
|-------|------:|
| Software Engineering (Python) | 5 |
| AI Engineering | 11 |
| **Section 1 total** | **16** |

`ai-engineering` item minutes in `stages.json` sum to **660** (320 reads + 340 practise incl. 60 min assignment).

## Storyline

- **Corpus:** `policy_corpus/` with `remote_work_policy.txt`, `pto_policy.txt`, `password_reset_policy.txt`, `equipment_request.txt`, `acceptable_use_policy.txt`
- **Default models:** `gpt-4o-mini` vs `gemini-2.0-flash` (compare lab)
- **RAG params:** chunk 400 / overlap 50 / `top_k=4` / `text-embedding-3-small` or `nomic-embed-text`

## Lab chain

1. Compare models → 2. Extraction + tools → 3. Ingest → 4. Cited RAG → 5. Hybrid → 6. Diagnose → 7. LangGraph approval → 8. Agentic RAG → 9. Red team → 10. MCP → **Assignment (7 steps)**

## Canonical prompts (LMS source)

All learner copy lives in:

- `frontend/src/fde/exercises/labs/promptFoundation.js` (Stage 2 block + assignment steps)
- `frontend/src/fde/exercises/labs/stage02.js` (metadata: `coversConcepts`, `relatedReads`)
- `frontend/src/fde/exercises/labs/stage02Assignment.js`

Do not duplicate prompts here; ship from the repo so LMS and instructor stay in sync.

## Concept map (per lab)

| Lab | Concepts |
|-----|----------|
| `lab-compare-two-models` | Model evaluation, latency/cost, default selection |
| `lab-extraction-and-tool-calling` | Structured JSON, tool routing, failures |
| `lab-ingest-chunk-and-index` | Ingestion, chunking, embeddings |
| `lab-baseline-cited-rag` | RAG + citations + refusal |
| `lab-hybrid-search-reranker` | BM25, vector, rerank |
| `lab-diagnose-rag-failures` | Four-layer debug |
| `lab-langgraph-human-approval` | HITL, gated email mock |
| `lab-agentic-rag-mini-loop` | Grade, one rewrite, refusal |
| `lab-red-team-guardrails` | Injection + guardrails |
| `lab-mcp-server` | MCP tool + manifest resource |
| `assignment-integrated-policy-assistant` | Integrated evidence from all labs |
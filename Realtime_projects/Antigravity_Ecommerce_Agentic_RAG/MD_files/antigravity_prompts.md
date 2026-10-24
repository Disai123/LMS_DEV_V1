# Antigravity prompt guide

Source: Antigravity_Agentic_RAG_20_Day_Task_Wise_Prompts_Langfuse_Complete.docx


## Day 1 — ANTIGRAVITY TASK-WISE PROMPT GUIDE

ANTIGRAVITY TASK-WISE PROMPT GUIDE

Agentic RAG Integration into Existing E-Commerce Application
FastAPI Backend + ReactJS Frontend + FAISS Vector Database | 20-Day Plan

---

## Day 1 — Purpose

This guide adds an Agentic RAG feature to an already-built e-commerce application. The feature uses product manuals, user manuals, usage guides, FAQs, warranty information and other approved product documents as the knowledge source. Documents are processed, split into useful chunks, converted into embeddings, stored in a FAISS vector index, retrieved for user questions, and then used to produce grounded answers.
The plan contains 20 days: the first 3 days are for learning the required Agentic RAG concepts, and Days 4-20 are for the actual project implementation. Each implementation day contains one clear Antigravity prompt. Testing happens after each day.

---

## Day 1 — Agentic RAG Fundamentals

SDLC Phase: Learning
Teach me the basic concepts needed for this Agentic RAG project in simple language. Cover: what RAG is, why a normal LLM answer is not enough for product manuals, what retrieval means, what an agent does in an Agentic RAG system, and the difference between normal RAG and Agentic RAG. Use our e-commerce manual example throughout. Do not create project files or code. At the end, give me a very small practical understanding check that does not create any files.
Checkpoint: Confirm the concepts are understood before starting implementation.

---

## Day 2 — Existing Application Must Remain the Base

Reuse the existing e-commerce frontend and backend.
Backend for the new RAG feature: FastAPI inside the existing backend.
Frontend for the new RAG feature: ReactJS inside the existing frontend.
Reuse existing authentication and authorization.
Reuse the existing product/catalog information where needed.
Do not rebuild the e-commerce application.
Do not create a second e-commerce database for normal store data.

---

## Day 2 — Documents, Chunking, Embeddings & FAISS

SDLC Phase: Learning
Teach me the document-processing concepts needed for this project: document ingestion, cleaning text, chunking, chunk size, overlap, embeddings, embedding models, similarity search, metadata, vector indexes and FAISS. Explain why each one is needed for product manuals and show a simple example of one manual becoming chunks and then embeddings. Do not build the project yet and do not create permanent files.
Checkpoint: Confirm the concepts are understood before starting implementation.

---

## Day 3 — Agentic RAG Goal

Allow the user to ask natural-language questions about products and their approved manuals.
Use FAISS as the vector database for document retrieval.
Use embeddings to represent document chunks and user questions.
Use an agentic flow to decide how to search the knowledge base and when another retrieval attempt is needed.
Answer only from retrieved and approved document content.
Say that the information was not found when the documents do not support the answer.
Do not invent product instructions, specifications, warranty conditions or safety guidance.

---

## Day 3 — Agentic Retrieval, Grounding & RAG Evaluation

SDLC Phase: Learning
Teach me the concepts needed to build reliable Agentic RAG: query understanding, query rewriting, retrieval, retrieval quality, relevance checking, retrying retrieval, context selection, grounded answers, citations/source references, hallucination prevention, prompt injection, and basic RAG evaluation. Also explain the role of LangChain and LangGraph in this project in simple terms. Do not build the project yet and do not create permanent project files.
Checkpoint: Confirm the concepts are understood before starting implementation.

---

## Day 4 — Main Agentic RAG Flow

User↓ReactJS Chat UI↓FastAPI /rag/ask↓RAG Agent├── Understand Question├── Decide Search Need├── Query Rewrite / Search Plan├── FAISS Retrieval├── Context Check├── Retrieve Again When Needed└── Grounded Answer↓User

---

## Day 4 — Existing App Inspection & BRD

SDLC Phase: Initiation & Requirements
Inspect the existing e-commerce application without changing anything. Identify the ReactJS frontend, FastAPI/backend location, authentication, product/catalog flow, existing product details, and the best place to add the Agentic RAG assistant. Also identify where product manuals or other approved knowledge documents will be stored and how they can be added or updated. Then create only BRD.md with the project goal, users, in-scope questions, out-of-scope questions, approved document types, basic success criteria and what existing features must not be changed. Do not create any other documentation files or build the RAG feature yet. Test that the inspection is correct and tell me what I need to verify.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 5 — Permanent Project Documents Only

Keep only these project documents after implementation:
BRD.md
UI_UX.md
ARCHITECTURE.md
CODING.md
TESTING.md
DEPLOYMENT.md
Temporary files created only for testing or debugging, such as sample JavaScript files, temporary Python scripts, generated test data, one-time index experiments, debug outputs and ad-hoc files, must be deleted after their purpose is complete. Do not create unnecessary documentation files.

---

## Day 5 — UI/UX Design

SDLC Phase: Design
Create only UI_UX.md and define a simple ReactJS user experience for the Agentic RAG assistant inside the existing e-commerce application. Keep it to one simple assistant entry point. Define the question box, ask action, loading state, answer area, source/manual reference area, no-information message, clarification message and error message. Do not redesign the existing e-commerce UI. Include how the user can ask a product question from a product page or from the assistant entry point, using the existing product context when available. Do not create any frontend code yet. Test the design against the BRD.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 6 — Non-Negotiable Rules

Reuse the existing e-commerce application.
Use FastAPI for the RAG backend integration and ReactJS for the UI.
Use FAISS as the vector database.
Use only approved product/manual documents as the knowledge source.
Do not expose secrets, API keys, access tokens or internal configuration.
Treat user input and uploaded/document content as untrusted data.
Protect against prompt injection contained in user questions or retrieved documents.
Keep answers grounded in retrieved content and clearly say when information is unavailable.
Keep the first version simple; do not add unnecessary agents or infrastructure.
One task at a time. Finish, test and verify the current task before moving forward.
Delete temporary testing/debugging files after testing.
Do not change unrelated existing e-commerce functionality.

---

## Day 6 — Agentic RAG Architecture

SDLC Phase: Design
Create only ARCHITECTURE.md for the complete Agentic RAG solution. Keep the design simple and show: ReactJS UI -> FastAPI /rag/ask -> Agentic RAG flow -> document retrieval -> FAISS -> retrieved context -> grounded answer. Also show document ingestion -> cleaning -> chunking -> embeddings -> FAISS index. Define the simple roles of the RAG agent, retrieval step and answer step, and explain where LangGraph can control the flow. Keep the architecture inside the existing application. Do not write implementation code. Test that the design is complete and does not introduce unnecessary services.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 7 — Project Context Prompt - Paste This First

I am adding an Agentic RAG feature to an EXISTING e-commerce application.The existing e-commerce application must remain the base. Do not rebuild it.Use:- Existing ReactJS frontend- Existing FastAPI/backend structure, if already present; otherwise add the RAG API inside the existing backend- Existing login/authentication- Existing product/catalog information- Approved product manuals and usage documents as the knowledge source- FAISS as the vector databaseNew feature:A simple product knowledge assistant that answers user questions from approved product manuals and related product documents.Agentic RAG flow:1. Receive the user's question.2. Understand what product/topic the user is asking about.3. Decide how to search the document knowledge base.4. Search the FAISS index.5. Check whether the retrieved content is enough.6. Search again with a better query when necessary.7. Answer only from the retrieved content.8. Say when the information is not available.Rules:- Do not invent answers.- Do not use unrelated web information unless explicitly added as an approved source later.- Do not expose secrets or internal prompts.- Protect against prompt injection from the user and from retrieved documents.- Keep responses simple and useful.- Use FastAPI for the backend and ReactJS for the frontend.- Use FAISS for vector search.- Keep only BRD.md, UI_UX.md, ARCHITECTURE.md, CODING.md, TESTING.md and DEPLOYMENT.md as permanent project documents.- Any temporary test/debug script or temporary file must be deleted after testing.- Do one clear task at a time.I am a beginner. Keep the explanation simple and tell me what I need to verify after the task.

---

## Day 7 — Document Ingestion & Chunking

SDLC Phase: Development
Build the document ingestion process for approved product manuals and usage documents. Support the common document formats already available in the project, extract the text, clean obvious noise, split the text into useful chunks with a simple overlap, and attach basic metadata such as document name, product name, section and source location when available. Store the processed chunks in the simplest practical local project structure for the next step. Create only the code needed for this task. Do not build the full agent yet. Test ingestion with a small set of real manuals. Delete any temporary test scripts, sample documents or one-time debug files after testing.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 8 — Embeddings & FAISS Index Script

SDLC Phase: Development
Build the FAISS indexing script for the approved document chunks. Convert each chunk into an embedding, store the vectors in a FAISS index, and keep the metadata needed to map each vector back to its original document, product, section and chunk. Make the script easy to run again when manuals are added or updated. Use a clear local folder structure for the FAISS index and metadata. Test that the script creates the index successfully and that a sample query can retrieve relevant chunks. Do not create unnecessary files; delete temporary experiments after testing.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 8 — Master Fix Prompt

Something is not working in the current Agentic RAG task.What I was trying to do:[WRITE WHAT I TRIED]What I expected:[WRITE WHAT SHOULD HAPPEN]What actually happened:[WRITE WHAT I SAW]Error message:[PASTE THE REAL ERROR]Please find the root cause yourself and fix only the current problem. Check whether the issue is in document loading, chunking, embeddings, FAISS, retrieval, LangGraph flow, answer generation, FastAPI, ReactJS or existing application integration. Do not rebuild the e-commerce application. Do not create another vector database. Do not remove security, evaluation or observability controls. Keep the Agentic RAG flow simple. After fixing, rerun the relevant tests and tell me exactly what I need to verify. Delete any temporary debugging files after the issue is confirmed fixed.

---

## Day 9 — Retrieval Service

SDLC Phase: Development
Build a simple retrieval service that takes a user question, creates its embedding, searches the FAISS index, returns the best matching chunks and includes their metadata. Add a small configurable result limit and a simple relevance threshold so unrelated chunks are not returned unnecessarily. Do not add the LLM answer step yet. Test the retrieval using real questions from the product manuals and compare the returned chunks with what you expect to find. Delete temporary retrieval test scripts after testing.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 9 — Master Daily Checkpoint Prompt

Before I finish today's Agentic RAG task, check only the work completed today.Tell me:1. What changed?2. What is working?3. What is not working?4. Did we accidentally change any existing e-commerce feature?5. Is the data flow still using the approved documents and FAISS?6. Is the answer grounded in retrieved content?7. Are security controls still active?8. Is observability working?9. Are the relevant tests passing?10. What should I test manually?11. Can I safely move to the next task?12. Which temporary test/debug files can now be deleted?Use simple language.

---

## Day 10 — Agentic RAG Flow with LangGraph

SDLC Phase: Development
Build the Agentic RAG flow using LangGraph in a simple way. The flow should: receive the question, understand the search intent, create a search query, retrieve from FAISS, check whether the retrieved context is useful, retry retrieval once with a better query when needed, and then prepare the context for the final answer. Keep the graph small and easy to understand. Do not add extra agents or unnecessary branches. Test normal questions, vague questions and questions with no useful document match. Delete temporary test files after testing.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 11 — Grounded Answer Generation

SDLC Phase: Development
Connect the Agentic RAG flow to the answer-generation step. The final response must use only the retrieved manual content, avoid inventing facts, clearly say when the documents do not contain the answer, and provide a simple source reference such as document name and section when available. For questions that need clarification, ask a short clarification question instead of guessing. Test at least 10 real product-manual questions and compare every answer with the source content. Delete temporary evaluation scripts or debug files after testing.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 12 — FastAPI Backend Integration

SDLC Phase: Development / Integration
Integrate the Agentic RAG feature into the existing FastAPI backend. Add only the endpoint needed for the assistant, such as POST /rag/ask, reuse the existing authentication, pass optional product context when available, connect the endpoint to the LangGraph flow, and return a clean response containing the answer and safe source references. Do not change existing e-commerce APIs. Test authorized access, unauthorized access, normal questions, no-data questions and errors. Delete temporary API test scripts after testing.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 13 — RAG Evaluation & Testing

SDLC Phase: Testing / QA
Create and maintain the main TESTING.md with a simple repeatable evaluation plan for the Agentic RAG feature. Test product specifications, usage instructions, troubleshooting, compatibility, warranty-related questions when the documents contain them, no-data questions, ambiguous questions, irrelevant questions, prompt-injection cases and incorrect assumptions. Check retrieval relevance, answer correctness, grounding, source references, no-data behavior and the existing runtime security behavior. Use Langfuse later in the plan for tracing and evaluation results. Create only the minimum temporary test script needed to run the checks, execute it, record the results in the project, and then delete the temporary script. Keep TESTING.md as the permanent testing document.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 14 — ReactJS UI Integration

SDLC Phase: Integration / UAT
Add the Agentic RAG assistant to the existing ReactJS frontend using the UI_UX.md design. Keep the UI simple and add only the required assistant entry point. Connect it to POST /rag/ask, show loading, answer, safe source references, no-data, clarification and error states, and pass product context when the user asks from a product page. Do not redesign unrelated screens. Test the assistant in the browser with real product questions. Delete temporary frontend test files and dummy components after testing.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 15 — Full End-to-End Testing

SDLC Phase: Testing / QA
Run a full browser-to-database/index end-to-end test of the Agentic RAG feature: Login -> ReactJS assistant -> FastAPI -> LangGraph -> retrieval -> FAISS -> grounded answer -> source reference -> user. Test multiple products, normal questions, no-data questions, ambiguous questions, prompt-injection attempts and slow/error cases. Verify that existing login, product browsing, cart, checkout and order flows still work. Fix only issues related to this feature. Remove temporary testing scripts and debug files after the tests are complete.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.
WEEK 4 - LANGFUSE, DEPLOYMENT & FINAL RELEASE
Week 4 Prerequisite: Complete Days 1-15 first. Day 16 is the Langfuse learning day and Day 17 is the Langfuse implementation day. Do not move ahead until the Langfuse concepts are understood.

---

## Day 16 — Langfuse Basics

SDLC Phase: Learning / Langfuse
For today, do not change the project code.Teach me the basic Langfuse concepts I need for this Agentic RAG project:- What Langfuse is- Why Langfuse is useful for RAG observability and evaluation- What a trace is- What an observation/span is in simple terms- How retrieval, embedding and model steps can appear in a RAG trace- What an evaluation score means- What a dataset/evaluation test case is- How prompt versions can be managed in Langfuse- How prompt-injection and retrieved-document security tests can be monitored and evaluated using Langfuse- What Langfuse does not replace, such as the application's normal authentication and runtime safety checksUse simple examples from our product-manual RAG assistant. Do not create files, do not install packages and do not write project code. End with a short 5-question check and then stop.
Checkpoint: Complete this learning day, confirm the concepts are understood, and wait before moving to the implementation day.

---

## Day 17 — Langfuse Implementation: Observability, Evaluation & Security Monitoring

SDLC Phase: SDLC - Implementation / Observability / Evaluation
Now implement Langfuse for the Agentic RAG project.Use Langfuse to cover the observability, evaluation and AI-security monitoring work that we previously kept as separate tasks.Implement:- Trace each request from FastAPI through the Agentic RAG flow, model/query steps, embedding/retrieval step, FAISS search and final answer- Capture retrieved-chunk count, timings, retries, no-data and success/failure information- Create a small repeatable RAG evaluation set for product-manual questions- Record evaluation results for retrieval relevance, answer correctness, grounding and source references- Keep the final PASS/FAIL summary in TESTING.md- Keep the important prompts/version information manageable through Langfuse where practical- Trace and evaluate user prompt-injection and malicious-document test cases so we can see whether the existing runtime safeguards worked- Do not log secrets, access tokens or unnecessary personal informationImportant: Langfuse is being used for tracing, prompt management and evaluation. It is not a replacement for the application's authentication or runtime prompt/document safety checks. Keep those controls in the application.Test normal, no-data, failed and security-related RAG requests. Review the traces and evaluation results in Langfuse. Delete temporary test/debug files after testing. Do not create a separate observability, evaluation or security document.
Checkpoint: Confirm Langfuse traces, evaluations and security-monitoring results are visible and useful before moving to deployment.

---

## Day 18 — Deployment

SDLC Phase: Deployment
Create only DEPLOYMENT.md and define the deployment steps for the Agentic RAG feature with FastAPI backend, ReactJS frontend and FAISS files/index. Include environment configuration, where the FAISS index and metadata should live, how the backend starts, how the frontend connects to the API, how to rebuild the index after a document update, and the basic security checks before release. Keep the deployment simple and suitable for the existing application environment. Perform a deployment-style test or local production test and remove temporary deployment files after testing.
Checkpoint: Test the completed work and confirm it is stable before moving to the next day.

---

## Day 19 — Final QA & Release Preparation

SDLC Phase: Testing / Release Preparation
Run one final QA pass of the Agentic RAG feature before release.Verify:- ReactJS assistant works- FastAPI /rag/ask works- LangGraph flow works- FAISS retrieval returns relevant content- Answers are grounded in approved manuals- Source references are shown correctly- No-data and unclear questions are handled correctly- Prompt-injection cases are handled safely- Langfuse traces are available- Langfuse evaluation results are available- Existing e-commerce features still work- Temporary test/debug files are removedFix only issues found during this final QA pass. Do not create new features or new permanent documentation.
Checkpoint: Complete the final QA pass and wait before the final handover.

---

## Day 20 — Final Review and Handover

SDLC Phase: SDLC - Final Handover
Perform a final review of the completed Agentic RAG project.Confirm:- BRD.md is complete- UI_UX.md matches the final UI- ARCHITECTURE.md matches the implementation- CODING.md contains the final useful code details- TESTING.md contains the final PASS/FAIL results- DEPLOYMENT.md matches the actual deployment- Langfuse traces can be reviewed- Langfuse evaluation results can be reviewed- Existing runtime safety controls remain active- Temporary files are removed- No unnecessary permanent documents were created- Existing e-commerce functionality still worksIf everything is complete, give me AGENTIC RAG INTEGRATION COMPLETE and stop.
Checkpoint: The Agentic RAG project is complete, tested, observed and ready for handover.

---

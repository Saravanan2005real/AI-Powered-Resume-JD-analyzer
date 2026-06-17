# CareerDNA AI (AI-Powered Resume JD Analyzer)

An advanced, intelligent resume and job description (JD) matching system powered by Groq and Llama 3 AI.

## Project Overview

This tool helps recruiters and job seekers analyze how well a resume matches a job description (JD) by extracting semantic features, identifying keyword matches, finding missing requirements, and providing scoring and tailored improvement suggestions.

## System Architecture

CareerDNA AI follows a modern decoupled client-server architecture.

### High-Level Flow
1. **Client (Next.js)**: The user uploads a Job Description and up to 5 Resumes through a premium React frontend. The files are packaged as `multipart/form-data` and sent to the backend.
2. **Server (Express.js)**: 
   - Files are temporarily saved.
   - Text is extracted from the documents using dedicated parser services.
   - A detailed prompt containing the parsed text is sent to the **Groq AI Service**.
3. **AI Engine (Groq / Llama-3.3-70b)**: 
   - Analyzes each candidate based on evidence (skills, projects, education).
   - If multiple candidates exist, performs a comparative ranking analysis.
4. **Processing & Scoring**: The backend calculates a final weighted match score and packages the comprehensive JSON response.
5. **Report Generation**: Users can request downloadable PDF reports, which the backend generates and serves individually or as a ZIP archive.

For a comprehensive breakdown of the frontend, backend, AI pipeline, and data flow, please refer to [design.md](./design.md).

## Features

- **Resume Upload & Parsing**: Supports PDF/DOCX resumes.
- **JD Parsing**: Raw text input or file upload.
- **Gemini AI Matching Engine**: Leverages LLMs to evaluate compatibility beyond just keyword searching (uses semantic matching).
- **Match Score & Report**: Generates a detailed match percentage, highlight missing key skills, and suggests edits to the resume.

## Getting Started

### Installation (Coming Soon)
Ensure you have the required prerequisites:
- Python 3.10+
- Streamlit
- Google GenAI SDK

Stay tuned for implementation steps.

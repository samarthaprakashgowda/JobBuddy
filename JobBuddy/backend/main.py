from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from skill_extractor import extract_skills
from pydantic import BaseModel
from job_matcher import match_resume_to_job
from job_service import ( get_jobs, search_jobs,)
import os
from resume_analyzer import analyze_resume_text

app = FastAPI(title="JobBuddy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str

class JobSearchRequest(BaseModel):
    role: str
    resume_text: str


@app.get("/")
def root():
    return {"message": "JobBuddy API is running"}

@app.post("/jobs")
def get_jobs_endpoint(data: JobMatchRequest):

    jobs = get_jobs()

    results = []

    for job in jobs:

        match = match_resume_to_job(
            data.resume_text,
            job["description"]
        )

        results.append({
            "company": job["company"],
            "role": job["role"],
            "description": job["description"],
            "matchScore": match["match_score"],
            "url": f"https://{job['company'].lower()}.com"
        })

    return sorted(
        results,
        key=lambda x: x["matchScore"],
        reverse=True
    )

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text

    skills = extract_skills(text)

    return {
        "filename": file.filename,
        "resume_text": text,
        "skills": skills
    }

@app.post("/match-job")
def match_job(data: JobMatchRequest):

    result = match_resume_to_job(
        data.resume_text,
        data.job_description
    )

    return result

@app.post("/analyze-resume")
def analyze_resume(data: JobMatchRequest):

    return analyze_resume_text(
        data.resume_text
    )

@app.post("/search-jobs")
def search_jobs_endpoint(data: JobSearchRequest):

    jobs = search_jobs(data.role)

    results = []

    for job in jobs:

        match = match_resume_to_job(
            data.resume_text,
            job["description"]
        )

        job["matchScore"] = match["match_score"]

        results.append(job)

    return sorted(
    results,
    key=lambda x: x["matchScore"],
    reverse=True
)
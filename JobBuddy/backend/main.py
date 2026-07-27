from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from skill_extractor import extract_skills
from pydantic import BaseModel
from job_matcher import match_resume_to_job
import os

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


@app.get("/")
def root():
    return {"message": "JobBuddy API is running"}


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
        "text_preview": text[:500],
        "skills": skills
    }

@app.post("/match-job")
def match_job(data: JobMatchRequest):

    result = match_resume_to_job(
        data.resume_text,
        data.job_description
    )

    return result

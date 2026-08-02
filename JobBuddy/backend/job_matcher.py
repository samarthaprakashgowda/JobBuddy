from skill_extractor import extract_skills
from recommendations import generate_recommendations


def match_resume_to_job(resume_text, job_description):
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)

    print("RESUME SKILLS:", resume_skills)
    print("JOB DESCRIPTION:", job_description)
    print("JOB SKILLS:", job_skills)

    
    matching_skills = [
        skill for skill in job_skills
        if skill in resume_skills
    ]

    missing_skills = [
        skill for skill in job_skills
        if skill not in resume_skills
    ]

    if len(job_skills) == 0:
        score = 0
    else:
        score = int(
            (len(matching_skills) / len(job_skills)) * 100
        )

    return {
        "match_score": score,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "recommendations": generate_recommendations(missing_skills)
    }

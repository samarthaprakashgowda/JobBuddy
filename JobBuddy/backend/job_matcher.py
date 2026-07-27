from skill_extractor import extract_skills


def match_resume_to_job(resume_text, job_description):
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)

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
        "missing_skills": missing_skills
    }

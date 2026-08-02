import re

from skill_extractor import extract_skills


def analyze_resume_text(resume_text: str):

    skills = extract_skills(resume_text)

    score = 50

    score += min(len(skills) * 2, 30)

    if len(resume_text) > 3000:
        score += 10

    achievements = re.findall(
        r"\d+%|\d+\+|\$\d+",
        resume_text
    )

    if achievements:
        score += 10

    score = min(score, 100)

    strengths = []

    improvements = []

    if len(skills) >= 8:
        strengths.append(
            "Strong technical skill coverage"
        )
    else:
        improvements.append(
            "Add more technical keywords"
        )

    if "AWS" in skills or "Azure" in skills:
        strengths.append(
            "Cloud experience detected"
        )

    if achievements:
        strengths.append(
            "Quantified achievements detected"
        )
    else:
        improvements.append(
            "Add measurable business impact"
        )
    if "React" in skills:
        strengths.append(
            "Modern frontend experience"
        )

    if len(resume_text) < 2000:
        improvements.append(
            "Expand project and achievement details"
        )

    if not improvements:
        improvements.append(
            "Tailor resume keywords for each application"
        )

        improvements.append(
            "Continue highlighting leadership and business impact"
        )

    return {
        "ats_score": score,
        "strengths": strengths,
        "improvements": improvements,
    }
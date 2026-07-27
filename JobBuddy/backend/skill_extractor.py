SKILLS = [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "FastAPI",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "Linux",
    "Terraform",
    "OpenAI",
    "Machine Learning",
    "AI"
]


def extract_skills(text: str):
    found_skills = []

    text_lower = text.lower()

    for skill in SKILLS:
        if skill.lower() in text_lower:
            found_skills.append(skill)

    return sorted(list(set(found_skills)))

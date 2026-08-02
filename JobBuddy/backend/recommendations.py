def generate_recommendations(missing_skills):
    recommendations = []

    for skill in missing_skills:
        recommendations.append(
            f"Consider adding experience with {skill} if applicable."
        )

    return recommendations
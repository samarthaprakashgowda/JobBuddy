from jobs_data import JOBS
from real_jobs_service import get_real_jobs

def get_jobs():
    return JOBS

def search_jobs(search_term: str):

    terms = [
        term.strip().lower()
        for term in search_term.split(",")
        if term.strip()
    ]

    jobs_to_search = get_real_jobs(search_term)

    return [
        job
        for job in jobs_to_search
        if any(
            term in job["role"].lower()
            or term in job["company"].lower()
            or term in job["description"].lower()
            for term in terms
        )
    ]


import requests

GREENHOUSE_COMPANIES = [
    ("vercel", "Vercel"),
    ("stripe", "Stripe"),
    ("notion", "Notion"),
    ("airbnb", "Airbnb"),
    ("datadog", "Datadog"),
]

ASHBY_COMPANIES = [
    ("openai", "OpenAI"),
    ("anthropic", "Anthropic"),
    ("linear", "Linear"),
    ("ramp", "Ramp"),
    ("mercury", "Mercury"),
]

def parse_location(location: str):

    if not location:
        return {
            "country": "Unknown",
            "state": "Unknown",
            "isRemote": False,
        }

    loc = location.lower()

    is_remote = "remote" in loc

    country = "International"
    state = "Unknown"

    if "usa" in loc or "united states" in loc:
        country = "USA"

    STATE_MAP = {
        "ca": "California",
        "ny": "New York",
        "tx": "Texas",
        "wa": "Washington",
        "ma": "Massachusetts",
        "fl": "Florida",
    }

    for abbr, full_name in STATE_MAP.items():
        if f", {abbr}" in loc:
            state = full_name
            country = "USA"
        break

    return {
        "country": country,
        "state": state,
        "isRemote": is_remote,
    }

def normalize_job(
    id,
    company,
    role,
    location,
    description,
    url,
    source,
):
    parsed = parse_location(location)
    return {
        "id": id,
        "company": company,
        "role": role,
        "location": location,
        "country": parsed["country"],
        "state": parsed["state"],
        "isRemote": parsed["isRemote"],

        "description": description,
        "url": url,
        "source": source,
    }

def fetch_greenhouse_company(
    company_slug,
    company_name,
):
    try:
        response = requests.get(
            f"https://boards-api.greenhouse.io/v1/boards/{company_slug}/jobs"
        )

        if response.status_code != 200:
            return []

        data = response.json()

        jobs = []

        for job in data.get("jobs", []):

            jobs.append(
                normalize_job(
                    job.get("id"),
                    company_name,
                    job.get("title", ""),
                    job.get("location", {})
                       .get("name", "Unknown"),
                    job.get("title", ""),
                    job.get("absolute_url", ""),
                    "Greenhouse",
                )
            )

        return jobs

    except Exception:
        return []

def fetch_greenhouse_jobs():

    jobs = []

    for slug, name in GREENHOUSE_COMPANIES:
        jobs.extend(
            fetch_greenhouse_company(
                slug,
                name,
            )
        )

    return jobs

def get_real_jobs(search_term: str):

    jobs = fetch_greenhouse_jobs() + fetch_ashby_jobs()

    terms = [
        term.strip().lower()
        for term in search_term.split(",")
        if term.strip()
    ]

    return [
        job
        for job in jobs
        if any(
            term in job["role"].lower()
            or term in job["company"].lower()
            or term in job["description"].lower()
            for term in terms
        )
    ]

def fetch_ashby_company(
    company_slug,
    company_name,
):
    try:
        response = requests.get(
            f"https://api.ashbyhq.com/posting-api/job-board/{company_slug}"
        )

        if response.status_code != 200:
            return []

        data = response.json()

        jobs = []

        for job in data.get("jobs", []):

            jobs.append(
                normalize_job(
                    job.get("id"),
                    company_name,
                    job.get("title", ""),
                    job.get("location", "Unknown"),
                    job.get("descriptionPlain", ""),
                    job.get("jobUrl", ""),
                    "Ashby",
                )
            )

        return jobs

    except Exception:
        return []

def fetch_ashby_jobs():

    jobs = []

    for slug, name in ASHBY_COMPANIES:

        jobs.extend(
            fetch_ashby_company(
                slug,
                name,
            )
        )

    return jobs

if __name__ == "__main__":

    print("STARTING TESTS")

    try:
        greenhouse_jobs = fetch_greenhouse_jobs()
        print("Greenhouse Jobs:", len(greenhouse_jobs))
    except Exception as e:
        print("Greenhouse Error:", e)

    try:
        ashby_jobs = fetch_ashby_jobs()
        print("Ashby Jobs:", len(ashby_jobs))
    except Exception as e:
        print("Ashby Error:", e)

    print("FINISHED")
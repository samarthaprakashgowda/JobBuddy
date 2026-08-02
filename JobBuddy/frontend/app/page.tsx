"use client";

import DashboardCards from "@/components/dashboard/DashboardCards";
import Hero from "@/components/dashboard/Hero";
import JobMatcher from "@/components/dashboard/JobMatcher";
import JobsList from "@/components/jobs/JobsList";
import MatchResults from "@/components/dashboard/MatchResults";
import ResumeCenter from "@/components/dashboard/ResumeCenter";
import Sidebar from "@/components/shared/Sidebar";
import { useState, useEffect } from "react";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [activePage, setActivePage] = useState("Dashboard");
  const [applications, setApplications] = useState<any[]>([]);
  const [jobSearch, setJobSearch] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedState, setSelectedState] = useState("All States");
  const [remoteOnly, setRemoteOnly] = useState(false);

  const companies = [
    "All Companies",
    ...new Set(jobs.map((job) => job.company))
  ];

  const countries = [
    "All Countries",
    ...new Set(jobs.map((job) => job.country))
  ];

  const states = [
    "All States",
    ...new Set(jobs.map((job) => job.state).filter(state => state !== "Unknown"))
  ];

  const filteredJobs = jobs.filter((job) => {

    const matchesScore =
      job.matchScore >= minMatchScore;

    const matchesCompany =
      selectedCompany === "All Companies" ||
      job.company === selectedCompany;

    const matchesCountry =
      selectedCountry === "All Countries" ||
      job.country === selectedCountry;

    const matchesState =
      selectedState === "All States" ||
      job.state === selectedState;

    const matchesRemote =
      !remoteOnly || job.isRemote;

    return (
      matchesScore &&
      matchesCompany &&
      matchesCountry &&
      matchesState &&
      matchesRemote
    );
  });

  const uploadResume = async () => {
    console.log("resumeFile:", resumeFile);
    if (!resumeFile) {
      alert("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", resumeFile);

    const response = await fetch(
      "http://127.0.0.1:8000/upload-resume",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log("Upload response:", data);

    setResumeText(data.resume_text);
    console.log("resume_text:", data.resume_text);
    setExtractedSkills(data.skills);
    await loadJobs(data.resume_text);

    localStorage.setItem(
      "resumeText",
      data.resume_text
    );

    localStorage.setItem(
      "skills",
      JSON.stringify(data.skills)
    );
  };

  const matchJob = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/match-job",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
          }),
        }
      );

      console.log("STATUS:", response.status);

      const data = await response.json();

      console.log("DATA:", data);

      setResult(data);
    } catch (error) {
      console.error("ERROR:", error);
    }
  };

  const analyzeResume = async () => {

    if (!resumeText) {
      alert("Upload a resume first");
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:8000/analyze-resume",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: "",
        }),
      }
    );

    const data = await response.json();

    setAnalysis(data);
  };

  const loadJobs = async (resume: string) => {
    const response = await fetch(
      "http://127.0.0.1:8000/jobs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resume,
          job_description: "",
        }),
      }
    );

    const data = await response.json();

    setJobs(data);
  };

  const searchJobs = async () => {
    setLoadingJobs(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/search-jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: jobSearch,
            resume_text: resumeText,
          }),
        }
      );

      const data = await response.json();

      setJobs(data);
    } finally {
      setLoadingJobs(false);
    }
  };

  const saveApplication = (job: any) => {
    const alreadyApplied =
      applications.some(
        (app) =>
          app.company === job.company &&
          app.role === job.role
      );

    if (alreadyApplied) {
      return;
    }

    const newApplications = [
      ...applications,
      {
        ...job,
        status: "Applied",
      },
    ];

    setApplications(newApplications);

    localStorage.setItem(
      "applications",
      JSON.stringify(newApplications)
    );
  };

  const analyzeJobMatch = async (job: any) => {
    const response = await fetch(
      "http://127.0.0.1:8000/match-job",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: job.description,
        }),
      }
    );

    const data = await response.json();

    console.log("Job Match Analysis:", data);
    setResult(data);

    setActivePage("Dashboard");
  };

  useEffect(() => {
    const savedResumeText = localStorage.getItem("resumeText");
    const savedSkills = localStorage.getItem("skills");
    const savedApplications = localStorage.getItem("applications");

    if (savedApplications) {
      setApplications(
        JSON.parse(savedApplications)
      );
    }

    if (savedResumeText) {
      setResumeText(savedResumeText);
    }

    if (savedSkills) {
      setExtractedSkills(JSON.parse(savedSkills));
    }
  }, []);


  return (
    <main className="h-screen bg-slate-100 grid grid-cols-[280px_1fr]">
      <aside className="h-screen">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage} />
      </aside>

      <div className="h-screen p-8 overflow-y-auto">

        {activePage === "Jobs" && (
          <div>

            <h1 className="text-4xl font-bold mb-6">
              Jobs
            </h1>

            <div className="flex flex-wrap gap-3 mb-6">

              <input
                type="text"
                value={jobSearch}
                onChange={(e) =>
                  setJobSearch(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchJobs();
                  }
                }}
                placeholder="Search for jobs..."
                className="flex-1 max-w-md border rounded-lg p-3"
              />

              <button
                onClick={searchJobs}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Search
              </button>
              <select
                value={minMatchScore}
                onChange={(e) =>
                  setMinMatchScore(Number(e.target.value))
                }
                className="border rounded-lg p-3"
              >
                <option value={0}>All Matches</option>
                <option value={70}>70% and above</option>
                <option value={85}>85% and above</option>
              </select>

              <select
                value={selectedCompany}
                onChange={(e) =>
                  setSelectedCompany(e.target.value)
                }
                className="border rounded-lg p-3"
              >
                {companies.map((company) => (
                  <option
                    key={company}
                    value={company}
                  >
                    {company}
                  </option>
                ))}
              </select>

              <select
                value={selectedCountry}
                onChange={(e) =>
                  setSelectedCountry(e.target.value)
                }
                className="border rounded-lg p-3"
              >
                {countries.map((country) => (
                  <option
                    key={country}
                    value={country}
                  >
                    {country}
                  </option>
                ))}
              </select>

              <select
                value={selectedState}
                onChange={(e) =>
                  setSelectedState(e.target.value)
                }
                className="border rounded-lg p-3"
              >
                {states.map((state) => (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2 px-3">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) =>
                    setRemoteOnly(e.target.checked)
                  }
                />
                Remote
              </label>

            </div>

            {loadingJobs && (
              <div className="text-slate-600 mb-4">
                <p>Searching jobs...</p>
              </div>
            )}

            {!loadingJobs && filteredJobs.length > 0 && (
              <p className="text-slate-600 mb-4">
                {filteredJobs.length} jobs found
              </p>
            )}

            {!loadingJobs && filteredJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <p className="text-slate-600">
                  Search for jobs to get started.
                </p>
              </div>
            ) : (
              <JobsList
                jobs={filteredJobs}
                saveApplication={saveApplication}
                analyzeJobMatch={analyzeJobMatch}
              />
            )}

          </div>
        )}

        {activePage === "Applications" && (
          <div>

            <h1 className="text-4xl font-bold mb-6">
              Applications
            </h1>

            <div className="grid gap-4">

              {applications.map((app, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-6"
                >
                  <h2 className="text-xl font-bold">
                    {app.role}
                  </h2>

                  <p className="text-slate-600">
                    {app.company}
                  </p>

                  <span className="inline-block mt-3 bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    {app.status}
                  </span>
                </div>
              ))}

            </div>

          </div>
        )}

        {activePage === "Dashboard" && (
          <>
            {/* Hero */}

            <Hero
              uploadResume={uploadResume}
              analyzeResume={analyzeResume}
            />

            {/* Dashboard Cards */}

            <DashboardCards
              resumeText={resumeText}
              skillsCount={extractedSkills.length}
              matchScore={result?.match_score}
              atsScore={analysis?.ats_score}
            />

            {/* Main Content */}

            <div className="bg-white rounded-xl shadow p-6">

              <h2 className="text-2xl font-bold mb-4">
                Welcome Back
              </h2>

              <p className="text-slate-600">
                Manage your resume, discover jobs, track applications,
                and prepare for interviews using JobBuddy AI.
              </p>

            </div>

            {/* Match Results */}

            <MatchResults result={result} />

          </>
        )}

        {activePage === "Resume" && (
          <div>

            <h1 className="text-4xl font-bold mb-6">
              Resume
            </h1>

            <ResumeCenter
              setResumeFile={setResumeFile}
              uploadResume={uploadResume}
              analyzeResume={analyzeResume}
              extractedSkills={extractedSkills}
            />
            {analysis && (
              <div className="mt-6 bg-white rounded-xl shadow p-6">

                <h2 className="text-2xl font-bold mb-4">
                  ATS Analysis
                </h2>

                <p className="text-lg font-semibold mb-4">
                  ATS Score: {analysis.ats_score}
                </p>

                <div className="grid md:grid-cols-2 gap-6">

                  <div>
                    <h3 className="font-bold mb-2">
                      Strengths
                    </h3>

                    <ul>
                      {analysis?.strengths?.map(
                        (item: string) => (
                          <li key={item}>
                            ✅ {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">
                      Improvements
                    </h3>

                    <ul>
                      {analysis?.improvements?.map(
                        (item: string) => (
                          <li key={item}>
                            ⚡ {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {activePage === "Interview" && (
          <div>

            <h1 className="text-4xl font-bold mb-6">
              Interview Prep
            </h1>

            <div className="bg-white rounded-xl shadow p-6">

              <h2 className="text-2xl font-bold mb-4">
                Frontend Interview Questions
              </h2>

              <ul className="space-y-3">

                <li>
                  Explain React reconciliation.
                </li>

                <li>
                  What are micro-frontends?
                </li>

                <li>
                  Explain useEffect lifecycle.
                </li>

                <li>
                  Difference between CSR and SSR.
                </li>

                <li>
                  How would you optimize a React application?
                </li>

              </ul>

            </div>

          </div>
        )}
      </div>
    </main>
  );
}
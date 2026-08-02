interface Job {
  id: string;
  company: string;
  role: string;
  description: string;
  matchScore: number;
  url: string;
  source: string;
  location: string;

  country: string;
  state: string;
  isRemote: boolean;
}

interface JobsListProps {
  jobs: Job[];
  saveApplication: (job: Job) => void;
  analyzeJobMatch: (job: Job) => void;
}

export default function JobsList({
  jobs,
  saveApplication,
  analyzeJobMatch
}: JobsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <div
          key={job.id ?? `${job.company}-${job.role}`}
          className="bg-white rounded-xl shadow p-6 h-full flex flex-col"
        >
          <div className="mb-4">
            <span
              className={`
      px-3 py-1 rounded-full text-sm font-semibold
      ${job.matchScore >= 85
                  ? "bg-green-100 text-green-700"
                  : job.matchScore >= 70
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }
    `}
            >
              🎯 {job.matchScore}% Match
            </span>
            <span className="ml-2 inline-block bg-slate-100 bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
              {job.company}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {job.role}
          </h2>

          <p className="text-sm text-slate-500">
            Source: {job.source}
          </p>

          <p className="text-sm text-slate-500">
            Id: {job.id}
          </p>

          <p className="text-sm text-slate-600">
            📍 {job.location}
          </p>

          <div className="mt-auto pt-4">
            <button
              onClick={() => {
                saveApplication(job);
                window.open(job.url, "_blank");
              }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Apply
            </button>
            <button
              onClick={() => analyzeJobMatch(job)}
              className="mt-2 ml-2 border border-blue-600 text-blue-600 bg-white px-4 py-2 rounded hover:bg-blue-50 transition"
            >
              Analyze Match
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
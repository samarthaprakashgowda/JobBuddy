interface JobMatcherProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  matchJob: () => void;
}

export default function JobMatcher({
  jobDescription,
  setJobDescription,
  matchJob,
}: JobMatcherProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        Job Matcher
      </h2>

      <textarea
        placeholder="Paste Job Description"
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
        className="w-full border rounded p-3 h-64"
      />

      <button
        onClick={matchJob}
        className="mt-4 bg-blue-600 text-white px-5 py-3 rounded"
      >
        Match Job
      </button>
    </div>
  );
}

interface DashboardCardsProps {
  resumeText: string;
  skillsCount: number;
  matchScore?: number;
  atsScore?: number;
}

export default function DashboardCards({
  resumeText,
  skillsCount,
  matchScore,
  atsScore,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-slate-500 text-sm">
          Resume Status
        </h3>

        <p className="text-2xl font-bold mt-2">
          {resumeText ? "✅ Ready" : "❌ Missing"}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-slate-500 text-sm">
          Skills Found
        </h3>

        <p className="text-3xl font-bold mt-2">
          {skillsCount}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-slate-500 text-sm">
          Match Score
        </h3>

        <p className="text-3xl font-bold mt-2">
          {matchScore ?? "--"}%
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-slate-500 text-sm">
          ATS Score
        </h3>

        <p className="text-3xl font-bold mt-2">
          {atsScore ?? "--"}
        </p>
      </div>

    </div>
  );
}
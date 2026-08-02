interface MatchResultsProps {
  result: any;
}

export default function MatchResults({
  result,
}: MatchResultsProps) {
  if (!result) return null;

  return (
    <div className="mt-8 bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold mb-4">
        Job Match Results
      </h2>

      <p className="text-lg font-semibold mb-6">
        Match Score: {result.match_score}%
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        <div>
          <h3 className="font-bold mb-2">
            Matching Skills
          </h3>

          <ul>
            {result.matching_skills?.map(
              (skill: string) => (
                <li key={skill}>
                  ✅ {skill}
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2">
            Missing Skills
          </h3>

          <ul>
            {result.missing_skills?.map(
              (skill: string) => (
                <li key={skill}>
                  ⚠️ {skill}
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2">
            Recommendations
          </h3>

          <ul>
            {result.recommendations?.map(
              (item: string) => (
                <li key={item}>
                  • {item}
                </li>
              )
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}
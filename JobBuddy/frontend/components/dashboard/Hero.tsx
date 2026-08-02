interface HeroProps {
  uploadResume: () => void;
  analyzeResume: () => void;
}

export default function Hero({
  uploadResume,
  analyzeResume,
}: HeroProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-8 shadow-lg">
      <h1 className="text-5xl font-bold">
        JobBuddy AI
      </h1>

      <p className="mt-3 text-lg text-blue-100">
        Find jobs. Optimize resumes. Land interviews.
      </p>

      <div className="mt-6">
        <p className="text-white">
          Upload your resume below to get started.
        </p>
      </div>
    </div>
  );
}
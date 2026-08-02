"use client";

import { useState } from "react";

interface ResumeCenterProps {
  setResumeFile: (file: File | null) => void;
  uploadResume: () => void;
  analyzeResume: () => void;
  extractedSkills: string[];
}

export default function ResumeCenter({
  setResumeFile,
  uploadResume,
  analyzeResume,
  extractedSkills,
}: ResumeCenterProps) {
  const [selectedFileName, setSelectedFileName] =
    useState("");

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        Resume Center
      </h2>

      <label className="cursor-pointer block mb-4">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-600 transition">

          <p className="font-semibold">
            Upload Resume
          </p>

          <p className="text-sm text-slate-500 mt-2">
            {selectedFileName ||
              "Click here to select your PDF resume"}
          </p>

        </div>

        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file =
              e.target.files?.[0] || null;

            console.log(
              "Selected file:",
              file
            );

            setResumeFile(file);

            if (file) {
              setSelectedFileName(
                file.name
              );
            }
          }}
        />
      </label>

      <div className="flex gap-3 mb-6">

        <button
          onClick={uploadResume}
          disabled={!selectedFileName}
          className={`px-4 py-2 rounded text-white ${
            selectedFileName
              ? "bg-green-600 hover:bg-green-700"
              : "bg-slate-400 cursor-not-allowed"
          }`}
        >
          Upload Resume
        </button>

        <button
          onClick={analyzeResume}
          className="border border-blue-600 text-blue-600 bg-white px-4 py-2 rounded hover:bg-blue-50 transition"
        >
          ATS Analysis
        </button>

      </div>

      <h3 className="font-bold mb-3">
        Detected Skills
      </h3>

      <div className="flex flex-wrap gap-2">

        {extractedSkills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}

      </div>
    </div>
  );
}
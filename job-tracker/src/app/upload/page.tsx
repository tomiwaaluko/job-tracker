"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { supabase } from "~/utils/supabaseClient";

interface ParsedJobData {
  company: string;
  role: string;
  status: string;
  date: string;
}

interface ParseScreenshotResponse {
  content?: string;
  error?: string;
}

export default function UploadPage() {
  const { status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [parsedData, setParsedData] = useState<ParsedJobData | null>(null);
  const [parsing, setParsing] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "",
    date: "",
  });
  const [errors, setErrors] = useState({
    company: false,
    role: false,
    status: false,
    date: false,
  });

  const parseScreenshot = async (
    imageUrl: string,
  ): Promise<ParseScreenshotResponse> => {
    const res = await fetch("/api/parse-screenshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });

    const data = (await res.json()) as ParseScreenshotResponse;
    console.log("Parsed GPT Output:", data.content);
    return data;
  };

  const handleManualParse = async () => {
    if (!url) return;

    setParsing(true);
    try {
      const result = await parseScreenshot(url);
      if (result.content) {
        try {
          const parsedJobData = JSON.parse(result.content) as ParsedJobData;
          setParsedData(parsedJobData);
          setFormData({
            company: parsedJobData.company || "",
            role: parsedJobData.role || "",
            status: parsedJobData.status?.toLowerCase() ?? "",
            date: parsedJobData.date || "",
          });
        } catch (parseError) {
          console.error("Failed to parse GPT response:", parseError);
        }
      }
    } catch (parseError) {
      console.error("Failed to parse screenshot:", parseError);
    } finally {
      setParsing(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("screenshots")
      .upload(fileName, file);

    if (error) {
      console.error(error);
    } else {
      const { data: publicUrl } = supabase.storage
        .from("screenshots")
        .getPublicUrl(fileName);
      setUrl(publicUrl.publicUrl);

      // Automatically parse the screenshot after upload
      setParsing(true);
      try {
        const result = await parseScreenshot(publicUrl.publicUrl);
        if (result.content) {
          // Try to parse the JSON from the GPT response
          try {
            const parsedJobData = JSON.parse(result.content) as ParsedJobData;
            setParsedData(parsedJobData);
            // Auto-fill the form with parsed data
            setFormData({
              company: parsedJobData.company || "",
              role: parsedJobData.role || "",
              status: parsedJobData.status?.toLowerCase() ?? "",
              date: parsedJobData.date || "",
            });
          } catch (parseError) {
            console.error("Failed to parse GPT response:", parseError);
          }
        }
      } catch (parseError) {
        console.error("Failed to parse screenshot:", parseError);
      } finally {
        setParsing(false);
      }
    }

    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { company, role, status, date } = formData;

    // Reset errors
    setErrors({
      company: false,
      role: false,
      status: false,
      date: false,
    });

    // Simple validation checks
    const newErrors = {
      company: !company,
      role: !role,
      status: !status,
      date: date ? isNaN(new Date(date).getTime()) : false,
    };

    if (newErrors.company || newErrors.role || newErrors.status || !url) {
      setErrors(newErrors);
      alert("Please fill in all required fields and upload a screenshot.");
      return;
    }

    if (
      !["applied", "interview", "offer", "rejected"].includes(
        status.toLowerCase(),
      )
    ) {
      setErrors({ ...newErrors, status: true });
      alert("Please select a valid status.");
      return;
    }

    // Optional: validate date format if provided
    if (newErrors.date) {
      alert("Please provide a valid date.");
      return;
    }

    const res = await fetch("/api/job/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        screenshotUrl: url,
      }),
    });

    const result = (await res.json()) as { error?: string };

    if (res.ok) {
      alert("Job application saved!");
      // Reset form after successful submission
      setFormData({
        company: "",
        role: "",
        status: "",
        date: "",
      });
      setUrl("");
      setParsedData(null);
      setFile(null);
    } else {
      alert("Failed to save application: " + (result.error ?? "Unknown error"));
    }
  };

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Upload <span className="text-[hsl(280,100%,70%)]">Screenshot</span>
          </h1>
          <p className="max-w-md text-center text-xl">
            Please sign in to upload job applications.
          </p>
          <button
            onClick={() => signIn()}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            Sign In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Upload <span className="text-[hsl(280,100%,70%)]">Screenshot</span>
        </h1>

        <div className="flex flex-col items-center gap-8">
          <p className="max-w-md text-center text-xl">
            Upload screenshots of your job applications to track your progress.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Company Name"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className={`rounded-md px-4 py-2 text-black ${
                errors.company ? "border-2 border-red-500" : ""
              }`}
              required
            />
            <input
              type="text"
              placeholder="Role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className={`rounded-md px-4 py-2 text-black ${
                errors.role ? "border-2 border-red-500" : ""
              }`}
              required
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className={`rounded-md px-4 py-2 text-black ${
                errors.status ? "border-2 border-red-500" : ""
              }`}
              required
            >
              <option value="">Select Status</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="date"
              placeholder="Date Applied"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className={`rounded-md px-4 py-2 text-black ${
                errors.date ? "border-2 border-red-500" : ""
              }`}
            />
            <input
              type="url"
              placeholder="Screenshot URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="rounded-md px-4 py-2 text-black"
            />

            {url && !parsedData && (
              <button
                type="button"
                onClick={handleManualParse}
                disabled={parsing}
                className="rounded-md bg-green-600 px-4 py-2 font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {parsing ? "Parsing..." : "Parse Screenshot with AI"}
              </button>
            )}

            {/* File Upload Section */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Or upload a screenshot:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="rounded-md bg-white px-4 py-2 text-black"
              />
              {file && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="rounded-md bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              )}
              {url && (
                <div className="text-sm">
                  <p className="text-green-400">
                    Uploaded!{" "}
                    <a href={url} target="_blank" className="underline">
                      View
                    </a>
                  </p>
                  {parsing && (
                    <p className="text-yellow-400">
                      Parsing screenshot with AI...
                    </p>
                  )}
                  {parsedData && (
                    <p className="text-green-400">
                      ✓ Job details extracted and auto-filled!
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={
                !formData.company ||
                !formData.role ||
                !formData.status ||
                uploading ||
                parsing
              }
              className="rounded-md bg-[hsl(280,100%,70%)] px-4 py-2 font-semibold hover:bg-[hsl(280,100%,60%)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Upload Application
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

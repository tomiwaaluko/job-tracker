import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { SignInButton } from "./sign-in-button";

interface SearchParams {
  searchParams?: {
    status?: string;
    sort?: "date_asc" | "date_desc";
  };
}

export default async function DashboardPage({ searchParams }: SearchParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Job <span className="text-[hsl(280,100%,70%)]">Dashboard</span>
          </h1>
          <p className="max-w-md text-center text-xl">
            Please sign in to view your dashboard.
          </p>
          <SignInButton />
        </div>
      </main>
    );
  }

  const statusFilter = searchParams?.status;
  const sortOption = searchParams?.sort ?? "date_desc";

  const jobs = await db.jobApplication.findMany({
    where: {
      userId: session.user.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: {
      dateApplied: sortOption === "date_asc" ? "asc" : "desc",
    },
  });

  const statuses = ["applied", "interview", "offer", "rejected"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] p-6 text-white">
      <h1 className="mb-6 text-4xl font-bold">Job Tracker Dashboard</h1>

      {/* Filter + Sort Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        {statuses.map((status) => (
          <a
            key={status}
            href={`/dashboard?status=${status}&sort=${sortOption}`}
            className={`rounded-md px-4 py-2 ${
              statusFilter === status
                ? "bg-purple-600"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </a>
        ))}
        <a
          href="/dashboard"
          className="rounded-md bg-white/10 px-4 py-2 hover:bg-white/20"
        >
          Clear Filters
        </a>
        <a
          href={`/dashboard?status=${statusFilter ?? ""}&sort=date_asc`}
          className="rounded-md bg-white/10 px-4 py-2 hover:bg-white/20"
        >
          Oldest First
        </a>
        <a
          href={`/dashboard?status=${statusFilter ?? ""}&sort=date_desc`}
          className="rounded-md bg-white/10 px-4 py-2 hover:bg-white/20"
        >
          Newest First
        </a>
      </div>

      {jobs.length === 0 ? (
        <p>No matching applications found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl bg-white/10 p-4 hover:bg-white/20"
            >
              <h3 className="text-xl font-bold">{job.companyName}</h3>
              <p>Role: {job.role}</p>
              <p>Status: {job.status}</p>
              <p>
                Date: {job.dateApplied?.toISOString().split("T")[0] ?? "N/A"}
              </p>
              <a
                href={job.screenshotUrl}
                target="_blank"
                className="text-blue-400 underline"
              >
                View Screenshot
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <a
          href="/upload"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Add New Application
        </a>
      </div>
    </main>
  );
}

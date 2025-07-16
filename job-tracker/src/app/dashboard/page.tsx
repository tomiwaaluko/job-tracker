import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <p>Please sign in to view your dashboard.</p>
      </main>
    );
  }

  const jobs = await db.jobApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Job <span className="text-[hsl(280,100%,70%)]">Dashboard</span>
        </h1>

        <div className="flex flex-col items-center gap-8">
          <p className="max-w-md text-center text-xl">
            View and manage all your job applications in one place.
          </p>

          {jobs.length === 0 ? (
            <p className="mt-4 text-lg">
              No job applications found. Start uploading!
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                >
                  <h3 className="text-xl font-bold">{job.companyName}</h3>
                  <div className="text-lg">
                    <p>Role: {job.role}</p>
                    <p>Status: {job.status}</p>
                    <p>
                      Date:{" "}
                      {job.dateApplied?.toISOString().split("T")[0] ?? "N/A"}
                    </p>
                  </div>
                  <a
                    href={job.screenshotUrl}
                    target="_blank"
                    className="text-sm text-blue-300 underline"
                  >
                    View Screenshot
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <a
              href="/upload"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Add New Application
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

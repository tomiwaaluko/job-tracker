export default function DashboardPage() {
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* Sample job application cards */}
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
              <h3 className="text-xl font-bold">Company Name</h3>
              <div className="text-lg">
                <p>Role: Software Engineer</p>
                <p>Status: Applied</p>
                <p>Date: 2025-01-15</p>
              </div>
            </div>

            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
              <h3 className="text-xl font-bold">Tech Corp</h3>
              <div className="text-lg">
                <p>Role: Frontend Developer</p>
                <p>Status: Interview</p>
                <p>Date: 2025-01-10</p>
              </div>
            </div>

            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
              <h3 className="text-xl font-bold">Startup Inc</h3>
              <div className="text-lg">
                <p>Role: Full Stack Developer</p>
                <p>Status: Offer</p>
                <p>Date: 2025-01-05</p>
              </div>
            </div>
          </div>

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

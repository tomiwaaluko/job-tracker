export default function UploadPage() {
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

          <form className="flex w-full max-w-md flex-col gap-4">
            <input
              type="text"
              placeholder="Company Name"
              className="rounded-md px-4 py-2 text-black"
            />
            <input
              type="text"
              placeholder="Role"
              className="rounded-md px-4 py-2 text-black"
            />
            <select className="rounded-md px-4 py-2 text-black">
              <option value="">Select Status</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="date"
              placeholder="Date Applied"
              className="rounded-md px-4 py-2 text-black"
            />
            <input
              type="url"
              placeholder="Screenshot URL"
              className="rounded-md px-4 py-2 text-black"
            />
            <button
              type="submit"
              className="rounded-md bg-[hsl(280,100%,70%)] px-4 py-2 font-semibold hover:bg-[hsl(280,100%,60%)]"
            >
              Upload Application
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

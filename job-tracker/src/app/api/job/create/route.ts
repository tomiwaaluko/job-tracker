import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

interface JobApplicationBody {
  company: string;
  role: string;
  status: string;
  date: string;
  screenshotUrl: string;
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as JobApplicationBody;

  try {
    const job = await db.jobApplication.create({
      data: {
        userId: session.user.id,
        companyName: body.company,
        role: body.role,
        status: body.status,
        dateApplied: body.date ? new Date(body.date) : null,
        screenshotUrl: body.screenshotUrl,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("DB insert failed:", error);
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
  }
}

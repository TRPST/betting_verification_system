import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Random verification status
  const statuses = [
    {
      status: "Approved",
      message: "Face Matched – Verification Approved",
    },
    {
      status: "Pending",
      message: "Verification Pending – Manual Review Needed",
    },
    {
      status: "Rejected",
      message: "Face Mismatch – Please Retake Photo",
    },
  ];

  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return NextResponse.json({
    ...randomStatus,
    timestamp: new Date().toISOString(),
  });
}
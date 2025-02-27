import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Random verification status
  const statuses = ["Approved", "Pending", "Rejected"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return NextResponse.json({
    status: randomStatus,
    message: `Verification ${randomStatus.toLowerCase()}`,
    timestamp: new Date().toISOString(),
  });
}
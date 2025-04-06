import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Members";
import { sendBirthdayEmail, sendBoardNotification } from "@/lib/mail";

interface MemberType {
  name: string;
  email: string;
  birthdate: string;
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { success: false, message: "Not authorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    // Get current date (UTC)
    const today = new Date();
    const month = today.getUTCMonth() + 1;
    const day = today.getUTCDate();

    const birthdayMembers: MemberType[] = await Member.find({});

    const todaysBirthdays = birthdayMembers.filter((member) => {
      const birthDate = new Date(member.birthdate);
      return birthDate.getUTCMonth() + 1 === month && birthDate.getUTCDate() === day;
    });

    console.log(`Found ${todaysBirthdays.length} birthdays today`);

    const emailResults = await Promise.all(
      todaysBirthdays.map(async (member) => ({
        name: member.name,
        memberEmailSent: await sendBirthdayEmail(member),
        boardEmailSent: await sendBoardNotification(member),
      }))
    );

    return NextResponse.json({
      success: true,
      message: "Birthday check completed",
      results: emailResults,
    });
  } catch (error) {
    console.error("Birthday check error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking birthdays",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

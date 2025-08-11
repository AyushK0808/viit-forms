// app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import FormSubmission from "@/models/Members";

export async function GET(request) {
  // Authentication check
  const authHeader = request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_SECRET_CODE;
  
  if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized access' },
      { status: 401 }
    );
  }

  await dbConnect();
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const domain = searchParams.get('domain');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const query = {};
    if (domain) query['personalInfo.domain'] = domain;
    if (status) query.status = status;

    const responses = await FormSubmission.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await FormSubmission.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: responses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: error.message, data: [] },
      { status: 500 }
    );
  }
}

import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FormSubmission from "@/models/Members";

export async function POST(req: NextRequest) {
  await dbConnect();
  
  try {
    const body = await req.json();
    
    // Validate required sections
    if (!body.personalInfo || !body.journey || !body.teamBonding) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required form sections (personalInfo, journey, teamBonding)" 
        }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if registration number already exists
    const existingSubmission = await FormSubmission.findOne({
      'personalInfo.regNumber': body.personalInfo.regNumber
    });

    if (existingSubmission) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "This registration number has already been submitted" 
        }), 
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create new form submission
    const formSubmission = await FormSubmission.create({
      ...body,
      submittedAt: new Date(),
      status: 'submitted'
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: formSubmission,
        message: "Form submitted successfully!"
      }), 
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error('Form submission error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: { [key: string]: string } = {};
      
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Validation failed",
          validationErrors
        }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "This registration number has already been submitted" 
        }), 
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to submit form"
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const domain = searchParams.get('domain');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Build query filter
    const filter: any = {};
    if (status) filter.status = status;
    if (domain) filter['personalInfo.domain'] = domain;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get form submissions with pagination
    const formSubmissions = await FormSubmission
      .find(filter)
      .sort({ submittedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    
    // Get total count for pagination
    const totalCount = await FormSubmission.countDocuments(filter);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: formSubmissions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
        }
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error('Error fetching form submissions:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to fetch form submissions"
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// PUT - Update submission status (for admin)
export async function PUT(req: NextRequest) {
  await dbConnect();
  
  try {
    const body = await req.json();
    const { id, status, reviewedBy, notes } = body;
    
    if (!id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Submission ID is required" 
        }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (reviewedBy) updateData.reviewedBy = reviewedBy;
    if (notes) updateData.notes = notes;
    if (status && status !== 'submitted') {
      updateData.reviewedAt = new Date();
    }

    const updatedSubmission = await FormSubmission.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSubmission) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Submission not found" 
        }), 
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: updatedSubmission,
        message: "Submission updated successfully"
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error('Error updating submission:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to update submission"
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// DELETE - Delete submission (for admin)
export async function DELETE(req: NextRequest) {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Submission ID is required" 
        }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const deletedSubmission = await FormSubmission.findByIdAndDelete(id);

    if (!deletedSubmission) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Submission not found" 
        }), 
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Submission deleted successfully",
        data: { id: deletedSubmission._id }
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error('Error deleting submission:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to delete submission"
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
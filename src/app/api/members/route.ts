import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FormSubmission from "@/models/Members";

// Define interfaces for better type safety
interface PersonalInfo {
  regNumber: string;
  domain?: string;
}

interface FormSubmissionBody {
  personalInfo: PersonalInfo;
  journey: unknown;
  teamBonding: unknown;
}

interface ValidationErrors {
  [key: string]: string;
}

interface MongooseValidationError extends Error {
  name: 'ValidationError';
  errors: {
    [key: string]: {
      message: string;
    };
  };
}

interface MongoDuplicateKeyError extends Error {
  code: 11000;
}

interface UpdateSubmissionBody {
  id: string;
  status?: string;
  reviewedBy?: string;
  notes?: string;
}

interface QueryFilter {
  status?: string;
  'personalInfo.domain'?: string;
}

interface UpdateData {
  status?: string;
  reviewedBy?: string;
  notes?: string;
  reviewedAt?: Date;
}

export async function POST(req: NextRequest) {
  await dbConnect();
  
  try {
    const body = await req.json() as FormSubmissionBody;
    
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

  } catch (error: unknown) {
    console.error('Form submission error:', error);

    // Handle Mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationError = error as MongooseValidationError;
      const validationErrors: ValidationErrors = {};
      
      Object.keys(validationError.errors).forEach(key => {
        validationErrors[key] = validationError.errors[key].message;
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
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
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

    const errorMessage = error instanceof Error ? error.message : "Failed to submit form";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
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
    const filter: QueryFilter = {};
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

  } catch (error: unknown) {
    console.error('Error fetching form submissions:', error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch form submissions";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
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
    const body = await req.json() as UpdateSubmissionBody;
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

    const updateData: UpdateData = {};
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

  } catch (error: unknown) {
    console.error('Error updating submission:', error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to update submission";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
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

  } catch (error: unknown) {
    console.error('Error deleting submission:', error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to delete submission";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
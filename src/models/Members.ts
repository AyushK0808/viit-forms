import mongoose, { Schema, Document } from 'mongoose';

// Personal Info Interface
interface IPersonalInfo {
  name: string;
  regNumber: string;
  yearOfStudy: string;
  phoneNumber: string;
  branchSpecialization: string;
  gender: 'Male' | 'Female' | 'Other';
  vitEmail: string;
  personalEmail: string;
  domain: string;
  additionalDomains: string;
  joinMonth: string;
  otherOrganizations: string;
  cgpa: string;
}

// Journey Interface
interface IJourney {
  contribution: string;
  projects: string;
  events: string;
  skillsLearned: string;
  overallContribution: number;
  techContribution: number;
}

// Team Bonding Interface
interface ITeamBonding {
  memberBonding: number;
  likelyToSeekHelp: number;
  clubEnvironment: string;
  likedCharacteristics: string;
}

// Main Form Submission Interface
interface IFormSubmission extends Document {
  personalInfo: IPersonalInfo;
  journey: IJourney;
  teamBonding: ITeamBonding;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
  submittedAt?: Date;
  createdAt?: Date;
}

// Personal Info Schema
const PersonalInfoSchema = new Schema<IPersonalInfo>({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces']
  },
  regNumber: {
    type: String,
    required: [true, 'Please provide your registration number'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[0-9]{2}[A-Z]{3}[0-9]{4}$/, 'Registration number must be in the format XXYYYXXXX (e.g., 21BCE1234)']
  },
  yearOfStudy: {
    type: String,
    required: [true, 'Please select your year of study'],
    enum: {
      values: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Masters', 'PhD'],
      message: 'Please select a valid year of study'
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
    match: [/^[6-9]\d{9}$/, 'Phone number must be 10 digits and start with 6, 7, 8, or 9']
  },
  branchSpecialization: {
    type: String,
    required: [true, 'Please provide your branch and specialization'],
    trim: true,
    maxlength: [150, 'Branch and specialization cannot be more than 150 characters']
  },
  gender: {
    type: String,
    required: [true, 'Please select your gender'],
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: 'Please select a valid gender'
    }
  },
  vitEmail: {
    type: String,
    required: [true, 'Please provide your VIT email'],
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/, 'Please provide a valid VIT email address (@vitstudent.ac.in)']
  },
  personalEmail: {
    type: String,
    required: [true, 'Please provide your personal email'],
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address']
  },
  domain: {
    type: String,
    required: [true, 'Please select your primary domain'],
  },
  additionalDomains: {
    type: String,
    trim: true,
    maxlength: [200, 'Additional domains cannot be more than 200 characters'],
    default: ''
  },
  joinMonth: {
    type: String,
    required: [true, 'Please select when you want to join'],
    enum: {
      values: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      message: 'Please select a valid month'
    }
  },
  otherOrganizations: {
    type: String,
    required: [true, 'Please mention other organizations (write "None" if not applicable)'],
    trim: true,
    maxlength: [500, 'Other organizations description cannot be more than 500 characters']
  },
  cgpa: {
    type: String,
    required: [true, 'Please provide your CGPA'],
    validate: {
      validator: function(v: string) {
        const cgpaNum = parseFloat(v);
        return !isNaN(cgpaNum) && cgpaNum >= 0 && cgpaNum <= 10;
      },
      message: 'CGPA must be a valid number between 0 and 10'
    }
  }
}, { _id: false });

// Journey Schema
const JourneySchema = new Schema<IJourney>({
  contribution: {
    type: String,
    required: [true, 'Please describe your contribution to VinnovateIT'],
    trim: true,
    minlength: [0, 'Contribution description must be at least 50 characters'],
    maxlength: [1000, 'Contribution description cannot be more than 1000 characters']
  },
  projects: {
    type: String,
    required: [true, 'Please describe the projects you have worked on'],
    trim: true,
    minlength: [0, 'Projects description must be at least 50 characters'],
    maxlength: [1000, 'Projects description cannot be more than 1000 characters']
  },
  events: {
    type: String,
    required: [true, 'Please describe the events you have participated in or organized'],
    trim: true,
    minlength: [0, 'Events description must be at least 30 characters'],
    maxlength: [1000, 'Events description cannot be more than 1000 characters']
  },
  skillsLearned: {
    type: String,
    required: [true, 'Please describe the skills you have learned'],
    trim: true,
    minlength: [0, 'Skills learned description must be at least 30 characters'],
    maxlength: [1000, 'Skills learned description cannot be more than 1000 characters']
  },
  overallContribution: {
    type: Number,
    required: [true, 'Please rate your overall contribution'],
    min: [1, 'Overall contribution rating must be between 1 and 10'],
    max: [10, 'Overall contribution rating must be between 1 and 10']
  },
  techContribution: {
    type: Number,
    required: [true, 'Please rate your technical contribution'],
    min: [1, 'Technical contribution rating must be between 1 and 10'],
    max: [10, 'Technical contribution rating must be between 1 and 10']
  }
}, { _id: false });

// Team Bonding Schema
const TeamBondingSchema = new Schema<ITeamBonding>({
  memberBonding: {
    type: Number,
    required: [true, 'Please rate your bonding with team members'],
    min: [1, 'Member bonding rating must be between 1 and 10'],
    max: [10, 'Member bonding rating must be between 1 and 10']
  },
  likelyToSeekHelp: {
    type: Number,
    required: [true, 'Please rate how likely you are to seek help from team members'],
    min: [1, 'Likely to seek help rating must be between 1 and 10'],
    max: [10, 'Likely to seek help rating must be between 1 and 10']
  },
  clubEnvironment: {
    type: String,
    required: [true, 'Please describe the club environment'],
    trim: true,
    minlength: [0, 'Club environment description must be at least 50 characters'],
    maxlength: [1000, 'Club environment description cannot be more than 1000 characters']
  },
  likedCharacteristics: {
    type: String,
    required: [true, 'Please describe the characteristics you liked most'],
    trim: true,
    minlength: [0, 'Liked characteristics description must be at least 30 characters'],
    maxlength: [1000, 'Liked characteristics description cannot be more than 1000 characters']
  }
}, { _id: false });

// Main Form Submission Schema
const FormSubmissionSchema = new Schema<IFormSubmission>({
  personalInfo: {
    type: PersonalInfoSchema,
    required: [true, 'Personal information is required']
  },
  journey: {
    type: JourneySchema,
    required: [true, 'Journey information is required']
  },
  teamBonding: {
    type: TeamBondingSchema,
    required: [true, 'Team bonding information is required']
  },
  status: {
    type: String,
    enum: {
      values: ['submitted', 'under_review', 'approved', 'rejected'],
      message: 'Please select a valid status'
    },
    default: 'submitted'
  },
  reviewedBy: {
    type: String,
    trim: true,
    maxlength: [100, 'Reviewer name cannot be more than 100 characters']
  },
  reviewedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
FormSubmissionSchema.index({ 'personalInfo.regNumber': 1 }, { unique: true });
FormSubmissionSchema.index({ 'personalInfo.vitEmail': 1 });
FormSubmissionSchema.index({ 'personalInfo.domain': 1 });
FormSubmissionSchema.index({ status: 1 });
FormSubmissionSchema.index({ submittedAt: -1 });
FormSubmissionSchema.index({ createdAt: -1 });

// Pre-save middleware to ensure regNumber uniqueness
FormSubmissionSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('personalInfo.regNumber')) {
    const existingSubmission = await mongoose.model('FormSubmission').findOne({
      'personalInfo.regNumber': this.personalInfo.regNumber,
      _id: { $ne: this._id }
    });
    
    if (existingSubmission) {
      const error = new Error('Registration number already exists');
      return next(error);
    }
  }
  next();
});

// Export interfaces for use in other files
export type { IFormSubmission, IPersonalInfo, IJourney, ITeamBonding };

// Export the model
export default mongoose.models.FormSubmission || mongoose.model<IFormSubmission>('FormSubmission', FormSubmissionSchema);
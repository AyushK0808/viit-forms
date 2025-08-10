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
  managementContribution: number;
  designContribution: number;
  challenges: string;
  howChanged: string;
}

// Team Bonding Interface
interface ITeamBonding {
  memberBonding: number;
  likelyToSeekHelp: number;
  clubEnvironment: string;
  likedCharacteristics: string;
  dislikedCharacteristics: string;
  favoriteTeammates: string;
  favoriteTeammatesTraits: string;
  improvementSuggestions: string;
}

// Future Interface
interface IFuture {
  whyJoinedVinnovateIT: string;
  wishlistFulfillment: string;
  commitmentRating: number;
  commitmentJustification: string;
  leadershipPreference: string;
  immediateChanges: string;
  upcomingYearChanges: string;
  preferredFellowLeaders: string;
  skillsToLearn: string;
  domainsToExplore: string;
}

// Board Review Interface
interface IBoardReview {
  overallBoardPerformance: number;
  boardCommunication: number;
  boardAccessibility: number;
  boardDecisionMaking: number;
  mostEffectiveBoardMember: string;
  boardImprovementSuggestions: string;
  boardAppreciation: string;
}

// General Feedback Interface
interface IGeneralFeedback {
  overallClubExperience: number;
  recommendToOthers: number;
  additionalComments: string;
  anonymousFeedback: string;
}

// Main Form Submission Interface
interface IFormSubmission extends Document {
  personalInfo: IPersonalInfo;
  journey: IJourney;
  teamBonding: ITeamBonding;
  future: IFuture;
  boardReview: IBoardReview;
  generalFeedback: IGeneralFeedback;
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
    trim: true,
    maxlength: [100, 'Domain cannot be more than 100 characters']
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
    minlength: [20, 'Contribution description must be at least 20 characters'],
    maxlength: [1000, 'Contribution description cannot be more than 1000 characters']
  },
  projects: {
    type: String,
    required: [true, 'Please describe the projects you have worked on'],
    trim: true,
    minlength: [20, 'Projects description must be at least 20 characters'],
    maxlength: [1000, 'Projects description cannot be more than 1000 characters']
  },
  events: {
    type: String,
    required: [true, 'Please describe the events you have participated in or organized'],
    trim: true,
    minlength: [20, 'Events description must be at least 20 characters'],
    maxlength: [1000, 'Events description cannot be more than 1000 characters']
  },
  skillsLearned: {
    type: String,
    required: [true, 'Please describe the skills you have learned'],
    trim: true,
    minlength: [20, 'Skills learned description must be at least 20 characters'],
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
  },
  managementContribution: {
    type: Number,
    required: [true, 'Please rate your management contribution'],
    min: [1, 'Management contribution rating must be between 1 and 10'],
    max: [10, 'Management contribution rating must be between 1 and 10']
  },
  designContribution: {
    type: Number,
    required: [true, 'Please rate your design contribution'],
    min: [1, 'Design contribution rating must be between 1 and 10'],
    max: [10, 'Design contribution rating must be between 1 and 10']
  },
  challenges: {
    type: String,
    required: [true, 'Please describe the challenges you faced'],
    trim: true,
    minlength: [20, 'Challenges description must be at least 20 characters'],
    maxlength: [1000, 'Challenges description cannot be more than 1000 characters']
  },
  howChanged: {
    type: String,
    required: [true, 'Please describe how VinnovateIT changed you'],
    trim: true,
    minlength: [20, 'How changed description must be at least 20 characters'],
    maxlength: [1000, 'How changed description cannot be more than 1000 characters']
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
    minlength: [20, 'Club environment description must be at least 20 characters'],
    maxlength: [1000, 'Club environment description cannot be more than 1000 characters']
  },
  likedCharacteristics: {
    type: String,
    required: [true, 'Please describe the characteristics you liked most'],
    trim: true,
    minlength: [20, 'Liked characteristics description must be at least 20 characters'],
    maxlength: [1000, 'Liked characteristics description cannot be more than 1000 characters']
  },
  dislikedCharacteristics: {
    type: String,
    required: [true, 'Please describe the characteristics you disliked'],
    trim: true,
    minlength: [10, 'Disliked characteristics description must be at least 10 characters'],
    maxlength: [1000, 'Disliked characteristics description cannot be more than 1000 characters']
  },
  favoriteTeammates: {
    type: String,
    required: [true, 'Please mention your favorite teammates'],
    trim: true,
    minlength: [10, 'Favorite teammates description must be at least 10 characters'],
    maxlength: [500, 'Favorite teammates description cannot be more than 500 characters']
  },
  favoriteTeammatesTraits: {
    type: String,
    required: [true, 'Please describe the traits of your favorite teammates'],
    trim: true,
    minlength: [20, 'Favorite teammates traits description must be at least 20 characters'],
    maxlength: [1000, 'Favorite teammates traits description cannot be more than 1000 characters']
  },
  improvementSuggestions: {
    type: String,
    required: [true, 'Please provide improvement suggestions'],
    trim: true,
    minlength: [20, 'Improvement suggestions must be at least 20 characters'],
    maxlength: [1000, 'Improvement suggestions cannot be more than 1000 characters']
  }
}, { _id: false });

// Future Interface and Schema
const FutureSchema = new Schema<IFuture>({
  whyJoinedVinnovateIT: {
    type: String,
    required: [true, 'Please explain why you joined VinnovateIT'],
    trim: true,
    minlength: [20, 'Why joined description must be at least 20 characters'],
    maxlength: [1000, 'Why joined description cannot be more than 1000 characters']
  },
  wishlistFulfillment: {
    type: String,
    required: [true, 'Please describe your wishlist fulfillment'],
    trim: true,
    minlength: [20, 'Wishlist fulfillment description must be at least 20 characters'],
    maxlength: [1000, 'Wishlist fulfillment description cannot be more than 1000 characters']
  },
  commitmentRating: {
    type: Number,
    required: [true, 'Please rate your commitment'],
    min: [1, 'Commitment rating must be between 1 and 10'],
    max: [10, 'Commitment rating must be between 1 and 10']
  },
  commitmentJustification: {
    type: String,
    required: [true, 'Please justify your commitment rating'],
    trim: true,
    minlength: [20, 'Commitment justification must be at least 20 characters'],
    maxlength: [1000, 'Commitment justification cannot be more than 1000 characters']
  },
  leadershipPreference: {
    type: String,
    required: [true, 'Please describe your leadership preference'],
    trim: true,
    minlength: [20, 'Leadership preference must be at least 20 characters'],
    maxlength: [1000, 'Leadership preference cannot be more than 1000 characters']
  },
  immediateChanges: {
    type: String,
    required: [true, 'Please describe immediate changes you would make'],
    trim: true,
    minlength: [20, 'Immediate changes description must be at least 20 characters'],
    maxlength: [1000, 'Immediate changes description cannot be more than 1000 characters']
  },
  upcomingYearChanges: {
    type: String,
    required: [true, 'Please describe changes for the upcoming year'],
    trim: true,
    minlength: [20, 'Upcoming year changes description must be at least 20 characters'],
    maxlength: [1000, 'Upcoming year changes description cannot be more than 1000 characters']
  },
  preferredFellowLeaders: {
    type: String,
    required: [true, 'Please describe your preferred fellow leaders'],
    trim: true,
    minlength: [20, 'Preferred fellow leaders description must be at least 20 characters'],
    maxlength: [1000, 'Preferred fellow leaders description cannot be more than 1000 characters']
  },
  skillsToLearn: {
    type: String,
    required: [true, 'Please describe skills you want to learn'],
    trim: true,
    minlength: [20, 'Skills to learn description must be at least 20 characters'],
    maxlength: [1000, 'Skills to learn description cannot be more than 1000 characters']
  },
  domainsToExplore: {
    type: String,
    required: [true, 'Please describe domains you want to explore'],
    trim: true,
    minlength: [20, 'Domains to explore description must be at least 20 characters'],
    maxlength: [1000, 'Domains to explore description cannot be more than 1000 characters']
  }
}, { _id: false });

// Board Review Schema
const BoardReviewSchema = new Schema<IBoardReview>({
  overallBoardPerformance: {
    type: Number,
    required: [true, 'Please rate overall board performance'],
    min: [1, 'Overall board performance rating must be between 1 and 10'],
    max: [10, 'Overall board performance rating must be between 1 and 10']
  },
  boardCommunication: {
    type: Number,
    required: [true, 'Please rate board communication'],
    min: [1, 'Board communication rating must be between 1 and 10'],
    max: [10, 'Board communication rating must be between 1 and 10']
  },
  boardAccessibility: {
    type: Number,
    required: [true, 'Please rate board accessibility'],
    min: [1, 'Board accessibility rating must be between 1 and 10'],
    max: [10, 'Board accessibility rating must be between 1 and 10']
  },
  boardDecisionMaking: {
    type: Number,
    required: [true, 'Please rate board decision making'],
    min: [1, 'Board decision making rating must be between 1 and 10'],
    max: [10, 'Board decision making rating must be between 1 and 10']
  },
  mostEffectiveBoardMember: {
    type: String,
    required: [true, 'Please mention the most effective board member'],
    trim: true,
    minlength: [2, 'Most effective board member must be at least 2 characters'],
    maxlength: [200, 'Most effective board member cannot be more than 200 characters']
  },
  boardImprovementSuggestions: {
    type: String,
    required: [true, 'Please provide board improvement suggestions'],
    trim: true,
    minlength: [20, 'Board improvement suggestions must be at least 20 characters'],
    maxlength: [1000, 'Board improvement suggestions cannot be more than 1000 characters']
  },
  boardAppreciation: {
    type: String,
    required: [true, 'Please share your appreciation for the board'],
    trim: true,
    minlength: [20, 'Board appreciation must be at least 20 characters'],
    maxlength: [1000, 'Board appreciation cannot be more than 1000 characters']
  }
}, { _id: false });

// General Feedback Schema
const GeneralFeedbackSchema = new Schema<IGeneralFeedback>({
  overallClubExperience: {
    type: Number,
    required: [true, 'Please rate your overall club experience'],
    min: [1, 'Overall club experience rating must be between 1 and 10'],
    max: [10, 'Overall club experience rating must be between 1 and 10']
  },
  recommendToOthers: {
    type: Number,
    required: [true, 'Please rate how likely you are to recommend to others'],
    min: [1, 'Recommend to others rating must be between 1 and 10'],
    max: [10, 'Recommend to others rating must be between 1 and 10']
  },
  additionalComments: {
    type: String,
    required: [true, 'Please provide additional comments'],
    trim: true,
    minlength: [20, 'Additional comments must be at least 20 characters'],
    maxlength: [2000, 'Additional comments cannot be more than 2000 characters']
  },
  anonymousFeedback: {
    type: String,
    trim: true,
    maxlength: [2000, 'Anonymous feedback cannot be more than 2000 characters'],
    default: ''
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
  future: {
    type: FutureSchema,
    required: [true, 'Future plans information is required']
  },
  boardReview: {
    type: BoardReviewSchema,
    required: [true, 'Board review information is required']
  },
  generalFeedback: {
    type: GeneralFeedbackSchema,
    required: [true, 'General feedback is required']
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
FormSubmissionSchema.index({ 'personalInfo.personalEmail': 1 });
FormSubmissionSchema.index({ 'personalInfo.domain': 1 });
FormSubmissionSchema.index({ 'personalInfo.yearOfStudy': 1 });
FormSubmissionSchema.index({ 'personalInfo.gender': 1 });
FormSubmissionSchema.index({ status: 1 });
FormSubmissionSchema.index({ submittedAt: -1 });
FormSubmissionSchema.index({ createdAt: -1 });
FormSubmissionSchema.index({ 'journey.overallContribution': -1 });
FormSubmissionSchema.index({ 'generalFeedback.overallClubExperience': -1 });

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

// Pre-save middleware to ensure email uniqueness
FormSubmissionSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('personalInfo.vitEmail')) {
    const existingVitEmail = await mongoose.model('FormSubmission').findOne({
      'personalInfo.vitEmail': this.personalInfo.vitEmail,
      _id: { $ne: this._id }
    });
    
    if (existingVitEmail) {
      const error = new Error('VIT email already exists');
      return next(error);
    }
  }
  
  if (this.isNew || this.isModified('personalInfo.personalEmail')) {
    const existingPersonalEmail = await mongoose.model('FormSubmission').findOne({
      'personalInfo.personalEmail': this.personalInfo.personalEmail,
      _id: { $ne: this._id }
    });
    
    if (existingPersonalEmail) {
      const error = new Error('Personal email already exists');
      return next(error);
    }
  }
  
  next();
});

// Static methods for the model
FormSubmissionSchema.statics.findByRegNumber = function(regNumber: string) {
  return this.findOne({ 'personalInfo.regNumber': regNumber.toUpperCase() });
};

FormSubmissionSchema.statics.findByDomain = function(domain: string) {
  return this.find({ 'personalInfo.domain': domain });
};

FormSubmissionSchema.statics.findByStatus = function(status: string) {
  return this.find({ status });
};

FormSubmissionSchema.statics.getSubmissionStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance methods
FormSubmissionSchema.methods.approve = function(reviewedBy: string, notes?: string) {
  this.status = 'approved';
  this.reviewedBy = reviewedBy;
  this.reviewedAt = new Date();
  if (notes) this.notes = notes;
  return this.save();
};

FormSubmissionSchema.methods.reject = function(reviewedBy: string, notes?: string) {
  this.status = 'rejected';
  this.reviewedBy = reviewedBy;
  this.reviewedAt = new Date();
  if (notes) this.notes = notes;
  return this.save();
};

// Export interfaces for use in other files
export type { 
  IFormSubmission, 
  IPersonalInfo, 
  IJourney, 
  ITeamBonding, 
  IFuture, 
  IBoardReview, 
  IGeneralFeedback 
};

// Export the model
export default mongoose.models.FormSubmission || mongoose.model<IFormSubmission>('FormSubmission', FormSubmissionSchema);
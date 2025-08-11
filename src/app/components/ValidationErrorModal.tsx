import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationErrorDisplayProps {
  errors: Record<string, string>;
  onDismiss?: () => void;
  className?: string;
}

// Field name mapping for better user experience
const fieldDisplayNames: Record<string, string> = {
  // Personal Info
  name: 'Full Name',
  regNumber: 'Registration Number',
  yearOfStudy: 'Year of Study',
  phoneNumber: 'Phone Number',
  branchSpecialization: 'Branch & Specialization',
  gender: 'Gender',
  vitEmail: 'VIT Email',
  personalEmail: 'Personal Email',
  domain: 'Primary Domain',
  additionalDomains: 'Additional Domains',
  joinMonth: 'Join Month',
  otherOrganizations: 'Other Organizations',
  cgpa: 'CGPA',
  
  // Journey
  contribution: 'Your Contribution',
  projects: 'Projects Worked On',
  events: 'Events Participated',
  skillsLearned: 'Skills Learned',
  challenges: 'Challenges Faced',
  howChanged: 'How VinnovateIT Changed You',
  
  // Team Bonding
  clubEnvironment: 'Club Environment Description',
  likedCharacteristics: 'Liked Characteristics',
  dislikedCharacteristics: 'Disliked Characteristics',
  favoriteTeammates: 'Favorite Teammates',
  favoriteTeammatesTraits: 'Teammates Traits',
  improvementSuggestions: 'Improvement Suggestions',
  
  // Future
  whyJoinedVinnovateIT: 'Why You Joined VinnovateIT',
  wishlistFulfillment: 'Wishlist Fulfillment',
  commitmentJustification: 'Commitment Justification',
  leadershipPreference: 'Leadership Preference',
  immediateChanges: 'Immediate Changes',
  upcomingYearChanges: 'Upcoming Year Changes',
  preferredFellowLeaders: 'Preferred Fellow Leaders',
  skillsToLearn: 'Skills to Learn',
  domainsToExplore: 'Domains to Explore',
  
  // Board Review
  mostEffectiveBoardMember: 'Most Effective Board Member',
  boardImprovementSuggestions: 'Board Improvement Suggestions',
  boardAppreciation: 'Board Appreciation',
  
  // General Feedback
  additionalComments: 'Additional Comments'
};

const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({ 
  errors, 
  onDismiss, 
  className = '' 
}) => {
  const errorEntries = Object.entries(errors);
  
  if (errorEntries.length === 0) {
    return null;
  }

  const validationErrors: ValidationError[] = errorEntries.map(([field, message]) => ({
    field: fieldDisplayNames[field] || field,
    message
  }));

  return (
    <div className={`bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6 backdrop-blur-sm ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-300 font-semibold">
              Please fix the following {validationErrors.length === 1 ? 'error' : 'errors'}:
            </h3>
            <p className="text-red-400 text-sm mt-1">
              {validationErrors.length === 1 
                ? 'There is 1 validation error that needs your attention.'
                : `There are ${validationErrors.length} validation errors that need your attention.`
              }
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-300 transition-colors p-1"
            aria-label="Dismiss errors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {validationErrors.map(({ field, message }, index) => (
          <div 
            key={index}
            className="flex items-start bg-red-950/30 rounded-md p-3 border border-red-500/20"
          >
            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-red-300 font-medium text-sm">{field}</p>
              <p className="text-red-400 text-sm mt-0.5">{message}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-red-500/20">
        <p className="text-red-400 text-xs">
          💡 Tip: Scroll up to see the highlighted fields that need attention.
        </p>
      </div>
    </div>
  );
};

export default ValidationErrorDisplay;
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, User, MapPin, Users, Target, Star, MessageSquare, CheckCircle } from 'lucide-react';
import ProgressBar from './components/progressBar';
import Toast from './components/Toast';
import PersonalInfoForm from './components/pages/Personalinfo';
import JourneyForm from './components/pages/Journey';
import TeamBondingForm from './components/pages/TeamBonding';
import FutureForm from './components/pages/Future';
import BoardReviewForm from './components/pages/BoardReview';
import GeneralFeedbackForm from './components/pages/GeneralFeedback';
import RestoreDialog from './components/RestoreDialog';
import AutoSaveStatus from './components/AutoSaveStatus';
import WarningDialog from './components/WarningDialog';
import {
  saveFormData,
  loadFormData,
  clearFormData,
  hasSavedData,
  getLastSavedTime,
  formatLastSavedTime,
  isLocalStorageAvailable,
  FormData as StoredFormData
} from '../lib/localStorage';

// Types
interface PersonalInfo {
  name: string;
  regNumber: string;
  yearOfStudy: string;
  phoneNumber: string;
  branchSpecialization: string;
  gender: string;
  vitEmail: string;
  personalEmail: string;
  domain: string;
  additionalDomains: string;
  joinMonth: string;
  otherOrganizations: string;
  cgpa: string;
}

interface Journey {
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

interface TeamBonding {
  memberBonding: number;
  likelyToSeekHelp: number;
  clubEnvironment: string;
  likedCharacteristics: string;
  dislikedCharacteristics: string;
  favoriteTeammates: string;
  favoriteTeammatesTraits: string;
  improvementSuggestions: string;
}

interface Future {
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

interface BoardReview {
  overallBoardPerformance: number;
  boardCommunication: number;
  boardAccessibility: number;
  boardDecisionMaking: number;
  mostEffectiveBoardMember: string;
  boardImprovementSuggestions: string;
  boardAppreciation: string;
}

interface GeneralFeedback {
  overallClubExperience: number;
  recommendToOthers: number;
  additionalComments: string;
  anonymousFeedback: string;
}

interface FormData {
  personalInfo: PersonalInfo;
  journey: Journey;
  teamBonding: TeamBonding;
  future: Future;
  boardReview: BoardReview;
  generalFeedback: GeneralFeedback;
}

interface ValidationErrors {
  [key: string]: string;
}

interface FormNavigationProps {
  currentPage: number;
  totalPages: number;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentPage,
  totalPages,
  isSubmitting,
  onPrev,
  onNext,
  onSubmit
}) => {
  return (
    <div className="flex justify-between items-center pt-6 border-t border-purple-500/30">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed border-gray-600/30 bg-gray-800/30'
            : 'text-purple-300 hover:bg-purple-900/30 border-purple-500/30 hover:border-purple-400 hover:text-purple-200'
        }`}
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Previous
      </button>

      <div className="text-sm text-purple-300 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/20 invisible md:visible">
        Page {currentPage} of {totalPages}
      </div>

      {currentPage === totalPages ? (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border relative overflow-hidden group ${
            isSubmitting
              ? 'bg-gray-700/50 text-gray-300 cursor-not-allowed border-gray-600/30'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white border-green-500/30 hover:border-green-400 shadow-lg shadow-green-900/50'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-1" />
              Submit
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </>
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400 shadow-lg shadow-purple-900/50 relative overflow-hidden group"
        >
          <div className='z-10'>Next</div>
          <ChevronRight className="w-5 h-5 ml-1 z-10" />
          <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      )}
    </div>
  );
};

// Constants
const TOTAL_PAGES = 6;
const PAGE_TITLES = [
  'Personal Information', 
  'Your Journey', 
  'Team Bonding', 
  'Future Plans', 
  'Board Review', 
  'General Feedback'
];
const PAGE_ICONS = [User, MapPin, Users, Target, Star, MessageSquare];

// Initial form data
const initialFormData: FormData = {
  personalInfo: {
    name: '',
    regNumber: '',
    yearOfStudy: '',
    phoneNumber: '',
    branchSpecialization: '',
    gender: '',
    vitEmail: '',
    personalEmail: '',
    domain: '',
    additionalDomains: '',
    joinMonth: '',
    otherOrganizations: '',
    cgpa: ''
  },
  journey: {
    contribution: '',
    projects: '',
    events: '',
    skillsLearned: '',
    overallContribution: 5,
    techContribution: 5,
    managementContribution: 5,
    designContribution: 5,
    challenges: '',
    howChanged: ''
  },
  teamBonding: {
    memberBonding: 5,
    likelyToSeekHelp: 5,
    clubEnvironment: '',
    likedCharacteristics: '',
    dislikedCharacteristics: '',
    favoriteTeammates: '',
    favoriteTeammatesTraits: '',
    improvementSuggestions: ''
  },
  future: {
    whyJoinedVinnovateIT: '',
    wishlistFulfillment: '',
    commitmentRating: 5,
    commitmentJustification: '',
    leadershipPreference: '',
    immediateChanges: '',
    upcomingYearChanges: '',
    preferredFellowLeaders: '',
    skillsToLearn: '',
    domainsToExplore: ''
  },
  boardReview: {
    overallBoardPerformance: 5,
    boardCommunication: 5,
    boardAccessibility: 5,
    boardDecisionMaking: 5,
    mostEffectiveBoardMember: '',
    boardImprovementSuggestions: '',
    boardAppreciation: ''
  },
  generalFeedback: {
    overallClubExperience: 5,
    recommendToOthers: 5,
    additionalComments: '',
    anonymousFeedback: ''
  }
};

export default function VinnovateITForm() {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState<{
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}>({
  show: false,
  message: '',
  type: 'info',
});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error' | 'idle'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [localStorageAvailable, setLocalStorageAvailable] = useState(false);
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sparkles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, index) => (
      <div 
        key={index}
        className="sparkle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `sparkle ${3 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 5}s`
        }}
      ></div>
    ));
  }, []);

  useEffect(() => {
    const available = isLocalStorageAvailable();
    setLocalStorageAvailable(available);
    
    if (available && hasSavedData()) {
      const lastSaved = getLastSavedTime();
      if (lastSaved) {
        setLastSavedTime(formatLastSavedTime(lastSaved));
        setShowRestoreDialog(true);
      }
    }
  }, []);

  const performAutoSave = useCallback(() => {
    if (!localStorageAvailable) return;
    
    setAutoSaveStatus('saving');
    
    try {
      const dataToSave: StoredFormData = {
        ...formData,
        currentPage
      };
      
      saveFormData(dataToSave);
      setAutoSaveStatus('saved');
      
      const now = new Date();
      setLastSavedTime(formatLastSavedTime(now));
      
      setTimeout(() => {
        setAutoSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
      
      setTimeout(() => {
        setAutoSaveStatus('idle');
      }, 3000);
    }
  }, [formData, currentPage, localStorageAvailable]);

  const scheduleAutoSave = useCallback(() => {
    if (!localStorageAvailable) return;
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(performAutoSave, 2000); // Save after 2 seconds of inactivity
  }, [performAutoSave, localStorageAvailable]);

  useEffect(() => {
    if (localStorageAvailable && 
        (formData.personalInfo.name || 
         formData.personalInfo.regNumber || 
         formData.journey.contribution ||
         Object.values(formData).some(section => 
           typeof section === 'object' && 
           Object.values(section).some(value => 
             (typeof value === 'string' && value.trim() !== '') || 
             (typeof value === 'number' && value !== 5)
           )
         ))) {
      scheduleAutoSave();
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, scheduleAutoSave, localStorageAvailable]);

  useEffect(() => {
    if (localStorageAvailable && currentPage > 1) {
      scheduleAutoSave();
    }
  }, [currentPage, scheduleAutoSave, localStorageAvailable]);

  const handleRestoreData = () => {
    const savedData = loadFormData();
    if (savedData) {
      setFormData({
        personalInfo: savedData.personalInfo,
        journey: savedData.journey,
        teamBonding: savedData.teamBonding,
        future: savedData.future,
        boardReview: savedData.boardReview,
        generalFeedback: savedData.generalFeedback,
      });
      
      if (savedData.currentPage) {
        setCurrentPage(savedData.currentPage);
      }
      
      showToast('Previous progress restored successfully!', 'success');
    }
    setShowRestoreDialog(false);
  };

  const handleDiscardData = () => {
    setShowWarningDialog(true);
  };

  const handleConfirmDiscard = () => {
    clearFormData();
    setShowRestoreDialog(false);
    setShowWarningDialog(false);
    showToast('Starting with a fresh form', 'info');
  };

  const handleCancelDiscard = () => {
    setShowWarningDialog(false);
  };

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Utility functions
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const validateCGPA = (cgpa: string): boolean => {
    const cgpaNum = parseFloat(cgpa);
    return !isNaN(cgpaNum) && cgpaNum >= 0 && cgpaNum <= 10;
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Update functions
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateJourney = (field: keyof Journey, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      journey: { ...prev.journey, [field]: value }
    }));
  };

  const updateTeamBonding = (field: keyof TeamBonding, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      teamBonding: { ...prev.teamBonding, [field]: value }
    }));
  };

  const updateFuture = (field: keyof Future, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      future: { ...prev.future, [field]: value }
    }));
  };

  const updateBoardReview = (field: keyof BoardReview, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      boardReview: { ...prev.boardReview, [field]: value }
    }));
  };

  const updateGeneralFeedback = (field: keyof GeneralFeedback, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      generalFeedback: { ...prev.generalFeedback, [field]: value }
    }));
  };

  // Validation functions
  const validatePersonalInfo = (): boolean => {
    const newErrors: ValidationErrors = {};
    const { personalInfo } = formData;

    if (!personalInfo.name.trim()) newErrors.name = 'Name is required';
    if (!personalInfo.regNumber.trim()) newErrors.regNumber = 'Registration number is required';
    if (!personalInfo.yearOfStudy) newErrors.yearOfStudy = 'Year of study is required';
    if (!validatePhoneNumber(personalInfo.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!personalInfo.branchSpecialization.trim()) newErrors.branchSpecialization = 'Branch and specialization is required';
    if (!personalInfo.gender) newErrors.gender = 'Gender is required';
    if (!validateEmail(personalInfo.vitEmail)) {
      newErrors.vitEmail = 'Please enter a valid VIT email address';
    }
    if (!validateEmail(personalInfo.personalEmail)) {
      newErrors.personalEmail = 'Please enter a valid personal email address';
    }
    if (!personalInfo.domain) newErrors.domain = 'Domain is required';
    if (!personalInfo.joinMonth) newErrors.joinMonth = 'Join month is required';
    if (!personalInfo.otherOrganizations.trim()) newErrors.otherOrganizations = 'This field is required (write "None" if not applicable)';
    if (!validateCGPA(personalInfo.cgpa)) {
      newErrors.cgpa = 'Please enter a valid CGPA (0-10)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateJourney = (): boolean => {
    const newErrors: ValidationErrors = {};
    const { journey } = formData;

    if (!journey.contribution.trim()) newErrors.contribution = 'Contribution description is required';
    if (!journey.projects.trim()) newErrors.projects = 'Projects description is required';
    if (!journey.events.trim()) newErrors.events = 'Events description is required';
    if (!journey.skillsLearned.trim()) newErrors.skillsLearned = 'Skills learned description is required';
    if (!journey.challenges.trim()) newErrors.challenges = 'Challenges description is required';
    if (!journey.howChanged.trim()) newErrors.howChanged = 'How VinnovateIT changed you description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTeamBonding = (): boolean => {
    const newErrors: ValidationErrors = {};
    const { teamBonding } = formData;

    if (!teamBonding.clubEnvironment.trim()) newErrors.clubEnvironment = 'Club environment description is required';
    if (!teamBonding.likedCharacteristics.trim()) newErrors.likedCharacteristics = 'Liked characteristics description is required';
    if (!teamBonding.dislikedCharacteristics.trim()) newErrors.dislikedCharacteristics = 'Disliked characteristics description is required';
    if (!teamBonding.favoriteTeammates.trim()) newErrors.favoriteTeammates = 'Favorite teammates description is required';
    if (!teamBonding.favoriteTeammatesTraits.trim()) newErrors.favoriteTeammatesTraits = 'Favorite teammates traits description is required';
    if (!teamBonding.improvementSuggestions.trim()) newErrors.improvementSuggestions = 'Improvement suggestions are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFuture = (): boolean => {
    const newErrors: ValidationErrors = {};
    const { future } = formData;

    if (!future.whyJoinedVinnovateIT.trim()) newErrors.whyJoinedVinnovateIT = 'Why you joined VinnovateIT is required';
    if (!future.wishlistFulfillment.trim()) newErrors.wishlistFulfillment = 'Wishlist fulfillment description is required';
    if (!future.commitmentJustification.trim()) newErrors.commitmentJustification = 'Commitment justification is required';
    if (!future.leadershipPreference.trim()) newErrors.leadershipPreference = 'Leadership preference is required';
    if (!future.immediateChanges.trim()) newErrors.immediateChanges = 'Immediate changes description is required';
    if (!future.upcomingYearChanges.trim()) newErrors.upcomingYearChanges = 'Upcoming year changes description is required';
    if (!future.preferredFellowLeaders.trim()) newErrors.preferredFellowLeaders = 'Preferred fellow leaders description is required';
    if (!future.skillsToLearn.trim()) newErrors.skillsToLearn = 'Skills to learn description is required';
    if (!future.domainsToExplore.trim()) newErrors.domainsToExplore = 'Domains to explore description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBoardReview = (): boolean => {
    const newErrors: ValidationErrors = {};
    const { boardReview } = formData;

    if (!boardReview.mostEffectiveBoardMember.trim()) newErrors.mostEffectiveBoardMember = 'Most effective board member is required';
    if (!boardReview.boardImprovementSuggestions.trim()) newErrors.boardImprovementSuggestions = 'Board improvement suggestions are required';
    if (!boardReview.boardAppreciation.trim()) newErrors.boardAppreciation = 'Board appreciation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateGeneralFeedback = (): boolean => {
    const newErrors: ValidationErrors = {};
    const { generalFeedback } = formData;

    if (!generalFeedback.additionalComments.trim()) newErrors.additionalComments = 'Additional comments are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCurrentPage = (): boolean => {
    switch (currentPage) {
      case 1: return validatePersonalInfo();
      case 2: return validateJourney();
      case 3: return validateTeamBonding();
      case 4: return validateFuture();
      case 5: return validateBoardReview();
      case 6: return validateGeneralFeedback();
      default: return true;
    }
  };

  // Navigation functions
  const handleNext = () => {
    if (validateCurrentPage()) {
      setCurrentPage(prev => Math.min(prev + 1, TOTAL_PAGES));
      setErrors({});
    } else {
      showToast('Please fill in all required fields correctly', 'error');
    }
  };

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateCurrentPage()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          showToast('This registration number has already been submitted', 'error');
        } else if (data.validationErrors) {
          // Handle server-side validation errors
          setErrors(data.validationErrors);
          showToast('Please fix the validation errors', 'error');
        } else {
          throw new Error(data.error || 'Submission failed');
        }
        return;
      }
      
      showToast('Form submitted successfully! Thank you for your submission.', 'success');
      
      if (localStorageAvailable) {
        clearFormData();
      }
      
      // Reset form
      setFormData(initialFormData);
      setCurrentPage(1);
      setErrors({});
      setAutoSaveStatus('idle');
      setLastSavedTime('');
    } catch (error) {
      console.error('Submission error:', error);
      showToast('Failed to submit form. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current page content
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <PersonalInfoForm
            formData={formData.personalInfo}
            errors={errors}
            onChange={updatePersonalInfo}
          />
        );
      case 2:
        return (
          <JourneyForm
            formData={formData.journey}
            errors={errors}
            onChange={updateJourney}
          />
        );
      case 3:
        return (
          <TeamBondingForm
            formData={formData.teamBonding}
            errors={errors}
            onChange={updateTeamBonding}
          />
        );
      case 4:
        return (
          <FutureForm
            formData={formData.future}
            errors={errors}
            onChange={updateFuture}
          />
        );
      case 5:
        return (
          <BoardReviewForm
            formData={formData.boardReview}
            errors={errors}
            onChange={updateBoardReview}
          />
        );
      case 6:
        return (
          <GeneralFeedbackForm
            formData={formData.generalFeedback}
            errors={errors}
            onChange={updateGeneralFeedback}
          />
        );
      default:
        return null;
    }
  };

  const CurrentIcon = PAGE_ICONS[currentPage - 1];

  return (
    <div className="relative overflow-hidden">
      {/* Moving gradient background with purple accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black animate-gradientMove z-0"></div>
      
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-55 z-0"></div>
      
      {/* Purple dotted pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiM4QjVDRjYiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20 z-0"></div>
      
      {/* Purple glowing orbs in background */}
      <div className="purple-orb-1"></div>
      <div className="purple-orb-2"></div>
      <div className="purple-orb-3"></div>

      <div className="min-h-screen text-white py-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo Image with purple glow */}
          <div className="flex justify-center mb-8 relative">
            <div className="absolute -inset-2 bg-purple-500 opacity-20 blur-xl rounded-full"></div>
            <Image 
              src="https://raw.githubusercontent.com/vinnovateit/.github/main/assets/whiteLogoViit.png" 
              alt="VIIT Logo" 
              width={192}
              height={64}
              className="w-48 h-auto relative z-10"
            />
          </div>

          <div className="bg-black bg-opacity-70 backdrop-filter backdrop-blur-xl shadow-2xl rounded-lg p-8 relative transform transition-all duration-300 hover:shadow-purple-500/30">
            {/* Purple accent border */}
            <div className="absolute inset-0 rounded-lg border border-purple-500 opacity-30"></div>
            
            {/* Purple corner accents */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-purple-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-purple-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-purple-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-purple-500 rounded-br-lg"></div>
            
            {/* Subtle purple glow */}
            <div className="absolute -inset-0.5 bg-purple-900 opacity-10 blur-xl rounded-lg"></div>

            <div className="relative z-10">
                {/* Enhanced Title with Glowing Underline */}
                <div className="relative mb-8 text-center">
                  <h1 className="text-4xl font-extrabold text-purple-400 inline-block relative text-shadow-glow">
                    VinnovateIT Form
                  </h1>
                  {/* Purple glowing underline */}
                  <div className="h-1 w-3/4 mx-auto mt-2 rounded-full bg-gradient-to-r from-purple-400 via-purple-700 to-purple-400 relative overflow-hidden">
                    <div className="absolute -inset-1 blur-md bg-purple-500 opacity-70"></div>
                    <div className="absolute inset-0 animate-pulse-slow bg-purple-300 opacity-50"></div>
                  </div>
                  <p className="text-purple-300 mt-4">Complete all sections to submit your form</p>
                </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <ProgressBar currentPage={currentPage} totalPages={TOTAL_PAGES} />
              </div>

              {/* Page Header */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-500/30">
                  <CurrentIcon className="w-8 h-8 text-purple-400 mr-3" />
                  <h2 className="sm:text-xl lg:text-2xl font-semibold text-purple-300">{PAGE_TITLES[currentPage - 1]}</h2>
                </div>
              </div>

              {localStorageAvailable && (
                <div className="flex justify-center mb-6 h-8"> {/* Fixed height container */}
                  <div className="flex items-center justify-center">
                    <AutoSaveStatus status={autoSaveStatus} lastSavedTime={lastSavedTime} />
                  </div>
                </div>
              )}

              {/* Form Content */}
              <div className="mb-8">
                {renderCurrentPage()}
              </div>

              {/* Navigation */}
              <FormNavigation
                currentPage={currentPage}
                totalPages={TOTAL_PAGES}
                isSubmitting={isSubmitting}
                onPrev={handlePrev}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          {/* Purple accent line at bottom */}
          <div className="w-full max-w-xs mx-auto h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 mt-6"></div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <RestoreDialog
        isOpen={showRestoreDialog}
        onRestore={handleRestoreData}
        onDiscard={handleDiscardData}
        lastSavedTime={lastSavedTime}
      />

      <WarningDialog
        isOpen={showWarningDialog}
        onConfirm={handleConfirmDiscard}
        onCancel={handleCancelDiscard}
        title="Discard Saved Progress?"
        message="Are you sure you want to start fresh? This will permanently delete your saved progress."
        confirmText="Start Fresh"
        cancelText="Keep Progress"
      />

      {/* Purple sparkles */}
      {sparkles}

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradientMove {
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .text-shadow-glow {
          text-shadow: 0 0 15px rgba(167, 139, 250, 0.5);
        }
        
        /* Purple orbs */
        .purple-orb-1, .purple-orb-2, .purple-orb-3 {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          z-index: 1;
          pointer-events: none;
        }
        
        .purple-orb-1 {
          width: 200px;
          height: 200px;
          background-color: rgba(139, 92, 246, 0.2);
          top: 10%;
          left: 5%;
          animation: floatOrb 20s ease-in-out infinite;
        }
        
        .purple-orb-2 {
          width: 300px;
          height: 300px;
          background-color: rgba(139, 92, 246, 0.15);
          bottom: 10%;
          right: 5%;
          animation: floatOrb 25s ease-in-out infinite reverse;
        }
        
        .purple-orb-3 {
          width: 150px;
          height: 150px;
          background-color: rgba(139, 92, 246, 0.25);
          top: 50%;
          right: 20%;
          animation: floatOrb 15s ease-in-out infinite 5s;
        }
        
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(50px, 25px); }
          50% { transform: translate(0, 50px); }
          75% { transform: translate(-50px, 25px); }
        }
        
        /* Purple sparkles */
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.7; transform: scale(1); }
        }
        
        .sparkle {
          position: absolute;
          width: 3px;
          height: 3px;
          background-color: #a78bfa;
          border-radius: 50%;
          pointer-events: none;
          z-index: 2;
        }
      `}</style>
    </div>
  );
}
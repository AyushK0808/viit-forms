"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Download, Users, Search, X, ChevronDown, ChevronUp, Lock, Shield, RefreshCw } from 'lucide-react';

interface FormResponse {
  _id?: string;
  personalInfo: {
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
  };
  journey: {
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
  };
  teamBonding: {
    memberBonding: number;
    likelyToSeekHelp: number;
    clubEnvironment: string;
    likedCharacteristics: string;
    dislikedCharacteristics: string;
    favoriteTeammates: string;
    favoriteTeammatesTraits: string;
    improvementSuggestions: string;
  };
  future: {
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
  };
  boardReview: {
    overallBoardPerformance: number;
    boardCommunication: number;
    boardAccessibility: number;
    boardDecisionMaking: number;
    mostEffectiveBoardMember: string;
    boardImprovementSuggestions: string;
    boardAppreciation: string;
  };
  generalFeedback: {
    overallClubExperience: number;
    recommendToOthers: number;
    additionalComments: string;
    anonymousFeedback: string;
  };
  submittedAt?: string;
  status?: string;
}


export default function AdminDashboard(){
  const secretCode = process.env.NEXT_PUBLIC_SECRET_CODE || '';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const handleAuth = () => {
    if (inputCode === secretCode) {
      setIsAuthenticated(true);
      setError('');
      fetchResponses();
    } else {
      setError('Invalid secret code');
      setInputCode('');
    }
  };

  const fetchResponses = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (filterDomain) params.append('domain', filterDomain);

      // Replace mock API call with actual API call
      const response = await fetch(`/api/dashboard?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${secretCode}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResponses(data.data || []);
        setCurrentPage(data.pagination?.currentPage || 1);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || 0);
      } else {
        throw new Error(data.error || 'Failed to fetch responses');
      }
    } catch (error) {
      console.error('Failed to fetch responses:', error);
      setError(`Failed to load responses: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setResponses([]);
    } finally {
      setLoading(false);
    }
  }, [filterDomain, secretCode]);

  // Filter responses client-side for search
  const filteredResponses = responses.filter(response => {
    const matchesSearch = 
      response.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.personalInfo.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.personalInfo.vitEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const exportToCSV = () => {
    if (filteredResponses.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = [
      'Name', 'Reg Number', 'Year', 'Phone', 'Branch', 'Gender', 'VIT Email', 'Personal Email',
      'Domain', 'Additional Domains', 'Join Month', 'Other Orgs', 'CGPA',
      'Overall Contribution', 'Projects', 'Events', 'Skills Learned', 'Challenges', 'How Changed',
      'Overall Rating', 'Tech Rating', 'Management Rating', 'Design Rating',
      'Member Bonding', 'Likely to Seek Help', 'Club Environment', 'Liked Characteristics', 
      'Disliked Characteristics', 'Favorite Teammates', 'Favorite Teammates Traits', 'Team Improvement Suggestions',
      'Why Joined VinnovateIT', 'Wishlist Fulfillment', 'Commitment Rating', 'Commitment Justification',
      'Leadership Preference', 'Immediate Changes', 'Upcoming Year Changes', 'Preferred Fellow Leaders',
      'Skills to Learn', 'Domains to Explore',
      'Overall Board Performance', 'Board Communication', 'Board Accessibility', 'Board Decision Making',
      'Most Effective Board Member', 'Board Improvement Suggestions', 'Board Appreciation',
      'Overall Club Experience', 'Recommend to Others', 'Additional Comments', 'Anonymous Feedback',
      'Submitted At'
    ];
    
    const csvData = filteredResponses.map(response => [
      response.personalInfo.name,
      response.personalInfo.regNumber,
      response.personalInfo.yearOfStudy,
      response.personalInfo.phoneNumber,
      response.personalInfo.branchSpecialization,
      response.personalInfo.gender,
      response.personalInfo.vitEmail,
      response.personalInfo.personalEmail,
      response.personalInfo.domain,
      response.personalInfo.additionalDomains,
      response.personalInfo.joinMonth,
      response.personalInfo.otherOrganizations,
      response.personalInfo.cgpa,
      response.journey.contribution,
      response.journey.projects,
      response.journey.events,
      response.journey.skillsLearned,
      response.journey.challenges,
      response.journey.howChanged,
      response.journey.overallContribution,
      response.journey.techContribution,
      response.journey.managementContribution,
      response.journey.designContribution,
      response.teamBonding.memberBonding,
      response.teamBonding.likelyToSeekHelp,
      response.teamBonding.clubEnvironment,
      response.teamBonding.likedCharacteristics,
      response.teamBonding.dislikedCharacteristics,
      response.teamBonding.favoriteTeammates,
      response.teamBonding.favoriteTeammatesTraits,
      response.teamBonding.improvementSuggestions,
      response.future.whyJoinedVinnovateIT,
      response.future.wishlistFulfillment,
      response.future.commitmentRating,
      response.future.commitmentJustification,
      response.future.leadershipPreference,
      response.future.immediateChanges,
      response.future.upcomingYearChanges,
      response.future.preferredFellowLeaders,
      response.future.skillsToLearn,
      response.future.domainsToExplore,
      response.boardReview.overallBoardPerformance,
      response.boardReview.boardCommunication,
      response.boardReview.boardAccessibility,
      response.boardReview.boardDecisionMaking,
      response.boardReview.mostEffectiveBoardMember,
      response.boardReview.boardImprovementSuggestions,
      response.boardReview.boardAppreciation,
      response.generalFeedback.overallClubExperience,
      response.generalFeedback.recommendToOthers,
      response.generalFeedback.additionalComments,
      response.generalFeedback.anonymousFeedback,
      response.submittedAt || ''
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viit-form-responses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const uniqueDomains = [...new Set(responses.map(r => r.personalInfo.domain))].filter(Boolean);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      fetchResponses(newPage);
    }
  };

  useEffect(() => {
    if (isAuthenticated && filterDomain !== '') {
      fetchResponses(1);
    }
  }, [filterDomain, isAuthenticated, fetchResponses]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiM4QjVDRjYiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="bg-black/70 backdrop-blur-xl border border-purple-500/30 rounded-lg p-8 w-full max-w-md relative">
          <div className="absolute inset-0 rounded-lg border border-purple-500 opacity-20"></div>
          
          <div className="text-center mb-8 relative z-10">
            <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-purple-300 mb-2">Admin Dashboard</h1>
            <p className="text-purple-400 text-sm">Enter the secret code to access form responses</p>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="relative">
              <input
                type={showCode ? "text" : "password"}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter secret code"
                className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-400/60 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 pr-12"
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
              >
                {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <Lock className="w-5 h-5 inline-block mr-2" />
              Access Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiM4QjVDRjYiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-black/70 backdrop-blur-xl border border-purple-500/30 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-300 mb-2">Admin Dashboard</h1>
              <p className="text-purple-400">VinnovateIT Form Responses</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="bg-purple-900/30 px-4 py-2 rounded-lg border border-purple-500/30">
                <Users className="w-5 h-5 inline-block mr-2 text-purple-400" />
                <span className="text-purple-300 font-semibold">{totalCount}</span>
                <span className="text-purple-400 ml-1">total responses</span>
              </div>
              <button
                onClick={() => fetchResponses(currentPage)}
                disabled={loading}
                className="bg-blue-900/30 hover:bg-blue-800/30 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 inline-block mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="bg-red-900/30 hover:bg-red-800/30 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-black/70 backdrop-blur-xl border border-purple-500/30 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="Search by name, reg number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-purple-400/60 focus:border-purple-400 focus:outline-none"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
              >
                <option value="">All Domains</option>
                {uniqueDomains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
              
              <button
                onClick={exportToCSV}
                disabled={filteredResponses.length === 0}
                className="bg-green-900/30 hover:bg-green-800/30 border border-green-500/30 text-green-300 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5 inline-block mr-2" />
                Export CSV
              </button>
            </div>
            
            {/* Clear Filters */}
            {(searchTerm || filterDomain) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDomain('');
                }}
                className="bg-gray-900/30 hover:bg-gray-800/30 border border-gray-500/30 text-gray-300 px-4 py-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 inline-block mr-2" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-black/70 backdrop-blur-xl border border-purple-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-purple-400 text-sm">
                Page {currentPage} of {totalPages} • Showing {filteredResponses.length} of {totalCount} responses
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className="bg-purple-900/30 hover:bg-purple-800/30 border border-purple-500/30 text-purple-300 px-3 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, currentPage - 2) + i;
                  if (page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={`px-3 py-1 rounded transition-colors ${
                        page === currentPage
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-900/30 hover:bg-purple-800/30 border border-purple-500/30 text-purple-300'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                  className="bg-purple-900/30 hover:bg-purple-800/30 border border-purple-500/30 text-purple-300 px-3 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-black/70 backdrop-blur-xl border border-purple-500/30 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-purple-300">Loading responses...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 mb-6">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => fetchResponses(currentPage)}
              className="mt-4 bg-red-700/30 hover:bg-red-600/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Responses */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredResponses.length === 0 ? (
              <div className="bg-black/70 backdrop-blur-xl border border-purple-500/30 rounded-lg p-8 text-center">
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                <p className="text-purple-300 text-lg mb-2">No responses found</p>
                <p className="text-purple-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredResponses.map((response, index) => (
                <div key={response._id || index} className="bg-black/70 backdrop-blur-xl border border-purple-500/30 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-xl font-semibold text-purple-300">{response.personalInfo.name}</h3>
                        </div>
                        <p className="text-purple-400">{response.personalInfo.regNumber} • {response.personalInfo.yearOfStudy} • {response.personalInfo.domain}</p>
                      </div>
                                            <button
                        onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                        className="bg-purple-900/30 hover:bg-purple-800/30 border border-purple-500/30 text-purple-300 p-2 rounded-lg transition-colors"
                      >
                        {expandedCard === index ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-purple-400">VIT Email</p>
                        <p className="text-white">{response.personalInfo.vitEmail}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-purple-400">Joined</p>
                        <p className="text-white">{response.personalInfo.joinMonth}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-purple-400">CGPA</p>
                        <p className="text-white">{response.personalInfo.cgpa}</p>
                      </div>
                    </div>
                  </div>

                  {expandedCard === index && (
                    <div className="border-t border-purple-500/30 bg-black/50 p-6 space-y-6">
                      {/* Personal Info */}
                      <div>
                        <h4 className="text-lg font-semibold text-purple-300 mb-4 pb-2 border-b border-purple-500/30">
                          Personal Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(response.personalInfo).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <p className="text-purple-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                              <p className="text-white">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Journey */}
                      <div>
                        <h4 className="text-lg font-semibold text-purple-300 mb-4 pb-2 border-b border-purple-500/30">
                          Club Journey
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-purple-400">Overall Contribution</p>
                            <p className="text-white">{response.journey.contribution}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Projects</p>
                            <p className="text-white">{response.journey.projects}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Events</p>
                            <p className="text-white">{response.journey.events}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Skills Learned</p>
                            <p className="text-white">{response.journey.skillsLearned}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Challenges</p>
                            <p className="text-white">{response.journey.challenges}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">How VinnovateIT Changed You</p>
                            <p className="text-white">{response.journey.howChanged}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Overall Contribution</p>
                            <p className="text-2xl font-bold text-purple-300">{response.journey.overallContribution}/10</p>
                          </div>
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Tech Contribution</p>
                            <p className="text-2xl font-bold text-purple-300">{response.journey.techContribution}/10</p>
                          </div>
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Management</p>
                            <p className="text-2xl font-bold text-purple-300">{response.journey.managementContribution}/10</p>
                          </div>
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Design</p>
                            <p className="text-2xl font-bold text-purple-300">{response.journey.designContribution}/10</p>
                          </div>
                        </div>
                      </div>

                      {/* Team Bonding */}
                      <div>
                        <h4 className="text-lg font-semibold text-purple-300 mb-4 pb-2 border-b border-purple-500/30">
                          Team Bonding
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-purple-400">Club Environment</p>
                            <p className="text-white">{response.teamBonding.clubEnvironment}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Liked Characteristics</p>
                            <p className="text-white">{response.teamBonding.likedCharacteristics}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Disliked Characteristics</p>
                            <p className="text-white">{response.teamBonding.dislikedCharacteristics}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Favorite Teammates</p>
                            <p className="text-white">{response.teamBonding.favoriteTeammates}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Favorite Teammates Traits</p>
                            <p className="text-white">{response.teamBonding.favoriteTeammatesTraits}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Improvement Suggestions</p>
                            <p className="text-white">{response.teamBonding.improvementSuggestions}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Member Bonding</p>
                            <p className="text-2xl font-bold text-purple-300">{response.teamBonding.memberBonding}/10</p>
                          </div>
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Likely to Seek Help</p>
                            <p className="text-2xl font-bold text-purple-300">{response.teamBonding.likelyToSeekHelp}/10</p>
                          </div>
                        </div>
                      </div>

                      {/* Future */}
                      <div>
                        <h4 className="text-lg font-semibold text-purple-300 mb-4 pb-2 border-b border-purple-500/30">
                          Future Aspirations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-purple-400">Why Joined VinnovateIT</p>
                            <p className="text-white">{response.future.whyJoinedVinnovateIT}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Wishlist Fulfillment</p>
                            <p className="text-white">{response.future.wishlistFulfillment}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Commitment Justification</p>
                            <p className="text-white">{response.future.commitmentJustification}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Leadership Preference</p>
                            <p className="text-white">{response.future.leadershipPreference}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Immediate Changes</p>
                            <p className="text-white">{response.future.immediateChanges}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Upcoming Year Changes</p>
                            <p className="text-white">{response.future.upcomingYearChanges}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Preferred Fellow Leaders</p>
                            <p className="text-white">{response.future.preferredFellowLeaders}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Skills to Learn</p>
                            <p className="text-white">{response.future.skillsToLearn}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Domains to Explore</p>
                            <p className="text-white">{response.future.domainsToExplore}</p>
                          </div>
                        </div>
                        <div className="mt-4 bg-purple-900/20 p-4 rounded-lg border border-purple-500/30 max-w-xs">
                          <p className="text-purple-400">Commitment Rating</p>
                          <p className="text-2xl font-bold text-purple-300">{response.future.commitmentRating}/10</p>
                        </div>
                      </div>

                      {/* Board Review */}
                      <div>
                        <h4 className="text-lg font-semibold text-purple-300 mb-4 pb-2 border-b border-purple-500/30">
                          Board Review
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-purple-400">Most Effective Board Member</p>
                            <p className="text-white">{response.boardReview.mostEffectiveBoardMember}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Improvement Suggestions</p>
                            <p className="text-white">{response.boardReview.boardImprovementSuggestions}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Appreciation</p>
                            <p className="text-white">{response.boardReview.boardAppreciation}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Overall Performance</p>
                            <p className="text-2xl font-bold text-purple-300">{response.boardReview.overallBoardPerformance}/10</p>
                          </div>
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Communication</p>
                            <p className="text-2xl font-bold text-purple-300">{response.boardReview.boardCommunication}/10</p>
                          </div>
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Accessibility</p>
                            <p className="text-2xl font-bold text-purple-300">{response.boardReview.boardAccessibility}/10</p>
                          </div>
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Decision Making</p>
                            <p className="text-2xl font-bold text-purple-300">{response.boardReview.boardDecisionMaking}/10</p>
                          </div>
                        </div>
                      </div>

                      {/* General Feedback */}
                      <div>
                        <h4 className="text-lg font-semibold text-purple-300 mb-4 pb-2 border-b border-purple-500/30">
                          General Feedback
                        </h4>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="text-purple-400">Additional Comments</p>
                            <p className="text-white">{response.generalFeedback.additionalComments}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-purple-400">Anonymous Feedback</p>
                            <p className="text-white">{response.generalFeedback.anonymousFeedback}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Overall Club Experience</p>
                            <p className="text-2xl font-bold text-purple-300">{response.generalFeedback.overallClubExperience}/10</p>
                          </div>
                          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <p className="text-purple-400">Recommend to Others</p>
                            <p className="text-2xl font-bold text-purple-300">{response.generalFeedback.recommendToOthers}/10</p>
                          </div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="pt-4 border-t border-purple-500/30 text-sm text-purple-400">
                        <p>Submitted: {response.submittedAt ? new Date(response.submittedAt).toLocaleString() : 'N/A'}</p>
                        <p>Status: {response.status || 'active'}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

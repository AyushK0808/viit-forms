"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Poppins } from 'next/font/google';
import { BackgroundBeamsWithCollision } from './components/bgwithcollisions';

// Define font
const poppins = Poppins({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

// Define form data interface
interface MemberFormData {
  name: string;
  phoneNumber: string;
  email: string;
  regNo: string;
  gender: string;
  birthdate: string;
  quirkyDetail: string;
}

// Define toast notification interface
interface ToastNotification {
  show: boolean;
  message: string;
  type: string;
}

// Define validation errors interface
interface ValidationErrors {
  name?: string;
  phoneNumber?: string;
  email?: string;
  regNo?: string;
}

// Define member interface
interface Member {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  regNo: string;
  gender: string;
  birthdate: string;
  quirkyDetail: string;
  createdAt: string;
  __v: number;
}

export default function Home() {
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    phoneNumber: '',
    email: '',
    regNo: '',
    gender: '',
    birthdate: '',
    quirkyDetail: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastNotification>({ show: false, message: '', type: '' });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [existingMembers, setExistingMembers] = useState<Member[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // Fetch existing members on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/members', {
          method: 'GET',
        });
        
        const data = await res.json();
        
        if (data.success && Array.isArray(data.data)) {
          setExistingMembers(data.data);
        } else {
          console.error('Failed to fetch members or invalid data format');
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    fetchMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is modified
    if (errors[name as keyof ValidationErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Hide toast after 5 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;
    
    // Regex patterns
    const nameRegex = /^[a-zA-Z ]{2,50}$/;
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regNoRegex = /^[a-zA-Z0-9-]{3,15}$/;
    
    // Name validation
    if (!nameRegex.test(formData.name)) {
      newErrors.name = "Please enter a valid name (2-50 alphabetic characters)";
      isValid = false;
    }
    
    // Phone validation
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number starting with 6-9";
      isValid = false;
    }
    
    // Email validation
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Reg No validation
    if (!regNoRegex.test(formData.regNo)) {
      newErrors.regNo = "Please enter a valid registration number (3-15 alphanumeric characters)";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Check if registration number already exists
  const checkRegNoExists = (regNo: string): boolean => {
    return existingMembers.some(member => member.regNo === regNo);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      setToast({ 
        show: true, 
        message: 'Please fix the errors in the form', 
        type: 'error'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if registration number already exists using our local state
      const regNoExists = checkRegNoExists(formData.regNo);
      
      if (regNoExists) {
        setToast({ 
          show: true, 
          message: 'This registration number has already been registered', 
          type: 'error'
        });
        setIsSubmitting(false);
        return;
      }
      
      // If not exists, proceed with submission
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      // Add the new member to our local state
      if (data.success && data.data) {
        setExistingMembers([...existingMembers, data.data]);
      }
      
      setToast({ 
        show: true, 
        message: 'Member details saved successfully!', 
        type: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        phoneNumber: '',
        email: '',
        regNo: '',
        gender: '',
        birthdate: '',
        quirkyDetail: '',
      });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setToast({ 
        show: true, 
        message: errorMessage, 
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* BackgroundBeams positioned with lower z-index */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeamsWithCollision className="h-full">
          {/* Empty div to satisfy children prop requirement */}
          <div></div>
        </BackgroundBeamsWithCollision>
      </div>

      <div className={`min-h-screen w-screen text-white ${poppins.className} relative z-10`}>
        {/* Moving gradient background with purple accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black animate-gradientMove z-0"></div>
        
        {/* Slightly reduced black overlay to let purple pop */}
        <div className="absolute inset-0 bg-black opacity-55 z-0"></div>
        
        {/* Purple dotted pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiM4QjVDRjYiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20 z-0"></div>
        
        {/* Purple glowing orbs in background */}
        <div className="purple-orb-1"></div>
        <div className="purple-orb-2"></div>
        <div className="purple-orb-3"></div>
        
        <Head>
          <title>Core Member Registration</title>
          <meta name="description" content="Register core member details" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Toast Notification */}
        {toast.show && (
          <div 
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-bounce ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } z-50 max-w-md font-poppins`}
          >
            <p className="font-bold">{toast.message}</p>
          </div>
        )}

        <main className="container mx-auto px-4 py-12 md:max-w-2xl lg:max-w-4xl xl:max-w-5xl relative z-20">
          {/* Loading overlay while fetching initial data */}
          {isInitialLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-lg border border-purple-500 flex flex-col items-center">
                <div className="loader-ring w-12 h-12 border-4"></div>
                <p className="mt-4 text-purple-300">Loading member data...</p>
              </div>
            </div>
          )}
          
          {/* Logo Image with purple glow */}
          <div className="flex justify-center mb-8 relative">
            <div className="absolute -inset-2 bg-purple-500 opacity-20 blur-xl rounded-full"></div>
            <img 
              src="https://raw.githubusercontent.com/vinnovateit/.github/main/assets/whiteLogoViit.png" 
              alt="VIIT Logo" 
              className="w-48 h-auto relative z-10"
            />
          </div>
          
          {/* Enhanced Title with Glowing Underline */}
          <div className="relative mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-purple-400 font-poppins inline-block relative text-shadow-glow">
              Core Member Registration
            </h1>
            {/* Purple glowing underline */}
            <div className="h-1 w-3/4 mx-auto mt-2 rounded-full bg-gradient-to-r from-purple-400 via-purple-700 to-purple-400 relative overflow-hidden">
              <div className="absolute -inset-1 blur-md bg-purple-500 opacity-70"></div>
              <div className="absolute inset-0 animate-pulse-slow bg-purple-300 opacity-50"></div>
            </div>
          </div>
          
          {/* Form with Black Background and Purple Accent Border */}
          <form 
            onSubmit={handleSubmit} 
            className="bg-black bg-opacity-70 backdrop-filter backdrop-blur-xl shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4 relative transform transition-all duration-300 hover:shadow-purple-500/30 z-30"
          >
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
              <div className="md:grid md:grid-cols-2 md:gap-6">
                <div className="mb-4 transform transition-all duration-300 hover:translate-x-2 group">
                  <label className="block text-purple-300 text-sm font-bold mb-2 font-poppins" htmlFor="name">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      className={`shadow appearance-none border ${errors.name ? 'border-red-500' : 'border-purple-500/30'} bg-black bg-opacity-60 backdrop-blur-sm rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 font-poppins`}
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                    <div className="absolute inset-0 border border-purple-500/0 rounded-lg group-hover:border-purple-500/30 transition-all duration-300 pointer-events-none"></div>
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4 transform transition-all duration-300 hover:translate-x-2 group">
                  <label className="block text-purple-300 text-sm font-bold mb-2 font-poppins" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      className={`shadow appearance-none border ${errors.phoneNumber ? 'border-red-500' : 'border-purple-500/30'} bg-black bg-opacity-60 backdrop-blur-sm rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 font-poppins`}
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      placeholder="Your phone number"
                    />
                    <div className="absolute inset-0 border border-purple-500/0 rounded-lg group-hover:border-purple-500/30 transition-all duration-300 pointer-events-none"></div>
                    {errors.phoneNumber && (
                      <p className="text-red-400 text-xs mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:grid md:grid-cols-2 md:gap-6">
                <div className="mb-4 transform transition-all duration-300 hover:translate-x-2 group">
                  <label className="block text-purple-300 text-sm font-bold mb-2 font-poppins" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className={`shadow appearance-none border ${errors.email ? 'border-red-500' : 'border-purple-500/30'} bg-black bg-opacity-60 backdrop-blur-sm rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 font-poppins`}
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Your email"
                    />
                    <div className="absolute inset-0 border border-purple-500/0 rounded-lg group-hover:border-purple-500/30 transition-all duration-300 pointer-events-none"></div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4 transform transition-all duration-300 hover:translate-x-2 group">
                  <label className="block text-purple-300 text-sm font-bold mb-2 font-poppins" htmlFor="regNo">
                    Registration Number
                  </label>
                  <div className="relative">
                    <input
                      className={`shadow appearance-none border ${errors.regNo ? 'border-red-500' : 'border-purple-500/30'} bg-black bg-opacity-60 backdrop-blur-sm rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 font-poppins`}
                      id="regNo"
                      type="text"
                      name="regNo"
                      value={formData.regNo}
                      onChange={handleChange}
                      required
                      placeholder="Your registration number"
                    />
                    <div className="absolute inset-0 border border-purple-500/0 rounded-lg group-hover:border-purple-500/30 transition-all duration-300 pointer-events-none"></div>
                    {errors.regNo && (
                      <p className="text-red-400 text-xs mt-1">{errors.regNo}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:grid md:grid-cols-2 md:gap-6">
                <div className="mb-4 transform transition-all duration-300 hover:translate-x-2 group">
                  <label className="block text-purple-300 text-sm font-bold mb-2 font-poppins" htmlFor="gender">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      className="shadow appearance-none border border-purple-500/30 bg-black bg-opacity-60 backdrop-blur-sm rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 font-poppins"
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-0 border border-purple-500/0 rounded-lg group-hover:border-purple-500/30 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="mb-4 transform transition-all duration-300 hover:translate-x-2 group">
  <label className="block text-purple-300 text-sm font-bold mb-2 font-poppins" htmlFor="birthdate">
    Birth Date
  </label>
  <div className="relative">
    <input 
      type="date" 
      name="birthdate" 
      id="birthdate"
      value={formData.birthdate} 
      onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
      required
      className={`shadow appearance-none border border-purple-500/30 bg-black bg-opacity-60 backdrop-blur-sm rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 font-poppins`}
    />
    <div className="absolute right-3 top-2.5 pointer-events-none text-purple-300">
      📅
    </div>
  </div>
</div>
</div>

              
              <div className="mb-6 transform transition-all duration-300 hover:translate-x-2 group">
                <label className="block text-purple-300 text-sm font-bold mb-2 font-poppins" htmlFor="quirkyDetail">
                  One Quirky Detail
                </label>
                <div className="relative">
                  <textarea
                    className="shadow appearance-none border border-purple-500/30 bg-black bg-opacity-60 backdrop-blur-sm rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 h-24 font-poppins"
                    id="quirkyDetail"
                    name="quirkyDetail"
                    value={formData.quirkyDetail}
                    onChange={handleChange}
                    required
                    placeholder="Share something interesting about yourself!"
                  />
                  <div className="absolute inset-0 border border-purple-500/0 rounded-lg group-hover:border-purple-500/30 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Purple glow behind button */}
                  <div className="absolute inset-0 bg-purple-600 opacity-20 blur-md rounded-full"></div>
                  
                  <button
                    className={`bg-gradient-to-r from-black to-purple-800 hover:from-purple-900 hover:to-black text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transform transition-all duration-300 hover:scale-105 hover:rotate-1 relative overflow-hidden group shadow-lg shadow-purple-900/50 font-poppins tracking-wider backdrop-blur-sm border border-purple-500/30`}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span className="relative z-10 uppercase">
                      {isSubmitting ? 'Processing...' : 'Register'}
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    
                    {/* Improved loading animation with purple */}
                    {isSubmitting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="loader-ring"></div>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
          
          {/* Purple accent line at bottom */}
          <div className="w-full max-w-xs mx-auto h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 mt-6"></div>
        </main>

        {/* Custom animation for background, text glow, and loader */}
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
          
          /* Loader animations with purple color */
          .loader-ring {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(167, 139, 250, 0.3);
            border-radius: 50%;
            border-top-color: rgb(167, 139, 250);
            animation: spin 0.8s ease-in-out infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
          
          /* Input focus effect */
          input:focus, select:focus, textarea:focus {
            box-shadow: 0 0 0 2px rgba(139, 92,246, 0.5);
          }
        `}</style>
        
        {/* Purple sparkles */}
        {Array.from({ length: 30 }).map((_, index) => (
          <div 
            key={index}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `sparkle ${3 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
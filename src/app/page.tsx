"use client"

import React from 'react';
import { Lock} from 'lucide-react';

export default function FormClosed() {
  return (
    <div className="relative overflow-hidden min-h-screen">
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

      <div className="min-h-screen text-white py-12 px-4 relative z-10 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo Image with purple glow */}
          <div className="flex justify-center mb-8 relative">
            <div className="absolute -inset-2 bg-purple-500 opacity-20 blur-xl rounded-full"></div>
            <img 
              src="https://raw.githubusercontent.com/vinnovateit/.github/main/assets/whiteLogoViit.png" 
              alt="VIIT Logo" 
              className="w-48 h-auto relative z-10"
            />
          </div>

          <div className="bg-black bg-opacity-70 backdrop-filter backdrop-blur-xl shadow-2xl rounded-lg p-12 relative transform transition-all duration-300 hover:shadow-purple-500/30">
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
              {/* Lock Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-purple-900/30 rounded-full border border-purple-500/30">
                  <Lock className="w-12 h-12 text-purple-400" />
                </div>
              </div>

              {/* Main Title */}
              <div className="relative mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-purple-400 inline-block relative text-shadow-glow mb-4">
                  Form is Closed
                </h1>
                {/* Purple glowing underline */}
                <div className="h-1 w-3/4 mx-auto mt-2 rounded-full bg-gradient-to-r from-purple-400 via-purple-700 to-purple-400 relative overflow-hidden">
                  <div className="absolute -inset-1 blur-md bg-purple-500 opacity-70"></div>
                  <div className="absolute inset-0 animate-pulse-slow bg-purple-300 opacity-50"></div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-6 text-lg">
                <p className="text-purple-200 leading-relaxed">
                  We are no longer accepting new responses for the VinnovateIT form.
                </p>
                
                {/* Divider */}
                <div className="flex items-center justify-center my-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-full max-w-xs"></div>
                </div>

                <div className="flex items-center justify-center mb-4">
                  <p className="text-purple-200 text-xl font-medium">
                    If you have already submitted, we are reviewing all responses.
                  </p>
                </div>

                <p className="text-purple-300 text-base">
                  Thank you for being a valuable member of the VinnovateIT family.
                </p>
              </div>
            </div>
          </div>

          {/* Purple accent line at bottom */}
          <div className="w-full max-w-xs mx-auto h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 mt-8"></div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
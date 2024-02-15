import { useState } from "react";

export default function HelpButton({helpText}) {
    const [showHelp, setShowHelp] = useState(false);
    
    return (
      <div className="relative inline-block px-1 py-1">
        <button onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}>          
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
        </button>
  
        {showHelp && (
          <div className="absolute left-0 w-48 bg-gray-200 text-gray-800 rounded-md shadow-lg z-10">
            <div className="px-4 py-4">
              <p className="text-sm">
                {helpText}  
              </p>
            </div>
          </div>
        )}
      </div>
  
    );
  }
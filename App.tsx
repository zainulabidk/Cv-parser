
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResumeForm } from './components/ResumeForm';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import { ResumeData } from './types';
import { parseResume } from './services/geminiService';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResumeData(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        if (base64String) {
          try {
            const data = await parseResume(file.type, base64String);
            setResumeData(data);
          } catch (e) {
            if (e instanceof Error) {
              setError(e.message);
            } else {
              setError('An unknown error occurred during parsing.');
            }
          } finally {
            setIsLoading(false);
          }
        }
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
        setIsLoading(false);
      };
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setResumeData(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            AI Resume Parser
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Upload your resume and let AI pre-fill the form for you.
          </p>
        </header>

        <main className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <SpinnerIcon />
              <p className="mt-4 text-lg text-gray-300">Analyzing your resume...</p>
              <p className="text-sm text-gray-500">This might take a moment.</p>
            </div>
          ) : error ? (
            <div className="text-center h-64 flex flex-col justify-center items-center">
              <p className="text-red-400 text-lg">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : resumeData ? (
            <ResumeForm initialData={resumeData} onReset={handleReset} />
          ) : (
            <FileUpload onFileChange={handleFileChange} />
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;

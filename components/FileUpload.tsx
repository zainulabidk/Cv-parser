
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileChange: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      // Supported types: PDF, DOCX, TXT
      if (['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
        onFileChange(file);
      } else {
        alert("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
      }
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files);
  }, [onFileChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files);
  };

  return (
    <div className="flex flex-col items-center">
      <label
        htmlFor="resume-upload"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700'}`}
      >
        <UploadIcon />
        <p className="mt-4 text-lg font-semibold text-gray-300">Drag & drop your resume here</p>
        <p className="text-gray-500">or</p>
        <p className="mt-1 text-blue-400 font-medium">Click to browse</p>
        <p className="mt-2 text-xs text-gray-500">PDF, DOCX, or TXT</p>
      </label>
      <input
        id="resume-upload"
        type="file"
        className="hidden"
        accept=".pdf,.docx,.txt"
        onChange={handleChange}
      />
    </div>
  );
};

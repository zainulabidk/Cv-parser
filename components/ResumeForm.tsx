
import React, { useState } from 'react';
import { ResumeData, WorkExperience, Education } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { SparklesIcon } from './icons/SparklesIcon';


interface ResumeFormProps {
  initialData: ResumeData;
  onReset: () => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ initialData, onReset }) => {
  const [formData, setFormData] = useState<ResumeData>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newExperience = [...formData.workExperience];
    newExperience[index] = { ...newExperience[index], [name]: value };
    setFormData(prev => ({ ...prev, workExperience: newExperience }));
  };

  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [name]: value };
    setFormData(prev => ({ ...prev, education: newEducation }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Form data has been logged to the console.");
  };

  const FormSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4 flex items-center">
        {icon}
        <span className="ml-3">{title}</span>
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = ({ label, name, value, onChange, type = "text" }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <input type={type} id={name} name={name} value={value} onChange={onChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
    </div>
  );
  
  const TextAreaField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ label, name, value, onChange, rows = 4 }) => (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
      </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-100">Your Details</h2>
          <button type="button" onClick={onReset} className="text-sm text-gray-400 hover:text-white transition">Start Over</button>
      </div>
      
      <FormSection title="Personal Information" icon={<UserIcon />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} />
          <InputField label="Email" name="email" value={formData.email} onChange={handleInputChange} type="email" />
          <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
          <InputField label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} />
          <InputField label="Website/Portfolio URL" name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} />
        </div>
        <TextAreaField label="Summary" name="summary" value={formData.summary} onChange={handleInputChange} rows={5}/>
      </FormSection>

      <FormSection title="Skills" icon={<SparklesIcon />}>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span key={index} className="bg-gray-700 text-teal-300 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
          ))}
        </div>
      </FormSection>

      <FormSection title="Work Experience" icon={<BriefcaseIcon />}>
        {formData.workExperience.map((exp, index) => (
          <div key={index} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <InputField label="Company" name="company" value={exp.company} onChange={e => handleExperienceChange(index, e)} />
              <InputField label="Title" name="title" value={exp.title} onChange={e => handleExperienceChange(index, e)} />
              <InputField label="Start Date" name="startDate" value={exp.startDate} onChange={e => handleExperienceChange(index, e)} />
              <InputField label="End Date" name="endDate" value={exp.endDate} onChange={e => handleExperienceChange(index, e)} />
            </div>
            <TextAreaField label="Description" name="description" value={exp.description} onChange={e => handleExperienceChange(index, e)} />
          </div>
        ))}
      </FormSection>

      <FormSection title="Education" icon={<AcademicCapIcon />}>
        {formData.education.map((edu, index) => (
          <div key={index} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Institution" name="institution" value={edu.institution} onChange={e => handleEducationChange(index, e)} />
                <InputField label="Degree" name="degree" value={edu.degree} onChange={e => handleEducationChange(index, e)} />
                <InputField label="Start Date" name="startDate" value={edu.startDate} onChange={e => handleEducationChange(index, e)} />
                <InputField label="End Date" name="endDate" value={edu.endDate} onChange={e => handleEducationChange(index, e)} />
            </div>
          </div>
        ))}
      </FormSection>

      <div className="mt-8 flex justify-end">
        <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105">
          Save Details
        </button>
      </div>
    </form>
  );
};

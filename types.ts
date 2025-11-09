
export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phoneNumber: string;
  linkedinUrl: string;
  websiteUrl: string;
  summary: string;
  skills: string[];
  workExperience: WorkExperience[];
  education: Education[];
}


import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING, description: "Full name of the candidate." },
    email: { type: Type.STRING, description: "Email address of the candidate." },
    phoneNumber: { type: Type.STRING, description: "Phone number of the candidate." },
    linkedinUrl: { type: Type.STRING, description: "URL to the candidate's LinkedIn profile." },
    websiteUrl: { type: Type.STRING, description: "URL to the candidate's personal website or portfolio." },
    summary: { type: Type.STRING, description: "A brief summary or objective from the resume." },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of skills mentioned in the resume."
    },
    workExperience: {
      type: Type.ARRAY,
      description: "A list of work experiences.",
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          title: { type: Type.STRING },
          startDate: { type: Type.STRING, description: "Format as 'Month YYYY' or 'YYYY-MM-DD'." },
          endDate: { type: Type.STRING, description: "Format as 'Month YYYY', 'YYYY-MM-DD', or 'Present'." },
          description: { type: Type.STRING, description: "Description of responsibilities and achievements." }
        },
        required: ["company", "title", "startDate", "endDate", "description"]
      }
    },
    education: {
      type: Type.ARRAY,
      description: "A list of educational qualifications.",
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          startDate: { type: Type.STRING, description: "Format as 'Month YYYY' or 'YYYY-MM-DD'." },
          endDate: { type: Type.STRING, description: "Format as 'Month YYYY' or 'YYYY-MM-DD'." }
        },
        required: ["institution", "degree", "startDate", "endDate"]
      }
    }
  },
  required: ["fullName", "email", "summary", "skills", "workExperience", "education"]
};


export const parseResume = async (fileMimeType: string, fileBase64: string): Promise<ResumeData> => {
  try {
    const filePart = {
      inlineData: {
        mimeType: fileMimeType,
        data: fileBase64,
      },
    };

    const textPart = {
      text: "Analyze the provided resume document. Extract all relevant information and structure it precisely according to the provided JSON schema. Pay close attention to dates, job descriptions, and educational details. If a field like a website URL is not present, return an empty string for it."
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [filePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData: ResumeData = JSON.parse(jsonText);
    return parsedData;

  } catch (error) {
    console.error("Error parsing resume with Gemini API:", error);
    throw new Error("Failed to parse resume. The document might be in an unsupported format or corrupted.");
  }
};

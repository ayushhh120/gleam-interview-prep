import { useState } from 'react';
import ResumeForm from '@/components/ResumeForm';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    location: '',
    skill: [],
    summary: '',
    experience: [],
    education: [],
    projects: '',
    socialLinks: []
  });

  return (
    <div className="min-h-screen gradient-hero p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            📄 AI Resume Builder
          </h1>
          <p className="text-muted-foreground">
            Create your professional resume with AI assistance
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <ResumeForm formData={formData} setFormData={setFormData} />
          
          <div className="glassmorphic card-glow animate-fade-in">
            <div className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">📋 Resume Preview</h2>
              <div id="resume-preview" className="bg-white/5 rounded-xl p-6 min-h-[600px] border border-white/10">
                {/* Resume Preview Content */}
                <div className="text-foreground space-y-4">
                  {formData.name && (
                    <div className="text-center border-b border-white/20 pb-4">
                      <h1 className="text-2xl font-bold">{formData.name}</h1>
                      {formData.jobTitle && <p className="text-lg text-muted-foreground">{formData.jobTitle}</p>}
                      <div className="flex justify-center gap-4 text-sm text-muted-foreground mt-2">
                        {formData.email && <span>{formData.email}</span>}
                        {formData.phone && <span>{formData.phone}</span>}
                        {formData.location && <span>{formData.location}</span>}
                      </div>
                    </div>
                  )}
                  
                  {formData.summary && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Summary</h2>
                      <p className="text-sm text-muted-foreground">{formData.summary}</p>
                    </div>
                  )}
                  
                  {formData.skill.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {formData.skill.map((skill, index) => (
                          <span key={index} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.experience.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Experience</h2>
                      {formData.experience.map((exp, index) => (
                        <div key={index} className="mb-3">
                          <h3 className="font-medium">{exp.role}</h3>
                          <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formData.education.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Education</h2>
                      {formData.education.map((edu, index) => (
                        <div key={index} className="mb-2">
                          <h3 className="font-medium">{edu.degree}</h3>
                          <p className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formData.projects && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Projects</h2>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{formData.projects}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Sparkles, Download, Loader2 } from "lucide-react";
import axios from 'axios';
import html2pdf from 'html2pdf.js';

interface ResumeFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    location: string;
    skill: string[];
    summary: string;
    experience: Array<{
      role: string;
      company: string;
      duration: string;
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
    projects: string;
    socialLinks: Array<{
      platform: string;
      url: string;
    }>;
  };
  setFormData: (data: any) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ formData, setFormData }) => {
  const [showSocialInput, setShowSocialInput] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState("");
  const [currentLink, setCurrentLink] = useState("");
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentDuration, setCurrentDuration] = useState("");
  const [currentDegree, setCurrentDegree] = useState("");
  const [currentInstitution, setCurrentInstitution] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);

  const skillSuggestions = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "React", "Next.js", "Angular", "Vue.js",
    "Node.js", "Express", "Django", "Flask", "MongoDB", "MySQL", "PostgreSQL", "AWS", "Docker",
    "Kubernetes", "Git", "HTML", "CSS", "Tailwind", "Bootstrap", "GraphQL", "REST API",
    "Machine Learning", "Data Analysis", "UI/UX Design", "Project Management", "Agile", "Scrum"
  ];

  const handleSkillInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentSkill(value);

    if (value.trim() === "") {
      setFilteredSkills([]);
      return;
    }

    const filtered = skillSuggestions.filter((skill) =>
      skill.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSkills(filtered);
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() === "") return;
    setFormData({
      ...formData,
      skill: [...formData.skill, currentSkill.trim()],
    });
    setCurrentSkill("");
    setFilteredSkills([]);
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...formData.skill];
    updatedSkills.splice(index, 1);
    setFormData({ ...formData, skill: updatedSkills });
  };

  const selectSkillFromSuggestion = (skill: string) => {
    setFormData({
      ...formData,
      skill: [...formData.skill, skill],
    });
    setCurrentSkill("");
    setFilteredSkills([]);
  };

  const handleAddExperience = () => {
    if (!currentRole || !currentCompany || !currentDuration) return;
    const newExp = {
      role: currentRole,
      company: currentCompany,
      duration: currentDuration,
    };
    setFormData({
      ...formData,
      experience: [...formData.experience, newExp],
    });
    setCurrentRole("");
    setCurrentCompany("");
    setCurrentDuration("");
  };

  const handleRemoveExperience = (index: number) => {
    const updated = [...formData.experience];
    updated.splice(index, 1);
    setFormData({ ...formData, experience: updated });
  };

  const handleAddEducation = () => {
    if (!currentDegree || !currentInstitution || !currentYear) return;
    const newEdu = {
      degree: currentDegree,
      institution: currentInstitution,
      year: currentYear,
    };
    setFormData({
      ...formData,
      education: [...formData.education, newEdu],
    });
    setCurrentDegree("");
    setCurrentInstitution("");
    setCurrentYear("");
  };

  const handleRemoveEducation = (index: number) => {
    const updated = [...formData.education];
    updated.splice(index, 1);
    setFormData({ ...formData, education: updated });
  };

  const handleAddSocialLink = () => {
    if (currentPlatform && currentLink) {
      const newLinks = [
        ...formData.socialLinks,
        { platform: currentPlatform, url: currentLink },
      ];
      setFormData({ ...formData, socialLinks: newLinks });
      setCurrentPlatform("");
      setCurrentLink("");
      setShowSocialInput(false);
    }
  };

  const handleRemoveSocialLink = (idx: number) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks.splice(idx, 1);
    setFormData({ ...formData, socialLinks: updatedLinks });
  };

  const generateSummary = async () => {
    if (!formData.jobTitle || !formData.skill.length) {
      alert("Please enter your job title and skills before generating summary.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ai/summary`,
        {
          jobTitle: formData.jobTitle,
          skills: formData.skill.join(", "),
        }
      );
      setFormData({ ...formData, summary: response.data.summary });
    } catch (err) {
      console.error("AI Summary generation failed:", err);
      const errorMsg = err?.response?.data?.error || "Something went wrong while generating summary";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    setDownloading(true);

    const element = document.getElementById('resume-preview');
    if (!element) {
      alert('Resume preview not found!');
      setDownloading(false);
      return;
    }

    const opt = {
      margin: 0.3,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 2 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setDownloading(false);
    }).catch((err) => {
      console.error("PDF download failed", err);
      setDownloading(false);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Personal Details */}
      <Card className="glassmorphic card-glow border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground tracking-wide">
            👤 Personal Details
          </CardTitle>
          <p className="text-sm text-muted-foreground">Enter your basic information</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Full Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">Job Title</Label>
              <Input
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="e.g. Frontend Developer"
                className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
                className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="glassmorphic card-glow border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground tracking-wide">
            🔧 Skills
          </CardTitle>
          <p className="text-sm text-muted-foreground">Add your technical and professional skills</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={currentSkill}
                  onChange={handleSkillInput}
                  placeholder="Type a skill..."
                  className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
                />
                
                {filteredSkills.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-10 max-h-40 overflow-auto">
                    {filteredSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSkillFromSuggestion(skill)}
                        className="px-3 py-2 cursor-pointer hover:bg-white/10 text-foreground text-sm transition-smooth"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={handleAddSkill}
                className="gradient-button hover:scale-105 transition-smooth"
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.skill.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm border border-primary/30 animate-scale-in"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="glassmorphic card-glow border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-foreground tracking-wide">
                📝 Professional Summary
              </CardTitle>
              <p className="text-sm text-muted-foreground">Describe your professional background</p>
            </div>
            <Button
              onClick={generateSummary}
              disabled={loading || !formData.jobTitle || !formData.skill.length}
              className="gradient-button hover:scale-105 transition-smooth"
              size="sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate with AI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Write your professional summary or use AI to generate one..."
              className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth min-h-32 resize-none"
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Generating with AI...</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="glassmorphic card-glow border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground tracking-wide">
            💼 Experience
            <span className="text-sm text-muted-foreground font-normal ml-2">(optional)</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Add your work experience</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Input
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="Job Title (e.g. Frontend Developer)"
              className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
            />
            <Input
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
              placeholder="Company Name"
              className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
            />
            <Input
              value={currentDuration}
              onChange={(e) => setCurrentDuration(e.target.value)}
              placeholder="Duration (e.g. Jan 2022 - Present)"
              className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
            />
            <Button
              onClick={handleAddExperience}
              className="gradient-button hover:scale-105 transition-smooth w-fit"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>

          <div className="space-y-3">
            {formData.experience.map((exp, index) => (
              <div
                key={index}
                className="glassmorphic border border-white/20 p-4 rounded-lg flex justify-between items-start animate-scale-in"
              >
                <div>
                  <h3 className="font-semibold text-foreground">{exp.role}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground">{exp.duration}</p>
                </div>
                <button
                  onClick={() => handleRemoveExperience(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="glassmorphic card-glow border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground tracking-wide">
            🎓 Education
          </CardTitle>
          <p className="text-sm text-muted-foreground">Add your educational background</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Input
              value={currentDegree}
              onChange={(e) => setCurrentDegree(e.target.value)}
              placeholder="Degree (e.g. Bachelor of Computer Science)"
              className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
            />
            <Input
              value={currentInstitution}
              onChange={(e) => setCurrentInstitution(e.target.value)}
              placeholder="Institution Name"
              className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
            />
            <Input
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              placeholder="Year (e.g. 2024)"
              className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth"
            />
            <Button
              onClick={handleAddEducation}
              className="gradient-button hover:scale-105 transition-smooth w-fit"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>

          <div className="space-y-3">
            {formData.education.map((edu, index) => (
              <div
                key={index}
                className="glassmorphic border border-white/20 p-4 rounded-lg flex justify-between items-start animate-scale-in"
              >
                <div>
                  <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">{edu.year}</p>
                </div>
                <button
                  onClick={() => handleRemoveEducation(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="glassmorphic card-glow border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground tracking-wide">
            🚀 Projects
            <span className="text-sm text-muted-foreground font-normal ml-2">(optional)</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Describe your notable projects</p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.projects}
            onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
            placeholder="Describe your projects, achievements, and key accomplishments..."
            className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth min-h-32 resize-none"
          />
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="glassmorphic card-glow border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground tracking-wide">
            🔗 Social Links
            <span className="text-sm text-muted-foreground font-normal ml-2">(optional)</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Add your professional social profiles</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {showSocialInput ? (
            <div className="flex gap-2">
              <select
                value={currentPlatform}
                onChange={(e) => setCurrentPlatform(e.target.value)}
                className="glassmorphic border-white/20 text-foreground bg-background px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary/50 transition-smooth"
              >
                <option value="">Select Platform</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="GitHub">GitHub</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Twitter">Twitter</option>
              </select>
              <Input
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                placeholder="Paste URL"
                className="glassmorphic border-white/20 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition-smooth flex-1"
              />
              <Button
                onClick={handleAddSocialLink}
                className="gradient-button hover:scale-105 transition-smooth"
                size="sm"
              >
                Add
              </Button>
              <Button
                onClick={() => setShowSocialInput(false)}
                variant="outline"
                size="sm"
                className="border-white/20 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowSocialInput(true)}
              variant="outline"
              className="border-white/20 hover:bg-white/10 text-primary hover:text-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          )}

          <div className="space-y-2">
            {formData.socialLinks.map((link, idx) => (
              <div
                key={idx}
                className="glassmorphic border border-white/20 p-3 rounded-lg flex justify-between items-center animate-scale-in"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-primary">{link.platform}:</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors truncate"
                  >
                    {link.url}
                  </a>
                </div>
                <button
                  onClick={() => handleRemoveSocialLink(idx)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="gradient-button hover:scale-105 transition-smooth px-8 py-3 text-lg font-semibold"
        >
          {downloading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          {downloading ? "Generating PDF..." : "Download Resume"}
        </Button>
      </div>
    </div>
  );
};

export default ResumeForm;
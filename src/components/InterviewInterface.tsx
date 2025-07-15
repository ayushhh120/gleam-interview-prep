import { useState } from 'react';
import { Mic, MicOff, Play, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FeedbackPoint {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
  color: 'success' | 'warning' | 'destructive';
}

export const InterviewInterface = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  
  const questions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and how do they apply to this role?",
    "Describe a challenging situation you faced and how you overcame it.",
    "Where do you see yourself in 5 years?",
    "Why do you want to work for our company?"
  ];

  const sampleFeedback: FeedbackPoint[] = [
    {
      category: "Confidence",
      score: 4,
      maxScore: 5,
      feedback: "Great eye contact and steady voice tone",
      color: "success"
    },
    {
      category: "Clarity",
      score: 3,
      maxScore: 5,
      feedback: "Good structure, could use more specific examples",
      color: "warning"
    },
    {
      category: "Relevance",
      score: 5,
      maxScore: 5,
      feedback: "Excellent alignment with role requirements",
      color: "success"
    }
  ];

  const handleStartInterview = () => {
    setInterviewStarted(true);
    setCurrentQuestion(0);
    setShowFeedback(false);
    setUserAnswer('');
  };

  const handleRecordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording and transcription
      setTimeout(() => {
        setIsRecording(false);
        setUserAnswer("I'm a software engineer with 5 years of experience in full-stack development. I'm passionate about creating user-centric applications and have led several successful projects that improved user engagement by 40%. I'm particularly excited about this role because it combines my technical skills with my interest in AI and machine learning.");
        setShowFeedback(true);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
      setShowFeedback(false);
    }
  };

  const getScoreColor = (color: string) => {
    switch (color) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'destructive': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getScoreStars = (score: number, maxScore: number) => {
    return '⭐'.repeat(score) + '☆'.repeat(maxScore - score);
  };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
        <div className="w-full max-w-xl text-center space-y-8 animate-fade-in">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Ace Your Next
              <span className="block text-transparent bg-gradient-to-r from-primary-glow to-info bg-clip-text">
                Interview!
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
              Practice with AI. Get smart feedback. Boost your confidence.
            </p>
          </div>

          {/* Start Interview Button */}
          <Card className="glassmorphic p-8 card-glow animate-scale-in">
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto gradient-button rounded-full flex items-center justify-center shadow-lg">
                <Mic className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Ready to begin?</h3>
                <p className="text-muted-foreground text-sm">
                  We'll ask you 5 questions and provide detailed feedback on your performance.
                </p>
                <Button 
                  onClick={handleStartInterview}
                  className="w-full gradient-button hover:scale-105 transition-smooth shadow-xl border-0 text-primary-foreground font-medium py-3"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Mock Interview
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero p-6">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Progress Indicator */}
        <div className="text-center space-y-2 animate-fade-in">
          <p className="text-muted-foreground text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-glow to-info h-2 rounded-full transition-smooth"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Box */}
        <Card className="glassmorphic p-8 card-glow animate-scale-in">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground font-medium">AI Interviewer</span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground leading-relaxed">
              {questions[currentQuestion]}
            </h2>
          </div>
        </Card>

        {/* Answer Section */}
        <Card className="glassmorphic p-8 card-glow">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <Button
                onClick={handleRecordToggle}
                className={`w-20 h-20 rounded-full transition-smooth ${
                  isRecording 
                    ? 'bg-destructive hover:bg-destructive/90 pulse-record' 
                    : 'gradient-button hover:scale-110'
                } border-0 shadow-xl`}
              >
                {isRecording ? (
                  <Square className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-primary-foreground" />
                )}
              </Button>
              <p className="text-muted-foreground text-sm">
                {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
              </p>
            </div>

            {userAnswer && (
              <div className="space-y-3 animate-fade-in">
                <h3 className="text-lg font-medium text-foreground">Your Answer:</h3>
                <div className="bg-secondary/50 backdrop-blur-sm rounded-xl p-4 border border-glassmorphic-border">
                  <p className="text-foreground leading-relaxed">{userAnswer}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Feedback Section */}
        {showFeedback && (
          <Card className="glassmorphic p-8 card-glow animate-scale-in">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">AI Feedback</h3>
              
              <div className="grid gap-4">
                {sampleFeedback.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-glassmorphic-border">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-foreground">{item.category}</span>
                        <span className="text-2xl">{getScoreStars(item.score, item.maxScore)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.feedback}</p>
                    </div>
                    <div className={`text-lg font-semibold ${getScoreColor(item.color)}`}>
                      {item.score}/{item.maxScore}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                {currentQuestion < questions.length - 1 ? (
                  <Button 
                    onClick={handleNextQuestion}
                    className="flex-1 gradient-button hover:scale-105 transition-smooth border-0 text-primary-foreground"
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setInterviewStarted(false)}
                    className="flex-1 gradient-button hover:scale-105 transition-smooth border-0 text-primary-foreground"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Final Summary Panel */}
        {showFeedback && currentQuestion === questions.length - 1 && (
          <Card className="glassmorphic p-8 card-glow animate-scale-in">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Interview Complete! 🎉</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-success">4.0</div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-info">85%</div>
                  <div className="text-sm text-muted-foreground">Confidence Level</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-warning">Good</div>
                  <div className="text-sm text-muted-foreground">Performance</div>
                </div>
              </div>
              
              <p className="text-muted-foreground max-w-md mx-auto">
                Great job! You showed strong technical knowledge and communication skills. 
                Focus on providing more specific examples in future interviews.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
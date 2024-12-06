'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  Upload, 
  UserPlus, 
  Headphones, 
  AlertCircle, 
  Mic,
  User,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [numSpeakers, setNumSpeakers] = useState(2);
  const [currentStep, setCurrentStep] = useState('initial');
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transcriptionFile, setTranscriptionFile] = useState(null);
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [error, setError] = useState('');

  const handleStartEnrollment = () => {
    setSpeakers(Array(numSpeakers).fill().map(() => ({ name: '', audio: null })));
    setCurrentStep('enrolling');
  };

  const handleSpeakerUpdate = (index, field, value) => {
    const updatedSpeakers = [...speakers];
    updatedSpeakers[index] = {
      ...updatedSpeakers[index],
      [field]: value
    };
    setSpeakers(updatedSpeakers);
  };

  const handleFinalSubmit = async () => {
    // Validate all speakers have name and audio
    if (speakers.some(speaker => !speaker.name || !speaker.audio)) {
      setError('Please complete all speaker information');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('num_speakers', numSpeakers);
    
    speakers.forEach((speaker, index) => {
      formData.append('names', speaker.name);
      formData.append(`files`, speaker.audio);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/enroll`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setCurrentStep('complete');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to enroll speakers');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Enrollment error:', error);
    }
    
    setLoading(false);
  };

  const handleTranscribeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('audio', transcriptionFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/transcribe`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setTranscriptionResult(data.transcription);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to transcribe audio');
      }
    } catch (error) {
      setError('Network error occurred');
    }
    
    setLoading(false);
  };

  const getEnrollmentProgress = () => {
    const completedSpeakers = speakers.filter(s => s.name && s.audio).length;
    return (completedSpeakers / numSpeakers) * 100;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-foreground">
          Speaker Recognition System
        </h1>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Speaker Enrollment Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Speaker Enrollment
            </CardTitle>
            <CardDescription>
              {currentStep === 'initial' 
                ? 'Start by selecting the number of speakers to enroll' 
                : 'Complete the enrollment process for each speaker'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 'initial' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="num-speakers">Number of Speakers</Label>
                  <Select
                    value={numSpeakers.toString()}
                    onValueChange={(value) => setNumSpeakers(parseInt(value))}
                  >
                    <SelectTrigger id="num-speakers">
                      <SelectValue placeholder="Select number of speakers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Speakers
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleStartEnrollment}
                  className="w-full"
                >
                  Start Enrollment Process
                </Button>
              </div>
            )}

            {currentStep === 'enrolling' && (
              <div className="space-y-6">
                {/* Enrollment Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Enrollment Progress</span>
                    <span>{speakers.filter(s => s.name && s.audio).length} of {numSpeakers} Complete</span>
                  </div>
                  <Progress value={getEnrollmentProgress()} className="h-2" />
                </div>

                {/* Speaker Cards */}
                <div className="grid gap-4">
                  {speakers.map((speaker, index) => {
                    const isComplete = speaker.name && speaker.audio;
                    
                    return (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border ${
                          isComplete 
                            ? 'bg-primary/5 border-primary/50' 
                            : 'bg-muted border-muted-foreground/25'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Speaker {index + 1}
                            </h3>
                            {isComplete && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={speaker.name}
                                onChange={(e) => handleSpeakerUpdate(index, 'name', e.target.value)}
                                placeholder="Enter speaker's name"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Voice Sample</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="file"
                                  accept="audio/*"
                                  onChange={(e) => handleSpeakerUpdate(index, 'audio', e.target.files[0])}
                                  className="cursor-pointer"
                                />
                                <Button type="button" variant="secondary" size="icon">
                                  <Mic className="h-4 w-4" />
                                </Button>
                              </div>
                              {speaker.audio && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Selected: {speaker.audio.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button
                  onClick={handleFinalSubmit}
                  className="w-full"
                  disabled={loading || speakers.some(s => !s.name || !s.audio)}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Enrollment
                </Button>
              </div>
            )}

            {currentStep === 'complete' && (
              <Alert className="bg-emerald-500/15 text-emerald-500 border-emerald-500/50">
                <AlertDescription>
                  All speakers enrolled successfully! You can now proceed to transcription.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Transcription Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-6 w-6" />
              Conversation Transcription
            </CardTitle>
            <CardDescription>
              Upload an audio recording to transcribe the conversation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTranscribeSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 hover:border-muted-foreground/50 transition">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setTranscriptionFile(e.target.files[0])}
                  required
                  className="cursor-pointer"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || currentStep !== 'complete'}
                className="w-full"
                variant="secondary"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Upload className="mr-2 h-4 w-4" />
                Transcribe Conversation
              </Button>
            </form>

            {transcriptionResult && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Transcription Result:</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                  {transcriptionResult}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
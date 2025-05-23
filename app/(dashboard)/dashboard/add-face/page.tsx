'use client';
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFaceRecognition } from '@/hooks/useFaceRecognition';
import { useAccessLogs } from '@/hooks/useAccessLogs';
import { Loader2, Upload, RefreshCw, Check, X } from 'lucide-react';

export default function AddFacePage() {
  const { faces, loading, error, uploadReferenceFace, uploadFaceForComparison, refreshFaces } = useFaceRecognition();
  const { addLogEntry } = useAccessLogs();
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setReferencePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload reference face
    setIsUploading(true);
    setMessage(null);
    
    try {
      const url = await uploadReferenceFace(file);
      if (url) {
        setMessage({ type: 'success', text: 'Reference face uploaded successfully!' });
        await addLogEntry('System', 'Reference face updated successfully');
      } else {
        setMessage({ type: 'error', text: 'Failed to upload reference face' });
        await addLogEntry('System', 'Failed to update reference face');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred' });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setReferencePreview(null);
    setMessage(null);
  };

  if (loading && !isUploading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !message) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Face Recognition Management</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Reference Face</CardTitle>
            <CardDescription>
              Update the reference face used for comparison with new face images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div 
                className="border-2 border-dashed border-gray-700 rounded-lg h-48 w-full flex items-center justify-center overflow-hidden"
              >
                {referencePreview ? (
                  <img 
                    src={referencePreview} 
                    alt="Reference face preview" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500">
                      Click to upload or drag and drop a face image
                    </p>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                ref={fileInputRef}
                id="face-upload"
              />
            </div>
            
            {message && (
              <div className={`mt-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                <div className="flex items-center gap-2">
                  {message.type === 'success' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <p>{message.text}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={clearFileInput}
              disabled={isUploading || !referencePreview}
            >
              Clear
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recognized Faces</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={refreshFaces}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <CardDescription>
              View face recognition status and history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {faces.length > 0 ? (
              <div className="space-y-4 max-h-[350px] overflow-y-auto">
                {faces.map((face) => (
                  <div key={face.id} className="flex items-center gap-3 p-3 rounded-md border border-gray-700">
                    {face.image_url && (
                      <div className="h-12 w-12 overflow-hidden rounded-md">
                        <img 
                          src={face.image_url} 
                          alt="Face" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">ID: {face.id.substring(0, 8)}...</p>
                      <div className="flex items-center mt-1">
                        <div 
                          className={`flex h-5 items-center rounded-full px-2 text-xs font-medium ${
                            face.matched === null
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : face.matched
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {face.matched === null ? 'Processing' : face.matched ? 'Matched' : 'Not Matched'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No face data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
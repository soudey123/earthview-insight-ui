
import React, { useState } from 'react';
import { Upload, Loader2, MapPin, FileText, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  eventType: string;
  confidence: number;
  latitude: number;
  longitude: number;
  rawData: any;
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [jsonExpanded, setJsonExpanded] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setSelectedFile(file);
        setAnalysisResult(null);
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        
        toast({
          title: "File selected",
          description: `${file.name} is ready for analysis`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a JPEG or PNG image",
          variant: "destructive",
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response - replace with actual API call
      const mockResult: AnalysisResult = {
        eventType: "Wildfire",
        confidence: 0.87,
        latitude: 34.0522,
        longitude: -118.2437,
        rawData: {
          eventType: "Wildfire",
          confidence: 0.87,
          coordinates: {
            latitude: 34.0522,
            longitude: -118.2437
          },
          metadata: {
            imageSize: "2048x2048",
            processingTime: "2.3s",
            model: "SatScan-AI-v2.1",
            timestamp: new Date().toISOString()
          },
          additionalData: {
            severity: "High",
            estimatedArea: "450 hectares",
            detectionAlgorithm: "CNN-ResNet50"
          }
        }
      };

      setAnalysisResult(mockResult);
      toast({
        title: "Analysis complete",
        description: `Detected ${mockResult.eventType} with ${(mockResult.confidence * 100).toFixed(1)}% confidence`,
      });

    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500";
    if (confidence >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'wildfire':
        return "bg-orange-500";
      case 'flood':
        return "bg-blue-500";
      case 'drought':
        return "bg-yellow-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SatScan</h1>
            </div>
            <Badge variant="outline" className="text-sm">
              AI-Powered Analysis
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Upload Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload Satellite Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Click to upload satellite image
                      </p>
                      <p className="text-sm text-gray-500">JPEG or PNG format</p>
                    </div>
                  </div>
                </label>
              </div>

              {selectedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">{selectedFile.name}</p>
                      <p className="text-sm text-blue-700">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Image'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Image Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Uploaded satellite image"
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        {selectedFile?.name}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Analysis Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Event Type and Confidence */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Event Type</label>
                    <Badge className={`${getEventTypeColor(analysisResult.eventType)} text-white`}>
                      {analysisResult.eventType}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Confidence</label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getConfidenceColor(analysisResult.confidence)}`}></div>
                      <span className="font-medium">{(analysisResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Latitude:</span>
                        <span className="ml-2 font-mono">{analysisResult.latitude.toFixed(6)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Longitude:</span>
                        <span className="ml-2 font-mono">{analysisResult.longitude.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Map Placeholder */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Interactive Map</label>
                  <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 text-center text-white">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-medium">Location Detected</p>
                      <p className="text-sm opacity-90">
                        {analysisResult.latitude.toFixed(4)}, {analysisResult.longitude.toFixed(4)}
                      </p>
                    </div>
                    {/* Simulated map grid */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                        {Array.from({ length: 48 }).map((_, i) => (
                          <div key={i} className="border border-white/30"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Raw JSON Data */}
                <Collapsible open={jsonExpanded} onOpenChange={setJsonExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Raw JSON Data</span>
                      </div>
                      {jsonExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm font-mono">
                        {JSON.stringify(analysisResult.rawData, null, 2)}
                      </pre>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-600">SatScan AI Analysis Tool</span>
            </div>
            <p className="text-sm text-gray-500">
              Powered by advanced satellite imagery AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

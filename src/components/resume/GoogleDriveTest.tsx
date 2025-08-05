import React, { useState } from 'react';
import { GoogleDriveImport } from './GoogleDriveImport';
import { resumeService } from '../../services/resumeService';

export const GoogleDriveTest: React.FC = () => {
  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (file: File, metadata: any) => {
    try {
      console.log('File selected:', file.name, metadata);
      
      const result = await resumeService.parseGoogleDriveResume(file, metadata);
      console.log('Parsed data:', result);
      
      setParsedData(result);
      setError(null);
    } catch (err) {
      console.error('Error parsing file:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setParsedData(null);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setParsedData(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Google Drive Resume Import Test</h1>
      
      <div className="mb-6">
        <GoogleDriveImport
          onFileSelected={handleFileSelected}
          onError={handleError}
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold">Error:</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {parsedData && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-2">Parsed Data:</h3>
          <pre className="text-sm text-green-700 overflow-auto">
            {JSON.stringify(parsedData, null, 2)}
          </pre>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Click "Import Resume from Google Drive"</li>
          <li>Authenticate with your Google account</li>
          <li>Select a PDF or DOCX resume file</li>
          <li>View the parsed data below</li>
        </ul>
      </div>
    </div>
  );
}; 

"use client";

import { UploadCloud, File, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface FileUploadProps {
  label: string;
}

export function FileUpload({ label }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
     // Also reset the input field value
    const input = document.getElementById(`file-upload-${label.replace(/\s+/g, '-')}`) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  return (
    <div className="space-y-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {file ? (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 overflow-hidden">
            <File className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium truncate" title={file.name}>{file.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-1 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 5MB)</p>
            </div>
            <input id={`file-upload-${label.replace(/\s+/g, '-')}`} type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      )}
    </div>
  );
}


"use client";

import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  onUploadComplete: (url: string, path: string) => void;
  id: string;
}

export function FileUpload({ label, onUploadComplete, id }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB.",
        });
        return;
      }
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = (fileToUpload: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const fullPath = `uploads/${Date.now()}-${fileToUpload.name.replace(/\s/g, '_')}`;
    setFilePath(fullPath);
    const storageRef = ref(storage, fullPath);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error("Upload error:", error);
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `An error occurred during upload: ${error.message}`,
        });
        setIsUploading(false);
        setUploadProgress(null);
        setFile(null);
        setFilePath(null);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onUploadComplete(downloadURL, fullPath);
          setIsUploading(false);
          toast({
            title: "Upload Successful",
            description: `${fileToUpload.name} has been uploaded.`,
          });
        });
      }
    );
  };

  const handleRemoveFile = () => {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
    
    if (filePath) {
      const fileRef = ref(storage, filePath);
      deleteObject(fileRef).catch((error) => {
         console.error("Error removing file from storage: ", error);
         toast({
            variant: "destructive",
            title: "Cleanup Failed",
            description: "Could not remove the old file from storage.",
         });
      });
    }
    
    setFile(null);
    setFilePath(null);
    setUploadProgress(null);
    setIsUploading(false);
    onUploadComplete("", ""); // Clear the URL and path in the parent form
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {file ? (
        <div className="p-3 border rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <File className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium truncate" title={file.name}>{file.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="flex-shrink-0" disabled={isUploading}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {uploadProgress !== null && (
            <div className="flex items-center gap-2">
              <Progress value={uploadProgress} className="h-2 w-full" />
              <span className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={id}
            className={cn(
                "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-card",
                isUploading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-muted/50"
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              {isUploading ? (
                <>
                    <Loader2 className="w-8 h-8 mb-2 text-muted-foreground animate-spin" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-1 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 5MB)</p>
                </>
              )}
            </div>
            <input id={id} type="file" className="hidden" onChange={handleFileChange} disabled={isUploading} accept="image/png, image/jpeg, application/pdf" />
          </label>
        </div>
      )}
    </div>
  );
}

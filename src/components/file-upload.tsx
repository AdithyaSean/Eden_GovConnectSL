
"use client";

import { UploadCloud, File, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';

interface FileUploadProps {
  label: string;
  onUploadComplete: (url: string) => void;
  id: string;
}

export function FileUpload({ label, onUploadComplete, id }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
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
    const storageRef = ref(storage, `uploads/${Date.now()}-${fileToUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `An error occurred during upload: ${error.message}`,
        });
        setUploadProgress(null);
        setFile(null);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUrl(downloadURL);
          onUploadComplete(downloadURL);
          setUploadProgress(null);
          toast({
            title: "Upload Successful",
            description: `${fileToUpload.name} has been uploaded.`,
          });
        });
      }
    );
  };

  const handleRemoveFile = () => {
    // Note: This doesn't delete the file from Firebase Storage.
    // A more robust implementation would require a backend function to handle deletions.
    setFile(null);
    setFileUrl(null);
    setUploadProgress(null);
    onUploadComplete(""); // Clear the URL in the parent form
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
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
            <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="flex-shrink-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
          {uploadProgress !== null && (
            <Progress value={uploadProgress} className="h-2" />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={id}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-1 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 5MB)</p>
            </div>
            <input id={id} type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      )}
    </div>
  );
}

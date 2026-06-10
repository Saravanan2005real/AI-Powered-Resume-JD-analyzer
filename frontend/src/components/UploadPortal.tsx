"use client";

import { useState } from "react";

interface UploadPortalProps {
  title: string;
  description: string;
  accept: string;
  icon: React.ReactNode;
  multiple?: boolean;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
}

export default function UploadPortal({ 
  title, 
  description, 
  accept, 
  icon, 
  multiple = false, 
  maxFiles = 1,
  onFilesChange 
}: UploadPortalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const processFiles = (newFilesList: FileList | null) => {
    if (!newFilesList) return;
    
    let newFilesArray = Array.from(newFilesList);
    
    let updatedFiles = multiple ? [...files, ...newFilesArray] : newFilesArray;
    if (updatedFiles.length > maxFiles) {
      updatedFiles = updatedFiles.slice(0, maxFiles);
    }
    setFiles(updatedFiles);
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    processFiles(e.target.files);
  };

  const removeFile = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    const updatedFiles = files.filter((_, idx) => idx !== indexToRemove);
    setFiles(updatedFiles);
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  return (
    <div className="flex flex-col h-full glass-panel neon-border rounded-2xl p-8 relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(14,165,233,0.15)] bg-black/20">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-700"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] group-hover:bg-secondary/30 group-hover:scale-110 transition-all duration-700"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:text-white transition-all duration-500 shadow-[0_0_15px_rgba(14,165,233,0.2)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h2>
        <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">{description}</p>
        
        <div 
          className={`w-full max-w-sm rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out flex flex-col items-center justify-center p-8 cursor-pointer ${
            isDragging 
              ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02]" 
              : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`file-upload-${title}`)?.click()}
        >
          <input
            id={`file-upload-${title}`}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={handleChange}
          />
          
          {files.length > 0 ? (
            <div className="flex flex-col w-full gap-2 items-center animate-in fade-in zoom-in duration-300">
              <div className="w-12 h-12 mb-3 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              {files.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between w-full bg-white/5 rounded px-3 py-2 border border-white/10">
                  <div className="flex flex-col text-left overflow-hidden">
                    <p className="text-sm font-medium text-white truncate w-40">{f.name}</p>
                    <p className="text-xs text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button 
                    onClick={(e) => removeFile(e, idx)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
              
              {multiple && files.length < maxFiles && (
                <p className="text-xs text-primary mt-2">+ Add more files ({files.length}/{maxFiles})</p>
              )}
            </div>
          ) : (
            <>
              <svg className="w-10 h-10 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="text-sm text-gray-300 mb-1">
                <span className="text-primary font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-2">Supports PDF, DOCX, TXT</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

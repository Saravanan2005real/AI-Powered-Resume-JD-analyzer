"use client";

import { useState } from "react";

interface UploadPortalProps {
  title: string;
  description: string;
  accept: string;
  icon: React.ReactNode;
}

export default function UploadPortal({ title, description, accept, icon }: UploadPortalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:scale-110 group-hover:text-white transition-all duration-300 shadow-xl shadow-black/20">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h2>
        <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">{description}</p>
        
        <div 
          className={`w-full max-w-sm rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out flex flex-col items-center justify-center p-8 cursor-pointer ${
            isDragging 
              ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]" 
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
            className="hidden"
            onChange={handleChange}
          />
          
          {file ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="w-12 h-12 mb-3 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
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

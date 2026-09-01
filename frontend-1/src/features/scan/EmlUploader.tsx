import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';
import { ScanMode } from '@/types';
import { Button } from '@/components/ui/button';
import { ScanModeSelector } from './ScanModeSelector';

export interface EmlUploaderProps {
  onSubmit: (file: File, mode: ScanMode) => void;
  isSubmitting?: boolean;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function EmlUploader({ onSubmit, isSubmitting = false }: EmlUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<ScanMode>('DEEP');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    // Validate size
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError(`File exceeds the maximum allowed size of 5 MB (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB uploaded).`);
      return;
    }

    // Validate extension
    const name = selectedFile.name.toLowerCase();
    const isEmlOrTxt = name.endsWith('.eml') || name.endsWith('.msg') || name.endsWith('.txt');
    if (!isEmlOrTxt) {
      setError('Please upload a valid .eml, .msg, or .txt raw email file.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop an .eml file to proceed.');
      return;
    }
    onSubmit(file, mode);
  };

  const createDummyEml = () => {
    const content = `From: "IT Support" <helpdesk@corporate-auth-alert.net>
To: target.user@company.com
Subject: Urgent: Your corporate mailbox quota is exceeded
Date: Mon, 31 Aug 2026 14:22:00 +0000
Content-Type: text/plain; charset=UTF-8

Your mailbox has reached 99.8% capacity. Click here to upgrade storage immediately:
http://corporate-auth-alert.net/upgrade-quota
`;
    const dummyFile = new File([content], 'urgent-mailbox-quota.eml', { type: 'message/rfc822' });
    validateAndSetFile(dummyFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/80 mb-2">
          Upload Raw Message File (.eml, .msg, .txt) <span className="text-red-700">*</span>
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept=".eml,.msg,.txt,message/rfc822"
          onChange={handleFileInputChange}
          className="hidden"
          id="eml-file-input"
        />

        {/* Drag & Drop Surface */}
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-brand-medium bg-brand-secondary/40 ring-4 ring-brand-medium/20 scale-[0.99]'
                : 'border-brand-light/60 bg-[#ede3d5] hover:bg-brand-secondary/30'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-3 rounded-full bg-brand-secondary/60 text-brand-medium">
                <UploadCloud className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-dark">
                  Drag and drop your .eml file here, or{' '}
                  <span className="text-brand-medium underline underline-offset-2">browse files</span>
                </p>
                <p className="text-xs text-brand-dark/60 mt-1">
                  Supports RFC822 (.eml, .txt, .msg) up to 5 MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-brand-medium/60 bg-[#ede3d5] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-brand-medium text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-dark">{file.name}</p>
                <p className="text-xs text-brand-dark/70 font-mono">
                  {(file.size / 1024).toFixed(1)} KB • {file.type || 'RFC822 MIME File'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-2 rounded-lg text-brand-dark/70 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Remove file"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}

        {error && <p className="mt-2 text-xs font-medium text-red-700">{error}</p>}

        {/* Sample helper */}
        {!file && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#dfd0bd]/80 border border-brand-light/40 shadow-xs text-xs text-brand-dark">
            <span className="font-subtext font-semibold">No raw .eml file on hand?</span>
            <button
              type="button"
              onClick={createDummyEml}
              className="px-3 py-1 rounded-lg bg-[#f7ebd8] hover:bg-[#eedbc2] text-[#7a4816] text-xs font-bold border border-[#d8b88d] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Load Sample RFC822 EML Payload
            </button>
          </div>
        )}
      </div>

      {/* Mode Selector */}
      <ScanModeSelector mode={mode} onChange={setMode} disabled={isSubmitting} />

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full text-base font-bold shadow-md h-12"
          disabled={!file || isSubmitting}
        >
          <span>Ingest & Inspect EML</span>
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}

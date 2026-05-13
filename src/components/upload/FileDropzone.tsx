'use client';

import { useRef, useState, useCallback } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';

// ═══════════════════════════════════════════════════════════
// FileDropzone — 드래그 앤 드롭 파일 업로드
// ═══════════════════════════════════════════════════════════

interface FileDropzoneProps {
  sessionId: string;
  submissionId: string;
  type: 'original' | 'feedback';
  prescriptionId?: string;
  onUploadComplete?: (result: { url: string; key: string }) => void;
}

export function FileDropzone({
  sessionId, submissionId, type, prescriptionId, onUploadComplete,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useFileUpload({
    endpoint: '/api/upload',
    onComplete: (result) => onUploadComplete?.(result),
  });

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      upload.upload(file, {
        sessionId, submissionId, type,
        ...(prescriptionId ? { prescriptionId } : {}),
      });
    },
    [upload, sessionId, submissionId, type, prescriptionId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-950/30'
            : 'border-gray-600 bg-gray-900 hover:border-gray-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {upload.status === 'idle' && (
          <>
            <p className="text-gray-400 font-mono text-sm">
              📁 PNG / JPG 파일을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-gray-600 text-xs mt-1 font-mono">최대 20MB</p>
          </>
        )}

        {upload.status === 'uploading' && (
          <div className="w-full">
            <p className="text-blue-400 font-mono text-sm mb-2">
              업로드 중... {upload.progress}%
            </p>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-200"
                style={{ width: `${upload.progress}%` }}
              />
            </div>
          </div>
        )}

        {upload.status === 'success' && (
          <p className="text-green-400 font-mono text-sm">✅ 업로드 완료</p>
        )}

        {upload.status === 'error' && (
          <div>
            <p className="text-red-400 font-mono text-sm">❌ {upload.error}</p>
            <button
              onClick={(e) => { e.stopPropagation(); upload.reset(); }}
              className="mt-2 px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs font-mono hover:bg-gray-600"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

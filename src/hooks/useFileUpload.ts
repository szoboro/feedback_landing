'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════
// useFileUpload — 파일 업로드 훅 (Progress + Retry)
// XMLHttpRequest 기반으로 업로드 진행률을 추적합니다.
// ═══════════════════════════════════════════════════════════

interface UploadOptions {
  /** 업로드 엔드포인트 */
  endpoint: string;
  /** 최대 재시도 횟수 */
  maxRetries?: number;
  /** 허용 MIME 타입 */
  acceptedTypes?: string[];
  /** 최대 파일 크기 (bytes) */
  maxSizeBytes?: number;
  /** 업로드 완료 콜백 */
  onComplete?: (result: UploadResult) => void;
  /** 에러 콜백 */
  onError?: (error: string) => void;
}

interface UploadResult {
  url: string;
  key: string;
  sizeBytes: number;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UseFileUploadReturn {
  status: UploadStatus;
  progress: number;
  error: string | null;
  result: UploadResult | null;
  upload: (file: File, metadata?: Record<string, string>) => void;
  reset: () => void;
  cancel: () => void;
}

export function useFileUpload(options: UploadOptions): UseFileUploadReturn {
  const {
    endpoint,
    maxRetries = 3,
    acceptedTypes = ['image/png', 'image/jpeg', 'image/webp'],
    maxSizeBytes = 20 * 1024 * 1024, // 20MB
    onComplete,
    onError,
  } = options;

  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const retryCountRef = useRef(0);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setError(null);
    setResult(null);
    retryCountRef.current = 0;
  }, []);

  const cancel = useCallback(() => {
    xhrRef.current?.abort();
    reset();
  }, [reset]);

  const doUpload = useCallback(
    (file: File, metadata?: Record<string, string>) => {
      // 유효성 검증
      if (!acceptedTypes.includes(file.type)) {
        const msg = `지원하지 않는 파일 형식입니다: ${file.type}`;
        setError(msg);
        setStatus('error');
        onError?.(msg);
        return;
      }
      if (file.size > maxSizeBytes) {
        const msg = `파일 크기가 ${Math.round(maxSizeBytes / 1024 / 1024)}MB를 초과합니다.`;
        setError(msg);
        setStatus('error');
        onError?.(msg);
        return;
      }

      setStatus('uploading');
      setProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      if (metadata) {
        Object.entries(metadata).forEach(([k, v]) => formData.append(k, v));
      }

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            const uploadResult: UploadResult = res.data;
            setResult(uploadResult);
            setStatus('success');
            setProgress(100);
            onComplete?.(uploadResult);
          } catch {
            handleError('서버 응답 파싱 실패');
          }
        } else {
          handleError(`업로드 실패 (${xhr.status})`);
        }
      });

      xhr.addEventListener('error', () => handleError('네트워크 오류'));
      xhr.addEventListener('abort', () => {
        setStatus('idle');
        setProgress(0);
      });

      function handleError(msg: string) {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          const delay = Math.pow(2, retryCountRef.current) * 500;
          setTimeout(() => doUpload(file, metadata), delay);
        } else {
          setError(msg);
          setStatus('error');
          onError?.(msg);
        }
      }

      xhr.open('POST', endpoint);
      xhr.send(formData);
    },
    [endpoint, maxRetries, acceptedTypes, maxSizeBytes, onComplete, onError]
  );

  // cleanup
  useEffect(() => {
    return () => { xhrRef.current?.abort(); };
  }, []);

  return { status, progress, error, result, upload: doUpload, reset, cancel };
}

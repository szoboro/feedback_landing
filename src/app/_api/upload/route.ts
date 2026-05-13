import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils';

/**
 * POST /api/upload
 * 파일 업로드 엔드포인트
 * S3 경로 규칙: sessions/{sessionId}/submissions/{submissionId}/{type}/{filename}
 *
 * TODO: 실제 S3 SDK 연동. 현재는 로컬 시뮬레이션.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const sessionId = formData.get('sessionId') as string;
    const submissionId = formData.get('submissionId') as string;
    const type = formData.get('type') as 'original' | 'feedback';
    const prescriptionId = formData.get('prescriptionId') as string | null;

    if (!file || !sessionId || !submissionId || !type) {
      return errorResponse('MISSING_FIELDS', 'file, sessionId, submissionId, type are required', 400);
    }

    // S3 키 생성
    const ext = file.name.split('.').pop() ?? 'png';
    const timestamp = Date.now();
    const s3Key = type === 'feedback' && prescriptionId
      ? `sessions/${sessionId}/submissions/${submissionId}/feedback/${prescriptionId}/${timestamp}.${ext}`
      : `sessions/${sessionId}/submissions/${submissionId}/${type}/${timestamp}.${ext}`;

    // TODO: 실제 S3 업로드
    // const command = new PutObjectCommand({ Bucket, Key: s3Key, Body: buffer, ContentType: file.type });
    // await s3Client.send(command);

    const mockUrl = `https://cdn.example.com/${s3Key}`;

    return successResponse(
      { url: mockUrl, key: s3Key, sizeBytes: file.size },
      undefined,
      201
    );
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('UPLOAD_FAILED', 'File upload failed', 500);
  }
}

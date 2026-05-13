// ═══════════════════════════════════════════════════════════
// Canvas Verdict — Shared Type Definitions (v2)
// 실시간 캔버스 드로잉 제외, 파일 업로드 워크플로우 최적화
// ═══════════════════════════════════════════════════════════

// ─── Enums ───────────────────────────────────────────────

export type SessionStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'ARCHIVED';
export type SubmissionStatus = 'WAITING' | 'IN_REVIEW' | 'COMPLETED';
export type UserRole = 'VIEWER' | 'STREAMER' | 'MEMBER' | 'ADMIN';

export type ConcernCategory =
  | 'ANATOMY'
  | 'COLORING'
  | 'COMPOSITION'
  | 'PERSPECTIVE'
  | 'LINE_QUALITY'
  | 'CREATIVITY'
  | 'OTHER';

export type ComparisonMode = 'slider' | 'side-by-side' | 'toggle';

// ─── Diagnosis Pin (자가 진단 핀) ────────────────────────

export interface DiagnosisPin {
  id: string;
  imageIndex?: number; // 다중 이미지 지원 (어떤 이미지에 찍힌 핀인지)
  /** 원본 이미지 절대 좌표 (정규화) */
  x: number;
  y: number;
  label: string;
  category: ConcernCategory;
}

// ─── Prescription Area Comment ───────────────────────────

export interface AreaComment {
  pinId: string;
  comment: string;
}

export interface ExpertComment {
  id: string;
  prescriptionId: string;
  authorId: string;
  authorNickname: string;
  authorAvatarUrl: string | null;
  authorReputation: number;
  content: string;
  likes: number;
  createdAt: string;
}

// ─── Scoring (처방전 점수, 1–10) ─────────────────────────

export interface PrescriptionScores {
  anatomyScore: number;
  coloringScore: number;
  compositionScore: number;
  lineQualityScore: number;
  creativityScore: number;
}

// ─── Growth Score Metadata ───────────────────────────────

export interface GrowthMetrics {
  totalSubmissions: number;
  totalPrescriptionsReceived: number;
  avgAnatomyScore: number | null;
  avgColoringScore: number | null;
  avgCompositionScore: number | null;
  avgLineQualityScore: number | null;
  avgCreativityScore: number | null;
  latestOverallScore: number | null;
  /** 성장률 (%, 최근 5회 평균 vs 첫 5회 평균) */
  growthRate: number | null;
}

// ─── Domain Models ───────────────────────────────────────

export interface User {
  id: string;
  nickname: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  growth: GrowthMetrics;
  createdAt: string;
}

export interface Session {
  id: string;
  hostId: string;
  title: string;
  description: string | null;
  status: SessionStatus;
  maxSubmissions: number;
  openedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  sessionId: string;
  submitterId: string;
  originalImageUrl: string;
  originalImageKey: string;
  additionalImageUrls?: string[]; // 다중 이미지 추가 지원
  title: string;
  description: string | null;
  concernCategories: ConcernCategory[];
  diagnosisPins: DiagnosisPin[];
  selfNote: string | null;
  status: SubmissionStatus;
  queuePosition: number;
  createdAt: string;
}

export interface Prescription {
  id: string;
  submissionId: string;
  reviewerId: string;
  feedbackImageUrl: string | null;
  feedbackImageKey: string | null;
  version: number;
  scores: PrescriptionScores;
  overallComment: string | null;
  areaComments: AreaComment[];
  isFinal: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── S3 File Path Helper ─────────────────────────────────

export interface S3FileInfo {
  bucket: string;
  key: string;
  url: string;
  contentType: string;
  sizeBytes: number;
}

// ─── API Response Wrappers ───────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── API Request DTOs ────────────────────────────────────

export interface CreateSessionDto {
  title: string;
  description?: string;
  maxSubmissions?: number;
}

export interface UpdateSessionDto {
  title?: string;
  description?: string;
  status?: SessionStatus;
  maxSubmissions?: number;
}

export interface CreateSubmissionDto {
  originalImageUrl: string;
  originalImageKey: string;
  additionalImageUrls?: string[];
  title: string;
  description?: string;
  concernCategories: ConcernCategory[];
  diagnosisPins?: DiagnosisPin[];
  selfNote?: string;
}

export interface CreatePrescriptionDto {
  feedbackImageUrl?: string;
  feedbackImageKey?: string;
  scores: PrescriptionScores;
  overallComment?: string;
  areaComments?: AreaComment[];
  isFinal?: boolean;
}

export interface UpdatePrescriptionDto {
  feedbackImageUrl?: string;
  feedbackImageKey?: string;
  scores?: Partial<PrescriptionScores>;
  overallComment?: string;
  areaComments?: AreaComment[];
  isFinal?: boolean;
}

// ─── Upload DTOs ─────────────────────────────────────────

export interface UploadRequestDto {
  sessionId: string;
  submissionId: string;
  type: 'original' | 'feedback';
  prescriptionId?: string;
}

export interface UploadResponseDto {
  url: string;
  key: string;
  sizeBytes: number;
}

// ─── Realtime Events ─────────────────────────────────────

export type RealtimeEventType =
  | 'REFRESH_FEEDBACK'
  | 'QUEUE_UPDATED'
  | 'SESSION_STATUS_CHANGED'
  | 'NEW_COMMENT';

export interface RealtimeEvent<T = unknown> {
  type: RealtimeEventType;
  sessionId: string;
  payload: T;
  timestamp: number;
}

export interface RefreshFeedbackPayload {
  submissionId: string;
  prescriptionId: string;
  feedbackImageUrl: string;
  version: number;
}

// ─── Enriched Types ──────────────────────────────────────

export interface SessionWithHost extends Session {
  host: User;
}

export interface SubmissionWithDetails extends Submission {
  submitter: User;
  prescriptions: Prescription[];
}

export interface PrescriptionWithReviewer extends Prescription {
  reviewer: User;
}

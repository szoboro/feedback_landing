import { z } from 'zod';

// ═══════════════════════════════════════════════════════════
// Canvas Verdict — Zod Validators (v2: File Upload Workflow)
// ═══════════════════════════════════════════════════════════

const uuidSchema = z.string().uuid();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const concernCategorySchema = z.enum([
  'ANATOMY', 'COLORING', 'COMPOSITION',
  'PERSPECTIVE', 'LINE_QUALITY', 'CREATIVITY', 'OTHER',
]);

const diagnosisPinSchema = z.object({
  id: z.string(),
  x: z.number().min(0),
  y: z.number().min(0),
  label: z.string().min(1).max(200),
  category: concernCategorySchema,
});

const scoreField = z.number().int().min(1).max(10);

const prescriptionScoresSchema = z.object({
  anatomyScore: scoreField,
  coloringScore: scoreField,
  compositionScore: scoreField,
  lineQualityScore: scoreField,
  creativityScore: scoreField,
});

const areaCommentSchema = z.object({
  pinId: z.string(),
  comment: z.string().min(1).max(1000),
});

// ─── Session ─────────────────────────────────────────────

export const createSessionSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  maxSubmissions: z.number().int().min(1).max(200).optional(),
});

export const updateSessionSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: z.enum(['DRAFT', 'OPEN', 'CLOSED', 'ARCHIVED']).optional(),
  maxSubmissions: z.number().int().min(1).max(200).optional(),
});

// ─── Submission ──────────────────────────────────────────

export const createSubmissionSchema = z.object({
  originalImageUrl: z.string().url(),
  originalImageKey: z.string().min(1),
  title: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  concernCategories: z.array(concernCategorySchema).min(1).max(7),
  diagnosisPins: z.array(diagnosisPinSchema).max(20).optional(),
  selfNote: z.string().max(2000).optional(),
});

// ─── Prescription ────────────────────────────────────────

export const createPrescriptionSchema = z.object({
  feedbackImageUrl: z.string().url().optional(),
  feedbackImageKey: z.string().optional(),
  scores: prescriptionScoresSchema,
  overallComment: z.string().max(5000).optional(),
  areaComments: z.array(areaCommentSchema).max(20).optional(),
  isFinal: z.boolean().optional(),
});

export const updatePrescriptionSchema = z.object({
  feedbackImageUrl: z.string().url().optional(),
  feedbackImageKey: z.string().optional(),
  scores: prescriptionScoresSchema.partial().optional(),
  overallComment: z.string().max(5000).nullable().optional(),
  areaComments: z.array(areaCommentSchema).max(20).optional(),
  isFinal: z.boolean().optional(),
});

// ─── Upload ──────────────────────────────────────────────

export const uploadRequestSchema = z.object({
  sessionId: uuidSchema,
  submissionId: uuidSchema,
  type: z.enum(['original', 'feedback']),
  prescriptionId: uuidSchema.optional(),
});

// ─── Param validators ───────────────────────────────────

export const sessionIdParam = z.object({ sessionId: uuidSchema });
export const submissionIdParam = z.object({ submissionId: uuidSchema });
export const prescriptionIdParam = z.object({ prescriptionId: uuidSchema });

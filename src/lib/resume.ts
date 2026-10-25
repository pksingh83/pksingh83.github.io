import { parse } from 'yaml';
import { z } from 'zod';
import resumeYaml from '../data/resume.yaml?raw';

const experience = z.strictObject({
  company: z.string().min(1),
  role: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  pdfOnly: z.boolean().optional(),
});

const resumeSchema = z.strictObject({
  name: z.string().min(1),
  title: z.string().min(1),
  pitch: z.string().min(1),
  about: z.array(z.string().min(1)).min(1),
  location: z.string().min(1),
  contact: z.strictObject({
    email: z.email(),
    linkedin: z.url(),
  }),
  experience: z.array(experience).min(1),
  skills: z.array(z.strictObject({ group: z.string().min(1), items: z.array(z.string().min(1)).min(1) })).min(1),
  projects: z
    .array(
      z.strictObject({
        name: z.string().min(1),
        problem: z.string().min(1),
        role: z.string().min(1),
        stack: z.array(z.string().min(1)).min(1),
        result: z.string().min(1),
      }),
    )
    .min(1),
  education: z.array(z.strictObject({ degree: z.string().min(1), school: z.string().min(1), year: z.string().min(1) })),
  certifications: z.array(z.strictObject({ name: z.string().min(1), issuer: z.string().min(1), date: z.string().min(1) })),
});

export type Resume = z.infer<typeof resumeSchema>;

const PHONE_LIKE = /\+?\d(?:[\s().-]{0,2}\d){9,}/;

export function looksLikePhoneNumber(text: string): boolean {
  return PHONE_LIKE.test(text);
}

function assertNoPhoneNumbers(value: unknown): void {
  if (typeof value === 'string') {
    if (looksLikePhoneNumber(value)) throw new Error(`Resume text contains what looks like a phone number: "${value}"`);
  } else if (Array.isArray(value)) {
    value.forEach(assertNoPhoneNumbers);
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(assertNoPhoneNumbers);
  }
}

export function parseResume(yamlText: string): Resume {
  const resume = resumeSchema.parse(parse(yamlText));
  assertNoPhoneNumbers(resume);
  return resume;
}

export function publicView(resume: Resume): Resume {
  return { ...resume, experience: resume.experience.filter((role) => !role.pdfOnly) };
}

export function printView(resume: Resume): Resume {
  return resume;
}

export function loadResume(): Resume {
  return parseResume(resumeYaml);
}

import { describe, expect, it } from 'vitest';
import { stringify } from 'yaml';
import { loadResume, looksLikePhoneNumber, parseResume, printView, publicView } from '../src/lib/resume';

const base = () => ({
  name: 'Test Person',
  title: 'Engineering Lead',
  pitch: 'I build things.',
  about: ['Paragraph one.'],
  location: 'Mumbai, India',
  contact: { email: 'test@example.com', linkedin: 'https://www.linkedin.com/in/test/' },
  experience: [
    { company: 'Acme', role: 'Lead', start: 'Apr 2025', end: 'present', bullets: ['Led a team.'] },
  ],
  skills: [{ group: 'Languages', items: ['C#'] }],
  projects: [
    { name: 'Proj', problem: 'A problem.', role: 'Led it.', stack: ['C#'], result: 'It worked.' },
  ],
  education: [{ degree: 'MBA', school: 'Some University', year: '2005' }],
  certifications: [{ name: 'Azure Developer Associate', issuer: 'Microsoft', date: 'Oct 2025' }],
});

const yamlWith = (extra: Record<string, unknown> = {}) => stringify({ ...base(), ...extra });

describe('resume content: privacy guard', () => {
  it('accepts a complete resume', () => {
    expect(parseResume(yamlWith()).name).toBe('Test Person');
  });

  it('rejects a resume that carries a phone number field', () => {
    expect(() => parseResume(yamlWith({ phone: '+91 12345 67890' }))).toThrow(/phone/);
  });

  it('rejects a phone number written into free text', () => {
    const experience = [
      { company: 'Acme', role: 'Lead', start: 'Apr 2025', end: 'present', bullets: ['Call me on +91 98765 43210.'] },
    ];
    expect(() => parseResume(yamlWith({ experience }))).toThrow(/phone number/i);
  });

  it('allows years, dates and counts in free text', () => {
    const about = ['20+ years, 60+ API modules, and a 40% cut in manual effort since 2006.'];
    expect(parseResume(yamlWith({ about })).about).toEqual(about);
  });
});

describe('resume content: page and PDF views', () => {
  const withPdfOnlyRole = () =>
    parseResume(
      yamlWith({
        experience: [
          ...base().experience,
          { company: 'Old Co', role: 'Executive', start: 'Aug 2005', end: 'Jan 2006', bullets: ['Early role.'], pdfOnly: true },
        ],
      }),
    );

  it('keeps PDF-only roles off the page', () => {
    expect(publicView(withPdfOnlyRole()).experience.map((e) => e.company)).toEqual(['Acme']);
  });

  it('includes PDF-only roles in the PDF, after the roles shown on the page', () => {
    expect(printView(withPdfOnlyRole()).experience.map((e) => e.company)).toEqual(['Acme', 'Old Co']);
  });
});

describe('resume content: the real resume.yaml', () => {
  it('is valid, shows the NextGen Invent role first, and keeps the PCS role PDF-only', () => {
    const resume = loadResume();
    expect(resume.name).toBe('Prashant Kumar');
    expect(publicView(resume).experience.map((e) => e.company)).toEqual([
      'NextGen Invent, a Straive company',
      'NDS InfoServ (a division of AEG Pvt Ltd)',
    ]);
    expect(printView(resume).experience.at(-1)?.company).toBe('PCS Technology Ltd');
  });
});

describe('looksLikePhoneNumber', () => {
  it.each(['+91 98765 43210', '(022) 1234-5678', '9876543210', 'Call 098765-43210 now'])('flags %s', (text) => {
    expect(looksLikePhoneNumber(text)).toBe(true);
  });

  it.each(['20+ years', '60+ API modules', '2005', 'Aug 2006 – Sep 2024', '40% less manual effort'])('ignores %s', (text) => {
    expect(looksLikePhoneNumber(text)).toBe(false);
  });
});

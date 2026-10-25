import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { extractText, getDocumentProxy } from 'unpdf';
import { beforeAll, describe, expect, it } from 'vitest';
import { looksLikePhoneNumber } from '../src/lib/resume';

const dist = resolve(__dirname, '../dist');
const pdfPath = resolve(dist, 'Prashant-Kumar-Resume.pdf');
let text = '';
let pages = 0;

beforeAll(async () => {
  const pdf = await getDocumentProxy(new Uint8Array(readFileSync(pdfPath)));
  pages = pdf.numPages;
  text = (await extractText(pdf, { mergePages: true })).text;
});

describe('resume PDF', () => {
  it('is a real PDF of at most two pages, with the print route removed from the site', () => {
    expect(readFileSync(pdfPath).subarray(0, 4).toString()).toBe('%PDF');
    expect(pages).toBeLessThanOrEqual(2);
    expect(existsSync(resolve(dist, 'print'))).toBe(false);
  });

  it('has selectable text with the name, email, current role and the PDF-only role', () => {
    expect(text).toContain('Prashant Kumar');
    expect(text).toContain('prashant.mec@gmail.com');
    expect(text).toContain('NextGen Invent');
    expect(text).toContain('PCS Technology Ltd');
  });

  it('has no phone number', () => {
    expect(looksLikePhoneNumber(text)).toBe(false);
  });
});

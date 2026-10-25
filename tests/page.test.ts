import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { load } from 'cheerio';
import { beforeAll, describe, expect, it } from 'vitest';
import { looksLikePhoneNumber } from '../src/lib/resume';

const dist = resolve(__dirname, '../dist');
let $: ReturnType<typeof load>;

beforeAll(() => {
  $ = load(readFileSync(resolve(dist, 'index.html'), 'utf8'));
});

describe('built page: structure', () => {
  it('has one h1 with the headline, and the sections in spec order', () => {
    expect($('h1')).toHaveLength(1);
    expect($('h1').text()).toContain('Senior Technical Manager');
    const ids = $('main > section').map((_, el) => $(el).attr('id')).get();
    expect(ids).toEqual(['hero', 'about', 'experience', 'skills', 'projects', 'education', 'contact']);
  });
});

describe('built page: experience', () => {
  it('lists the public roles with their bullets and leaves out PDF-only roles', () => {
    const roles = $('#experience article').map((_, el) => $(el).find('h3').text()).get();
    expect(roles).toHaveLength(2);
    expect(roles[0]).toContain('Senior Technical Manager');
    expect(roles[0]).toContain('NextGen Invent');
    expect($('#experience article').first().find('li').length).toBeGreaterThanOrEqual(5);
    expect($('#experience').text()).not.toContain('PCS Technology');
    expect($('#experience').text()).toContain('Apr 2025');
  });
});

describe('built page: projects', () => {
  it('shows three project cards, each with problem, role, stack and result', () => {
    const cards = $('#projects article');
    expect(cards).toHaveLength(3);
    expect(cards.map((_, el) => $(el).find('h3').text()).get()).toEqual([
      'DocLabel',
      'ProviderEdge (revenue cycle management)',
      'Autonomous Medical Coding',
    ]);
    cards.each((_, el) => {
      const labels = $(el).find('dt').map((__, dt) => $(dt).text()).get();
      expect(labels).toEqual(['Problem', 'My role', 'Stack', 'Result']);
    });
  });
});

describe('built page: navigation and contact', () => {
  it('links the calls to action to the email address and the resume PDF', () => {
    expect($('#hero a[href="mailto:prashant.mec@gmail.com"]').text()).toContain('Get in touch');
    expect($('#hero a[href="/Prashant-Kumar-Resume.pdf"]').text()).toContain('Download resume');
    expect($('#contact a[href="mailto:prashant.mec@gmail.com"]')).toHaveLength(1);
    expect($('#contact a[href="/Prashant-Kumar-Resume.pdf"]')).toHaveLength(1);
  });

  it('has top-bar links that all point at sections that exist', () => {
    const links = $('header nav a[href^="#"]');
    expect(links.map((_, a) => $(a).text().trim()).get()).toEqual(['About', 'Experience', 'Skills', 'Projects', 'Contact']);
    links.each((_, a) => expect($(`${$(a).attr('href')}`)).toHaveLength(1));
  });

  it('opens external links safely and shows the LinkedIn profile', () => {
    const external = $('a[href^="http"]');
    expect(external.filter((_, a) => ($(a).attr('href') ?? '').includes('linkedin.com/in/prashantk83'))).toHaveLength(1);
    external.each((_, a) => expect($(a).attr('rel')).toMatch(/noopener/));
  });
});

describe('built page: search and sharing metadata', () => {
  it('describes the person with valid JSON-LD', () => {
    const data = JSON.parse($('script[type="application/ld+json"]').first().text());
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Prashant Kumar');
    expect(data.jobTitle).toContain('Technical Manager');
    expect(data.sameAs).toContain('https://www.linkedin.com/in/prashantk83/');
  });

  it('has Open Graph and Twitter card tags with an absolute image URL', () => {
    expect($('meta[property="og:title"]').attr('content')).toContain('Prashant Kumar');
    expect($('meta[property="og:description"]').attr('content')).toBeTruthy();
    expect($('meta[property="og:image"]').attr('content')).toBe('https://pksingh83.github.io/og.png');
    expect($('meta[name="twitter:card"]').attr('content')).toBe('summary_large_image');
  });
});

describe('built page: privacy and self-hosting', () => {
  it('contains no phone number, PDF-only role, or third-party resource', () => {
    const html = $.html();
    expect(looksLikePhoneNumber(html)).toBe(false);
    expect(html).not.toContain('PCS Technology');
    const urls = $('[src], [href], [content^="http"]')
      .map((_, el) => $(el).attr('src') ?? $(el).attr('href') ?? $(el).attr('content') ?? '')
      .get()
      .filter((u) => /^https?:\/\//.test(u));
    const hosts = new Set(urls.map((u) => new URL(u).host));
    expect([...hosts].sort()).toEqual(['pksingh83.github.io', 'www.linkedin.com']);
  });
});

describe('built site: static files', () => {
  it('ships the share image, favicon, robots.txt and a sitemap pointing at the site URL', () => {
    expect(readFileSync(resolve(dist, 'og.png')).subarray(1, 4).toString()).toBe('PNG');
    expect(existsSync(resolve(dist, 'favicon.svg'))).toBe(true);
    expect(existsSync(resolve(dist, 'favicon.ico'))).toBe(false);
    expect(readFileSync(resolve(dist, 'robots.txt'), 'utf8')).toContain('Sitemap: https://pksingh83.github.io/sitemap.xml');
    expect(readFileSync(resolve(dist, 'sitemap.xml'), 'utf8')).toContain('<loc>https://pksingh83.github.io/</loc>');
  });
});

describe('built site: self-hosted heading font', () => {
  const assets = resolve(dist, '_astro');
  const css = () =>
    readdirSync(assets)
      .filter((f) => f.endsWith('.css'))
      .map((f) => readFileSync(resolve(assets, f), 'utf8'))
      .join('\n');

  it('declares Monaspace Neon from local woff2 files that are small and not fetched from elsewhere', () => {
    const faces = css().match(/@font-face\{[^}]*Monaspace Neon[^}]*\}/g) ?? [];
    expect(faces.length).toBeGreaterThan(0);
    const files = faces.flatMap((face) => [...face.matchAll(/url\(([^)]+\.woff2)\)/g)].map((m) => m[1].replace(/["']/g, '')));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      expect(file).not.toMatch(/^https?:/);
      const path = resolve(assets, file.replace(/^(\.\/|\/_astro\/)/, ''));
      expect(existsSync(path)).toBe(true);
      expect(statSync(path).size).toBeLessThan(60_000);
    }
    const withoutComments = css().replace(/\/\*[\s\S]*?\*\//g, '');
    expect(withoutComments).not.toMatch(/url\(\s*["']?https?:|@import\s+(url\()?["']?https?:/);
  });
});

describe('built page: styling goes through the theme tokens', () => {
  it('has no inline style attributes, so every color comes from a shared token or class', () => {
    const inline = $('[style]')
      .map((_, el) => `${el.tagName}: ${$(el).attr('style')}`)
      .get();
    expect(inline).toEqual([]);
  });
});

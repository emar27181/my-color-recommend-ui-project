/**
 * Route and deployment compatibility contract.
 *
 * The research publication links to https://color-recommend.netlify.app/.
 * That hostname must keep the classic V1 at "/" even after V2 becomes
 * the default home page on all new deployment hostnames.
 *
 * These are explicit hostname matches (not suffix matches) to avoid
 * accidental host aliases and misleading preview URLs.
 */
export const COLOR_ROUTES = {
  home: '/',
  classic: '/classic',
  v1: '/v1',
  v2: '/v2',
  experiment: '/experiment',
} as const;

export const PRESERVED_RESEARCH_HOSTS = ['color-recommend.netlify.app'] as const;

export function landingVersion(hostname: string): 'classic' | 'v2' {
  const normalized = hostname.trim().toLowerCase().replace(/\.$/, '');
  return PRESERVED_RESEARCH_HOSTS.some(host => host === normalized) ? 'classic' : 'v2';
}

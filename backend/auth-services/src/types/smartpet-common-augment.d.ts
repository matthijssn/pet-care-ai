// src/types/smartpet__common.d.ts
declare module '@smartpet/common' {
  export function signJwt(payload: { sub: string; role?: string }): string;
  export function signRefreshJwt(payload: { sub: string }): string;
  export function verifyJwt(token: string): { sub: string };
  export function verifyRefreshJwt(token: string): { sub: string };
}
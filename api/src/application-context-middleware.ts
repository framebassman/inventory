import type { Context, MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { container } from 'tsyringe';
import { TenantManagementStore } from './model/tenant-management-store';
import { InventoryManagementStore } from './model/inventory-management-store';

export const applicationCxt = 'applicationContext';

const googleConfig = {
  type: 'service_account',
  project_id: 'inventory-459416',
  private_key_id: 'd3c61ad750844c17578d9b55c2a063a31ab0dd01',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCJFeaTRXDkY/mI\nkAyACKNktglDak/wCxCM7DiDhHpc9J8iYsYH+hv8KoaV69HomNlODtQetMKGOHxN\no0kf+0UOEuj6Ff+os5Fhrlxx9/rc5jbfv2TGyGxiA9seWkzmiaAfUUCVyNyxtfRb\nuHfOKVMGpyDmfcMS8xqKpOlLCx99VxrE5UYJJRZv0HvDvc2Ib47wk06gaKnj2ywY\nkhIodDlAKplYeJBzWN38DVxtYCnnrSBeOqgzIw+r7RpR9vHO5RyW04mYXq3B+6Wr\nto54wek55qyU9RORVPM9QfNdq279D8B4SVEvnzkId3dIpARbWS95BoQuRQUuwwwM\n+akj+4chAgMBAAECggEAFvucfilgvXHDdrFL3zVTi4F3eR18TG7WdgHukaImz6nV\nejLcJ583jOXmTYFNXnUtzYfv6Tv99vnGYU/UZS+/ypXCCJeilrqQT7OnXRYpsVpJ\nbebNMwSMIzypQmP6S5ZcSZPaQ6J62bJ7Rttc/qvv9wgTHIGOMIGgfAkc8c9qFp3C\nkIb3UZ2P2MEMOkRk1Cc6EzA/yEdfj0moQDd+tK9ApTuQG3/Vo2N3HgZg44LSO79W\nYQEczR4PTAMLTFgcBGx0KLPX7FDdN+ix1egLmuzjcycoXJFLLW/5LuktsXVMpkNt\nhibEJljm2jIUvpsUE8a404sExX5KwJHog/9Gnerp6QKBgQDAtwO9LTdarUwpYAr6\ntqatOkILuM6oMoZuxdxrE0pUMdHtg4zFE/xWl4nI3Wn4lqoXt7cbK6YIiLFLzuWR\n0Mz5fWJK/SYVFDNV6s8piliuLjB70dJmi0b0aAy3IZHSxivOBJgqoPS3ntL866E6\nEIHP2G3NIk1Prxs2CDgI04PljQKBgQC2Gkl/zjJQxjBgDwm9LGTdUn7/lLv+BPJh\njOq65PtbygRAEkrjDQr+QPWgxov9Or9wmoDaS7M2UR0LZTlHMJWW+W3f+RBGvaa4\nVGP/ha5orSBFe0zmZH6WBimtLKob/1fjjNwqYypMCCv8z6ufpYPMAlEn5Wrn+sbJ\neWKn8Lfw5QKBgQCTRknRNNDstytRI1jAqP1PvQnkM2ObHqGl3gfIvIE9PqWTwci+\ng7t/4Wcm3i6yD1IFthx04zKLqwrzSDYg7VT4BV4suLF1wm5I5p1Svatv0VS0C3Gj\ndCTRewLcoQbz8QZg9xni2gaqnPHY36ni2eKamGexMNmsX8GH1VgdRqexsQKBgHBo\nDZKMr1ZY4CeLYNGbA6/yal5NazXDy/IXUBWJnvbr3m/GWt+If46ufnB93o+zodRa\nKsuVCsyuiSUtmIuvG8eTtBUa4scn7i++N/PUivImW9NH5xIYWmM07qjs9xxNI+1c\nV9L6X3OLX8uwTRpAyvg1Pe9ImBMWI3reKN3No11ZAoGAM5dmX7vgTMiSMZbuzl2Z\nfWIOaa2sAVoXE63C/WP7n2MGvyGl1A9/mW5T3/My8Fy/MuYlLVRWIIfa2n03chbP\niifcq2xGdvjZKMWIAFvzH08VotbRKdLn/Y3d1nEv7vNz1Hld/qWTi7OQz8S/kkOs\ntCddst1BSovDGDoWHA/+nxU=\n-----END PRIVATE KEY-----\n',
  client_email:
    'inventory-google-account@inventory-459416.iam.gserviceaccount.com',
  client_id: '107574928878412861134',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/inventory-google-account%40inventory-459416.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com'
};

export const applicationContextMiddleware = (): MiddlewareHandler =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createMiddleware(async (ctx: Context, next: any) => {
    if (!ctx.get(applicationCxt)) {
      container.register<TenantManagementStore>(TenantManagementStore, {
        useValue: new TenantManagementStore(ctx.env.HYPERDRIVE.connectionString)
      });
      container.register<InventoryManagementStore>(InventoryManagementStore, {
        useValue: new InventoryManagementStore(
          googleConfig,
          '14lLXX19aRQ9aCKbCIaLRPEqzx7HMyPGhUn29ULnAWPs'
        )
      });
      ctx.set(applicationCxt, container);
    }
    await next();
  });

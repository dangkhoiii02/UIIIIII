import { readFileSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

interface MockApiOrderRow {
  order_code: string;
  status_code: string;
  [key: string]: unknown;
}

interface MockApiFixture {
  meta: Record<string, unknown>;
  data: MockApiOrderRow[];
}

const mockFixturePath = fileURLToPath(
  new URL('./src/features/orders/data/mock-order-api-data.json', import.meta.url),
);

function mockOrderApiMiddleware() {
  return (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    if (!request.url) return next();
    const url = new URL(request.url, 'http://127.0.0.1');
    if (!url.pathname.startsWith('/mock-api/v1/')) return next();

    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    if (request.method !== 'GET') {
      response.statusCode = 405;
      response.end(JSON.stringify({ error: { code: 'METHOD_NOT_ALLOWED' } }));
      return;
    }

    const fixture = JSON.parse(readFileSync(mockFixturePath, 'utf8')) as MockApiFixture;
    if (url.pathname === '/mock-api/v1/health') {
      response.end(
        JSON.stringify({ status: 'ok', source: fixture.meta, records: fixture.data.length }),
      );
      return;
    }

    if (url.pathname === '/mock-api/v1/orders') {
      const statusCode = url.searchParams.get('status_code')?.trim();
      const query = url.searchParams.get('q')?.trim().toLocaleLowerCase('vi');
      const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
      const perPage = Math.min(100, Math.max(1, Number(url.searchParams.get('per_page')) || 20));
      const filtered = fixture.data.filter((order) => {
        if (statusCode && order.status_code !== statusCode) return false;
        if (query && !JSON.stringify(order).toLocaleLowerCase('vi').includes(query)) return false;
        return true;
      });
      const offset = (page - 1) * perPage;
      response.end(
        JSON.stringify({
          meta: {
            ...fixture.meta,
            page,
            per_page: perPage,
            total: filtered.length,
            total_pages: Math.max(1, Math.ceil(filtered.length / perPage)),
          },
          data: filtered.slice(offset, offset + perPage),
        }),
      );
      return;
    }

    const detailMatch = url.pathname.match(/^\/mock-api\/v1\/orders\/(\d{13})$/);
    if (detailMatch) {
      const order = fixture.data.find((item) => item.order_code === detailMatch[1]);
      if (!order) {
        response.statusCode = 404;
        response.end(JSON.stringify({ error: { code: 'ORDER_NOT_FOUND' } }));
        return;
      }
      response.end(JSON.stringify({ meta: fixture.meta, data: order }));
      return;
    }

    response.statusCode = 404;
    response.end(JSON.stringify({ error: { code: 'MOCK_ROUTE_NOT_FOUND' } }));
  };
}

function mockOrderApiPlugin(): Plugin {
  return {
    name: 'mock-order-api',
    configureServer(server) {
      server.middlewares.use(mockOrderApiMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(mockOrderApiMiddleware());
    },
  };
}

export default defineConfig({
  plugins: [react(), mockOrderApiPlugin()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});

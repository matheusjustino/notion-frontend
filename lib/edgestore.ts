'use client';

import { createEdgeStoreProvider } from '@edgestore/react';

// ROUTES
import { type EdgeStoreRouter } from '@/app/api/edgestore/[...edgestore]/route';

const { EdgeStoreProvider, useEdgeStore } =
	createEdgeStoreProvider<EdgeStoreRouter>();

export { EdgeStoreProvider, useEdgeStore };

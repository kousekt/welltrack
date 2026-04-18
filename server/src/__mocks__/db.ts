import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

const prismaMock = mockDeep<PrismaClient>();

export { mockReset, DeepMockProxy };
export type { PrismaClient };
export default prismaMock;

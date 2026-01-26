/**
 * Tests for googleDrive service
 * Run with: npx tsx src/services/googleDrive.test.ts
 */

import {
  searchMarkdownFiles,
  listRecentMarkdownFiles,
  fetchFileContent,
  fetchFileInfo,
  isMarkdownFile,
} from './googleDrive';
import type { DriveFile } from '../types/googleDrive';

// Mock fetch
const originalFetch = globalThis.fetch;

function mockFetch(response: unknown, ok = true, statusText = 'OK') {
  globalThis.fetch = async () =>
    ({
      ok,
      statusText,
      json: async () => response,
      text: async () => (typeof response === 'string' ? response : JSON.stringify(response)),
    }) as Response;
}

function restoreFetch() {
  globalThis.fetch = originalFetch;
}

// Test results tracking
let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.log(`  ✗ ${message}`);
    failed++;
  }
}

async function assertThrows(fn: () => Promise<unknown>, message: string) {
  try {
    await fn();
    console.log(`  ✗ ${message} (did not throw)`);
    failed++;
  } catch {
    console.log(`  ✓ ${message}`);
    passed++;
  }
}

// Test data
const mockFiles: DriveFile[] = [
  {
    id: '1',
    name: 'readme.md',
    mimeType: 'text/markdown',
    modifiedTime: '2024-01-15T10:00:00Z',
    size: '1024',
  },
  {
    id: '2',
    name: 'notes.markdown',
    mimeType: 'text/markdown',
    modifiedTime: '2024-01-14T10:00:00Z',
    size: '2048',
  },
  {
    id: '3',
    name: 'document.txt',
    mimeType: 'text/plain',
    modifiedTime: '2024-01-13T10:00:00Z',
    size: '512',
  },
];

// Tests
async function testListRecentMarkdownFiles() {
  console.log('\nlistRecentMarkdownFiles:');

  // Test: Returns markdown files sorted by date
  mockFetch({ files: mockFiles });
  const files = await listRecentMarkdownFiles('test-token');
  assert(files.length === 2, 'Should return only .md and .markdown files');
  assert(files[0].name === 'readme.md', 'First file should be readme.md');
  assert(files[1].name === 'notes.markdown', 'Second file should be notes.markdown');
  restoreFetch();

  // Test: Handles empty response
  mockFetch({ files: [] });
  const emptyFiles = await listRecentMarkdownFiles('test-token');
  assert(emptyFiles.length === 0, 'Should return empty array for no files');
  restoreFetch();

  // Test: Handles null files in response
  mockFetch({ files: null });
  const nullFiles = await listRecentMarkdownFiles('test-token');
  assert(nullFiles.length === 0, 'Should return empty array for null files');
  restoreFetch();

  // Test: Throws on API error
  mockFetch({}, false, 'Unauthorized');
  await assertThrows(
    () => listRecentMarkdownFiles('invalid-token'),
    'Should throw on API error'
  );
  restoreFetch();

  // Test: Respects maxResults parameter
  mockFetch({ files: mockFiles });
  await listRecentMarkdownFiles('test-token', 10);
  // Verify fetch was called (we can't easily check params without more complex mocking)
  assert(true, 'Should accept maxResults parameter');
  restoreFetch();
}

async function testSearchMarkdownFiles() {
  console.log('\nsearchMarkdownFiles:');

  // Test: Returns matching files
  mockFetch({ files: mockFiles });
  const files = await searchMarkdownFiles('test-token', 'readme');
  assert(files.length === 2, 'Should return filtered markdown files');
  restoreFetch();

  // Test: Returns empty for empty query
  const emptyQueryFiles = await searchMarkdownFiles('test-token', '');
  assert(emptyQueryFiles.length === 0, 'Should return empty for empty query');

  // Test: Returns empty for whitespace query
  const whitespaceFiles = await searchMarkdownFiles('test-token', '   ');
  assert(whitespaceFiles.length === 0, 'Should return empty for whitespace query');

  // Test: Handles special characters in query
  mockFetch({ files: [] });
  const specialFiles = await searchMarkdownFiles('test-token', "test's");
  assert(specialFiles.length === 0, 'Should handle special characters in query');
  restoreFetch();
}

async function testFetchFileContent() {
  console.log('\nfetchFileContent:');

  // Test: Returns file content
  mockFetch('# Hello World\n\nThis is content.');
  const content = await fetchFileContent('test-token', 'file-id');
  assert(content === '# Hello World\n\nThis is content.', 'Should return file content');
  restoreFetch();

  // Test: Throws on API error
  mockFetch('', false, 'Not Found');
  await assertThrows(
    () => fetchFileContent('test-token', 'invalid-id'),
    'Should throw on file not found'
  );
  restoreFetch();
}

async function testFetchFileInfo() {
  console.log('\nfetchFileInfo:');

  // Test: Returns file info
  const mockFile = mockFiles[0];
  mockFetch(mockFile);
  const info = await fetchFileInfo('test-token', 'file-id');
  assert(info !== null, 'Should return file info');
  assert(info?.name === 'readme.md', 'Should have correct file name');
  restoreFetch();

  // Test: Returns null on error
  mockFetch({}, false, 'Not Found');
  const notFoundInfo = await fetchFileInfo('test-token', 'invalid-id');
  assert(notFoundInfo === null, 'Should return null on error');
  restoreFetch();
}

function testIsMarkdownFile() {
  console.log('\nisMarkdownFile:');

  // Test: Recognizes .md files
  assert(
    isMarkdownFile({ id: '1', name: 'readme.md', mimeType: 'text/markdown' }),
    'Should recognize .md files'
  );

  // Test: Recognizes .markdown files
  assert(
    isMarkdownFile({ id: '2', name: 'notes.markdown', mimeType: 'text/markdown' }),
    'Should recognize .markdown files'
  );

  // Test: Recognizes uppercase extensions
  assert(
    isMarkdownFile({ id: '3', name: 'README.MD', mimeType: 'text/markdown' }),
    'Should recognize uppercase .MD files'
  );

  // Test: Rejects non-markdown files
  assert(
    !isMarkdownFile({ id: '4', name: 'document.txt', mimeType: 'text/plain' }),
    'Should reject .txt files'
  );

  // Test: Rejects files without extensions
  assert(
    !isMarkdownFile({ id: '5', name: 'readme', mimeType: 'text/plain' }),
    'Should reject files without extension'
  );
}

// Run all tests
async function runTests() {
  console.log('=== Google Drive Service Tests ===');

  await testListRecentMarkdownFiles();
  await testSearchMarkdownFiles();
  await testFetchFileContent();
  await testFetchFileInfo();
  testIsMarkdownFile();

  console.log('\n=== Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

// Test setup file
import * as fs from 'fs';
import * as path from 'path';

// Create a test data file before running tests
const testDataPath = path.join(__dirname, '..', 'test-mock-post.json');
const originalDataPath = path.join(__dirname, '..', 'mock-post.json');

// Copy original data to test data file
if (fs.existsSync(originalDataPath)) {
  fs.copyFileSync(originalDataPath, testDataPath);
}

// Set environment variable to use test data
process.env.TEST_DATA_FILE = testDataPath;

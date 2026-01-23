#!/usr/bin/env node
/**
 * Generate MP3 audio files for English vocabulary using ElevenLabs API
 * Voice: Rachel (American female)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ElevenLabs Configuration
const API_KEY = 'sk_a33a1319eb734dfdba8f13f8dbee9b6621e1536b4bce3b5f';
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel - American female voice

const OUTPUT_DIR = path.join(__dirname, '../public/audio/vocabulary');

// Read vocabulary list
const vocabFile = path.join(__dirname, '../danh-sach-tu-vung.txt');
const words = fs.readFileSync(vocabFile, 'utf-8')
  .split('\n')
  .filter(line => line.trim())
  .map(word => word.trim());

console.log(`Found ${words.length} words to process`);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Convert word to filename (lowercase, replace spaces with hyphens)
function wordToFilename(word) {
  return word.toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') + '.mp3';
}

// Generate audio for a single word
function generateAudio(word, index) {
  return new Promise((resolve, reject) => {
    const filename = wordToFilename(word);
    const outputPath = path.join(OUTPUT_DIR, filename);

    // Skip if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`[${index + 1}/${words.length}] Skipping "${word}" - already exists`);
      resolve({ word, filename, skipped: true });
      return;
    }

    const postData = JSON.stringify({
      text: word,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0,
        use_speaker_boost: true
      }
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorData = '';
        res.on('data', chunk => errorData += chunk);
        res.on('end', () => {
          console.error(`[${index + 1}/${words.length}] Error for "${word}": ${res.statusCode} - ${errorData}`);
          reject(new Error(`HTTP ${res.statusCode}: ${errorData}`));
        });
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`[${index + 1}/${words.length}] Generated: ${filename}`);
        resolve({ word, filename, skipped: false });
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete partial file
        reject(err);
      });
    });

    req.on('error', (err) => {
      console.error(`[${index + 1}/${words.length}] Network error for "${word}":`, err.message);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Process words sequentially to avoid rate limiting
async function processWords() {
  const results = {
    success: [],
    skipped: [],
    failed: []
  };

  const DELAY_BETWEEN_REQUESTS = 500; // 500ms delay between requests

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    try {
      const result = await generateAudio(word, i);
      if (result.skipped) {
        results.skipped.push(result);
      } else {
        results.success.push(result);
        // Only delay after successful generation (not skipped)
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
      }
    } catch (err) {
      results.failed.push({ word, error: err.message });
      // Wait longer after failure to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Print summary
  console.log('\n========== SUMMARY ==========');
  console.log(`Total words: ${words.length}`);
  console.log(`Generated: ${results.success.length}`);
  console.log(`Skipped (already exists): ${results.skipped.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\nFailed words:');
    results.failed.forEach(f => console.log(`  - ${f.word}: ${f.error}`));
  }

  // Create mapping file for the app
  const mapping = {};
  words.forEach(word => {
    mapping[word.toLowerCase()] = wordToFilename(word);
  });

  const mappingPath = path.join(OUTPUT_DIR, 'mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`\nMapping file saved to: ${mappingPath}`);
}

// Run
processWords().catch(console.error);

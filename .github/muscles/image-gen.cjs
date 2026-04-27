#!/usr/bin/env node
// @description Generate images using Replicate API
// @currency 2026-04-27

const https = require('https');
const fs = require('fs');
const path = require('path');

// Model versions (update periodically)
const MODELS = {
  'flux-schnell': 'black-forest-labs/flux-schnell',
  'flux-dev': 'black-forest-labs/flux-dev',
  'sdxl': 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
};

const DEFAULT_NEGATIVE = 'blurry, low quality, distorted, text, watermark, signature';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    prompt: '',
    negative: DEFAULT_NEGATIVE,
    model: 'flux-schnell',
    width: 1024,
    height: 1024,
    output: './generated-image.png',
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--prompt':
      case '-p':
        opts.prompt = args[++i];
        break;
      case '--negative':
      case '-n':
        opts.negative = args[++i];
        break;
      case '--model':
      case '-m':
        opts.model = args[++i];
        break;
      case '--width':
      case '-w':
        opts.width = parseInt(args[++i], 10);
        break;
      case '--height':
      case '-h':
        opts.height = parseInt(args[++i], 10);
        break;
      case '--output':
      case '-o':
        opts.output = args[++i];
        break;
      case '--help':
        printHelp();
        process.exit(0);
    }
  }

  return opts;
}

function printHelp() {
  console.log(`
image-gen.cjs — Generate images using Replicate API

Usage:
  node image-gen.cjs --prompt "your prompt" [options]

Options:
  --prompt, -p    Image prompt (required)
  --negative, -n  Negative prompt (default: blurry, low quality...)
  --model, -m     Model: flux-schnell, flux-dev, sdxl (default: flux-schnell)
  --width, -w     Image width (default: 1024)
  --height, -h    Image height (default: 1024)
  --output, -o    Output file path (default: ./generated-image.png)
  --help          Show this help

Environment:
  REPLICATE_API_TOKEN    Required. Your Replicate API token.

Exit codes:
  0    Success — image saved
  1    Error — API or file system failure
  2    Review needed — requires semantic judgment

Examples:
  node image-gen.cjs -p "a futuristic city at sunset, digital art"
  node image-gen.cjs -p "minimal app icon, blue gradient" -m flux-dev -o icon.png
`);
}

// Make HTTPS request
function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Create prediction
async function createPrediction(token, model, input) {
  const modelId = MODELS[model] || model;
  
  // For official models, use the model endpoint directly
  const isOfficialModel = modelId.includes('/') && !modelId.includes(':');
  
  let endpoint, body;
  
  if (isOfficialModel) {
    // Official models use /models/{owner}/{name}/predictions
    endpoint = `/v1/models/${modelId}/predictions`;
    body = { input };
  } else {
    // Versioned models use /predictions with version
    endpoint = '/v1/predictions';
    const [, version] = modelId.split(':');
    body = { version: version || modelId, input };
  }

  const res = await request(
    {
      hostname: 'api.replicate.com',
      path: endpoint,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'wait', // Wait for result if fast
      },
    },
    body
  );

  if (res.status !== 201 && res.status !== 200) {
    throw new Error(`API error ${res.status}: ${JSON.stringify(res.data)}`);
  }

  return res.data;
}

// Poll for prediction result
async function waitForPrediction(token, id, maxWait = 300000) {
  const start = Date.now();
  
  while (Date.now() - start < maxWait) {
    const res = await request({
      hostname: 'api.replicate.com',
      path: `/v1/predictions/${id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 200) {
      throw new Error(`Poll error ${res.status}: ${JSON.stringify(res.data)}`);
    }

    const { status, output, error } = res.data;

    if (status === 'succeeded') {
      return output;
    }
    if (status === 'failed') {
      throw new Error(`Generation failed: ${error}`);
    }
    if (status === 'canceled') {
      throw new Error('Generation was canceled');
    }

    // Wait before polling again
    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error('Timeout waiting for generation');
}

// Download image from URL
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        https.get(res.headers.location, (res2) => {
          res2.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
      } else {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', reject);
  });
}

async function main() {
  const opts = parseArgs();

  // Validate
  if (!opts.prompt) {
    console.error('Error: --prompt is required');
    process.exit(1);
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    console.error('Error: REPLICATE_API_TOKEN environment variable is required');
    console.error('Get your token at: https://replicate.com/account/api-tokens');
    process.exit(1);
  }

  console.error(`Generating image with ${opts.model}...`);
  console.error(`Prompt: ${opts.prompt}`);

  try {
    // Build input based on model
    const input = {
      prompt: opts.prompt,
      width: opts.width,
      height: opts.height,
      num_outputs: 1,
    };

    // Add negative prompt for models that support it
    if (opts.model !== 'flux-schnell' && opts.model !== 'flux-dev') {
      input.negative_prompt = opts.negative;
    }

    // Create prediction
    const prediction = await createPrediction(token, opts.model, input);

    // Get output
    let output;
    if (prediction.status === 'succeeded') {
      output = prediction.output;
    } else {
      console.error(`Status: ${prediction.status}, waiting...`);
      output = await waitForPrediction(token, prediction.id);
    }

    // Handle output (can be string or array)
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    console.error(`Downloading from: ${imageUrl}`);

    // Ensure output directory exists
    const outDir = path.dirname(opts.output);
    if (outDir && !fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Download image
    await downloadImage(imageUrl, opts.output);

    console.error(`✓ Saved to: ${opts.output}`);
    
    // Output JSON result to stdout
    console.log(JSON.stringify({
      success: true,
      output: opts.output,
      model: opts.model,
      prompt: opts.prompt,
      dimensions: `${opts.width}x${opts.height}`,
    }));

    process.exit(0);
  } catch (err) {
    console.error(`✗ Error: ${err.message}`);
    process.exit(1);
  }
}

main();

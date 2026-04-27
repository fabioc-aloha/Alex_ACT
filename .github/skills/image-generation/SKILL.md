---
type: skill
lifecycle: experimental
inheritance: inheritable
name: image-generation
description: "Generate images using Replicate API — model selection, prompt engineering, and output handling"
tier: standard
applyTo: "**/*image*,**/*visual*,**/*graphic*,**/*banner*,**/*icon*,**/*logo*"
currency: 2026-04-27
---

# Image Generation via Replicate

Generate images programmatically using Replicate's hosted ML models.

## Purpose

Enable Alex to create images for documentation, UI assets, banners, and visual content without manual design tools.

## When to Use

| Trigger | Action |
|---------|--------|
| "Create an image of..." | Generate via Replicate |
| "Make a banner/icon/logo" | Generate with appropriate model |
| "Visualize this concept" | Generate illustration |
| Documentation needs visual | Generate diagram or illustration |

## Model Selection

| Model | Best For | Speed | Quality |
|-------|----------|-------|---------|
| `black-forest-labs/flux-schnell` | Fast drafts, iteration | ⚡ Fast | Good |
| `black-forest-labs/flux-dev` | High quality finals | 🐢 Slow | Excellent |
| `stability-ai/sdxl` | General purpose | Medium | Very Good |
| `stability-ai/stable-diffusion-3` | Latest SD | Medium | Excellent |

**Default**: `flux-schnell` for speed. Upgrade to `flux-dev` for final assets.

## Prompt Engineering

### Structure

```
[Subject] [Style] [Details] [Technical specs]
```

### Style Modifiers

| Style | Prompt Addition |
|-------|-----------------|
| Photorealistic | "photorealistic, 8k, detailed" |
| Illustration | "digital illustration, clean lines" |
| Icon/Logo | "minimal, vector style, simple shapes, no text" |
| Technical diagram | "technical diagram, clean, labeled, white background" |
| Abstract | "abstract, geometric, modern" |

### Negative Prompts

Always include to avoid common issues:

```
blurry, low quality, distorted, text, watermark, signature
```

For icons/logos add:
```
complex background, photorealistic, detailed textures
```

## API Reference

### Authentication

```
REPLICATE_API_TOKEN=r8_xxxxx
```

### Create Prediction

```bash
curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "<model-version-id>",
    "input": {
      "prompt": "...",
      "negative_prompt": "...",
      "width": 1024,
      "height": 1024,
      "num_outputs": 1
    }
  }'
```

### Poll for Result

```bash
curl https://api.replicate.com/v1/predictions/<id> \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN"
```

### Response States

| Status | Meaning |
|--------|---------|
| `starting` | Model is loading |
| `processing` | Generating image |
| `succeeded` | Done — `output` contains URLs |
| `failed` | Error — check `error` field |

## Common Sizes

| Use Case | Dimensions |
|----------|------------|
| Square (social, avatar) | 1024×1024 |
| Banner (GitHub, docs) | 1280×640 |
| Thumbnail | 512×512 |
| Wide (header) | 1920×1080 |

## Output Handling

1. **Download** the generated URL immediately (expires)
2. **Save** to workspace with descriptive name
3. **Optimize** if needed (large files)

## Decision Framework

```
User wants image
    ↓
Is it a quick draft? → flux-schnell
    ↓
Is it final quality? → flux-dev
    ↓
Is it an icon/logo? → Add "minimal, vector style"
    ↓
Is it a photo? → Add "photorealistic, 8k"
    ↓
Generate → Download → Save
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Prompt too vague | Add style + technical specs |
| Expecting text in image | AI models can't do text reliably |
| Not downloading output | URLs expire — save immediately |
| Wrong aspect ratio | Match intended use case |
| Forgetting negative prompt | Always include quality negatives |

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Bad/missing token | Check REPLICATE_API_TOKEN |
| Model loading slow | Cold start | Wait or use popular model |
| Output is blurry | Low quality prompt | Add "high quality, detailed, 8k" |
| Wrong style | Prompt mismatch | Be explicit about style |

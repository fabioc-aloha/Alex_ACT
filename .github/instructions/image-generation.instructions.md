---
type: instruction
lifecycle: experimental
inheritance: inheritable
description: "Trigger image generation when user requests visual content — banners, icons, illustrations"
application: "When user asks for images, visual assets, or graphics"
applyTo: "**/*image*,**/*banner*,**/*icon*,**/*logo*,**/*visual*"
currency: 2026-04-27
---

# Image Generation Behavior

When the user requests visual content, use the image-generation trifecta.

## Trigger Phrases

| Phrase | Action |
|--------|--------|
| "create an image" | Generate via muscle |
| "make a banner" | Generate with banner dimensions |
| "design an icon" | Generate with icon style |
| "visualize this" | Generate illustration |
| "I need a graphic" | Determine type, then generate |

## Workflow

1. **Understand intent** — What kind of image? What style?
2. **Read skill** — Load `.github/skills/image-generation/SKILL.md`
3. **Craft prompt** — Use skill's prompt engineering guidelines
4. **Run muscle** — `node .github/muscles/image-gen.cjs`
5. **Handle output** — Download and save to workspace

## Muscle Interface

```bash
node .github/muscles/image-gen.cjs \
  --prompt "your prompt here" \
  --negative "blurry, low quality" \
  --model "flux-schnell" \
  --width 1024 \
  --height 1024 \
  --output "./generated-image.png"
```

## Exit Codes

| Code | Meaning | Next Step |
|------|---------|-----------|
| 0 | Success — image saved | Show user the file |
| 1 | Error — API failed | Check token, report error |
| 2 | Review needed | Semantic judgment required |

## Defaults

| Parameter | Default |
|-----------|---------|
| Model | `flux-schnell` |
| Width | 1024 |
| Height | 1024 |
| Negative prompt | "blurry, low quality, distorted, watermark" |

## Before Generating

- Confirm REPLICATE_API_TOKEN is set
- Clarify style if ambiguous
- Suggest dimensions based on use case

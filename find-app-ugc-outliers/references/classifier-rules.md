# Classifier rules

The cheap caption + handle classifier from step 3. Auto-confirms the obvious wins, auto-excludes the obvious false positives, marks the rest AMBIGUOUS for VidJutsu to settle in step 4.

**No app-specific logic lives here.** Every brand-specific signal comes from the user's input parameters.

## Inputs

```ts
type ClassifyInput = {
  app_name: string;                       // required
  app_handle?: string;                    // e.g. "joinladder"
  affiliate_handle_pattern?: string;      // regex source — e.g. ".*fromladder$"
  brand_keywords?: string[];              // team names, coach handles, branded hashtags
  false_positive_keywords?: string[];     // e.g. "jacob's ladder", "agility ladder"
};
```

## Verdicts

```ts
type Verdict = "CONFIRMED" | "NOT_APP" | "AMBIGUOUS";
```

## Rules (apply in order — first match wins)

```ts
function classify(handle: string, caption: string, input: ClassifyInput): { verdict: Verdict; reason: string } {
  const h = handle.toLowerCase();
  const c = caption.toLowerCase();
  const app = input.app_name.toLowerCase();

  // 1. Affiliate handle pattern → CONFIRMED
  if (input.affiliate_handle_pattern) {
    const re = new RegExp(input.affiliate_handle_pattern, "i");
    if (re.test(handle)) return { verdict: "CONFIRMED", reason: `handle matches affiliate pattern '${input.affiliate_handle_pattern}'` };
  }

  // 2. Brand handle → CONFIRMED
  if (input.app_handle) {
    const ah = input.app_handle.toLowerCase().replace(/^@/, "");
    if (h === ah || h.startsWith(ah)) return { verdict: "CONFIRMED", reason: `handle is the brand's own (${ah})` };
    if (c.includes(`@${ah}`)) return { verdict: "CONFIRMED", reason: `caption tags @${ah}` };
  }

  // 3. Branded hashtag / "<app> app" → CONFIRMED
  if (c.includes(`#${app}app`) || c.includes(`${app} app`) || c.includes(`#${app}`)) {
    return { verdict: "CONFIRMED", reason: `caption uses '#${app}' / '${app} app' / '#${app}app'` };
  }

  // 4. Brand keywords → CONFIRMED
  for (const kw of input.brand_keywords ?? []) {
    if (c.includes(kw.toLowerCase())) return { verdict: "CONFIRMED", reason: `caption mentions brand keyword '${kw}'` };
  }

  // 5. False-positive keywords → NOT_APP
  for (const fp of input.false_positive_keywords ?? []) {
    if (c.includes(fp.toLowerCase())) return { verdict: "NOT_APP", reason: `caption matches false-positive '${fp}'` };
  }

  // 6. Otherwise → AMBIGUOUS, let VidJutsu decide
  return { verdict: "AMBIGUOUS", reason: "no clear caption signal" };
}
```

## Why so loose by default

The cheap classifier exists to short-circuit obvious cases and save VidJutsu credits — not to be definitive. Anything ambiguous flows to step 4 where the actual video content is inspected. Don't try to encode brand-specific heuristics into this file; that belongs in the user-supplied input.

## Examples

| App | Recommended input |
|---|---|
| `Cluely` | nothing extra — distinctive name |
| `Pagepilot` | `app_handle: "pagepilot"` |
| `Ladder` (Strength Training) | `app_handle: "joinladder"`, `affiliate_handle_pattern: ".*fromladder$"`, `brand_keywords: ["team transform","team define","team endure","team iconic","team limitless","team reload","team max","team flex"]`, `false_positive_keywords: ["jacob's ladder","agility ladder","ladder drill","wallbars","swedish ladder"]` |
| `Cal AI` | `false_positive_keywords: ["calculator","cal poly","cal state"]` |

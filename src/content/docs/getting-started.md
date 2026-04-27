---
title: Getting Started
description: Run your first AI swarm in 2 minutes.
---

1. [How to install the CLI](#how-to-install-the-cli)
2. [Configure your API keys](#configure-your-api-keys)
3. [Run your first swarm](#run-your-first-swarm)
4. [Understand the output](#understand-the-output)
5. [Next steps](#next-steps)

---

## How to install the CLI

```bash
pip install sverm
```

Or with Homebrew:

```bash
brew install sverm
```

Verify it's installed:

```bash
sverm --version
```

---

## Configure your API keys

Create a `.env` file in your project root (or use environment variables):

```ini
# Minimum: one provider
DEEPSEEK_API_KEY=sk-your-key-here

# Optional: add more for cost routing
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

Sverm will auto-detect which providers you have configured and route tasks accordingly.

---

## Run your first swarm

```bash
sverm run research "What is the current state of carbon capture in Norway?"
```

This launches a **research swarm**: a manager agent breaks down the question,
3 researcher agents search in parallel, a fact-checker verifies the findings,
and a writer produces a report — all in 15-45 seconds.

You'll see a live view of what each agent is doing:

```
[manager]    Breaking down question into 3 subtopics...
[researcher-1] Searching for: Norwegian carbon capture projects
[researcher-2] Searching for: CCS technology status 2026
[researcher-3] Searching for: Norwegian CCS policy and regulation
[fact_checker] Verifying 12 claims across 3 research results...
[writer]     Writing report in Norwegian...
```

---

## Understand the output

When the swarm finishes, you'll get:

1. **The result** — a report, code review, debate transcript, or whatever you asked for
2. **A cost breakdown** — which models were used, how many tokens, total cost
3. **Agent logs** — what every agent did, if you want to inspect

Example cost report:

```
Swarm: research-swarm-v1
Total cost: $0.07
  manager      deepseek-v3   2,000 tokens   $0.003
  researcher-1 deepseek-v3   5,000 tokens   $0.018
  researcher-2 deepseek-v3   4,500 tokens   $0.016
  researcher-3 deepseek-v3   5,200 tokens   $0.019
  fact_checker gpt-4o-mini   1,500 tokens   $0.001
  writer       deepseek-v3   3,000 tokens   $0.008
Time: 22.3s
```

---

## Next steps

- **[What is an AI Swarm?](/concepts/what-is-ai-swarm/)** — understand the metaphor and the model
- **[Swarm Definitions](/swarm-definitions/)** — learn the YAML format for defining your own swarms
- **[Examples](/examples/)** — see concrete swarm configurations in action
- **[API Reference](/api-reference/)** — integrate swarms into your own applications

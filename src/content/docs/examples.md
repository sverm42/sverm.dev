---
title: Examples
description: Concrete swarm configurations with real outputs and cost breakdowns.
---

Real swarms with real results. Each example includes the full YAML
definition, the output, and the cost breakdown.

---

## Research: Norwegian hydrogen economy

**Task:** "Investigate the current state of hydrogen energy in Norway"

<details>
<summary>Swarm definition (YAML)</summary>

```yaml
swarm_id: research-swarm-v1
topology: hierarchical
agents:
  - id: manager
    role: Research Manager
    model: deepseek-v3
    temperature: 0.3
    tools: [delegate]
  - id: researcher
    role: Researcher
    instances: 3
    model: deepseek-v3
    temperature: 0.7
    tools: [web_search]
  - id: fact_checker
    role: Fact Checker
    model: gpt-4o-mini
    temperature: 0.1
    tools: [web_search]
  - id: writer
    role: Report Writer
    model: deepseek-v3
    temperature: 0.7
cost_budget:
  max_total_usd: 2.50
```
</details>

**Result:** A 1200-word report in Norwegian covering production methods,
infrastructure status, key players (Equinor, Nel, Yara), policy framework,
and future outlook.

**Cost:** $0.07 | **Time:** 22.3s

---

## Code review: A pull request

**Task:** "Review this PR: https://github.com/example/project/pull/42"

<details>
<summary>Swarm definition (YAML)</summary>

```yaml
swarm_id: code-review-swarm-v1
topology: parallel
agents:
  - id: manager
    role: Review Coordinator
    model: deepseek-v3
    temperature: 0.2
    tools: [delegate]
  - id: security
    role: Security Reviewer
    model: claude-sonnet-4-20250514
    temperature: 0.2
  - id: performance
    role: Performance Reviewer
    model: deepseek-v3
    temperature: 0.2
  - id: style
    role: Style Reviewer
    model: gpt-4o-mini
    temperature: 0.3
cost_budget:
  max_total_usd: 1.50
```
</details>

**Result:** A structured review with 3 sections (security: 2 critical,
1 warning; performance: 1 N+1 query found; style: 5 suggestions).
All findings ranked by severity.

**Cost:** $0.34 | **Time:** 18.1s

---

## Debate: AI regulation

**Task:** "Should frontier AI development be regulated by governments?"

<details>
<summary>Swarm definition (YAML)</summary>

```yaml
swarm_id: debate-swarm-v1
topology: debate
agents:
  - id: moderator
    role: Moderator
    model: deepseek-v3
    temperature: 0.3
    tools: [delegate]
  - id: pro
    role: Pro-regulation
    model: deepseek-r1
    temperature: 0.7
    tools: [web_search]
  - id: con
    role: Anti-regulation
    model: deepseek-r1
    temperature: 0.7
    tools: [web_search]
  - id: judge
    role: Judge
    model: claude-sonnet-4-20250514
    temperature: 0.2
cost_budget:
  max_total_usd: 3.00
```
</details>

**Result:** 3 rounds of structured debate. Pro scored higher on evidence
(cited 7 sources). Con scored higher on logical consistency. Judge's
verdict: "Pro-regulation has stronger empirical grounding; con-regulation
raises important concerns about innovation velocity. A balanced regulatory
sandbox approach emerges as the synthesis."

**Cost:** $1.87 | **Time:** 67.2s

---

## Writing: A blog post draft

**Task:** "Write a 800-word blog post about why stateless agents are better
than stateful ones"

<details>
<summary>Swarm definition (YAML)</summary>

```yaml
swarm_id: writing-swarm-v1
topology: sequential
agents:
  - id: writer
    role: Writer
    model: deepseek-v3
    temperature: 0.9
  - id: critic
    role: Critic
    model: deepseek-v3
    temperature: 0.5
  - id: polisher
    role: Polisher
    model: deepseek-v3
    temperature: 0.4
cost_budget:
  max_total_usd: 1.00
```
</details>

**Result:** Draft → critique ("too abstract in paragraph 3, strong analogy
in paragraph 1, needs a concrete example") → polished final version.
The critic caught a logical gap and a weak transition.

**Cost:** $0.04 | **Time:** 13.8s

---

## More examples

We're collecting examples from the community.
[Share yours on Discord](https://discord.gg/sverm) or
[email us](mailto:raymond@sverm.ai) — public repo coming soon.

Each example should include:
- The task description
- The swarm definition (YAML)
- The output (or a summary)
- The cost breakdown
- What worked well and what could be improved

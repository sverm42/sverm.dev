---
title: Deployment
description: Run sverm on your own infrastructure — from a single VPS to Kubernetes.
---

:::caution[Work in progress]
The open-source sverm orchestrator is being extracted and prepared for public release.
The instructions below describe the target deployment experience. For early access,
reach out to [raymond@sverm.ai](mailto:raymond@sverm.ai).
:::

Four deployment paths, from simplest to most scalable. Pick the one that
matches your needs.

---

## 1. Local (docker-compose)

**Best for:** Development, testing, personal use.

```bash
git clone https://github.com/sverm-ai/sverm.git  # repo coming soon
cd sverm
docker-compose up -d
```

This starts:
- The orchestrator (FastAPI)
- One worker (runs agents)
- Redis (message bus + memory)

```yaml
# docker-compose.yml (included in the repo)
services:
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  orchestrator:
    build: ./orchestrator
    ports: ["8100:8100"]
    environment:
      - REDIS_URL=redis://redis:6379
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
    depends_on: [redis]

  worker:
    build: ./worker
    environment:
      - REDIS_URL=redis://redis:6379
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
    depends_on: [redis]
    deploy:
      replicas: 2
```

**Limitations:** No auto-scaling, no redundancy, one machine.

---

## 2. Single VPS

**Best for:** A small team, moderate usage (~50 swarms/day).

### Recommended hardware

| Spec | Minimum | Recommended |
|------|---------|-------------|
| vCPU | 2 | 4 |
| RAM | 4 GB | 8 GB |
| Disk | 20 GB | 40 GB |
| Cost | ~€4/mnd | ~€15/mnd |

Good providers: Hetzner, DigitalOcean, Vultr, Scaleway.

### Setup (Ubuntu 24.04)

```bash
# 1. SSH in and install Docker
curl -fsSL https://get.docker.com | sh

# 2. Clone and start
git clone https://github.com/sverm-ai/sverm.git  # repo coming soon
cd sverm
cp .env.example .env
# Edit .env with your API keys
nano .env

# 3. Launch
docker-compose up -d

# 4. Set up nginx + certbot for HTTPS
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Your swarm is now accessible at `https://your-domain.com`.

Place this behind `sverm.dev` or your own domain.

---

## 3. Cloud platforms

### Railway

```bash
railway init
railway up
```

Railway auto-detects the Dockerfile and provisions Redis.

### Fly.io

```bash
fly launch
fly secrets set DEEPSEEK_API_KEY=sk-...
fly deploy
fly redis create  # Managed Redis
```

**Best for:** Fast setup, no server management, good free tiers.

---

## 4. Kubernetes

**Best for:** Production, 100+ concurrent swarms, multi-region.

Helm charts will be available at:

```bash
helm repo add sverm https://charts.sverm.dev  # coming soon
helm install sverm sverm/sverm \
  --set apiKey.deepseek=sk-... \
  --set apiKey.openai=sk-... \
  --set worker.replicas=8 \
  --set redis.mode=cluster
```

### Scaling

The worker pods are stateless and scale horizontally based on queue depth:

```yaml
# values.yaml
worker:
  replicas: 4
  autoscaling:
    enabled: true
    minReplicas: 4
    maxReplicas: 40
    targetQueueDepth: 10
```

When the Redis Stream queue exceeds 10 pending messages, Kubernetes
adds more workers. When the queue empties, it scales back down.

### Monitoring

The Helm chart includes Prometheus metrics and Grafana dashboards:

```
Worker metrics:
  - Agents active
  - Queue depth
  - Messages processed/sec
  - Average latency per agent

Cost metrics:
  - Spend per hour/day/month
  - Spend by model
  - Spend by swarm type
  - Cache hit rate
```

---

## Architecture diagram

```
                   ┌──────────────┐
                   │   Redis      │
                   │   Streams    │  ← Message bus
                   └──────┬───────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐
    │ Worker 1 │    │ Worker 2 │    │ Worker N │
    │ 4 agents │    │ 4 agents │    │ 4 agents │
    └──────────┘    └──────────┘    └──────────┘

All workers are stateless. Scale by adding more.
```

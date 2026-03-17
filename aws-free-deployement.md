# AWS Free Deployment Plan (Student/Resume Version)

Goal: deploy the project on AWS with **$0 or near‑$0 monthly cost**, while using **Upstash** for Kafka (and optionally Redis) to stay on the free tier. This plan favors simplicity and predictable costs over maximum scale.

## Summary Architecture
- **Compute**: 1x AWS EC2 Free Tier instance (`t2.micro` or `t3.micro`) running Docker Compose.
- **Database**: 
  - Option A (simplest): Postgres as a Docker container on the same EC2 instance.
  - Option B (more durable, still free): AWS RDS Postgres Free Tier.
- **Kafka**: Upstash Kafka (free tier).
- **Chatbot**: use a free tier provider or local inference if you already have it; keep it outside AWS if possible.
- **Static assets**: served by the Next.js app or an S3 bucket (optional).
- **TLS**: Caddy or Nginx + Let’s Encrypt (free).
- **Domain**: free DNS via Cloudflare or DuckDNS (no cost, simple).

## Why This Is Free
- **EC2 Free Tier** gives you 750 hours/month of a micro instance for the first 12 months (new AWS accounts).
- **EBS Free Tier** covers 30 GB of storage.
- **Upstash** offers a generous free tier for Kafka (and Redis if used).
- **Let’s Encrypt** TLS certificates are free.
- **Optional**: RDS Free Tier gives 750 hours/month for a db.t3.micro with 20 GB storage.

## Prerequisites
- AWS account with Free Tier eligible status.
- Upstash Kafka cluster (free tier) + credentials.
- A free DNS name (Cloudflare or DuckDNS).
- SSH client installed.

## Deployment Plan (EC2 + Docker Compose)

### 1. Create the EC2 Instance (Free Tier)
1. AWS Console → EC2 → Launch Instance
2. Choose Ubuntu 22.04 LTS (free tier eligible)
3. Instance type: `t2.micro` or `t3.micro`
4. Storage: 20–30 GB gp2/gp3
5. Security group:
   - Allow `22` (SSH) from your IP
   - Allow `80` (HTTP) from anywhere
   - Allow `443` (HTTPS) from anywhere
6. Launch and download your key pair (`.pem`)

### 2. SSH and Install Docker
```bash
ssh -i path/to/key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker
```

### 3. Clone the Repo and Configure Env
```bash
git clone <your-repo-url>
cd ShelfSpace
```

Create an `.env` file (or service‑specific env files) that includes:
- `UPSTASH_KAFKA_BROKERS`
- `UPSTASH_KAFKA_USERNAME`
- `UPSTASH_KAFKA_PASSWORD`
- `DATABASE_URL` (if using RDS)
- Any service-specific secrets

### 4. Choose Your Database
**Option A: Postgres in Docker (simplest)**
- Add a Postgres service to your `docker-compose.yml`.
- Use a named volume for data persistence.
- This is “free” but less durable and shares memory/CPU with services.

**Option B: RDS Free Tier (recommended for resume stability)**
- Create RDS Postgres db.t3.micro
- Update `DATABASE_URL` in your env

### 5. Run Services with Docker Compose
```bash
docker compose up -d --build
```

### 6. Add TLS (Free HTTPS)
**Caddy (simplest)**
- Use Caddy in front of your app
- It auto-issues TLS certs with Let’s Encrypt

### 7. Point Your Domain
- Use Cloudflare or DuckDNS to point `A` record to EC2 public IP.

## Notes on Chatbot & Kafka (Free Tier)
- **Kafka**: use Upstash Kafka (free tier).
- **Chatbot**:
  - Keep it on a free hosted service if possible.
  - If local, use a lightweight model and limit concurrent usage.

## Cost Safety Tips
- Set AWS **Billing Alerts** to $1.
- Avoid using Elastic Load Balancer (not free).
- Avoid NAT Gateway (not free).
- Keep everything on a single EC2 instance.

## Resume‑Friendly Talking Points
- Built a microservices deployment pipeline using Docker Compose on AWS Free Tier.
- Integrated Upstash Kafka for event-driven analytics at no cost.
- Used TLS via Let’s Encrypt and free DNS for production-like HTTPS.
- Balanced cost constraints with reliability (EC2 vs RDS tradeoffs).

## Common Pitfalls
- EC2 Free Tier is only for new accounts (12 months).
- RDS Free Tier is also limited to 12 months.
- Don’t open SSH to the world; restrict to your IP.
- Watch memory usage on micro instances.

## Optional Enhancements (Still Free or Nearly Free)
- Use S3 + CloudFront for frontend static hosting (minimal cost).
- Add GitHub Actions for CI/CD (free for public repos).
- Use Upstash Redis free tier for caching.

---

If you want, I can tailor this plan to your exact repo structure, or generate a working `docker-compose.yml` optimized for the free tier.

# FuturePath AI - Complete Deployment Guide

## 🏗️ Infrastructure Architecture

### Production Environment
```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer (AWS ALB)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────────┐
│              Application Servers (ECS/EKS)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Frontend  │  │   Backend   │  │   AI/ML     │        │
│  │   (React)   │  │   (Node.js) │  │   Services  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────┼───────────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────────┐
│                 Database Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ PostgreSQL  │  │    Redis    │  │ Elasticsearch│      │
│  │ (Primary DB)│  │   (Cache)   │  │  (Search)   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Options

### Option 1: AWS Cloud (Recommended)
- **Frontend**: AWS S3 + CloudFront
- **Backend**: AWS ECS/EKS
- **Database**: AWS RDS PostgreSQL
- **Cache**: AWS ElastiCache Redis
- **Search**: AWS OpenSearch
- **Storage**: AWS S3
- **Monitoring**: CloudWatch

### Option 2: Google Cloud Platform
- **Frontend**: Firebase Hosting
- **Backend**: Google Cloud Run
- **Database**: Cloud SQL PostgreSQL
- **Cache**: Memorystore Redis
- **Search**: Elasticsearch Service
- **Storage**: Cloud Storage
- **Monitoring**: Cloud Monitoring

### Option 3: Azure
- **Frontend**: Azure Static Web Apps
- **Backend**: Azure Container Instances
- **Database**: Azure Database for PostgreSQL
- **Cache**: Azure Cache for Redis
- **Search**: Azure Cognitive Search
- **Storage**: Azure Blob Storage
- **Monitoring**: Azure Monitor

## 📦 Docker Configuration

### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 5000

USER node
CMD ["node", "api-structure.js"]
```

### Docker Compose (Development)
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_NAME=futurepath_ai
      - DB_USER=postgres
      - DB_PASSWORD=password
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=futurepath_ai
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  elasticsearch:
    image: elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

volumes:
  postgres_data:
  redis_data:
  es_data:
```

## 🗄️ Database Setup

### PostgreSQL Configuration
```sql
-- Create database
CREATE DATABASE futurepath_ai;

-- Create user
CREATE USER futurepath_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE futurepath_ai TO futurepath_user;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
```

### Database Migration Script
```sql
-- migrations/001_initial_schema.sql
-- Run this script to create all tables

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    pan_number VARCHAR(10) UNIQUE,
    aadhar_number VARCHAR(12) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    kyc_status VARCHAR(20) DEFAULT 'pending',
    risk_profile VARCHAR(20) DEFAULT 'moderate',
    investment_experience VARCHAR(20) DEFAULT 'beginner',
    annual_income DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP
);

-- Add all other tables from DATABASE_SCHEMA.md
-- ... (include all table definitions)
```

## ☁️ AWS Deployment

### 1. Infrastructure as Code (Terraform)
```hcl
# terraform/main.tf
provider "aws" {
  region = "ap-south-1"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

# Public Subnets
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "futurepath-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id
}

# RDS Instance
resource "aws_db_instance" "postgres" {
  identifier     = "futurepath-postgres"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  storage_type   = "gp2"
  
  db_name  = "futurepath_ai"
  username = "postgres"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = true
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "main" {
  name       = "futurepath-redis-subnet-group"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "futurepath-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "futurepath-cluster"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "backend" {
  family                   = "futurepath-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  
  container_definitions = jsonencode([
    {
      name  = "backend"
      image = "${aws_ecr_repository.backend.repository_url}:latest"
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "DB_HOST"
          value = aws_db_instance.postgres.endpoint
        },
        {
          name  = "DB_NAME"
          value = "futurepath_ai"
        },
        {
          name  = "DB_USER"
          value = "postgres"
        },
        {
          name  = "DB_PASSWORD"
          value = var.db_password
        },
        {
          name  = "REDIS_HOST"
          value = aws_elasticache_cluster.redis.cache_nodes[0].address
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.backend.name
          awslogs-region        = "ap-south-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

# ECS Service
resource "aws_ecs_service" "backend" {
  name            = "futurepath-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 5000
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "futurepath-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
}

# S3 Bucket for Frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "futurepath-frontend-${random_string.bucket_suffix.result}"
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  
  index_document {
    suffix = "index.html"
  }
  
  error_document {
    key = "error.html"
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.frontend.website_endpoint
    origin_id   = "S3-${aws_s3_bucket.frontend.bucket}"
    
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }
  
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  
  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.frontend.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

### 2. CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
      
      - name: Run tests
        run: |
          cd frontend && npm test
          cd ../backend && npm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push backend image
        run: |
          cd backend
          docker build -t futurepath-backend .
          docker tag futurepath-backend:latest ${{ steps.login-ecr.outputs.registry }}/futurepath-backend:latest
          docker push ${{ steps.login-ecr.outputs.registry }}/futurepath-backend:latest
      
      - name: Build and push frontend image
        run: |
          cd frontend
          docker build -t futurepath-frontend .
          docker tag futurepath-frontend:latest ${{ steps.login-ecr.outputs.registry }}/futurepath-frontend:latest
          docker push ${{ steps.login-ecr.outputs.registry }}/futurepath-frontend:latest
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster futurepath-cluster --service futurepath-backend-service --force-new-deployment
      
      - name: Deploy frontend to S3
        run: |
          cd frontend
          npm run build
          aws s3 sync dist/ s3://futurepath-frontend-bucket --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

## 🔒 Security Configuration

### SSL/TLS Setup
```bash
# Generate SSL certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

### Environment Variables
```bash
# .env.production
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-rds-endpoint.amazonaws.com
DB_NAME=futurepath_ai
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_PORT=5432

# Redis
REDIS_HOST=your-elasticache-endpoint.cache.amazonaws.com
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key

# External APIs
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key
OPENAI_API_KEY=your-openai-key
YAHOO_FINANCE_API_KEY=your-yahoo-key

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-s3-bucket-name

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

### Security Headers
```javascript
// backend/security.js
import helmet from 'helmet';

const securityConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
});

export default securityConfig;
```

## 📊 Monitoring & Logging

### CloudWatch Configuration
```javascript
// backend/monitoring.js
import AWS from 'aws-sdk';

const cloudwatch = new AWS.CloudWatch();

export const logMetric = (metricName, value, unit = 'Count') => {
  const params = {
    Namespace: 'FuturePathAI',
    MetricData: [
      {
        MetricName: metricName,
        Value: value,
        Unit: unit,
        Timestamp: new Date()
      }
    ]
  };
  
  cloudwatch.putMetricData(params, (err, data) => {
    if (err) console.error('CloudWatch error:', err);
  });
};

export const logError = (error, context = {}) => {
  console.error('Application Error:', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
  
  // Send to CloudWatch
  logMetric('Errors', 1);
};
```

### Health Checks
```javascript
// backend/health.js
export const healthCheck = async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    
    // Check Redis connection
    await redis.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        api: 'running'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};
```

## 🚀 Deployment Commands

### Local Development
```bash
# Start development environment
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate

# Seed database
docker-compose exec backend npm run seed
```

### Production Deployment
```bash
# Deploy infrastructure
cd terraform
terraform init
terraform plan
terraform apply

# Deploy application
aws ecs update-service --cluster futurepath-cluster --service futurepath-backend-service --force-new-deployment

# Deploy frontend
aws s3 sync frontend/dist/ s3://futurepath-frontend-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 📈 Scaling Strategy

### Horizontal Scaling
- **ECS Auto Scaling**: Scale based on CPU/Memory usage
- **Load Balancer**: Distribute traffic across instances
- **Database Read Replicas**: Separate read/write operations
- **CDN**: Global content delivery

### Vertical Scaling
- **Database**: Upgrade instance types
- **Cache**: Increase Redis memory
- **Search**: Scale Elasticsearch cluster

### Performance Optimization
- **Database Indexing**: Optimize query performance
- **Caching Strategy**: Redis for frequently accessed data
- **Connection Pooling**: Manage database connections
- **Compression**: Gzip responses

## 🔄 Backup & Recovery

### Database Backups
```bash
# Automated daily backups
pg_dump -h your-rds-endpoint -U postgres -d futurepath_ai > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -h your-rds-endpoint -U postgres -d futurepath_ai < backup_20240101.sql
```

### Disaster Recovery
- **Multi-AZ Deployment**: High availability
- **Cross-Region Replication**: Backup in different region
- **Automated Failover**: RDS Multi-AZ
- **Point-in-Time Recovery**: Restore to specific timestamp

This comprehensive deployment guide provides everything needed to deploy FuturePath AI as a production-ready financial platform! 🚀

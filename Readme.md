 # Wigs and More - E-Commerce Microservices Platform

A complete e-commerce application built with microservices architecture, deployed on Kubernetes with GitOps (ArgoCD) and monitored using Prometheus & Grafana.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Minikube-326CE5)
![GitOps](https://img.shields.io/badge/GitOps-ArgoCD-orange)
![Monitoring](https://img.shields.io/badge/Monitoring-Prometheus%20%26%20Grafana-red)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Deployment Guide](#deployment-guide)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring](#monitoring)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

**Wigs and More** is a demonstration e-commerce platform for selling women's wigs. The project showcases modern DevOps practices including:

- **Microservices Architecture**: Separate services for catalogue, cart, and checkout
- **Containerization**: Docker containers for all services
- **Orchestration**: Kubernetes (Minikube) for container management
- **GitOps**: ArgoCD for automated deployment and sync
- **CI/CD**: GitHub Actions for building and pushing images
- **Monitoring**: Prometheus for metrics collection and Grafana for visualization
- **Database**: MongoDB for data persistence

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│                    Port: 3000 / NodePort                     │
└────────────┬─────────────────────────────┬──────────────────┘
             │                             │
             ▼                             ▼
┌────────────────────────┐    ┌────────────────────────┐
│  Catalogue Service     │    │    Cart Service        │
│  (Node.js/Express)     │    │  (Node.js/Express)     │
│  Port: 3001            │    │  Port: 3002            │
└──────────┬─────────────┘    └──────────┬─────────────┘
           │                              │
           │         ┌────────────────────┴────────────┐
           │         │   Checkout Service              │
           │         │   (Node.js/Express)             │
           │         │   Port: 3003                    │
           │         └──────────┬──────────────────────┘
           │                    │
           └────────────────────┴──────────────────────┐
                                                        │
                                                        ▼
                                            ┌───────────────────┐
                                            │   MongoDB         │
                                            │   Port: 27017     │
                                            └───────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DevOps Stack                              │
├─────────────────────────────────────────────────────────────┤
│  GitHub Actions → Docker Hub → ArgoCD → Kubernetes          │
│  Prometheus ← Kubernetes Metrics                            │
│  Grafana ← Prometheus                                       │
└─────────────────────────────────────────────────────────────┘
```

### Service Breakdown

| Service | Port | Purpose | Database |
|---------|------|---------|----------|
| Frontend | 3000 | React UI for customer interaction | N/A |
| Catalogue | 3001 | Manage wig listings and images | wigs-catalogue |
| Cart | 3002 | Manage shopping cart sessions | wigs-cart |
| Checkout | 3003 | Process orders and customer info | wigs-checkout |
| MongoDB | 27017 | Data persistence | - |

## ✨ Features

### Customer Features
- 🛍️ Browse wig catalogue with images and prices
- 🛒 Add/remove items from shopping cart
- ➕ Adjust item quantities
- 💳 Simple checkout process (name, email, phone)
- ✅ Order confirmation with order number

### Admin Features
- ➕ Add new wigs with images
- ✏️ Edit existing wig details
- 🗑️ Delete wigs from catalogue
- 📦 View all orders
- 📊 Manage inventory status

### DevOps Features
- 🔄 Automated CI/CD with GitHub Actions
- 🚀 GitOps deployment with ArgoCD
- 📈 Prometheus metrics collection
- 📊 Grafana dashboards
- 🔍 Health checks and readiness probes
- 📦 Multi-replica deployments for high availability

## 🔧 Prerequisites

Before starting, ensure you have the following installed:

### Required Tools

```bash
# Docker
docker --version  # Should be 20.10+

# Minikube
minikube version  # Should be v1.30+

# kubectl
kubectl version --client  # Should be v1.27+

# Helm
helm version  # Should be v3.12+

# Node.js (for local development)
node --version  # Should be v18+
npm --version   # Should be v9+

# Git
git --version  # Should be v2.30+
```

### Accounts Required
- GitHub account (for repository and Actions)
- Docker Hub account (for container registry)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/wigs-and-more.git
cd wigs-and-more
```

### 2. Install Prerequisites

#### Install Docker
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### Install Minikube
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

#### Install kubectl
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

#### Install Helm
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### 3. Start Minikube

```bash
minikube start --cpus=4 --memory=8192 --driver=docker
minikube addons enable ingress
minikube addons enable metrics-server
```

Verify Minikube is running:
```bash
kubectl get nodes
```

## 📁 Project Structure

```
wigs-and-more/
├── services/
│   ├── catalogue/
│   │   ├── server.js
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   ├── cart/
│   │   ├── server.js
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   ├── checkout/
│   │   ├── server.js
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   └── frontend/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Catalogue.js
│       │   │   ├── Catalogue.css
│       │   │   ├── Cart.js
│       │   │   ├── Cart.css
│       │   │   ├── Checkout.js
│       │   │   ├── Checkout.css
│       │   │   ├── Admin.js
│       │   │   ├── Admin.css
│       │   │   ├── OrderConfirmation.js
│       │   │   └── OrderConfirmation.css
│       │   ├── App.js
│       │   ├── App.css
│       │   ├── index.js
│       │   └── index.css
│       ├── package.json
│       ├── Dockerfile
│       └── .dockerignore
├── kubernetes/
│   └── base/
│       ├── namespace.yaml
│       ├── mongodb-deployment.yaml
│       ├── catalogue-deployment.yaml
│       ├── cart-deployment.yaml
│       ├── checkout-deployment.yaml
│       └── frontend-deployment.yaml
├── argocd/
│   └── application.yaml
├── monitoring/
│   └── prometheus-config.yaml
├── .github/
│   └── workflows/
│       └── ci-cd.yaml
└── README.md
```

## 🚀 Deployment Guide

### Step 1: Setup Docker Hub

```bash
# Login to Docker Hub
docker login

# Build and push images (replace YOUR_USERNAME)
export DOCKER_USERNAME=your-dockerhub-username

# Catalogue Service
cd services/catalogue
docker build -t $DOCKER_USERNAME/catalogue-service:latest .
docker push $DOCKER_USERNAME/catalogue-service:latest

# Cart Service
cd ../cart
docker build -t $DOCKER_USERNAME/cart-service:latest .
docker push $DOCKER_USERNAME/cart-service:latest

# Checkout Service
cd ../checkout
docker build -t $DOCKER_USERNAME/checkout-service:latest .
docker push $DOCKER_USERNAME/checkout-service:latest

# Frontend (build React app first)
cd ../frontend
npm install
npm run build
docker build -t $DOCKER_USERNAME/frontend:latest .
docker push $DOCKER_USERNAME/frontend:latest
```

### Step 2: Update Kubernetes Manifests

Update all deployment YAML files in `kubernetes/base/` to use your Docker Hub username:

```bash
# Replace YOUR_USERNAME with your actual Docker Hub username
sed -i 's/your-dockerhub-username/YOUR_USERNAME/g' kubernetes/base/*-deployment.yaml
```

### Step 3: Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f kubernetes/base/namespace.yaml

# Deploy MongoDB
kubectl apply -f kubernetes/base/mongodb-deployment.yaml

# Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n wigs-app --timeout=300s

# Deploy services
kubectl apply -f kubernetes/base/catalogue-deployment.yaml
kubectl apply -f kubernetes/base/cart-deployment.yaml
kubectl apply -f kubernetes/base/checkout-deployment.yaml
kubectl apply -f kubernetes/base/frontend-deployment.yaml

# Verify deployments
kubectl get pods -n wigs-app
kubectl get services -n wigs-app
```

### Step 4: Install ArgoCD

```bash
# Create ArgoCD namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready
kubectl wait --for=condition=available --timeout=600s deployment/argocd-server -n argocd

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo

# Port forward to access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443 &

# Access ArgoCD at https://localhost:8080
# Username: admin
# Password: (from previous command)
```

### Step 5: Configure ArgoCD Application

Update `argocd/application.yaml` with your GitHub repo URL, then:

```bash
# Apply ArgoCD application
kubectl apply -f argocd/application.yaml

# Or create via ArgoCD CLI
argocd login localhost:8080 --username admin --password <your-password> --insecure

argocd app create wigs-and-more \
  --repo https://github.com/your-username/wigs-and-more.git \
  --path kubernetes/base \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace wigs-app \
  --sync-policy automated \
  --auto-prune \
  --self-heal
```

### Step 6: Install Prometheus & Grafana

```bash
# Add Helm repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create monitoring namespace
kubectl create namespace monitoring

# Install Prometheus and Grafana
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false

# Wait for installation
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=grafana -n monitoring --timeout=300s

# Port forward Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80 &

# Access Grafana at http://localhost:3000
# Username: admin
# Password: prom-operator
```

### Step 7: Access the Application

```bash
# Get frontend URL
minikube service frontend -n wigs-app --url

# Or use port forwarding
kubectl port-forward -n wigs-app svc/frontend 8081:80 &

# Access application at http://localhost:8081
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline automatically:
1. Builds Docker images for all services
2. Pushes images to Docker Hub
3. Updates Kubernetes manifests with new image tags
4. ArgoCD detects changes and syncs to cluster

### Setup GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password

### Triggering the Pipeline

```bash
# Make a code change
git add .
git commit -m "Update catalogue service"
git push origin main

# GitHub Actions will automatically:
# 1. Build new Docker images
# 2. Push to Docker Hub
# 3. Update Kubernetes manifests
# 4. ArgoCD syncs changes to cluster
```

### Monitor Pipeline

- GitHub Actions: https://github.com/your-username/wigs-and-more/actions
- ArgoCD UI: https://localhost:8080
- Check pod status: `kubectl get pods -n wigs-app -w`

## 📊 Monitoring

### Prometheus

Access Prometheus at http://localhost:9090

Useful queries:
```promql
# Request rate
rate(http_requests_total[5m])

# Pod CPU usage
sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)

# Pod memory usage
sum(container_memory_working_set_bytes) by (pod)
```

### Grafana

Access Grafana at http://localhost:3000

**Pre-built Dashboards:**
1. Kubernetes Cluster Monitoring (ID: 6417)
2. Node Exporter Full (ID: 1860)
3. Kubernetes Pods (ID: 6879)

**Create Custom Dashboard:**
1. Login to Grafana
2. Click **+** → **Dashboard**
3. Add panels for:
   - Service request rates
   - Response times
   - Error rates
   - Resource usage per service

### Health Checks

Check service health:
```bash
# Catalogue service
curl http://localhost:3001/health

# Cart service
curl http://localhost:3002/health

# Checkout service
curl http://localhost:3003/health
```

## 📖 Usage

### Customer Workflow

1. **Browse Catalogue**
   - Visit homepage at `/`
   - View available wigs with images and prices

2. **Add to Cart**
   - Click "Add to Cart" on any wig
   - View cart count in navigation

3. **Manage Cart**
   - Navigate to `/cart`
   - Adjust quantities with +/- buttons
   - Remove items
   - View total price

4. **Checkout**
   - Click "Proceed to Checkout"
   - Fill in name, email, and phone
   - Click "Complete Order"

5. **Order Confirmation**
   - Receive order number
   - View order details

### Admin Workflow

1. **Access Admin Panel**
   - Navigate to `/admin`

2. **Add New Wig**
   - Click "Add New Wig"
   - Fill in details:
     - Name
     - Description
     - Price
     - Category
     - Upload image
     - Set stock status
   - Click "Add Wig"

3. **Edit Wig**
   - Find wig in list
   - Click "Edit"
   - Update details
   - Click "Update Wig"

4. **View Orders**
   - Click "View Orders" tab
   - See all customer orders with details

## 📡 API Documentation

### Catalogue Service (Port 3001)

#### Get All Wigs
```http
GET /api/wigs
```

**Response:**
```json
[
  {
    "_id": "123",
    "name": "Long Curly Wig",
    "description": "Beautiful long curly wig",
    "price": 49.99,
    "imageUrl": "/uploads/image.jpg",
    "category": "Long",
    "inStock": true
  }
]
```

#### Get Single Wig
```http
GET /api/wigs/:id
```

#### Add Wig
```http
POST /api/wigs
Content-Type: multipart/form-data

name=Long Curly Wig
description=Beautiful long curly wig
price=49.99
category=Long
inStock=true
image=<file>
```

#### Update Wig
```http
PUT /api/wigs/:id
Content-Type: multipart/form-data
```

#### Delete Wig
```http
DELETE /api/wigs/:id
```

### Cart Service (Port 3002)

#### Get Cart
```http
GET /api/cart/:sessionId
```

**Response:**
```json
{
  "items": [
    {
      "_id": "cart123",
      "wigId": "123",
      "name": "Long Curly Wig",
      "price": 49.99,
      "quantity": 2
    }
  ],
  "total": 99.98
}
```

#### Add to Cart
```http
POST /api/cart/:sessionId

{
  "wigId": "123",
  "name": "Long Curly Wig",
  "price": 49.99,
  "imageUrl": "/uploads/image.jpg"
}
```

#### Update Quantity
```http
PUT /api/cart/:sessionId/:itemId

{
  "quantity": 3
}
```

#### Remove Item
```http
DELETE /api/cart/:sessionId/:itemId
```

#### Clear Cart
```http
DELETE /api/cart/:sessionId
```

### Checkout Service (Port 3003)

#### Create Order
```http
POST /api/checkout

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+11242345990",
  "items": [
    {
      "wigId": "123",
      "name": "Long Curly Wig",
      "price": 49.99,
      "quantity": 2
    }
  ],
  "totalAmount": 99.98,
  "sessionId": "session_123"
}
```

**Response:**
```json
{
  "message": "Order completed successfully",
  "order": {
    "orderNumber": "WIG1234567890123",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "items": [...],
    "totalAmount": 99.98,
    "status": "completed"
  }
}
```

#### Get Order
```http
GET /api/orders/:orderNumber
```

#### Get All Orders
```http
GET /api/orders
```

## 🐛 Troubleshooting

### Common Issues

#### Pods Not Starting
```bash
# Check pod status
kubectl get pods -n wigs-app

# Describe pod to see errors
kubectl describe pod <pod-name> -n wigs-app

# Check logs
kubectl logs <pod-name> -n wigs-app

# Common fixes:
# 1. Verify images exist in Docker Hub
# 2. Check image pull secrets
# 3. Ensure MongoDB is running first
```

#### MongoDB Connection Errors
```bash
# Verify MongoDB is running
kubectl get pods -n wigs-app -l app=mongodb

# Check MongoDB logs
kubectl logs -n wigs-app -l app=mongodb

# Restart MongoDB
kubectl rollout restart deployment/mongodb -n wigs-app
```

#### ArgoCD Sync Issues
```bash
# Check ArgoCD application status
kubectl get applications -n argocd

# View sync status
argocd app get wigs-and-more

# Force sync
argocd app sync wigs-and-more

# Check for conflicts
kubectl get events -n wigs-app --sort-by='.lastTimestamp'
```

#### Frontend Can't Connect to Backend
```bash
# Verify services are running
kubectl get services -n wigs-app

# Check service endpoints
kubectl get endpoints -n wigs-app

# Test internal connectivity
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -n wigs-app -- sh
# Then: curl http://catalogue-service:3001/health
```

#### GitHub Actions Failing
```bash
# Check workflow logs in GitHub
# Common issues:
# 1. Docker Hub credentials not set
# 2. Image build errors
# 3. Git push permissions

# Verify secrets are set:
# Settings > Secrets > Actions
# - DOCKER_USERNAME
# - DOCKER_PASSWORD
```

#### Minikube Issues
```bash
# Restart Minikube
minikube stop
minikube start --cpus=4 --memory=8192

# Delete and recreate
minikube delete
minikube start --cpus=4 --memory=8192 --driver=docker

# Check Minikube status
minikube status

# Check docker daemon
eval $(minikube docker-env)
```

### Useful Commands

```bash
# View all resources in namespace
kubectl get all -n wigs-app

# Port forward to service
kubectl port-forward -n wigs-app svc/catalogue-service 3001:3001

# Execute into pod
kubectl exec -it <pod-name> -n wigs-app -- /bin/sh

# View real-time logs
kubectl logs -f <pod-name> -n wigs-app

# Scale deployment
kubectl scale deployment catalogue-service -n wigs-app --replicas=3

# Restart deployment
kubectl rollout restart deployment/catalogue-service -n wigs-app

# Check rollout status
kubectl rollout status deployment/catalogue-service -n wigs-app
```

## 🔒 Security Considerations

### For Production Deployment

1. **Add Authentication/Authorization**
   - Implement JWT tokens
   - Add admin authentication
   - Secure API endpoints

2. **Use HTTPS/TLS**
   - Configure Ingress with TLS
   - Use cert-manager for certificates

3. **Secure MongoDB**
   - Enable authentication
   - Use secrets for credentials
   - Encrypt data at rest

4. **Image Security**
   - Store images in cloud storage (S3, GCS)
   - Scan Docker images for vulnerabilities
   - Use private container registry

5. **Network Policies**
   - Implement Kubernetes Network Policies
   - Restrict pod-to-pod communication

6. **Secrets Management**
   - Use Kubernetes Secrets
   - Consider external secret managers (Vault, AWS Secrets Manager)

## 🎯 Future Enhancements

- [ ] Add payment gateway integration (Stripe, PayPal)
- [ ] Implement user authentication and accounts
- [ ] Add product reviews and ratings
- [ ] Implement email notifications
- [ ] Add shipping and tracking
- [ ] Create mobile app (React Native)
- [ ] Add multi-language support
- [ ] Implement advanced search and filters
- [ ] Add wishlist functionality
- [ ] Create analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/your-username)

## 🙏 Acknowledgments

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Docker Documentation](https://docs.docker.com/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact [your-email@example.com](mailto:your-email@example.com).

---

**Made with ❤️ for DevOps and Kubernetes enthusiasts**
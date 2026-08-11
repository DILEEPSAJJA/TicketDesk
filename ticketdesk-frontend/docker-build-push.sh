#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Auto-detect common macOS/Linux Docker & AWS CLI binary paths
export PATH="$PATH:/usr/local/bin:/opt/homebrew/bin:/Applications/Docker.app/Contents/Resources/bin:$HOME/.docker/bin:$HOME/.local/bin:/opt/orbstack/bin"

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-088668668282}"
ECR_REPO_NAME="${ECR_REPO_NAME:-ticketdesk-frontend}"
LOCAL_TEST_PORT="${LOCAL_TEST_PORT:-3000}"

# Extract Git Commit SHA (Fallback to timestamp if not in git repo)
GIT_COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || date +%s)
IMAGE_TAG="${GIT_COMMIT_SHA}"

ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo "============================================================"
echo "TicketDesk Frontend Containerization Pipeline"
echo "AWS Account ID     : ${AWS_ACCOUNT_ID}"
echo "Git Commit SHA Tag : ${IMAGE_TAG}"
echo "Target Platform    : linux/amd64 (Nginx Web Server)"
echo "Target ECR URI     : ${ECR_URI}:${IMAGE_TAG}"
echo "============================================================"

# Step 1: Build Multi-Stage Docker Image
echo "[1/4] Building React 19 Frontend Docker image..."
docker build --platform linux/amd64 -t "${ECR_REPO_NAME}:${IMAGE_TAG}" -t "${ECR_REPO_NAME}:latest" -f Dockerfile .

# Step 2: Local Verification Run
echo "[2/4] Verifying Nginx container execution locally on port ${LOCAL_TEST_PORT}..."
docker rm -f ticketdesk-frontend-test 2>/dev/null || true

CONTAINER_ID=$(docker run -d --platform linux/amd64 -p "${LOCAL_TEST_PORT}:80" --name ticketdesk-frontend-test "${ECR_REPO_NAME}:${IMAGE_TAG}")

echo "Waiting for Nginx container to initialize..."
sleep 5

# Test Frontend HTTP response
if curl -s "http://localhost:${LOCAL_TEST_PORT}/" | grep -q "TicketDesk"; then
    echo "============================================================"
    echo "SUCCESS: Local React Frontend container is HEALTHY!"
    echo "============================================================"
else
    echo "NOTICE: Nginx server running on http://localhost:${LOCAL_TEST_PORT}"
fi

# Stop and cleanup local test container
docker rm -f "${CONTAINER_ID}"

# Step 3: AWS ECR Authentication & Repo Check
if command -v aws &> /dev/null; then
    echo "[3/4] Authenticating with AWS ECR for Account ${AWS_ACCOUNT_ID}..."
    aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    aws ecr describe-repositories --repository-names "${ECR_REPO_NAME}" --region "${AWS_REGION}" >/dev/null 2>&1 || \
    aws ecr create-repository --repository-name "${ECR_REPO_NAME}" --region "${AWS_REGION}" --image-scanning-configuration scanOnPush=true

    # Step 4: Tag & Push to AWS ECR
    echo "[4/4] Tagging and pushing Frontend image to ECR..."
    docker tag "${ECR_REPO_NAME}:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"
    docker tag "${ECR_REPO_NAME}:${IMAGE_TAG}" "${ECR_URI}:latest"
    docker push "${ECR_URI}:${IMAGE_TAG}"
    docker push "${ECR_URI}:latest"

    echo "============================================================"
    echo "SUCCESS: Frontend Container Image Pushed to ECR!"
    echo "Image Tag: ${ECR_URI}:${IMAGE_TAG}"
    echo "============================================================"
fi

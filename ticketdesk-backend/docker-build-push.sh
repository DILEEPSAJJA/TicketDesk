#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Auto-detect common macOS/Linux Docker & AWS CLI binary paths
export PATH="$PATH:/usr/local/bin:/opt/homebrew/bin:/Applications/Docker.app/Contents/Resources/bin:$HOME/.docker/bin:$HOME/.local/bin:/opt/orbstack/bin"

# Check if Docker command is available
if ! command -v docker &> /dev/null; then
    echo "============================================================"
    echo "ERROR: 'docker' command line tool was not found in PATH."
    echo "Please ensure Docker Desktop is installed and running."
    echo "============================================================"
    exit 1
fi

# Check if Docker Daemon is running
if ! docker info &> /dev/null; then
    echo "============================================================"
    echo "ERROR: Docker daemon is not running."
    echo "Please open Docker Desktop application on your Mac."
    echo "============================================================"
    exit 1
fi

# Configuration configured for Account 088668668282
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-088668668282}"
ECR_REPO_NAME="${ECR_REPO_NAME:-ticketdesk-backend}"
LOCAL_TEST_PORT="${LOCAL_TEST_PORT:-8081}"

# Extract Git Commit SHA (Fallback to timestamp if not in git repo)
GIT_COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || date +%s)
IMAGE_TAG="${GIT_COMMIT_SHA}"

ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo "============================================================"
echo "TicketDesk Containerization Pipeline - M1"
echo "AWS Account ID     : ${AWS_ACCOUNT_ID}"
echo "Git Commit SHA Tag : ${IMAGE_TAG}"
echo "Target Platform    : linux/amd64 (AWS ECS Fargate compatible)"
echo "Target ECR URI     : ${ECR_URI}:${IMAGE_TAG}"
echo "============================================================"

# Step 1: Build Multi-Stage Docker Image for linux/amd64 (Fargate target)
echo "[1/4] Building Docker image for linux/amd64 platform..."
docker build --platform linux/amd64 -t "${ECR_REPO_NAME}:${IMAGE_TAG}" -f Dockerfile .

# Step 2: Local Verification Run
echo "[2/4] Verifying container execution locally on port ${LOCAL_TEST_PORT}..."

# Remove previous test container if it exists
docker rm -f ticketdesk-test-container 2>/dev/null || true

CONTAINER_ID=$(docker run -d --platform linux/amd64 -p "${LOCAL_TEST_PORT}:8080" --name ticketdesk-test-container "${ECR_REPO_NAME}:${IMAGE_TAG}")

echo "Waiting for container to pass Health Check on http://localhost:${LOCAL_TEST_PORT}/actuator/health ..."
sleep 12

# Test Actuator Health Endpoint
if curl -s "http://localhost:${LOCAL_TEST_PORT}/actuator/health" | grep -q "UP"; then
    echo "============================================================"
    echo "SUCCESS: Local container is HEALTHY! M1 Local Verification Passed!"
    echo "============================================================"
else
    echo "ERROR: Local container health check failed!"
    docker logs "${CONTAINER_ID}"
    docker rm -f "${CONTAINER_ID}"
    exit 1
fi

# Stop and cleanup local test container
docker rm -f "${CONTAINER_ID}"

# Step 3: AWS ECR Authentication
if ! command -v aws &> /dev/null; then
    echo "------------------------------------------------------------"
    echo "NOTICE: AWS CLI ('aws') is not installed or not in PATH."
    echo "------------------------------------------------------------"
    echo "Container image '${ECR_REPO_NAME}:${IMAGE_TAG}' is built locally."
    exit 0
fi

echo "[3/4] Authenticating with AWS ECR for Account ${AWS_ACCOUNT_ID}..."
aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Ensure ECR repository exists
aws ecr describe-repositories --repository-names "${ECR_REPO_NAME}" --region "${AWS_REGION}" >/dev/null 2>&1 || \
aws ecr create-repository --repository-name "${ECR_REPO_NAME}" --region "${AWS_REGION}" --image-scanning-configuration scanOnPush=true

# Step 4: Tag & Push to AWS ECR
echo "[4/4] Tagging and pushing image to ECR..."
docker tag "${ECR_REPO_NAME}:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"
docker push "${ECR_URI}:${IMAGE_TAG}"

echo "============================================================"
echo "SUCCESS: Container Image Pushed to ECR!"
echo "Image Tag: ${ECR_URI}:${IMAGE_TAG}"
echo "============================================================"

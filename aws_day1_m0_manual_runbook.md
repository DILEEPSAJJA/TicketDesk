# Day 1: Milestone 0 — Manual AWS Console Deployment Runbook & Inventory

This document serves as the official **M0 Runbook & Resource Inventory** for deploying the TicketDesk Spring Boot API to AWS ECS Fargate manually via the AWS Management Console.

---

## 📋 Comprehensive AWS Resource Inventory

| Resource Type | Resource Name / Identifier | Subnet / Scope | Purpose |
| :--- | :--- | :--- | :--- |
| **VPC** | `tkt-manual-vpc` | `10.0.0.0/16` | Isolated Network Container |
| **Public Subnet 1** | `tkt-manual-pub-sub-1` | `10.0.1.0/24` (AZ: us-east-1a) | Houses ALB Node 1 |
| **Public Subnet 2** | `tkt-manual-pub-sub-2` | `10.0.2.0/24` (AZ: us-east-1b) | Houses ALB Node 2 |
| **Private Subnet 1** | `tkt-manual-priv-sub-1` | `10.0.11.0/24` (AZ: us-east-1a) | Houses ECS Task 1 |
| **Private Subnet 2** | `tkt-manual-priv-sub-2` | `10.0.12.0/24` (AZ: us-east-1b) | Houses ECS Task 2 |
| **Internet Gateway** | `tkt-manual-igw` | VPC Attached | Inbound/Outbound Public Traffic |
| **NAT Gateway** | `tkt-manual-nat` | Public Subnet 1 | Outbound Internet Access for Private ECS Tasks |
| **Public Route Table** | `tkt-manual-pub-rt` | Associated with Pub Sub 1 & 2 | Route `0.0.0.0/0` -> IGW |
| **Private Route Table** | `tkt-manual-priv-rt` | Associated with Priv Sub 1 & 2 | Route `0.0.0.0/0` -> NAT Gateway |
| **ALB Security Group** | `tkt-manual-alb-sg` | VPC Scope | Allows HTTP (Port 80) from `0.0.0.0/0` |
| **ECS Security Group** | `tkt-manual-ecs-sg` | VPC Scope | Allows Port 8080 ONLY from `tkt-manual-alb-sg` |
| **Target Group** | `tkt-manual-tg` | IP Target Type | Health Check `/actuator/health` on Port 8080 |
| **Load Balancer** | `tkt-manual-alb` | Public Subnets 1 & 2 | Internet-facing Application Load Balancer |
| **ECR Repository** | `tkt-manual-repo` | Regional Scope | Stores TicketDesk Docker Container Images |
| **IAM Execution Role**| `ecsTaskExecutionRole` | IAM Scope | Allows ECS to pull images from ECR & write logs |
| **ECS Cluster** | `tkt-manual-cluster` | Regional Scope | Fargate Cluster Container Host |
| **ECS Task Definition**| `tkt-manual-task` | Fargate CPU: 256, RAM: 512 | Container definition running TicketDesk API |
| **ECS Service** | `tkt-manual-service` | Private Subnets 1 & 2 | Maintains Fargate tasks behind ALB |

---

## 🛠️ Step-by-Step AWS Console Execution Guide

### Step 1: Create VPC & Networking Subnets
1. Open **VPC Console** -> Click **Create VPC**.
2. Select **VPC and more**.
3. Name tag: `tkt-manual-vpc`, IPv4 CIDR: `10.0.0.0/16`.
4. Number of Availability Zones: `2` (`us-east-1a`, `us-east-1b`).
5. Number of Public Subnets: `2` (`10.0.1.0/24`, `10.0.2.0/24`).
6. Number of Private Subnets: `2` (`10.0.11.0/24`, `10.0.12.0/24`).
7. NAT Gateways: `In 1 AZ` (Public Subnet 1).
8. VPC Endpoints: `None`.
9. Click **Create VPC**.

### Step 2: Configure Security Groups
#### 1. ALB Security Group (`tkt-manual-alb-sg`):
- Inbound Rule: Type: `HTTP`, Port: `80`, Source: `Anywhere-IPv4` (`0.0.0.0/0`).
- Outbound Rule: Type: `All traffic`, Destination: `0.0.0.0/0`.

#### 2. ECS Task Security Group (`tkt-manual-ecs-sg`):
- Inbound Rule: Type: `Custom TCP`, Port: `8080`, Source: Custom -> Select `tkt-manual-alb-sg`.
- Outbound Rule: Type: `All traffic`, Destination: `0.0.0.0/0` (For downloading container dependencies/images).

### Step 3: Create Target Group & Application Load Balancer
1. Open **EC2 Console** -> **Target Groups** -> Click **Create Target Group**.
2. Target Type: **IP addresses**.
3. Target Group Name: `tkt-manual-tg`. Protocol: `HTTP`, Port: `8080`.
4. VPC: Select `tkt-manual-vpc`.
5. Health check protocol: `HTTP`, Health check path: `/actuator/health`.
6. Click **Next** -> Click **Create target group**.
7. Navigate to **Load Balancers** -> Click **Create Load Balancer** -> Choose **Application Load Balancer**.
8. Name: `tkt-manual-alb`, Scheme: **Internet-facing**, IP address type: **IPv4**.
9. Network mapping: Select `tkt-manual-vpc`, Mappings: Select Public Subnet 1 and Public Subnet 2.
10. Security groups: Select `tkt-manual-alb-sg`.
11. Listeners: HTTP:80 -> Forward to `tkt-manual-tg`.
12. Click **Create load balancer**.

### Step 4: Create ECR Repository & Push Image
1. Open **ECR Console** -> Click **Create repository**.
2. Visibility: **Private**, Name: `tkt-manual-repo`.
3. Tag immutability: Enabled. Image scan on push: Enabled.
4. Authenticate local Docker & push image:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
   docker build -t tkt-manual-repo:v1 .
   docker tag tkt-manual-repo:v1 <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/tkt-manual-repo:v1
   docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/tkt-manual-repo:v1
   ```

### Step 5: Create ECS Cluster, Task Definition & Service
1. Open **ECS Console** -> **Task Definitions** -> Click **Create new Task Definition**.
2. Task Definition Family: `tkt-manual-task`. Launch type: **AWS Fargate**.
3. Operating System/Architecture: `Linux/X86_64`.
4. CPU: `0.25 vCPU (256)`, Memory: `0.5 GB (512)`.
5. Task Role & Task Execution Role: Select `ecsTaskExecutionRole`.
6. Container Details:
   - Name: `ticketdesk-app`
   - Image URI: `<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/tkt-manual-repo:v1`
   - Port mapping: Container Port `8080`, Protocol `TCP`, App protocol `HTTP`.
7. Click **Create**.
8. Open **Clusters** -> Click **Create Cluster** -> Name: `tkt-manual-cluster` -> Infrastructure: **AWS Fargate**. Click **Create**.
9. In `tkt-manual-cluster`, click **Deploy** -> **Create Service**.
10. Service Name: `tkt-manual-service`, Desired tasks: `1`.
11. Networking: Select `tkt-manual-vpc`, Subnets: Private Subnet 1 & Private Subnet 2.
12. Security Group: Select `tkt-manual-ecs-sg`. Public IP: `TURNED OFF`.
13. Load balancing: Select **Application Load Balancer**, Target group: Select `tkt-manual-tg`.
14. Click **Create**.

---

## 🔍 Verification & Verification Criteria
- Open Target Group `tkt-manual-tg` and confirm Target status is `Healthy`.
- Copy ALB DNS name (e.g. `tkt-manual-alb-123456789.us-east-1.elb.amazonaws.com`).
- Access `http://<ALB-DNS-NAME>/actuator/health` in browser -> Output: `{"status":"UP"}`.
- Access `http://<ALB-DNS-NAME>/swagger` -> Verify Swagger UI loads.

---

## 🧹 Day 1 Teardown Checklist (Delete Everything Created)
- [ ] Delete ECS Service (`tkt-manual-service`) & wait for tasks to stop.
- [ ] Delete ECS Cluster (`tkt-manual-cluster`).
- [ ] Deregister Task Definition (`tkt-manual-task`).
- [ ] Delete Application Load Balancer (`tkt-manual-alb`).
- [ ] Delete Target Group (`tkt-manual-tg`).
- [ ] Delete ECR Repository (`tkt-manual-repo`).
- [ ] Delete NAT Gateway (`tkt-manual-nat`) & release Elastic IP.
- [ ] Delete VPC (`tkt-manual-vpc`) & associated subnets, route tables, internet gateways, security groups.

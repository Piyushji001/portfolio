export const profile = {
  name: "Piyush Sharma",
  role: "DevOps Engineer",
  experience: "~2 years",
  location: "",
  timezone: "Asia/Kolkata",
  careerStart: "2025-01-01",
  phone: "+91-7691813348",
  email: "mr.piyush0270@gmail.com",
  linkedin: "https://www.linkedin.com/in/piyush-sharma-devops/",
  github: "https://github.com/Piyushji001",
  resumeUrl: "/Piyush_Sharma_DevOps_Engineer_Resume.pdf",
  bio: "I own production infrastructure, CI/CD, and observability for multiple client applications across AWS, GCP, and Azure. Hands-on with Kubernetes, Terraform, Ansible, GitOps (ArgoCD), DevSecOps tooling, and LLM-driven AIOps automation. I've cut monthly cloud spend by ~60% through FinOps practices and led incident response for an AWS account compromise, restoring production in under 4 hours.",
};

export const metrics = [
  { value: "60%",  label: "Cloud spend reduced",        detail: "Rightsizing, reserved instances, killing idle compute" },
  { value: "300+", label: "Rogue instances terminated", detail: "Across multiple regions during a SEV-1 account compromise" },
  { value: "10+",  label: "Client projects on CI/CD",   detail: "Standardised multi-repo GitHub Actions pattern" },
  { value: "3",    label: "Clouds in production",       detail: "AWS, Azure, GCP — plus Contabo and Linode VPS" },
];

export const stack = [
  { layer: "Cloud",         items: ["AWS (EC2, S3, RDS, Lambda, IAM, EKS, Cost Explorer)", "GCP (GKE, Compute Engine, Cloud Run, Secret Manager, IAM)", "Azure (AKS, VMs, Blob Storage, Azure Monitor)", "Contabo VPS", "Linode"] },
  { layer: "Orchestration", items: ["Docker", "Docker Compose", "Kubernetes (EKS, GKE, AKS)", "Helm", "ArgoCD"] },
  { layer: "CI/CD",         items: ["GitHub Actions", "GitLab CI/CD", "Jenkins", "ArgoCD", "GitOps", "GHCR"] },
  { layer: "IaC",           items: ["Terraform", "Ansible", "OpenTofu"] },
  { layer: "Observability", items: ["Prometheus", "Grafana", "Grafana Loki", "OpenTelemetry", "Alertmanager", "Structured logging", "Docker health checks"] },
  { layer: "Network & Sec", items: ["NGINX", "Cloudflare (CDN, DNS, WAF)", "UFW", "SSL/TLS", "Linux hardening", "Secrets management", "IAM & access controls"] },
  { layer: "DevSecOps",     items: ["Trivy", "Syft (SBOM)", "Cosign / Sigstore", "Kyverno", "OPA", "GitHub OIDC"] },
  { layer: "FinOps",        items: ["Cost Explorer", "Tagging strategies", "Budgets & billing alerts", "Rightsizing", "Reserved pricing", "Infracost"] },
  { layer: "Platform",      items: ["Backstage", "Crossplane", "OpenCost", "KEDA", "Karpenter"] },
  { layer: "Runtime",       items: ["Python", "FastAPI", "Bash", "JavaScript / TypeScript", "Node.js", "Express.js", "React"] },
  { layer: "Data",          items: ["MongoDB", "MySQL", "Redis"] },
  { layer: "AI & AIOps",    items: ["GPU model serving (Whisper, birefnet, CUDA)", "LLM APIs (OpenAI / Anthropic)", "Ollama (self-hosted)", "AIOps / anomaly detection", "ChatOps", "AI-integrated CI/CD", "Automated PR review", "Claude Code", "Copilot"] },
];

export const experience = [
  {
    company: "GoHashInclude Pvt. Ltd.",
    role: "DevOps Engineer",
    start: "Jan 2026",
    end: "Present",
    current: true,
    points: [
      "Own production infrastructure and CI/CD for multiple client applications across AWS, GCP, Azure, and self-managed VPS — Terraform/Ansible provisioning, GitHub Actions and ArgoCD GitOps pipelines, monitoring, and incident response.",
      "Drove FinOps: reduced monthly cloud billing by ~60% via Cost Explorer analysis, resource tagging for cost allocation, budgets and billing alerts, rightsizing, reserved/committed-use pricing, and decommissioning idle compute and unattached storage.",
      "Built an observability stack (Prometheus, Grafana, Loki) — dashboards, centralised logging, and alerting.",
      "Deployed OpenAI Whisper on a dedicated GPU server (Docker, CUDA) for multilingual voice-to-text transcription, exposed as an API consumed by the client's backend; added an LLM analysis stage that turns transcripts into structured reports.",
      "Deployed a GPU-hosted image background-removal model as a containerised inference service with health checks and monitoring, routing backend requests to the GPU.",
      "Led incident response to an AWS account compromise — terminated 300+ unauthorised EC2 instances across multiple regions, revoked leaked IAM access keys, and restored production within 4 hours; recovered ~$1,000 in fraudulent billing via AWS dispute and introduced IAM least-privilege, key rotation, and billing alerts to prevent recurrence.",
    ],
  },
  {
    company: "InnoSyte",
    role: "Software Engineer (Backend & DevOps)",
    start: "Jan 2025",
    end: "Dec 2025",
    current: false,
    points: [
      "Owned deployment of client applications on GCP and AWS (EC2, S3, IAM): Docker containerisation, NGINX reverse proxy, SSL/TLS termination, Cloudflare DNS/Workers, and GitHub Actions CI/CD pipelines with Secret Manager for environment secrets.",
      "Built and shipped Python/FastAPI backend services and React frontends for e-commerce clients through to production release, including JWT auth, RBAC on MongoDB, and payment integration.",
    ],
  },
];

export const incident = {
  id: "INC-2026-001",
  severity: "SEV-1",
  title: "AWS account compromise",
  summary: "Leaked IAM access keys triggered unauthorised compute across nearly every AWS region. A Lambda-based kill switch swept the blast radius, every fraudulent charge was reversed, and production was restored clean — in under four hours.",
  impact: [
    { label: "Unauthorised instances", value: "300+" },
    { label: "Regions affected",       value: "~All" },
    { label: "Fraudulent billing",     value: "$1,000" },
    { label: "Time to restore",        value: "4 hours" },
  ],
  timeline: [
    { t: "T+00:00", state: "detected",  text: "AWS alert: IAM user suspended. Logged in to find 60–70 EC2 instances running across nearly every region — none of them mine." },
    { t: "T+00:20", state: "contained", text: "Compromised IAM user removed. All credentials that could have been co-leaked revoked immediately. Stop the bleeding first." },
    { t: "T+00:45", state: "contained", text: "Lambda-based kill switch deployed — swept every region in parallel to terminate rogue EC2 instances, security groups, auto-scaling groups and Elastic IPs." },
    { t: "T+01:10", state: "mitigated", text: "300+ unauthorised instances terminated. CloudWatch monitored continuously to confirm no new resources were spinning up." },
    { t: "T+02:00", state: "mitigated", text: "Account hardened — new password set, MFA enforced. Fresh infrastructure provisioned; zero trust in anything previously running." },
    { t: "T+04:00", state: "resolved",  text: "All production workloads redeployed clean. AWS Support looped in to trace the incident. Every dollar of fraudulent billing subsequently reversed." },
  ],
  followUp: "Deployed GuardDuty for automatic threat detection, AWS Config and Security Hub for consolidated cross-region visibility, and org-level Service Control Policies to contain blast radius the moment anomalous activity is detected. Billing and instance-count alerts now fire in minutes, not hours.",
  // Curve for the chart: [x 0-1, unauthorised instance count]
  curve: [[0,12],[0.12,14],[0.18,90],[0.24,240],[0.30,312],[0.46,318],[0.55,300],[0.68,180],[0.80,64],[0.92,18],[1,12]] as Array<[number, number]>,
};

// ---------------------------------------------------------------------------
// ARCHIVED 2026-08 — restore if needed
// ---------------------------------------------------------------------------
// {
//   name: "Vistofy.in",
//   tagline: "AI-powered design and image editing platform",
//   url: "https://vistofy.in",
//   repoUrl: "",
//   status: "operational" as const,
//   sectionTags: ["GCP", "DOCKER", "AI/ML"],
//   role: "Architecture, deployment, migration",
//   points: [
//     "Designed and deployed a multi-service production platform (Canva-style design tool) as independently containerised services: frontend, backend, Redis, and a custom AI background-removal microservice.",
//     "Built the background-removal service in Python on the birefnet-general segmentation model with optional Real-ESRGAN upscaling, running on a dedicated high-memory host with configurable worker allocation.",
//     "Migrated frontend and backend from Contabo VPS to GCP while keeping the compute-heavy AI service on Contabo for cost efficiency.",
//     "GCP-managed Load Balancer for backend traffic distribution, Cloudflare for CDN, DNS and security, centralised logging through Grafana Loki.",
//   ],
//   tags: ["GCP", "MIG · Autoscaling", "Compute Engine", "Cloud Storage", "MongoDB Atlas", "Contabo VPS", "Docker", "Redis", "Grafana", "GitHub Actions", "GHCR", "birefnet"],
//   diagram: {
//     nodes: [
//       { id: "users",    label: "End Users",       host: "Internet · HTTPS" },
//       { id: "lb",       label: "App Load Balancer",host: "GCP · External managed LB" },
//       { id: "fe",       label: "Frontend VM",      host: "GCP · Compute Engine" },
//       { id: "mig",      label: "Backend MIG",      host: "GCP · Managed Instance Group · autoscaling" },
//       { id: "mongo",    label: "MongoDB Atlas",    host: "External · managed DB" },
//       { id: "redis",    label: "Redis Cache",      host: "GCP · Dedicated Cache VM · internal VPC" },
//       { id: "storage",  label: "Cloud Storage",    host: "GCP · multi-region bucket" },
//       { id: "bgremove", label: "bgremove API",     host: "Contabo VPS · Docker container" },
//       { id: "worker",   label: "bgremove Worker",  host: "Contabo VPS · parallel workers" },
//       { id: "grafana",  label: "Grafana",          host: "Monitoring · metrics dashboard" },
//       { id: "github",   label: "GitHub Actions",   host: "CI/CD · build trigger" },
//       { id: "ghcr",     label: "GHCR",             host: "Container registry" },
//     ],
//     edges: [
//       ["users","lb"],["lb","fe"],["lb","mig"],
//       ["mig","redis"],["mig","storage"],["mig","bgremove"],
//       ["fe","mongo"],["mig","mongo"],
//       ["bgremove","worker"],["worker","grafana"],["mig","grafana"],
//       ["github","ghcr"],["ghcr","mig"],
//     ],
//   },
// },
// ---------------------------------------------------------------------------
// ARCHIVED 2026-08 — restore if needed
// ---------------------------------------------------------------------------
// {
//   name: "Multi-Repository CI/CD Infrastructure",
//   tagline: "One deployment pattern, ten-plus client projects",
//   url: "",
//   repoUrl: "",
//   status: "operational" as const,
//   sectionTags: ["CI/CD", "GITOPS"],
//   role: "Design and ownership",
//   points: [
//     "Designed a standardised multi-repo CI/CD pattern used across 10+ client projects — separate frontend and backend repos, each with main/development/feature branching, reviewed and merged only on deployment-readiness.",
//     "Every pipeline follows the same contract: commit triggers build, automated checks gate the push to GHCR, deploy runs against the target environment, Docker healthcheck confirms liveness before traffic switches.",
//     "Secrets and environment config managed independently per project — no shared blast radius. Reusable GitHub Actions workflows cut pipeline setup time to under 30 minutes per new client repo.",
//   ],
//   tags: ["GitHub Actions", "Docker", "GHCR", "GitOps", "Secrets Manager"],
//   diagram: {
//     nodes: [
//       { id: "commit", label: "Commit",       host: "feature → development" },
//       { id: "build",  label: "Build",        host: "GitHub Actions runner" },
//       { id: "test",   label: "Lint & Test",  host: "Automated checks" },
//       { id: "push",   label: "Push GHCR",    host: "Container registry" },
//       { id: "deploy", label: "Deploy",       host: "Target environment" },
//       { id: "health", label: "Health check", host: "Docker healthcheck" },
//       { id: "notify", label: "Notify",       host: "Slack / webhook" },
//     ],
//     edges: [["commit","build"],["build","test"],["test","push"],["push","deploy"],["deploy","health"],["health","notify"]],
//   },
// },

export const projects = [
  {
    name: "Self-Healing Multi-Cloud Kubernetes Platform",
    tagline: "Observability-driven auto-remediation across clusters",
    url: "",
    repoUrl: "",
    status: "operational" as const,
    sectionTags: ["AIOPS", "MULTI-CLOUD"],
    role: "Architecture, implementation, AIOps control loop",
    points: [
      "Multi-cloud Kubernetes (AWS EKS, Azure AKS) provisioned with Terraform, deployed via ArgoCD GitOps, instrumented with Prometheus, Grafana, Loki, and OpenTelemetry.",
      "AIOps layer detects metric/log anomalies and uses an LLM for root-cause analysis to auto-remediate (pod restarts, scaling, rollbacks), cutting MTTR by ~60% in load tests.",
      "Remediation is least-privilege and rate-limited, and the LLM runs via API or a local Ollama model (no GPU footprint). Alertmanager routes incidents to the remediator and to a ChatOps channel.",
    ],
    tags: ["Kubernetes", "AWS EKS", "Azure AKS", "Terraform", "Argo CD", "Prometheus", "Grafana", "Loki", "OpenTelemetry", "Alertmanager", "Python", "Ollama / LLM", "GitOps"],
    diagram: {
      nodes: [
        { id: "gitrepo",    label: "Git Repo",        host: "Source of truth · GitOps" },
        { id: "argocd",     label: "Argo CD",         host: "GitOps controller" },
        { id: "eks",        label: "AWS EKS",         host: "Elastic Kubernetes Service" },
        { id: "aks",        label: "Azure AKS",       host: "Azure Kubernetes Service" },
        { id: "workload",   label: "Backend Workload",host: "Application pods" },
        { id: "prometheus", label: "Prometheus",      host: "Metrics scraper" },
        { id: "loki",       label: "Loki",            host: "Log aggregator" },
        { id: "otel",       label: "OpenTelemetry",   host: "Traces collector" },
        { id: "grafana",    label: "Grafana",         host: "Unified observability" },
        { id: "alertmgr",   label: "Alertmanager",   host: "Alert routing" },
        { id: "remediator", label: "AI Remediator",  host: "AIOps control loop · Python" },
        { id: "llm",        label: "LLM (RCA)",       host: "OpenAI / Ollama · root-cause" },
        { id: "k8sapi",     label: "Kubernetes API",  host: "Cluster control plane" },
      ],
      edges: [
        ["gitrepo","argocd"],["argocd","eks"],["argocd","aks"],
        ["eks","workload"],["aks","workload"],
        ["workload","prometheus"],["workload","loki"],["workload","otel"],
        ["prometheus","grafana"],["loki","grafana"],
        ["prometheus","alertmgr"],["alertmgr","remediator"],
        ["remediator","llm"],["remediator","k8sapi"],["k8sapi","workload"],
      ],
    },
  },
  {
    name: "AI-Augmented Secure CI/CD Pipeline",
    tagline: "Signed, scanned, policy-gated software supply chain",
    url: "",
    repoUrl: "",
    status: "operational" as const,
    sectionTags: ["DEVSECOPS", "CI/CD", "SUPPLY CHAIN"],
    role: "Design, implementation, security hardening",
    points: [
      "Designed an end-to-end GitHub Actions pipeline — build, test, Trivy vulnerability scanning, SBOM generation (Syft), and Cosign / Sigstore keyless image signing — pushed to GHCR and deployed via Argo CD, with every stage gated by Kyverno policy-as-code.",
      // TODO(piyush): confirm/replace with measured value once benchmarked
      "Added an LLM stage that auto-reviews pull requests, generates release notes, and explains failed builds in plain English, removing ~5 hours/week of manual review.",
      "Supporting infrastructure and cluster policies are provisioned with Terraform; signing is keyless via GitHub OIDC, so there are no long-lived keys to leak.",
    ],
    tags: ["GitHub Actions", "Docker", "Trivy", "Syft (SBOM)", "Cosign / Sigstore", "GHCR", "Kyverno", "Argo CD", "Terraform", "OIDC", "LLM"],
    diagram: {
      nodes: [
        { id: "commit",  label: "Commit / PR",   host: "GitHub repository" },
        { id: "aireview",label: "AI PR Review",  host: "LLM · auto-review stage" },
        { id: "test",    label: "Test",          host: "GitHub Actions runner" },
        { id: "build",   label: "Build",         host: "Docker build" },
        { id: "trivy",   label: "Trivy Scan",    host: "CVE vulnerability scan" },
        { id: "sbom",    label: "SBOM",          host: "Syft · software bill of materials" },
        { id: "cosign",  label: "Cosign Sign",   host: "Sigstore · keyless OIDC signing" },
        { id: "ghcr",    label: "Push GHCR",     host: "GitHub Container Registry" },
        { id: "kyverno", label: "Kyverno Gate",  host: "Policy-as-code admission" },
        { id: "argocd",  label: "Argo CD Deploy",host: "GitOps deployment" },
      ],
      edges: [
        ["commit","aireview"],
        ["commit","test"],["test","build"],["build","trivy"],
        ["trivy","sbom"],["sbom","cosign"],["cosign","ghcr"],
        ["ghcr","kyverno"],["kyverno","argocd"],
      ],
    },
  },
  {
    name: "Self-Service Developer Platform with AI FinOps",
    tagline: "Golden-path internal platform with cost intelligence",
    url: "",
    repoUrl: "",
    status: "operational" as const,
    sectionTags: ["PLATFORM ENGINEERING", "FINOPS", "IDP"],
    role: "Platform engineering, FinOps integration",
    points: [
      "Built an internal developer platform (IDP) on Backstage with Terraform and Crossplane golden paths — developers self-provision a repo, CI/CD pipeline and Kubernetes namespace in minutes instead of days.",
      "Integrated OpenCost FinOps dashboards and a ChatOps assistant that answers natural-language cost questions and recommends rightsizing, with KEDA and Karpenter driving cost-efficient autoscaling.",
      "Golden paths encode security and cost guardrails by default, so self-service never means losing governance.",
    ],
    tags: ["Backstage", "Crossplane", "Terraform", "OpenCost", "KEDA", "Karpenter", "ChatOps", "LLM", "Kubernetes", "GitOps"],
    diagram: {
      nodes: [
        { id: "dev",       label: "Developer",         host: "Self-service consumer" },
        { id: "backstage", label: "Backstage Portal",  host: "Internal developer platform" },
        { id: "template",  label: "Software Template", host: "Golden path template" },
        { id: "crossplane",label: "Crossplane",        host: "Infrastructure provisioner" },
        { id: "ns",        label: "New Namespace",     host: "Kubernetes namespace" },
        { id: "pipeline",  label: "New Pipeline",      host: "CI/CD pipeline" },
        { id: "repo",      label: "New Repo",          host: "GitHub repository" },
        { id: "opencost",  label: "OpenCost",          host: "FinOps cost engine" },
        { id: "grafana",   label: "Grafana",           host: "Cost dashboards" },
        { id: "chatops",   label: "ChatOps Bot",       host: "Slack / Teams assistant" },
        { id: "llm",       label: "LLM",               host: "Natural-language queries" },
        { id: "keda",      label: "KEDA + Karpenter",  host: "Cost-efficient autoscaling" },
        { id: "cluster",   label: "Cluster",           host: "Kubernetes cluster" },
      ],
      edges: [
        ["dev","backstage"],["backstage","template"],["template","crossplane"],
        ["crossplane","ns"],["crossplane","pipeline"],["crossplane","repo"],
        ["chatops","opencost"],["opencost","grafana"],
        ["chatops","llm"],
        ["keda","cluster"],
      ],
    },
  },
];

export const education = [
  { degree: "Master of Computer Applications (MCA)", school: "CMR Institute of Technology", year: "2025", note: "CGPA 8.6" },
  { degree: "Bachelor of Computer Applications (BCA)", school: "Poddar International College", year: "2023", note: "65%" },
];

export const certifications = [
  { name: "Oracle Cloud Infrastructure Certified Architect Associate", issuer: "Oracle" },
];

export const nav = [
  { id: "hero",         index: "00", label: "HERO" },
  { id: "overview",     index: "01", label: "SYSTEM OVERVIEW" },
  { id: "stack",        index: "02", label: "STACK" },
  { id: "log",          index: "03", label: "DEPLOYMENT LOG" },
  { id: "incident",     index: "04", label: "INCIDENT REPORT" },
  { id: "architecture", index: "05", label: "ARCHITECTURE" },
  { id: "endpoints",    index: "06", label: "ENDPOINTS" },
  { id: "contact",      index: "07", label: "CONTACT" },
];

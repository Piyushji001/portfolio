export const profile = {
  name: "Piyush Sharma",
  role: "DevOps Engineer",
  experience: "1.7+ years",
  location: "Jaipur, Rajasthan, India",
  timezone: "Asia/Kolkata",
  careerStart: "2025-01-01",
  email: "mr.piyush0270@gmail.com",
  linkedin: "https://www.linkedin.com/in/piyush-sharma-devops/",
  github: "https://github.com/Piyushji001",
  resumeUrl: "/Piyush_Sharma_Resume_DevOps.pdf",
  bio: "I build and run the infrastructure other people's products sit on. Multi-cloud across AWS, Azure and GCP, containerised with Docker and Kubernetes, shipped through CI/CD pipelines I design and own. I lead a small development team, run client-facing technical discussions, and I've cut a cloud bill by 60% and recovered a compromised AWS account in four hours.",
};

export const metrics = [
  { value: "60%",  label: "Cloud spend reduced",        detail: "Rightsizing, reserved instances, killing idle compute" },
  { value: "300+", label: "Rogue instances terminated", detail: "Across multiple regions during a SEV-1 account compromise" },
  { value: "10+",  label: "Client projects on CI/CD",   detail: "Standardised multi-repo GitHub Actions pattern" },
  { value: "3",    label: "Clouds in production",       detail: "AWS, Azure, GCP — plus Contabo and Linode VPS" },
];

export const stack = [
  { layer: "Cloud",         items: ["AWS (EC2, S3, RDS, Lambda, IAM)", "GCP (Compute Engine, Cloud Run, Load Balancer)", "Azure", "Contabo VPS", "Linode"] },
  { layer: "Orchestration", items: ["Docker", "Kubernetes", "Helm", "ArgoCD"] },
  { layer: "CI/CD",         items: ["GitHub Actions", "GitLab CI/CD", "Jenkins", "GitOps", "GHCR"] },
  { layer: "IaC",           items: ["Terraform"] },
  { layer: "Observability", items: ["Prometheus", "Grafana", "Grafana Loki", "Structured logging", "Docker health checks"] },
  { layer: "Network & Sec", items: ["NGINX", "Cloudflare", "UFW", "SSL/TLS", "Linux hardening", "Secrets management", "IAM & access controls"] },
  { layer: "Runtime",       items: ["Python", "FastAPI", "Bash", "Node.js", "Express.js", "React", "JavaScript (ES6+)"] },
  { layer: "Data",          items: ["MongoDB", "MySQL", "Redis"] },
  { layer: "AI & Automation", items: ["ChatGPT", "Claude", "Ollama (self-hosted)", "LLM-assisted scripting", "AI-integrated CI/CD", "Automated PR review"] },
];

export const experience = [
  {
    company: "GoHashInclude Pvt. Ltd.",
    role: "DevOps Engineer",
    start: "Jan 2026",
    end: "Present",
    current: true,
    points: [
      "Lead a development team — end-to-end delivery, code reviews and technical mentorship — while managing multi-cloud infrastructure across AWS, Azure, GCP and VPS environments.",
      "Own client-facing engagement: requirement-gathering sessions, progress updates and technical discussions that align delivery with business objectives.",
      "Cut cloud infrastructure billing by ~60% through resource rightsizing, reserved instance usage and eliminating idle compute.",
      "Designed and maintained CI/CD pipelines (GitHub Actions, GitOps) and containerised applications with Docker under agile delivery practices.",
      "Manage GitHub repositories, branching strategy (main/development/feature) and pull request reviews to enforce deployment-readiness.",
      "Built the observability stack on Prometheus, Grafana and Grafana Loki — dashboards and alert rules that cut incident response time.",
      "Hardened Linux servers: NGINX reverse proxy, UFW firewall policy, SSL/TLS termination, systemd service management.",
    ],
  },
  {
    company: "InnoSyte",
    role: "Software Engineer (Backend & DevOps)",
    start: "Jan 2025",
    end: "Dec 2025",
    current: false,
    points: [
      "Full-stack developer — designed frontend and backend architecture and shipped features end-to-end in React and Python/FastAPI.",
      "Owned end-to-end deployment of client applications on GCP: Docker containerisation, NGINX reverse proxy, SSL/TLS termination, GitHub Actions CI/CD with Secrets Manager.",
      "Standardised Git branching and release workflows across client repositories, reviewing every pull request for deployment readiness.",
      "Built FastAPI backend services for client e-commerce platforms — product catalogues, order management, Razorpay payments — with JWT auth, RBAC and MongoDB.",
      "Developed React dashboards against FastAPI backends, working the full lifecycle from code to production.",
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

export const projects = [
  {
    name: "Vistofy.in",
    tagline: "AI-powered design and image editing platform",
    url: "https://vistofy.in",
    role: "Architecture, deployment, migration",
    points: [
      "Designed and deployed a multi-service production platform (Canva-style design tool) as independently containerised services: frontend, backend, Redis, and a custom AI background-removal microservice.",
      "Built the background-removal service in Python on the birefnet-general segmentation model with optional Real-ESRGAN upscaling, running on a dedicated high-memory host with configurable worker allocation.",
      "Migrated frontend and backend from Contabo VPS to GCP while keeping the compute-heavy AI service on Contabo for cost efficiency.",
      "GCP-managed Load Balancer for backend traffic distribution, Cloudflare for CDN, DNS and security, centralised logging through Grafana Loki.",
    ],
    tags: ["GCP", "MIG · Autoscaling", "Compute Engine", "Cloud Storage", "MongoDB Atlas", "Contabo VPS", "Docker", "Redis", "Grafana", "GitHub Actions", "GHCR", "birefnet"],
    diagram: {
      nodes: [
        { id: "users",    label: "End Users",       host: "Internet · HTTPS" },
        { id: "lb",       label: "App Load Balancer",host: "GCP · External managed LB" },
        { id: "fe",       label: "Frontend VM",      host: "GCP · Compute Engine" },
        { id: "mig",      label: "Backend MIG",      host: "GCP · Managed Instance Group · autoscaling" },
        { id: "mongo",    label: "MongoDB Atlas",    host: "External · managed DB" },
        { id: "redis",    label: "Redis Cache",      host: "GCP · Dedicated Cache VM · internal VPC" },
        { id: "storage",  label: "Cloud Storage",    host: "GCP · multi-region bucket" },
        { id: "bgremove", label: "bgremove API",     host: "Contabo VPS · Docker container" },
        { id: "worker",   label: "bgremove Worker",  host: "Contabo VPS · parallel workers" },
        { id: "grafana",  label: "Grafana",          host: "Monitoring · metrics dashboard" },
        { id: "github",   label: "GitHub Actions",   host: "CI/CD · build trigger" },
        { id: "ghcr",     label: "GHCR",             host: "Container registry" },
      ],
      edges: [
        ["users","lb"],["lb","fe"],["lb","mig"],
        ["mig","redis"],["mig","storage"],["mig","bgremove"],
        ["fe","mongo"],["mig","mongo"],
        ["bgremove","worker"],["worker","grafana"],["mig","grafana"],
        ["github","ghcr"],["ghcr","mig"],
      ],
    },
  },
  {
    name: "Multi-Repository CI/CD Infrastructure",
    tagline: "One deployment pattern, ten-plus client projects",
    url: "",
    role: "Design and ownership",
    points: [
      "Designed a standardised multi-repo CI/CD pattern used across 10+ client projects — separate frontend and backend repos, each with main/development/feature branching, reviewed and merged only on deployment-readiness.",
      "Every pipeline follows the same contract: commit triggers build, automated checks gate the push to GHCR, deploy runs against the target environment, Docker healthcheck confirms liveness before traffic switches.",
      "Secrets and environment config managed independently per project — no shared blast radius. Reusable GitHub Actions workflows cut pipeline setup time to under 30 minutes per new client repo.",
    ],
    tags: ["GitHub Actions", "Docker", "GHCR", "GitOps", "Secrets Manager"],
    diagram: {
      nodes: [
        { id: "commit", label: "Commit",       host: "feature → development" },
        { id: "build",  label: "Build",        host: "GitHub Actions runner" },
        { id: "test",   label: "Lint & Test",  host: "Automated checks" },
        { id: "push",   label: "Push GHCR",    host: "Container registry" },
        { id: "deploy", label: "Deploy",       host: "Target environment" },
        { id: "health", label: "Health check", host: "Docker healthcheck" },
        { id: "notify", label: "Notify",       host: "Slack / webhook" },
      ],
      edges: [["commit","build"],["build","test"],["test","push"],["push","deploy"],["deploy","health"],["health","notify"]],
    },
  },
];

export const education = [
  { degree: "Master of Computer Applications (MCA)", school: "CMR Institute of Technology", year: "2025", note: "CGPA 8.6" },
  { degree: "Bachelor of Computer Applications (BCA)", school: "Poddar International College", year: "2023", note: "65%" },
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

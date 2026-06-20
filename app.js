import { iconHtml, initIcons } from './icons.js';

/* ── Agents ── */
const AGENTS = [
  { id: 'dp', name: 'David Park', initials: 'DP', color: '#f472b6' },
  { id: 'zu', name: 'Zilvinas Urbonas', initials: 'ZU', color: '#2dd4bf' },
  { id: 'bm', name: 'Bob Martinez', initials: 'BM', color: '#9f3d5a' },
  { id: 'cc', name: 'Carol Chen', initials: 'CC', color: '#c4a035' },
];

const STATUS_LABELS = {
  backlog: 'Backlog',
  'in-progress': 'In progress',
  review: 'Review',
  closed: 'Closed',
};

const PERMISSION_MODES = [
  { id: 'plan', label: 'Plan mode', desc: 'Thinks and plans, no edits' },
  { id: 'ask-edits', label: 'Ask before edits', desc: 'Approves every file change before it\'s made' },
  { id: 'auto', label: 'Auto mode', desc: 'Runs freely, asks only for high-risk actions' },
  { id: 'ferment', label: 'Ferment mode', desc: 'Agent breaks complex tasks into milestones, executes and self-evaluates · no permissions asked.' },
  { id: 'yolo', label: 'YOLO', desc: 'No permissions asked · use in sandboxed environments' },
];

const MODEL_OPTIONS = [
  { id: 'multi', label: 'Multi-model', desc: 'Auto-routes to best model per task' },
  { id: 'kimi', label: 'Kimi-k2.6', desc: 'Best for reasoning and planning' },
  { id: 'minimax', label: 'Minimax-m3', desc: 'Best for fast execution' },
  { id: 'nemotron', label: 'Nemotron-3-super-fp4', desc: '1M context · large codebases and documents' },
];

const REVIEW_REASONS = {
  'needs-input': {
    icon: 'message-circle',
    cardLabel: 'Needs input',
    iconClass: 'lucide-orange',
    snackbarMessage: '1 agent needs input',
  },
  ready: {
    icon: 'check-check',
    cardLabel: 'Agent is done',
    iconClass: 'lucide-teal',
    snackbarMessage: 'Review finished task',
  },
};


/* ── State ── */
let tasks = [
  {
    id: 't1',
    title: 'Prototype budgets overview screen',
    repo: 'design',
    status: 'in-progress',
    agentId: 'dp',
    prs: 0,
    commits: 0,
    files: 0,
    additions: 0,
    deletions: 0,
    chat: [],
  },
  {
    id: 't2',
    title: 'Implement budgets CRUD API',
    repo: 'backend',
    status: 'review',
    reviewReason: 'needs-input',
    agentId: 'cc',
    prs: 1,
    commits: 1,
    files: 4,
    additions: 214,
    deletions: 12,
    chat: [],
    workSimulated: true,
  },
  {
    id: 't3',
    title: 'Build budgets dashboard from prototypes',
    repo: 'frontend',
    status: 'in-progress',
    agentId: 'zu',
    prs: 0,
    commits: 0,
    files: 0,
    additions: 0,
    deletions: 0,
    chat: [],
  },
  {
    id: 't4',
    title: 'Budget period selector component',
    repo: 'frontend',
    status: 'review',
    reviewReason: 'needs-input',
    agentId: 'bm',
    prs: 1,
    commits: 2,
    files: 4,
    additions: 86,
    deletions: 12,
    chat: [],
  },
  {
    id: 't5',
    title: 'Publish budgets OpenAPI contract',
    repo: 'backend',
    status: 'review',
    reviewReason: 'ready',
    agentId: 'bm',
    prs: 1,
    commits: 1,
    files: 2,
    additions: 148,
    deletions: 6,
    chat: [],
  },
  {
    id: 't6',
    title: 'Prototype budget editing & alert flows',
    repo: 'design',
    status: 'backlog',
    agentId: 'dp',
    prs: 0,
    commits: 0,
    files: 0,
    additions: 0,
    deletions: 0,
    chat: [],
  },
  {
    id: 't7',
    title: 'Wire budget cards to API contracts',
    repo: 'frontend',
    status: 'backlog',
    agentId: 'zu',
    prs: 0,
    commits: 0,
    files: 0,
    additions: 0,
    deletions: 0,
    chat: [],
  },
  {
    id: 't8',
    title: 'Add budget threshold alert endpoints',
    repo: 'backend',
    status: 'backlog',
    agentId: 'cc',
    prs: 0,
    commits: 0,
    files: 0,
    additions: 0,
    deletions: 0,
    chat: [],
  },
  {
    id: 't9',
    title: 'Fix incorrect settings icon in sidebar',
    repo: 'frontend',
    status: 'backlog',
    agentId: 'zu',
    prs: 0,
    commits: 0,
    files: 0,
    additions: 0,
    deletions: 0,
    chat: [],
  },
  {
    id: 't10',
    title: 'Fix dashboard spend totals discrepancy',
    repo: 'backend',
    status: 'backlog',
    agentId: 'cc',
    prs: 0,
    commits: 0,
    files: 0,
    additions: 0,
    deletions: 0,
    chat: [],
  },
  {
    id: 't11',
    title: 'Budgets empty states & onboarding',
    repo: 'design',
    status: 'closed',
    agentId: 'dp',
    prs: 1,
    commits: 1,
    files: 3,
    additions: 42,
    deletions: 4,
    chat: [],
  },
  {
    id: 't12',
    title: 'Budget categories schema migration',
    repo: 'backend',
    status: 'closed',
    agentId: 'cc',
    prs: 1,
    commits: 2,
    files: 4,
    additions: 96,
    deletions: 18,
    chat: [],
  },
  {
    id: 't13',
    title: 'Budget row loading skeletons',
    repo: 'frontend',
    status: 'closed',
    agentId: 'zu',
    prs: 1,
    commits: 1,
    files: 2,
    additions: 31,
    deletions: 8,
    chat: [],
  },
  {
    id: 't14',
    title: 'Fix agent picker icon mismatch',
    repo: 'frontend',
    status: 'closed',
    agentId: 'zu',
    prs: 1,
    commits: 1,
    files: 1,
    additions: 4,
    deletions: 4,
    chat: [],
  },
];

const TASK_DESCRIPTIONS = {
  t1: 'Prototype budgets overview screen\n\nCreate an interactive prototype for the budgets overview: summary strip, category breakdown, and alert indicators. Match Kimchi Studio spacing and include period toggle interactions for handoff to frontend.',
  t2: 'Implement budgets CRUD API\n\nAdd REST endpoints for listing, creating, updating, and archiving workspace budgets. Generate TypeScript types from the OpenAPI spec and cover threshold updates in integration tests.',
  t3: 'Build budgets dashboard from prototypes\n\nImplement the budgets dashboard UI using the design prototype and @kimchi/api-contracts types. Wire budget cards to the live API and match loading, empty, and error states from the handoff.',
  t4: 'Budget period selector component\n\nBuild a reusable period selector (week / month / quarter) for the budgets dashboard. Ensure it syncs with query params and matches the design spec typography and spacing.',
  t5: 'Publish budgets OpenAPI contract\n\nFinalize and publish the budgets OpenAPI schema so frontend can codegen against stable types. Include CRUD, threshold, and alert payload shapes with examples.',
  t6: 'Prototype budget editing & alert flows\n\nDesign interactive flows for editing a budget line item and configuring alert thresholds. Cover validation errors, threshold confirmation, and the alert banner states for engineering handoff.',
  t7: 'Wire budget cards to API contracts\n\nConnect budget card components to the published backend contracts. Replace mock data with useBudgets hook, handle pagination, and align card metrics with API field names.',
  t8: 'Add budget threshold alert endpoints\n\nExpose endpoints for setting and clearing budget alert thresholds plus a webhook payload for triggered alerts. Document expected client usage in the OpenAPI descriptions.',
  t9: 'Fix incorrect settings icon in sidebar\n\nThe settings nav item renders a sliders icon instead of the settings gear. Swap to the correct Lucide icon and verify dark theme contrast matches adjacent items.',
  t10: 'Fix dashboard spend totals discrepancy\n\nDashboard header total does not match the sum of chart line items for the selected period. Trace the aggregation path and reconcile refund handling between the summary and series queries.',
  t11: 'Budgets empty states & onboarding\n\nPrototype first-run empty states and lightweight onboarding copy when a workspace has no budgets yet. Include CTA to create the first budget and illustration placeholders.',
  t12: 'Budget categories schema migration\n\nAdd budget_categories table and migrate existing seed data. Backfill foreign keys on budgets rows and verify rollback path for staging deploys.',
  t13: 'Budget row loading skeletons\n\nReplace spinner fallbacks on budget list rows with skeleton placeholders that match final row height and column layout from the design prototype.',
  t14: 'Fix agent picker icon mismatch\n\nAgent picker dropdown shows the wrong icon for assigned users in one theme variant. Align with the avatar chip icon set used on kanban cards.',
};

tasks.forEach((task) => {
  if (!task.description) {
    task.description = TASK_DESCRIPTIONS[task.id] || task.title;
  }
});

const TASK_BLOCKED_BY = {
  t3: 't1',
  t4: 't3',
  t6: 't1',
  t7: 't2',
  t8: 't2',
};

tasks.forEach((task) => {
  if (TASK_BLOCKED_BY[task.id]) {
    task.blockedBy = TASK_BLOCKED_BY[task.id];
  }
});

let activeTaskId = null;
let activeRepo = 'all';
let activeAssignee = null;
let activeWorkspaceId = 'kimchi';
let activeWorkspaceChartTab = 'tasks';

const WORKSPACE_CHART_TABS = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'costs', label: 'Costs' },
  { id: 'prs', label: 'PRs' },
  { id: 'commits', label: 'Commits' },
];

const WORKSPACE_STATUS_COLORS = {
  backlog: '#5c6070',
  inProgress: '#3b82f6',
  review: '#f97316',
  closed: '#2dd4bf',
};

function workspaceTeamScale(memberCount = 3, repos = 2) {
  return memberCount * 18 + repos * 6;
}

function workspaceDailyCostBase(memberCount, repos) {
  return memberCount * 320 + repos * 180;
}

function workspaceHistorySeed(id, { memberCount = 3, repos = 2 } = {}) {
  const base = id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
    + memberCount * 31 + repos * 19;
  const pick = (min, max, day) => {
    if (max <= min) return min;
    return min + ((base * (day + 3) * 17) % (max - min + 1));
  };

  const scale = workspaceTeamScale(memberCount, repos) * (id === 'kimchi' ? 1.08 : 1);
  const tasks = Array.from({ length: 7 }, (_, day) => {
    const total = pick(Math.round(scale * 1.6), Math.round(scale * 2.6), day);
    const backlog = pick(Math.round(total * 0.24), Math.round(total * 0.36), day + 1);
    const inProgress = pick(Math.round(total * 0.18), Math.round(total * 0.3), day + 2);
    const review = pick(Math.round(total * 0.08), Math.round(total * 0.16), day + 3);
    const closed = Math.max(Math.round(total * 0.2), total - backlog - inProgress - review);
    const sum = backlog + inProgress + review + closed;
    const norm = total / sum;
    const normalized = {
      backlog: Math.round(backlog * norm),
      inProgress: Math.round(inProgress * norm),
      review: Math.round(review * norm),
      closed: Math.round(closed * norm),
    };
    const normalizedSum = normalized.backlog + normalized.inProgress
      + normalized.review + normalized.closed;
    if (normalizedSum !== total) {
      normalized.closed += total - normalizedSum;
    }
    return normalized;
  });

  const dailyCostBase = workspaceDailyCostBase(memberCount, repos);
  const costs = Array.from({ length: 7 }, (_, day) => pick(
    Math.round(dailyCostBase * 0.82),
    Math.round(dailyCostBase * 1.22),
    day + 4,
  ));

  const prs = Array.from({ length: 7 }, (_, day) => pick(
    Math.max(3, memberCount * 2),
    memberCount * 3 + repos + 5,
    day + 5,
  ));

  const commits = Array.from({ length: 7 }, (_, day) => pick(
    memberCount * 12 + repos * 5,
    memberCount * 22 + repos * 10,
    day + 6,
  ));

  return { tasks, costs, prs, commits };
}

function workspaceAvgDailyCost(memberCount, repos, id) {
  const history = withWeekendDip(workspaceHistorySeed(id, { memberCount, repos }));
  const weekend = last7DayWeekendFlags();
  const weekdayCosts = history.costs.filter((_, index) => !weekend[index]);
  return Math.round(weekdayCosts.reduce((sum, value) => sum + value, 0) / weekdayCosts.length);
}

const WORKSPACES = [
  {
    id: 'kimchi',
    name: 'Kimchi Team',
    repository: 'cast-ai/kimchi-studio',
    live: true,
    repos: 3,
    members: 4,
  },
  {
    id: 'wire',
    name: 'Wire Team',
    repository: 'cast-ai/wire-sync',
    repos: 2,
    openPrs: 14,
    avgDailyCost: workspaceAvgDailyCost(4, 2, 'wire'),
    members: ['dp', 'zu', 'bm', 'cc'],
    history: workspaceHistorySeed('wire', { memberCount: 4, repos: 2 }),
  },
  {
    id: 'kube',
    name: 'Kube Team',
    repository: 'cast-ai/kube-ops',
    repos: 4,
    openPrs: 9,
    avgDailyCost: workspaceAvgDailyCost(3, 4, 'kube'),
    members: ['zu', 'bm', 'cc'],
    history: workspaceHistorySeed('kube', { memberCount: 3, repos: 4 }),
  },
  {
    id: 'dbo',
    name: 'DBO Team',
    repository: 'cast-ai/dbo-platform',
    repos: 1,
    openPrs: 5,
    avgDailyCost: workspaceAvgDailyCost(2, 1, 'dbo'),
    members: ['cc', 'bm'],
    history: workspaceHistorySeed('dbo', { memberCount: 2, repos: 1 }),
  },
  {
    id: 'woop',
    name: 'WOOP Team',
    repository: 'cast-ai/woop-labs',
    repos: 2,
    openPrs: 4,
    avgDailyCost: workspaceAvgDailyCost(2, 2, 'woop'),
    members: ['dp', 'zu'],
    history: workspaceHistorySeed('woop', { memberCount: 2, repos: 2 }),
  },
];
let taskSidebarRepo = 'all';
let assigneeMenuTaskId = null;
let assigneeMenuAnchor = null;
let nextId = 15;
let dragState = null;
let linkRafPending = false;
let taskWorkRunId = 0;
let progressTickTimer = null;
let activeSimulatedTaskId = null;
let completionPauseTimer = null;
let pendingCompletionTaskId = null;
let activeDiffFileIndex = 0;
let workspaceStatsMenuAnchor = null;
let workspaceStatsMenuType = null;
let snackbarTimer = null;
let thinkingTimer = null;
let thinkingStart = 0;
let kanbanChatHistory = [];

function taskBranchSlug(task) {
  return task.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 36);
}

function diffBundle(branch, files, terminalLines, gitLog) {
  return {
    branch,
    files,
    terminal: terminalLines.join('\n'),
    gitLog,
  };
}

function getTaskDiffBundle(task) {
  const title = task.title.toLowerCase();
  const repo = task.repo;
  const branch = `feat/${taskBranchSlug(task)}`;

  if (repo === 'design' && title.includes('overview')) {
    return diffBundle(
      branch,
      [
        {
          path: 'prototypes/budgets/overview.canvas',
          lines: [
            { type: 'ctx', ln: 1, code: '{' },
            { type: 'ctx', ln: 2, code: '  "frame": "BudgetsOverview",' },
            { type: 'del', ln: 3, code: '  "status": "draft",' },
            { type: 'add', ln: 3, code: '  "status": "ready-for-handoff",' },
            { type: 'add', ln: 4, code: '  "components": ["SummaryStrip", "CategoryList", "AlertPill"],' },
            { type: 'add', ln: 5, code: '  "interactions": {' },
            { type: 'add', ln: 6, code: '    "periodToggle": ["week", "month", "quarter"],' },
            { type: 'add', ln: 7, code: '    "rowExpand": "BudgetDetail"' },
            { type: 'add', ln: 8, code: '  },' },
            { type: 'ctx', ln: 9, code: '  "tokens": "design-handoff/budgets/tokens.json"' },
            { type: 'ctx', ln: 10, code: '}' },
          ],
        },
        {
          path: 'design-handoff/budgets/tokens.json',
          lines: [
            { type: 'ctx', ln: 1, code: '{' },
            { type: 'add', ln: 2, code: '  "spacing.card": "16px",' },
            { type: 'add', ln: 3, code: '  "color.alert": "#f97316",' },
            { type: 'add', ln: 4, code: '  "color.summary": "#2dd4bf"' },
            { type: 'ctx', ln: 5, code: '}' },
          ],
        },
      ],
      [
        '$ kimchi proto validate prototypes/budgets/overview.canvas',
        '✓ 3 hotspots linked',
        '$ kimchi proto export budgets --format figma-tokens',
        '✓ exported design-handoff/budgets/tokens.json',
        `$ git status`,
        `On branch ${branch}`,
        '  modified: prototypes/budgets/overview.canvas',
        '  modified: design-handoff/budgets/tokens.json',
      ],
      [
        { hash: 'd4a91fe', message: 'proto(budgets): finalize overview interactions', time: '18m ago' },
        { hash: 'e8b20c4', message: 'proto(budgets): export spacing and alert tokens', time: '42m ago' },
      ],
    );
  }

  if (repo === 'design' && (title.includes('editing') || title.includes('alert flow'))) {
    return diffBundle(
      branch,
      [
        {
          path: 'prototypes/budgets/editing-flow.canvas',
          lines: [
            { type: 'add', ln: 1, code: '{' },
            { type: 'add', ln: 2, code: '  "frame": "BudgetEditAndAlerts",' },
            { type: 'add', ln: 3, code: '  "flows": ["edit-line-item", "set-threshold", "confirm-alert"],' },
            { type: 'add', ln: 4, code: '  "validation": ["amount-required", "threshold-min"],' },
            { type: 'add', ln: 5, code: '  "states": ["default", "error", "alert-banner"]' },
            { type: 'add', ln: 6, code: '}' },
          ],
        },
      ],
      [
        '$ kimchi proto new editing-flow.canvas --from overview.canvas',
        '✓ scaffolded alert + edit flows',
        `$ git checkout -b ${branch}`,
      ],
      [
        { hash: 'f1c882a', message: 'proto(budgets): scaffold editing and alert flows', time: 'just now' },
      ],
    );
  }

  if (repo === 'design' && title.includes('empty')) {
    return diffBundle(
      branch,
      [
        {
          path: 'prototypes/budgets/empty-states.canvas',
          lines: [
            { type: 'add', ln: 1, code: '{' },
            { type: 'add', ln: 2, code: '  "frame": "BudgetsEmptyOnboarding",' },
            { type: 'add', ln: 3, code: '  "copy": "Create your first budget to track spend.",' },
            { type: 'add', ln: 4, code: '  "cta": "Create budget",' },
            { type: 'add', ln: 5, code: '  "illustration": "placeholder-budgets.svg"' },
            { type: 'add', ln: 6, code: '}' },
          ],
        },
      ],
      [
        '$ kimchi proto export budgets --frame empty-states',
        '✓ onboarding frame exported',
        `$ git status`,
        `On branch ${branch}`,
        '  new file: prototypes/budgets/empty-states.canvas',
      ],
      [
        { hash: 'a91bc02', message: 'proto(budgets): add empty state onboarding frame', time: '3d ago' },
      ],
    );
  }

  if (repo === 'backend' && title.includes('crud')) {
    return diffBundle(
      branch,
      [
        {
          path: 'src/routes/budgets.ts',
          lines: [
            { type: 'ctx', ln: 1, code: "import { Router } from 'express';" },
            { type: 'add', ln: 2, code: "import { BudgetService } from '../services/budget-service';" },
            { type: 'add', ln: 3, code: "import type { CreateBudgetInput, UpdateBudgetInput } from '../types/budgets';" },
            { type: 'ctx', ln: 4, code: '' },
            { type: 'add', ln: 5, code: 'export const budgetsRouter = Router();' },
            { type: 'add', ln: 6, code: 'const service = new BudgetService();' },
            { type: 'add', ln: 7, code: '' },
            { type: 'add', ln: 8, code: "budgetsRouter.get('/', async (req, res) => {" },
            { type: 'add', ln: 9, code: '  const budgets = await service.list(req.workspaceId);' },
            { type: 'add', ln: 10, code: '  res.json({ data: budgets });' },
            { type: 'add', ln: 11, code: '});' },
            { type: 'collapse', count: 14 },
            { type: 'add', ln: 26, code: "budgetsRouter.post('/', async (req, res) => {" },
            { type: 'add', ln: 27, code: '  const input = req.body as CreateBudgetInput;' },
            { type: 'add', ln: 28, code: '  const budget = await service.create(req.workspaceId, input);' },
            { type: 'add', ln: 29, code: '  res.status(201).json({ data: budget });' },
            { type: 'add', ln: 30, code: '});' },
          ],
        },
        {
          path: 'generated/budgets.ts',
          lines: [
            { type: 'add', ln: 1, code: 'export interface BudgetSummary {' },
            { type: 'add', ln: 2, code: '  id: string;' },
            { type: 'add', ln: 3, code: '  name: string;' },
            { type: 'add', ln: 4, code: '  spent: number;' },
            { type: 'add', ln: 5, code: '  limit: number;' },
            { type: 'add', ln: 6, code: '}' },
          ],
        },
      ],
      [
        '$ npm run codegen -- --spec openapi/budgets.yaml',
        'generated/budgets.ts (+42 types)',
        '$ npm test src/routes/budgets.test.ts',
        '✓ 18 passed',
        `$ git status`,
        `On branch ${branch}`,
        '  modified: src/routes/budgets.ts',
        '  modified: generated/budgets.ts',
      ],
      [
        { hash: 'b7e2d09', message: 'feat(api): add budgets CRUD routes', time: '1h ago' },
        { hash: 'c0f31aa', message: 'chore(api): codegen budget contract types', time: '2h ago' },
      ],
    );
  }

  if (repo === 'backend' && title.includes('openapi')) {
    return diffBundle(
      branch,
      [
        {
          path: 'openapi/budgets.yaml',
          lines: [
            { type: 'ctx', ln: 1, code: 'openapi: 3.1.0' },
            { type: 'ctx', ln: 2, code: 'info:' },
            { type: 'ctx', ln: 3, code: '  title: Kimchi Budgets API' },
            { type: 'add', ln: 4, code: '  version: 1.0.0' },
            { type: 'add', ln: 5, code: 'paths:' },
            { type: 'add', ln: 6, code: '  /budgets:' },
            { type: 'add', ln: 7, code: '    get:' },
            { type: 'add', ln: 8, code: '      summary: List workspace budgets' },
            { type: 'add', ln: 9, code: '    post:' },
            { type: 'add', ln: 10, code: '      summary: Create budget' },
            { type: 'add', ln: 11, code: '  /budgets/{id}/threshold:' },
            { type: 'add', ln: 12, code: '    patch:' },
            { type: 'add', ln: 13, code: '      summary: Update alert threshold' },
          ],
        },
      ],
      [
        '$ npm run lint:openapi openapi/budgets.yaml',
        '✓ schema valid',
        '$ git diff --stat openapi/budgets.yaml',
        ' openapi/budgets.yaml | 148 +++++++++++++++++++++',
      ],
      [
        { hash: '91de44b', message: 'docs(api): publish budgets OpenAPI contract', time: '4h ago' },
        { hash: '77ac102', message: 'docs(api): add threshold payload examples', time: '5h ago' },
      ],
    );
  }

  if (repo === 'backend' && title.includes('threshold')) {
    return diffBundle(
      branch,
      [
        {
          path: 'src/routes/budget-alerts.ts',
          lines: [
            { type: 'add', ln: 1, code: "import { Router } from 'express';" },
            { type: 'add', ln: 2, code: "import { AlertService } from '../services/alert-service';" },
            { type: 'add', ln: 3, code: '' },
            { type: 'add', ln: 4, code: 'export const budgetAlertsRouter = Router();' },
            { type: 'add', ln: 5, code: '' },
            { type: 'add', ln: 6, code: "budgetAlertsRouter.put('/:id/threshold', async (req, res) => {" },
            { type: 'add', ln: 7, code: '  const alert = await AlertService.setThreshold(req.params.id, req.body);' },
            { type: 'add', ln: 8, code: '  res.json({ data: alert });' },
            { type: 'add', ln: 9, code: '});' },
          ],
        },
      ],
      [
        '$ npm test src/routes/budget-alerts.test.ts',
        '✓ 9 passed',
        `$ git status`,
        `On branch ${branch}`,
        '  new file: src/routes/budget-alerts.ts',
      ],
      [
        { hash: '2fd8e11', message: 'feat(api): add budget threshold alert endpoints', time: 'just now' },
      ],
    );
  }

  if (repo === 'backend' && (title.includes('spend') || title.includes('discrepancy') || title.includes('total'))) {
    return diffBundle(
      branch,
      [
        {
          path: 'src/services/dashboard/spend-aggregator.ts',
          lines: [
            { type: 'ctx', ln: 12, code: 'export function aggregateSpend(events: SpendEvent[]) {' },
            { type: 'del', ln: 13, code: "  const total = events.filter((e) => e.type !== 'refund').reduce(sumAmount, 0);" },
            { type: 'add', ln: 13, code: '  const total = events.reduce(sumAmount, 0);' },
            { type: 'ctx', ln: 14, code: '  const series = groupByDay(events);' },
            { type: 'add', ln: 15, code: '  assertTotalsMatch(total, series);' },
            { type: 'ctx', ln: 16, code: '  return { total, series };' },
            { type: 'ctx', ln: 17, code: '}' },
          ],
        },
        {
          path: 'src/services/dashboard/spend-aggregator.test.ts',
          lines: [
            { type: 'add', ln: 1, code: "it('includes refunds in header total', () => {" },
            { type: 'add', ln: 2, code: '  expect(aggregateSpend(sampleWithRefund).total).toBe(52100);' },
            { type: 'add', ln: 3, code: '});' },
          ],
        },
      ],
      [
        '$ npm test spend-aggregator.test.ts',
        '✓ totals now match line-item sum',
        `$ git status`,
        `On branch ${branch}`,
        '  modified: src/services/dashboard/spend-aggregator.ts',
        '  modified: src/services/dashboard/spend-aggregator.test.ts',
      ],
      [
        { hash: 'c1a4f33', message: 'fix(dashboard): reconcile spend totals with chart series', time: '1d ago' },
      ],
    );
  }

  if (repo === 'backend' && title.includes('migration')) {
    return diffBundle(
      branch,
      [
        {
          path: 'migrations/20260318_budget_categories.sql',
          lines: [
            { type: 'add', ln: 1, code: 'CREATE TABLE budget_categories (' },
            { type: 'add', ln: 2, code: '  id UUID PRIMARY KEY,' },
            { type: 'add', ln: 3, code: '  budget_id UUID NOT NULL REFERENCES budgets(id),' },
            { type: 'add', ln: 4, code: '  label TEXT NOT NULL,' },
            { type: 'add', ln: 5, code: '  allocated NUMERIC(12,2) NOT NULL' },
            { type: 'add', ln: 6, code: ');' },
          ],
        },
      ],
      [
        '$ npm run db:migrate',
        '✓ applied 20260318_budget_categories.sql',
        `$ git status`,
        `On branch ${branch}`,
        '  new file: migrations/20260318_budget_categories.sql',
      ],
      [
        { hash: '8e44ad0', message: 'feat(db): add budget categories schema migration', time: '2d ago' },
      ],
    );
  }

  if (repo === 'frontend' && title.includes('dashboard')) {
    return diffBundle(
      branch,
      [
        {
          path: 'src/features/budgets/budgets-dashboard.tsx',
          lines: [
            { type: 'ctx', ln: 1, code: 'import { BudgetCard } from "./budget-card";' },
            { type: 'del', ln: 2, code: 'import { Placeholder } from "@/components/placeholder";' },
            { type: 'add', ln: 2, code: 'import { Progress } from "@/components/ui/progress";' },
            { type: 'add', ln: 3, code: 'import { useBudgets } from "@/hooks/use-budgets";' },
            { type: 'add', ln: 4, code: 'import type { BudgetSummary } from "@kimchi/api-contracts";' },
            { type: 'collapse', count: 28 },
            { type: 'ctx', ln: 33, code: 'export function BudgetsDashboard() {' },
            { type: 'add', ln: 34, code: '  const { data, isLoading } = useBudgets();' },
            { type: 'del', ln: 36, code: '  return <Placeholder title="Budgets" />;' },
            { type: 'add', ln: 36, code: '  if (isLoading) return <BudgetListSkeleton />;' },
            { type: 'add', ln: 37, code: '  return (' },
            { type: 'add', ln: 38, code: '    <section className="budgets-grid">' },
            { type: 'add', ln: 39, code: '      {data?.map((budget: BudgetSummary) => (' },
            { type: 'add', ln: 40, code: '        <BudgetCard key={budget.id} budget={budget} />' },
            { type: 'ctx', ln: 41, code: '      ))}' },
          ],
        },
        {
          path: 'src/hooks/use-budgets.ts',
          lines: [
            { type: 'add', ln: 1, code: "import { useQuery } from '@tanstack/react-query';" },
            { type: 'add', ln: 2, code: "import { listBudgets } from '@/api/budgets';" },
            { type: 'add', ln: 3, code: '' },
            { type: 'add', ln: 4, code: 'export function useBudgets() {' },
            { type: 'add', ln: 5, code: '  return useQuery({ queryKey: [\"budgets\"], queryFn: listBudgets });' },
            { type: 'add', ln: 6, code: '}' },
          ],
        },
      ],
      [
        '$ npm run dev',
        '▲ Next.js 15.1.0',
        '- Local: http://localhost:3000',
        '✓ Compiled in 1.2s',
        `$ git status`,
        `On branch ${branch}`,
        '  modified: src/features/budgets/budgets-dashboard.tsx',
        '  modified: src/hooks/use-budgets.ts',
      ],
      [
        { hash: 'a3f8c21', message: 'feat(budgets): wire dashboard to API contracts', time: '2h ago' },
        { hash: 'd19ef02', message: 'feat(budgets): add useBudgets data hook', time: '3h ago' },
      ],
    );
  }

  if (repo === 'frontend' && title.includes('period selector')) {
    return diffBundle(
      branch,
      [
        {
          path: 'src/features/budgets/budget-period-selector.tsx',
          lines: [
            { type: 'add', ln: 1, code: "import { useSearchParams } from 'next/navigation';" },
            { type: 'add', ln: 2, code: "import { SegmentedControl } from '@/components/ui/segmented-control';" },
            { type: 'add', ln: 3, code: '' },
            { type: 'add', ln: 4, code: 'const PERIODS = [\"week\", \"month\", \"quarter\"] as const;' },
            { type: 'add', ln: 5, code: '' },
            { type: 'add', ln: 6, code: 'export function BudgetPeriodSelector() {' },
            { type: 'add', ln: 7, code: '  const [params, setParams] = useSearchParams();' },
            { type: 'add', ln: 8, code: '  const value = params.get(\"period\") ?? \"month\";' },
            { type: 'add', ln: 9, code: '  return (' },
            { type: 'add', ln: 10, code: '    <SegmentedControl options={PERIODS} value={value} onChange={(p) => setParams({ period: p })} />' },
            { type: 'add', ln: 11, code: '  );' },
            { type: 'add', ln: 12, code: '}' },
          ],
        },
      ],
      [
        '$ npm test budget-period-selector.test.tsx',
        '✓ syncs selected period with query params',
        `$ git status`,
        `On branch ${branch}`,
        '  new file: src/features/budgets/budget-period-selector.tsx',
      ],
      [
        { hash: '44b0c18', message: 'feat(budgets): add reusable period selector', time: '6h ago' },
      ],
    );
  }

  if (repo === 'frontend' && title.includes('wire') && title.includes('card')) {
    return diffBundle(
      branch,
      [
        {
          path: 'src/features/budgets/budget-card.tsx',
          lines: [
            { type: 'ctx', ln: 1, code: "import type { BudgetSummary } from '@kimchi/api-contracts';" },
            { type: 'del', ln: 8, code: '  const budget = MOCK_BUDGET;' },
            { type: 'add', ln: 8, code: '  const { data: budget } = useBudget(props.budgetId);' },
            { type: 'add', ln: 9, code: '  if (!budget) return <BudgetCardSkeleton />;' },
            { type: 'ctx', ln: 10, code: '  return (' },
            { type: 'ctx', ln: 11, code: '    <article className="budget-card">' },
            { type: 'add', ln: 12, code: '      <p>{budget.spent} / {budget.limit}</p>' },
          ],
        },
      ],
      [
        '$ npm test budget-card.test.tsx',
        '✓ renders live API metrics',
        `$ git status`,
        `On branch ${branch}`,
        '  modified: src/features/budgets/budget-card.tsx',
      ],
      [
        { hash: '5ac21de', message: 'feat(budgets): connect budget cards to API contracts', time: 'just now' },
      ],
    );
  }

  if (repo === 'frontend' && title.includes('icon')) {
    const file = title.includes('agent picker')
      ? 'src/components/tasks/assignee-picker.tsx'
      : 'src/components/sidebar/sidebar-nav.tsx';
    const lines = title.includes('agent picker')
      ? [
          { type: 'del', ln: 14, code: 'import { UserRound } from "lucide-react";' },
          { type: 'add', ln: 14, code: 'import { UserCircle2 } from "lucide-react";' },
          { type: 'del', ln: 42, code: '  return <UserRound className="assignee-icon" />;' },
          { type: 'add', ln: 42, code: '  return <UserCircle2 className="assignee-icon" />;' },
        ]
      : [
          { type: 'del', ln: 14, code: '  { label: "Settings", icon: Sliders, href: "/settings" },' },
          { type: 'add', ln: 14, code: '  { label: "Settings", icon: Settings, href: "/settings" },' },
        ];

    return diffBundle(
      branch,
      [{ path: file, lines }],
      [
        '$ npm test sidebar-nav.test.tsx',
        '✓ settings item uses Settings icon',
        `$ git status`,
        `On branch ${branch}`,
        `  modified: ${file}`,
      ],
      [
        {
          hash: title.includes('agent picker') ? '0bc14ef' : '9f21ac8',
          message: title.includes('agent picker')
            ? 'fix(tasks): align assignee picker icon with card chips'
            : 'fix(nav): use settings gear icon in sidebar',
          time: '1d ago',
        },
      ],
    );
  }

  if (repo === 'frontend' && title.includes('skeleton')) {
    return diffBundle(
      branch,
      [
        {
          path: 'src/features/budgets/budget-list-skeleton.tsx',
          lines: [
            { type: 'add', ln: 1, code: 'export function BudgetListSkeleton() {' },
            { type: 'add', ln: 2, code: '  return (' },
            { type: 'add', ln: 3, code: '    <div className="budget-list-skeleton">' },
            { type: 'add', ln: 4, code: '      {Array.from({ length: 4 }).map((_, i) => (' },
            { type: 'add', ln: 5, code: '        <div key={i} className="skeleton-row" />' },
            { type: 'add', ln: 6, code: '      ))}' },
            { type: 'add', ln: 7, code: '    </div>' },
            { type: 'add', ln: 8, code: '  );' },
            { type: 'add', ln: 9, code: '}' },
          ],
        },
      ],
      [
        '$ npm test budget-list-skeleton.test.tsx',
        '✓ renders 4 placeholder rows',
        `$ git status`,
        `On branch ${branch}`,
        '  new file: src/features/budgets/budget-list-skeleton.tsx',
      ],
      [
        { hash: '7cd02aa', message: 'feat(budgets): add budget row loading skeletons', time: '2d ago' },
      ],
    );
  }

  const featurePath = repo === 'design' ? 'prototypes' : `src/features/${repo}`;
  return diffBundle(
    branch,
    [
      {
        path: `${featurePath}/${taskBranchSlug(task)}.${repo === 'design' ? 'canvas' : 'ts'}`,
        lines: [
          { type: 'ctx', ln: 1, code: `// Task: ${task.title}` },
          { type: 'add', ln: 2, code: `// Repo: ${repo}` },
          { type: 'add', ln: 3, code: '// Agent changes applied for this task context.' },
        ],
      },
    ],
    [
      `$ kimchi task implement --slug ${taskBranchSlug(task)}`,
      '✓ changes applied',
      `$ git status`,
      `On branch ${branch}`,
      `  modified: ${featurePath}/${taskBranchSlug(task)}.${repo === 'design' ? 'canvas' : 'ts'}`,
    ],
    [{ hash: '1a2b3c4', message: `chore(${repo}): progress on ${task.title}`, time: 'just now' }],
  );
}

function renderDiffLines(lines) {
  return lines
    .map((line) => {
      if (line.type === 'collapse') {
        return `<div class="diff-collapse">Show ${line.count} unmodified lines</div>`;
      }
      return `<div class="diff-line ${line.type}">
      <span class="ln">${line.ln}</span>
      <span class="code">${escapeHtml(line.code)}</span>
    </div>`;
    })
    .join('');
}

function renderDiff() {
  const fileTree = $('#diff-file-tree');
  const viewer = $('#diff-viewer');
  const terminal = $('#task-terminal-output');
  const gitLog = $('#task-git-log');
  const task = getTask(activeTaskId);

  if (!fileTree || !viewer) return;

  if (!task || task.status === 'backlog') {
    fileTree.innerHTML = '';
    viewer.innerHTML = task
      ? '<div class="diff-empty">No file changes yet. Start the task to see agent edits.</div>'
      : '';
    if (terminal) terminal.textContent = '';
    if (gitLog) gitLog.innerHTML = '';
    return;
  }

  const bundle = getTaskDiffBundle(task);
  const safeIndex = Math.min(activeDiffFileIndex, Math.max(bundle.files.length - 1, 0));
  activeDiffFileIndex = safeIndex;

  fileTree.innerHTML = bundle.files
    .map(
      (file, index) => `
    <div class="file-tree-item${index === safeIndex ? ' active' : ''}" data-file-index="${index}">
      <span class="icon-slot" data-icon="file" data-size="14" data-icon-class="lucide-icon lucide-muted"></span>
      <span>${escapeHtml(file.path)}</span>
    </div>`,
    )
    .join('');

  initIcons(fileTree);
  fileTree.querySelectorAll('.file-tree-item').forEach((item) => {
    item.addEventListener('click', () => {
      activeDiffFileIndex = Number(item.dataset.fileIndex);
      renderDiff();
    });
  });

  viewer.innerHTML = renderDiffLines(bundle.files[safeIndex]?.lines || []);

  if (terminal) terminal.textContent = bundle.terminal;
  if (gitLog) {
    gitLog.innerHTML = bundle.gitLog
      .map(
        (entry) =>
          `<div class="git-entry"><span class="git-hash">${entry.hash}</span> ${escapeHtml(entry.message)} <span class="git-time">${escapeHtml(entry.time)}</span></div>`,
      )
      .join('');
  }
}

/* ── DOM refs ── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ── Helpers ── */
function getAgent(id) {
  return AGENTS.find((a) => a.id === id) || AGENTS[0];
}

function getTask(id) {
  return tasks.find((t) => t.id === id);
}

function boardTasks() {
  if (activeWorkspaceId !== 'kimchi') return [];
  return tasks;
}

function tasksForBoardRepo() {
  let list = boardTasks();
  if (activeRepo === 'all') return list;
  return list.filter((t) => t.repo === activeRepo);
}

function tasksForBoard() {
  let list = tasksForBoardRepo();
  if (activeAssignee) list = list.filter((t) => t.agentId === activeAssignee);
  return list;
}

function tasksForTaskSidebar() {
  if (taskSidebarRepo === 'all') return tasks;
  return tasks.filter((t) => t.repo === taskSidebarRepo);
}

function defaultRepoForNewTask() {
  return activeRepo === 'all' ? 'backend' : activeRepo;
}

function syncReviewReason(task) {
  if (task.status !== 'review') {
    task.reviewReason = null;
    return;
  }
  if (!task.reviewReason) {
    task.reviewReason = Number.parseInt(task.id.replace(/\D/g, ''), 10) % 2 === 0
      ? 'needs-input'
      : 'ready';
  }
}

function getReviewReasonMeta(task) {
  if (task.status !== 'review') return null;
  syncReviewReason(task);
  return REVIEW_REASONS[task.reviewReason] || REVIEW_REASONS.ready;
}

function reviewStatusCardHtml(task) {
  const meta = getReviewReasonMeta(task);
  if (!meta) return '';
  return `<div class="task-card-review task-card-review--${task.reviewReason}">
    <span class="task-card-review-dot" aria-hidden="true"></span>
    <span class="task-card-review-label">${escapeHtml(meta.cardLabel)}</span>
  </div>`;
}

function sidebarTaskLeadingHtml(task) {
  if (task.status === 'backlog') {
    return `<button type="button" class="sidebar-task-play" data-task-id="${task.id}" aria-label="Start task">
      ${iconHtml('play', { size: 12, className: 'lucide-icon' })}
    </button>`;
  }
  if (task.status === 'in-progress') {
    return `<span class="sidebar-task-icon sidebar-task-icon--spinner" aria-hidden="true">
      ${iconHtml('loader', { size: 12, className: 'lucide-icon lucide-spin' })}
    </span>`;
  }
  if (task.status === 'review') {
    const meta = getReviewReasonMeta(task);
    return `<span class="sidebar-task-icon sidebar-task-icon--review sidebar-task-icon--${task.reviewReason}" aria-hidden="true">
      ${iconHtml(meta.icon, { size: 12, className: 'lucide-icon' })}
    </span>`;
  }
  if (task.status === 'closed') {
    return `<span class="sidebar-task-icon sidebar-task-icon--pr" aria-hidden="true">
      ${iconHtml('git-pull-request', { size: 12, className: 'lucide-icon' })}
    </span>`;
  }
  return '';
}

function taskCardStatsHtml(task) {
  return `(${task.files} files <span class="add">+${task.additions}</span> <span class="del">-${task.deletions}</span>)`;
}

function taskCardFooterActionHtml(task) {
  if (task.status === 'in-progress' || task.status === 'review') {
    return `<div class="task-card-stats">${taskCardStatsHtml(task)}</div>`;
  }
  if (task.status === 'backlog') {
    return `<button type="button" class="task-card-play" data-task-id="${task.id}" aria-label="Start task">
      ${iconHtml('play', { size: 14, className: 'lucide-icon' })}
    </button>`;
  }
  return '';
}

function getTasksBlockedBy(taskId) {
  return tasks.filter((task) => task.blockedBy === taskId);
}

function getTaskLinkCount(task) {
  let count = 0;
  if (task.blockedBy) count += 1;
  count += getTasksBlockedBy(task.id).length;
  return count;
}

function taskCardTagsHtml(task) {
  const linkCount = getTaskLinkCount(task);

  return `<div class="task-card-tags">
    <span class="task-card-tag task-card-tag--repo">${escapeHtml(task.repo)}</span>
    ${linkCount > 0 ? `<span class="task-card-tag task-card-tag--linked">${iconHtml('link', { size: 10, className: 'lucide-icon task-card-tag-icon' })} ${linkCount} task${linkCount === 1 ? '' : 's'}</span>` : ''}
  </div>`;
}

function releaseBlockedTasks(closedTaskId) {
  getTasksBlockedBy(closedTaskId)
    .filter((task) => task.status === 'backlog')
    .forEach((task) => moveTaskToInProgress(task));
}

function closeTask(task) {
  if (!task || task.status === 'closed') return;

  task.status = 'closed';
  syncReviewReason(task);
  clearWorkTarget(task);

  if (activeSimulatedTaskId === task.id) {
    activeSimulatedTaskId = null;
    assignNextSimulatedTask({ delay: 0 });
  }
  if (pendingCompletionTaskId === task.id) pendingCompletionTaskId = null;

  if (activeTaskId === task.id) {
    const badge = $('#task-status-badge');
    badge.textContent = STATUS_LABELS.closed;
    badge.className = 'status-badge closed';
    renderTaskSidebar();
  }

  releaseBlockedTasks(task.id);
  renderBoard();
}

function moveTaskToInProgress(task) {
  if (!task || task.status === 'in-progress') return;
  const fromReview = task.status === 'review';
  task.status = 'in-progress';
  syncReviewReason(task);

  if (fromReview) {
    restartTaskWork(task);
  } else {
    beginTaskSimulation(task);
    tickInProgressStats();
  }

  if (activeTaskId === task.id) {
    const badge = $('#task-status-badge');
    badge.textContent = STATUS_LABELS['in-progress'];
    badge.className = 'status-badge in-progress';
    renderTaskSidebar();
  }
}

function startTask(taskId) {
  const task = getTask(taskId);
  if (!task) return;
  moveTaskToInProgress(task);
  renderBoard();
  renderTaskSidebar();
}

function startAllColumnTasks(status) {
  tasksForBoard()
    .filter((t) => t.status === status)
    .forEach(moveTaskToInProgress);
  renderBoard();
}

function archiveClosedTasks() {
  const closedIds = new Set(
    tasksForBoard()
      .filter((task) => task.status === 'closed')
      .map((task) => task.id),
  );
  if (closedIds.size === 0) return;

  if (activeTaskId && closedIds.has(activeTaskId)) {
    activeTaskId = null;
    showView('board');
  }

  tasks = tasks.filter((task) => !closedIds.has(task.id));
  renderBoard();
  renderTaskSidebar();
}

function boardColumnSummary() {
  const columns = ['backlog', 'in-progress', 'review', 'closed'];
  return columns
    .map((status) => {
      const count = tasks.filter((t) => t.status === status).length;
      const label = status === 'in-progress' ? 'in-progress' : status;
      return count ? `${label}/ (${count} tasks)` : `${label}/`;
    })
    .join('<br>');
}

function avatarHtml(agent, size = '') {
  return `<span class="avatar ${size}" style="--avatar-bg:${agent.color}">${agent.initials}</span>`;
}

function renderBoardAvatarStack() {
  const stack = $('#board-avatar-stack');
  if (!stack) return;

  const agentIds = new Set();
  tasksForBoardRepo().forEach((task) => {
    if (task.agentId) agentIds.add(task.agentId);
  });

  const agents = AGENTS.filter((agent) => agentIds.has(agent.id));
  stack.classList.toggle('has-filter', Boolean(activeAssignee));
  stack.innerHTML = agents
    .map(
      (agent, index) => `
        <button
          type="button"
          class="avatar-stack-btn${activeAssignee === agent.id ? ' active' : ''}"
          data-agent-id="${agent.id}"
          aria-label="Show tasks assigned to ${escapeHtml(agent.name)}"
          aria-pressed="${activeAssignee === agent.id}"
          title="${escapeHtml(agent.name)}"
          style="--stack-index:${index}"
        >
          <span class="avatar sm" style="--avatar-bg:${agent.color}">${agent.initials}</span>
        </button>`,
    )
    .join('');
}

function githubRepoName(repo) {
  return ({ design: 'kimchi-design', backend: 'kimchi-api', frontend: 'kimchi-web' })[repo] || 'kimchi-studio';
}

function taskPrNumber(task) {
  return 120 + Number.parseInt(task.id.replace(/\D/g, ''), 10);
}

function taskPrTitle(task) {
  const title = task.title.toLowerCase();
  if (title.includes('empty state') || title.includes('onboarding')) {
    return 'proto(budgets): add empty states & onboarding';
  }
  if (title.includes('schema migration') || title.includes('categories')) {
    return 'feat(db): budget categories schema migration';
  }
  if (title.includes('skeleton')) {
    return 'feat(budgets): add budget row loading skeletons';
  }
  if (title.includes('agent picker') || title.includes('icon mismatch')) {
    return 'fix(tasks): align assignee picker icon with card chips';
  }
  if (title.includes('period selector')) {
    return 'feat(budgets): add reusable period selector';
  }
  if (title.includes('openapi')) {
    return 'docs(api): publish budgets OpenAPI contract';
  }
  const scope = task.repo === 'design' ? 'proto' : task.repo === 'backend' ? 'api' : 'budgets';
  const kind = title.includes('fix') ? 'fix' : 'feat';
  return `${kind}(${scope}): ${task.title.toLowerCase()}`;
}

function taskCommitMessages(task) {
  const count = task.commits || 0;
  if (count === 0) return [];

  const messages = [taskPrTitle(task)];
  if (count > 1) {
    messages.push(`test(${task.repo}): cover ${taskBranchSlug(task)}`);
  }
  if (count > 2) {
    messages.push(`chore(${task.repo}): address review feedback`);
  }
  return messages.slice(0, count);
}

function mockCommitHash(task, index) {
  const seed = Number.parseInt(task.id.replace(/\D/g, ''), 10) * 17 + index * 3;
  return (0x1000000 + seed * 0x10411).toString(16).slice(0, 7);
}

function getBoardPullRequests() {
  return tasksForBoard()
    .filter((task) => task.prs > 0)
    .map((task) => {
      const number = taskPrNumber(task);
      const repo = githubRepoName(task.repo);
      return {
        number,
        title: taskPrTitle(task),
        repo,
        status: task.status === 'closed' ? 'merged' : 'open',
        url: `https://github.com/kimchi-studio/${repo}/pull/${number}`,
      };
    })
    .sort((a, b) => b.number - a.number);
}

function getBoardCommits() {
  const commits = [];
  tasksForBoard()
    .filter((task) => task.commits > 0)
    .forEach((task) => {
      const repo = githubRepoName(task.repo);
      taskCommitMessages(task).forEach((message, index) => {
        const hash = mockCommitHash(task, index);
        commits.push({
          hash,
          message,
          repo,
          url: `https://github.com/kimchi-studio/${repo}/commit/${hash}`,
        });
      });
    });
  return commits;
}

function closeWorkspaceStatsMenu() {
  const menu = $('#workspace-stats-menu');
  if (!menu) return;
  menu.hidden = true;
  menu.innerHTML = '';
  workspaceStatsMenuAnchor = null;
  workspaceStatsMenuType = null;
  $('#board-workspace-prs')?.setAttribute('aria-expanded', 'false');
  $('#board-workspace-commits')?.setAttribute('aria-expanded', 'false');
}

function positionWorkspaceStatsMenu(anchor) {
  const menu = $('#workspace-stats-menu');
  const rect = anchor.getBoundingClientRect();
  const menuWidth = menu.offsetWidth || 320;
  const padding = 8;

  let left = rect.right - menuWidth;
  let top = rect.bottom + 6;

  if (left < padding) left = padding;
  if (left + menuWidth > window.innerWidth - padding) {
    left = window.innerWidth - menuWidth - padding;
  }
  if (top + menu.offsetHeight > window.innerHeight - padding) {
    top = rect.top - menu.offsetHeight - 6;
  }

  menu.style.left = `${left}px`;
  menu.style.top = `${Math.max(padding, top)}px`;
}

function openWorkspaceStatsMenu(anchor, type) {
  const menu = $('#workspace-stats-menu');
  if (!menu) return;

  const isSame = !menu.hidden && workspaceStatsMenuAnchor === anchor && workspaceStatsMenuType === type;
  if (isSame) {
    closeWorkspaceStatsMenu();
    return;
  }

  closeAssigneeMenu();
  closeRichSelects();
  closeWorkspaceStatsMenu();

  workspaceStatsMenuAnchor = anchor;
  workspaceStatsMenuType = type;

  if (type === 'prs') {
    const prs = getBoardPullRequests();
    menu.innerHTML = `
      <div class="workspace-stats-menu-header">Pull requests</div>
      <div class="workspace-stats-menu-list">
        ${
          prs.length
            ? prs
                .map(
                  (pr) => `
            <a class="workspace-stats-item" href="${pr.url}" target="_blank" rel="noopener noreferrer" role="menuitem">
              <span class="workspace-stats-item-icon">${iconHtml('git-pull-request', { size: 14, className: 'lucide-icon lucide-teal' })}</span>
              <span class="workspace-stats-item-body">
                <span class="workspace-stats-item-title">${escapeHtml(pr.title)}</span>
                <span class="workspace-stats-item-meta">${escapeHtml(pr.repo)} #${pr.number} · ${pr.status}</span>
              </span>
              <span class="workspace-stats-item-external">${iconHtml('external-link', { size: 12, className: 'lucide-icon lucide-muted' })}</span>
            </a>`,
                )
                .join('')
            : '<div class="workspace-stats-empty">No pull requests</div>'
        }
      </div>`;
  } else {
    const commits = getBoardCommits();
    menu.innerHTML = `
      <div class="workspace-stats-menu-header">Commits</div>
      <div class="workspace-stats-menu-list">
        ${
          commits.length
            ? commits
                .map(
                  (commit) => `
            <a class="workspace-stats-item" href="${commit.url}" target="_blank" rel="noopener noreferrer" role="menuitem">
              <span class="workspace-stats-item-icon">${iconHtml('git-commit', { size: 14, className: 'lucide-icon lucide-muted' })}</span>
              <span class="workspace-stats-item-body">
                <span class="workspace-stats-item-title">${escapeHtml(commit.message)}</span>
                <span class="workspace-stats-item-meta">${escapeHtml(commit.repo)} · ${commit.hash}</span>
              </span>
              <span class="workspace-stats-item-external">${iconHtml('external-link', { size: 12, className: 'lucide-icon lucide-muted' })}</span>
            </a>`,
                )
                .join('')
            : '<div class="workspace-stats-empty">No commits</div>'
        }
      </div>`;
  }

  menu.hidden = false;
  anchor.setAttribute('aria-expanded', 'true');
  initIcons(menu);
  positionWorkspaceStatsMenu(anchor);
}

function initWorkspaceStatsMenus() {
  const prsBtn = $('#board-workspace-prs');
  const commitsBtn = $('#board-workspace-commits');
  const menu = $('#workspace-stats-menu');

  prsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openWorkspaceStatsMenu(prsBtn, 'prs');
  });

  commitsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openWorkspaceStatsMenu(commitsBtn, 'commits');
  });

  document.addEventListener('click', (e) => {
    if (menu?.hidden) return;
    if (e.target.closest('#workspace-stats-menu') || e.target.closest('.workspace-pill-btn')) return;
    closeWorkspaceStatsMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeWorkspaceStatsMenu();
  });

  window.addEventListener('resize', () => {
    if (!menu?.hidden && workspaceStatsMenuAnchor) {
      positionWorkspaceStatsMenu(workspaceStatsMenuAnchor);
    }
  });
}

function aggregateBoardStats() {
  return tasksForBoard().reduce(
    (totals, task) => ({
      files: totals.files + (task.files || 0),
      additions: totals.additions + (task.additions || 0),
      deletions: totals.deletions + (task.deletions || 0),
      prs: totals.prs + (task.prs || 0),
      commits: totals.commits + (task.commits || 0),
    }),
    { files: 0, additions: 0, deletions: 0, prs: 0, commits: 0 },
  );
}

function renderBoardWorkspaceStats() {
  const filesEl = $('#board-workspace-files');
  const prsEl = $('#board-workspace-prs');
  const commitsEl = $('#board-workspace-commits');
  if (!filesEl || !prsEl || !commitsEl) return;

  const stats = aggregateBoardStats();
  const fileLabel = stats.files === 1 ? '1 file' : `${stats.files} files`;
  filesEl.innerHTML = `${fileLabel} <span class="add">+${stats.additions}</span> <span class="del">−${stats.deletions}</span>`;

  const prLabel = stats.prs === 1 ? '1 PR' : `${stats.prs} PRs`;
  prsEl.innerHTML = `${iconHtml('git-pull-request', { size: 12 })} ${prLabel}`;

  const commitLabel = stats.commits === 1 ? '1 commit' : `${stats.commits} commits`;
  commitsEl.innerHTML = `${iconHtml('git-commit', { size: 12 })} ${commitLabel}`;
}

function renderBoardSubheader() {
  closeWorkspaceStatsMenu();
  renderBoardAvatarStack();
  renderBoardWorkspaceStats();
}

function unassignedAvatarHtml(size = '') {
  return `<span class="avatar avatar-unassigned ${size}">${iconHtml('user', { size: 11, className: 'lucide-icon' })}</span>`;
}

function formatTaskAssigneeHtml(task, avatarSize = 'xs') {
  if (!task.agentId) return `${unassignedAvatarHtml(avatarSize)} Unassigned`;
  const agent = getAgent(task.agentId);
  return `${avatarHtml(agent, avatarSize)} ${agent.name}`;
}

function assigneeTriggerHtml(task) {
  const inner = task.agentId ? avatarHtml(getAgent(task.agentId)) : unassignedAvatarHtml();
  return `<button type="button" class="assignee-trigger" data-task-id="${task.id}" aria-label="Assign user" aria-haspopup="listbox">
    ${inner}
  </button>`;
}

function closeAssigneeMenu() {
  const menu = $('#assignee-menu');
  if (!menu) return;
  menu.hidden = true;
  menu.innerHTML = '';
  assigneeMenuTaskId = null;
  assigneeMenuAnchor = null;
}

function positionAssigneeMenu(anchor) {
  const menu = $('#assignee-menu');
  const rect = anchor.getBoundingClientRect();
  const menuWidth = menu.offsetWidth || 220;
  const padding = 8;

  let left = rect.left;
  let top = rect.bottom + 6;

  if (left + menuWidth > window.innerWidth - padding) {
    left = window.innerWidth - menuWidth - padding;
  }
  if (top + menu.offsetHeight > window.innerHeight - padding) {
    top = rect.top - menu.offsetHeight - 6;
  }

  menu.style.left = `${Math.max(padding, left)}px`;
  menu.style.top = `${Math.max(padding, top)}px`;
}

function openAssigneeMenu(anchor, taskId) {
  const task = getTask(taskId);
  if (!task) return;

  const menu = $('#assignee-menu');
  const isSame = !menu.hidden && assigneeMenuTaskId === taskId;

  if (isSame) {
    closeAssigneeMenu();
    return;
  }

  assigneeMenuTaskId = taskId;
  assigneeMenuAnchor = anchor;

  const items = [
    `<button type="button" class="assignee-menu-item${!task.agentId ? ' selected' : ''}" role="option" aria-selected="${!task.agentId}" data-agent-id="">
      ${unassignedAvatarHtml()}
      <span class="assignee-menu-name">Unassigned</span>
      <span class="assignee-menu-check">${iconHtml('check', { size: 14, className: 'lucide-icon' })}</span>
    </button>`,
    ...AGENTS.map((agent) => {
      const selected = agent.id === task.agentId;
      return `<button type="button" class="assignee-menu-item${selected ? ' selected' : ''}" role="option" aria-selected="${selected}" data-agent-id="${agent.id}">
      ${avatarHtml(agent)}
      <span class="assignee-menu-name">${escapeHtml(agent.name)}</span>
      <span class="assignee-menu-check">${iconHtml('check', { size: 14, className: 'lucide-icon' })}</span>
    </button>`;
    }),
  ].join('');

  menu.innerHTML = `
    <div class="assignee-menu-header">Select a user</div>
    <div class="assignee-menu-list">${items}</div>`;
  menu.hidden = false;
  positionAssigneeMenu(anchor);
}

function assignTaskAgent(taskId, agentId) {
  const task = getTask(taskId);
  const nextAgentId = agentId || null;
  if (!task || task.agentId === nextAgentId) {
    closeAssigneeMenu();
    return;
  }

  task.agentId = nextAgentId;
  closeAssigneeMenu();
  renderBoard();

  if (activeTaskId === taskId) {
    $('#task-agent-assignee').innerHTML = formatTaskAssigneeHtml(task);
    renderTaskSidebar();
  }
}

function initAssigneeMenu() {
  const menu = $('#assignee-menu');

  menu.addEventListener('click', (e) => {
    const item = e.target.closest('.assignee-menu-item');
    if (!item || !assigneeMenuTaskId) return;
    e.stopPropagation();
    assignTaskAgent(assigneeMenuTaskId, item.dataset.agentId);
  });

  document.addEventListener('click', (e) => {
    if (menu.hidden) return;
    if (e.target.closest('#assignee-menu') || e.target.closest('.assignee-trigger')) return;
    closeAssigneeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAssigneeMenu();
  });

  window.addEventListener('resize', () => {
    if (!menu.hidden && assigneeMenuAnchor) positionAssigneeMenu(assigneeMenuAnchor);
  });

  document.addEventListener('scroll', () => {
    if (!menu.hidden) closeAssigneeMenu();
  }, true);
}

function uid() {
  return `t${nextId++}`;
}

/* ── Views ── */
function showView(name) {
  $$('.view').forEach((v) => v.classList.remove('active'));
  $(`#view-${name}`).classList.add('active');
}

function getKimchiWorkspaceStats() {
  const agentIds = new Set();
  tasks.forEach((task) => {
    if (task.agentId) agentIds.add(task.agentId);
  });
  const memberCount = Math.max(agentIds.size, 4);
  const repos = WORKSPACES.find((workspace) => workspace.id === 'kimchi')?.repos || 3;
  const openPrs = tasks
    .filter((task) => task.status === 'in-progress' || task.status === 'review')
    .reduce((sum, task) => sum + (task.prs || 0), 0);

  return {
    backlog: tasks.filter((t) => t.status === 'backlog').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    review: tasks.filter((t) => t.status === 'review').length,
    closed: tasks.filter((t) => t.status === 'closed').length,
    commits: tasks.reduce((sum, t) => sum + (t.commits || 0), 0),
    prs: Math.max(openPrs, memberCount * 3 + 1),
    agents: agentIds.size,
    cost: workspaceDailyCostBase(memberCount, repos) * 30,
  };
}

function getKimchiWorkspaceMembers() {
  const agentIds = new Set();
  tasks.forEach((task) => {
    if (task.agentId) agentIds.add(task.agentId);
  });
  return AGENTS.filter((agent) => agentIds.has(agent.id));
}

function buildKimchiWorkspaceHistory() {
  const stats = getKimchiWorkspaceStats();
  const memberCount = Math.max(getKimchiWorkspaceMembers().length, 4);
  const repos = WORKSPACES.find((workspace) => workspace.id === 'kimchi')?.repos || 3;
  const history = workspaceHistorySeed('kimchi', { memberCount, repos });

  const liveTotal = Math.max(
    stats.backlog + stats.inProgress + stats.review + stats.closed,
    1,
  );
  const dayTotal = history.tasks[6].backlog + history.tasks[6].inProgress
    + history.tasks[6].review + history.tasks[6].closed;

  history.tasks[6] = {
    backlog: Math.max(1, Math.round(dayTotal * stats.backlog / liveTotal)),
    inProgress: Math.max(0, Math.round(dayTotal * stats.inProgress / liveTotal)),
    review: Math.max(0, Math.round(dayTotal * stats.review / liveTotal)),
    closed: 0,
  };
  history.tasks[6].closed = Math.max(
    0,
    dayTotal - history.tasks[6].backlog - history.tasks[6].inProgress - history.tasks[6].review,
  );

  history.costs[6] = Math.round(workspaceDailyCostBase(memberCount, repos) * 1.04);
  history.prs[6] = Math.max(stats.prs, history.prs[6]);
  history.commits[6] = Math.max(
    stats.commits,
    history.commits[6],
    memberCount * 14 + repos * 6,
  );
  return history;
}

function getWorkspaceCardData(workspace) {
  if (workspace.live) {
    const stats = getKimchiWorkspaceStats();
    return {
      repos: workspace.repos,
      openPrs: stats.prs,
      avgDailyCost: stats.cost / 30,
      members: getKimchiWorkspaceMembers(),
      history: withWeekendDip(buildKimchiWorkspaceHistory()),
      stats,
    };
  }

  const history = withWeekendDip(workspace.history);
  return {
    repos: workspace.repos,
    openPrs: workspace.openPrs,
    avgDailyCost: workspace.avgDailyCost,
    members: AGENTS.filter((agent) => workspace.members.includes(agent.id)),
    history,
    stats: {
      backlog: history.tasks[6].backlog,
      inProgress: history.tasks[6].inProgress,
      review: history.tasks[6].review,
      closed: history.tasks[6].closed,
      commits: history.commits.reduce((sum, n) => sum + n, 0),
      prs: workspace.openPrs,
      agents: workspace.members.length,
      cost: workspace.avgDailyCost * 30,
    },
  };
}

function last7DayLabels() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const labels = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(days[date.getDay()]);
  }
  return labels;
}

function last7DayWeekendFlags() {
  const flags = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const day = date.getDay();
    flags.push(day === 0 || day === 6);
  }
  return flags;
}

function weekendTaskDay(day) {
  return {
    backlog: Math.min(Math.round(day.backlog * 0.03), 2),
    inProgress: 0,
    review: 0,
    closed: 0,
  };
}

function withWeekendDip(history) {
  const weekend = last7DayWeekendFlags();
  return {
    tasks: history.tasks.map((day, index) => (
      weekend[index] ? weekendTaskDay(day) : day
    )),
    costs: history.costs.map((cost, index) => (
      weekend[index] ? Math.min(35, Math.round(cost * 0.012)) : cost
    )),
    prs: history.prs.map((value, index) => (weekend[index] ? 0 : value)),
    commits: history.commits.map((value, index) => (weekend[index] ? 0 : value)),
  };
}

function formatWorkspaceCost(cost) {
  if (cost === 0) return '$0';
  if (cost < 1) return `$${cost.toFixed(1)}`;
  if (cost < 10) return `$${cost.toFixed(2)}`;
  return `$${Math.round(cost).toLocaleString()}`;
}

function workspaceMembersHtml(members) {
  if (!members.length) {
    return '<span class="workspace-card-members-empty">No members</span>';
  }

  return `
    <div class="workspace-card-members">
      ${members.map((agent) => avatarHtml(agent, 'sm')).join('')}
    </div>`;
}

function formatWorkspaceChartYValue(value, chartType) {
  if (chartType === 'costs') {
    if (value === 0) return '$0';
    if (value < 10 && !Number.isInteger(value)) return `$${value.toFixed(1)}`;
    return `$${Math.round(value)}`;
  }
  return String(Math.round(value));
}

function computeWorkspaceChartYAxis(dataMax) {
  const max = Math.max(dataMax, 1);
  const rawStep = max / 3;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  let niceStep;
  if (normalized <= 1) niceStep = magnitude;
  else if (normalized <= 2) niceStep = 2 * magnitude;
  else if (normalized <= 5) niceStep = 5 * magnitude;
  else niceStep = 10 * magnitude;

  const yMax = Math.ceil(max / niceStep) * niceStep;
  const ticks = [];
  for (let value = 0; value <= yMax + 1e-9; value += niceStep) {
    ticks.push(value);
  }
  return { ticks, yMax };
}

function renderWorkspaceChartYAxis(layout) {
  const {
    ticks, yMax, padLeft, padTop, chartH, width, padRight, chartType,
  } = layout;

  return ticks.map((tick) => {
    const y = padTop + chartH - (tick / yMax) * chartH;
    return `
      <line class="workspace-chart-grid-line" x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" />
      <text x="${padLeft - 3}" y="${y + 3}" text-anchor="end" class="workspace-chart-y-label">${formatWorkspaceChartYValue(tick, chartType)}</text>`;
  }).join('');
}

function workspaceChartPadLeft(ticks, chartType) {
  const widest = ticks.reduce((longest, tick) => {
    const label = formatWorkspaceChartYValue(tick, chartType);
    return label.length > longest.length ? label : longest;
  }, '0');
  return Math.ceil(widest.length * 5.5) + 5;
}

const CHART_BAR_RADIUS = 2;

function workspaceChartBarShape(x, y, w, h, { roundTop = false, fill, opacity } = {}) {
  const attrs = [
    fill ? `fill="${fill}"` : '',
    opacity != null ? `opacity="${opacity}"` : '',
  ].filter(Boolean).join(' ');

  if (!roundTop || h <= 0) {
    return `<rect class="workspace-chart-bar" x="${x}" y="${y}" width="${w}" height="${h}" ${attrs} />`;
  }

  const r = Math.min(CHART_BAR_RADIUS, w / 2, h);
  if (r <= 0) {
    return `<rect class="workspace-chart-bar" x="${x}" y="${y}" width="${w}" height="${h}" ${attrs} />`;
  }

  const d = [
    `M ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `H ${x + w - r}`,
    `Q ${x + w} ${y} ${x + w} ${y + r}`,
    `V ${y + h}`,
    `H ${x}`,
    'Z',
  ].join(' ');

  return `<path class="workspace-chart-bar" d="${d}" ${attrs} />`;
}

function renderWorkspaceChartSvg(history, chartType) {
  const width = 320;
  const height = 112;
  const padRight = 6;
  const padTop = 6;
  const padBottom = 20;

  let dataMax;
  if (chartType === 'tasks') {
    dataMax = Math.max(
      ...history.tasks.map((day) => day.backlog + day.inProgress + day.review + day.closed),
      1,
    );
  } else {
    dataMax = Math.max(...history[chartType], 1);
  }

  const { ticks, yMax } = computeWorkspaceChartYAxis(dataMax);
  const padLeft = workspaceChartPadLeft(ticks, chartType);
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const labels = last7DayLabels();
  const slot = chartW / labels.length;
  const barInset = Math.min(4, slot * 0.12);
  const barW = Math.max(8, slot - barInset * 2);

  const layout = {
    ticks, yMax, padLeft, padTop, chartH, width, padRight, chartType,
  };
  const yAxis = renderWorkspaceChartYAxis(layout);

  const axis = labels.map((label, index) => {
    const x = padLeft + slot * index + slot / 2;
    return `<text x="${x}" y="${height - 5}" text-anchor="middle" class="workspace-chart-label">${label}</text>`;
  }).join('');
  const hitAreas = labels.map((label, index) => {
    const x = padLeft + slot * index;
    return `<rect class="workspace-chart-hit" x="${x}" y="${padTop}" width="${slot}" height="${chartH}" data-day-index="${index}" aria-label="${label}" />`;
  }).join('');

  if (chartType === 'tasks') {
    const bars = history.tasks.map((day, index) => {
      const x = padLeft + slot * index + barInset;
      let y = padTop + chartH;
      const segments = [
        ['backlog', day.backlog],
        ['inProgress', day.inProgress],
        ['review', day.review],
        ['closed', day.closed],
      ].filter(([, value]) => value > 0);

      return segments.map(([key, value], segIndex) => {
        const h = (value / yMax) * chartH;
        y -= h;
        return workspaceChartBarShape(x, y, barW, h, {
          roundTop: segIndex === segments.length - 1,
          fill: WORKSPACE_STATUS_COLORS[key],
        });
      }).join('');
    }).join('');

    return `
      <svg class="workspace-chart-svg" viewBox="0 0 ${width} ${height}" aria-hidden="true">
        ${yAxis}
        ${bars}
        ${axis}
        ${hitAreas}
      </svg>`;
  }

  const series = history[chartType];
  const barColor = {
    costs: '#f97316',
    prs: '#2dd4bf',
    commits: '#818cf8',
  }[chartType];

  const bars = series.map((value, index) => {
    const x = padLeft + slot * index + barInset;
    const h = (value / yMax) * chartH;
    const y = padTop + chartH - h;
    return workspaceChartBarShape(x, y, barW, h, {
      roundTop: true,
      fill: barColor,
      opacity: 0.9,
    });
  }).join('');

  return `
    <svg class="workspace-chart-svg" viewBox="0 0 ${width} ${height}" aria-hidden="true">
      ${yAxis}
      ${bars}
      ${axis}
      ${hitAreas}
    </svg>`;
}

function getWorkspaceChartTooltipPayload(workspaceId, chartType, dayIndex) {
  const workspace = WORKSPACES.find((item) => item.id === workspaceId);
  if (!workspace) return null;

  const { history } = getWorkspaceCardData(workspace);
  const title = last7DayLabels()[dayIndex];

  if (chartType === 'tasks') {
    const day = history.tasks[dayIndex];
    const rows = [
      { key: 'backlog', label: 'Backlog', value: day.backlog },
      { key: 'inProgress', label: 'In progress', value: day.inProgress },
      { key: 'review', label: 'Review', value: day.review },
      { key: 'closed', label: 'Closed', value: day.closed },
    ]
      .filter((row) => row.value > 0)
      .map((row) => ({
        label: row.label,
        value: String(row.value),
        color: WORKSPACE_STATUS_COLORS[row.key],
      }));

    return {
      title,
      rows,
      total: String(day.backlog + day.inProgress + day.review + day.closed),
    };
  }

  const value = history[chartType][dayIndex];
  const meta = {
    costs: { label: 'Cost', color: '#f97316', format: formatWorkspaceCost },
    prs: { label: 'PRs', color: '#2dd4bf' },
    commits: { label: 'Commits', color: '#818cf8' },
  }[chartType];

  return {
    title,
    rows: [{
      label: meta.label,
      value: meta.format ? meta.format(value) : String(value),
      color: meta.color,
    }],
  };
}

function workspaceChartTooltipHtml(payload) {
  const rows = payload.rows.map((row) => `
    <div class="workspace-chart-tooltip-row">
      <span class="workspace-chart-tooltip-swatch" style="background:${row.color}"></span>
      <span class="workspace-chart-tooltip-label">${escapeHtml(row.label)}</span>
      <span class="workspace-chart-tooltip-value">${escapeHtml(row.value)}</span>
    </div>`).join('');

  return `
    <div class="workspace-chart-tooltip-title">${escapeHtml(payload.title)}</div>
    <div class="workspace-chart-tooltip-rows">${rows}</div>
    ${payload.total != null ? `<div class="workspace-chart-tooltip-total">Total <strong>${escapeHtml(payload.total)}</strong></div>` : ''}`;
}

function ensureWorkspaceChartTooltip() {
  let tooltip = $('#workspace-chart-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'workspace-chart-tooltip';
    tooltip.className = 'workspace-chart-tooltip';
    tooltip.hidden = true;
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function hideWorkspaceChartTooltip() {
  const tooltip = $('#workspace-chart-tooltip');
  if (tooltip) tooltip.hidden = true;
}

function positionWorkspaceChartTooltip(clientX, clientY) {
  const tooltip = ensureWorkspaceChartTooltip();
  const rect = tooltip.getBoundingClientRect();
  let left = clientX + 12;
  let top = clientY - rect.height - 12;

  left = Math.max(8, Math.min(left, window.innerWidth - rect.width - 8));
  if (top < 8) top = clientY + 12;

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function showWorkspaceChartTooltip(hit, clientX, clientY) {
  const card = hit.closest('.workspace-card');
  const body = hit.closest('[data-chart-body]');
  if (!card || !body) return;

  const dayIndex = Number.parseInt(hit.dataset.dayIndex, 10);
  const chartType = body.dataset.chartType || card.dataset.chart || 'tasks';
  const payload = getWorkspaceChartTooltipPayload(card.dataset.workspaceId, chartType, dayIndex);
  if (!payload || !payload.rows.length) {
    hideWorkspaceChartTooltip();
    return;
  }

  const tooltip = ensureWorkspaceChartTooltip();
  tooltip.innerHTML = workspaceChartTooltipHtml(payload);
  tooltip.hidden = false;
  positionWorkspaceChartTooltip(clientX, clientY);
}

function initWorkspaceChartTooltips() {
  const grid = $('#workspaces-grid');
  if (!grid) return;

  grid.addEventListener('mousemove', (e) => {
    const hit = e.target.closest('.workspace-chart-hit');
    if (!hit) {
      hideWorkspaceChartTooltip();
      return;
    }
    showWorkspaceChartTooltip(hit, e.clientX, e.clientY);
  });

  grid.addEventListener('mouseleave', (e) => {
    if (!e.relatedTarget?.closest?.('.workspace-chart-body')) {
      hideWorkspaceChartTooltip();
    }
  });
}

function workspaceCardHtml(workspace) {
  const card = getWorkspaceCardData(workspace);
  const chartType = activeWorkspaceChartTab;

  return `
    <article class="workspace-card" data-workspace-id="${workspace.id}" data-chart="${chartType}">
      <div class="workspace-card-top">
        <div class="workspace-card-heading">
          <h3 class="workspace-card-name">${escapeHtml(workspace.name)}</h3>
          <p class="workspace-card-repo">${escapeHtml(workspace.repository)}</p>
        </div>
        ${workspaceMembersHtml(card.members)}
      </div>
      <div class="workspace-card-metrics">
        <span><strong>${card.repos}</strong> repos</span>
        <span><strong>${card.openPrs}</strong> open PRs</span>
        <span><strong>${formatWorkspaceCost(card.avgDailyCost)}</strong> avg daily cost</span>
      </div>
      <div class="workspace-card-chart">
        <div class="workspace-chart-tabs" role="tablist" aria-label="${escapeHtml(workspace.name)} chart">
          ${WORKSPACE_CHART_TABS.map((tab) => `
            <button
              type="button"
              class="workspace-chart-tab${tab.id === chartType ? ' active' : ''}"
              data-chart="${tab.id}"
              role="tab"
              aria-selected="${tab.id === chartType}"
            >${tab.label}</button>`).join('')}
        </div>
        <div class="workspace-chart-body" data-chart-body data-chart-type="${chartType}">
          ${renderWorkspaceChartSvg(card.history, chartType)}
        </div>
        <div class="workspace-chart-legend" aria-hidden="${chartType !== 'tasks'}">
          <span><i class="legend-swatch backlog"></i>Backlog</span>
          <span><i class="legend-swatch in-progress"></i>In progress</span>
          <span><i class="legend-swatch review"></i>Review</span>
          <span><i class="legend-swatch closed"></i>Closed</span>
        </div>
      </div>
    </article>`;
}

function aggregateWorkspaceOverview() {
  const rows = WORKSPACES.map((workspace) => getWorkspaceCardData(workspace));
  return {
    workspaces: WORKSPACES.length,
    activeAgents: rows.reduce((sum, row) => sum + row.members.length, 0),
    activeAgentsDelta: 2,
    avgDailyPrs: rows.reduce((sum, row) => {
      const dailyAvg = row.history.prs.reduce((total, value) => total + value, 0) / row.history.prs.length;
      return sum + dailyAvg;
    }, 0),
    avgDailyCost: rows.reduce((sum, row) => sum + row.avgDailyCost, 0),
  };
}

function applyWorkspaceChartTabToCard(card, chartType) {
  const workspace = WORKSPACES.find((item) => item.id === card.dataset.workspaceId);
  if (!workspace) return;

  card.dataset.chart = chartType;
  card.querySelectorAll('.workspace-chart-tab').forEach((tab) => {
    const active = tab.dataset.chart === chartType;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  const body = card.querySelector('[data-chart-body]');
  const legend = card.querySelector('.workspace-chart-legend');
  const history = getWorkspaceCardData(workspace).history;
  if (body) {
    body.dataset.chartType = chartType;
    body.innerHTML = renderWorkspaceChartSvg(history, chartType);
  }

  if (legend) {
    legend.setAttribute('aria-hidden', String(chartType !== 'tasks'));
  }
}

function setWorkspaceChartTab(chartType) {
  if (!WORKSPACE_CHART_TABS.some((tab) => tab.id === chartType)) return;
  activeWorkspaceChartTab = chartType;
  hideWorkspaceChartTooltip();
  $$('#workspaces-grid .workspace-card').forEach((card) => {
    applyWorkspaceChartTabToCard(card, chartType);
  });
}

function switchWorkspaceChartTab(_card, chartType) {
  setWorkspaceChartTab(chartType);
}

function renderWorkspacesPage() {
  hideWorkspaceChartTooltip();
  const overview = aggregateWorkspaceOverview();
  const statsEl = $('#workspaces-stats');
  const grid = $('#workspaces-grid');

  if (statsEl) {
    statsEl.innerHTML = `
      <div class="workspaces-stat-card">
        <div class="workspaces-stat-label">Workspaces</div>
        <div class="workspaces-stat-value">${overview.workspaces}</div>
      </div>
      <div class="workspaces-stat-card">
        <div class="workspaces-stat-label">Active agents</div>
        <div class="workspaces-stat-value">${overview.activeAgents}</div>
        <div class="workspaces-stat-delta">↑ +${overview.activeAgentsDelta}</div>
      </div>
      <div class="workspaces-stat-card">
        <div class="workspaces-stat-label">Avg daily PRs</div>
        <div class="workspaces-stat-value">${Math.round(overview.avgDailyPrs)}</div>
      </div>
      <div class="workspaces-stat-card">
        <div class="workspaces-stat-label">Avg daily cost</div>
        <div class="workspaces-stat-value">${formatWorkspaceCost(overview.avgDailyCost)}</div>
      </div>`;
  }

  if (grid) {
    grid.innerHTML = WORKSPACES.map((workspace) => workspaceCardHtml(workspace)).join('');
  }
}

function openWorkspacesOverview() {
  activeTaskId = null;
  renderWorkspacesPage();
  showView('workspaces');
}

function openWorkspace(workspaceId) {
  const workspace = WORKSPACES.find((item) => item.id === workspaceId);
  if (!workspace) return;

  activeWorkspaceId = workspace.id;
  activeRepo = 'all';
  activeAssignee = null;

  const nameEl = $('#breadcrumb-workspace-name');
  if (nameEl) nameEl.textContent = workspace.name;

  showView('board');
  renderBoard();
}

function openTaskDetail(taskId) {
  taskWorkRunId += 1;
  stopThinkingBar();

  activeTaskId = taskId;
  activeDiffFileIndex = 0;
  taskSidebarRepo = activeRepo;
  const task = getTask(taskId);
  if (!task) return;

  $('#task-detail-title').textContent = task.title;
  const badge = $('#task-status-badge');
  badge.textContent = STATUS_LABELS[task.status];
  badge.className = `status-badge ${task.status}`;

  $('#task-agent-assignee').innerHTML = formatTaskAssigneeHtml(task);

  updateTaskDetailLayout(task);
  renderTaskSidebar();
  if (task.status !== 'backlog') {
    renderTaskChat();
    renderDiff();
  }
  showView('task');

  if (task.status === 'in-progress' && !task.workSimulated && task.chat.length === 0) {
    runTaskAgentWork(task);
  } else if (task.status === 'review' && !task.workSimulated && task.chat.length === 0) {
    runTaskAgentWork(task);
  }
}

function populateTaskSetupForm(task) {
  $('#task-setup-description').value = task.description || task.title;
  setRichSelectValue(
    $('#task-setup-permissions-select'),
    PERMISSION_MODES,
    task.permissionMode || 'yolo',
  );
  setRichSelectValue(
    $('#task-setup-model-select'),
    MODEL_OPTIONS,
    task.model || 'multi',
  );
}

function applyTaskSetupForm(task) {
  const form = $('#task-setup-form');
  const fd = new FormData(form);
  const description = $('#task-setup-description').value.trim();
  if (description) {
    task.description = description;
    task.title = description.split('\n')[0].trim() || description;
  }
  task.permissionMode = fd.get('permissions');
  task.model = fd.get('model');
}

function updateTaskDetailLayout(task) {
  const isBacklog = task.status === 'backlog';
  $('#view-task').classList.toggle('task-detail--backlog', isBacklog);
  $('#task-setup-panel').hidden = !isBacklog;
  $('#task-agent-active').hidden = isBacklog;
  $('#work-panel-empty').hidden = !isBacklog;
  $('#work-panel-active').hidden = isBacklog;
  $('#task-agent-panel-title').textContent = isBacklog ? 'Task setup' : 'Task agent';

  if (isBacklog) {
    populateTaskSetupForm(task);
    $('#task-chat-messages').innerHTML = '';
  }
}

function startTaskFromDetailSetup(e) {
  e.preventDefault();
  const task = getTask(activeTaskId);
  if (!task || task.status !== 'backlog') return;

  applyTaskSetupForm(task);
  $('#task-detail-title').textContent = task.title;
  moveTaskToInProgress(task);
  renderBoard();
  updateTaskDetailLayout(task);
  renderTaskChat();
  renderDiff();
  if (!task.workSimulated && task.chat.length === 0) {
    runTaskAgentWork(task);
  }
}

function initTaskSetup() {
  $('#task-setup-form').addEventListener('submit', startTaskFromDetailSetup);
}

/* ── Render Kanban ── */
function renderBoard() {
  closeAssigneeMenu();
  const columns = ['backlog', 'in-progress', 'review', 'closed'];

  columns.forEach((status) => {
    const body = $(`.column-body[data-drop="${status}"]`);
    const createBtn = body.querySelector('.create-task-btn');
    body.querySelectorAll('.task-card').forEach((c) => c.remove());

    const statusTasks = tasksForBoard().filter((t) => t.status === status);
    $(`[data-count="${status}"]`).textContent = statusTasks.length;

    statusTasks.forEach((task) => {
      const card = createTaskCard(task);
      if (createBtn) {
        body.insertBefore(card, createBtn);
      } else {
        body.appendChild(card);
      }
    });
  });

  renderBoardSubheader();
  requestAnimationFrame(() => renderTaskLinks());
}

function getTaskCardElement(taskId) {
  if (dragState?.taskId === taskId) return dragState.ghost;
  return document.querySelector(`.task-card[data-id="${taskId}"]`);
}

function getCardAnchor(card, side) {
  const wrap = $('.kanban-board-wrap');
  const cardRect = card.getBoundingClientRect();
  const wrapRect = wrap.getBoundingClientRect();
  return {
    x: (side === 'right' ? cardRect.right : cardRect.left) - wrapRect.left,
    y: cardRect.top - wrapRect.top + cardRect.height / 2,
  };
}

function getLinkAnchors(blockerCard, blockedCard) {
  const blockerCol = blockerCard.closest('.column-body')?.dataset.drop;
  const blockedCol = blockedCard.closest('.column-body')?.dataset.drop;

  if (blockerCol && blockerCol === blockedCol) {
    return {
      start: getCardAnchor(blockerCard, 'right'),
      end: getCardAnchor(blockedCard, 'right'),
    };
  }

  const blockerRect = blockerCard.getBoundingClientRect();
  const blockedRect = blockedCard.getBoundingClientRect();
  const blockerCenter = blockerRect.left + blockerRect.width / 2;
  const blockedCenter = blockedRect.left + blockedRect.width / 2;

  if (blockerCenter <= blockedCenter) {
    return {
      start: getCardAnchor(blockerCard, 'right'),
      end: getCardAnchor(blockedCard, 'left'),
    };
  }
  return {
    start: getCardAnchor(blockerCard, 'left'),
    end: getCardAnchor(blockedCard, 'right'),
  };
}

function taskLinkControls(start, end, sameColumn = false) {
  if (sameColumn) {
    const midX = Math.max(start.x, end.x) + 14;
    return {
      p0: start,
      p1: { x: midX, y: start.y },
      p2: { x: midX, y: end.y },
      p3: end,
    };
  }
  const dx = end.x - start.x;
  return {
    p0: start,
    p1: { x: start.x + dx * 0.42, y: start.y },
    p2: { x: end.x - dx * 0.42, y: end.y },
    p3: end,
  };
}

function taskLinkPathFromControls({ p0, p1, p2, p3 }) {
  return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
}

function cubicBezierPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return {
    x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
    y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
  };
}

function taskLinkEndTangent(controls) {
  const nearEnd = cubicBezierPoint(controls.p0, controls.p1, controls.p2, controls.p3, 0.96);
  const end = controls.p3;
  return Math.atan2(end.y - nearEnd.y, end.x - nearEnd.x);
}

function taskLinkPath(start, end, sameColumn = false) {
  return taskLinkPathFromControls(taskLinkControls(start, end, sameColumn));
}

function appendArrowHeadPath(layer, x, y, angle, headLen = 4.5, halfWidth = 4) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const tipX = x + headLen * cos;
  const tipY = y + headLen * sin;
  const perpX = -sin * halfWidth;
  const perpY = cos * halfWidth;
  const head = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  head.setAttribute(
    'd',
    `M ${x + perpX} ${y + perpY} L ${tipX} ${tipY} L ${x - perpX} ${y - perpY}`,
  );
  head.setAttribute('class', 'task-link-arrowhead');
  layer.appendChild(head);
}

function renderTaskLinks() {
  const layer = $('#task-links-layer');
  const wrap = $('.kanban-board-wrap');
  if (!layer || !wrap) return;

  layer.replaceChildren();

  if (activeRepo !== 'all') {
    layer.hidden = true;
    return;
  }

  const w = wrap.clientWidth;
  const h = wrap.clientHeight;
  if (!w || !h) return;

  layer.hidden = false;
  layer.setAttribute('width', String(w));
  layer.setAttribute('height', String(h));
  layer.setAttribute('viewBox', `0 0 ${w} ${h}`);

  tasks.forEach((task) => {
    if (!task.blockedBy) return;

    const blockedCard = getTaskCardElement(task.id);
    const blockerCard = getTaskCardElement(task.blockedBy);
    if (!blockedCard || !blockerCard) return;

    const { start, end } = getLinkAnchors(blockerCard, blockedCard);
    const sameColumn = blockerCard.closest('.column-body') === blockedCard.closest('.column-body');
    const controls = taskLinkControls(start, end, sameColumn);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', taskLinkPathFromControls(controls));
    path.setAttribute('class', 'task-link-path');
    layer.appendChild(path);
    appendArrowHeadPath(layer, end.x, end.y, taskLinkEndTangent(controls));
  });
}

function scheduleLinkUpdate() {
  if (linkRafPending) return;
  linkRafPending = true;
  requestAnimationFrame(() => {
    linkRafPending = false;
    if (dragState) renderTaskLinks();
  });
}

let dropIndicatorEl = null;

function getDropIndicator() {
  if (!dropIndicatorEl) {
    dropIndicatorEl = document.createElement('div');
    dropIndicatorEl.className = 'drop-indicator';
    dropIndicatorEl.hidden = true;
    document.body.appendChild(dropIndicatorEl);
  }
  return dropIndicatorEl;
}

function hideDropIndicator() {
  if (dropIndicatorEl) dropIndicatorEl.hidden = true;
}

function getDropTarget(clientX, clientY) {
  const col = document.elementFromPoint(clientX, clientY)?.closest('.column-body');
  if (!col) return null;

  const cards = [...col.querySelectorAll('.task-card:not(.drag-origin)')];
  let insertIndex = cards.length;

  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) {
      insertIndex = i;
      break;
    }
  }

  return {
    col,
    status: col.dataset.drop,
    insertIndex,
    cards,
    createBtn: col.querySelector('.create-task-btn'),
  };
}

function updateDropIndicator(clientX, clientY) {
  const indicator = getDropIndicator();
  const target = getDropTarget(clientX, clientY);

  if (dragState) dragState.dropTarget = target;

  if (!target) {
    indicator.hidden = true;
    return;
  }

  const { col, insertIndex, cards, createBtn } = target;
  const colRect = col.getBoundingClientRect();
  const inset = 8;
  const gapHalf = 4;
  let y;

  if (cards.length === 0) {
    y = colRect.top + inset;
  } else if (insertIndex < cards.length) {
    y = cards[insertIndex].getBoundingClientRect().top - gapHalf;
  } else if (createBtn) {
    y = createBtn.getBoundingClientRect().top - gapHalf;
  } else {
    y = cards[cards.length - 1].getBoundingClientRect().bottom + gapHalf;
  }

  indicator.hidden = false;
  indicator.style.left = `${colRect.left + inset}px`;
  indicator.style.width = `${colRect.width - inset * 2}px`;
  indicator.style.top = `${y}px`;
}

function insertTaskAtColumnPosition(task, status, insertIndex) {
  const taskIdx = tasks.findIndex((t) => t.id === task.id);
  if (taskIdx === -1) return;

  tasks.splice(taskIdx, 1);
  task.status = status;

  const column = tasksForBoard().filter((t) => t.status === status);
  const idx = Math.max(0, Math.min(insertIndex, column.length));

  if (column.length === 0) {
    tasks.push(task);
    return;
  }

  if (idx >= column.length) {
    const anchorIdx = tasks.findIndex((t) => t.id === column[column.length - 1].id);
    tasks.splice(anchorIdx + 1, 0, task);
    return;
  }

  const anchorIdx = tasks.findIndex((t) => t.id === column[idx].id);
  tasks.splice(anchorIdx, 0, task);
}

function beginCardDrag(card, task, e) {
  closeAssigneeMenu();
  const rect = card.getBoundingClientRect();
  const ghost = card.cloneNode(true);
  ghost.classList.add('task-card-ghost');
  ghost.style.width = `${rect.width}px`;
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  document.body.appendChild(ghost);

  card.classList.add('drag-origin');
  document.body.classList.add('is-dragging-card');

  dragState = {
    taskId: task.id,
    card,
    ghost,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top,
  };

  positionDragGhost(e);
  scheduleLinkUpdate();
}

function positionDragGhost(e) {
  if (!dragState) return;
  const { ghost, offsetX, offsetY } = dragState;
  ghost.style.left = `${e.clientX - offsetX}px`;
  ghost.style.top = `${e.clientY - offsetY}px`;
}

function cleanupCardDrag() {
  if (!dragState) return;
  dragState.ghost.remove();
  dragState.card.classList.remove('drag-origin');
  dragState = null;
  document.body.classList.remove('is-dragging-card');
  hideDropIndicator();
}

function endCardDrag(e) {
  const taskId = dragState?.taskId;
  const dropTarget = dragState?.dropTarget;
  cleanupCardDrag();

  if (!taskId || !dropTarget) {
    renderBoard();
    return;
  }

  const task = getTask(taskId);
  if (!task) return;

  const { status, insertIndex } = dropTarget;
  const oldStatus = task.status;

  insertTaskAtColumnPosition(task, status, insertIndex);

  if (oldStatus !== status) {
    syncReviewReason(task);
    if (status === 'in-progress') {
      if (oldStatus === 'review') {
        restartTaskWork(task);
      } else {
        beginTaskSimulation(task);
        tickInProgressStats();
      }
    } else {
      if (oldStatus === 'in-progress') {
        if (activeSimulatedTaskId === task.id) activeSimulatedTaskId = null;
        if (pendingCompletionTaskId === task.id) pendingCompletionTaskId = null;
        assignNextSimulatedTask({ delay: 0 });
      }
      clearWorkTarget(task);
      if (status === 'closed') releaseBlockedTasks(task.id);
    }
    if (activeTaskId === taskId) {
      const badge = $('#task-status-badge');
      badge.textContent = STATUS_LABELS[status];
      badge.className = `status-badge ${status}`;
      renderTaskSidebar();
    }
  }

  renderBoard();
}

function initCardDrag(card, task) {
  let startX = 0;
  let startY = 0;
  let dragging = false;

  const onPointerMove = (e) => {
    if (!dragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.hypot(dx, dy) < 6) return;
      dragging = true;
      beginCardDrag(card, task, e);
    }
    if (!dragState) return;
    positionDragGhost(e);
    updateDropIndicator(e.clientX, e.clientY);
    scheduleLinkUpdate();
  };

  const onPointerUp = (e) => {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerUp);

    if (dragging) {
      endCardDrag(e);
    } else {
      openTaskDetail(task.id);
    }
  };

  card.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.assignee-trigger')) return;
    if (e.target.closest('.task-card-play')) return;

    startX = e.clientX;
    startY = e.clientY;
    dragging = false;

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
  });
}

function initTaskLinks() {
  const wrap = $('.kanban-board-wrap');
  const board = $('#kanban-board');
  if (!wrap) return;

  window.addEventListener('resize', () => renderTaskLinks());
  board?.addEventListener('scroll', () => renderTaskLinks());
  $$('.column-body').forEach((col) => {
    col.addEventListener('scroll', () => renderTaskLinks());
  });
}

function createTaskCard(task) {
  const isClosed = task.status === 'closed';
  const isInProgress = task.status === 'in-progress';
  const isReview = task.status === 'review';
  const hasMeta = task.prs > 0 || task.commits > 0;
  const reviewMeta = isReview ? getReviewReasonMeta(task) : null;

  const card = document.createElement('div');
  card.className = `task-card${isClosed ? ' closed' : ''}${isReview ? ` review-${task.reviewReason}` : ''}`;
  card.dataset.id = task.id;

  let icon = '';
  if (isClosed) {
    icon = `<span class="task-card-icon">${iconHtml('check-check', { size: 14, className: 'lucide-icon lucide-teal' })}</span>`;
  } else if (isInProgress) {
    icon = `<span class="task-card-icon">${iconHtml('loader', { size: 14, className: 'lucide-icon lucide-spin' })}</span>`;
  } else if (isReview && reviewMeta) {
    icon = `<span class="task-card-icon">${iconHtml(reviewMeta.icon, { size: 14, className: `lucide-icon ${reviewMeta.iconClass}` })}</span>`;
  }

  let meta = '';
  if (hasMeta) {
    meta = `<div class="task-card-meta">
      ${task.prs ? `<span class="meta-pr">${iconHtml('git-pull-request', { size: 11, className: 'meta-icon' })} ${task.prs} PR</span>` : ''}
      ${task.commits ? `<span class="meta-commit">${iconHtml('git-commit', { size: 11, className: 'meta-icon' })} ${task.commits} commit${task.commits > 1 ? 's' : ''}</span>` : ''}
    </div>`;
  }

  card.innerHTML = `
    <div class="task-card-header">
      <div class="task-card-title">${escapeHtml(task.title)}</div>
      ${icon}
    </div>
    ${taskCardTagsHtml(task)}
    ${isReview ? reviewStatusCardHtml(task) : ''}
    <div class="task-card-footer">
      ${assigneeTriggerHtml(task)}
      <div class="task-card-footer-actions">
        ${meta}
        ${taskCardFooterActionHtml(task)}
      </div>
    </div>
  `;

  const assigneeBtn = card.querySelector('.assignee-trigger');
  assigneeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openAssigneeMenu(assigneeBtn, task.id);
  });

  const playBtn = card.querySelector('.task-card-play');
  playBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    startTask(task.id);
  });
  playBtn?.addEventListener('pointerdown', (e) => e.stopPropagation());

  initCardDrag(card, task);

  return card;
}

/* ── Drag & Drop ── */
function initDragDrop() {
  // Column drop targets are handled via pointer drag in initCardDrag.
}

/* ── Chat UI ── */
function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function scrollChat(container) {
  container.scrollTop = container.scrollHeight;
}

function appendUserBubble(container, text, links = null) {
  const el = document.createElement('div');
  el.className = `chat-user-bubble${links?.length ? ' chat-user-bubble-rich' : ''}`;

  if (links?.length) {
    el.innerHTML = `
      ${links.map(renderChatLinkCard).join('')}
      <p class="chat-user-bubble-text">${escapeHtml(text)}</p>`;
  } else {
    el.textContent = text;
  }

  container.appendChild(el);
  scrollChat(container);
}

function renderChatLinkCard(link) {
  const icon = link.type === 'confluence'
    ? '<span class="chat-link-card-logo confluence">C</span>'
    : iconHtml('file-text', { size: 14, className: 'lucide-icon' });

  return `
    <a class="chat-link-card" href="${escapeHtml(link.url || '#')}" target="_blank" rel="noopener noreferrer">
      <span class="chat-link-card-icon">${icon}</span>
      <span class="chat-link-card-body">
        <span class="chat-link-card-title">${escapeHtml(link.title)}</span>
        ${link.meta ? `<span class="chat-link-card-meta">${escapeHtml(link.meta)}</span>` : ''}
      </span>
      <span class="chat-link-card-external">${iconHtml('external-link', { size: 12, className: 'lucide-icon lucide-muted' })}</span>
    </a>`;
}

function getTaskDescriptionBody(task) {
  const description = (task.description || '').trim();
  if (!description) return '';

  const lines = description.split('\n');
  const firstLine = lines[0].trim();
  if (firstLine === task.title.trim() && lines.length > 1) {
    return lines.slice(1).join('\n').trim();
  }
  if (description !== task.title.trim()) return description;
  return '';
}

function appendTaskDescriptionBubble(container, task) {
  const body = getTaskDescriptionBody(task);
  const el = document.createElement('div');
  el.className = 'chat-user-bubble task-description-bubble';
  el.innerHTML = `
    <div class="task-bubble-title">${escapeHtml(task.title)}</div>
    ${body ? `<div class="task-bubble-body">${escapeHtml(body).replace(/\n/g, '<br>')}</div>` : ''}`;
  container.appendChild(el);
  scrollChat(container);
}

function renderTimelineStep(step, isLast) {
  const dotClass = step.dot || 'green';
  let content = '';

  if (step.type === 'label') {
    content = `<div class="timeline-label">${step.html}</div>`;
  } else if (step.type === 'text') {
    content = `<div class="timeline-text">${step.html}</div>`;
  } else if (step.type === 'file-read') {
    content = `
      <div class="file-read-block">
        <div class="file-tag">
          ${iconHtml('file', { size: 12, className: 'lucide-icon lucide-muted' })}
          ${escapeHtml(step.file)}
        </div>
        ${step.desc ? `<div class="file-read-desc">${escapeHtml(step.desc)}</div>` : ''}
        <div class="code-snippet-box">${step.code}</div>
      </div>`;
  } else if (step.type === 'bash') {
    const copyBtn = `<button class="io-copy" type="button" aria-label="Copy">${iconHtml('copy', { size: 12, className: 'lucide-icon' })}</button>`;
    content = `
      <div class="bash-block">
        ${step.label ? `<div class="timeline-label">${step.label}</div>` : ''}
        <div class="terminal-io-box">
          <div class="io-row in">
            <span class="io-label">IN</span>
            <span class="io-content">${escapeHtml(step.in)}</span>
            ${copyBtn}
          </div>
          <div class="io-row out">
            <span class="io-label">OUT</span>
            <span class="io-content">${step.out}</span>
          </div>
        </div>
      </div>`;
  } else if (step.type === 'actions') {
    content = `<div class="action-buttons">${step.buttons.map((b) =>
      `<button class="action-btn${b.primary ? ' primary' : ''}" type="button" data-action="${escapeHtml(b.action)}">${escapeHtml(b.label)}</button>`
    ).join('')}</div>`;
  } else if (step.type === 'typing') {
    content = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  }

  return `
    <div class="timeline-step${step.type === 'typing' ? ' typing-step' : ''}">
      <div class="timeline-rail">
        <span class="timeline-dot ${dotClass}"></span>
        ${isLast ? '' : '<span class="timeline-line"></span>'}
      </div>
      <div class="timeline-content">${content}</div>
    </div>`;
}

function appendAgentTimeline(container, steps) {
  const timeline = document.createElement('div');
  timeline.className = 'agent-timeline';
  timeline.innerHTML = steps.map((step, i) => renderTimelineStep(step, i === steps.length - 1)).join('');
  container.appendChild(timeline);
  scrollChat(container);
  return timeline;
}

function showTyping(container) {
  return appendAgentTimeline(container, [{ type: 'typing', dot: 'pulse' }]);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createStreamingTimeline(container) {
  const timeline = document.createElement('div');
  timeline.className = 'agent-timeline';
  container.appendChild(timeline);
  scrollChat(container);
  return timeline;
}

function appendStepToTimeline(timeline, step) {
  const steps = timeline.querySelectorAll('.timeline-step');
  if (steps.length > 0) {
    const lastRail = steps[steps.length - 1].querySelector('.timeline-rail');
    if (lastRail && !lastRail.querySelector('.timeline-line')) {
      lastRail.insertAdjacentHTML('beforeend', '<span class="timeline-line"></span>');
    }
  }
  timeline.insertAdjacentHTML('beforeend', renderTimelineStep(step, true));
  scrollChat(timeline.parentElement);
}

function updateLastBashOut(timeline, outHtml) {
  const outputs = timeline.querySelectorAll('.io-row.out .io-content');
  if (outputs.length) outputs[outputs.length - 1].innerHTML = outHtml;
}

async function thinkAndStream(container, steps, { stepDelay = 1000, leadDelay = 700 } = {}) {
  let typing = showTyping(container);
  await sleep(leadDelay + Math.random() * 400);
  typing.remove();

  const timeline = createStreamingTimeline(container);

  for (let i = 0; i < steps.length; i++) {
    if (i > 0) {
      typing = showTyping(container);
      await sleep(stepDelay + Math.random() * 500);
      typing.remove();
    }
    appendStepToTimeline(timeline, steps[i]);
  }

  return timeline;
}

function commitTaskFromChat({ title, status, agentId, description, repo }) {
  const task = {
    id: uid(),
    title,
    description: description || title,
    repo: repo || defaultRepoForNewTask(),
    status,
    agentId: agentId || null,
    prs: 0,
    commits: 0,
    files: 0,
    additions: 0,
    deletions: 0,
    chat: [],
  };
  tasks.push(task);
  return task;
}

function buildCreateTaskThinkingSteps(title, status, agentId) {
  const agent = agentId ? getAgent(agentId) : null;
  const backlogCount = tasks.filter((t) => t.status === status).length;

  return [
    {
      type: 'label',
      dot: 'green',
      html: '<strong>Agent</strong> Understanding your request…',
    },
    {
      type: 'file-read',
      dot: 'green',
      file: 'board.json',
      desc: 'read current board layout',
      code: `<span class="key">"column"</span>: <span class="val">"${status}"</span>,
<span class="key">"tasks"</span>: <span class="val">${backlogCount}</span>,
<span class="key">"workspace"</span>: <span class="val">"Kimchi Squad"</span>`,
    },
    {
      type: 'bash',
      dot: 'green',
      label: '<strong>Bash</strong> Match task to agent',
      in: `kimchi agents match --task "${title}"`,
      out: agent ? `→ ${agent.name} (${agent.initials})` : '→ Unassigned',
    },
  ];
}

function initChatInput(textareaId, onSend) {
  const textarea = $(`#${textareaId}`);
  const key = textareaId.replace('-chat-input', '');
  const sendBtn = document.querySelector(`[data-send="${key}"]`);

  const submit = () => {
    const text = textarea.value.trim();
    if (!text) return;
    textarea.value = '';
    textarea.style.height = 'auto';
    onSend(text);
  };

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  });

  sendBtn?.addEventListener('click', submit);
}

function buildBudgetFeatureRecapHtml() {
  const isBug = (t) => t.title.toLowerCase().startsWith('fix ');
  const featureTasks = tasks.filter((t) => !isBug(t));
  const byRepo = { design: [], backend: [], frontend: [] };
  featureTasks.forEach((t) => {
    if (byRepo[t.repo]) byRepo[t.repo].push(t);
  });

  let html = `<p>Done — <strong>${featureTasks.length} tasks</strong> are on the board for the <strong>Budgets</strong> rollout:</p>`;

  ['design', 'backend', 'frontend'].forEach((repo) => {
    const list = byRepo[repo];
    if (!list.length) return;
    html += `<p><strong>${repo}</strong> (${list.length})</p><ul>`;
    list.forEach((t) => {
      html += `<li>${escapeHtml(t.title)}</li>`;
    });
    html += '</ul>';
  });

  html += '<p>Dependencies link frontend work to design prototypes and API contracts.</p>';
  return html;
}

function getKanbanBootstrapAgentSteps() {
  const featureCount = tasks.filter((t) => !t.title.toLowerCase().startsWith('fix ')).length;
  return [
    {
      type: 'file-read',
      dot: 'green',
      file: 'config.json',
      desc: 'read workspace config',
      code: `<span class="key">"workspace"</span>: <span class="val">"Kimchi Team"</span>,
<span class="key">"repos"</span>: [<span class="val">"design"</span>, <span class="val">"backend"</span>, <span class="val">"frontend"</span>],
<span class="key">"feature"</span>: <span class="val">"budgets"</span>,
<span class="key">"agents"</span>: [<span class="val">"DP"</span>, <span class="val">"ZU"</span>, <span class="val">"BM"</span>, <span class="val">"CC"</span>]`,
    },
    {
      type: 'bash',
      dot: 'green',
      label: '<strong>Bash</strong> Plan budgets rollout',
      in: 'kimchi plan budgets --repos design,backend,frontend',
      out: `${featureCount} tasks · 3 repos · 4 agents`,
    },
    {
      type: 'bash',
      dot: 'green',
      label: '<strong>Bash</strong> Create kanban tasks',
      in: 'kimchi task create --batch budgets-rollout.json',
      out: `✓ ${featureCount} tasks created`,
    },
    {
      type: 'text',
      dot: 'gray',
      html: buildBudgetFeatureRecapHtml(),
    },
  ];
}

function seedKanbanChatHistory() {
  if (kanbanChatHistory.length) return;
  kanbanChatHistory.push(
    {
      role: 'user',
      text: 'Set up the budgets feature rollout across design, backend, and frontend.',
      links: [{
        type: 'confluence',
        title: 'Budgets Feature — Product Spec',
        meta: 'Confluence · Kimchi Team',
        url: 'https://kimchi.atlassian.net/wiki/spaces/TEAM/pages/1847291/Budgets+Feature',
      }],
    },
    { role: 'agent', steps: getKanbanBootstrapAgentSteps(), plain: 'budget-rollout-created' },
  );
}

function renderKanbanChatHistory() {
  const container = $('#kanban-chat-messages');
  container.innerHTML = '';
  kanbanChatHistory.forEach((msg) => {
    if (msg.role === 'user') appendUserBubble(container, msg.text, msg.links);
    else if (msg.steps) appendAgentTimeline(container, msg.steps);
  });
  scrollChat(container);
}

function initKanbanChat() {
  seedKanbanChatHistory();
  renderKanbanChatHistory();
  initChatInput('kanban-chat-input', handleKanbanChat);
}

function handleKanbanChat(text) {
  const container = $('#kanban-chat-messages');
  appendUserBubble(container, text);
  kanbanChatHistory.push({ role: 'user', text });

  const response = processKanbanCommand(text);

  if (response.multiTaskData) {
    runCreateMultiTaskSimulation(container, response);
    return;
  }

  if (response.taskData) {
    runCreateTaskSimulation(container, response);
    return;
  }

  runKanbanAgentResponse(container, response);
}

async function runCreateTaskSimulation(container, response) {
  const { title, status, agentId } = response.taskData;

  const timeline = await thinkAndStream(
    container,
    buildCreateTaskThinkingSteps(title, status, agentId),
    { stepDelay: 1100, leadDelay: 900 }
  );

  let typing = showTyping(container);
  await sleep(1400 + Math.random() * 600);
  typing.remove();

  const agent = agentId ? getAgent(agentId) : null;
  appendStepToTimeline(timeline, {
    type: 'bash',
    dot: 'green',
    label: '<strong>Bash</strong> Create kanban task',
    in: `kimchi task create --title "${title}" --status ${status} --agent ${agent ? agent.initials : 'none'}`,
    out: '<span class="bash-running">running…</span>',
  });

  typing = showTyping(container);
  await sleep(1800 + Math.random() * 800);
  typing.remove();

  const task = commitTaskFromChat(response.taskData);
  updateLastBashOut(timeline, `✓ task #${task.id} created`);

  typing = showTyping(container);
  await sleep(600 + Math.random() * 300);
  typing.remove();

  appendStepToTimeline(timeline, buildCreatedTaskTextStep(task));

  kanbanChatHistory.push({ role: 'agent', plain: response.plain });
  renderBoard();
}

async function runCreateMultiTaskSimulation(container, response) {
  const specs = response.multiTaskData;

  const timeline = await thinkAndStream(
    container,
    [
      {
        type: 'label',
        dot: 'green',
        html: '<strong>Agent</strong> Breaking alert work into design, backend, and frontend tasks…',
      },
      {
        type: 'bash',
        dot: 'green',
        label: '<strong>Bash</strong> Plan budget alert feature',
        in: 'kimchi plan feature --name "budget-depletion-alert"',
        out: '3 tasks · design · backend · frontend',
      },
    ],
    { stepDelay: 900, leadDelay: 800 },
  );

  const created = [];
  for (const spec of specs) {
    let typing = showTyping(container);
    await sleep(1200 + Math.random() * 400);
    typing.remove();

    const agent = spec.agentId ? getAgent(spec.agentId) : null;
    appendStepToTimeline(timeline, {
      type: 'bash',
      dot: 'green',
      label: '<strong>Bash</strong> Create kanban task',
      in: `kimchi task create --title "${spec.title}" --repo ${spec.repo} --status backlog --agent ${agent ? agent.initials : 'none'}`,
      out: '<span class="bash-running">running…</span>',
    });

    typing = showTyping(container);
    await sleep(1400 + Math.random() * 600);
    typing.remove();

    const task = commitTaskFromChat(spec);
    created.push(task);
    updateLastBashOut(timeline, `✓ task #${task.id} created`);
  }

  let typing = showTyping(container);
  await sleep(600 + Math.random() * 300);
  typing.remove();

  let recapHtml = '<p>Created <strong>3 tasks</strong> for the budget depletion alert:</p><ul>';
  created.forEach((task) => {
    const agent = task.agentId ? getAgent(task.agentId) : null;
    recapHtml += `<li><strong>${escapeHtml(task.title)}</strong> <span style="color:var(--text-muted)">${task.repo}${agent ? ` · ${agent.initials}` : ''} · Backlog</span></li>`;
  });
  recapHtml += '</ul>';

  const recapStep = { type: 'text', dot: 'gray', html: recapHtml };
  appendStepToTimeline(timeline, recapStep);

  const agentSteps = [
    {
      type: 'label',
      dot: 'green',
      html: '<strong>Agent</strong> Breaking alert work into design, backend, and frontend tasks…',
    },
    {
      type: 'bash',
      dot: 'green',
      label: '<strong>Bash</strong> Plan budget alert feature',
      in: 'kimchi plan feature --name "budget-depletion-alert"',
      out: '3 tasks · design · backend · frontend',
    },
    ...created.map((task) => {
      const agent = task.agentId ? getAgent(task.agentId) : null;
      return {
        type: 'bash',
        dot: 'green',
        label: '<strong>Bash</strong> Create kanban task',
        in: `kimchi task create --title "${task.title}" --repo ${task.repo} --status backlog --agent ${agent ? agent.initials : 'none'}`,
        out: `✓ task #${task.id} created`,
      };
    }),
    recapStep,
  ];

  kanbanChatHistory.push({ role: 'agent', steps: agentSteps, plain: response.plain });
  renderBoard();
}

function buildCreatedTaskTextStep(task) {
  const agent = task.agentId ? getAgent(task.agentId) : null;
  const assigneeText = agent
    ? `assigned to <strong>${agent.name}</strong>`
    : 'left <strong>unassigned</strong>';
  return {
    type: 'text',
    dot: 'gray',
    html: `<p>Created task in <strong>${STATUS_LABELS[task.status]}</strong>, ${assigneeText}:</p>
      <div class="task-created" data-task-id="${task.id}">
        ${agent ? avatarHtml(agent, 'xs') : unassignedAvatarHtml('xs')} <strong>${escapeHtml(task.title)}</strong> · ${task.repo}${agent ? ` · ${agent.initials}` : ''}
      </div>`,
  };
}

async function runKanbanAgentResponse(container, response) {
  let typing = showTyping(container);
  await sleep(700 + Math.random() * 500);
  typing.remove();

  await thinkAndStream(container, response.steps, { stepDelay: 500, leadDelay: 0 });
  kanbanChatHistory.push({ role: 'agent', steps: response.steps, plain: response.plain });

  if (response.task) renderBoard();
}

function matchesTeamWorkingOn(text) {
  const lower = text.toLowerCase().trim();
  return lower.includes('what is the team working on')
    || /what(?:'s| is) the team (?:working on|up to)/.test(lower);
}

function matchesBudgetAlert(text) {
  const lower = text.toLowerCase().trim();
  return lower.includes('create an alert for users running out of budget')
    || (/alert/.test(lower) && /running out of budget|out of budget/.test(lower));
}

function buildTeamWorkingOnResponse() {
  const isBug = (t) => t.title.toLowerCase().startsWith('fix ');
  const active = tasks.filter((t) => t.status !== 'closed');
  const features = active.filter((t) => !isBug(t));
  const bugs = active.filter(isBug);
  const inProgress = features.filter((t) => t.status === 'in-progress');
  const review = features.filter((t) => t.status === 'review');
  const backlogFeatures = features.filter((t) => t.status === 'backlog');

  let html = '<p>Here\'s what the team is focused on:</p>';
  html += '<p><strong>Features in flight</strong></p><ul>';
  [...inProgress, ...review].forEach((t) => {
    const agent = t.agentId ? getAgent(t.agentId) : null;
    html += `<li><strong>${escapeHtml(t.title)}</strong> <span style="color:var(--text-muted)">${t.repo} · ${STATUS_LABELS[t.status]}${agent ? ` · ${agent.initials}` : ''}</span></li>`;
  });
  html += '</ul>';

  if (backlogFeatures.length) {
    html += '<p><strong>Queued feature work</strong></p><ul>';
    backlogFeatures.forEach((t) => {
      const agent = t.agentId ? getAgent(t.agentId) : null;
      html += `<li>${escapeHtml(t.title)} <span style="color:var(--text-muted)">${t.repo}${agent ? ` · ${agent.initials}` : ''}</span></li>`;
    });
    html += '</ul>';
  }

  html += '<p><strong>Open bugs</strong></p><ul>';
  bugs.forEach((t) => {
    const agent = t.agentId ? getAgent(t.agentId) : null;
    html += `<li><strong>${escapeHtml(t.title)}</strong> <span style="color:var(--text-muted)">${t.repo} · ${STATUS_LABELS[t.status]}${agent ? ` · ${agent.initials}` : ''}</span></li>`;
  });
  html += '</ul>';

  return {
    steps: [
      {
        type: 'bash',
        dot: 'green',
        label: '<strong>Bash</strong> Summarize active work',
        in: 'kimchi board status --active',
        out: `${inProgress.length} in progress · ${review.length} in review · ${bugs.length} open bugs`,
      },
      { type: 'text', dot: 'gray', html },
    ],
    plain: 'team-status',
  };
}

function buildBudgetAlertResponse() {
  return {
    plain: 'budget-alert-created',
    task: true,
    multiTaskData: [
      {
        title: 'Design low-budget alert banner & threshold states',
        repo: 'design',
        status: 'backlog',
        agentId: 'dp',
        description: 'Design low-budget alert banner & threshold states',
      },
      {
        title: 'Budget depletion alert API & webhook payloads',
        repo: 'backend',
        status: 'backlog',
        agentId: 'cc',
        description: 'Budget depletion alert API & webhook payloads',
      },
      {
        title: 'Wire budget alert banner to threshold API',
        repo: 'frontend',
        status: 'backlog',
        agentId: 'zu',
        description: 'Wire budget alert banner to threshold API',
      },
    ],
  };
}

function processKanbanCommand(text) {
  const lower = text.toLowerCase().trim();

  if (lower === '/help' || lower === 'help') {
    return {
      steps: [{
        type: 'text',
        dot: 'gray',
        html: `<p>Available commands:</p>
          <ul>
            <li><code>create task: [title]</code> — add to backlog</li>
            <li><code>add "[title]" to [status] assign [agent]</code></li>
            <li><code>list tasks</code> — show all tasks</li>
            <li><code>move [title] to [status]</code></li>
          </ul>
          <p>Agents: ${AGENTS.map((a) => a.initials).join(', ')}</p>`,
      }],
      plain: 'help',
    };
  }

  if (matchesTeamWorkingOn(text)) {
    return buildTeamWorkingOnResponse();
  }

  if (matchesBudgetAlert(text)) {
    return buildBudgetAlertResponse();
  }

  if (lower === 'list tasks' || lower === 'list') {
    const grouped = {};
    tasks.forEach((t) => {
      if (!grouped[t.status]) grouped[t.status] = [];
      grouped[t.status].push(t);
    });

    let listHtml = '<p>Here\'s your board:</p><ul>';
    Object.entries(grouped).forEach(([status, list]) => {
      listHtml += `<li><strong>${STATUS_LABELS[status]}</strong> (${list.length})<ul>`;
      list.forEach((t) => {
        const label = t.agentId ? getAgent(t.agentId).initials : 'Unassigned';
        listHtml += `<li>${escapeHtml(t.title)} <span style="color:var(--text-muted)">(${t.repo})</span> — ${label}</li>`;
      });
      listHtml += '</ul></li>';
    });
    listHtml += '</ul>';

    return {
      steps: [
        {
          type: 'bash',
          dot: 'green',
          label: '<strong>Bash</strong> Query board tasks',
          in: 'kimchi board list --all',
          out: `${tasks.length} tasks across ${Object.keys(grouped).length} columns`,
        },
        { type: 'text', dot: 'gray', html: listHtml },
      ],
      plain: 'list',
    };
  }

  let match = text.match(/^create\s+task:\s*(.+)$/i);
  if (match) {
    return createTaskFromChat(match[1].trim(), 'backlog', null);
  }

  match = text.match(/^add\s+["'](.+?)["']\s+to\s+(\w[\w-]*)\s*(?:assign\s+(\w+))?/i);
  if (match) {
    const title = match[1];
    let status = match[2].toLowerCase().replace(/\s+/g, '-');
    if (status === 'in') status = 'in-progress';
    if (!['backlog', 'in-progress', 'review', 'closed'].includes(status)) status = 'backlog';
    const agentId = parseAgentInitials(match[3]) || null;
    return createTaskFromChat(title, status, agentId);
  }

  match = text.match(/^move\s+(.+?)\s+to\s+(\w[\w-]*)/i);
  if (match) {
    const titleQuery = match[1].toLowerCase();
    let status = match[2].toLowerCase().replace(/\s+/g, '-');
    if (status === 'in') status = 'in-progress';
    const task = tasks.find((t) => t.title.toLowerCase().includes(titleQuery));
    if (task && ['backlog', 'in-progress', 'review', 'closed'].includes(status)) {
      task.status = status;
      syncReviewReason(task);
      return {
        steps: [
          {
            type: 'bash',
            dot: 'green',
            label: '<strong>Bash</strong> Move task',
            in: `kimchi board move "${task.title}" --to ${status}`,
            out: `✓ moved to ${STATUS_LABELS[status]}`,
          },
          {
            type: 'text',
            dot: 'gray',
            html: `<p>Moved <strong>${escapeHtml(task.title)}</strong> to <strong>${STATUS_LABELS[status]}</strong>.</p>`,
          },
        ],
        plain: 'moved',
        task: true,
      };
    }
    return {
      steps: [{ type: 'text', dot: 'red', html: `<p>Couldn't find that task. Try <code>list tasks</code>.</p>` }],
      plain: 'not found',
    };
  }

  match = text.match(/create\s+(?:a\s+)?task\s+(?:for\s+)?(.+)/i);
  if (match) {
    return createTaskFromChat(match[1].trim(), 'backlog', AGENTS[Math.floor(Math.random() * AGENTS.length)].id);
  }

  return {
    steps: [{
      type: 'text',
      dot: 'red',
      html: `<p>I'm not sure what you mean. Try <code>create task: Your task title</code> or type <code>/help</code>.</p>`,
    }],
    plain: 'unknown',
  };
}

function parseAgentInitials(str) {
  if (!str) return null;
  const upper = str.toUpperCase();
  const agent = AGENTS.find((a) => a.initials === upper || a.id === str.toLowerCase());
  return agent?.id || null;
}

function createTaskFromChat(title, status, agentId) {
  return {
    plain: `created: ${title}`,
    task: true,
    taskData: { title, status, agentId, description: title },
  };
}

/* ── Task Detail Chat ── */
function startThinkingBar(phrases) {
  const bar = $('#task-thinking-bar');
  const statusEl = $('#task-thinking-status');
  const timeEl = $('#task-thinking-time');
  if (!bar) return;

  let phraseIdx = 0;
  bar.hidden = false;
  thinkingStart = Date.now();
  statusEl.innerHTML = `<strong>Agent</strong> ${phrases[0]}`;

  clearInterval(thinkingTimer);
  thinkingTimer = setInterval(() => {
    const secs = Math.floor((Date.now() - thinkingStart) / 1000);
    if (timeEl) timeEl.textContent = `${secs}s`;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    statusEl.innerHTML = `<strong>Agent</strong> ${phrases[phraseIdx]}`;
  }, 2200);
}

function stopThinkingBar() {
  clearInterval(thinkingTimer);
  thinkingTimer = null;
  const bar = $('#task-thinking-bar');
  if (bar) bar.hidden = true;
}

function setThinkingStatus(text) {
  const statusEl = $('#task-thinking-status');
  if (statusEl) statusEl.innerHTML = `<strong>Agent</strong> ${text}`;
}

function getNeedsInputPrompt(task) {
  const prompts = {
    t2: {
      question: 'Should deleting a budget also clear its alert thresholds, or block deletion while alerts are active?',
      options: [
        {
          id: 'soft-delete',
          label: 'Soft-delete and clear alerts',
          summary: 'Archive the budget row and remove linked threshold records in the same transaction.',
        },
        {
          id: 'block-delete',
          label: 'Block delete when alerts exist',
          summary: 'Return 409 from DELETE until the client clears alerts first.',
        },
        {
          id: 'cascade',
          label: 'Hard-delete with cascade',
          summary: 'Delete the budget and cascade-remove thresholds and webhook subscriptions.',
        },
      ],
    },
    t4: {
      question: 'Should the period selector default to the user\'s last choice, or always reset to <code>month</code>?',
      options: [
        {
          id: 'remember',
          label: 'Remember last choice',
          summary: 'Persist the selected period in localStorage and restore it on load.',
        },
        {
          id: 'month',
          label: 'Always default to month',
          summary: 'Ignore previous selection and open the dashboard on month every time.',
        },
        {
          id: 'workspace',
          label: 'Use workspace preference',
          summary: 'Read the default period from workspace settings.',
        },
      ],
    },
  };

  return (
    prompts[task.id] || {
      question: 'Which approach should we take for the open question in the latest diff?',
      options: [
        {
          id: 'minimal',
          label: 'Minimal change',
          summary: 'Ship the smallest diff that unblocks the task.',
        },
        {
          id: 'spec',
          label: 'Match the design spec',
          summary: 'Align fully with the handoff, even if it takes longer.',
        },
        {
          id: 'defer',
          label: 'Defer polish to a follow-up',
          summary: 'Land the core behavior now and track refinements separately.',
        },
      ],
    }
  );
}

function getNeedsInputTailSteps(task) {
  const prompt = getNeedsInputPrompt(task);
  const agent = task.agentId ? getAgent(task.agentId) : null;
  const agentName = agent?.name || 'Agent';

  return [
    { type: 'label', dot: 'green', html: `<strong>${agentName}</strong> Blocked on a product decision…` },
    {
      type: 'text',
      dot: 'gray',
      html: `<p>I have a question before I can finish <strong>${escapeHtml(task.title)}</strong>:</p>
        <p>${prompt.question}</p>`,
    },
    {
      type: 'actions',
      dot: 'gray',
      buttons: prompt.options.map((option, index) => ({
        label: option.label,
        action: `needs-input:${option.id}`,
        primary: index === 0,
      })),
    },
  ];
}

function needsInputTailAlreadyAppended(steps) {
  return steps?.some(
    (step) => step.type === 'actions'
      && step.buttons?.some((btn) => btn.action?.startsWith('needs-input:')),
  );
}

function getFullNeedsInputChatSteps(task) {
  const implementation = getTaskImplementationPlan(task).steps;
  if (needsInputTailAlreadyAppended(implementation)) return implementation;
  return [...implementation, ...getNeedsInputTailSteps(task)];
}

function getNeedsInputContinuationSteps(task, option) {
  const agent = task.agentId ? getAgent(task.agentId) : null;
  const agentName = agent?.name || 'Agent';

  if (task.id === 't2') {
    const wiring = {
      'soft-delete': 'DELETE /budgets/{id} → archived=true, thresholds cleared',
      'block-delete': 'DELETE /budgets/{id} → 409 when alerts.active',
      cascade: 'DELETE /budgets/{id} → cascade thresholds + webhooks',
    };

    return [
      { type: 'label', dot: 'green', html: `<strong>${agentName}</strong> Continuing with your choice…` },
      {
        type: 'text',
        dot: 'gray',
        html: `<p>Using <strong>${escapeHtml(option.label)}</strong>. ${escapeHtml(option.summary)}</p>`,
      },
      {
        type: 'bash',
        dot: 'green',
        label: '<strong>Bash</strong> Update delete handler',
        in: `kimchi edit src/routes/budgets.ts --delete-policy ${option.id}`,
        out: `✓ ${wiring[option.id]}`,
      },
      {
        type: 'bash',
        dot: 'green',
        label: '<strong>Bash</strong> Run API integration tests',
        pending: true,
        in: 'npm test src/routes/budgets.test.ts',
        out: '<span class="bash-running">running…</span>',
        doneOut: '✓ 21 passed — delete policy covered',
      },
      {
        type: 'text',
        dot: 'gray',
        html: '<p>Thanks — finishing the remaining API changes and I\'ll move this back through review when done.</p>',
      },
    ];
  }

  if (task.id === 't4') {
    const wiring = {
      remember: 'localStorage + useSearchParams fallback',
      month: 'const defaultPeriod = "month"',
      workspace: 'useWorkspaceSettings().defaultBudgetPeriod',
    };

    return [
      { type: 'label', dot: 'green', html: `<strong>${agentName}</strong> Continuing with your choice…` },
      {
        type: 'text',
        dot: 'gray',
        html: `<p>Using <strong>${escapeHtml(option.label)}</strong>. ${escapeHtml(option.summary)}</p>`,
      },
      {
        type: 'bash',
        dot: 'green',
        label: '<strong>Bash</strong> Update period selector default',
        in: `kimchi edit budget-period-selector.tsx --default ${option.id}`,
        out: `✓ default wired via ${wiring[option.id]}`,
      },
      {
        type: 'bash',
        dot: 'green',
        label: '<strong>Bash</strong> Run component tests',
        pending: true,
        in: 'npm test budget-period-selector.test.tsx',
        out: '<span class="bash-running">running…</span>',
        doneOut: '✓ 6 passed — default period behavior covered',
      },
      {
        type: 'text',
        dot: 'gray',
        html: '<p>Thanks — I\'ll finish the remaining changes and move this back through review when done.</p>',
      },
    ];
  }

  return [
    { type: 'label', dot: 'green', html: `<strong>${agentName}</strong> Continuing with your choice…` },
    {
      type: 'text',
      dot: 'gray',
      html: `<p>Using <strong>${escapeHtml(option.label)}</strong>. ${escapeHtml(option.summary)}</p>`,
    },
    {
      type: 'bash',
      dot: 'green',
      label: '<strong>Bash</strong> Apply selected approach',
      in: `kimchi task continue --choice ${option.id}`,
      out: '✓ implementation updated',
    },
    {
      type: 'text',
      dot: 'gray',
      html: '<p>Got it. Resuming work on the remaining changes now.</p>',
    },
  ];
}

function resumeTaskFromNeedsInput(task) {
  task.status = 'in-progress';
  task.reviewReason = null;
  task.workSimulated = false;
  clearWorkTarget(task);

  const target = ensureWorkTarget(task);
  task.files = Math.max(1, Math.floor(target.files * 0.72));
  task.additions = Math.max(1, Math.floor(target.additions * 0.72));
  task.deletions = Math.max(0, Math.floor(target.deletions * 0.72));
  task.commits = 0;
  task.prs = 0;
  pendingCompletionTaskId = null;

  if (completionPauseTimer) {
    clearTimeout(completionPauseTimer);
    completionPauseTimer = null;
  }

  activeSimulatedTaskId = task.id;

  if (activeTaskId === task.id) {
    const badge = $('#task-status-badge');
    badge.textContent = STATUS_LABELS['in-progress'];
    badge.className = 'status-badge in-progress';
  }

  renderBoard();
  renderTaskSidebar();
  renderBoardWorkspaceStats();
}

async function handleNeedsInputAnswer(task, option, buttonEl) {
  const container = $('#task-chat-messages');
  const actionGroup = buttonEl.closest('.action-buttons');
  actionGroup?.querySelectorAll('.action-btn').forEach((btn) => {
    btn.disabled = true;
    btn.classList.toggle('selected', btn === buttonEl);
  });

  if (task.workSteps?.length && task.chat.length === 0) {
    task.chat.push({ role: 'agent', steps: task.workSteps });
  }

  appendUserBubble(container, option.label);
  task.chat.push({ role: 'user', text: option.label });

  resumeTaskFromNeedsInput(task);

  const continuationSteps = getNeedsInputContinuationSteps(task, option);
  const runId = ++taskWorkRunId;
  startThinkingBar(['Applying your decision…', 'Updating implementation…', 'Running checks…']);

  let typing = showTyping(container);
  await sleep(700 + Math.random() * 300);
  if (runId !== taskWorkRunId) return;
  typing.remove();

  const recorded = await streamTaskSteps(
    container,
    createStreamingTimeline(container),
    continuationSteps,
    runId,
    { stepDelay: 850 },
  );

  stopThinkingBar();

  if (runId !== taskWorkRunId || !recorded) return;

  task.chat.push({ role: 'agent', steps: recorded });
  updateTaskCardStats(task);
  renderBoard();
}

function getReviewWorkPlan(task) {
  syncReviewReason(task);
  const repo = task.repo;
  const artifact = repo === 'backend' ? 'openapi/budgets.yaml' : 'src/features/budgets/budget-period-selector.tsx';
  const agent = task.agentId ? getAgent(task.agentId) : null;
  const agentName = agent?.name || 'Agent';

  if (task.reviewReason === 'needs-input') {
    return {
      phrases: ['Reviewing open questions…', 'Drafting options…', 'Waiting for your input…'],
      steps: getFullNeedsInputChatSteps(task),
      stats: null,
    };
  }

  return {
    phrases: ['Reviewing diff…', 'Running tests…', 'Preparing handoff…'],
    steps: [
      { type: 'label', dot: 'green', html: `<strong>${agentName}</strong> Work complete — ready for your review` },
      {
        type: 'bash', dot: 'green', label: '<strong>Bash</strong> Show diff stat',
        in: 'git diff --stat HEAD~1',
        out: ` ${artifact} | ${task.additions} ++++++++++---`,
      },
      {
        type: 'bash', dot: 'green', label: '<strong>Bash</strong> Run test suite', pending: true,
        in: repo === 'backend' ? 'npm test -- budgets.contract.test.ts' : 'npm test -- budget-period-selector',
        out: '<span class="bash-running">running…</span>',
        doneOut: '✓ all checks passed',
      },
      {
        type: 'text', dot: 'gray',
        html: `<p>Implementation is complete for <strong>${escapeHtml(task.title)}</strong>. Tests pass and the PR is ready to merge.</p>
          <p>Review the <strong>Changes</strong> tab and approve when you're happy.</p>`,
      },
      {
        type: 'actions',
        dot: 'green',
        buttons: [
          { label: 'Approve merge', action: 'approve', primary: true },
          { label: 'Request changes', action: 'changes' },
        ],
      },
    ],
    stats: null,
  };
}

function getTaskWorkPlan(task) {
  if (task.status === 'review') {
    return getReviewWorkPlan(task);
  }
  return getTaskImplementationPlan(task);
}

function getTaskImplementationPlan(task) {
  const title = task.title.toLowerCase();
  const repo = task.repo;

  if (repo === 'design' && title.includes('budget')) {
    return {
      phrases: ['Reviewing product brief…', 'Laying out frames…', 'Wiring interactions…', 'Polishing states…'],
      steps: [
        { type: 'label', dot: 'green', html: '<strong>Agent</strong> Building interactive budgets prototype…' },
        {
          type: 'file-read', dot: 'green', file: 'prototypes/budgets/README.md', desc: 'read feature brief',
          code: `<span class="key">"feature"</span>: <span class="val">"budgets"</span>,
<span class="key">"goal"</span>: <span class="val">"overview + drill-down flows"</span>,
<span class="key">"handoff"</span>: <span class="val">"frontend + backend"</span>`,
        },
        {
          type: 'file-read', dot: 'green', file: 'prototypes/budgets/overview.canvas', desc: 'open overview screen',
          code: `<span class="key">Frame</span>: BudgetsOverview
<span class="key">Components</span>: summary strip, category list, alert pill
<span class="key">Interactions</span>: period toggle, row expand`,
        },
        {
          type: 'bash', dot: 'green', label: '<strong>Bash</strong> Link prototype hotspots',
          in: 'kimchi proto link overview.canvas --hotspots category-row,alert-pill',
          out: '3 hotspots → BudgetDetail, AlertSettings, PeriodPicker',
        },
        {
          type: 'bash', dot: 'green', label: '<strong>Bash</strong> Export dev handoff', pending: true,
          in: 'kimchi proto export budgets --format figma-tokens',
          out: '<span class="bash-running">running…</span>',
          doneOut: '✓ tokens + component map exported',
        },
        {
          type: 'text', dot: 'gray',
          html: `<p>Interactive prototype covers overview, drill-down, and alert states. Tokens are ready for frontend to match spacing and color.</p>`,
        },
      ],
      stats: { files: 3, additions: 52, deletions: 6, commits: 1 },
    };
  }

  if (repo === 'backend' && title.includes('budget')) {
    return {
      phrases: ['Reading API spec…', 'Scaffolding routes…', 'Validating contracts…', 'Running migrations…'],
      steps: [
        { type: 'label', dot: 'green', html: '<strong>Agent</strong> Implementing budgets API…' },
        {
          type: 'file-read', dot: 'green', file: 'openapi/budgets.yaml', desc: 'read budgets contract',
          code: `<span class="key">/budgets</span>:
  <span class="key">get</span>: list workspace budgets
  <span class="key">post</span>: create budget
<span class="key">/budgets/{id}</span>:
  <span class="key">patch</span>: update threshold`,
        },
        {
          type: 'file-read', dot: 'green', file: 'src/routes/budgets.ts', desc: 'scaffold route handlers',
          code: `<span class="key">export async function</span> listBudgets(req, res) { ... }
<span class="key">export async function</span> createBudget(req, res) { ... }`,
        },
        {
          type: 'bash', dot: 'green', label: '<strong>Bash</strong> Generate types from OpenAPI',
          in: 'npm run codegen -- --spec openapi/budgets.yaml',
          out: 'generated/budgets.ts (+42 types)',
        },
        {
          type: 'bash', dot: 'green', label: '<strong>Bash</strong> Run API integration tests', pending: true,
          in: 'npm test src/routes/budgets.test.ts',
          out: '<span class="bash-running">running…</span>',
          doneOut: '✓ 18 passed — CRUD + threshold cases',
        },
        {
          type: 'text', dot: 'gray',
          html: `<p>Budgets CRUD endpoints are wired with generated types. Contract matches the design handoff and unblocks frontend integration.</p>`,
        },
      ],
      stats: { files: 4, additions: 214, deletions: 12, commits: 1 },
    };
  }

  if (repo === 'frontend' && title.includes('budget')) {
    return {
      phrases: ['Reading prototypes…', 'Mapping API types…', 'Building components…', 'Checking responsive layout…'],
      steps: [
        { type: 'label', dot: 'green', html: '<strong>Agent</strong> Building budgets UI from prototypes…' },
        {
          type: 'file-read', dot: 'green', file: 'design-handoff/budgets/overview.json', desc: 'read prototype spec',
          code: `<span class="key">"layout"</span>: <span class="val">"summary + grid"</span>,
<span class="key">"tokens"</span>: <span class="val">"spacing.md, colors.md"</span>`,
        },
        {
          type: 'file-read', dot: 'green', file: 'src/features/budgets/budgets-dashboard.tsx', desc: 'scaffold dashboard shell',
          code: `<span class="key">import</span> type { BudgetSummary } <span class="key">from</span> <span class="val">"@kimchi/api-contracts"</span>;
<span class="key">export function</span> BudgetsDashboard() { ... }`,
        },
        {
          type: 'bash', dot: 'green', label: '<strong>Bash</strong> Compare UI to prototype',
          in: 'kimchi diff design-handoff/budgets/overview.json src/features/budgets/',
          out: '2 spacing deltas, 1 missing alert pill state',
        },
        {
          type: 'bash', dot: 'green', label: '<strong>Bash</strong> Wire list hook to API', pending: true,
          in: 'kimchi edit budgets-dashboard.tsx --use-contract BudgetSummary',
          out: '<span class="bash-running">running…</span>',
          doneOut: '✓ dashboard renders live budget cards',
        },
        {
          type: 'text', dot: 'gray',
          html: `<p>Dashboard layout follows the design prototype and consumes <code>BudgetSummary</code> from the backend contract.</p>`,
        },
      ],
      stats: { files: 5, additions: 168, deletions: 22, commits: 1 },
    };
  }

  if (title.includes('icon')) {
    return {
      phrases: ['Tracing icon imports…', 'Checking design tokens…', 'Swapping component…'],
      steps: [
        { type: 'label', dot: 'green', html: '<strong>Agent</strong> Fixing incorrect icon…' },
        {
          type: 'bash', dot: 'green', label: '<strong>Bash</strong> Find wrong icon usage',
          in: 'rg "Settings|Cog|Sliders" src/components/sidebar/',
          out: 'sidebar-nav.tsx:14  icon={Settings}<br>sidebar-nav.tsx:31  icon={Sliders}',
        },
        {
          type: 'file-read', dot: 'green', file: 'src/components/sidebar/sidebar-nav.tsx', desc: 'read nav item config',
          code: `{ <span class="key">label</span>: <span class="val">"Settings"</span>, <span class="key">icon</span>: Sliders, <span class="key">href</span>: <span class="val">"/settings"</span> }`,
        },
        {
          type: 'bash', dot: 'green', label: '<strong>Bash</strong> Apply icon fix', pending: true,
          in: 'kimchi edit sidebar-nav.tsx --icon Settings',
          out: '<span class="bash-running">running…</span>',
          doneOut: '✓ Settings item now uses Settings icon',
        },
        {
          type: 'text', dot: 'gray',
          html: `<p>Settings nav item was using the sliders icon. Updated to the correct Lucide <code>Settings</code> glyph.</p>`,
        },
      ],
      stats: { files: 1, additions: 2, deletions: 2, commits: 1 },
    };
  }

  if (title.includes('dashboard') && (title.includes('spend') || title.includes('discrepancy') || title.includes('total'))) {
    return {
      phrases: ['Comparing aggregates…', 'Tracing query path…', 'Reconciling totals…'],
      steps: [
        { type: 'label', dot: 'green', html: '<strong>Agent</strong> Investigating dashboard data mismatch…' },
        {
          type: 'bash', dot: 'green', label: '<strong>Bash</strong> Reproduce discrepancy',
          in: 'curl -s localhost:4000/api/dashboard/spend?period=month | jq .total',
          out: '"total": 48250',
        },
        {
          type: 'bash', dot: 'green', label: '<strong>Bash</strong> Sum line items directly',
          in: 'psql -c "SELECT SUM(amount) FROM spend_events WHERE period = \'month\'"',
          out: ' sum<br>-------<br> 52100',
        },
        {
          type: 'file-read', dot: 'green', file: 'src/services/dashboard/spend-aggregator.ts', desc: 'read aggregation logic',
          code: `<span class="key">// BUG:</span> refunds excluded from total but still in chart series
<span class="key">const</span> total = events.filter(e => e.type !== <span class="val">'refund'</span>).reduce(...)`,
        },
        {
          type: 'bash', dot: 'green', label: '<strong>Bash</strong> Patch aggregator', pending: true,
          in: 'kimchi edit spend-aggregator.ts --include-refunds-in-total',
          out: '<span class="bash-running">running…</span>',
          doneOut: '✓ totals now match line-item sum (52100)',
        },
        {
          type: 'text', dot: 'gray',
          html: `<p>Dashboard header total excluded refunds while the chart included them. Aggregator now uses the same filter for both views.</p>`,
        },
      ],
      stats: { files: 2, additions: 18, deletions: 6, commits: 1 },
    };
  }

  const slug = title.replace(/[^a-z0-9]+/g, '-').slice(0, 24);
  const featurePath = repo === 'design' ? 'prototypes' : `src/features/${repo}`;
  return {
    phrases: ['Reading task context…', 'Exploring codebase…', 'Applying changes…'],
    steps: [
      { type: 'label', dot: 'green', html: `<strong>Agent</strong> Working on <strong>${escapeHtml(task.title)}</strong>…` },
      {
        type: 'file-read', dot: 'green', file: `${repo}/README.md`, desc: 'read task context',
        code: `<span class="key">"task"</span>: <span class="val">"${escapeHtml(task.title)}"</span>,
<span class="key">"repo"</span>: <span class="val">"${repo}"</span>,
<span class="key">"status"</span>: <span class="val">"${STATUS_LABELS[task.status]}"</span>`,
      },
      {
        type: 'bash', dot: 'green', label: '<strong>Bash</strong> Explore repo',
        in: `ls ${featurePath}/`,
        out: repo === 'design' ? 'budgets/<br>tokens/<br>handoff/' : '_components/<br>hooks/<br>utils/',
      },
      {
        type: 'bash', dot: 'green', label: '<strong>Bash</strong> Implement changes', pending: true,
        in: `kimchi task implement --slug ${slug}`,
        out: '<span class="bash-running">running…</span>',
        doneOut: '✓ changes applied',
      },
      {
        type: 'text', dot: 'gray',
        html: `<p>Making progress on <strong>${escapeHtml(task.title)}</strong>. Check the <strong>Changes</strong> tab for the latest diff.</p>`,
      },
    ],
    stats: { files: 1, additions: 24, deletions: 4, commits: 1 },
  };
}

async function streamTaskSteps(container, timeline, steps, runId, { stepDelay = 950 } = {}) {
  const recorded = [];

  for (let i = 0; i < steps.length; i++) {
    if (runId !== taskWorkRunId) return null;

    if (i > 0) {
      let typing = showTyping(container);
      await sleep(stepDelay + Math.random() * 450);
      if (runId !== taskWorkRunId) return null;
      typing.remove();
    }

    const step = { ...steps[i] };
    appendStepToTimeline(timeline, step);
    recorded.push(step);

    if (step.pending) {
      setThinkingStatus(step.label?.replace(/<[^>]+>/g, '') || 'Running command…');
      let typing = showTyping(container);
      await sleep(1600 + Math.random() * 700);
      if (runId !== taskWorkRunId) return null;
      typing.remove();
      updateLastBashOut(timeline, step.doneOut || '✓ done');
      recorded[recorded.length - 1] = { ...step, out: step.doneOut || '✓ done', pending: false };
    }
  }

  return recorded;
}

function ensureWorkTarget(task) {
  if (task.workTarget) return task.workTarget;
  const plan = getTaskWorkPlan(task);
  task.workTarget = plan.stats
    ? { ...plan.stats }
    : { files: 2, additions: 36, deletions: 8, commits: 1 };
  return task.workTarget;
}

function updateTaskCardStats(task) {
  const card = document.querySelector(`.task-card[data-id="${task.id}"]`);
  if (!card) return;
  const el = card.querySelector('.task-card-stats');
  if (!el) return;
  el.innerHTML = taskCardStatsHtml(task);
}

function updateTaskCardMeta(task) {
  const card = document.querySelector(`.task-card[data-id="${task.id}"]`);
  if (!card) return;
  const footerDiv = card.querySelector('.task-card-footer-actions');
  if (!footerDiv) return;

  const hasMeta = task.prs > 0 || task.commits > 0;
  let metaEl = footerDiv.querySelector('.task-card-meta');
  if (!hasMeta) return;

  if (!metaEl) {
    metaEl = document.createElement('div');
    metaEl.className = 'task-card-meta';
    const actionEl = footerDiv.querySelector('.task-card-stats, .task-card-play');
    footerDiv.insertBefore(metaEl, actionEl);
  }

  metaEl.innerHTML = `
    ${task.prs ? `<span class="meta-pr">${iconHtml('git-pull-request', { size: 11, className: 'meta-icon' })} ${task.prs} PR</span>` : ''}
    ${task.commits ? `<span class="meta-commit">${iconHtml('git-commit', { size: 11, className: 'meta-icon' })} ${task.commits} commit${task.commits > 1 ? 's' : ''}</span>` : ''}`;
}

function tickInProgressStats() {
  const task = ensureActiveSimulatedTask();
  if (!task) return;

  if (pendingCompletionTaskId === task.id) return;

  const target = ensureWorkTarget(task);
  let boardStatsChanged = false;

  if (task.files < target.files && Math.random() < 0.18) {
    task.files += 1;
    boardStatsChanged = true;
  }
  if (task.additions < target.additions) {
    task.additions = Math.min(
      task.additions + Math.floor(Math.random() * 10) + 3,
      target.additions,
    );
    boardStatsChanged = true;
  }
  if (task.deletions < target.deletions && Math.random() < 0.32) {
    task.deletions = Math.min(
      task.deletions + Math.floor(Math.random() * 4) + 1,
      target.deletions,
    );
    boardStatsChanged = true;
  }

  if (boardStatsChanged) {
    updateTaskCardStats(task);
  }

  if (
    task.commits < (target.commits || 1) &&
    task.files >= target.files &&
    task.additions >= Math.floor(target.additions * 0.85)
  ) {
    task.commits = target.commits || 1;
    updateTaskCardMeta(task);
    boardStatsChanged = true;
  }

  if (boardStatsChanged) renderBoardWorkspaceStats();

  if (isTaskWorkComplete(task)) {
    scheduleTaskCompletion(task);
  }
}

function initInProgressStatsTick() {
  if (progressTickTimer) clearInterval(progressTickTimer);
  progressTickTimer = setInterval(tickInProgressStats, 1000);
  tickInProgressStats();
}

function clearWorkTarget(task) {
  delete task.workTarget;
}

function isTaskWorkComplete(task) {
  const target = task.workTarget || (task.status === 'in-progress' ? ensureWorkTarget(task) : null);
  if (!target) return false;
  return (
    task.files >= target.files &&
    task.additions >= target.additions &&
    task.deletions >= target.deletions &&
    task.commits >= (target.commits || 1)
  );
}

function findNextInProgressTaskToSimulate(excludeId = null) {
  return tasks.find(
    (task) =>
      task.status === 'in-progress' &&
      task.id !== excludeId &&
      task.id !== pendingCompletionTaskId &&
      !isTaskWorkComplete(task),
  );
}

function getActiveSimulatedTask() {
  if (!activeSimulatedTaskId) return null;
  const task = getTask(activeSimulatedTaskId);
  if (
    !task ||
    task.status !== 'in-progress' ||
    task.id === pendingCompletionTaskId ||
    isTaskWorkComplete(task)
  ) {
    return null;
  }
  return task;
}

function ensureActiveSimulatedTask({ allowDuringPause = false } = {}) {
  const current = getActiveSimulatedTask();
  if (current) {
    ensureWorkTarget(current);
    return current;
  }

  activeSimulatedTaskId = null;

  if (completionPauseTimer && !allowDuringPause) return null;

  const next = findNextInProgressTaskToSimulate();
  activeSimulatedTaskId = next?.id || null;
  if (next) ensureWorkTarget(next);
  return next || null;
}

function assignNextSimulatedTask({ delay = 2500 } = {}) {
  if (completionPauseTimer) {
    clearTimeout(completionPauseTimer);
    completionPauseTimer = null;
  }

  const activate = () => {
    completionPauseTimer = null;
    pendingCompletionTaskId = null;
    const next = findNextInProgressTaskToSimulate();
    activeSimulatedTaskId = next?.id || null;
    if (next) ensureWorkTarget(next);
  };

  if (delay > 0) {
    completionPauseTimer = setTimeout(activate, delay);
  } else {
    activate();
  }
}

function beginTaskSimulation(task) {
  ensureWorkTarget(task);

  const current = getActiveSimulatedTask();
  if (current && current.id !== task.id) return;

  if (completionPauseTimer) {
    clearTimeout(completionPauseTimer);
    completionPauseTimer = null;
  }

  activeSimulatedTaskId = task.id;
}

function finishTaskToReview(task) {
  const priorWorkSteps = task.workSteps;
  const target = ensureWorkTarget(task);
  task.files = target.files;
  task.additions = target.additions;
  task.deletions = target.deletions;
  task.commits = target.commits || 1;
  if (!task.prs) task.prs = 1;
  task.status = 'review';
  syncReviewReason(task);
  clearWorkTarget(task);
  task.workSimulated = true;

  if (task.reviewReason === 'needs-input') {
    task.workSteps = priorWorkSteps?.length && !needsInputTailAlreadyAppended(priorWorkSteps)
      ? [...priorWorkSteps, ...getNeedsInputTailSteps(task)]
      : getFullNeedsInputChatSteps(task);
  } else {
    task.workSteps = getReviewWorkPlan(task).steps;
  }

  if (activeSimulatedTaskId === task.id) activeSimulatedTaskId = null;
  pendingCompletionTaskId = null;

  if (activeTaskId === task.id) {
    const badge = $('#task-status-badge');
    badge.textContent = STATUS_LABELS.review;
    badge.className = 'status-badge review';
    taskWorkRunId += 1;
    stopThinkingBar();
    if (task.chat.length === 0) {
      if (task.reviewReason === 'needs-input' && priorWorkSteps?.length) {
        appendNeedsInputTailToActiveChat(task);
      } else {
        runTaskAgentWork(task);
      }
    }
  }

  renderBoard();
  renderTaskSidebar();
  renderBoardWorkspaceStats();
  showTaskReviewSnackbar(task);
  assignNextSimulatedTask({ delay: 3000 });
}

async function appendNeedsInputTailToActiveChat(task) {
  const container = $('#task-chat-messages');
  const runId = ++taskWorkRunId;
  let timeline = container.querySelector('.agent-timeline:last-of-type');
  if (!timeline) timeline = createStreamingTimeline(container);

  startThinkingBar(['Reviewing open questions…', 'Drafting options…', 'Waiting for your input…']);

  const recorded = await streamTaskSteps(
    container,
    timeline,
    getNeedsInputTailSteps(task),
    runId,
    { stepDelay: 700 },
  );

  stopThinkingBar();
  if (runId !== taskWorkRunId || !recorded) return;
}

function scheduleTaskCompletion(task) {
  if (pendingCompletionTaskId) return;
  pendingCompletionTaskId = task.id;
  setTimeout(() => {
    if (pendingCompletionTaskId !== task.id) return;
    if (task.status !== 'in-progress' || !isTaskWorkComplete(task)) {
      pendingCompletionTaskId = null;
      return;
    }
    finishTaskToReview(task);
  }, 1800);
}

function restartTaskWork(task) {
  task.files = 0;
  task.additions = 0;
  task.deletions = 0;
  task.commits = 0;
  task.prs = 0;
  task.workSimulated = false;
  task.workSteps = null;
  task.reviewReason = null;
  clearWorkTarget(task);
  pendingCompletionTaskId = null;

  if (completionPauseTimer) {
    clearTimeout(completionPauseTimer);
    completionPauseTimer = null;
  }

  activeSimulatedTaskId = task.id;
  ensureWorkTarget(task);

  if (activeTaskId === task.id) {
    const badge = $('#task-status-badge');
    badge.textContent = STATUS_LABELS['in-progress'];
    badge.className = 'status-badge in-progress';
    taskWorkRunId += 1;
    stopThinkingBar();
    const container = $('#task-chat-messages');
    container.innerHTML = '';
    appendTaskDescriptionBubble(container, task);
    runTaskAgentWork(task);
    renderDiff();
  }
}

function initInProgressSimulation() {
  tasks
    .filter((t) => t.status === 'in-progress')
    .forEach((t) => ensureWorkTarget(t));
  ensureActiveSimulatedTask({ allowDuringPause: true });
}

function hideSnackbar() {
  const root = $('#snackbar-root');
  if (!root) return;
  root.classList.remove('visible');
  if (snackbarTimer) {
    clearTimeout(snackbarTimer);
    snackbarTimer = null;
  }
  setTimeout(() => {
    if (!root.classList.contains('visible')) root.innerHTML = '';
  }, 280);
}

function showSnackbar(message, { taskId = null, variant = 'default', duration = 5000 } = {}) {
  const root = $('#snackbar-root');
  if (!root) return;

  const meta = REVIEW_REASONS[variant];
  const icon = meta?.icon || 'info';
  const iconClass = meta?.iconClass || 'lucide-muted';

  root.innerHTML = `
    <div class="snackbar snackbar--${variant}" data-task-id="${taskId || ''}" role="status">
      <span class="snackbar-icon">${iconHtml(icon, { size: 16, className: `lucide-icon ${iconClass}` })}</span>
      <span class="snackbar-message">${escapeHtml(message)}</span>
    </div>`;
  initIcons(root);

  requestAnimationFrame(() => root.classList.add('visible'));

  if (snackbarTimer) clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(hideSnackbar, duration);
}

function showTaskReviewSnackbar(task) {
  const meta = getReviewReasonMeta(task);
  if (!meta) return;
  showSnackbar(meta.snackbarMessage, {
    taskId: task.id,
    variant: task.reviewReason,
  });
}

function initSnackbar() {
  const root = $('#snackbar-root');
  if (!root) return;

  root.addEventListener('click', (e) => {
    const snackbar = e.target.closest('.snackbar');
    if (!snackbar?.dataset.taskId) return;
    hideSnackbar();
    openTaskDetail(snackbar.dataset.taskId);
  });
}

async function runTaskAgentWork(task) {
  const runId = ++taskWorkRunId;
  const container = $('#task-chat-messages');
  const plan = getTaskWorkPlan(task);
  if (plan.stats) ensureWorkTarget(task);

  startThinkingBar(plan.phrases);

  let typing = showTyping(container);
  await sleep(800 + Math.random() * 400);
  if (runId !== taskWorkRunId) return;
  typing.remove();

  const timeline = createStreamingTimeline(container);
  const recorded = await streamTaskSteps(container, timeline, plan.steps, runId, { stepDelay: 1000 });

  if (runId !== taskWorkRunId || !recorded) return;

  if (plan.stats) {
    task.commits = Math.max(task.commits, plan.stats.commits || 1);
    updateTaskCardStats(task);
    updateTaskCardMeta(task);
    if (activeTaskId === task.id) renderDiff();
  }

  task.workSimulated = true;
  task.workSteps = recorded;
  stopThinkingBar();
}

function initTaskChat() {
  initChatInput('task-chat-input', handleTaskChat);

  $('#task-chat-messages').addEventListener('click', (e) => {
    const btn = e.target.closest('.action-btn[data-action^="needs-input:"]');
    if (!btn || btn.disabled) return;

    const task = getTask(activeTaskId);
    if (!task || task.status !== 'review' || task.reviewReason !== 'needs-input') return;

    const optionId = btn.dataset.action.replace('needs-input:', '');
    const option = getNeedsInputPrompt(task).options.find((item) => item.id === optionId);
    if (!option) return;

    handleNeedsInputAnswer(task, option, btn);
  });
}

function renderTaskChat() {
  const container = $('#task-chat-messages');
  container.innerHTML = '';
  const task = getTask(activeTaskId);
  if (!task || task.status === 'backlog') return;

  appendTaskDescriptionBubble(container, task);

  if (task.chat.length > 0) {
    task.chat.forEach((msg) => {
      if (msg.role === 'user') appendUserBubble(container, msg.text);
      else appendAgentTimeline(container, msg.steps);
    });
    return;
  }

  if (task.workSteps?.length) {
    let steps = task.workSteps;
    if (task.status === 'review' && task.reviewReason === 'needs-input' && !needsInputTailAlreadyAppended(steps)) {
      steps = [...steps, ...getNeedsInputTailSteps(task)];
      task.workSteps = steps;
    }
    appendAgentTimeline(container, steps);
    return;
  }

  if (task.status !== 'in-progress' && task.status !== 'review') {
    appendAgentTimeline(container, [
      {
        type: 'file-read',
        dot: 'green',
        file: task.repo + '/README.md',
        desc: 'read task context',
        code: `<span class="key">"task"</span>: <span class="val">"${escapeHtml(task.title)}"</span>,
<span class="key">"status"</span>: <span class="val">"${STATUS_LABELS[task.status]}"</span>,
<span class="key">"agent"</span>: <span class="val">"${task.agentId ? getAgent(task.agentId).initials : 'Unassigned'}"</span>`,
      },
      {
        type: 'text',
        dot: 'gray',
        html: `<p>Task is in <strong>${STATUS_LABELS[task.status]}</strong>. Ask me to review, explain, or continue work.</p>`,
      },
    ]);
  }
}

async function handleTaskChat(text) {
  const task = getTask(activeTaskId);
  if (!task || task.status === 'backlog') return;

  const container = $('#task-chat-messages');
  appendUserBubble(container, text);
  task.chat.push({ role: 'user', text });

  const steps = generateTaskResponse(text, task);
  startThinkingBar(['Processing your message…', 'Planning next steps…']);

  let typing = showTyping(container);
  await sleep(700 + Math.random() * 500);
  typing.remove();

  const timeline = await thinkAndStream(container, steps, { stepDelay: 700, leadDelay: 0 });
  task.chat.push({ role: 'agent', steps });

  if (text.toLowerCase().includes('implement') || text.toLowerCase().includes('code')) {
    task.files = Math.max(task.files, 1);
    task.additions += Math.floor(Math.random() * 30) + 10;
    task.commits = Math.max(task.commits, 1);
    renderBoard();
    renderDiff();
  }

  stopThinkingBar();
}

function generateTaskResponse(text, task) {
  const lower = text.toLowerCase();

  if (lower.includes('joke')) {
    return [
      { type: 'label', dot: 'green', html: '<strong>Agent</strong> Responding…' },
      {
        type: 'text',
        dot: 'gray',
        html: `<p>A duck walks into a pharmacy and says, "Give me some chapstick — and put it on my bill."</p>
               <p>The pharmacist replies, "Sorry, we don't have a chapstick that big."</p>`,
      },
    ];
  }

  if (lower.includes('implement') || lower.includes('auth') || lower.includes('code')) {
    const planHint = task.repo === 'design'
      ? 'Match the interactive prototype and export updated tokens'
      : task.repo === 'backend'
        ? 'Implement against the budgets OpenAPI contract'
        : 'Wire UI to prototypes and @kimchi/api-contracts types';
    return [
      {
        type: 'bash',
        dot: 'green',
        label: '<strong>Bash</strong> Explore component structure',
        in: `ls ${task.repo === 'design' ? 'prototypes/budgets/' : `src/features/${task.repo}/`}`,
        out: task.repo === 'design'
          ? 'overview.canvas<br>detail.canvas<br>tokens.json'
          : '_components/<br>hooks/<br>types.ts',
      },
      {
        type: 'file-read',
        dot: 'green',
        file: task.repo === 'backend' ? 'openapi/budgets.yaml' : 'budgets-dashboard.tsx',
        desc: 'read the target artifact',
        code: task.repo === 'backend'
          ? `<span class="key">/budgets</span>: { <span class="key">get</span>, <span class="key">post</span> }`
          : `<span class="key">export function</span> BudgetsDashboard() { ... }`,
      },
      {
        type: 'text',
        dot: 'gray',
        html: `<p>I'll implement <strong>${escapeHtml(task.title)}</strong>. Plan:</p>
          <ol>
            <li>${planHint}</li>
            <li>Align with the budgets feature rollout</li>
            <li>Update tests and handoff notes</li>
          </ol>
          <p>Check the <strong>Changes</strong> tab for the diff.</p>`,
      },
      {
        type: 'actions',
        dot: 'red',
        buttons: [
          { label: 'Yes, execute', action: 'execute', primary: true },
          { label: "No, I'll request changes", action: 'changes' },
          { label: 'Cancel', action: 'cancel' },
        ],
      },
    ];
  }

  if (lower.includes('status') || lower.includes('how')) {
    const agent = task.agentId ? getAgent(task.agentId) : null;
    return [{
      type: 'text',
      dot: 'gray',
      html: `<p>Task is in <strong>${STATUS_LABELS[task.status]}</strong>${agent ? `, assigned to ${agent.name} (${agent.initials})` : ', unassigned'}.</p>
             <p>Changes: ${task.files} files, +${task.additions} -${task.deletions}</p>`,
    }];
  }

  return [{
    type: 'text',
    dot: 'gray',
    html: `<p>Got it. I'll keep working on <strong>${escapeHtml(task.title)}</strong>. Let me know if you want me to implement, review, or explain anything specific.</p>`,
  }];
}

/* ── Task Sidebar ── */
function renderTaskSidebar() {
  const sidebar = $('#task-sidebar');
  const columns = ['backlog', 'in-progress', 'review', 'closed'];

  sidebar.innerHTML = columns
    .map((status) => {
      const statusTasks = tasksForTaskSidebar().filter((t) => t.status === status);
      const items = statusTasks
        .map((t) => {
          const active = t.id === activeTaskId ? ' active' : '';
          return `<div class="sidebar-task${active}" data-id="${t.id}">
            <span class="sidebar-leading">${sidebarTaskLeadingHtml(t)}</span>
            <span class="sidebar-task-title">${escapeHtml(t.title)}</span>
          </div>`;
        })
        .join('');

      return `
        <div class="sidebar-section">
          <div class="sidebar-section-header">
            <span class="sidebar-leading"><span class="status-dot ${status}"></span></span>
            <span class="sidebar-section-label">
              ${STATUS_LABELS[status]}
              <span class="column-count">${statusTasks.length}</span>
            </span>
          </div>
          <div class="sidebar-section-body">${items}</div>
        </div>`;
    })
    .join('');

  sidebar.querySelectorAll('.sidebar-task').forEach((el) => {
    el.addEventListener('click', () => openTaskDetail(el.dataset.id));
  });

  sidebar.querySelectorAll('.sidebar-task-play').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      startTask(btn.dataset.taskId);
    });
  });
}

/* ── Rich selects (modal + chat compose) ── */
let openRichSelect = null;

function closeRichSelects() {
  if (!openRichSelect) return;
  const { wrap, trigger, menu } = openRichSelect;
  menu.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');
  openRichSelect = null;
}

function setRichSelectValue(wrap, options, valueId) {
  const option = options.find((o) => o.id === valueId) || options[0];
  const valueEl = wrap.querySelector('.rich-select-value');
  const input = wrap.querySelector('input[type="hidden"]');
  const menu = wrap.querySelector('.rich-select-menu');

  valueEl.textContent = option.label;
  input.value = option.id;
  menu.querySelectorAll('.rich-select-option').forEach((btn) => {
    const selected = btn.dataset.value === option.id;
    btn.classList.toggle('selected', selected);
    btn.setAttribute('aria-selected', String(selected));
  });
}

function initRichSelect(wrap, options) {
  if (!wrap) return;
  const defaultId = wrap.dataset.default || options[0].id;
  const trigger = wrap.querySelector('.rich-select-trigger');
  const menu = wrap.querySelector('.rich-select-menu');
  const placement = wrap.dataset.menuPlacement || 'down';

  menu.classList.toggle('rich-select-menu--up', placement === 'up');
  menu.classList.toggle('rich-select-menu--down', placement === 'down');

  menu.innerHTML = options.map((opt) => `
    <button type="button" class="rich-select-option${opt.id === defaultId ? ' selected' : ''}" role="option" data-value="${opt.id}" aria-selected="${opt.id === defaultId}">
      <span class="rich-select-option-title">${escapeHtml(opt.label)}</span>
      <span class="rich-select-option-desc">${escapeHtml(opt.desc)}</span>
    </button>`).join('');

  setRichSelectValue(wrap, options, defaultId);

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = openRichSelect?.wrap === wrap;
    closeRichSelects();
    if (!isOpen) {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      openRichSelect = { wrap, trigger, menu };
    }
  });

  menu.addEventListener('click', (e) => {
    const optBtn = e.target.closest('.rich-select-option');
    if (!optBtn) return;
    setRichSelectValue(wrap, options, optBtn.dataset.value);
    closeRichSelects();
  });
}

function resetModalSelects() {
  setRichSelectValue($('#permissions-select'), PERMISSION_MODES, 'yolo');
  setRichSelectValue($('#model-select'), MODEL_OPTIONS, 'multi');
}

function initRichSelects() {
  initRichSelect($('#permissions-select'), PERMISSION_MODES);
  initRichSelect($('#model-select'), MODEL_OPTIONS);
  initRichSelect($('#kanban-permissions-select'), PERMISSION_MODES);
  initRichSelect($('#kanban-model-select'), MODEL_OPTIONS);
  initRichSelect($('#task-permissions-select'), PERMISSION_MODES);
  initRichSelect($('#task-model-select'), MODEL_OPTIONS);
  initRichSelect($('#task-setup-permissions-select'), PERMISSION_MODES);
  initRichSelect($('#task-setup-model-select'), MODEL_OPTIONS);

  document.addEventListener('click', (e) => {
    if (e.target.closest('.rich-select-wrap')) return;
    closeRichSelects();
  });
}

function initModal() {
  const modal = $('#create-task-modal');
  const form = $('#create-task-form');
  const desc = $('#task-description');
  const createBtn = $('#modal-create-btn');
  const startBtn = $('#modal-start-btn');

  const openModal = () => {
    modal.showModal();
    desc.focus();
  };

  modal.addEventListener('close', closeRichSelects);
  form.addEventListener('reset', resetModalSelects);

  const updateButtons = () => {
    const hasText = desc.value.trim().length > 0;
    createBtn.disabled = !hasText;
    startBtn.disabled = !hasText;
  };

  desc.addEventListener('input', updateButtons);

  $('#create-task-btn').addEventListener('click', openModal);
  $('#modal-cancel').addEventListener('click', () => modal.close());

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  function addTask(status) {
    const fd = new FormData(form);
    const description = fd.get('description').trim();
    if (!description) return null;

    const title = description.split('\n')[0].trim() || description;
    const task = {
      id: uid(),
      title,
      description,
      repo: defaultRepoForNewTask(),
      status,
      agentId: null,
      permissionMode: fd.get('permissions'),
      model: fd.get('model'),
      prs: 0,
      commits: 0,
      files: 0,
      additions: 0,
      deletions: 0,
      chat: [],
    };
    tasks.push(task);
    renderBoard();
    return task;
  }

  createBtn.addEventListener('click', () => {
    const task = addTask('backlog');
    if (!task) return;
    if (!form.createMore.checked) {
      modal.close();
      form.reset();
      updateButtons();
    } else {
      desc.value = '';
      desc.focus();
      updateButtons();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = addTask('in-progress');
    if (!task) return;
    if (!form.createMore.checked) {
      modal.close();
      form.reset();
      updateButtons();
      openTaskDetail(task.id);
    } else {
      desc.value = '';
      desc.focus();
      updateButtons();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.open) return;
    if (e.metaKey && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!createBtn.disabled) createBtn.click();
    }
    if (e.metaKey && e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      if (!startBtn.disabled) form.requestSubmit();
    }
  });
}

/* ── Work Tabs ── */
function initWorkTabs() {
  $$('.work-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.work-tab').forEach((t) => t.classList.remove('active'));
      $$('.work-pane').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      $(`#pane-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

/* ── Misc Events ── */
function initEvents() {
  $('#breadcrumb-studio-link')?.addEventListener('click', openWorkspacesOverview);

  $('#workspaces-grid')?.addEventListener('click', (e) => {
    const tab = e.target.closest('.workspace-chart-tab');
    if (tab) {
      e.stopPropagation();
      const card = tab.closest('.workspace-card');
      if (card) switchWorkspaceChartTab(card, tab.dataset.chart);
      return;
    }

    const card = e.target.closest('.workspace-card');
    if (card?.dataset.workspaceId) openWorkspace(card.dataset.workspaceId);
  });

  $('#create-workspace-btn')?.addEventListener('click', () => {
    showSnackbar('Create workspace is not available in this prototype.');
  });

  $('#back-to-board').addEventListener('click', () => {
    activeTaskId = null;
    showView('board');
    renderBoard();
  });

  $('#close-task-btn').addEventListener('click', () => {
    const task = getTask(activeTaskId);
    if (task) closeTask(task);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'c' && !e.metaKey && !e.ctrlKey && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      const modal = $('#create-task-modal');
      modal.showModal();
      $('#task-description').focus();
    }
  });

  // Delegate task-created clicks in kanban chat
  $('#kanban-chat-messages').addEventListener('click', (e) => {
    const el = e.target.closest('.task-created');
    if (el?.dataset.taskId) openTaskDetail(el.dataset.taskId);
  });

  $$('.repo-tab:not(.add-repo)').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.repo-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeRepo = tab.dataset.repo || 'all';
      activeAssignee = null;
      renderBoard();
    });
  });

  $('#board-avatar-stack')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.avatar-stack-btn');
    if (!btn?.dataset.agentId) return;
    activeAssignee = activeAssignee === btn.dataset.agentId ? null : btn.dataset.agentId;
    renderBoard();
  });

  $$('.column-play-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      startAllColumnTasks(btn.dataset.startColumn);
    });
  });

  $('#archive-closed-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    archiveClosedTasks();
  });
}

function initTooltips() {
  let tooltip = $('#app-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'app-tooltip';
    tooltip.className = 'app-tooltip';
    tooltip.hidden = true;
    document.body.appendChild(tooltip);
  }

  let activeAnchor = null;

  const hideTooltip = () => {
    activeAnchor = null;
    tooltip.hidden = true;
  };

  const positionTooltip = (anchor) => {
    const text = anchor.dataset.tooltip;
    if (!text) return;

    tooltip.textContent = text;
    tooltip.hidden = false;

    const rect = anchor.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();
    const gap = 6;
    let top = rect.top - tipRect.height - gap;
    let left = rect.left + rect.width / 2 - tipRect.width / 2;

    left = Math.max(8, Math.min(left, window.innerWidth - tipRect.width - 8));
    if (top < 8) top = rect.bottom + gap;

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  };

  const showTooltip = (anchor) => {
    activeAnchor = anchor;
    positionTooltip(anchor);
  };

  document.querySelectorAll('.has-tooltip').forEach((el) => {
    el.addEventListener('mouseenter', () => showTooltip(el));
    el.addEventListener('mouseleave', hideTooltip);
    el.addEventListener('focus', () => showTooltip(el));
    el.addEventListener('blur', hideTooltip);
  });

  window.addEventListener('scroll', () => {
    if (activeAnchor) positionTooltip(activeAnchor);
  }, true);
  window.addEventListener('resize', () => {
    if (activeAnchor) positionTooltip(activeAnchor);
  });
}

/* ── Init ── */
function hydrateNeedsInputReviewTasks() {
  tasks.forEach((task) => {
    if (task.status === 'review' && task.reviewReason === 'needs-input' && !task.workSteps) {
      task.workSteps = getFullNeedsInputChatSteps(task);
    }
  });
}

function init() {
  initIcons();
  hydrateNeedsInputReviewTasks();
  initInProgressSimulation();
  renderBoard();
  initDragDrop();
  initTaskLinks();
  initInProgressStatsTick();
  initAssigneeMenu();
  initKanbanChat();
  initTaskChat();
  initRichSelects();
  initTaskSetup();
  initModal();
  initWorkTabs();
  initSnackbar();
  initWorkspaceStatsMenus();
  initTooltips();
  initWorkspaceChartTooltips();
  initEvents();
  renderDiff();
}

init();

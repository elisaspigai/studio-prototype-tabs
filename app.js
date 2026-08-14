import { iconHtml, initIcons } from './icons.js';

/* ── Agents ── */
const STATUS_LABELS = {
  backlog: 'Backlog',
  'in-progress': 'In progress',
  review: 'Review',
  'pr-review': 'Review',
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

const DELIVERY_MODES = [
  { id: 'manual', label: 'Manual PR', desc: 'You commit and open PRs yourself' },
  { id: 'auto-pr', label: 'Auto PR', desc: 'Open a pull request when work completes' },
  { id: 'auto-commit', label: 'Auto commit', desc: 'Commit changes directly without a PR' },
];

const REVIEW_REASONS = {
  'needs-input': {
    icon: 'message-circle',
    cardLabel: 'Needs you',
    iconClass: 'lucide-orange',
    snackbarMessage: '1 agent needs you',
  },
  ready: {
    icon: 'check-check',
    cardLabel: 'Idle',
    iconClass: 'lucide-teal',
    snackbarMessage: 'Review finished task',
  },
  comments: {
    icon: 'message-circle',
    cardLabel: 'Comments',
    iconClass: 'lucide-orange',
    snackbarMessage: 'Unresolved PR comments',
  },
  'ci-failed': {
    icon: 'x',
    cardLabel: 'CI failed',
    iconClass: 'lucide-orange',
    snackbarMessage: 'Pipeline failed',
  },
  'merge-ready': {
    icon: 'git-pull-request',
    cardLabel: 'Merge ready',
    iconClass: 'lucide-teal',
    snackbarMessage: 'PR ready to merge',
  },
};

const AGENT_REVIEW_REASONS = new Set(['needs-input', 'ready']);
const PR_REVIEW_REASONS = new Set(['comments', 'ci-failed', 'merge-ready']);
const OVERVIEW_STATUS_COLUMNS = ['in-progress', 'review', 'pr-review', 'closed'];
const OVERVIEW_COLUMN_LABELS = {
  'in-progress': 'In progress',
  review: 'Needs you / Idle',
  'pr-review': 'Review',
  closed: 'Merged',
};

const SIDEBAR_SECTIONS = {
  design: [
    { id: 'needs-input', label: 'Needs you', dot: 'needs-input' },
    { id: 'in-progress', label: 'In progress', dot: 'in-progress' },
    { id: 'done', label: 'Open', dot: 'done', showArchiveBtn: true },
    { id: 'archive', label: 'Archive', icon: 'archive' },
  ],
  code: [
    { id: 'needs-input', label: 'Needs you', dot: 'needs-input' },
    { id: 'in-progress', label: 'In progress', dot: 'in-progress' },
    { id: 'done', label: 'Done', dot: 'done' },
    { id: 'merged', label: 'Merged', dot: 'merged', showArchiveBtn: true },
    { id: 'archive', label: 'Archive', icon: 'archive' },
  ],
  chat: [
    { id: 'archive', label: 'Archive', icon: 'archive' },
  ],
};


/* ── State ── */
let tasks = [
  {
    id: 't1',
    title: 'Prototype budgets overview screen',
    repo: 'design',
    status: 'in-progress',
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
    status: 'pr-review',
    reviewReason: 'comments',
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
    prs: 0,
    commits: 3,
    files: 6,
    additions: 142,
    deletions: 18,
    chat: [],
  },
  {
    id: 't4',
    title: 'Budget period selector component',
    repo: 'frontend',
    status: 'review',
    reviewReason: 'needs-input',
    prs: 0,
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
    status: 'pr-review',
    reviewReason: 'ci-failed',
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
    status: 'review',
    reviewReason: 'needs-input',
    prs: 0,
    commits: 1,
    files: 2,
    additions: 24,
    deletions: 0,
    chat: [],
  },
  {
    id: 't7',
    title: 'Wire budget cards to API contracts',
    repo: 'frontend',
    status: 'pr-review',
    reviewReason: 'merge-ready',
    prs: 1,
    commits: 2,
    files: 3,
    additions: 58,
    deletions: 9,
    chat: [],
  },
  {
    id: 't8',
    title: 'Add budget threshold alert endpoints',
    repo: 'backend',
    status: 'in-progress',
    prs: 0,
    commits: 1,
    files: 2,
    additions: 37,
    deletions: 4,
    chat: [],
  },
  {
    id: 't9',
    title: 'Fix incorrect settings icon in sidebar',
    repo: 'frontend',
    status: 'review',
    reviewReason: 'ready',
    prs: 0,
    commits: 1,
    files: 1,
    additions: 1,
    deletions: 1,
    chat: [],
  },
  {
    id: 't10',
    title: 'Fix dashboard spend totals discrepancy',
    repo: 'backend',
    status: 'in-progress',
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

const TASK_PROJECTS = {
  t6: 'hackathon',
  t9: 'one-click',
  t10: 'one-click',
  t11: 'hackathon',
  t14: 'one-click',
};

// Most tasks get their own worktree. Two same-column pairs demo the grouping UI.
const TASK_WORKTREES = {
  t1: 'worktree-3',
  t2: 'worktree-1', // pair with t7 (Review column)
  t3: 'worktree-4',
  t4: 'worktree-5',
  t5: 'worktree-6',
  t6: 'worktree-7',
  t7: 'worktree-1', // pair with t2 (Review column)
  t8: 'worktree-2', // pair with t10 (In progress)
  t9: 'worktree-8',
  t10: 'worktree-2', // pair with t8 (In progress)
  t11: 'worktree-9',
  t12: 'worktree-10',
  t13: 'worktree-11',
  t14: 'worktree-12',
};

tasks.forEach((task) => {
  if (!task.description) {
    task.description = TASK_DESCRIPTIONS[task.id] || task.title;
  }
  task.project = TASK_PROJECTS[task.id] || 'kimchi';
  task.worktree = TASK_WORKTREES[task.id] || `worktree-${task.id}`;
});

const TASK_ARCHIVED = {
  t11: { prGitStatus: 'Merged' },
  t13: { prGitStatus: 'Merged' },
  t14: { prGitStatus: 'Closed' },
};

const TASK_ARCHIVE_SUMMARIES = {
  t11: [
    'Shipped first-run empty states for workspaces with no budgets',
    'Added create-budget CTA and illustration placeholders',
    'Aligned onboarding copy with design handoff',
  ],
  t13: [
    'Replaced spinner fallbacks with row-height skeletons',
    'Matched column layout from the design prototype',
    'Verified loading states across light and dark themes',
  ],
  t14: [
    'Fixed avatar chip icon mismatch in agent picker',
    'Aligned theme variant with kanban card icon set',
    'PR closed without merge after picking up in a follow-up task',
  ],
};

tasks.forEach((task) => {
  const archiveMeta = TASK_ARCHIVED[task.id];
  if (!archiveMeta) return;
  task.archived = true;
  task.archivePrGitStatus = archiveMeta.prGitStatus;
  task.archiveSummary = TASK_ARCHIVE_SUMMARIES[task.id] || [];
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

function hydrateMockModeChats() {
  const designMocks = {
    t1: [
      {
        role: 'user',
        text: 'Create a prototype of the budgets overview — summary strip, category list, and period toggle.',
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Building overview prototype…' },
          {
            type: 'file-read',
            dot: 'green',
            file: 'prototypes/budgets/overview.canvas',
            desc: 'layout overview frames',
            code: `<span class="key">Frame</span>: BudgetsOverview
<span class="key">Components</span>: summary strip, category list, period toggle`,
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>First pass is in the artifact preview — summary metrics, category rows, and a month/quarter toggle.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Add alert pills on rows above 80% utilization',
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Adding threshold indicators…' },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Added amber alert pills with hover tooltips showing current spend vs. budget cap. Rows under 80% stay neutral.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Can we add a subtle animation to the period toggle so the switch feels responsive?',
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Adding interaction details…' },
          {
            type: 'file-read',
            dot: 'green',
            file: 'prototypes/budgets/overview.canvas',
            desc: 'update interaction specs',
            code: `<span class="key">Interaction</span>: periodToggle
<span class="key">Motion</span>: 150ms ease-out scale + translate
<span class="key">States</span>: week, month, quarter`,
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Added a 150ms ease-out transition to the toggle thumb and matched the easing token from the design system. The prototype now cycles through week, month, and quarter states.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Looks good — export the handoff bundle so frontend can pick it up.',
      },
      {
        role: 'agent',
        steps: [
          {
            type: 'bash',
            dot: 'green',
            label: '<strong>Bash</strong> Export handoff bundle',
            in: 'kimchi proto export budgets --frame overview',
            out: '✓ tokens + HTML/CSS exported',
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Handoff bundle exported. Frontend can pull the standalone HTML/CSS and match spacing tokens from <code>design-handoff/budgets/tokens.json</code>.</p>',
          },
        ],
      },
    ],
    t3: [
      {
        role: 'user',
        text: 'Does the budgets overview prototype include hover states for the category rows?',
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Checking prototype handoff…' },
          {
            type: 'file-read',
            dot: 'green',
            file: 'prototypes/budgets/overview.canvas',
            desc: 'category row interactions',
            code: `<span class="key">Row</span>: CategoryRow
<span class="key">Hover</span>: surface-elevated background
<span class="key">Active</span>: row expands to BudgetDetail`,
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Yes — rows lift on hover with a surface-elevated background and expand to a detail panel on click. The handoff notes include the exact padding and transition timing.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Which spacing tokens should I use for the dashboard grid?',
      },
      {
        role: 'agent',
        steps: [
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Use these tokens from the handoff:</p><ul><li><code>spacing.grid-gap</code>: 16px between cards</li><li><code>spacing.page-padding</code>: 24px horizontal</li><li><code>spacing.section-gap</code>: 32px below the summary strip</li></ul>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Got it — I will align the dashboard layout to the prototype specs.',
      },
      {
        role: 'agent',
        steps: [
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Sounds good. Ping me when the grid is wired and I can compare the rendered layout against the prototype frames.</p>',
          },
        ],
      },
    ],
    t4: [
      {
        role: 'user',
        text: 'What are the exact width and keyboard interaction specs for the period selector?',
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Pulling selector specs…' },
          {
            type: 'file-read',
            dot: 'green',
            file: 'prototypes/budgets/period-selector.canvas',
            desc: 'segmented control specs',
            code: `<span class="key">Width</span>: 240px
<span class="key">Height</span>: 36px
<span class="key">Keyboard</span>: Left/Right arrows, Enter to confirm`,
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>The selector is a 240px-wide segmented control with arrow-key navigation. Focus wraps at the ends and Enter commits the selection to the URL.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Should the selected state use the accent or primary color token?',
      },
      {
        role: 'agent',
        steps: [
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Use <code>color.primary</code> for the active segment background and <code>color.text-on-primary</code> for the label. The inactive segments keep <code>color.surface</code> with a subtle border.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Primary it is. I will match the token names from the handoff.',
      },
      {
        role: 'agent',
        steps: [
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Perfect. Once the component is built, we can drop it into the overview prototype to verify the transition timing.</p>',
          },
        ],
      },
    ],
    t6: [
      {
        role: 'user',
        text: 'Prototype budget editing and alert threshold configuration — include validation errors and confirmation states.',
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Scaffolding edit flow…' },
          {
            type: 'file-read',
            dot: 'green',
            file: 'prototypes/budgets/editing-flow.canvas',
            desc: 'edit modal + threshold panel',
            code: `<span class="key">Frames</span>: EditBudgetModal, ThresholdPanel, AlertBanner
<span class="key">States</span>: default, validation error, save confirmation`,
          },
          {
            type: 'bash',
            dot: 'green',
            label: '<strong>Bash</strong> Link flow hotspots',
            in: 'kimchi proto link editing-flow.canvas --hotspots save-btn,threshold-input',
            out: '4 hotspots wired',
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Edit modal covers amount, category, and inline validation. Threshold panel opens from the alert pill with save/cancel paths.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Should threshold confirmation be a separate step or inline with the amount field?',
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Blocked on a product decision…' },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>I have a question before I can finish <strong>Prototype budget editing &amp; alert flows</strong>:</p><p>Should the alert threshold confirmation be a modal or an inline expand below the amount field?</p>',
          },
          {
            type: 'actions',
            dot: 'gray',
            buttons: [
              { label: 'Modal confirmation', action: 'needs-input:modal', primary: true },
              { label: 'Inline expand', action: 'needs-input:inline', primary: false },
              { label: 'Defer to v2', action: 'needs-input:defer', primary: false },
            ],
          },
        ],
      },
      {
        role: 'user',
        text: "Let's go with modal confirmation to reduce accidental threshold changes.",
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Updating confirmation flow…' },
          {
            type: 'bash',
            dot: 'green',
            label: '<strong>Bash</strong> Re-link confirmation hotspot',
            in: 'kimchi proto link editing-flow.canvas --hotspots save-btn,threshold-input,confirm-modal',
            out: '5 hotspots wired',
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Added a confirmation modal frame that shows the old and new threshold values. The prototype now flows: edit amount → set threshold → confirm → alert banner update.</p>',
          },
        ],
      },
    ],
    t7: [
      {
        role: 'user',
        text: 'Which API fields from the budgets contract map to the spent and limit labels on the card?',
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Reading API contract…' },
          {
            type: 'file-read',
            dot: 'green',
            file: 'openapi/budgets.yaml',
            desc: 'BudgetSummary schema',
            code: `<span class="key">spent</span>: <span class="val">number</span>
<span class="key">limit</span>: <span class="val">number</span>
<span class="key">utilization</span>: <span class="val">number (computed)</span>`,
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Map <code>spent</code> to the left metric and <code>limit</code> to the right. The API also returns <code>utilization</code> as a computed ratio so you do not need to calculate it client-side.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Does the card support a category breakdown from the design prototype?',
      },
      {
        role: 'agent',
        steps: [
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Not in this scope. The prototype shows a summary card only. Categories will come from the backend migration in t12, so we can add a category breakdown in a follow-up task.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'I will start with summary fields and add categories once the migration lands.',
      },
      {
        role: 'agent',
        steps: [
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Good call. Keep the card props limited to <code>BudgetSummary</code> for now and we will extend the type when categories are available.</p>',
          },
        ],
      },
    ],
    t11: [
      {
        role: 'user',
        text: 'Design empty states and onboarding for when a workspace has no budgets yet.',
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Building first-run empty state…' },
          {
            type: 'file-read',
            dot: 'green',
            file: 'prototypes/budgets/empty-states.canvas',
            desc: 'empty + onboarding copy',
            code: `<span class="key">States</span>: zero-budgets, first-run CTA, skeleton loader
<span class="key">Copy</span>: headline, helper text, create-budget button`,
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Empty state includes illustration placeholder, headline, and a primary CTA to create the first budget. Onboarding tooltip walks through the summary strip.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Looks good — ship it for engineering handoff',
      },
      {
        role: 'agent',
        steps: [
          {
            type: 'bash',
            dot: 'green',
            label: '<strong>Bash</strong> Export handoff bundle',
            in: 'kimchi proto export budgets --frame empty-states',
            out: '✓ tokens + HTML/CSS exported',
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Marked ready for handoff. Frontend can pull the standalone HTML/CSS and match spacing tokens from the export.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Can we add a one-minute onboarding tooltip tour for first-time users?',
      },
      {
        role: 'agent',
        steps: [
          {
            type: 'text',
            dot: 'gray',
            html: '<p>I can add a three-step tooltip tour: summary strip, create-budget CTA, and period selector. Should the tour auto-start or appear on demand from a help button?</p>',
          },
          {
            type: 'actions',
            dot: 'gray',
            buttons: [
              { label: 'Auto-start on first visit', action: 'needs-input:auto', primary: true },
              { label: 'Show on help button click', action: 'needs-input:manual', primary: false },
            ],
          },
        ],
      },
    ],
    t13: [
      {
        role: 'user',
        text: 'What is the row height and column spacing for the budget list skeleton?',
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Pulling skeleton specs…' },
          {
            type: 'file-read',
            dot: 'green',
            file: 'prototypes/budgets/overview.canvas',
            desc: 'budget row geometry',
            code: `<span class="key">Row height</span>: 56px
<span class="key">Columns</span>: name, spent, limit, utilization, actions
<span class="key">Gap</span>: 12px between rows`,
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>The skeleton row should mirror the final row height of 56px and match the five-column layout so there is no layout shift when data loads.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Should the skeletons pulse or use a static shimmer?',
      },
      {
        role: 'agent',
        steps: [
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Use the static shimmer animation from the design system — it matches the skeleton used in other lists and avoids the higher contrast of a pulsing block.</p>',
          },
        ],
      },
      {
        role: 'user',
        text: 'Static shimmer matches the rest of the app. Export the specs so I can implement the component.',
      },
      {
        role: 'agent',
        steps: [
          {
            type: 'bash',
            dot: 'green',
            label: '<strong>Bash</strong> Export skeleton specs',
            in: 'kimchi proto export budgets --frame skeleton-specs',
            out: '✓ skeleton tokens exported',
          },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Exported. The component should render four skeleton rows by default, matching the page size in the API contract.</p>',
          },
        ],
      },
    ],
  };

  const generalMocks = {
    t1: [
      {
        role: 'user',
        text: 'How do budget alerts work in Kimchi? When do users actually get notified?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Budget alerts trigger when spend crosses a threshold you set per budget — typically 80%, 90%, or 100%. Kimchi shows an in-app banner first, then email if the alert stays active for 24 hours.</p><p>Alerts are evaluated on a rolling window matching the budget period (week, month, quarter).</p>',
        }],
      },
      {
        role: 'user',
        text: 'Can one budget have multiple thresholds, or just one?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>One threshold per budget today. Multiple thresholds are on the roadmap — the Granola research called out wanting both warning and critical levels.</p>',
        }],
      },
      {
        role: 'user',
        text: 'What should the overview prototype surface about alerts so users understand the behavior?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Show the alert pill on rows above 80% utilization and a tooltip explaining the threshold. Keep the banner out of the overview scope; it belongs to the editing flow in t6.</p>',
        }],
      },
    ],
    t2: [
      {
        role: 'user',
        text: 'What is the current status of the budgets CRUD API?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>The list, create, and update routes are implemented in <code>src/routes/budgets.ts</code>. Integration tests cover happy paths and validation errors. TypeScript types were generated from the OpenAPI contract.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Do we need soft deletes or hard deletes for budgets?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Soft delete via an <code>archivedAt</code> timestamp. Hard delete is risky for audit trails and would cascade to spend history. The archive endpoint is already in the router.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Any blockers before I move this to review?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>One open question: should budget names be unique per workspace? The spec does not say, and the integration tests currently allow duplicates. Decide before review.</p>',
        }],
      },
    ],
    t3: [
      {
        role: 'user',
        text: 'How should the budgets dashboard fetch data on initial load?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Use the new <code>useBudgets</code> hook. It calls <code>GET /budgets</code> server-side paginated and returns a summary array. Pass the result into the dashboard grid.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Does the prototype define empty and error states for the dashboard?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Yes — the empty state comes from t11 and the error state uses the generic ErrorBoundary card. Match the exact copy and illustration placeholders from the handoff.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Should we prefetch budget categories too, or keep the first version lean?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Keep it lean. Categories depend on the t12 migration. Wire only summary fields now and extend the hook once categories are available in the API.</p>',
        }],
      },
    ],
    t4: [
      {
        role: 'user',
        text: 'Is the period selector a controlled or uncontrolled component?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Controlled. The source of truth is the <code>period</code> query parameter, and the component reflects that value. This keeps the dashboard shareable via URL.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Should selecting a period update the URL or just local React state?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Update the URL with <code>router.replace</code>. That way the back button works and users can bookmark a specific period view.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Which analytics event should we fire when the period changes?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Fire <code>budget_period_changed</code> with properties <code>from</code>, <code>to</code>, and <code>source: "selector"</code>. Add it to the existing analytics dictionary.</p>',
        }],
      },
    ],
    t5: [
      {
        role: 'user',
        text: 'Is the budgets OpenAPI contract ready to publish?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Yes — the schema is at version 1.0.0 and covers CRUD, threshold updates, and alert payloads. The linter passes and examples are included for every request body.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Where will the generated TypeScript types live so frontend can import them?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>They will be published to the <code>@kimchi/api-contracts</code> package. Frontend can import <code>BudgetSummary</code>, <code>CreateBudgetInput</code>, and <code>BudgetAlert</code> from there.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Do we need to version the contract separately from the app release?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>For now the contract version matches the API minor version. Once we hit public beta we should move to date-based versioning so external integrations do not break.</p>',
        }],
      },
    ],
    t6: [
      {
        role: 'user',
        text: 'Analyze the user research from our Granola interview about budget editing flows.',
      },
      {
        role: 'agent',
        steps: [
          { type: 'label', dot: 'green', html: '<strong>Agent</strong> Reviewing Granola notes…' },
          {
            type: 'text',
            dot: 'gray',
            html: '<p>Three themes from the Granola session:</p><ul><li><strong>Inline editing expected</strong> — users tried to click the amount directly, not an Edit button.</li><li><strong>Threshold confusion</strong> — 2 of 3 participants didn\'t understand alert thresholds until prompted.</li><li><strong>Confirmation anxiety</strong> — saving a lower threshold needed explicit confirmation copy.</li></ul>',
          },
        ],
      },
      {
        role: 'user',
        text: 'What should we prioritize for the hackathon MVP?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Ship inline amount edit plus a single threshold field with validation errors. Defer multi-threshold and email alerts — the interview pain was discoverability, not notification channels.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Should we include a destructive confirmation when lowering a threshold?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Yes. Lowering a threshold can trigger an immediate alert, so show a modal summarizing the old and new value. Use the same pattern for archive actions to keep the UX consistent.</p>',
        }],
      },
    ],
    t7: [
      {
        role: 'user',
        text: 'Which hook should fetch data for the budget cards?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Use <code>useBudget(budgetId)</code> for individual cards and <code>useBudgets()</code> for the list. Both wrap the generated <code>@kimchi/api-contracts</code> clients and share query keys.</p>',
        }],
      },
      {
        role: 'user',
        text: 'How do we handle pagination when a workspace has many budgets?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>The list endpoint is server-side paginated with <code>cursor</code> and <code>limit</code>. Use an infinite query in the dashboard and render a "Load more" button at the bottom of the grid.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Should cards refetch after a budget update?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Yes. Invalidate both the single-budget query key and the list query key after a successful mutation so the card and dashboard stay in sync.</p>',
        }],
      },
    ],
    t8: [
      {
        role: 'user',
        text: 'What shape should the budget alert webhook payload have?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Include <code>event</code>, <code>budgetId</code>, <code>workspaceId</code>, <code>thresholdPercent</code>, <code>currentSpendPercent</code>, and <code>triggeredAt</code>. Keep it flat so consumers can filter easily.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Should clients acknowledge alerts or is fire-and-force enough?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Provide a <code>POST /budgets/:id/alerts/acknowledge</code> endpoint. The backend can then suppress repeat webhooks for the same threshold crossing until spend drops below the threshold again.</p>',
        }],
      },
      {
        role: 'user',
        text: 'How often are thresholds evaluated?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Every 15 minutes via a scheduled worker. The worker reads the latest spend aggregates and emits events only when a budget crosses from one alert zone to another.</p>',
        }],
      },
    ],
    t9: [
      {
        role: 'user',
        text: 'Which icon should replace the sliders icon in the sidebar settings item?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Use the Lucide <code>Settings</code> gear icon. It is the standard metaphor and matches the icon used in the account dropdown.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Is the Settings icon available in both light and dark themes?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Yes. Lucide icons inherit the current text color, so the gear will adapt automatically. No extra theme handling is needed.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Do we need to update any tests for this change?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>The unit test snapshots will update when you change the import. Add a visual regression test so the correct icon is captured in both themes.</p>',
        }],
      },
    ],
    t10: [
      {
        role: 'user',
        text: 'What is causing the dashboard spend totals discrepancy?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>The header total excludes refunds while the chart series includes them. That causes the two numbers to diverge whenever a refund is applied within the selected period.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Why were refunds excluded from the header total in the first place?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>It was legacy behavior from the first dashboard iteration. The original intent was to show "net spend," but the chart series was never updated to match.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Will fixing this change the API response shape?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>No new fields, but the value of <code>total</code> will increase when refunds exist. Add a note to the changelog so consumers know the aggregate is now consistent with the series.</p>',
        }],
      },
    ],
    t11: [
      {
        role: 'user',
        text: 'Suggest onboarding copy for the first-run empty state.',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Here are three directions:</p><p><strong>1. Outcome-led:</strong> "Track your team\'s cloud spend before it surprises you."</p><p><strong>2. Action-led:</strong> "Create your first budget to start tracking spend."</p><p><strong>3. Education-led:</strong> "Budgets help you set limits and get alerts before costs spike."</p>',
        }],
      },
      {
        role: 'user',
        text: 'Which variant works best for self-serve users who skipped the demo?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Use the action-led variant (#2). Self-serve users want the next step immediately. Keep the education copy in a secondary tooltip that appears on hover of the headline.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Should we skip onboarding for workspaces that already have budgets?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Yes. Gate the empty state and tooltip tour on <code>budgets.length === 0</code>. Existing workspaces should see the normal dashboard without interruption.</p>',
        }],
      },
    ],
    t12: [
      {
        role: 'user',
        text: 'What is the migration plan for budget categories?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Create a new <code>budget_categories</code> table, add a nullable foreign key on budgets, backfill categories from existing labels, then make the foreign key non-nullable in a follow-up deploy.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Will existing budgets break during the migration?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>No. The category foreign key is nullable in the first migration, and the API continues to return budgets without a category. Seed data will be mapped to an "Uncategorized" label during backfill.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Is the rollback path tested for staging?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Yes. The migration is wrapped in a transaction and the staging dry run completed successfully. Rollback drops the new table and restores the previous column state.</p>',
        }],
      },
    ],
    t13: [
      {
        role: 'user',
        text: 'Why replace spinners with skeletons for budget rows?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Skeletons reduce perceived loading time and prevent layout shift because they match the final row dimensions. Spinners draw attention to the wait state instead of the content.</p>',
        }],
      },
      {
        role: 'user',
        text: 'How many skeleton rows should the list render?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Render four skeleton rows by default. That matches the default page size in the API contract and keeps the container height stable before data arrives.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Should we use the generic Skeleton component or a budget-specific one?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Create a <code>BudgetListSkeleton</code> component that composes the generic <code>Skeleton</code>. That keeps row geometry isolated and reusable across budget views.</p>',
        }],
      },
    ],
    t14: [
      {
        role: 'user',
        text: 'Which icon is mismatched in the agent picker dropdown?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>The dropdown uses <code>UserRound</code> while the kanban assignee chips use <code>UserCircle2</code>. Replace the picker import with <code>UserCircle2</code> to align both contexts.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Does this affect the dark theme variant only?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>No, both themes show the wrong icon. The mismatch is in the component code, not the theme tokens. The fix is a one-line import and usage swap.</p>',
        }],
      },
      {
        role: 'user',
        text: 'Is there a one-click fix we can ship for this?',
      },
      {
        role: 'agent',
        steps: [{
          type: 'text',
          dot: 'gray',
          html: '<p>Yes. Update <code>src/components/tasks/assignee-picker.tsx</code> to import and render <code>UserCircle2</code>, then run the component tests. The change is safe and self-contained.</p>',
        }],
      },
    ],
  };

  tasks.forEach((task) => {
    if (designMocks[task.id] && !(task.designChat?.length)) {
      task.designChat = designMocks[task.id];
    }
    if (generalMocks[task.id] && !(task.generalChat?.length)) {
      task.generalChat = generalMocks[task.id];
    }
  });
}

hydrateMockModeChats();

let activeTaskId = null;
let activeRepo = ['all'];
let subheaderView = 'project';
let overviewLayout = 'status'; // 'status' | 'projects' (code/design overview)
let overviewPreviewTaskId = null;
let overviewPreviewCloseTimer = null;
let overviewKanbanCompressed = false;
let overviewArchiveOpen = false;
let overviewArchiveQuery = '';
let overviewPreviewColumnWidths = null;
const OVERVIEW_PREVIEW_ANIM_MS = 400;
const OVERVIEW_KANBAN_COMPRESSED_WIDTH = 48;
const OVERVIEW_PREVIEW_CHAT_MIN = 220;
const OVERVIEW_PREVIEW_WORK_MIN = 320;
const OVERVIEW_PREVIEW_CHAT_WIDTH_KEY = 'studio-overview-preview-chat-width';
const OVERVIEW_KANBAN_FOCUS_MIN = 200;
const OVERVIEW_PREVIEW_PANEL_MIN = 480;
const OVERVIEW_KANBAN_FOCUS_WIDTH_KEY = 'studio-overview-kanban-focus-width';
const modeOpenedOnce = {
  design: false,
  code: false,
};
let activeWorkspaceId = 'kimchi';
let activeWorkspaceChartTab = 'tasks';
let activeAppMode = 'chat';
let designArtifactHtml = null;

const sidebarSectionCollapsed = {
  chat: { archive: true },
  design: { archive: true },
  code: { archive: true },
};

const DIRECTORY_SKILLS = [
  { id: 'design-eval', slug: '/nn-group-design-eval', author: 'mike@cast.ai', uses: 4, source: 'shared', desc: 'Evaluates UX designs against NN/g heuristics and accessibility standards.' },
  { id: 'mcp-apps', slug: '/mcp-apps', author: 'daniel@monograph.com', uses: 4, source: 'shared', desc: 'Convenient CLI for managing MCP apps and local tool servers.' },
  { id: 'gsd-plan', slug: '/gsdcreateplan-phase', author: 'b@useplumb.com', uses: 4, source: 'organization', desc: 'Entry point for GSD planning — creates PROJECT.md and ROADMAP.md.' },
  { id: 'slack-search', slug: '/slack-search', author: 'team@kimchi.dev', uses: 12, source: 'organization', desc: 'Search Slack channels and threads for product context and decisions.' },
  { id: 'budget-copy', slug: '/budget-copy-review', author: 'design@kimchi.dev', uses: 3, source: 'anthropic', desc: 'Reviews pricing and budget UI copy for clarity and conversion.' },
  { id: 'proto-handoff', slug: '/prototype-handoff', author: 'mike@cast.ai', uses: 6, source: 'anthropic', desc: 'Packages HTML/CSS prototypes with tokens for engineering handoff.' },
];

const DIRECTORY_CONNECTORS = [
  { id: 'gmail', name: 'Gmail', badge: '#2 popular', desc: 'Draft replies, summarize threads, and search your inbox.', color: '#ea4335', letter: 'M' },
  { id: 'figma', name: 'Figma', badge: null, desc: 'Generate diagrams and better code from Figma context.', color: '#a259ff', letter: 'F' },
  { id: 'google-drive', name: 'Google Drive', badge: null, desc: 'Search, read, and upload files instantly.', color: '#34a853', letter: 'D' },
  { id: 'google-calendar', name: 'Google Calendar', badge: null, desc: 'Manage your schedule and coordinate meetings effortlessly.', color: '#4285f4', letter: 'C' },
  { id: 'atlassian', name: 'Atlassian Rovo', badge: null, desc: 'Access Jira and Confluence from Kimchi.', color: '#0052cc', letter: 'A' },
  { id: 'slack', name: 'Slack', badge: 'Most popular', desc: 'Send messages, create canvases, and fetch Slack data.', color: '#611f69', letter: 'S' },
  { id: 'granola', name: 'Granola', badge: null, desc: 'The AI notepad for meetings — sync notes into project context.', color: '#f59e0b', letter: 'G' },
  { id: 'asana', name: 'Asana', badge: 'Interactive', desc: 'Connect to Asana to coordinate tasks, projects, and goals.', color: '#f06a6a', letter: 'A' },
  { id: 'sentry', name: 'Sentry', badge: null, desc: 'Search, query, and debug errors intelligently.', color: '#362d59', letter: 'Se' },
  { id: 'zoominfo', name: 'ZoomInfo', badge: null, desc: 'Enrich contacts and accounts with GTM intelligence.', color: '#e4002b', letter: 'Z' },
  { id: 'apollo', name: 'Apollo.io', badge: null, desc: 'Pull company and contact data into research threads.', color: '#2f2f8f', letter: 'Ap' },
  { id: 'stripe', name: 'Stripe', badge: null, desc: 'Query billing, subscriptions, and revenue metrics.', color: '#635bff', letter: 'St' },
];

function createProjectDirectory(activeSkills = [], activeConnectors = []) {
  return {
    activeSkills: new Set(activeSkills),
    activeConnectors: new Set(activeConnectors),
  };
}

const projectDirectories = {
  kimchi: createProjectDirectory(
    ['design-eval', 'gsd-plan', 'slack-search'],
    ['slack', 'granola', 'figma'],
  ),
  'one-click': createProjectDirectory(
    ['mcp-apps', 'budget-copy'],
    ['gmail', 'google-calendar', 'sentry'],
  ),
  hackathon: createProjectDirectory(
    ['proto-handoff', 'gsd-plan'],
    ['slack', 'granola', 'asana', 'atlassian'],
  ),
};

let directoryState = {
  section: 'skills',
  sourceTab: 'shared',
  search: '',
};

function getDirectoryProjectIds() {
  return Object.keys(PROJECT_LABELS);
}

function getProjectDirectory(projectId) {
  if (!projectDirectories[projectId]) {
    projectDirectories[projectId] = createProjectDirectory();
  }
  return projectDirectories[projectId];
}

function isDirectoryAllProjects() {
  return activeRepo.includes('all');
}

function getDirectoryScopeLabel() {
  if (isDirectoryAllProjects()) return 'All projects';
  return projectLabel(activeRepo[0]);
}

function getDirectoryModalTitle() {
  return `${getDirectoryScopeLabel()} directory`;
}

function getUnionActiveSkills() {
  const ids = new Set();
  getDirectoryProjectIds().forEach((projectId) => {
    getProjectDirectory(projectId).activeSkills.forEach((id) => ids.add(id));
  });
  return ids;
}

function getUnionActiveConnectors() {
  const ids = new Set();
  getDirectoryProjectIds().forEach((projectId) => {
    getProjectDirectory(projectId).activeConnectors.forEach((id) => ids.add(id));
  });
  return ids;
}

function getScopedActiveSkills() {
  if (isDirectoryAllProjects()) return getUnionActiveSkills();
  return getProjectDirectory(activeRepo[0]).activeSkills;
}

function getScopedActiveConnectors() {
  if (isDirectoryAllProjects()) return getUnionActiveConnectors();
  return getProjectDirectory(activeRepo[0]).activeConnectors;
}

function getProjectsUsingSkill(skillId) {
  return getDirectoryProjectIds().filter((projectId) => getProjectDirectory(projectId).activeSkills.has(skillId));
}

function getProjectsUsingConnector(connectorId) {
  return getDirectoryProjectIds().filter((projectId) => getProjectDirectory(projectId).activeConnectors.has(connectorId));
}

function isSkillActiveInScope(skillId) {
  if (isDirectoryAllProjects()) return getProjectsUsingSkill(skillId).length > 0;
  return getProjectDirectory(activeRepo[0]).activeSkills.has(skillId);
}

function isConnectorActiveInScope(connectorId) {
  if (isDirectoryAllProjects()) return getProjectsUsingConnector(connectorId).length > 0;
  return getProjectDirectory(activeRepo[0]).activeConnectors.has(connectorId);
}

function directoryProjectsHtml(type, id) {
  if (!isDirectoryAllProjects()) return '';

  const projectIds = type === 'skill'
    ? getProjectsUsingSkill(id)
    : getProjectsUsingConnector(id);

  if (projectIds.length === 0) {
    return '<div class="directory-card-projects"><span class="directory-card-projects-empty">Not used in any project</span></div>';
  }

  const chips = projectIds
    .map((projectId) => `<span class="directory-project-chip">${escapeHtml(projectLabel(projectId))}</span>`)
    .join('');

  return `<div class="directory-card-projects">${chips}</div>`;
}

const WORKSPACE_CHART_TABS = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'costs', label: 'Costs' },
  { id: 'prs', label: 'PRs' },
  { id: 'commits', label: 'Commits' },
];

const WORKSPACE_STATUS_COLORS_BY_THEME = {
  dark: {
    backlog: '#5c6070',
    inProgress: '#3b82f6',
    review: '#f97316',
    closed: '#2dd4bf',
  },
  light: {
    backlog: '#8b919c',
    inProgress: '#2563eb',
    review: '#ea580c',
    closed: '#0d9488',
  },
};

const THEME_STORAGE_KEY = 'studio-theme';
const APP_MODE_STORAGE_KEY = 'studio-app-mode';

function getTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function workspaceStatusColors() {
  return WORKSPACE_STATUS_COLORS_BY_THEME[getTheme()];
}

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
    memberCount: 4,
  },
  {
    id: 'wire',
    name: 'Wire Team',
    repository: 'cast-ai/wire-sync',
    repos: 2,
    openPrs: 14,
    avgDailyCost: workspaceAvgDailyCost(4, 2, 'wire'),
    memberCount: 4,
    history: workspaceHistorySeed('wire', { memberCount: 4, repos: 2 }),
  },
  {
    id: 'kube',
    name: 'Kube Team',
    repository: 'cast-ai/kube-ops',
    repos: 4,
    openPrs: 9,
    avgDailyCost: workspaceAvgDailyCost(3, 4, 'kube'),
    memberCount: 3,
    history: workspaceHistorySeed('kube', { memberCount: 3, repos: 4 }),
  },
  {
    id: 'dbo',
    name: 'DBO Team',
    repository: 'cast-ai/dbo-platform',
    repos: 1,
    openPrs: 5,
    avgDailyCost: workspaceAvgDailyCost(2, 1, 'dbo'),
    memberCount: 2,
    history: workspaceHistorySeed('dbo', { memberCount: 2, repos: 1 }),
  },
  {
    id: 'woop',
    name: 'WOOP Team',
    repository: 'cast-ai/woop-labs',
    repos: 2,
    openPrs: 4,
    avgDailyCost: workspaceAvgDailyCost(2, 2, 'woop'),
    memberCount: 2,
    history: workspaceHistorySeed('woop', { memberCount: 2, repos: 2 }),
  },
];
let nextId = 15;
let dragState = null;
let linkRafPending = false;
let taskWorkRunId = 0;
let progressTickTimer = null;
let activeSimulatedTaskId = null;
let completionPauseTimer = null;
let pendingCompletionTaskId = null;
let activeDiffFileIndex = 0;
let activeDiffCommitIndex = 0;
let activeChangesFilter = 'uncommitted';
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

function countFileLineStats(lines = []) {
  return lines.reduce(
    (stats, line) => {
      if (line.type === 'add') stats.additions += 1;
      if (line.type === 'del') stats.deletions += 1;
      return stats;
    },
    { additions: 0, deletions: 0 },
  );
}

function countCommitStats(files = []) {
  return files.reduce(
    (stats, file) => {
      const fileStats = countFileLineStats(file.lines);
      stats.additions += fileStats.additions;
      stats.deletions += fileStats.deletions;
      return stats;
    },
    { additions: 0, deletions: 0 },
  );
}

function deriveOlderCommitFiles(files, commitIndex) {
  if (!files?.length) return [];

  if (commitIndex === 1 && files.length > 1) {
    return [files[files.length - 1]];
  }

  const file = files[0];
  const ratio = Math.max(0.25, 0.55 - commitIndex * 0.12);
  const reduced = file.lines.filter((line, index) => {
    if (line.type === 'collapse') return false;
    if (line.type === 'ctx' || line.type === 'del') return true;
    return index < Math.max(3, Math.floor(file.lines.length * ratio));
  });

  return [{
    path: file.path,
    lines: reduced.length ? reduced : file.lines.slice(0, Math.min(4, file.lines.length)),
  }];
}

function getDiffCommits(bundle, task) {
  return bundle.gitLog.map((entry, index) => ({
    hash: entry.hash,
    message: entry.message,
    time: entry.time,
    author: entry.author || 'Kimchi',
    isHead: index === 0,
    files: entry.files || (index === 0
      ? bundle.files
      : deriveOlderCommitFiles(bundle.files, index)),
  }));
}

function pairUnifiedDiffLines(lines) {
  const rows = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.type === 'collapse') {
      rows.push({ kind: 'collapse', count: line.count });
      i += 1;
      continue;
    }

    if (line.type === 'ctx') {
      rows.push({ kind: 'pair', left: line, right: line });
      i += 1;
      continue;
    }

    const dels = [];
    const adds = [];
    while (i < lines.length && lines[i].type === 'del') {
      dels.push(lines[i]);
      i += 1;
    }
    while (i < lines.length && lines[i].type === 'add') {
      adds.push(lines[i]);
      i += 1;
    }

    const count = Math.max(dels.length, adds.length);
    for (let j = 0; j < count; j += 1) {
      rows.push({
        kind: 'pair',
        left: dels[j] || null,
        right: adds[j] || null,
      });
    }
  }

  return rows;
}

function renderDiffSplitCell(line) {
  if (!line) {
    return `<div class="diff-split-cell is-empty" aria-hidden="true">
      <span class="ln"></span>
      <span class="sign"></span>
      <span class="code"></span>
    </div>`;
  }

  const type = line.type === 'ctx' ? 'ctx' : line.type;
  const sign = type === 'add' ? '+' : type === 'del' ? '−' : '';
  return `<div class="diff-split-cell ${type}">
    <span class="ln">${line.ln ?? ''}</span>
    <span class="sign">${sign}</span>
    <span class="code">${escapeHtml(line.code)}</span>
  </div>`;
}

function renderDiffLines(lines) {
  const rows = pairUnifiedDiffLines(lines || []);
  return `<div class="diff-split">${rows.map((row) => {
    if (row.kind === 'collapse') {
      return `<div class="diff-collapse">Show ${row.count} unmodified lines</div>`;
    }
    return `<div class="diff-split-row">
      ${renderDiffSplitCell(row.left)}
      ${renderDiffSplitCell(row.right)}
    </div>`;
  }).join('')}</div>`;
}

function renderDiffFileHtml(file) {
  if (!file) return '';
  return `<div class="diff-split-wrap">
    <div class="diff-split-header">
      <span class="diff-split-path">${escapeHtml(file.path)}</span>
    </div>
    ${renderDiffLines(file.lines || [])}
  </div>`;
}

function getBranchChangesSelection(bundle, commits) {
  const head = commits[0];
  const oldest = bundle.gitLog[bundle.gitLog.length - 1];
  const baseHash = bundle.baseHash
    || (bundle.gitLog.length > 1 ? oldest?.hash : '6bff18b6');
  const headHash = head?.hash || '0000000';

  return {
    isBranchSummary: true,
    message: 'All branch changes',
    range: `${baseHash}..${headHash}`,
    author: head?.author || 'Kimchi',
    time: `${bundle.gitLog.length} commit${bundle.gitLog.length === 1 ? '' : 's'}`,
    files: bundle.files,
  };
}

function getWorkingTreePartition(bundle, task) {
  const all = bundle.files || [];
  if (!all.length) return { uncommitted: [], staged: [] };

  if (task.status === 'review' || task.status === 'closed') {
    return { uncommitted: all, staged: all };
  }

  if (task.status === 'in-progress') {
    const staged = all.length > 1 ? [all[0]] : [];
    const uncommitted = all;
    return { uncommitted, staged };
  }

  return { uncommitted: all, staged: [] };
}

function getFilesForChangesFilter(bundle, commits, task) {
  const partition = getWorkingTreePartition(bundle, task);

  if (activeChangesFilter === 'uncommitted') return partition.uncommitted;
  if (activeChangesFilter === 'staged') return partition.staged;
  if (activeChangesFilter === 'branch') {
    return getBranchChangesSelection(bundle, commits).files || [];
  }
  if (activeChangesFilter === 'commit') {
    const safeCommitIndex = Math.min(activeDiffCommitIndex, Math.max(commits.length - 1, 0));
    activeDiffCommitIndex = safeCommitIndex;
    return commits[safeCommitIndex]?.files || [];
  }

  return [];
}

function changesScopeTriggerLabel(filter, partition) {
  if (filter === 'uncommitted') {
    const count = partition.uncommitted.length;
    if (!count) return 'Uncommitted';
    return `${count} Uncommitted Change${count === 1 ? '' : 's'}`;
  }
  if (filter === 'staged') {
    const count = partition.staged.length;
    if (!count) return 'Staged';
    return `${count} Staged Change${count === 1 ? '' : 's'}`;
  }
  return 'All branch changes';
}

function renderChangesToolbar(bundle, commits, task) {
  const branchEl = $('#diff-branch-name');
  const trigger = $('#diff-commit-trigger');
  const menu = $('#diff-commit-menu');
  const totalsEl = $('#diff-change-totals');
  const branchSelection = getBranchChangesSelection(bundle, commits);
  const partition = getWorkingTreePartition(bundle, task);
  const files = getFilesForChangesFilter(bundle, commits, task);
  const stats = countCommitStats(files);
  const safeCommitIndex = Math.min(activeDiffCommitIndex, Math.max(commits.length - 1, 0));
  const selectedCommit = commits[safeCommitIndex];

  if (branchEl) branchEl.textContent = bundle.branch;

  const bylineEl = $('#diff-commit-byline');
  if (bylineEl) {
    if (activeChangesFilter === 'branch') {
      bylineEl.textContent = `${branchSelection.time} · ${branchSelection.range}`;
    } else if (activeChangesFilter === 'commit' && selectedCommit) {
      bylineEl.textContent = `${selectedCommit.author} · ${selectedCommit.time}`;
    } else {
      bylineEl.textContent = '';
    }
  }

  if (totalsEl) {
    totalsEl.innerHTML = stats.additions || stats.deletions
      ? `<span class="diff-stat-add">+${stats.additions}</span><span class="diff-stat-del">−${stats.deletions}</span>`
      : '';
  }

  if (trigger) {
    if (activeChangesFilter === 'commit' && selectedCommit) {
      trigger.innerHTML = `
      <span class="changes-commit-trigger-hash">${selectedCommit.hash}</span>
      <span class="changes-commit-trigger-msg">${escapeHtml(selectedCommit.message)}</span>
      ${selectedCommit.isHead ? '<span class="changes-head-badge">HEAD</span>' : ''}
      <span class="icon-slot" data-icon="chevron-down" data-size="12" data-icon-class="lucide-icon lucide-muted"></span>`;
    } else if (activeChangesFilter === 'branch') {
      trigger.innerHTML = `
      <span class="changes-commit-trigger-msg">${branchSelection.message}</span>
      <span class="changes-commit-trigger-range">${branchSelection.range}</span>
      <span class="changes-head-badge">HEAD</span>
      <span class="icon-slot" data-icon="chevron-down" data-size="12" data-icon-class="lucide-icon lucide-muted"></span>`;
    } else {
      trigger.innerHTML = `
      <span class="changes-commit-trigger-msg">${changesScopeTriggerLabel(activeChangesFilter, partition)}</span>
      <span class="icon-slot" data-icon="chevron-down" data-size="12" data-icon-class="lucide-icon lucide-muted"></span>`;
    }
    trigger.setAttribute('aria-expanded', menu && !menu.hidden ? 'true' : 'false');
  }

  if (menu) {
    const scopeOptions = [
      {
        scope: 'uncommitted',
        label: 'Uncommitted',
        count: partition.uncommitted.length,
      },
      {
        scope: 'staged',
        label: 'Staged',
        count: partition.staged.length,
      },
      {
        scope: 'branch',
        label: 'All branch changes',
        range: branchSelection.range,
      },
    ];

    menu.innerHTML = `
      ${scopeOptions.map((option) => {
        const selected = activeChangesFilter === option.scope;
        return `
        <button
          type="button"
          class="changes-commit-option changes-commit-option--scope${selected ? ' selected' : ''}"
          role="option"
          data-scope="${option.scope}"
          aria-selected="${selected}"
        >
          <span class="changes-commit-option-msg">${option.label}</span>
          ${option.count ? `<span class="changes-commit-option-count">${option.count}</span>` : ''}
          ${option.range ? `<span class="changes-commit-option-range">${option.range}</span>` : ''}
          ${option.scope === 'branch' ? '<span class="changes-head-badge">HEAD</span>' : ''}
          ${selected ? '<span class="icon-slot" data-icon="check" data-size="14" data-icon-class="lucide-icon lucide-muted"></span>' : ''}
        </button>`;
      }).join('')}
      <div class="changes-commit-menu-divider changes-commit-menu-divider--commits" role="separator" aria-hidden="true"></div>
      <div class="changes-commit-menu-commits">
      ${commits.map((commit, index) => {
        const selected = activeChangesFilter === 'commit' && index === safeCommitIndex;
        return `
        <button
          type="button"
          class="changes-commit-option${selected ? ' selected' : ''}"
          role="option"
          data-scope="commit"
          data-commit-index="${index}"
          aria-selected="${selected}"
        >
          <span class="changes-commit-option-hash">${commit.hash}</span>
          <span class="changes-commit-option-msg">${escapeHtml(commit.message)}</span>
          <span class="changes-commit-option-author">${escapeHtml(commit.author)}</span>
          <span class="changes-commit-option-time">${escapeHtml(commit.time)}</span>
          ${commit.isHead ? '<span class="changes-head-badge">HEAD</span>' : ''}
          ${selected ? '<span class="icon-slot" data-icon="check" data-size="14" data-icon-class="lucide-icon lucide-muted"></span>' : ''}
        </button>`;
      }).join('')}
      </div>`;

    menu.style.minWidth = '280px';
  }

  initIcons($('#changes-toolbar'));
}

function renderDiff() {
  const fileTree = $('#diff-file-tree');
  const viewer = $('#diff-viewer');
  const terminal = $('#task-terminal-output');
  const header = $('#changes-header');
  const task = getTask(activeTaskId);

  if (!fileTree || !viewer) return;

  if (!task || task.status === 'backlog') {
    if (header) header.hidden = true;
    const bylineEl = $('#diff-commit-byline');
    if (bylineEl) bylineEl.textContent = '';
    fileTree.innerHTML = '';
    viewer.innerHTML = task
      ? '<div class="diff-empty">No file changes yet. Start the task to see agent edits.</div>'
      : '';
    if (terminal) terminal.textContent = '';
    return;
  }

  const bundle = getTaskDiffBundle(task);
  const commits = getDiffCommits(bundle, task);
  const files = getFilesForChangesFilter(bundle, commits, task);

  if (header) header.hidden = false;
  renderChangesToolbar(bundle, commits, task);

  const safeIndex = Math.min(activeDiffFileIndex, Math.max(files.length - 1, 0));
  activeDiffFileIndex = safeIndex;

  if (!files.length) {
    fileTree.innerHTML = '';
    viewer.innerHTML = '<div class="diff-empty">No changes in this view.</div>';
    if (terminal) terminal.textContent = bundle.terminal;
    return;
  }

  fileTree.innerHTML = files
    .map((file, index) => {
      const fileStats = countFileLineStats(file.lines);
      return `
    <div class="file-tree-item${index === safeIndex ? ' active' : ''}" data-file-index="${index}">
      <span class="icon-slot" data-icon="file" data-size="14" data-icon-class="lucide-icon lucide-muted"></span>
      <span class="file-tree-path">${escapeHtml(file.path)}</span>
      <span class="file-tree-stats">
        ${fileStats.additions ? `<span class="diff-stat-add">+${fileStats.additions}</span>` : ''}
        ${fileStats.deletions ? `<span class="diff-stat-del">−${fileStats.deletions}</span>` : ''}
      </span>
    </div>`;
    })
    .join('');

  initIcons(fileTree);
  fileTree.querySelectorAll('.file-tree-item').forEach((item) => {
    item.addEventListener('click', () => {
      activeDiffFileIndex = Number(item.dataset.fileIndex);
      renderDiff();
    });
  });

  viewer.innerHTML = renderDiffFileHtml(files[safeIndex]);
  if (terminal) terminal.textContent = bundle.terminal;
  renderBrowserPreview();
}

function getTaskBrowserPreview(task) {
  if (!task || task.status === 'backlog') {
    return { available: false };
  }

  const slug = taskBranchSlug(task);

  if (task.repo === 'backend') {
    return {
      available: true,
      url: 'http://localhost:4000/docs#/tags/budgets',
      src: '/previews/api-docs.html',
    };
  }

  if (task.repo === 'design') {
    return {
      available: true,
      url: `http://localhost:5173/proto/budgets/${slug}`,
      src: '/previews/budgets-proto.html',
    };
  }

  return {
    available: true,
    url: 'http://localhost:3000/budgets',
    src: '/previews/budgets-dashboard.html',
  };
}

function renderBrowserPreview() {
  const task = getTask(activeTaskId);
  const urlEl = $('#browser-preview-url');
  const frame = $('#browser-preview-frame');
  const empty = $('#browser-preview-empty');
  const toolbar = $('#browser-toolbar');

  if (!frame) return;

  if (!task || task.status === 'backlog') {
    if (urlEl) urlEl.textContent = '';
    frame.hidden = true;
    frame.removeAttribute('src');
    frame.dataset.src = '';
    if (empty) empty.hidden = false;
    if (toolbar) toolbar.hidden = true;
    initIcons(empty);
    return;
  }

  const preview = getTaskBrowserPreview(task);
  if (toolbar) toolbar.hidden = false;
  if (urlEl) urlEl.textContent = preview.url;

  if (!preview.available) {
    frame.hidden = true;
    if (empty) empty.hidden = false;
    initIcons(empty);
    return;
  }

  frame.hidden = false;
  if (empty) empty.hidden = true;

  if (frame.dataset.src !== preview.src) {
    frame.dataset.src = preview.src;
    frame.src = preview.src;
  }

  initIcons($('#browser-toolbar'));
}

function initBrowserPreview() {
  $('#browser-refresh')?.addEventListener('click', () => {
    const frame = $('#browser-preview-frame');
    if (!frame?.src) return;
    frame.src = frame.src;
  });

  $('#browser-open-external')?.addEventListener('click', () => {
    const frame = $('#browser-preview-frame');
    if (frame?.src) window.open(frame.src, '_blank', 'noopener');
  });
}

function applyAppModeUi() {
  const view = $('#view-task');
  if (view) view.dataset.appMode = activeAppMode;

  $$('.app-mode-tab').forEach((tab) => {
    const active = tab.dataset.appMode === activeAppMode;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  renderAppModeTabBadges();

  if (activeAppMode === 'chat' && subheaderView === 'overview') {
    setSubheaderView('project');
    return;
  }

  applySubheaderViewUi();
}

function getTasksForAppMode(mode) {
  const list = tasksForProject(tasks).filter((task) => !task.archived && !task.draft);
  if (mode === 'code') return list.filter((task) => task.repo !== 'design');
  return list.filter((task) => task.repo === 'design');
}

function taskNeedsModeAttention(task, mode) {
  if (task.archived || task.draft) return false;

  if (mode === 'chat') {
    return task.chatReviewReason === 'needs-input' || task.chatReviewReason === 'ready';
  }

  if (task.status === 'closed') return false;

  const bucket = getSidebarBucket(task, mode);
  return bucket === 'needs-input' || bucket === 'done';
}

function getModeAttentionCount(mode) {
  return getTasksForAppMode(mode).filter((task) => taskNeedsModeAttention(task, mode)).length;
}

function renderAppModeTabBadges() {
  $$('.app-mode-tab').forEach((tab) => {
    const mode = normalizeAppMode(tab.dataset.appMode);
    const badge = tab.querySelector('.app-mode-tab-badge');
    if (!badge) return;

    const count = getModeAttentionCount(mode);
    const isActive = mode === activeAppMode;

    if (isActive || count === 0) {
      badge.hidden = true;
      badge.textContent = '';
      badge.removeAttribute('aria-label');
    } else {
      badge.hidden = false;
      badge.textContent = count > 9 ? '9+' : String(count);
      badge.setAttribute('aria-label', `${count} conversation${count === 1 ? '' : 's'} need attention`);
    }
  });
}

function ensureActiveTaskForMode() {
  const visible = tasksForTaskSidebar();
  if (activeTaskId && visible.some((task) => task.id === activeTaskId)) {
    renderTaskSidebar();
    updateProjectEmptyState();
    return;
  }

  const defaultTaskId = getDefaultTaskId();
  if (defaultTaskId) {
    openTaskDetail(defaultTaskId);
    return;
  }

  activeTaskId = null;
  renderTaskSidebar();
  renderBoard();
  updateProjectEmptyState();
}

function normalizeAppMode(mode) {
  if (mode === 'code') return 'code';
  if (mode === 'design') return 'design';
  return 'chat';
}

function setAppMode(mode, { loadTask = true } = {}) {
  const nextMode = normalizeAppMode(mode);
  if (nextMode !== activeAppMode) closeOverviewTaskPreview();
  activeAppMode = nextMode;
  localStorage.setItem(APP_MODE_STORAGE_KEY, activeAppMode);

  if (activeAppMode === 'design') {
    activeRepo = ['all'];
    updateProjectFilter();
  }

  applyAppModeUi();
  renderBoardSubheader();
  applyProjectEmptyModeUi();

  if ((activeAppMode === 'design' || activeAppMode === 'code') && !modeOpenedOnce[activeAppMode]) {
    modeOpenedOnce[activeAppMode] = true;
    if (loadTask) {
      setSubheaderView('overview');
      return;
    }
  }

  if (subheaderView === 'overview') {
    applySubheaderViewUi();
    renderProjectOverview();
    return;
  }

  if (activeAppMode === 'code') {
    if (loadTask) ensureActiveTaskForMode();
    else {
      renderTaskSidebar();
      updateProjectEmptyState();
    }
    return;
  }

  if (activeAppMode === 'chat') {
    if (loadTask) ensureActiveTaskForMode();
    else renderTaskSidebar();
    updateProjectEmptyState();
    if (!shouldShowEmptyCompose()) {
      refreshActiveModeChat();
      syncModelSelects(getTask(activeTaskId));
    }
    if (shouldShowEmptyCompose()) {
      $('#project-empty-input')?.focus();
    } else {
      $('#general-chat-input')?.focus();
    }
    return;
  }

  if (loadTask) ensureActiveTaskForMode();
  else {
    renderTaskSidebar();
    updateProjectEmptyState();
  }
  if (!shouldShowEmptyCompose()) {
    refreshActiveModeChat();
    syncModelSelects(getTask(activeTaskId));
  }
  if (shouldShowEmptyCompose()) {
    $('#project-empty-input')?.focus();
  }
}

function initAppMode() {
  const stored = localStorage.getItem(APP_MODE_STORAGE_KEY);
  activeAppMode = normalizeAppMode(stored);
  applyAppModeUi();

  $$('.app-mode-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.appMode !== activeAppMode) {
        setAppMode(tab.dataset.appMode);
      }
    });
  });
}

function getTaskModeMessages(task, mode = activeAppMode) {
  if (mode === 'chat') {
    if (!task.generalChat) task.generalChat = [];
    return task.generalChat;
  }
  if (mode === 'design') {
    if (!task.designChat) task.designChat = [];
    return task.designChat;
  }
  if (!task.chat) task.chat = [];
  return task.chat;
}

function renderConversationForTask(container, task, mode = activeAppMode) {
  if (!container || !task) return;

  container.innerHTML = '';
  const messages = getTaskModeMessages(task, mode);

  if (messages.length > 0) {
    messages.forEach((msg) => {
      if (msg.role === 'user') appendUserBubble(container, msg.text, msg.links);
      else appendAgentTimeline(container, msg.steps);
    });
    return;
  }

  if (mode === 'design' && task.workSteps?.length) {
    let steps = task.workSteps;
    if (task.status === 'review' && task.reviewReason === 'needs-input' && !needsInputTailAlreadyAppended(steps)) {
      steps = [...steps, ...getNeedsInputTailSteps(task)];
    }
    appendAgentTimeline(container, steps);
  }
}

function getActiveModeChatContainer() {
  if (activeAppMode === 'chat') return $('#general-chat-messages');
  if (activeAppMode === 'design') return $('#design-chat-messages');
  return $('#task-chat-messages');
}

function renderGeneralChatForTask(task) {
  const container = $('#general-chat-messages');
  if (!container) return;
  if (!task) {
    renderGeneralChat();
    return;
  }
  renderConversationForTask(container, task, 'chat');
}

function renderDesignChatForTask(task) {
  const container = $('#design-chat-messages');
  if (!container) return;
  if (!task) {
    renderDesignChat();
    return;
  }
  renderConversationForTask(container, task, 'design');
}

function refreshActiveModeChat() {
  if (shouldShowEmptyCompose()) return;

  const task = getTask(activeTaskId);
  if (!task) return;

  if (activeAppMode === 'chat') {
    renderGeneralChatForTask(task);
    return;
  }

  if (activeAppMode === 'design') {
    renderDesignChatForTask(task);
    if (task.repo === 'design' && task.status !== 'backlog') {
      buildDesignPrototypeHtml(task.title, task.id).then((html) => {
        if (activeTaskId !== task.id || activeAppMode !== 'design') return;
        designArtifactHtml = html;
        renderDesignArtifact(html);
      });
    } else {
      renderDesignArtifact(null);
    }
  }
}

function renderDesignChat() {
  const container = $('#design-chat-messages');
  if (!container) return;

  if (container.childElementCount > 0 && !container.querySelector('.design-chat-welcome')) {
    return;
  }

  container.innerHTML = designChatWelcomeHtml();
}

function designChatWelcomeHtml() {
  return `
    <div class="design-chat-welcome">
      <p class="design-chat-welcome-title">Start with an idea</p>
      <p class="design-chat-welcome-hint">Describe a screen, flow, or component. I'll build a standalone HTML &amp; CSS prototype in the artifact preview.</p>
    </div>`;
}

function startDraftFromEmptyCompose(description) {
  const task = getTask(activeTaskId);
  if (!task?.draft || activeAppMode === 'code') return null;

  const text = description.trim();
  if (!text) return null;

  task.description = text;
  task.title = text.split('\n')[0].trim() || text;
  task.draft = false;
  Object.assign(task, getProjectEmptyComposeSettings());
  $('#task-detail-title').textContent = task.title;
  renderBoard();
  updateProjectEmptyState();
  syncModelSelects(task);

  if (activeAppMode === 'chat') {
    handleGeneralChat(text);
    return task;
  }

  if (activeAppMode === 'design') {
    handleDesignChat(text);
    return task;
  }

  return task;
}

function startNewConversation() {
  if (activeAppMode === 'code') {
    startNewCodeTask();
    return;
  }

  const task = {
    id: uid(),
    title: activeAppMode === 'chat' ? 'New chat' : 'New artifact',
    description: '',
    draft: true,
    repo: 'design',
    project: defaultProjectForNewTask(),
    status: 'in-progress',
    permissionMode: 'yolo',
    model: getModelFromActiveCompose(),
    prs: 0,
    commits: 0,
    files: 0,
    additions: 0,
    deletions: 0,
    chat: [],
    generalChat: [],
    designChat: [],
  };

  tasks.unshift(task);
  designArtifactHtml = null;
  renderBoard();
  openTaskDetail(task.id);
  focusProjectEmptyInput(
    activeAppMode === 'chat' ? 'Ask anything…' : 'Describe a screen to prototype…',
  );
}

function startNewDesignChat() {
  if (activeAppMode !== 'chat') {
    setAppMode('chat', { loadTask: false });
  }
  startNewConversation();
}

function renderGeneralChat() {
  const container = $('#general-chat-messages');
  if (!container) return;

  if (container.childElementCount > 0 && !container.querySelector('.general-chat-welcome')) {
    return;
  }

  container.innerHTML = generalChatWelcomeHtml();
}

function generalChatWelcomeHtml() {
  return `
    <div class="general-chat-welcome">
      <p class="general-chat-welcome-title">What are you working on?</p>
      <p class="general-chat-welcome-hint">Ask questions, explore ideas, or say <strong>create a prototype of…</strong> when you want a buildable HTML &amp; CSS preview.</p>
    </div>`;
}

function isPrototypeRequest(text) {
  const lower = text.toLowerCase();
  const patterns = [
    /\b(prototype|mockup|mock-up|wireframe)\b/,
    /\b(create|build|make|design|prototype)\s+(a\s+)?(prototype|screen|page|flow|component|ui|dashboard|mockup|layout|modal|banner|form)\b/,
    /\b(prototype|design)\s+(for|of)\b/,
    /\bhtml(\s*&|\s+and)?\s*css\b/,
  ];
  return patterns.some((pattern) => pattern.test(lower));
}

function buildGeneralChatReply(text) {
  const lower = text.toLowerCase();

  if (lower.includes('help') || lower.includes('what can you')) {
    return '<p>I can answer questions, brainstorm flows, and review ideas. When you want something visual, ask me to <strong>create a prototype</strong> and I\'ll switch to the Design tab with a live HTML preview.</p>';
  }

  if (lower.includes('budget')) {
    return '<p>The budgets rollout spans design prototypes, a backend API contract, and a frontend dashboard. I can walk through any part — or prototype a screen if you describe what you need.</p>';
  }

  if (lower.includes('handoff') || lower.includes('engineering')) {
    return '<p>For handoff, keep flows scoped to one screen at a time and call out interaction states. When you\'re ready, ask for a prototype and I\'ll generate standalone HTML &amp; CSS you can iterate on in Design mode.</p>';
  }

  return `<p>Got it. Ask a follow-up, or say something like <strong>"create a prototype of …"</strong> when you want to switch to Design mode.</p>`;
}

function persistModeChatMessage(task, mode, message) {
  if (!task) return;
  const messages = getTaskModeMessages(task, mode);
  messages.push(message);
}

async function handleGeneralChat(text) {
  const container = $('#general-chat-messages');
  if (!container) return;

  const task = getTask(activeTaskId);
  container.querySelector('.general-chat-welcome')?.remove();
  appendUserBubble(container, text);
  applyModelToTask(task);
  persistModeChatMessage(task, 'chat', { role: 'user', text });

  if (isPrototypeRequest(text)) {
    let typing = showTyping(container);
    await sleep(650);
    typing.remove();

    const switchSteps = [{
      type: 'text',
      dot: 'gray',
      html: '<p>Switching to Design to build your prototype…</p>',
    }];
    appendAgentTimeline(container, switchSteps);
    persistModeChatMessage(task, 'chat', { role: 'agent', steps: switchSteps });

    await sleep(350);
    setAppMode('design', { loadTask: false });
    await handleDesignChat(text, { skipUserBubble: true });
    $('#design-chat-input')?.focus();
    return;
  }

  let typing = showTyping(container);
  await sleep(800 + Math.random() * 400);
  typing.remove();

  const replySteps = [{
    type: 'text',
    dot: 'gray',
    html: buildGeneralChatReply(text),
  }];
  appendAgentTimeline(container, replySteps);
  persistModeChatMessage(task, 'chat', { role: 'agent', steps: replySteps });
}

function renderDesignArtifact(html) {
  const frame = $('#design-artifact-frame');
  const empty = $('#design-artifact-empty');
  const meta = $('#design-artifact-meta');
  if (!frame) return;

  if (!html) {
    frame.hidden = true;
    frame.removeAttribute('srcdoc');
    if (empty) empty.hidden = false;
    if (meta) meta.textContent = 'HTML · CSS';
    initIcons(empty);
    return;
  }

  frame.hidden = false;
  if (empty) empty.hidden = true;
  frame.srcdoc = html;
  if (meta) meta.textContent = 'Standalone HTML · CSS';
}

function buildGenericPrototypeHtml(title, prompt = '') {
  const safeTitle = escapeHtml(title);
  const hint = escapeHtml(prompt.split('\n').slice(1).join(' ').trim() || 'Interactive prototype shell ready for iteration.');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; margin: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #fafafa;
      color: #171717;
      padding: 24px;
    }
    .proto-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: #7c3aed;
      background: #ede9fe;
      padding: 4px 8px;
      border-radius: 6px;
      margin-bottom: 12px;
    }
    .frame {
      border: 2px dashed #c4b5fd;
      border-radius: 16px;
      padding: 20px;
      background: #fff;
      max-width: 720px;
    }
    h1 { font-size: 20px; margin-bottom: 8px; }
    p { color: #525252; line-height: 1.5; margin-bottom: 16px; }
    .card {
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      background: #fafafa;
    }
    .card strong { display: block; margin-bottom: 4px; }
    button {
      border: none;
      background: #171717;
      color: #fff;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <span class="proto-badge">Prototype</span>
  <div class="frame">
    <h1>${safeTitle}</h1>
    <p>${hint}</p>
    <div class="card"><strong>Primary action</strong>Placeholder control area</div>
    <div class="card"><strong>Secondary block</strong>Layout section for content</div>
    <button type="button">Continue</button>
  </div>
</body>
</html>`;
}

async function loadPreviewHtml(path, fallbackTitle, fallbackHint) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error('missing preview');
    return response.text();
  } catch {
    return buildGenericPrototypeHtml(fallbackTitle, fallbackHint);
  }
}

async function loadBudgetPrototypeHtml() {
  return loadPreviewHtml(
    '/previews/budgets-proto.html',
    'Budgets overview',
    'Budget summary strip, category list, and alert indicators.',
  );
}

async function loadBudgetEditingFlowHtml() {
  return loadPreviewHtml(
    '/previews/budgets-editing-flow.html',
    'Budget editing flow',
    'Edit modal, threshold panel, and alert banner states.',
  );
}

async function loadBudgetEmptyStatesHtml() {
  return loadPreviewHtml(
    '/previews/budgets-empty-states.html',
    'Budgets empty states',
    'Zero-budgets empty state, onboarding tooltip, and skeleton loader.',
  );
}

const DESIGN_TASK_ARTIFACTS = {
  t1: loadBudgetPrototypeHtml,
  t6: loadBudgetEditingFlowHtml,
  t11: loadBudgetEmptyStatesHtml,
};

const DESIGN_PREVIEW_URLS = {
  t1: '/previews/budgets-proto.html',
  t6: '/previews/budgets-editing-flow.html',
  t11: '/previews/budgets-empty-states.html',
};

function stripHtml(html) {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.textContent || '';
}

function groupTasksByProject(taskList) {
  const groups = new Map();
  getDirectoryProjectIds().forEach((projectId) => groups.set(projectId, []));
  taskList.forEach((task) => {
    const projectId = task.project || 'kimchi';
    if (!groups.has(projectId)) groups.set(projectId, []);
    groups.get(projectId).push(task);
  });
  return groups;
}

function getChatConversationStatus(task) {
  if (task.chatReviewReason === 'needs-input') return { label: 'Needs you', cls: 'needs-input' };
  if (task.chatReviewReason === 'ready') return { label: 'Done', cls: 'done' };
  if (task.draft) return { label: 'Draft', cls: 'backlog' };
  return { label: 'Active', cls: 'in-progress' };
}

function getChatLastSnippet(task) {
  const messages = task.generalChat || [];
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.text) return message.text;
    const textStep = [...(message.steps || [])].reverse().find((step) => step.type === 'text');
    if (textStep?.html) return stripHtml(textStep.html).trim();
  }
  return 'No messages yet';
}

function getDesignConversationStatus(task) {
  const bucket = getSidebarBucket(task, 'design');
  if (bucket === 'needs-input') return { label: 'Needs you', cls: 'needs-input' };
  if (bucket === 'done') return { label: 'Ready', cls: 'done' };
  if (bucket === 'in-progress') return { label: 'In progress', cls: 'in-progress' };
  return { label: 'Archive', cls: 'backlog' };
}

function getCodeConversationStatus(task) {
  const bucket = getSidebarBucket(task, 'code');
  if (bucket === 'needs-input') return { label: 'Needs you', cls: 'needs-input' };
  if (bucket === 'done') return { label: 'Ready to merge', cls: 'done' };
  if (bucket === 'in-progress') return { label: 'In progress', cls: 'in-progress' };
  if (bucket === 'active') return { label: 'Backlog', cls: 'backlog' };
  if (bucket === 'merged') return { label: 'Merged', cls: 'merged' };
  return { label: 'Backlog', cls: 'backlog' };
}

function getCodeProjectStats(projectTasks) {
  const prsWaiting = projectTasks.filter(
    (task) => task.status === 'review' && task.reviewReason === 'ready' && task.prs > 0,
  ).length;
  const idleAgents = projectTasks.filter(
    (task) => task.status === 'in-progress' && task.id !== activeSimulatedTaskId,
  ).length;
  const activeTasks = projectTasks.filter(
    (task) => task.status !== 'backlog' && task.status !== 'closed' && !task.archived,
  );
  const files = activeTasks.reduce((sum, task) => sum + (task.files || 0), 0);
  const additions = activeTasks.reduce((sum, task) => sum + (task.additions || 0), 0);
  const deletions = activeTasks.reduce((sum, task) => sum + (task.deletions || 0), 0);

  return { prsWaiting, idleAgents, files, additions, deletions };
}

function overviewCodeStatsPillsHtml(stats) {
  const fileLabel = stats.files === 1 ? '1 file' : `${stats.files} files`;
  const filesPill = `<span class="workspace-pill workspace-pill-files">${fileLabel} <span class="add">+${stats.additions}</span> <span class="del">−${stats.deletions}</span></span>`;

  const prLabel = stats.prsWaiting === 1 ? '1 PR' : `${stats.prsWaiting} PRs`;
  const prPill = `<span class="workspace-pill workspace-pill-pr">${iconHtml('git-pull-request', { size: 12 })} ${prLabel}</span>`;

  const idleLabel = stats.idleAgents === 1 ? '1 idle agent' : `${stats.idleAgents} idle agents`;
  const idlePill = `<span class="workspace-pill workspace-pill-idle">${iconHtml('loader', { size: 12, className: 'lucide-icon lucide-muted' })} ${idleLabel}</span>`;

  return `${filesPill}${prPill}${idlePill}`;
}

function getProjectFilterLabel() {
  if (activeRepo.includes('all') || activeRepo.length === 0) return 'All projects';
  return projectLabel(activeRepo[0]);
}

function updateProjectFilter() {
  const menu = $('#project-filter-menu');
  const label = $('#project-filter-label');
  if (!menu) return;

  const selected = activeRepo.includes('all') || activeRepo.length === 0 ? 'all' : activeRepo[0];
  menu.querySelectorAll('.project-filter-option').forEach((option) => {
    const isSelected = option.dataset.value === selected;
    option.classList.toggle('selected', isSelected);
    option.setAttribute('aria-selected', String(isSelected));
  });

  if (label) label.textContent = getProjectFilterLabel();
}

function updateSubheaderTabUi() {
  $$('.repo-tab[data-view]').forEach((tab) => {
    const tabView = tab.dataset.view;
    tab.classList.toggle('active', subheaderView === tabView);
  });
  updateProjectFilter();
}

function applySubheaderViewUi() {
  const isOverview = subheaderView === 'overview';
  const layout = $('.task-layout');
  const taskMain = $('.task-main');
  const overview = $('#project-overview');
  const panels = $('.task-main-panels');
  const taskSubheader = $('.task-subheader');
  const empty = $('#project-empty-state');
  const designBackBtn = $('#design-back-btn');

  layout?.classList.toggle('is-overview', isOverview);
  taskMain?.classList.toggle('is-overview', isOverview);
  overview?.toggleAttribute('hidden', !isOverview);
  panels?.toggleAttribute('hidden', isOverview);
  taskSubheader?.toggleAttribute('hidden', isOverview);
  if (designBackBtn) {
    designBackBtn.hidden = !(activeAppMode === 'design' && !isOverview);
  }
  if (isOverview) {
    empty?.setAttribute('hidden', '');
    taskMain?.classList.remove('is-project-empty');
  } else {
    updateProjectEmptyState();
  }
}

function setSubheaderView(view, repo = activeRepo, { skipOpenTask = false } = {}) {
  const nextView = view === 'overview' ? 'overview' : 'project';
  if (nextView !== 'overview' || overviewLayout !== 'status') {
    closeOverviewTaskPreview();
  }
  subheaderView = nextView;
  activeRepo = repo ? (Array.isArray(repo) ? [...repo] : [repo]) : ['all'];
  if (subheaderView === 'project') {
    renderDirectoryCounts();
    renderAppModeTabBadges();
    if ($('#directory-modal')?.open) renderDirectoryModal();
  }
  updateSubheaderTabUi();
  applySubheaderViewUi();
  if (subheaderView === 'overview') {
    renderProjectOverview();
  } else if (!skipOpenTask) {
    openFirstTaskForProject();
  }
}

function overviewCreateCardHtml(projectId) {
  const copy = {
    chat: { label: 'New chat', icon: 'message-circle' },
    design: { label: 'New artifact', icon: 'layout-grid' },
    code: { label: 'New task', icon: 'plus' },
  }[activeAppMode] || { label: 'New task', icon: 'plus' };
  const designClass = activeAppMode === 'design' ? ' overview-create-card--design' : '';

  return `<button type="button" class="overview-card overview-create-card${designClass}" data-create-project="${projectId}">
    <span class="overview-create-icon">${iconHtml(copy.icon, { size: 18, className: 'lucide-icon' })}</span>
    <span class="overview-create-label">${copy.label}</span>
  </button>`;
}

function overviewChatCardHtml(task) {
  const status = getChatConversationStatus(task);
  const snippet = getChatLastSnippet(task);
  const messageCount = (task.generalChat || []).length;
  const meta = `${messageCount} message${messageCount === 1 ? '' : 's'}`;

  return `<button type="button" class="overview-card overview-chat-card" data-task-id="${task.id}">
    <h4 class="overview-card-title">${escapeHtml(task.title)}</h4>
    <p class="overview-card-snippet">${escapeHtml(snippet)}</p>
    ${overviewCardFooterHtml(task, 'chat', meta, status)}
  </button>`;
}

function overviewDesignCardHtml(task) {
  const status = getDesignConversationStatus(task);
  const previewUrl = DESIGN_PREVIEW_URLS[task.id];
  const previewHtml = previewUrl
    ? `<iframe src="${previewUrl}" title="${escapeHtml(task.title)} preview" loading="lazy" tabindex="-1"></iframe>`
    : '<div class="overview-design-preview-placeholder">No preview yet</div>';
  const meta = `${task.commits || 0} commit${task.commits === 1 ? '' : 's'}`;

  return `<button type="button" class="overview-card overview-design-card" data-task-id="${task.id}">
    <div class="overview-design-preview">${previewHtml}</div>
    <div class="overview-design-body">
      <h4 class="overview-card-title">${escapeHtml(task.title)}</h4>
      ${overviewCardFooterHtml(task, 'design', meta, status)}
    </div>
  </button>`;
}

function overviewCodeTaskHtml(task) {
  const status = getCodeConversationStatus(task);
  const lines = (task.additions || 0) + (task.deletions || 0);
  const meta = lines > 0
    ? `+${task.additions || 0} −${task.deletions || 0}`
    : `${task.commits || 0} commit${task.commits === 1 ? '' : 's'}`;
  const mergedClass = status.cls === 'merged' ? ' is-merged' : '';

  return `<button type="button" class="overview-card overview-code-card${mergedClass}" data-task-id="${task.id}">
    <h4 class="overview-card-title">${escapeHtml(task.title)}</h4>
    ${overviewCardFooterHtml(task, 'code', meta, status)}
  </button>`;
}

function overviewCodeProjectGroupHtml(projectId, projectTasks) {
  const stats = getCodeProjectStats(projectTasks);
  const repo = getProjectRepo(projectId);
  const cards = sortOverviewTasks(
    projectTasks.filter((task) => !task.archived),
    'code',
  )
    .map(overviewCodeTaskHtml)
    .join('');

  return `<section class="overview-project-group overview-code-project-group">
    <div class="overview-code-project-header">
      <h3 class="overview-project-name">${escapeHtml(projectLabel(projectId))}</h3>
      <span class="overview-code-repo">${escapeHtml(repo)}</span>
      <div class="overview-code-stats">${overviewCodeStatsPillsHtml(stats)}</div>
    </div>
    <div class="overview-card-grid">${cards}${overviewCreateCardHtml(projectId)}</div>
  </section>`;
}

function overviewDesignProjectGroupHtml(projectId, projectTasks) {
  const cards = sortOverviewTasks(
    projectTasks.filter((task) => !task.archived && !task.draft),
    'design',
  )
    .map(overviewDesignCardHtml)
    .join('');

  return `<section class="overview-project-group overview-design-project-group">
    <h3 class="overview-project-name">${escapeHtml(projectLabel(projectId))}</h3>
    <div class="overview-card-grid">${cards}${overviewCreateCardHtml(projectId)}</div>
  </section>`;
}

function overviewTasksForStatusBoard() {
  let list;
  if (activeAppMode === 'design') {
    list = tasks.filter((task) => task.repo === 'design' && !task.archived && !task.draft);
  } else if (activeAppMode === 'chat') {
    list = tasks.filter((task) => task.repo !== 'design' && !task.archived && !task.draft);
  } else {
    list = tasks.filter((task) => task.repo !== 'design' && !task.archived);
  }
  if (!activeRepo.includes('all')) {
    list = list.filter((task) => activeRepo.includes(task.project));
  }
  return list;
}

function overviewStatusKanbanHtml(boardTasks) {
  const columns = OVERVIEW_STATUS_COLUMNS;
  const columnsHtml = columns.map((status) => {
    const count = boardTasks.filter((task) => task.status === status).length;
    const archiveBtn = status === 'closed'
      ? `<button type="button" class="overview-archive-toggle" id="overview-archive-toggle" aria-expanded="false" aria-controls="overview-archive-panel">
          <span class="icon-slot" data-icon="archive" data-size="12" data-icon-class="lucide-icon"></span>
          <span>Archive</span>
          <span class="overview-archive-count" id="overview-archive-count">0</span>
        </button>`
      : '';
    return `<div class="kanban-column" data-status="${status}">
      <div class="column-header">
        <div class="overview-column-breadcrumb">
          <button type="button" class="breadcrumb-link overview-back-to-board">
            ${iconHtml('chevron-left', { size: 14, className: 'lucide-icon' })}
            Overview
          </button>
          <span class="breadcrumb-sep">/</span>
        </div>
        <span class="status-dot ${status}"></span>
        <span class="column-title">${OVERVIEW_COLUMN_LABELS[status]}</span>
        <span class="column-count" data-count="${status}">${count}</span>
        <div class="column-header-trailing">
          ${archiveBtn}
          <button type="button" class="column-header-action overview-column-toggle" hidden aria-label="Compress column" aria-expanded="true">
            <span class="icon-slot overview-column-toggle-icon" data-icon="panel-left-close" data-size="14" data-icon-class="lucide-icon lucide-muted"></span>
          </button>
        </div>
      </div>
      <div class="column-body" data-drop="${status}"></div>
    </div>`;
  }).join('');

  return `<div class="overview-board-shell" id="overview-board-shell">
  <div class="overview-status-stage" id="overview-status-stage">
    <div class="kanban-board-wrap overview-kanban-wrap">
      <div class="kanban-board" id="overview-kanban-board">${columnsHtml}</div>
    </div>
    <div
      class="overview-stage-column-resizer overview-panel-resizer"
      id="overview-stage-column-resizer"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize status column and task preview"
      tabindex="0"
      hidden
    ></div>
    <aside class="overview-task-preview" id="overview-task-preview" aria-hidden="true">
      <div class="overview-task-preview-inner">
        <header class="overview-task-preview-header">
          <div class="overview-task-preview-heading">
            <h3 class="overview-task-preview-title" id="overview-task-preview-title"></h3>
            <div class="overview-task-preview-meta">
              <span class="status-badge" id="overview-task-preview-status"></span>
              <span class="overview-task-preview-project" id="overview-task-preview-project"></span>
            </div>
          </div>
          <button type="button" class="icon-btn overview-task-preview-close" id="overview-task-preview-close" aria-label="Close preview">
            ${iconHtml('x', { size: 16, className: 'lucide-icon' })}
          </button>
        </header>
        <div class="overview-task-preview-columns" id="overview-task-preview-columns">
          <div class="overview-task-preview-chat-col">
            <div class="chat-messages overview-task-preview-chat" id="overview-task-preview-chat"></div>
          </div>
          <div
            class="overview-preview-column-resizer overview-panel-resizer"
            id="overview-preview-column-resizer"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize chat and code panels"
            tabindex="0"
          ></div>
          <div class="overview-task-preview-work-col" id="overview-task-preview-work">
            <div class="overview-work-tabs" role="tablist" aria-label="Review panels">
              <button type="button" class="overview-work-tab active" data-pane="changes" role="tab" aria-selected="true">Changes</button>
              <button type="button" class="overview-work-tab" data-pane="terminal" role="tab" aria-selected="false">Terminal</button>
              <button type="button" class="overview-work-tab" data-pane="browser" role="tab" aria-selected="false">Browser</button>
            </div>

            <div class="overview-work-content">
              <div class="overview-work-pane active" data-pane="changes">
                <div class="changes-pane overview-work-changes-pane">
                  <div class="changes-body">
                    <div class="file-tree" id="overview-diff-file-tree"></div>
                    <div class="diff-viewer" id="overview-diff-viewer"></div>
                  </div>
                </div>
              </div>

              <div class="overview-work-pane" data-pane="terminal">
                <div class="terminal-pane">
                  <pre class="terminal-output overview-terminal-output" id="overview-task-terminal-output"></pre>
                </div>
              </div>

              <div class="overview-work-pane" data-pane="browser">
                <div class="browser-pane">
                  <div class="browser-toolbar" id="overview-browser-toolbar">
                    <button type="button" class="browser-toolbar-btn" id="overview-browser-refresh" title="Refresh preview" aria-label="Refresh preview">
                      <span class="icon-slot" data-icon="refresh-cw" data-size="14" data-icon-class="lucide-icon lucide-muted"></span>
                    </button>
                    <div class="browser-url-bar">
                      <span class="icon-slot" data-icon="globe" data-size="12" data-icon-class="lucide-icon lucide-muted"></span>
                      <span class="browser-url" id="overview-browser-preview-url"></span>
                    </div>
                    <button type="button" class="browser-toolbar-btn" id="overview-browser-open-external" title="Open in browser" aria-label="Open in browser">
                      <span class="icon-slot" data-icon="external-link" data-size="14" data-icon-class="lucide-icon lucide-muted"></span>
                    </button>
                  </div>
                  <div class="browser-frame-wrap">
                    <iframe id="overview-browser-preview-frame" class="browser-frame" title="Live preview" sandbox="allow-scripts allow-same-origin"></iframe>
                    <div class="browser-empty" id="overview-browser-preview-empty" hidden>
                      <span class="icon-slot" data-icon="globe" data-size="28" data-icon-class="lucide-icon lucide-muted"></span>
                      <p>Start the task to see a live preview.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
  <aside class="overview-archive-panel" id="overview-archive-panel" aria-hidden="true">
    <div class="overview-archive-panel-inner">
      <header class="overview-archive-panel-header">
        <div class="overview-archive-heading">
          <span class="icon-slot" data-icon="archive" data-size="16" data-icon-class="lucide-icon"></span>
          <h3>Archive</h3>
          <span class="overview-archive-count" id="overview-archive-panel-count">0</span>
        </div>
        <button type="button" class="icon-btn" id="overview-archive-close" aria-label="Close archive">
          ${iconHtml('x', { size: 16, className: 'lucide-icon' })}
        </button>
      </header>
      <div class="overview-archive-search">
        <span class="icon-slot" data-icon="search" data-size="14" data-icon-class="lucide-icon lucide-muted"></span>
        <input type="search" id="overview-archive-search" placeholder="Search archived tasks…" autocomplete="off" />
      </div>
      <div class="overview-archive-table-wrap">
        <table class="overview-archive-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Edits</th>
              <th>PR / Git</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody id="overview-archive-table-body"></tbody>
        </table>
        <p class="overview-archive-empty" id="overview-archive-empty" hidden>No archived tasks match your search.</p>
      </div>
    </div>
  </aside>
</div>`;
}

function initOverviewStageColumnResizer(stage) {
  if (!stage || stage.dataset.stageResizerBound) return;
  stage.dataset.stageResizerBound = 'true';

  const resizer = stage.querySelector('#overview-stage-column-resizer');
  if (!resizer) return;

  const storedWidth = localStorage.getItem(OVERVIEW_KANBAN_FOCUS_WIDTH_KEY);
  if (storedWidth && !overviewKanbanCompressed) {
    stage.style.setProperty('--overview-focus-col-width', `${storedWidth}px`);
  }

  const clampKanbanWidth = (width) => {
    const resizerWidth = resizer.offsetWidth || 10;
    const maxKanban = stage.clientWidth - OVERVIEW_PREVIEW_PANEL_MIN - resizerWidth;
    return Math.round(Math.max(OVERVIEW_KANBAN_FOCUS_MIN, Math.min(maxKanban, width)));
  };

  const applyKanbanWidth = (width) => {
    const next = clampKanbanWidth(width);
    stage.style.setProperty('--overview-focus-col-width', `${next}px`);

    const focusCol = stage.querySelector('.kanban-column.is-preview-focus');
    if (focusCol && !overviewKanbanCompressed) {
      focusCol.style.flex = `0 0 ${next}px`;
      focusCol.style.width = `${next}px`;
      focusCol.style.minWidth = `${next}px`;
      focusCol.style.maxWidth = `${next}px`;

      const columns = [...stage.querySelectorAll('.kanban-column')];
      const focusIndex = columns.indexOf(focusCol);
      if (focusIndex >= 0 && overviewPreviewColumnWidths?.length === columns.length) {
        overviewPreviewColumnWidths[focusIndex] = next;
      }
    }
    return next;
  };

  const persistKanbanWidth = () => {
    const width = Number.parseFloat(stage.style.getPropertyValue('--overview-focus-col-width'));
    if (width) localStorage.setItem(OVERVIEW_KANBAN_FOCUS_WIDTH_KEY, String(Math.round(width)));
  };

  resizer.addEventListener('mousedown', (e) => {
    if (!stage.classList.contains('is-preview-open')) return;
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = Number.parseFloat(getComputedStyle(stage).getPropertyValue('--overview-focus-col-width'))
      || stage.querySelector('.kanban-column.is-preview-focus')?.getBoundingClientRect().width
      || 280;

    if (overviewKanbanCompressed) {
      setOverviewKanbanCompressed(false);
    }

    resizer.classList.add('is-dragging');
    stage.classList.add('is-resizing-stage-column');
    document.body.classList.add('is-resizing-overview-preview');

    const onMove = (moveEvent) => {
      applyKanbanWidth(startWidth + (moveEvent.clientX - startX));
    };

    const onUp = () => {
      resizer.classList.remove('is-dragging');
      stage.classList.remove('is-resizing-stage-column');
      document.body.classList.remove('is-resizing-overview-preview');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      persistKanbanWidth();
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  resizer.addEventListener('dblclick', () => {
    localStorage.removeItem(OVERVIEW_KANBAN_FOCUS_WIDTH_KEY);
    if (overviewPreviewTaskId) {
      prepareOverviewPreviewLayout(overviewPreviewTaskId);
    }
  });

  resizer.addEventListener('keydown', (e) => {
    if (!stage.classList.contains('is-preview-open')) return;
    const current = Number.parseFloat(getComputedStyle(stage).getPropertyValue('--overview-focus-col-width')) || 280;
    const step = e.shiftKey ? 48 : 16;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      applyKanbanWidth(current - step);
      persistKanbanWidth();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      applyKanbanWidth(current + step);
      persistKanbanWidth();
    }
  });
}

function initOverviewPreviewColumnResizer(previewRoot) {
  if (!previewRoot || previewRoot.dataset.columnResizerBound) return;
  previewRoot.dataset.columnResizerBound = 'true';

  const columns = previewRoot.querySelector('#overview-task-preview-columns');
  const resizer = previewRoot.querySelector('#overview-preview-column-resizer');
  if (!columns || !resizer) return;

  const storedWidth = localStorage.getItem(OVERVIEW_PREVIEW_CHAT_WIDTH_KEY);
  if (storedWidth) {
    columns.style.setProperty('--overview-preview-chat-width', `${storedWidth}px`);
  }

  const clampChatWidth = (width) => {
    const maxChat = columns.clientWidth - OVERVIEW_PREVIEW_WORK_MIN - resizer.offsetWidth;
    return Math.round(Math.max(OVERVIEW_PREVIEW_CHAT_MIN, Math.min(maxChat, width)));
  };

  const persistChatWidth = () => {
    const chatCol = columns.querySelector('.overview-task-preview-chat-col');
    const width = chatCol?.getBoundingClientRect().width;
    if (width) localStorage.setItem(OVERVIEW_PREVIEW_CHAT_WIDTH_KEY, String(Math.round(width)));
  };

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const chatCol = columns.querySelector('.overview-task-preview-chat-col');
    const startX = e.clientX;
    const startWidth = chatCol?.getBoundingClientRect().width || 320;

    resizer.classList.add('is-dragging');
    document.body.classList.add('is-resizing-overview-preview');

    const onMove = (moveEvent) => {
      const nextWidth = clampChatWidth(startWidth + (moveEvent.clientX - startX));
      columns.style.setProperty('--overview-preview-chat-width', `${nextWidth}px`);
    };

    const onUp = () => {
      resizer.classList.remove('is-dragging');
      document.body.classList.remove('is-resizing-overview-preview');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      persistChatWidth();
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  resizer.addEventListener('dblclick', () => {
    columns.style.removeProperty('--overview-preview-chat-width');
    localStorage.removeItem(OVERVIEW_PREVIEW_CHAT_WIDTH_KEY);
  });

  resizer.addEventListener('keydown', (e) => {
    const chatCol = columns.querySelector('.overview-task-preview-chat-col');
    const current = chatCol?.getBoundingClientRect().width || 320;
    const step = e.shiftKey ? 48 : 16;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      columns.style.setProperty('--overview-preview-chat-width', `${clampChatWidth(current - step)}px`);
      persistChatWidth();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      columns.style.setProperty('--overview-preview-chat-width', `${clampChatWidth(current + step)}px`);
      persistChatWidth();
    }
  });
}

function initOverviewWorkTabs(previewRoot) {
  if (!previewRoot) return;
  if (previewRoot.dataset.overviewWorkTabsBound) return;
  previewRoot.dataset.overviewWorkTabsBound = 'true';

  const tabs = [...previewRoot.querySelectorAll('.overview-work-tab')];
  const panes = [...previewRoot.querySelectorAll('.overview-work-pane')];

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const pane = tab.dataset.pane;
      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      panes.forEach((p) => p.classList.toggle('active', p.dataset.pane === pane));
    });
  });
}

function renderOverviewPreviewWork(task, previewRoot) {
  if (!task || !previewRoot) return;

  // Changes (diff)
  const fileTree = previewRoot.querySelector('#overview-diff-file-tree');
  const viewer = previewRoot.querySelector('#overview-diff-viewer');
  const terminal = previewRoot.querySelector('#overview-task-terminal-output');

  if (fileTree && viewer) {
    const bundle = getTaskDiffBundle(task);
    const commits = getDiffCommits(bundle, task);
    const files = getFilesForChangesFilter(bundle, commits, task);

    fileTree.innerHTML = '';
    viewer.innerHTML = '';

    if (terminal) terminal.textContent = bundle.terminal;

    if (!files.length || task.status === 'backlog') {
      viewer.innerHTML = task.status === 'backlog'
        ? '<div class="diff-empty">No file changes yet. Start the task to see agent edits.</div>'
        : '<div class="diff-empty">No changes in this view.</div>';
    } else {
      let activeIndex = 0;

      fileTree.innerHTML = files
        .map((file, index) => {
          const fileStats = countFileLineStats(file.lines);
          return `
            <div class="file-tree-item${index === activeIndex ? ' active' : ''}" data-file-index="${index}">
              <span class="icon-slot" data-icon="file" data-size="14" data-icon-class="lucide-icon lucide-muted"></span>
              <span class="file-tree-path">${escapeHtml(file.path)}</span>
              <span class="file-tree-stats">
                ${fileStats.additions ? `<span class="diff-stat-add">+${fileStats.additions}</span>` : ''}
                ${fileStats.deletions ? `<span class="diff-stat-del">−${fileStats.deletions}</span>` : ''}
              </span>
            </div>`;
        })
        .join('');

      initIcons(fileTree);
      viewer.innerHTML = renderDiffFileHtml(files[activeIndex]);

      fileTree.querySelectorAll('.file-tree-item').forEach((item) => {
        item.addEventListener('click', () => {
          activeIndex = Number(item.dataset.fileIndex);
          fileTree.querySelectorAll('.file-tree-item').forEach((i) => {
            i.classList.toggle('active', i === item);
          });
          viewer.innerHTML = renderDiffFileHtml(files[activeIndex]);
        });
      });
    }
  }

  // Browser
  const frame = previewRoot.querySelector('#overview-browser-preview-frame');
  const urlEl = previewRoot.querySelector('#overview-browser-preview-url');
  const empty = previewRoot.querySelector('#overview-browser-preview-empty');
  const toolbar = previewRoot.querySelector('#overview-browser-toolbar');

  if (frame) {
    if (!task || task.status === 'backlog') {
      if (urlEl) urlEl.textContent = '';
      frame.hidden = true;
      frame.removeAttribute('src');
      frame.dataset.src = '';
      if (empty) empty.hidden = false;
      if (toolbar) toolbar.hidden = true;
      initIcons(empty || frame);
    } else {
      const preview = getTaskBrowserPreview(task);
      if (toolbar) toolbar.hidden = false;
      if (urlEl) urlEl.textContent = preview.url;

      if (!preview.available) {
        frame.hidden = true;
        if (empty) empty.hidden = false;
        initIcons(empty || frame);
      } else {
        frame.hidden = false;
        if (empty) empty.hidden = true;

        if (frame.dataset.src !== preview.src) {
          frame.dataset.src = preview.src;
          frame.src = preview.src;
        }
      }
      initIcons(previewRoot);
    }
  }

  // Browser controls (scoped)
  if (!previewRoot.dataset.overviewBrowserControlsBound) {
    previewRoot.dataset.overviewBrowserControlsBound = 'true';

    previewRoot.querySelector('#overview-browser-refresh')?.addEventListener('click', () => {
      if (!frame?.src) return;
      frame.src = frame.src;
    });

    previewRoot.querySelector('#overview-browser-open-external')?.addEventListener('click', () => {
      if (frame?.src) window.open(frame.src, '_blank', 'noopener');
    });
  }
}

function overviewKanbanNewTaskLabel() {
  return {
    chat: 'New chat',
    design: 'New artifact',
    code: 'New task',
  }[activeAppMode] || 'New task';
}

function createOverviewKanbanNewTaskButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'overview-kanban-new-task';
  btn.innerHTML = `${iconHtml('plus', { size: 12, className: 'lucide-icon' })} ${overviewKanbanNewTaskLabel()}`;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    startNewConversation();
  });
  return btn;
}

function groupTasksByWorktree(tasks) {
  const groups = new Map();
  tasks.forEach((task) => {
    const key = getTaskWorktreeSlug(task);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(task);
  });
  return [...groups.values()];
}

function populateOverviewKanban(container) {
  const board = container.querySelector('#overview-kanban-board');
  if (!board) return;

  const boardTasks = overviewTasksForStatusBoard();
  OVERVIEW_STATUS_COLUMNS.forEach((status) => {
    const body = board.querySelector(`.column-body[data-drop="${status}"]`);
    const countEl = board.querySelector(`[data-count="${status}"]`);
    if (!body) return;
    body.replaceChildren();
    const statusTasks = boardTasks.filter((task) => task.status === status);
    if (countEl) countEl.textContent = String(statusTasks.length);

    if (status === 'in-progress') {
      body.appendChild(createOverviewKanbanNewTaskButton());
    }

    groupTasksByWorktree(statusTasks).forEach((groupTasks) => {
      if (groupTasks.length === 1) {
        body.appendChild(createTaskCard(groupTasks[0], {
          onOpen: openOverviewTaskPreview,
          showProject: true,
        }));
        return;
      }

      const wrap = document.createElement('div');
      wrap.className = 'task-card-worktree-cluster';

      const title = document.createElement('div');
      title.className = 'task-card-worktree-group-title has-tooltip';
      title.dataset.tooltip = getTaskWorktreeFullPath(groupTasks[0]);
      title.innerHTML = `${iconHtml('folder', { size: 11, className: 'lucide-icon' })}<span>${escapeHtml(getTaskWorktreeShortPath(groupTasks[0]))}</span>`;
      wrap.appendChild(title);

      const group = document.createElement('div');
      group.className = 'task-card-worktree-group';
      group.dataset.worktree = getTaskWorktreeSlug(groupTasks[0]);

      groupTasks.forEach((task) => {
        group.appendChild(createTaskCard(task, {
          onOpen: openOverviewTaskPreview,
          showProject: true,
          showWorktree: false,
        }));
      });
      wrap.appendChild(group);
      body.appendChild(wrap);
    });
  });

  bindOverviewTaskPreviewChrome(container);
  initOverviewStageColumnResizer(container.querySelector('#overview-status-stage'));
  initOverviewArchivePanel(container);
}

function overviewArchivedTasks() {
  return tasks.filter((task) => {
    if (!task.archived || task.draft) return false;
    if (activeAppMode === 'design') return task.repo === 'design';
    if (activeAppMode === 'chat') return task.repo !== 'design';
    return task.repo !== 'design';
  });
}

function getArchivedTaskSummary(task) {
  if (Array.isArray(task.archiveSummary) && task.archiveSummary.length) {
    return task.archiveSummary;
  }
  const bullets = [];
  if (task.files) bullets.push(`Touched ${task.files} file${task.files === 1 ? '' : 's'} (+${task.additions || 0} / −${task.deletions || 0})`);
  if (task.commits) bullets.push(`Landed ${task.commits} commit${task.commits === 1 ? '' : 's'}`);
  if (task.prs) bullets.push(`Opened ${task.prs} PR${task.prs === 1 ? '' : 's'}`);
  if (!bullets.length) bullets.push('Archived with no recorded code changes');
  return bullets;
}

function getArchivedPrGitLabel(task) {
  if (task.archivePrGitStatus) return task.archivePrGitStatus;
  if (!task.prs) return 'No PR';
  return task.status === 'closed' ? 'Merged' : 'Open';
}

function overviewArchiveEditsHtml(task) {
  const files = task.files || 0;
  const additions = task.additions || 0;
  const deletions = task.deletions || 0;
  if (!files && !additions && !deletions) {
    return `<span class="overview-archive-muted">No edits</span>`;
  }
  return `<span class="overview-archive-edits">
    ${files} file${files === 1 ? '' : 's'}
    <span class="add">+${additions}</span>
    <span class="del">−${deletions}</span>
  </span>`;
}

function overviewArchivePrHtml(task) {
  const gitStatus = getArchivedPrGitLabel(task);
  const statusClass = gitStatus.toLowerCase().replace(/\s+/g, '-');
  if (!task.prs) {
    return `<span class="overview-archive-pr-status overview-archive-pr-status--none">${escapeHtml(gitStatus)}</span>`;
  }
  const prs = getTaskPullRequests({ ...task, status: gitStatus === 'Merged' ? 'closed' : task.status });
  const pr = prs[0];
  return `<div class="overview-archive-pr">
    <span class="overview-archive-pr-id">${iconHtml('git-pull-request', { size: 12, className: 'lucide-icon' })} #${pr?.number || taskPrNumber(task)}</span>
    <span class="overview-archive-pr-status overview-archive-pr-status--${statusClass}">${escapeHtml(gitStatus)}</span>
  </div>`;
}

function overviewArchiveRowHtml(task) {
  const summary = getArchivedTaskSummary(task)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
  return `<tr data-task-id="${task.id}">
    <td class="overview-archive-name">
      <div class="overview-archive-title">${escapeHtml(task.title)}</div>
      <div class="overview-archive-meta">${escapeHtml(getTaskWorktreeShortPath(task))}</div>
    </td>
    <td>${overviewArchiveEditsHtml(task)}</td>
    <td>${overviewArchivePrHtml(task)}</td>
    <td><ul class="overview-archive-summary">${summary}</ul></td>
  </tr>`;
}

function renderOverviewArchiveTable(container = document) {
  const body = container.querySelector('#overview-archive-table-body')
    || $('#overview-archive-table-body');
  const empty = container.querySelector('#overview-archive-empty')
    || $('#overview-archive-empty');
  const countEls = [
    container.querySelector('#overview-archive-count'),
    container.querySelector('#overview-archive-panel-count'),
    $('#overview-archive-count'),
    $('#overview-archive-panel-count'),
  ].filter(Boolean);

  const archived = overviewArchivedTasks();
  const query = overviewArchiveQuery.trim().toLowerCase();
  const filtered = !query
    ? archived
    : archived.filter((task) => {
      const haystack = [
        task.title,
        getTaskWorktreeShortPath(task),
        getArchivedPrGitLabel(task),
        ...getArchivedTaskSummary(task),
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });

  countEls.forEach((el) => {
    el.textContent = String(archived.length);
  });

  if (!body) return;
  body.innerHTML = filtered.map(overviewArchiveRowHtml).join('');
  if (empty) {
    empty.hidden = filtered.length > 0;
    empty.textContent = archived.length === 0
      ? 'No archived tasks yet.'
      : 'No archived tasks match your search.';
  }
  initIcons(body);
}

function setOverviewArchiveOpen(open) {
  overviewArchiveOpen = Boolean(open);
  const shell = $('#overview-board-shell');
  const panel = $('#overview-archive-panel');
  const toggle = $('#overview-archive-toggle');

  if (overviewArchiveOpen && overviewPreviewTaskId) {
    closeOverviewTaskPreview();
  }

  shell?.classList.toggle('is-archive-open', overviewArchiveOpen);
  if (panel) {
    panel.setAttribute('aria-hidden', String(!overviewArchiveOpen));
  }
  if (toggle) toggle.setAttribute('aria-expanded', String(overviewArchiveOpen));

  if (overviewArchiveOpen) {
    renderOverviewArchiveTable();
    const search = $('#overview-archive-search');
    if (search) {
      search.value = overviewArchiveQuery;
      window.setTimeout(() => search.focus(), 280);
    }
  }
}

function initOverviewArchivePanel(container) {
  renderOverviewArchiveTable(container);

  const toggle = container.querySelector('#overview-archive-toggle');
  const closeBtn = container.querySelector('#overview-archive-close');
  const search = container.querySelector('#overview-archive-search');

  toggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    setOverviewArchiveOpen(!overviewArchiveOpen);
  });
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setOverviewArchiveOpen(false);
  });
  search?.addEventListener('input', () => {
    overviewArchiveQuery = search.value;
    renderOverviewArchiveTable(container);
  });
  search?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOverviewArchiveOpen(false);
    }
  });

  if (overviewArchiveOpen) setOverviewArchiveOpen(true);
}

function clearOverviewPreviewFocus() {
  const board = $('#overview-kanban-board');
  $$('#overview-kanban-board .task-card').forEach((card) => {
    card.classList.remove('is-preview-focus', 'is-preview-dim');
  });
  $$('#overview-kanban-board .kanban-column').forEach((col) => {
    col.classList.remove('is-preview-focus', 'is-preview-hidden');
    col.style.flex = '';
    col.style.width = '';
    col.style.minWidth = '';
    col.style.maxWidth = '';
    const toggle = col.querySelector('.overview-column-toggle');
    if (toggle) {
      toggle.hidden = true;
      toggle.setAttribute('aria-expanded', 'true');
      const icon = toggle.querySelector('.overview-column-toggle-icon');
      if (icon) icon.dataset.icon = 'panel-left-close';
    }
  });
  if (board) {
    board.style.transform = '';
    board.style.width = '';
  }
  const stage = $('#overview-status-stage');
  if (stage) {
    delete stage.dataset.focusStatus;
    delete stage.dataset.previewOffset;
    stage.classList.remove('is-kanban-compressed');
    stage.style.removeProperty('--overview-focus-col-width');
  }
  overviewKanbanCompressed = false;
  overviewPreviewColumnWidths = null;
}

function clearOverviewColumnInlineSizes(columns, board) {
  columns.forEach((col) => {
    col.style.flex = '';
    col.style.width = '';
    col.style.minWidth = '';
    col.style.maxWidth = '';
  });
  if (board) board.style.width = '';
}

function restoreOverviewPreviewColumnLayout(stage, board, columns, focusStatus) {
  if (!stage || !board || !columns.length || !overviewPreviewColumnWidths?.length) return false;

  const focusIndex = columns.findIndex((col) => col.dataset.status === focusStatus);
  if (focusIndex < 0) return false;

  const gap = Number.parseFloat(getComputedStyle(board).gap) || 10;
  columns.forEach((col, index) => {
    const width = overviewPreviewColumnWidths[index];
    if (!width) return;
    col.style.flex = `0 0 ${width}px`;
    col.style.width = `${width}px`;
    col.style.minWidth = `${width}px`;
    col.style.maxWidth = `${width}px`;
  });

  const totalWidth = overviewPreviewColumnWidths.reduce((sum, width) => sum + width, 0)
    + gap * Math.max(0, columns.length - 1);
  board.style.width = `${totalWidth}px`;

  const focusWidth = overviewPreviewColumnWidths[focusIndex];
  stage.style.setProperty('--overview-focus-col-width', `${Math.round(focusWidth)}px`);

  const focusCol = columns[focusIndex];
  const offset = focusCol ? focusCol.offsetLeft : 0;
  stage.dataset.previewOffset = String(offset);
  board.style.transform = `translateX(-${offset}px)`;
  return true;
}

function updateOverviewColumnToggleButtons() {
  const stage = $('#overview-status-stage');
  const isOpen = stage?.classList.contains('is-preview-open');
  $$('#overview-kanban-board .kanban-column').forEach((col) => {
    const toggle = col.querySelector('.overview-column-toggle');
    if (!toggle) return;
    const isFocus = col.classList.contains('is-preview-focus');
    toggle.hidden = !isOpen || !isFocus;
    if (!isFocus) return;

    const icon = toggle.querySelector('.overview-column-toggle-icon');
    const compressed = overviewKanbanCompressed;
    toggle.setAttribute('aria-expanded', String(!compressed));
    toggle.setAttribute('aria-label', compressed ? 'Expand column' : 'Compress column');
    if (icon) icon.dataset.icon = compressed ? 'panel-right-open' : 'panel-left-close';
    initIcons(toggle);
  });
}

function setOverviewKanbanCompressed(compressed) {
  const stage = $('#overview-status-stage');
  if (!stage || !overviewPreviewTaskId) return;

  overviewKanbanCompressed = compressed;
  stage.classList.toggle('is-kanban-compressed', compressed);

  if (compressed) {
    stage.style.setProperty('--overview-focus-col-width', `${OVERVIEW_KANBAN_COMPRESSED_WIDTH}px`);
    const focusCol = stage.querySelector('.kanban-column.is-preview-focus');
    if (focusCol) {
      focusCol.style.flex = `0 0 ${OVERVIEW_KANBAN_COMPRESSED_WIDTH}px`;
      focusCol.style.width = `${OVERVIEW_KANBAN_COMPRESSED_WIDTH}px`;
      focusCol.style.minWidth = `${OVERVIEW_KANBAN_COMPRESSED_WIDTH}px`;
      focusCol.style.maxWidth = `${OVERVIEW_KANBAN_COMPRESSED_WIDTH}px`;
    }
  } else if (overviewPreviewTaskId) {
    const board = $('#overview-kanban-board');
    const columns = board ? [...board.querySelectorAll('.kanban-column')] : [];
    const focusStatus = getTask(overviewPreviewTaskId)?.status;
    const restored = restoreOverviewPreviewColumnLayout(stage, board, columns, focusStatus);
    if (!restored) {
      prepareOverviewPreviewLayout(overviewPreviewTaskId);
    }
  }

  updateOverviewColumnToggleButtons();
}

function prepareOverviewPreviewLayout(taskId) {
  const task = getTask(taskId);
  const focusStatus = task?.status;
  const stage = $('#overview-status-stage');
  const board = $('#overview-kanban-board');
  if (!board || !stage || !focusStatus) return 0;

  stage.dataset.focusStatus = focusStatus;

  $$('#overview-kanban-board .task-card').forEach((card) => {
    const isFocus = card.dataset.id === taskId;
    card.classList.toggle('is-preview-focus', isFocus);
    card.classList.toggle('is-preview-dim', !isFocus);
  });

  const columns = [...board.querySelectorAll('.kanban-column')];
  const focusCol = columns.find((col) => col.dataset.status === focusStatus) || null;
  const gap = Number.parseFloat(getComputedStyle(board).gap) || 10;

  const focusColIsCompressed = focusCol
    && Number.parseFloat(focusCol.style.maxWidth) === OVERVIEW_KANBAN_COMPRESSED_WIDTH;

  let widths;
  if (!overviewKanbanCompressed && overviewPreviewColumnWidths?.length === columns.length) {
    widths = overviewPreviewColumnWidths;
  } else {
    if (focusColIsCompressed) {
      clearOverviewColumnInlineSizes(columns, board);
      void board.offsetWidth;
    }
    widths = columns.map((col) => col.getBoundingClientRect().width);
  }

  if (!overviewKanbanCompressed) {
    const storedWidth = localStorage.getItem(OVERVIEW_KANBAN_FOCUS_WIDTH_KEY);
    const focusIndex = columns.findIndex((col) => col.dataset.status === focusStatus);
    if (storedWidth && focusIndex >= 0) {
      const resizerWidth = stage.querySelector('#overview-stage-column-resizer')?.offsetWidth || 10;
      const maxKanban = stage.clientWidth - OVERVIEW_PREVIEW_PANEL_MIN - resizerWidth;
      const clamped = Math.round(Math.max(
        OVERVIEW_KANBAN_FOCUS_MIN,
        Math.min(maxKanban, Number.parseFloat(storedWidth)),
      ));
      widths = [...widths];
      widths[focusIndex] = clamped;
    }
  }

  if (!overviewKanbanCompressed) {
    overviewPreviewColumnWidths = widths;
  }

  // Measure natural widths before locking so the board pans instead of reflowing.
  const totalWidth = widths.reduce((sum, width) => sum + width, 0)
    + gap * Math.max(0, columns.length - 1);

  columns.forEach((col, index) => {
    const width = widths[index];
    col.style.flex = `0 0 ${width}px`;
    col.style.width = `${width}px`;
    col.style.minWidth = `${width}px`;
    col.style.maxWidth = `${width}px`;
    const isFocus = col.dataset.status === focusStatus;
    col.classList.toggle('is-preview-focus', isFocus);
    col.classList.toggle('is-preview-hidden', !isFocus);
  });

  board.style.width = `${totalWidth}px`;

  const focusWidth = focusCol
    ? focusCol.getBoundingClientRect().width
    : 280;
  stage.style.setProperty('--overview-focus-col-width', `${Math.round(focusWidth)}px`);

  const offset = focusCol ? focusCol.offsetLeft : 0;
  stage.dataset.previewOffset = String(offset);

  if (overviewKanbanCompressed) {
    setOverviewKanbanCompressed(true);
  } else {
    updateOverviewColumnToggleButtons();
  }

  return offset;
}

function fillOverviewTaskPreviewChat(container, task) {
  container.innerHTML = '';

  if (activeAppMode === 'design') {
    const messages = getTaskModeMessages(task, 'design');
    if (messages.length > 0) {
      messages.forEach((msg) => {
        if (msg.role === 'user') appendUserBubble(container, msg.text, msg.links);
        else appendAgentTimeline(container, msg.steps);
      });
      return;
    }
    if (task.workSteps?.length) {
      let steps = task.workSteps;
      if (task.status === 'review' && task.reviewReason === 'needs-input' && !needsInputTailAlreadyAppended(steps)) {
        steps = [...steps, ...getNeedsInputTailSteps(task)];
      }
      appendAgentTimeline(container, steps);
      return;
    }
    appendAgentTimeline(container, [
      {
        type: 'text',
        dot: 'gray',
        html: '<p>No design agent activity yet. Open the artifact to start prototyping.</p>',
      },
    ]);
    return;
  }

  if (task.status === 'backlog') {
    appendAgentTimeline(container, [
      {
        type: 'text',
        dot: 'gray',
        html: '<p>This task is still in backlog. Open it to start the agent.</p>',
      },
    ]);
    return;
  }

  appendTaskDescriptionBubble(container, task);

  if (task.chat?.length > 0) {
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
    }
    appendAgentTimeline(container, steps);
    return;
  }

  appendAgentTimeline(container, [
    {
      type: 'file-read',
      dot: 'green',
      file: `${task.repo}/README.md`,
      desc: 'read task context',
      code: `<span class="key">"task"</span>: <span class="val">"${escapeHtml(task.title)}"</span>,
<span class="key">"status"</span>: <span class="val">"${STATUS_LABELS[task.status]}"</span>`,
    },
    {
      type: 'text',
      dot: 'gray',
      html: `<p>Task is in <strong>${STATUS_LABELS[task.status]}</strong>. Open the full task to continue with the agent.</p>`,
    },
  ]);
}

function renderOverviewTaskPreview(task) {
  const preview = $('#overview-task-preview');
  if (!preview || !task) return;

  const title = $('#overview-task-preview-title');
  const status = $('#overview-task-preview-status');
  const project = $('#overview-task-preview-project');
  const chat = $('#overview-task-preview-chat');

  if (title) title.textContent = task.title;
  if (status) {
    status.textContent = STATUS_LABELS[task.status] || task.status;
    status.className = `status-badge ${task.status}`;
  }
  if (project) {
    project.textContent = getProjectRepoShortName(task.project || 'kimchi');
  }
  if (chat) fillOverviewTaskPreviewChat(chat, task);
  initIcons(preview);
}

function closeOverviewTaskPreview() {
  const stage = $('#overview-status-stage');
  const preview = $('#overview-task-preview');
  const board = $('#overview-kanban-board');
  overviewPreviewTaskId = null;
  overviewKanbanCompressed = false;

  const stageResizer = $('#overview-stage-column-resizer');
  if (stageResizer) stageResizer.hidden = true;

  stage?.classList.remove('is-preview-open', 'is-kanban-compressed');
  preview?.setAttribute('aria-hidden', 'true');

  if (board) board.style.transform = 'translateX(0px)';

  $$('#overview-kanban-board .task-card').forEach((card) => {
    card.classList.remove('is-preview-focus', 'is-preview-dim');
  });
  $$('#overview-kanban-board .kanban-column').forEach((col) => {
    col.classList.remove('is-preview-focus', 'is-preview-hidden');
  });

  window.clearTimeout(overviewPreviewCloseTimer);
  overviewPreviewCloseTimer = window.setTimeout(() => {
    overviewPreviewCloseTimer = null;
    if (!overviewPreviewTaskId) clearOverviewPreviewFocus();
  }, OVERVIEW_PREVIEW_ANIM_MS);
}

function openOverviewTaskPreview(taskId) {
  const task = getTask(taskId);
  if (!task) return;
  if (subheaderView !== 'overview' || overviewLayout !== 'status') {
    openOverviewTask(taskId);
    return;
  }

  if (overviewArchiveOpen) setOverviewArchiveOpen(false);

  const stage = $('#overview-status-stage');
  const preview = $('#overview-task-preview');
  const board = $('#overview-kanban-board');
  if (!stage || !preview || !board) {
    openOverviewTask(taskId);
    return;
  }

  window.clearTimeout(overviewPreviewCloseTimer);
  overviewPreviewCloseTimer = null;

  const wasOpen = stage.classList.contains('is-preview-open');
  overviewPreviewTaskId = taskId;
  renderOverviewTaskPreview(task);
  initOverviewWorkTabs(preview);
  initOverviewPreviewColumnResizer(preview);
  renderOverviewPreviewWork(task, preview);
  preview.setAttribute('aria-hidden', 'false');

  if (!wasOpen) {
    clearOverviewPreviewFocus();
    // Force layout so we measure the resting board before locking widths.
    void board.offsetWidth;
  }

  const offset = prepareOverviewPreviewLayout(taskId);

  const stageResizer = $('#overview-stage-column-resizer');
  if (stageResizer) stageResizer.hidden = false;

  if (wasOpen) {
    stage.classList.add('is-preview-open');
    board.style.transform = `translateX(-${offset}px)`;
  } else {
    board.style.transform = 'translateX(0px)';
    void board.offsetWidth;
    requestAnimationFrame(() => {
      if (overviewPreviewTaskId !== taskId) return;
      stage.classList.add('is-preview-open');
      board.style.transform = `translateX(-${offset}px)`;
    });
  }

  const chat = $('#overview-task-preview-chat');
  if (chat) chat.scrollTop = chat.scrollHeight;
}

function bindOverviewTaskPreviewChrome(container) {
  container.querySelector('#overview-task-preview-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeOverviewTaskPreview();
  });
  container.querySelector('#overview-kanban-board')?.addEventListener('click', (e) => {
    if (e.target.closest('.overview-back-to-board')) {
      e.stopPropagation();
      closeOverviewTaskPreview();
      return;
    }
    const toggle = e.target.closest('.overview-column-toggle');
    if (toggle) {
      e.stopPropagation();
      setOverviewKanbanCompressed(!overviewKanbanCompressed);
    }
  });
  container.querySelector('.overview-kanban-wrap')?.addEventListener('click', (e) => {
    if (!overviewPreviewTaskId) return;
    if (e.target.closest('.task-card')) return;
    if (e.target.closest('.overview-column-toggle')) return;
    if (e.target.closest('#overview-stage-column-resizer')) return;
    if (e.target.closest('.overview-kanban-new-task')) return;
    if (e.target.closest('.overview-back-to-board')) return;
    closeOverviewTaskPreview();
  });
}

function setOverviewLayout(layout) {
  if (layout !== overviewLayout) closeOverviewTaskPreview();
  overviewLayout = layout === 'status' ? 'status' : 'projects';
  if (subheaderView === 'overview') renderProjectOverview();
}

function renderProjectOverview() {
  const container = $('#project-overview-content');
  if (!container) return;

  const previewId = overviewPreviewTaskId;
  const overviewRoot = $('#project-overview');
  overviewRoot?.classList.add('is-status-layout');

  if (activeAppMode === 'design') {
    const designTasks = tasks.filter((task) => task.repo === 'design' && !task.archived && !task.draft);
    const filteredTasks = activeRepo.includes('all')
      ? designTasks
      : designTasks.filter((task) => activeRepo.includes(task.project));
    const projectIds = [...new Set(filteredTasks.map((task) => task.project))];
    const groupsHtml = projectIds
      .map((projectId) => overviewDesignProjectGroupHtml(projectId, filteredTasks.filter((task) => task.project === projectId)))
      .join('');
    container.innerHTML = `<div class="overview-project-groups">${groupsHtml}</div>`;
    initIcons(container);
    bindProjectOverviewEvents(container);
    return;
  }

  const boardTasks = overviewTasksForStatusBoard();

  container.innerHTML = overviewStatusKanbanHtml(boardTasks);
  initIcons(container);
  bindProjectOverviewEvents(container);
  populateOverviewKanban(container);
  if (previewId && getTask(previewId)) {
    openOverviewTaskPreview(previewId);
  }
}

function openOverviewCreate(projectId) {
  setSubheaderView('project', projectId, { skipOpenTask: true });
  if (activeAppMode === 'code') startNewCodeTask();
  else startNewConversation();
}

function openOverviewTask(taskId) {
  const task = getTask(taskId);
  if (!task) return;
  setSubheaderView('project', task.project || 'kimchi');
  openTaskDetail(taskId);
}

function bindProjectOverviewEvents(container) {
  container.querySelectorAll('[data-task-id]').forEach((el) => {
    el.addEventListener('click', () => openOverviewTask(el.dataset.taskId));
  });
  container.querySelectorAll('[data-create-project]').forEach((el) => {
    el.addEventListener('click', () => openOverviewCreate(el.dataset.createProject));
  });
}

function initProjectFilterDropdown() {
  const dropdown = $('#project-filter-dropdown');
  const trigger = $('#project-filter-trigger');
  const menu = $('#project-filter-menu');
  if (!dropdown || !trigger || !menu) return;

  function setOpen(open) {
    trigger.setAttribute('aria-expanded', String(open));
    menu.toggleAttribute('hidden', !open);
    menu.setAttribute('aria-hidden', String(!open));
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  menu.addEventListener('click', (e) => {
    const option = e.target.closest('.project-filter-option');
    if (!option) return;
    const value = option.dataset.value || 'all';
    setSubheaderView(subheaderView, [value], { skipOpenTask: true });
    setOpen(false);
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

function initSubheaderNav() {
  $('#subheader-board-btn')?.addEventListener('click', () => {
    closeOverviewTaskPreview();
    setSubheaderView('overview');
  });

  $('#subheader-tasks-btn')?.addEventListener('click', () => {
    closeOverviewTaskPreview();
    setSubheaderView('project');
  });

  $('#design-back-btn')?.addEventListener('click', () => {
    closeOverviewTaskPreview();
    activeRepo = ['all'];
    updateProjectFilter();
    setSubheaderView('overview');
  });

  initProjectFilterDropdown();
}

async function buildDesignPrototypeHtml(prompt, taskId = null) {
  if (taskId && DESIGN_TASK_ARTIFACTS[taskId]) {
    return DESIGN_TASK_ARTIFACTS[taskId]();
  }

  const lower = prompt.toLowerCase();
  const title = prompt.split('\n')[0].trim() || 'Prototype';

  if (/\b(empty|onboarding|first-run|zero)\b/.test(lower)) {
    return loadBudgetEmptyStatesHtml();
  }

  if (/\b(edit|editing|threshold|alert flow|validation)\b/.test(lower)) {
    return loadBudgetEditingFlowHtml();
  }

  if (lower.includes('budget') || lower.includes('overview')) {
    return loadBudgetPrototypeHtml();
  }

  if (lower.includes('dashboard')) {
    return buildGenericPrototypeHtml(title, 'Dashboard layout with summary metrics and detail panels.');
  }

  return buildGenericPrototypeHtml(title, prompt);
}

async function handleDesignChat(text, { skipUserBubble = false } = {}) {
  const container = $('#design-chat-messages');
  if (!container) return;

  const task = getTask(activeTaskId);
  container.querySelector('.design-chat-welcome')?.remove();
  if (!skipUserBubble) {
    appendUserBubble(container, text);
    applyModelToTask(task);
    persistModeChatMessage(task, 'design', { role: 'user', text });
  }

  let typing = showTyping(container);
  await sleep(900 + Math.random() * 500);
  typing.remove();

  const html = await buildDesignPrototypeHtml(text, task?.id);
  designArtifactHtml = html;
  renderDesignArtifact(html);

  const replySteps = [{
    type: 'text',
    dot: 'gray',
    html: `<p>Built a standalone HTML &amp; CSS prototype for <strong>${escapeHtml(text.split('\n')[0].trim())}</strong>. Preview it in the artifact panel.</p>`,
  }];
  appendAgentTimeline(container, replySteps);
  persistModeChatMessage(task, 'design', { role: 'agent', steps: replySteps });
}

function initDesignChat() {
  initChatInput('general-chat-input', handleGeneralChat);
  initChatInput('design-chat-input', handleDesignChat);
}

function initDiffCommitMenu() {
  const wrap = $('#diff-commit-select-wrap');
  if (!wrap || wrap.dataset.bound) return;
  wrap.dataset.bound = 'true';

  wrap.addEventListener('click', (e) => {
    const trigger = e.target.closest('#diff-commit-trigger');
    if (trigger) {
      e.stopPropagation();
      const menu = $('#diff-commit-menu');
      if (!menu) return;
      const open = menu.hidden;
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      return;
    }

    const option = e.target.closest('.changes-commit-option');
    if (option) {
      e.stopPropagation();
      const scope = option.dataset.scope;
      if (scope === 'commit') {
        activeChangesFilter = 'commit';
        activeDiffCommitIndex = Number(option.dataset.commitIndex);
      } else {
        activeChangesFilter = scope;
      }
      activeDiffFileIndex = 0;
      const menu = $('#diff-commit-menu');
      const triggerBtn = $('#diff-commit-trigger');
      if (menu) menu.hidden = true;
      if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
      renderDiff();
    }
  });

  document.addEventListener('click', () => {
    const menu = $('#diff-commit-menu');
    const triggerBtn = $('#diff-commit-trigger');
    if (menu) menu.hidden = true;
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
  });
}

/* ── DOM refs ── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ── Helpers ── */
function getTask(id) {
  return tasks.find((t) => t.id === id);
}

function boardTasks() {
  if (activeWorkspaceId !== 'kimchi') return [];
  return tasks;
}

function tasksForProject(list) {
  if (activeRepo.includes('all')) return list;
  return list.filter((task) => activeRepo.includes(task.project));
}

function tasksForBoardRepo() {
  return tasksForProject(boardTasks());
}

function tasksForBoard() {
  return tasksForBoardRepo();
}

function tasksForTaskSidebar() {
  let list = tasksForProject(tasks);
  if (activeAppMode === 'code') {
    return list.filter((task) => task.repo !== 'design');
  }
  if (activeAppMode === 'design') {
    return list.filter((task) => task.repo === 'design');
  }
  return list;
}

function getSidebarBucket(task, mode = activeAppMode) {
  if (task.archived) return 'archive';

  if (mode === 'code') {
    if (task.status === 'backlog') return 'active';
    if (task.status === 'in-progress') return 'in-progress';
    if (task.status === 'review' && task.reviewReason === 'needs-input') return 'needs-input';
    if (task.status === 'review' && task.reviewReason === 'ready') return 'done';
    if (task.status === 'closed') return 'merged';
    return 'active';
  }

  if (task.status === 'backlog' || task.status === 'in-progress') return 'in-progress';
  if (task.status === 'review' && task.reviewReason === 'needs-input') return 'needs-input';
  if (task.status === 'review' && task.reviewReason === 'ready') return 'done';
  if (task.status === 'closed') return 'done';
  return 'in-progress';
}

function defaultRepoForNewTask() {
  if (activeAppMode !== 'code') return 'design';
  return 'backend';
}

function defaultProjectForNewTask() {
  return activeRepo.includes('all') || activeRepo.length === 0 ? 'kimchi' : activeRepo[0];
}

const PROJECT_LABELS = {
  kimchi: 'Kimchi',
  'one-click': 'One-click',
  hackathon: 'Hackathon',
};

const PROJECT_REPOS = {
  kimchi: 'cast-ai/kimchi-studio',
  'one-click': 'cast-ai/one-click',
  hackathon: 'cast-ai/hackathon',
};

const NEW_PROJECT_SKILL_OPTIONS = DIRECTORY_SKILLS.map((skill) => ({
  id: skill.id,
  label: skill.slug,
  desc: skill.desc,
}));

const NEW_PROJECT_CONNECTOR_OPTIONS = DIRECTORY_CONNECTORS.map((connector) => ({
  id: connector.id,
  label: connector.name,
  desc: connector.desc,
}));

function getNewProjectRepositoryOptions() {
  const repos = new Set(Object.values(PROJECT_REPOS));
  return [
    { id: 'none', label: 'None', desc: 'No repository linked' },
    ...Array.from(repos).sort().map((repo) => ({ id: repo, label: repo, desc: '' })),
  ];
}

function projectLabel(projectId) {
  return PROJECT_LABELS[projectId] || projectId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getProjectRepo(projectId) {
  return PROJECT_REPOS[projectId] || `cast-ai/${projectId}`;
}

function getProjectRepoShortName(projectId) {
  const full = getProjectRepo(projectId);
  const slash = full.lastIndexOf('/');
  return slash === -1 ? full : full.slice(slash + 1);
}

const OVERVIEW_STATUS_ORDER = {
  chat: {
    'needs-input': 0,
    ready: 1,
    'in-progress': 2,
    backlog: 3,
  },
  design: {
    'needs-input': 0,
    done: 1,
    'in-progress': 2,
  },
  code: {
    'needs-input': 0,
    done: 1,
    'in-progress': 2,
    active: 3,
    merged: 4,
  },
};

const REVIEW_WAITING_OFFSETS = {
  t2: 2 * 60 * 60 * 1000,
  t4: 45 * 60 * 1000,
  t5: 18 * 60 * 60 * 1000,
  t6: 3 * 60 * 60 * 1000,
  t9: 5 * 60 * 60 * 1000,
  t10: 30 * 60 * 1000,
};

function hydrateReviewWaitingTimes() {
  tasks.forEach((task) => {
    if (task.status === 'review' && REVIEW_WAITING_OFFSETS[task.id]) {
      task.reviewSince = Date.now() - REVIEW_WAITING_OFFSETS[task.id];
    }
  });
}

function formatWaitingDuration(ms) {
  const minutes = Math.max(1, Math.floor(ms / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function formatWaitingTooltip(ms) {
  const minutes = Math.max(1, Math.floor(ms / 60000));
  if (minutes < 60) {
    return `Agent waiting for ${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  const hours = Math.floor(minutes / 60);
  const remMin = minutes % 60;
  if (hours < 24) {
    if (remMin === 0) {
      return `Agent waiting for ${hours} hour${hours === 1 ? '' : 's'}`;
    }
    return `Agent waiting for ${hours}h ${remMin}m`;
  }
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  if (remHours === 0) {
    return `Agent waiting for ${days} day${days === 1 ? '' : 's'}`;
  }
  return `Agent waiting for ${days}d ${remHours}h`;
}

const WAITING_DOT_ACTIVATE_MIN = [15, 45, 90, 180];
const WAITING_DOT_ESCALATE_MIN = [120, 240, 480, 720];

function getWaitingDotStates(ms) {
  const minutes = ms / 60000;

  return WAITING_DOT_ACTIVATE_MIN.map((activateAt, index) => {
    if (minutes < activateAt) return 'grey';
    if (minutes < WAITING_DOT_ESCALATE_MIN[index]) return 'yellow';
    return 'orange';
  });
}

function overviewWaitingDotsHtml(task, mode) {
  const since = getOverviewWaitingSince(task, mode);
  if (!since) return '';

  const elapsed = Date.now() - since;
  const tooltip = formatWaitingTooltip(elapsed);
  const dots = getWaitingDotStates(elapsed)
    .map((state) => `<span class="overview-waiting-dot ${state}" aria-hidden="true"></span>`)
    .join('');

  return `<span class="overview-waiting-dots has-tooltip" data-tooltip="${escapeHtml(tooltip)}" role="img" aria-label="${escapeHtml(tooltip)}">${dots}</span>`;
}

function getOverviewStatusBucket(task, mode) {
  if (mode === 'chat') {
    if (task.chatReviewReason === 'needs-input') return 'needs-input';
    if (task.chatReviewReason === 'ready') return 'ready';
    if (task.draft) return 'backlog';
    return 'in-progress';
  }
  return getSidebarBucket(task, mode);
}

function getOverviewWaitingSince(task, mode) {
  if (mode === 'chat') {
    if (task.chatReviewReason === 'needs-input' || task.chatReviewReason === 'ready') {
      return task.chatReviewSince;
    }
    return null;
  }

  const bucket = getSidebarBucket(task, mode);
  if (bucket === 'needs-input' || bucket === 'done') return task.reviewSince;
  return null;
}

function overviewCardFooterHtml(task, mode, fallbackMeta, status) {
  const waitingHtml = overviewWaitingDotsHtml(task, mode);

  return `<div class="overview-card-footer">
    <span class="overview-card-meta">${escapeHtml(fallbackMeta)}</span>
    <div class="overview-card-status-group">
      ${waitingHtml}
      <span class="overview-status-pill ${status.cls}">${escapeHtml(status.label)}</span>
    </div>
  </div>`;
}

function sortOverviewTasks(taskList, mode) {
  const order = OVERVIEW_STATUS_ORDER[mode] || {};

  return [...taskList].sort((a, b) => {
    const bucketA = getOverviewStatusBucket(a, mode);
    const bucketB = getOverviewStatusBucket(b, mode);
    const rankA = order[bucketA] ?? 99;
    const rankB = order[bucketB] ?? 99;
    if (rankA !== rankB) return rankA - rankB;

    const waitA = getOverviewWaitingSince(a, mode) || Number.MAX_SAFE_INTEGER;
    const waitB = getOverviewWaitingSince(b, mode) || Number.MAX_SAFE_INTEGER;
    if (waitA !== waitB) return waitA - waitB;

    return a.title.localeCompare(b.title);
  });
}

function isProjectEmpty() {
  return getFirstTaskIdForProject() === null;
}

function shouldShowEmptyCompose() {
  const task = getTask(activeTaskId);
  if (activeAppMode === 'code') {
    if (isProjectEmpty()) return true;
    return task?.status === 'backlog';
  }
  if (isProjectEmpty()) return true;
  return task?.draft === true;
}

function populateProjectEmptyInput(task) {
  const input = $('#project-empty-input');
  if (!input) return;

  if (task?.draft) {
    input.value = '';
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 200)}px`;
    return;
  }

  if (task?.status === 'backlog' && activeAppMode === 'code') {
    input.value = task.description || task.title;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 200)}px`;
    return;
  }

  input.value = '';
  input.style.height = 'auto';
  input.placeholder = 'Plan, Build, / for skills, @ for context';
}

function applyProjectEmptyModeUi() {
  const title = $('#project-empty-title');
  const branchChip = $('#project-empty-branch-chip');
  const runtimeWrap = $('#project-empty-runtime-wrap');
  const startBtn = $('#project-empty-start-btn');
  const showCodeControls = activeAppMode === 'code';

  if (title) {
    if (activeAppMode === 'chat') title.textContent = 'New chat';
    else if (activeAppMode === 'design') title.textContent = 'New artifact';
    else title.textContent = 'New task';
  }

  branchChip?.toggleAttribute('hidden', !showCodeControls);
  runtimeWrap?.toggleAttribute('hidden', !showCodeControls);
  startBtn?.toggleAttribute('hidden', activeAppMode !== 'code');
  closeProjectEmptyMenus();

  const input = $('#project-empty-input');
  if (input) {
    if (activeAppMode === 'chat') {
      input.placeholder = 'Ask anything…';
    } else if (activeAppMode === 'design') {
      input.placeholder = 'Describe a screen to prototype…';
    } else {
      input.placeholder = 'Plan, Build, / for skills, @ for context';
    }
  }

  placeProjectEmptyModelSelect();
  updateChatComposeTitles();
}

function placeProjectEmptyModelSelect() {
  const model = $('#project-empty-model-select');
  const headerEnd = $('#project-empty-header-end');
  const footerTools = $('.project-empty-input-tools');
  if (!model || !headerEnd || !footerTools) return;

  if (activeAppMode === 'code') {
    if (!footerTools.contains(model)) footerTools.appendChild(model);
  } else if (!headerEnd.contains(model)) {
    headerEnd.appendChild(model);
  }
}

function updateChatComposeTitles() {
  const generalTitle = $('#general-chat-compose-title');
  const designTitle = $('#design-chat-compose-title');
  const task = getTask(activeTaskId);

  if (generalTitle) {
    generalTitle.textContent = task && !task.draft
      ? task.title
      : 'New chat';
  }

  if (designTitle) {
    designTitle.textContent = task && !task.draft
      ? task.title
      : 'New artifact';
  }
}

function getActiveModelSelectWrap() {
  if (shouldShowEmptyCompose()) return $('#project-empty-model-select');
  if (activeAppMode === 'chat') return $('#general-chat-model-select');
  if (activeAppMode === 'design') return $('#design-chat-model-select');
  return null;
}

function getModelFromActiveCompose() {
  const wrap = getActiveModelSelectWrap();
  return wrap?.querySelector('input[type="hidden"]')?.value || 'multi';
}

function syncModelSelects(task) {
  const model = task?.model || 'multi';
  [
    $('#project-empty-model-select'),
    $('#general-chat-model-select'),
    $('#design-chat-model-select'),
  ].forEach((wrap) => {
    if (wrap) setRichSelectValue(wrap, MODEL_OPTIONS, model);
  });
}

function applyModelToTask(task) {
  if (!task) return;
  task.model = getModelFromActiveCompose();
}

function getProjectEmptyComposeSettings() {
  const permInput = $('#project-empty-permissions-select')?.querySelector('input[type="hidden"]');
  const deliveryInput = $('#project-empty-delivery-select')?.querySelector('input[type="hidden"]');
  return {
    permissionMode: permInput?.value || 'yolo',
    deliveryMode: deliveryInput?.value || 'manual',
    model: getModelFromActiveCompose(),
  };
}

function syncTaskComposeSelects(task) {
  setRichSelectValue(
    $('#task-permissions-select'),
    PERMISSION_MODES,
    task?.permissionMode || 'ask-edits',
  );
  setRichSelectValue(
    $('#task-model-select'),
    MODEL_OPTIONS,
    task?.model || 'multi',
  );
  setRichSelectValue(
    $('#task-delivery-select'),
    DELIVERY_MODES,
    task?.deliveryMode || 'manual',
  );
}

function syncProjectEmptySelects(task) {
  const permWrap = $('#project-empty-permissions-select');
  const deliveryWrap = $('#project-empty-delivery-select');
  const modelWrap = $('#project-empty-model-select');
  if (!permWrap || !deliveryWrap || !modelWrap) return;

  setRichSelectValue(
    permWrap,
    PERMISSION_MODES,
    task?.permissionMode || permWrap.dataset.default || 'yolo',
  );
  setRichSelectValue(
    deliveryWrap,
    DELIVERY_MODES,
    task?.deliveryMode || deliveryWrap.dataset.default || 'manual',
  );
  setRichSelectValue(
    modelWrap,
    MODEL_OPTIONS,
    task?.model || modelWrap.dataset.default || 'multi',
  );
  syncModelSelects(task);
}

function updateProjectEmptyState() {
  if (subheaderView === 'overview') return;

  const show = shouldShowEmptyCompose();
  const taskMain = $('.task-main');
  const emptyEl = $('#project-empty-state');

  taskMain?.classList.toggle('is-project-empty', show);
  if (emptyEl) {
    emptyEl.hidden = !show;
    if (show) {
      applyProjectEmptyModeUi();
      populateProjectEmptyInput(getTask(activeTaskId));
      syncProjectEmptySelects(getTask(activeTaskId));
      const label = $('#project-empty-project-label');
      if (label) {
        label.textContent = activeRepo.includes('all') || activeRepo.length === 0
          ? 'studio-prototype'
          : projectLabel(activeRepo[0]);
      }
      initIcons(emptyEl);
    }
  }
}

function createTaskFromEmptyState(description, { startImmediately = false } = {}) {
  const trimmed = description.trim();
  if (!trimmed) return null;

  const title = trimmed.split('\n')[0].trim() || trimmed;
  const status = activeAppMode === 'code' && !startImmediately
    ? 'backlog'
    : 'in-progress';
  const { permissionMode, deliveryMode, model } = getProjectEmptyComposeSettings();

  const task = {
    id: uid(),
    title,
    description: trimmed,
    repo: defaultRepoForNewTask(),
    project: defaultProjectForNewTask(),
    status,
    permissionMode,
    deliveryMode,
    model,
    prs: 0,
    commits: 0,
    files: 0,
    additions: 0,
    deletions: 0,
    chat: [],
  };
  tasks.push(task);

  if (startImmediately && activeAppMode === 'code') {
    moveTaskToInProgress(task);
  }

  renderBoard();
  openTaskDetail(task.id);
  return task;
}

function startTaskFromBacklogCompose(description) {
  const task = getTask(activeTaskId);
  if (!task || task.status !== 'backlog' || activeAppMode !== 'code') return null;

  const text = description.trim();
  if (!text) return null;

  task.description = text;
  task.title = text.split('\n')[0].trim() || text;
  task.draft = false;
  Object.assign(task, getProjectEmptyComposeSettings());
  $('#task-detail-title').textContent = task.title;
  moveTaskToInProgress(task);
  renderBoard();
  updateTaskDetailLayout(task);
  updateProjectEmptyState();
  renderTaskChat();
  renderDiff();
  syncTaskComposeSelects(task);
  if (!task.workSimulated && task.chat.length === 0) {
    runTaskAgentWork(task);
  }
  return task;
}

function submitProjectEmptyInput() {
  const input = $('#project-empty-input');
  if (!input) return;

  let text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';

  const task = getTask(activeTaskId);
  if (task?.draft && activeAppMode !== 'code') {
    startDraftFromEmptyCompose(text);
    return;
  }

  if (task?.status === 'backlog' && activeAppMode === 'code') {
    startTaskFromBacklogCompose(text);
    return;
  }

  createTaskFromEmptyState(text, { startImmediately: activeAppMode === 'code' });
}

function focusProjectEmptyInput(placeholder) {
  const input = $('#project-empty-input');
  if (!input) return;
  input.focus();
  if (!input.value.trim() && placeholder) {
    input.placeholder = placeholder;
  }
}

let projectEmptyRuntime = 'this-mac';

const PROJECT_EMPTY_RUNTIME_OPTIONS = {
  'this-mac': { label: 'Local', icon: 'laptop' },
  'new-worktree': { label: 'New Worktree', icon: 'git-branch' },
};

function closeProjectEmptyMenus() {
  const menu = $('#project-empty-runtime-menu');
  const trigger = $('#project-empty-runtime-trigger');
  if (menu) menu.hidden = true;
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function setProjectEmptyRuntime(value) {
  projectEmptyRuntime = value;
  const menu = $('#project-empty-runtime-menu');
  const trigger = $('#project-empty-runtime-trigger');
  const labelEl = $('#project-empty-runtime-label');
  const iconEl = $('#project-empty-runtime-icon');
  const option = PROJECT_EMPTY_RUNTIME_OPTIONS[value] || PROJECT_EMPTY_RUNTIME_OPTIONS['this-mac'];

  if (menu) {
    menu.querySelectorAll('.project-empty-chip-option').forEach((item) => {
      const selected = item.dataset.value === value;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-selected', String(selected));
    });
  }

  if (labelEl) labelEl.textContent = option.label;
  if (iconEl) {
    iconEl.dataset.icon = option.icon;
    initIcons(trigger);
  }
}

function initProjectEmptyRuntimeMenu() {
  const wrap = $('#project-empty-runtime-wrap');
  const trigger = $('#project-empty-runtime-trigger');
  const menu = $('#project-empty-runtime-menu');
  if (!wrap || !trigger || !menu) return;

  setProjectEmptyRuntime(projectEmptyRuntime);

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    closeRichSelects();
    const open = menu.hidden;
    closeProjectEmptyMenus();
    if (open) {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      initIcons(menu);
    }
  });

  menu.addEventListener('click', (e) => {
    const option = e.target.closest('.project-empty-chip-option');
    if (!option) return;
    setProjectEmptyRuntime(option.dataset.value);
    closeProjectEmptyMenus();
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('#project-empty-runtime-wrap')) return;
    closeProjectEmptyMenus();
  });
}

function initProjectEmptyState() {
  const input = $('#project-empty-input');
  const startBtn = $('#project-empty-start-btn');

  if (!input) return;

  const submit = () => submitProjectEmptyInput();

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 200)}px`;
  });

  startBtn?.addEventListener('click', () => {
    if (!input.value.trim()) {
      input.focus();
      return;
    }
    submit();
  });
}

function addEmptyProject({ name = 'New project', skills = [], connectors = [], repository = 'none' } = {}) {
  const displayName = name.trim() || 'New project';
  const slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `project-${uid().slice(0, 6)}`;
  if (PROJECT_LABELS[slug]) return slug;

  PROJECT_LABELS[slug] = displayName;
  if (repository && repository !== 'none') {
    PROJECT_REPOS[slug] = repository;
  } else {
    PROJECT_REPOS[slug] = `cast-ai/${slug}`;
  }

  const menu = $('#project-filter-menu');
  const divider = menu?.querySelector('.project-filter-divider');
  if (menu && divider) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'project-filter-option';
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', 'false');
    btn.dataset.value = slug;
    btn.innerHTML = `<span>${escapeHtml(PROJECT_LABELS[slug])}</span><span class="project-filter-check" aria-hidden="true"><span class="icon-slot" data-icon="check" data-size="14" data-icon-class="lucide-icon"></span></span>`;
    menu.insertBefore(btn, divider);
  }

  projectDirectories[slug] = createProjectDirectory(skills, connectors);
  setSubheaderView('project', [slug]);
  renderDirectoryCounts();
  return slug;
}

function resetNewProjectModal() {
  const nameInput = $('#new-project-name');
  if (nameInput) nameInput.value = '';

  resetMultiSelect($('#new-project-skills-select'), NEW_PROJECT_SKILL_OPTIONS);
  resetMultiSelect($('#new-project-connectors-select'), NEW_PROJECT_CONNECTOR_OPTIONS);
  setRichSelectValue($('#new-project-repo-select'), getNewProjectRepositoryOptions(), 'none');
}

function openNewProjectModal() {
  const modal = $('#new-project-modal');
  if (!modal) return;

  resetNewProjectModal();
  modal.showModal();
  initIcons(modal);
  $('#new-project-name')?.focus();
}

function closeNewProjectModal() {
  closeRichSelects();
  $('#new-project-modal')?.close();
}

function initNewProjectModal() {
  const modal = $('#new-project-modal');
  const form = $('#new-project-form');
  if (!modal || !form || modal.dataset.bound) return;
  modal.dataset.bound = 'true';

  initMultiSelect($('#new-project-skills-select'), NEW_PROJECT_SKILL_OPTIONS);
  initMultiSelect($('#new-project-connectors-select'), NEW_PROJECT_CONNECTOR_OPTIONS);
  initRichSelect($('#new-project-repo-select'), getNewProjectRepositoryOptions());

  $('#new-project-modal-close')?.addEventListener('click', () => closeNewProjectModal());
  $('#new-project-cancel')?.addEventListener('click', () => closeNewProjectModal());

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeNewProjectModal();
  });

  modal.addEventListener('close', closeRichSelects);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#new-project-name')?.value || '';
    const skills = getMultiSelectValues($('#new-project-skills-select'));
    const connectors = getMultiSelectValues($('#new-project-connectors-select'));
    const repository = $('#new-project-repo-select')?.querySelector('input[type="hidden"]')?.value || 'none';

    addEmptyProject({ name, skills, connectors, repository });
    closeNewProjectModal();
  });
}

function initNewProjectButton() {
  $('#new-project-btn')?.addEventListener('click', () => {
    const trigger = $('#project-filter-trigger');
    const menu = $('#project-filter-menu');
    if (trigger && menu) {
      trigger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('hidden', '');
      menu.setAttribute('aria-hidden', 'true');
    }
    openNewProjectModal();
  });
}

function syncReviewReason(task) {
  if (task.status === 'pr-review') {
    if (!PR_REVIEW_REASONS.has(task.reviewReason)) {
      const options = [...PR_REVIEW_REASONS];
      const index = Number.parseInt(String(task.id).replace(/\D/g, '') || '0', 10) % options.length;
      task.reviewReason = options[index];
    }
    if (!task.reviewSince) task.reviewSince = Date.now();
    if (!task.prs) task.prs = 1;
    return;
  }

  if (task.status === 'review') {
    if (!AGENT_REVIEW_REASONS.has(task.reviewReason)) {
      task.reviewReason = Number.parseInt(String(task.id).replace(/\D/g, '') || '0', 10) % 2 === 0
        ? 'needs-input'
        : 'ready';
    }
    if (!task.reviewSince) task.reviewSince = Date.now();
    return;
  }

  task.reviewReason = null;
  task.reviewSince = null;
}

function getReviewReasonMeta(task) {
  if (task.status !== 'review' && task.status !== 'pr-review') return null;
  syncReviewReason(task);
  return REVIEW_REASONS[task.reviewReason] || REVIEW_REASONS.ready;
}

const TASK_CARD_SPINNER_FRAMES = [
  // line spin
  '|', '/', '╱', '-', '╲', '\\', '|', '/', '-', '\\',
  // circle fill / empty
  '○', '◔', '◑', '◕', '●', '◕', '◑', '◔', '○',
  '◐', '◓', '◑', '◒', '◐',
  // star / asterisk blink
  '·', '․', '*', '∗', '✦', '✶', '✦', '∗', '*', '․', '·',
];
const TASK_CARD_SPINNER_HOLD_TICKS = 2;
let taskCardSpinnerFrame = 0;
let taskCardSpinnerHold = 0;
let taskCardSpinnerTimer = null;

function tickTaskCardSpinners() {
  taskCardSpinnerHold += 1;
  if (taskCardSpinnerHold < TASK_CARD_SPINNER_HOLD_TICKS) return;
  taskCardSpinnerHold = 0;
  taskCardSpinnerFrame = (taskCardSpinnerFrame + 1) % TASK_CARD_SPINNER_FRAMES.length;
  const glyph = TASK_CARD_SPINNER_FRAMES[taskCardSpinnerFrame];
  document.querySelectorAll('.task-card-spinner-glyph').forEach((el) => {
    el.textContent = glyph;
  });
}

function startTaskCardSpinners() {
  if (taskCardSpinnerTimer != null) return;
  taskCardSpinnerTimer = window.setInterval(tickTaskCardSpinners, 110);
}

function reviewStatusCardHtml(task) {
  const meta = getReviewReasonMeta(task);
  if (!meta) return '';
  return `<span class="task-card-review task-card-review--${task.reviewReason}" role="img" aria-label="${escapeHtml(meta.cardLabel)}">${escapeHtml(meta.cardLabel)}</span>`;
}

function taskCardInProgressSpinnerHtml() {
  return `<span class="task-card-spinner" role="status" aria-label="In progress"><span class="task-card-spinner-glyph">${TASK_CARD_SPINNER_FRAMES[taskCardSpinnerFrame]}</span></span>`;
}

function taskCardStatusEndHtml(task) {
  if (task.status === 'in-progress') return taskCardInProgressSpinnerHtml();
  if (task.status === 'review' || task.status === 'pr-review') return reviewStatusCardHtml(task);
  return '';
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
  if (task.status === 'review' || task.status === 'pr-review') {
    const meta = getReviewReasonMeta(task);
    return `<span class="sidebar-task-icon sidebar-task-icon--review sidebar-task-icon--${task.reviewReason}" aria-hidden="true">
      ${iconHtml(meta.icon, { size: 12, className: 'lucide-icon' })}
    </span>`;
  }
  if (task.status === 'closed') {
    const icon = task.repo === 'design' ? 'check-check' : 'git-pull-request';
    const modifier = task.repo === 'design' ? 'done' : 'pr';
    return `<span class="sidebar-task-icon sidebar-task-icon--${modifier}" aria-hidden="true">
      ${iconHtml(icon, { size: 12, className: 'lucide-icon' })}
    </span>`;
  }
  return '';
}

function getTaskWorktreeSlug(task) {
  return task.worktree || TASK_WORKTREES[task.id] || 'worktree-1';
}

function getTaskWorktreeShortPath(task) {
  return `../${getTaskWorktreeSlug(task)}`;
}

function getTaskWorktreeFullPath(task) {
  return `~/kimchi/${getTaskWorktreeSlug(task)}`;
}

function getTaskBranchName(task) {
  return getTaskDiffBundle(task).branch;
}

function taskCardGitTooltip(task) {
  const branch = getTaskBranchName(task);
  const parts = [branch];
  if (task.prs > 0) parts.push(`${task.prs} open PR${task.prs === 1 ? '' : 's'}`);
  if (task.commits > 0) parts.push(`${task.commits} commit${task.commits === 1 ? '' : 's'}`);
  return parts.join(' · ');
}

function taskCardDiffTooltip(task) {
  if (!shouldShowTaskCardDiffPill(task)) return 'No file changes yet';
  const parts = [];
  if (task.files) parts.push(`${task.files} file${task.files === 1 ? '' : 's'}`);
  if (task.additions) parts.push(`+${task.additions}`);
  if (task.deletions) parts.push(`−${task.deletions}`);
  return parts.join(' · ') || 'No file changes yet';
}

function shouldShowTaskCardDiffPill(task) {
  return (task.files || 0) > 0 || (task.additions || 0) > 0 || (task.deletions || 0) > 0;
}

function taskCardGitPillHtml(task) {
  const hasPr = task.prs > 0;
  const hasCommits = task.commits > 0;
  const branch = getTaskBranchName(task);
  const label = hasCommits || hasPr ? branch : 'main';
  const modifier = hasPr ? 'git-pr' : hasCommits ? 'git-branch' : 'git-idle';
  const icon = hasPr ? 'git-pull-request' : 'git-branch';

  return `<span class="task-card-pill task-card-pill--git task-card-pill--${modifier} has-tooltip" data-tooltip="${escapeHtml(taskCardGitTooltip(task))}">
    ${iconHtml(icon, { size: 11, className: 'lucide-icon task-card-pill-icon' })}
    <span class="task-card-pill-label">${escapeHtml(label)}</span>
  </span>`;
}

function taskCardDiffPillHtml(task) {
  const files = task.files || 0;
  const additions = task.additions || 0;
  return `<span class="task-card-pill task-card-pill--diff has-tooltip" data-tooltip="${escapeHtml(taskCardDiffTooltip(task))}">
    ${iconHtml('file', { size: 11, className: 'lucide-icon task-card-pill-icon' })}
    <span class="task-card-pill-label">${files} <span class="task-card-pill-sep">•</span> <span class="add">+${additions}</span></span>
  </span>`;
}

function taskCardWorktreePillHtml(task) {
  const shortPath = getTaskWorktreeShortPath(task);
  return `<span class="task-card-pill task-card-pill--worktree has-tooltip" data-tooltip="${escapeHtml(getTaskWorktreeFullPath(task))}">
    ${iconHtml('folder', { size: 11, className: 'lucide-icon task-card-pill-icon' })}
    <span class="task-card-pill-label">${escapeHtml(shortPath)}</span>
  </span>`;
}

function taskCardSecondaryHtml(task, { showProject = false, showWorktree = true } = {}) {
  if (!showProject) {
    const linkCount = getTaskLinkCount(task);
    return `<div class="task-card-secondary">
      <span class="task-card-tag task-card-tag--repo">${escapeHtml(task.repo)}</span>
      ${linkCount > 0 ? `<span class="task-card-tag task-card-tag--linked">${iconHtml('link', { size: 10, className: 'lucide-icon task-card-tag-icon' })} ${linkCount} task${linkCount === 1 ? '' : 's'}</span>` : ''}
    </div>`;
  }

  const pills = [];
  if (showWorktree) pills.push(taskCardWorktreePillHtml(task));
  pills.push(taskCardGitPillHtml(task));
  if (shouldShowTaskCardDiffPill(task)) pills.push(taskCardDiffPillHtml(task));

  return `<div class="task-card-secondary">${pills.join('')}</div>`;
}

function taskCardFooterActionHtml(task) {
  if (task.status !== 'backlog') return '';
  return `<button type="button" class="task-card-play" data-task-id="${task.id}" aria-label="Start task">
    ${iconHtml('play', { size: 14, className: 'lucide-icon' })}
  </button>`;
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
  if (subheaderView === 'overview') renderProjectOverview();
  if (activeTaskId === task.id) {
    updateTaskDetailLayout(task);
    renderTaskChat();
    renderDiff();
    if (!task.workSimulated && task.chat.length === 0) {
      runTaskAgentWork(task);
    }
  }
}

function startAllColumnTasks(status) {
  tasksForBoard()
    .filter((t) => t.status === status)
    .forEach(moveTaskToInProgress);
  renderBoard();
}

function archiveCompletedTasks() {
  const archiveBucket = activeAppMode === 'code' ? 'merged' : 'done';
  const toArchive = tasksForTaskSidebar().filter((task) => {
    if (task.archived) return false;
    return getSidebarBucket(task) === archiveBucket;
  });
  if (toArchive.length === 0) return;

  const archivedIds = new Set(toArchive.map((task) => task.id));
  toArchive.forEach((task) => {
    markTaskAsArchived(task);
  });

  if (activeTaskId && archivedIds.has(activeTaskId)) {
    const nextTask = tasksForTaskSidebar().find((task) => !archivedIds.has(task.id));
    if (nextTask) openTaskDetail(nextTask.id);
    else activeTaskId = null;
  }

  renderBoard();
  renderTaskSidebar();
  if (subheaderView === 'overview') renderProjectOverview();
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

function getTaskPullRequests(task) {
  if (!task?.prs) return [];

  const number = taskPrNumber(task);
  const repo = githubRepoName(task.repo);
  return [{
    number,
    title: taskPrTitle(task),
    repo,
    status: task.status === 'closed' ? 'merged' : 'open',
    url: `https://github.com/kimchi-studio/${repo}/pull/${number}`,
  }];
}

function getTaskCommits(task) {
  if (!task?.commits) return [];

  const repo = githubRepoName(task.repo);
  return taskCommitMessages(task).map((message, index) => {
    const hash = mockCommitHash(task, index);
    return {
      hash,
      message,
      repo,
      url: `https://github.com/kimchi-studio/${repo}/commit/${hash}`,
    };
  });
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

  closeRichSelects();
  closeWorkspaceStatsMenu();

  workspaceStatsMenuAnchor = anchor;
  workspaceStatsMenuType = type;

  const task = getTask(activeTaskId);
  if (type === 'prs') {
    const prs = getTaskPullRequests(task);
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
    const commits = getTaskCommits(task);
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

function getTaskHeaderStats(task) {
  if (!task) {
    return { files: 0, additions: 0, deletions: 0, prs: 0, commits: 0 };
  }

  return {
    files: task.files || 0,
    additions: task.additions || 0,
    deletions: task.deletions || 0,
    prs: task.prs || 0,
    commits: task.commits || 0,
  };
}

function taskHasHeaderStats(task) {
  const stats = getTaskHeaderStats(task);
  return stats.files > 0 || stats.additions > 0 || stats.deletions > 0 || stats.prs > 0 || stats.commits > 0;
}

function renderTaskHeaderStats() {
  const statsWrap = $('#task-subheader-stats');
  const filesEl = $('#board-workspace-files');
  const prsEl = $('#board-workspace-prs');
  const commitsEl = $('#board-workspace-commits');
  if (!filesEl || !prsEl || !commitsEl) return;

  const task = getTask(activeTaskId);
  const stats = getTaskHeaderStats(task);
  const hasAny = taskHasHeaderStats(task);

  if (statsWrap) statsWrap.hidden = !hasAny;
  if (!hasAny) {
    filesEl.hidden = true;
    prsEl.hidden = true;
    commitsEl.hidden = true;
    closeWorkspaceStatsMenu();
    return;
  }

  const hasFiles = stats.files > 0 || stats.additions > 0 || stats.deletions > 0;
  if (hasFiles) {
    const fileLabel = stats.files === 1 ? '1 file' : `${stats.files} files`;
    filesEl.innerHTML = `${fileLabel} <span class="add">+${stats.additions}</span> <span class="del">−${stats.deletions}</span>`;
    filesEl.hidden = false;
  } else {
    filesEl.hidden = true;
  }

  if (stats.prs > 0) {
    const prLabel = stats.prs === 1 ? '1 PR' : `${stats.prs} PRs`;
    prsEl.innerHTML = `${iconHtml('git-pull-request', { size: 12 })} ${prLabel}`;
    prsEl.hidden = false;
  } else {
    prsEl.hidden = true;
  }

  if (stats.commits > 0) {
    const commitLabel = stats.commits === 1 ? '1 commit' : `${stats.commits} commits`;
    commitsEl.innerHTML = `${iconHtml('git-commit', { size: 12 })} ${commitLabel}`;
    commitsEl.hidden = false;
  } else {
    commitsEl.hidden = true;
  }
}

function renderBoardSubheader() {
  closeWorkspaceStatsMenu();
  renderTaskHeaderStats();
  renderDirectoryCounts();
}

function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

function renderDirectoryCounts() {
  const skillsBtn = $('#subheader-skills-btn');
  const connectorsBtn = $('#subheader-connectors-btn');
  const skillCount = getScopedActiveSkills().size;
  const connectorCount = getScopedActiveConnectors().size;

  if (skillsBtn) {
    skillsBtn.textContent = `${skillCount} ${pluralize(skillCount, 'skill')}`;
  }
  if (connectorsBtn) {
    connectorsBtn.textContent = `${connectorCount} ${pluralize(connectorCount, 'connector')}`;
  }
}

function openDirectoryModal(section = 'skills') {
  const modal = $('#directory-modal');
  if (!modal) return;

  directoryState.section = section;
  directoryState.search = '';
  const search = $('#directory-search');
  if (search) search.value = '';

  renderDirectoryModal();
  modal.showModal();
  initIcons(modal);
  search?.focus();
}

function closeDirectoryModal() {
  $('#directory-modal')?.close();
}

function setDirectorySection(section) {
  directoryState.section = section;
  directoryState.search = '';
  const search = $('#directory-search');
  if (search) {
    search.value = '';
    search.placeholder = section === 'connectors'
      ? 'Search connectors…'
      : 'Search skills…';
  }
  renderDirectoryModal();
}

function directorySkillMatchesSource(skill) {
  if (directoryState.sourceTab === 'organization') return skill.source === 'organization';
  if (directoryState.sourceTab === 'anthropic') return skill.source === 'anthropic';
  return skill.source === 'shared' || skill.source === 'organization';
}

function directoryMatchesSearch(text) {
  const query = directoryState.search.trim().toLowerCase();
  if (!query) return true;
  return text.toLowerCase().includes(query);
}

function directorySkillCardHtml(skill) {
  const active = isSkillActiveInScope(skill.id);
  const actionHtml = isDirectoryAllProjects() ? '' : `
      <button type="button" class="directory-card-action" data-directory-toggle="skill" data-directory-id="${skill.id}" aria-label="${active ? 'Manage skill' : 'Add skill'}">
        <span class="icon-slot" data-icon="${active ? 'settings' : 'plus'}" data-size="14" data-icon-class="lucide-icon lucide-muted"></span>
      </button>`;

  return `<article class="directory-card" data-directory-id="${skill.id}" data-directory-type="skill">
    <div class="directory-card-top">
      <div class="directory-card-title">${escapeHtml(skill.slug)}</div>
      ${actionHtml}
    </div>
    <div class="directory-card-meta">${escapeHtml(skill.author)} · ${skill.uses}</div>
    ${directoryProjectsHtml('skill', skill.id)}
    <p class="directory-card-desc">${escapeHtml(skill.desc)}</p>
  </article>`;
}

function directoryConnectorCardHtml(connector) {
  const active = isConnectorActiveInScope(connector.id);
  const actionHtml = isDirectoryAllProjects() ? '' : `
      <button type="button" class="directory-card-action" data-directory-toggle="connector" data-directory-id="${connector.id}" aria-label="${active ? 'Manage connector' : 'Connect'}">
        <span class="icon-slot" data-icon="${active ? 'settings' : 'plus'}" data-size="14" data-icon-class="lucide-icon lucide-muted"></span>
      </button>`;

  return `<article class="directory-card directory-card-connector" data-directory-id="${connector.id}" data-directory-type="connector">
    <div class="directory-card-top">
      <div class="directory-card-brand">
        <span class="directory-card-logo" style="background:${connector.color}">${escapeHtml(connector.letter)}</span>
        <div>
          <div class="directory-card-title">${escapeHtml(connector.name)}</div>
          ${connector.badge ? `<div class="directory-card-badge">${escapeHtml(connector.badge)}</div>` : ''}
        </div>
      </div>
      ${actionHtml}
    </div>
    ${directoryProjectsHtml('connector', connector.id)}
    <p class="directory-card-desc">${escapeHtml(connector.desc)}</p>
  </article>`;
}

function renderDirectoryModal() {
  const modal = $('#directory-modal');
  if (!modal) return;

  const title = $('#directory-modal-title');
  if (title) title.textContent = getDirectoryModalTitle();

  const { section } = directoryState;
  const sourceTabs = $('#directory-source-tabs');
  const sectionLabel = $('#directory-section-label');
  const grid = $('#directory-grid');

  modal.querySelectorAll('.directory-nav-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.directorySection === section);
  });

  if (sourceTabs) {
    if (section === 'skills') {
      const tabs = [
        { id: 'organization', label: 'Your organization' },
        { id: 'shared', label: 'Shared' },
        { id: 'anthropic', label: 'Anthropic' },
      ];
      sourceTabs.hidden = false;
      sourceTabs.innerHTML = tabs.map((tab) => `
        <button type="button" class="directory-source-tab${directoryState.sourceTab === tab.id ? ' active' : ''}" data-directory-source="${tab.id}">
          ${escapeHtml(tab.label)}
        </button>`).join('');
    } else {
      sourceTabs.hidden = false;
      sourceTabs.innerHTML = `<span class="directory-source-chip">Anthropic &amp; Partners</span>`;
    }
  }

  if (sectionLabel) {
    if (section === 'connectors') sectionLabel.textContent = 'Available to your team';
    else sectionLabel.textContent = 'Available skills';
  }

  if (!grid) return;

  let cards = '';
  if (section === 'skills') {
    cards = DIRECTORY_SKILLS
      .filter((skill) => directorySkillMatchesSource(skill))
      .filter((skill) => directoryMatchesSearch(`${skill.slug} ${skill.author} ${skill.desc}`))
      .map(directorySkillCardHtml)
      .join('');
  } else {
    cards = DIRECTORY_CONNECTORS
      .filter((connector) => directoryMatchesSearch(`${connector.name} ${connector.desc}`))
      .map(directoryConnectorCardHtml)
      .join('');
  }

  grid.innerHTML = cards || `<div class="directory-empty">No matches found.</div>`;
  initIcons(modal);
}

function toggleDirectoryItem(type, id) {
  if (isDirectoryAllProjects()) return;

  const dir = getProjectDirectory(activeRepo[0]);
  const set = type === 'skill' ? dir.activeSkills : dir.activeConnectors;

  if (set.has(id)) set.delete(id);
  else set.add(id);

  renderDirectoryCounts();
  renderDirectoryModal();
}

function initDirectoryModal() {
  const modal = $('#directory-modal');
  if (!modal || modal.dataset.bound) return;
  modal.dataset.bound = 'true';

  $('#subheader-skills-btn')?.addEventListener('click', () => openDirectoryModal('skills'));
  $('#subheader-connectors-btn')?.addEventListener('click', () => openDirectoryModal('connectors'));
  $('#directory-modal-close')?.addEventListener('click', () => closeDirectoryModal());

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeDirectoryModal();
  });

  modal.addEventListener('close', closeSidebarItemMenus);

  modal.querySelector('.directory-nav')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-directory-section]');
    if (!btn) return;
    setDirectorySection(btn.dataset.directorySection);
  });

  $('#directory-search')?.addEventListener('input', (e) => {
    directoryState.search = e.target.value;
    renderDirectoryModal();
  });

  modal.addEventListener('click', (e) => {
    const sourceTab = e.target.closest('[data-directory-source]');
    if (sourceTab) {
      directoryState.sourceTab = sourceTab.dataset.directorySource;
      renderDirectoryModal();
      return;
    }

    const toggle = e.target.closest('[data-directory-toggle]');
    if (toggle) {
      e.preventDefault();
      toggleDirectoryItem(toggle.dataset.directoryToggle, toggle.dataset.directoryId);
    }
  });

  renderDirectoryCounts();
}

function uid() {
  return `t${nextId++}`;
}

/* ── Views ── */
function showView(name) {
  $$('.view').forEach((v) => v.classList.remove('active'));
  $(`#view-${name}`).classList.add('active');
}

function setTheme(theme) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  $('#theme-color-meta')?.setAttribute(
    'content',
    nextTheme === 'light' ? '#f4f5f7' : '#0d0f14',
  );
  updateThemeToggleUi();
  refreshThemeCharts();
}

function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

function updateThemeToggleUi() {
  const isDark = getTheme() === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const icon = isDark ? 'sun' : 'moon';

  $$('.theme-toggle').forEach((btn) => {
    btn.setAttribute('aria-label', label);
    btn.title = label;
    const slot = btn.querySelector('.theme-toggle-icon');
    if (slot) slot.dataset.icon = icon;
  });
  initIcons();
}

function refreshThemeCharts() {
  if (!$('#view-workspaces')?.classList.contains('active')) return;
  setWorkspaceChartTab(activeWorkspaceChartTab);
}

function initTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  setTheme(stored === 'light' ? 'light' : 'dark');
}

function getKimchiWorkspaceStats() {
  const memberCount = WORKSPACES.find((workspace) => workspace.id === 'kimchi')?.memberCount || 4;
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
    cost: workspaceDailyCostBase(memberCount, repos) * 30,
  };
}

function buildKimchiWorkspaceHistory() {
  const stats = getKimchiWorkspaceStats();
  const memberCount = WORKSPACES.find((workspace) => workspace.id === 'kimchi')?.memberCount || 4;
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
      history: withWeekendDip(buildKimchiWorkspaceHistory()),
      stats,
    };
  }

  const history = withWeekendDip(workspace.history);
  return {
    repos: workspace.repos,
    openPrs: workspace.openPrs,
    avgDailyCost: workspace.avgDailyCost,
    history,
    stats: {
      backlog: history.tasks[6].backlog,
      inProgress: history.tasks[6].inProgress,
      review: history.tasks[6].review,
      closed: history.tasks[6].closed,
      commits: history.commits.reduce((sum, n) => sum + n, 0),
      prs: workspace.openPrs,
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
          fill: workspaceStatusColors()[key],
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
        color: workspaceStatusColors()[row.key],
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

let workspaceBoardMenuId = null;

function closeWorkspaceBoardMenus() {
  $$('.workspace-card-menu').forEach((menu) => {
    menu.hidden = true;
  });
  $$('.workspace-card-menu-btn').forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
  });
  workspaceBoardMenuId = null;
}

function toggleWorkspaceBoardMenu(workspaceId, btn) {
  const isOpen = workspaceBoardMenuId === workspaceId;
  closeWorkspaceBoardMenus();
  if (isOpen) return;

  const card = btn.closest('.workspace-card');
  const menu = card?.querySelector('.workspace-card-menu');
  if (!menu) return;

  menu.hidden = false;
  btn.setAttribute('aria-expanded', 'true');
  workspaceBoardMenuId = workspaceId;
}

function deleteWorkspace(workspaceId) {
  const workspace = WORKSPACES.find((item) => item.id === workspaceId);
  if (!workspace || workspace.live) return;

  const index = WORKSPACES.findIndex((item) => item.id === workspaceId);
  if (index === -1) return;

  WORKSPACES.splice(index, 1);
  closeWorkspaceBoardMenus();

  if (activeWorkspaceId === workspaceId) {
    const fallback = WORKSPACES.find((item) => item.live) || WORKSPACES[0];
    if (fallback) {
      activeWorkspaceId = fallback.id;
      if ($('#view-task')?.classList.contains('active')) renderBoard();
    } else {
      openWorkspacesOverview();
    }
  }

  renderWorkspacesPage();
  showSnackbar(`Deleted ${workspace.name}`);
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
        <div class="workspace-card-tools">
          <div class="workspace-card-actions">
            <button
              type="button"
              class="workspace-card-menu-btn"
              data-workspace-menu="${workspace.id}"
              aria-label="Board options"
              aria-haspopup="menu"
              aria-expanded="false"
            >
              <span class="icon-slot" data-icon="ellipsis-vertical" data-size="16" data-icon-class="lucide-icon lucide-muted"></span>
            </button>
            <div class="workspace-card-menu" role="menu" hidden>
              <button
                type="button"
                class="workspace-card-menu-item workspace-card-menu-item--danger${workspace.live ? ' is-disabled' : ''}"
                role="menuitem"
                data-workspace-action="delete"
                data-workspace-id="${workspace.id}"
                ${workspace.live ? 'disabled' : ''}
              >Delete board</button>
            </div>
          </div>
        </div>
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
    openTasks: tasks.filter((task) => task.status !== 'closed').length,
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
  closeWorkspaceBoardMenus();
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
        <div class="workspaces-stat-label">Open tasks</div>
        <div class="workspaces-stat-value">${overview.openTasks}</div>
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
    initIcons(grid);
  }
}

function getFirstTaskIdForProject() {
  const visible = tasksForTaskSidebar().filter((task) => !task.archived);
  return visible[0]?.id || null;
}

function openFirstTaskForProject() {
  const taskId = getFirstTaskIdForProject();
  if (taskId) {
    openTaskDetail(taskId);
    return;
  }

  activeTaskId = null;
  if (activeAppMode === 'design') {
    designArtifactHtml = null;
    renderDesignArtifact(null);
    renderDesignChat();
  }
  renderBoardSubheader();
  renderTaskSidebar();
  updateProjectEmptyState();
  if (shouldShowEmptyCompose()) {
    $('#project-empty-input')?.focus();
  }
}

function openWorkspacesOverview() {
  activeTaskId = null;
  renderWorkspacesPage();
  showView('workspaces');
}

function getDefaultTaskId() {
  const visible = tasksForTaskSidebar().filter((task) => !task.archived && !task.draft);
  const preferred = visible.find((task) => task.status === 'review' && task.commits > 0)
    || visible.find((task) => task.status === 'in-progress')
    || visible.find((task) => task.status === 'backlog')
    || visible[0];
  return preferred?.id || null;
}

function openWorkspace(workspaceId) {
  closeWorkspaceBoardMenus();
  const workspace = WORKSPACES.find((item) => item.id === workspaceId);
  if (!workspace) return;

  activeWorkspaceId = workspace.id;
  activeRepo = ['all'];
  updateProjectFilter();

  const defaultTaskId = getDefaultTaskId();
  if (defaultTaskId) openTaskDetail(defaultTaskId);
  else renderBoard();
}

function openTaskDetail(taskId) {
  taskWorkRunId += 1;
  stopThinkingBar();

  activeTaskId = taskId;
  activeDiffFileIndex = 0;
  activeDiffCommitIndex = 0;
  activeChangesFilter = 'uncommitted';
  const task = getTask(taskId);
  if (!task) return;

  $('#task-detail-title').textContent = task.title;
  const badge = $('#task-status-badge');
  badge.textContent = STATUS_LABELS[task.status];
  badge.className = `status-badge ${task.status}`;

  updateChatComposeTitles();

  updateTaskDetailLayout(task);
  renderBoardSubheader();
  renderTaskSidebar();
  updateProjectEmptyState();

  if (activeAppMode === 'chat') {
    if (shouldShowEmptyCompose()) {
      showView('task');
      $('#project-empty-input')?.focus();
      return;
    }
    renderGeneralChatForTask(task);
    syncModelSelects(task);
    showView('task');
    return;
  }

  if (activeAppMode !== 'code') {
    if (shouldShowEmptyCompose()) {
      renderDesignArtifact(null);
      showView('task');
      $('#project-empty-input')?.focus();
      return;
    }
    renderDesignChatForTask(task);
    syncModelSelects(task);
    if (task.repo === 'design' && task.status !== 'backlog') {
      buildDesignPrototypeHtml(task.title, task.id).then((html) => {
        if (activeTaskId !== task.id || activeAppMode !== 'design') return;
        designArtifactHtml = html;
        renderDesignArtifact(html);
      });
    } else {
      renderDesignArtifact(null);
    }
    showView('task');
    return;
  }

  if (task.status === 'backlog') {
    updateTaskDetailLayout(task);
    showView('task');
    updateProjectEmptyState();
    $('#project-empty-input')?.focus();
    return;
  }

  renderTaskChat();
  renderDiff();
  syncTaskComposeSelects(task);
  showView('task');

  if (task.status === 'in-progress' && !task.workSimulated && task.chat.length === 0) {
    runTaskAgentWork(task);
  } else if (task.status === 'review' && !task.workSimulated && task.chat.length === 0) {
    runTaskAgentWork(task);
  }
}

function updateTaskDetailLayout(task) {
  const isBacklog = task.status === 'backlog';
  $('#task-agent-active').hidden = isBacklog;
  $('#work-panel-active').hidden = isBacklog;
  $('#task-agent-panel-title').textContent = 'Task agent';

  if (isBacklog) {
    $('#task-chat-messages').innerHTML = '';
  }
}

/* ── Workspace header + sidebar refresh ── */
function renderBoard() {
  renderBoardSubheader();
  renderTaskSidebar();
  updateProjectEmptyState();
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

  if (!activeRepo.includes('all')) {
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
    createBtn: col.querySelector('.create-task-btn, .overview-kanban-new-task'),
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
    y = createBtn
      ? createBtn.getBoundingClientRect().bottom + gapHalf
      : colRect.top + inset;
  } else if (insertIndex < cards.length) {
    y = cards[insertIndex].getBoundingClientRect().top - gapHalf;
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

  const columnSource = (subheaderView === 'overview' && overviewLayout === 'status')
    ? overviewTasksForStatusBoard()
    : tasksForBoard();
  const column = columnSource.filter((t) => t.status === status);
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
    if (subheaderView === 'overview') renderProjectOverview();
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
      if (oldStatus === 'review' || oldStatus === 'pr-review') {
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
  if (subheaderView === 'overview') renderProjectOverview();
}

function initCardDrag(card, task, { onOpen } = {}) {
  const open = typeof onOpen === 'function' ? onOpen : openTaskDetail;

  card.addEventListener('click', (e) => {
    if (e.target.closest('.task-card-play')) return;
    if (e.target.closest('.task-card-actions')) return;
    if (e.target.closest('.task-card-edit-title')) return;
    if (e.target.closest('.task-card-title-input')) return;
    if (card.classList.contains('is-editing-title')) return;
    open(task.id);
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

function createTaskCard(task, { onOpen, showProject = false, showWorktree = true } = {}) {
  const isClosed = task.status === 'closed';
  const isReview = task.status === 'review' || task.status === 'pr-review';
  const footerAction = taskCardFooterActionHtml(task);

  const card = document.createElement('div');
  card.className = `task-card${isClosed ? ' closed' : ''}${isReview ? ` review-${task.reviewReason}` : ''}`;
  card.dataset.id = task.id;

  card.innerHTML = `
    <div class="task-card-header">
      <div class="task-card-title-row">
        <div class="task-card-title">
          <span class="task-card-title-text">${escapeHtml(task.title)}</span><button type="button" class="task-card-edit-title" aria-label="Edit task name">${iconHtml('pencil', { size: 12, className: 'lucide-icon' })}</button>
        </div>
      </div>
      <div class="task-card-header-end">
        ${taskCardStatusEndHtml(task)}
        <div class="task-card-actions">
          <button type="button" class="task-card-menu-btn" aria-label="Task options" aria-haspopup="menu" aria-expanded="false">
            ${iconHtml('ellipsis-vertical', { size: 14, className: 'lucide-icon lucide-muted' })}
          </button>
          <div class="task-card-menu" hidden role="menu">
            <button type="button" class="task-card-menu-option" role="menuitem" data-action="rename">Rename</button>
            <button type="button" class="task-card-menu-option" role="menuitem" data-action="archive">Archive</button>
          </div>
        </div>
      </div>
    </div>
    ${taskCardSecondaryHtml(task, { showProject, showWorktree })}
    ${footerAction ? `<div class="task-card-footer"><div class="task-card-footer-actions">${footerAction}</div></div>` : ''}
  `;

  const playBtn = card.querySelector('.task-card-play');
  playBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    startTask(task.id);
  });
  playBtn?.addEventListener('pointerdown', (e) => e.stopPropagation());

  bindTaskCardChrome(card, task);
  initCardDrag(card, task, { onOpen });

  return card;
}

function bindTaskCardChrome(card, task) {
  const actions = card.querySelector('.task-card-actions');
  const menuBtn = card.querySelector('.task-card-menu-btn');
  const menu = card.querySelector('.task-card-menu');
  const editBtn = card.querySelector('.task-card-edit-title');

  menuBtn?.addEventListener('pointerdown', (e) => e.stopPropagation());
  menu?.addEventListener('pointerdown', (e) => e.stopPropagation());
  editBtn?.addEventListener('pointerdown', (e) => e.stopPropagation());

  menuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = openSidebarItemMenu?.wrap === actions;
    closeSidebarItemMenus();
    closeRichSelects();
    closeProjectEmptyMenus();
    if (!isOpen && menu && actions) {
      menu.hidden = false;
      menuBtn.setAttribute('aria-expanded', 'true');
      actions.classList.add('is-open');
      openSidebarItemMenu = { wrap: actions, trigger: menuBtn, menu };
    }
  });

  menu?.addEventListener('click', (e) => {
    const option = e.target.closest('[data-action]');
    if (!option) return;
    e.stopPropagation();
    closeSidebarItemMenus();
    if (option.dataset.action === 'rename') startTaskCardTitleEdit(card, task);
    if (option.dataset.action === 'archive') archiveSidebarTask(task.id);
  });

  editBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSidebarItemMenus();
    startTaskCardTitleEdit(card, task);
  });
}

function startTaskCardTitleEdit(card, task) {
  const titleRow = card.querySelector('.task-card-title-row');
  const titleEl = card.querySelector('.task-card-title');
  const titleText = card.querySelector('.task-card-title-text');
  if (!titleRow || !titleEl || titleRow.querySelector('.task-card-title-input')) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-card-title-input';
  input.value = task.title;
  input.setAttribute('aria-label', 'Edit task name');

  titleEl.hidden = true;
  titleRow.appendChild(input);
  titleRow.classList.add('is-editing');
  card.classList.add('is-editing-title');

  const finish = (save) => {
    if (!input.isConnected) return;
    const next = input.value.trim();
    input.remove();
    titleEl.hidden = false;
    titleRow.classList.remove('is-editing');
    card.classList.remove('is-editing-title');

    if (save && next && next !== task.title) {
      applyTaskTitle(task, next);
    }
    if (titleText) titleText.textContent = task.title;
    else titleEl.textContent = task.title;
  };

  input.addEventListener('pointerdown', (e) => e.stopPropagation());
  input.addEventListener('click', (e) => e.stopPropagation());
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      finish(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      finish(false);
    }
  });
  input.addEventListener('blur', () => finish(true));

  requestAnimationFrame(() => {
    input.focus();
    input.select();
  });
}

function applyTaskTitle(task, title) {
  task.title = title;
  if (activeTaskId === task.id) {
    $('#task-detail-title').textContent = task.title;
    updateChatComposeTitles();
  }
  const previewTitle = $('#overview-task-preview-title');
  if (overviewPreviewTaskId === task.id && previewTitle) {
    previewTitle.textContent = task.title;
  }
  renderTaskSidebar();
  renderAppModeTabBadges();
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

function commitTaskFromChat({ title, status, description, repo }) {
  const task = {
    id: uid(),
    title,
    description: description || title,
    repo: repo || defaultRepoForNewTask(),
    project: defaultProjectForNewTask(),
    status,
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

function buildCreateTaskThinkingSteps(title, status) {
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
      label: '<strong>Bash</strong> Prepare task',
      in: `kimchi task prepare --title "${title}"`,
      out: '→ Ready to create',
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
<span class="key">"feature"</span>: <span class="val">"budgets"</span>`,
    },
    {
      type: 'bash',
      dot: 'green',
      label: '<strong>Bash</strong> Plan budgets rollout',
      in: 'kimchi plan budgets --repos design,backend,frontend',
      out: `${featureCount} tasks · 3 repos`,
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
  const { title, status } = response.taskData;

  const timeline = await thinkAndStream(
    container,
    buildCreateTaskThinkingSteps(title, status),
    { stepDelay: 1100, leadDelay: 900 }
  );

  let typing = showTyping(container);
  await sleep(1400 + Math.random() * 600);
  typing.remove();

  appendStepToTimeline(timeline, {
    type: 'bash',
    dot: 'green',
    label: '<strong>Bash</strong> Create kanban task',
    in: `kimchi task create --title "${title}" --status ${status}`,
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

    appendStepToTimeline(timeline, {
      type: 'bash',
      dot: 'green',
      label: '<strong>Bash</strong> Create kanban task',
      in: `kimchi task create --title "${spec.title}" --repo ${spec.repo} --status backlog`,
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
    recapHtml += `<li><strong>${escapeHtml(task.title)}</strong> <span style="color:var(--text-muted)">${task.repo} · Backlog</span></li>`;
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
    ...created.map((task) => ({
      type: 'bash',
      dot: 'green',
      label: '<strong>Bash</strong> Create kanban task',
      in: `kimchi task create --title "${task.title}" --repo ${task.repo} --status backlog`,
      out: `✓ task #${task.id} created`,
    })),
    recapStep,
  ];

  kanbanChatHistory.push({ role: 'agent', steps: agentSteps, plain: response.plain });
  renderBoard();
}

function buildCreatedTaskTextStep(task) {
  return {
    type: 'text',
    dot: 'gray',
    html: `<p>Created task in <strong>${STATUS_LABELS[task.status]}</strong>:</p>
      <div class="task-created" data-task-id="${task.id}">
        <strong>${escapeHtml(task.title)}</strong> · ${task.repo}
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
    html += `<li><strong>${escapeHtml(t.title)}</strong> <span style="color:var(--text-muted)">${t.repo} · ${STATUS_LABELS[t.status]}</span></li>`;
  });
  html += '</ul>';

  if (backlogFeatures.length) {
    html += '<p><strong>Queued feature work</strong></p><ul>';
    backlogFeatures.forEach((t) => {
      html += `<li>${escapeHtml(t.title)} <span style="color:var(--text-muted)">${t.repo}</span></li>`;
    });
    html += '</ul>';
  }

  html += '<p><strong>Open bugs</strong></p><ul>';
  bugs.forEach((t) => {
    html += `<li><strong>${escapeHtml(t.title)}</strong> <span style="color:var(--text-muted)">${t.repo} · ${STATUS_LABELS[t.status]}</span></li>`;
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
        description: 'Design low-budget alert banner & threshold states',
      },
      {
        title: 'Budget depletion alert API & webhook payloads',
        repo: 'backend',
        status: 'backlog',
        description: 'Budget depletion alert API & webhook payloads',
      },
      {
        title: 'Wire budget alert banner to threshold API',
        repo: 'frontend',
        status: 'backlog',
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
            <li><code>add "[title]" to [status]</code></li>
            <li><code>list tasks</code> — show all tasks</li>
            <li><code>move [title] to [status]</code></li>
          </ul>`,
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
        listHtml += `<li>${escapeHtml(t.title)} <span style="color:var(--text-muted)">(${t.repo})</span></li>`;
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
    return createTaskFromChat(match[1].trim(), 'backlog');
  }

  match = text.match(/^add\s+["'](.+?)["']\s+to\s+(\w[\w-]*)/i);
  if (match) {
    const title = match[1];
    let status = match[2].toLowerCase().replace(/\s+/g, '-');
    if (status === 'in') status = 'in-progress';
    if (!['backlog', 'in-progress', 'review', 'pr-review', 'closed'].includes(status)) status = 'backlog';
    return createTaskFromChat(title, status);
  }

  match = text.match(/^move\s+(.+?)\s+to\s+(\w[\w-]*)/i);
  if (match) {
    const titleQuery = match[1].toLowerCase();
    let status = match[2].toLowerCase().replace(/\s+/g, '-');
    if (status === 'in') status = 'in-progress';
    const task = tasks.find((t) => t.title.toLowerCase().includes(titleQuery));
    if (task && ['backlog', 'in-progress', 'review', 'pr-review', 'closed'].includes(status)) {
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
    return createTaskFromChat(match[1].trim(), 'backlog');
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

function createTaskFromChat(title, status) {
  return {
    plain: `created: ${title}`,
    task: true,
    taskData: { title, status, description: title },
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
    t6: {
      question: 'Should the alert threshold confirmation be a modal or an inline expand below the amount field?',
      options: [
        {
          id: 'modal',
          label: 'Modal confirmation',
          summary: 'Show a confirmation modal before saving threshold changes.',
        },
        {
          id: 'inline',
          label: 'Inline expand',
          summary: 'Reveal confirmation controls inline below the amount field.',
        },
        {
          id: 'defer',
          label: 'Defer to v2',
          summary: 'Ship the edit flow now and track threshold confirmation separately.',
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

  return [
    { type: 'label', dot: 'green', html: '<strong>Agent</strong> Blocked on a product decision…' },
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
  if (task.id === 't2') {
    const wiring = {
      'soft-delete': 'DELETE /budgets/{id} → archived=true, thresholds cleared',
      'block-delete': 'DELETE /budgets/{id} → 409 when alerts.active',
      cascade: 'DELETE /budgets/{id} → cascade thresholds + webhooks',
    };

    return [
      { type: 'label', dot: 'green', html: '<strong>Agent</strong> Continuing with your choice…' },
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
      { type: 'label', dot: 'green', html: '<strong>Agent</strong> Continuing with your choice…' },
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

  if (task.id === 't6') {
    const wiring = {
      modal: 'ThresholdConfirmModal frame added after save tap',
      inline: 'Inline expand panel below amount field',
      defer: 'Threshold confirmation deferred — edit flow only',
    };

    return [
      { type: 'label', dot: 'green', html: '<strong>Agent</strong> Updating edit flow prototype…' },
      {
        type: 'text',
        dot: 'gray',
        html: `<p>Using <strong>${escapeHtml(option.label)}</strong>. ${escapeHtml(option.summary)}</p>`,
      },
      {
        type: 'bash',
        dot: 'green',
        label: '<strong>Bash</strong> Update threshold interaction',
        in: `kimchi proto edit editing-flow.canvas --confirmation ${option.id}`,
        out: `✓ ${wiring[option.id]}`,
      },
      {
        type: 'text',
        dot: 'gray',
        html: '<p>Prototype updated in the artifact preview. Ready for another review pass when you are.</p>',
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
  task.reviewSince = null;
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
  renderTaskHeaderStats();
}

async function handleNeedsInputAnswer(task, option, buttonEl) {
  const container = getActiveModeChatContainer();
  if (!container) return;
  const messages = getTaskModeMessages(task);

  const actionGroup = buttonEl.closest('.action-buttons');
  actionGroup?.querySelectorAll('.action-btn').forEach((btn) => {
    btn.disabled = true;
    btn.classList.toggle('selected', btn === buttonEl);
  });

  if (task.workSteps?.length && messages.length === 0) {
    messages.push({ role: 'agent', steps: task.workSteps });
  }

  appendUserBubble(container, option.label);
  messages.push({ role: 'user', text: option.label });

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

  messages.push({ role: 'agent', steps: recorded });
  updateTaskCardStats(task);
  renderBoard();
}

function getReviewWorkPlan(task) {
  syncReviewReason(task);
  const repo = task.repo;
  const artifact = repo === 'backend' ? 'openapi/budgets.yaml' : 'src/features/budgets/budget-period-selector.tsx';

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
      { type: 'label', dot: 'green', html: '<strong>Agent</strong> Work complete — ready for your review' },
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

  const secondary = card.querySelector('.task-card-secondary');
  if (!secondary) return;

  const diffPill = secondary.querySelector('.task-card-pill--diff');
  if (shouldShowTaskCardDiffPill(task)) {
    const html = taskCardDiffPillHtml(task);
    if (diffPill) diffPill.outerHTML = html;
    else secondary.insertAdjacentHTML('beforeend', html);
  } else if (diffPill) {
    diffPill.remove();
  }
}

function updateTaskCardMeta(task) {
  const card = document.querySelector(`.task-card[data-id="${task.id}"]`);
  if (!card) return;

  const gitPill = card.querySelector('.task-card-pill--git');
  if (gitPill) gitPill.outerHTML = taskCardGitPillHtml(task);
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

  if (boardStatsChanged) renderTaskHeaderStats();

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
  renderTaskHeaderStats();
  renderAppModeTabBadges();
  if (subheaderView === 'overview') renderProjectOverview();
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

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.action-btn[data-action^="needs-input:"]');
    if (!btn || btn.disabled) return;

    const inTaskChat = btn.closest('#task-chat-messages');
    const inGeneralChat = btn.closest('#general-chat-messages');
    const inDesignChat = btn.closest('#design-chat-messages');
    if (!inTaskChat && !inGeneralChat && !inDesignChat) return;

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
<span class="key">"status"</span>: <span class="val">"${STATUS_LABELS[task.status]}"</span>`,
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
    return [{
      type: 'text',
      dot: 'gray',
      html: `<p>Task is in <strong>${STATUS_LABELS[task.status]}</strong>.</p>
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
function sidebarItemActionsHtml() {
  return `<div class="sidebar-item-actions">
    <button type="button" class="sidebar-item-menu-btn" aria-label="Conversation options" aria-haspopup="menu" aria-expanded="false">
      ${iconHtml('ellipsis-vertical', { size: 14, className: 'lucide-icon lucide-muted' })}
    </button>
    <div class="sidebar-item-menu" hidden role="menu">
      <button type="button" class="sidebar-item-menu-option" role="menuitem" data-action="rename">Rename</button>
      <button type="button" class="sidebar-item-menu-option" role="menuitem" data-action="archive">Archive</button>
    </div>
  </div>`;
}

function sidebarTaskHtml(task) {
  const active = task.id === activeTaskId ? ' active' : '';
  return `<div class="sidebar-task${active}" data-id="${task.id}">
    <span class="sidebar-leading">${sidebarTaskLeadingHtml(task)}</span>
    <span class="sidebar-task-title">${escapeHtml(task.title)}</span>
    ${sidebarItemActionsHtml()}
  </div>`;
}

function sidebarChatItemHtml(task) {
  const active = task.id === activeTaskId ? ' active' : '';
  return `<div class="sidebar-chat${active}" data-id="${task.id}">
    <span class="sidebar-chat-title">${escapeHtml(task.title)}</span>
    ${sidebarItemActionsHtml()}
  </div>`;
}

let openSidebarItemMenu = null;

function closeSidebarItemMenus() {
  if (!openSidebarItemMenu) return;
  const { menu, trigger, wrap } = openSidebarItemMenu;
  menu.hidden = true;
  trigger?.setAttribute('aria-expanded', 'false');
  wrap?.classList.remove('is-open');
  openSidebarItemMenu = null;
}

function renameSidebarTask(taskId) {
  const task = getTask(taskId);
  if (!task) return;

  const nextTitle = window.prompt('Rename conversation', task.title);
  if (!nextTitle) return;

  const trimmed = nextTitle.trim();
  if (!trimmed || trimmed === task.title) return;

  applyTaskTitle(task, trimmed);
  renderBoard();
  if (subheaderView === 'overview') renderProjectOverview();
}

function markTaskAsArchived(task) {
  if (!task || task.archived) return false;
  task.archived = true;
  if (!task.archiveSummary?.length) {
    task.archiveSummary = getArchivedTaskSummary(task);
  }
  if (!task.archivePrGitStatus) {
    task.archivePrGitStatus = task.prs
      ? (task.status === 'closed' ? 'Merged' : 'Closed')
      : 'No PR';
  }
  return true;
}

function archiveSidebarTask(taskId) {
  const task = getTask(taskId);
  if (!markTaskAsArchived(task)) return;

  if (overviewPreviewTaskId === task.id) {
    closeOverviewTaskPreview();
  }

  if (activeTaskId === task.id) {
    const next = tasksForTaskSidebar().find((t) => !t.archived && t.id !== task.id);
    if (next) {
      openTaskDetail(next.id);
    } else {
      activeTaskId = null;
      if (activeAppMode === 'chat' || activeAppMode === 'design') {
        startNewConversation();
      } else {
        renderBoard();
        updateProjectEmptyState();
      }
    }
  }

  renderBoard();
  renderTaskSidebar();
  renderAppModeTabBadges();
  if (subheaderView === 'overview') renderProjectOverview();
}

function initSidebarItemMenus(sidebar) {
  sidebar.querySelectorAll('.sidebar-item-actions').forEach((wrap) => {
    const trigger = wrap.querySelector('.sidebar-item-menu-btn');
    const menu = wrap.querySelector('.sidebar-item-menu');
    const item = wrap.closest('[data-id]');
    const taskId = item?.dataset.id;
    if (!trigger || !menu || !taskId) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = openSidebarItemMenu?.wrap === wrap;
      closeSidebarItemMenus();
      closeRichSelects();
      closeProjectEmptyMenus();
      if (!isOpen) {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        wrap.classList.add('is-open');
        openSidebarItemMenu = { wrap, trigger, menu };
      }
    });

    menu.addEventListener('click', (e) => {
      const option = e.target.closest('[data-action]');
      if (!option) return;
      e.stopPropagation();
      const action = option.dataset.action;
      closeSidebarItemMenus();
      if (action === 'rename') renameSidebarTask(taskId);
      if (action === 'archive') archiveSidebarTask(taskId);
    });
  });
}

function bindSidebarItemEvents(sidebar) {
  sidebar.querySelectorAll('.sidebar-task, .sidebar-chat').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.sidebar-item-actions')) return;
      openTaskDetail(el.dataset.id);
    });
  });

  initSidebarItemMenus(sidebar);
}

function sidebarSectionLeadingHtml(section) {
  if (section.icon) {
    return `<span class="sidebar-leading">${iconHtml(section.icon, { size: 12, className: 'lucide-icon' })}</span>`;
  }
  return `<span class="sidebar-leading"><span class="status-dot ${section.dot}"></span></span>`;
}

function sidebarSectionHtml(section, sectionTasks, mode, { itemHtml } = {}) {
  const items = sectionTasks.map((task) => (itemHtml ? itemHtml(task) : sidebarTaskHtml(task))).join('');
  const isCollapsed = sidebarSectionCollapsed[mode]?.[section.id] === true;
  const archiveBtn = section.showArchiveBtn
    ? `<button type="button" class="sidebar-archive-btn" aria-label="Archive completed tasks">
        ${iconHtml('archive', { size: 12, className: 'lucide-icon' })}
      </button>`
    : '';
  const chevron = `<span class="sidebar-section-chevron">
      ${iconHtml('chevron-down', { size: 12, className: 'lucide-icon' })}
    </span>`;
  const collapsedClass = isCollapsed ? ' collapsed' : '';
  const archiveClass = section.id === 'archive' ? ' sidebar-section--archive' : '';

  return `
    <div class="sidebar-section${archiveClass}">
      ${section.id === 'archive' ? '' : '<div class="sidebar-section-divider" aria-hidden="true"></div>'}
      <div class="sidebar-section-header${collapsedClass}" data-section="${section.id}" data-mode="${mode}" role="button" tabindex="0" aria-expanded="${!isCollapsed}">
        ${sidebarSectionLeadingHtml(section)}
        <span class="sidebar-section-label">
          ${section.label}
          <span class="column-count">${sectionTasks.length}</span>
        </span>
        <span class="sidebar-section-trailing">
          ${chevron}
          ${archiveBtn}
        </span>
      </div>
      <div class="sidebar-section-body${collapsedClass}">${items}</div>
    </div>`;
}

function bindSidebarSectionEvents(sidebar) {
  sidebar.querySelectorAll('.sidebar-archive-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      archiveCompletedTasks();
    });
  });

  sidebar.querySelectorAll('.sidebar-section-header[data-section]').forEach((header) => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('.sidebar-archive-btn')) return;
      toggleSidebarSection(header.dataset.section, header.dataset.mode);
    });
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSidebarSection(header.dataset.section, header.dataset.mode);
      }
    });
  });
}

function renderChatSidebar(sidebar) {
  const allChats = tasksForTaskSidebar();
  const chats = allChats.filter((task) => !task.archived);
  const archived = allChats.filter((task) => task.archived);
  const itemsHtml = chats.map((task) => sidebarChatItemHtml(task)).join('');
  const archiveSection = SIDEBAR_SECTIONS.chat[0];
  const archiveHtml = sidebarSectionHtml(archiveSection, archived, 'chat', {
    itemHtml: sidebarChatItemHtml,
  });

  sidebar.innerHTML = `
    <div class="sidebar-create-wrap">
      <button type="button" class="sidebar-create-btn" id="sidebar-new-chat-btn">
        ${iconHtml('plus', { size: 12, className: 'lucide-icon' })}
        New chat
      </button>
    </div>
    <div class="sidebar-scroll">
      <div class="sidebar-chat-list">${itemsHtml}</div>
    </div>
    <div class="sidebar-footer">${archiveHtml}</div>`;

  initIcons(sidebar);

  sidebar.querySelector('#sidebar-new-chat-btn')?.addEventListener('click', startNewConversation);

  bindSidebarItemEvents(sidebar);
  bindSidebarSectionEvents(sidebar);
}

function renderTaskSidebar() {
  const sidebar = $('#task-sidebar');
  if (!sidebar) return;

  if (activeAppMode === 'chat') {
    renderChatSidebar(sidebar);
    return;
  }

  const mode = activeAppMode === 'code' ? 'code' : 'design';
  const sections = SIDEBAR_SECTIONS[mode];
  const visibleTasks = tasksForTaskSidebar();

  const activeTasksHtml = mode === 'code'
    ? visibleTasks
      .filter((task) => getSidebarBucket(task, mode) === 'active')
      .map((task) => sidebarTaskHtml(task))
      .join('')
    : '';

  const mainSections = sections.filter((section) => section.id !== 'archive');
  const archiveSection = sections.find((section) => section.id === 'archive');

  const sectionsHtml = mainSections
    .map((section) => {
      const sectionTasks = visibleTasks.filter((task) => getSidebarBucket(task, mode) === section.id);
      return sidebarSectionHtml(section, sectionTasks, mode);
    })
    .join('');

  const archiveTasks = archiveSection
    ? visibleTasks.filter((task) => getSidebarBucket(task, mode) === 'archive')
    : [];
  const archiveHtml = archiveSection
    ? sidebarSectionHtml(archiveSection, archiveTasks, mode)
    : '';

  const sidebarActionHtml = activeAppMode === 'code'
    ? `<div class="sidebar-create-wrap">
        <button type="button" class="sidebar-create-btn" id="sidebar-create-task-btn">
          ${iconHtml('plus', { size: 12, className: 'lucide-icon' })}
          New task
        </button>
      </div>`
    : `<div class="sidebar-create-wrap">
        <button type="button" class="sidebar-create-btn" id="sidebar-new-chat-btn">
          ${iconHtml('plus', { size: 12, className: 'lucide-icon' })}
          New artifact
        </button>
      </div>`;

  sidebar.innerHTML = `
    ${sidebarActionHtml}
    <div class="sidebar-scroll">
      ${activeTasksHtml ? `<div class="sidebar-active-tasks">${activeTasksHtml}</div>` : ''}
      ${sectionsHtml}
    </div>
    <div class="sidebar-footer">${archiveHtml}</div>`;

  initIcons(sidebar);

  sidebar.querySelector('#sidebar-new-chat-btn')?.addEventListener('click', startNewConversation);
  sidebar.querySelector('#sidebar-create-task-btn')?.addEventListener('click', startNewCodeTask);

  bindSidebarItemEvents(sidebar);

  sidebar.querySelectorAll('.sidebar-task-play').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      startTask(btn.dataset.taskId);
    });
  });

  bindSidebarSectionEvents(sidebar);
}

function toggleSidebarSection(sectionId, mode) {
  sidebarSectionCollapsed[mode][sectionId] = !sidebarSectionCollapsed[mode][sectionId];
  renderTaskSidebar();
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
    closeProjectEmptyMenus();
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

function setMultiSelectDisplay(wrap, options, selectedIds) {
  const valueEl = wrap.querySelector('.rich-select-value');
  const placeholder = wrap.dataset.placeholder || 'Select…';
  const selected = options.filter((option) => selectedIds.has(option.id));

  if (!selected.length) {
    valueEl.textContent = placeholder;
    valueEl.classList.add('is-placeholder');
    return;
  }

  valueEl.classList.remove('is-placeholder');
  valueEl.textContent = selected.length <= 2
    ? selected.map((option) => option.label).join(', ')
    : `${selected.length} selected`;
}

function resetMultiSelect(wrap, options) {
  if (!wrap) return;
  wrap._selectedIds = new Set();
  setMultiSelectDisplay(wrap, options, wrap._selectedIds);
  wrap.querySelectorAll('.multi-select-option').forEach((btn) => {
    btn.classList.remove('selected');
    btn.setAttribute('aria-selected', 'false');
  });
}

function getMultiSelectValues(wrap) {
  return Array.from(wrap?._selectedIds || []);
}

function initMultiSelect(wrap, options) {
  if (!wrap) return;
  wrap._selectedIds = new Set();

  const trigger = wrap.querySelector('.rich-select-trigger');
  const menu = wrap.querySelector('.rich-select-menu');
  const placement = wrap.dataset.menuPlacement || 'down';

  menu.classList.toggle('rich-select-menu--up', placement === 'up');
  menu.classList.toggle('rich-select-menu--down', placement === 'down');

  menu.innerHTML = options.map((opt) => `
    <button type="button" class="rich-select-option multi-select-option" role="option" data-value="${opt.id}" aria-selected="false">
      <span class="checkbox-box" aria-hidden="true"></span>
      <span class="rich-select-option-title">${escapeHtml(opt.label)}</span>
    </button>`).join('');

  setMultiSelectDisplay(wrap, options, wrap._selectedIds);

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = openRichSelect?.wrap === wrap;
    closeRichSelects();
    closeProjectEmptyMenus();
    if (!isOpen) {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      openRichSelect = { wrap, trigger, menu };
    }
  });

  menu.addEventListener('click', (e) => {
    const optBtn = e.target.closest('.multi-select-option');
    if (!optBtn) return;

    const value = optBtn.dataset.value;
    if (wrap._selectedIds.has(value)) wrap._selectedIds.delete(value);
    else wrap._selectedIds.add(value);

    const selected = wrap._selectedIds.has(value);
    optBtn.classList.toggle('selected', selected);
    optBtn.setAttribute('aria-selected', String(selected));
    setMultiSelectDisplay(wrap, options, wrap._selectedIds);
  });
}

function resetModalSelects() {
  setRichSelectValue($('#permissions-select'), PERMISSION_MODES, 'yolo');
  setRichSelectValue($('#model-select'), MODEL_OPTIONS, 'multi');
}

function initRichSelects() {
  initRichSelect($('#permissions-select'), PERMISSION_MODES);
  initRichSelect($('#model-select'), MODEL_OPTIONS);
  initRichSelect($('#task-permissions-select'), PERMISSION_MODES);
  initRichSelect($('#task-model-select'), MODEL_OPTIONS);
  initRichSelect($('#task-delivery-select'), DELIVERY_MODES);
  initRichSelect($('#project-empty-permissions-select'), PERMISSION_MODES);
  initRichSelect($('#project-empty-delivery-select'), DELIVERY_MODES);
  initRichSelect($('#project-empty-model-select'), MODEL_OPTIONS);
  initRichSelect($('#general-chat-model-select'), MODEL_OPTIONS);
  initRichSelect($('#design-chat-model-select'), MODEL_OPTIONS);

  document.addEventListener('click', (e) => {
    if (e.target.closest('.rich-select-wrap')) return;
    closeRichSelects();
    closeProjectEmptyMenus();
    closeSidebarItemMenus();
  });
}

function startNewCodeTask() {
  const { permissionMode, deliveryMode, model } = getProjectEmptyComposeSettings();

  const task = {
    id: uid(),
    title: 'New task',
    description: '',
    draft: true,
    repo: defaultRepoForNewTask(),
    project: defaultProjectForNewTask(),
    status: 'backlog',
    permissionMode,
    deliveryMode,
    model,
    prs: 0,
    commits: 0,
    files: 0,
    additions: 0,
    deletions: 0,
    chat: [],
  };

  tasks.unshift(task);
  renderBoard();
  openTaskDetail(task.id);
  focusProjectEmptyInput('Plan, Build, / for skills, @ for context');
}

function openCreateTaskModal() {
  const modal = $('#create-task-modal');
  const desc = $('#task-description');
  modal?.showModal();
  desc?.focus();
}

function initModal() {
  const modal = $('#create-task-modal');
  const form = $('#create-task-form');
  const desc = $('#task-description');
  const createBtn = $('#modal-create-btn');
  const startBtn = $('#modal-start-btn');

  modal.addEventListener('close', closeRichSelects);
  form.addEventListener('reset', resetModalSelects);

  const updateButtons = () => {
    const hasText = desc.value.trim().length > 0;
    createBtn.disabled = !hasText;
    startBtn.disabled = !hasText;
  };

  desc.addEventListener('input', updateButtons);

  $('#create-task-btn')?.addEventListener('click', openCreateTaskModal);
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
      project: defaultProjectForNewTask(),
      status,
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
    const status = activeAppMode !== 'code' ? 'in-progress' : 'backlog';
    const task = addTask(status);
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
  $$('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });

  $('#breadcrumb-studio-link')?.addEventListener('click', openWorkspacesOverview);

  $('#workspaces-grid')?.addEventListener('click', (e) => {
    const menuBtn = e.target.closest('[data-workspace-menu]');
    if (menuBtn) {
      e.stopPropagation();
      toggleWorkspaceBoardMenu(menuBtn.dataset.workspaceMenu, menuBtn);
      return;
    }

    const menuAction = e.target.closest('[data-workspace-action]');
    if (menuAction) {
      e.stopPropagation();
      if (menuAction.disabled) return;
      if (menuAction.dataset.workspaceAction === 'delete') {
        deleteWorkspace(menuAction.dataset.workspaceId);
      }
      return;
    }

    if (e.target.closest('.workspace-card-actions')) {
      e.stopPropagation();
      return;
    }

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

  document.addEventListener('click', (e) => {
    if (e.target.closest('.workspace-card-actions')) return;
    closeWorkspaceBoardMenus();
  });

  $('#create-workspace-btn')?.addEventListener('click', () => {
    showSnackbar('Create workspace is not available in this prototype.');
  });

  $('#close-task-btn').addEventListener('click', () => {
    const task = getTask(activeTaskId);
    if (task) closeTask(task);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overviewArchiveOpen) {
      e.preventDefault();
      setOverviewArchiveOpen(false);
      return;
    }
    if (e.key === 'Escape' && overviewPreviewTaskId) {
      e.preventDefault();
      closeOverviewTaskPreview();
      return;
    }
    if (e.key === 'c' && !e.metaKey && !e.ctrlKey && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      if (activeAppMode === 'code') startNewCodeTask();
      else openCreateTaskModal();
    }
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

  if (document.documentElement.dataset.tooltipsBound) return;
  document.documentElement.dataset.tooltipsBound = 'true';

  const PILL_TOOLTIP_DELAY_MS = 500;
  let activeAnchor = null;
  let pendingAnchor = null;
  let showTimer = null;

  const clearShowTimer = () => {
    if (showTimer == null) return;
    window.clearTimeout(showTimer);
    showTimer = null;
  };

  const hideTooltip = () => {
    clearShowTimer();
    pendingAnchor = null;
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

  const showTooltip = (anchor, { immediate = false } = {}) => {
    if (activeAnchor === anchor) {
      positionTooltip(anchor);
      return;
    }
    if (pendingAnchor === anchor && showTimer != null) return;

    clearShowTimer();
    if (activeAnchor && activeAnchor !== anchor) {
      tooltip.hidden = true;
      activeAnchor = null;
    }

    const delay = !immediate && anchor.classList.contains('task-card-pill')
      ? PILL_TOOLTIP_DELAY_MS
      : 0;

    if (delay === 0) {
      pendingAnchor = null;
      activeAnchor = anchor;
      positionTooltip(anchor);
      return;
    }

    pendingAnchor = anchor;
    showTimer = window.setTimeout(() => {
      showTimer = null;
      pendingAnchor = null;
      activeAnchor = anchor;
      positionTooltip(anchor);
    }, delay);
  };

  document.addEventListener('mouseover', (e) => {
    const anchor = e.target.closest('[data-tooltip]');
    if (anchor) showTooltip(anchor);
  });

  document.addEventListener('mouseout', (e) => {
    const anchor = e.target.closest('[data-tooltip]');
    if (!anchor) return;
    if (activeAnchor !== anchor && pendingAnchor !== anchor) return;
    const next = e.relatedTarget;
    if (next && anchor.contains(next)) return;
    hideTooltip();
  });

  document.addEventListener('focusin', (e) => {
    const anchor = e.target.closest('[data-tooltip]');
    if (anchor) showTooltip(anchor, { immediate: true });
  });

  document.addEventListener('focusout', (e) => {
    const anchor = e.target.closest('[data-tooltip]');
    if (anchor && activeAnchor === anchor) hideTooltip();
  });

  window.addEventListener('scroll', () => {
    if (activeAnchor) positionTooltip(activeAnchor);
  }, true);
  window.addEventListener('resize', () => {
    if (activeAnchor) positionTooltip(activeAnchor);
  });
}

/* ── Init ── */
function chatNeedsInputTailAlreadyAppended(chat) {
  return chat.some((message) => message.role === 'agent' && message.steps?.some(
    (step) => step.type === 'actions' && step.buttons?.some((btn) => btn.action?.startsWith('chat:')),
  ));
}

function appendChatNeedsInputTail(task) {
  if (!task.generalChat) task.generalChat = [];
  if (chatNeedsInputTailAlreadyAppended(task.generalChat)) return;

  task.generalChat.push({
    role: 'agent',
    steps: [
      {
        type: 'text',
        dot: 'gray',
        html: `<p>I have a follow-up on <strong>${escapeHtml(task.title)}</strong>:</p><p>Should budget alerts default to email, in-app, or both channels?</p>`,
      },
      {
        type: 'actions',
        dot: 'gray',
        buttons: [
          { label: 'Email only', action: 'chat:email', primary: true },
          { label: 'In-app only', action: 'chat:in-app', primary: false },
          { label: 'Both', action: 'chat:both', primary: false },
        ],
      },
    ],
  });
}

function applyModeAttention(task, mode, reviewReason) {
  if (mode === 'chat') {
    task.chatReviewReason = reviewReason;
    task.chatReviewSince = Date.now();
    if (reviewReason === 'needs-input') appendChatNeedsInputTail(task);
  } else if (mode === 'design') {
    task.status = 'review';
    task.reviewReason = reviewReason;
    task.reviewSince = Date.now();
    task.commits = Math.max(task.commits || 0, 1);
  } else if (mode === 'code') {
    task.status = 'review';
    task.reviewReason = reviewReason;
    task.commits = Math.max(task.commits || 0, 1);
    task.prs = Math.max(task.prs || 0, 1);
    task.workSimulated = true;
    syncReviewReason(task);
  }

  renderBoard();
  renderTaskSidebar();
  renderTaskHeaderStats();
  renderAppModeTabBadges();
  if (subheaderView === 'overview') renderProjectOverview();

  if (activeTaskId === task.id) {
    if (activeAppMode === mode) refreshActiveModeChat();
    if (mode === 'code' && activeAppMode === 'code') {
      const badge = $('#task-status-badge');
      if (badge) {
        badge.textContent = STATUS_LABELS.review;
        badge.className = 'status-badge review';
      }
    }
  }
}

function initModeAttentionSimulation() {
  const sims = [
    { taskId: 't1', mode: 'chat', reviewReason: 'needs-input', delay: 8000 },
    { taskId: 't9', mode: 'code', reviewReason: 'ready', delay: 11000 },
    { taskId: 't1', mode: 'design', reviewReason: 'ready', delay: 14000 },
  ];

  sims.forEach(({ taskId, mode, reviewReason, delay }) => {
    setTimeout(() => {
      const task = getTask(taskId);
      if (!task || taskNeedsModeAttention(task, mode)) return;
      if (mode !== 'chat' && task.status !== 'in-progress') return;
      if (mode === 'chat' && task.chatReviewReason) return;
      applyModeAttention(task, mode, reviewReason);
    }, delay);
  });
}

function hydrateNeedsInputReviewTasks() {
  tasks.forEach((task) => {
    if (task.status === 'review' && task.reviewReason === 'needs-input' && !task.workSteps) {
      task.workSteps = getFullNeedsInputChatSteps(task);
    }
  });
}

function init() {
  initTheme();
  initIcons();
  hydrateNeedsInputReviewTasks();
  hydrateReviewWaitingTimes();
  initInProgressSimulation();
  initInProgressStatsTick();
  startTaskCardSpinners();
  initTaskChat();
  initDesignChat();
  initRichSelects();
  initModal();
  initDirectoryModal();
  renderAppModeTabBadges();
  initWorkTabs();
  initBrowserPreview();
  initDiffCommitMenu();
  initSnackbar();
  initModeAttentionSimulation();
  initWorkspaceStatsMenus();
  initTooltips();
  initWorkspaceChartTooltips();
  initAppMode();
  initProjectEmptyState();
  initProjectEmptyRuntimeMenu();
  initNewProjectButton();
  initNewProjectModal();
  initSubheaderNav();
  initEvents();
  renderBoardSubheader();

  if (activeAppMode === 'code' || activeAppMode === 'design') {
    modeOpenedOnce[activeAppMode] = true;
    setSubheaderView('overview');
  } else {
    renderTaskSidebar();
    const firstId = getFirstTaskIdForProject();
    if (firstId) openTaskDetail(firstId);
    else {
      renderGeneralChat();
      updateProjectEmptyState();
    }
  }
}

init();

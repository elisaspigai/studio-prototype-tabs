import {
  createElement,
  Menu,
  ChevronDown,
  ChevronLeft,
  User,
  LayoutGrid,
  SquareTerminal,
  Settings,
  ArrowUp,
  SquareSlash,
  Plus,
  FileCode,
  Folder,
  X,
  GitBranch,
  Copy,
  GitPullRequest,
  GitCommit,
  FileText,
  LoaderCircle,
  CheckCheck,
  Check,
  MessageCircle,
  Share2,
  ExternalLink,
  Globe,
  RefreshCw,
  Terminal,
  History,
  FileDiff,
  Play,
  Trash2,
  Link,
  Sun,
  Moon,
  EllipsisVertical,
} from 'lucide';

const ICONS = {
  menu: Menu,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  user: User,
  'layout-grid': LayoutGrid,
  'square-terminal': SquareTerminal,
  settings: Settings,
  'arrow-up': ArrowUp,
  'square-slash': SquareSlash,
  plus: Plus,
  file: FileCode,
  folder: Folder,
  x: X,
  'git-branch': GitBranch,
  copy: Copy,
  'git-pull-request': GitPullRequest,
  'git-commit': GitCommit,
  'file-text': FileText,
  loader: LoaderCircle,
  'check-check': CheckCheck,
  check: Check,
  'message-circle': MessageCircle,
  share: Share2,
  'external-link': ExternalLink,
  globe: Globe,
  'refresh-cw': RefreshCw,
  terminal: Terminal,
  history: History,
  'file-diff': FileDiff,
  play: Play,
  'trash-2': Trash2,
  link: Link,
  sun: Sun,
  moon: Moon,
  'ellipsis-vertical': EllipsisVertical,
};

const defaults = { 'stroke-width': 2 };

export function createIcon(name, { size = 16, className = 'lucide-icon' } = {}) {
  const node = ICONS[name];
  if (!node) {
    console.warn(`[icons] Unknown icon: ${name}`);
    return document.createElement('span');
  }
  return createElement(node, {
    ...defaults,
    width: size,
    height: size,
    class: className,
  });
}

export function iconHtml(name, opts = {}) {
  return createIcon(name, opts).outerHTML;
}

export function mountIcon(slot, name, { size = 16, className = 'lucide-icon' } = {}) {
  if (!slot) return;
  slot.replaceChildren(createIcon(name, { size, className }));
}

export function initIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((slot) => {
    const { icon, size, iconClass } = slot.dataset;
    mountIcon(slot, icon, {
      size: Number(size) || 16,
      className: iconClass || 'lucide-icon',
    });
  });
}

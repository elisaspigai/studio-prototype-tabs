export function getSubheaderModeConfig(mode) {
  if (mode === 'chat') {
    return { overviewHidden: true, dividerHidden: true, allTabLabel: 'All chats' };
  }
  return { overviewHidden: false, dividerHidden: false, allTabLabel: 'All projects' };
}

export const sidebarGuard = (_component, _currentRoute, _currentState, nextState) => {
    return !nextState.root.children.some((child) => child.outlet === 'sidebar');
};
//# sourceMappingURL=sidebar.guard.js.map
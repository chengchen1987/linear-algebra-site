/* Quarto owns collapse state. This small global enhancement only locates the
   current item after the mobile menu opens; it never resets manual choices. */
(() => {
  const sidebar = document.getElementById('quarto-sidebar');
  if (!sidebar || sidebar.dataset.navigationBound) return;
  sidebar.dataset.navigationBound = 'true';
  const locate = () => {
    const current = sidebar.querySelector('[aria-current="page"]');
    if (!current || !sidebar.clientHeight) return;
    const a = current.getBoundingClientRect(), b = sidebar.getBoundingClientRect();
    if (a.top < b.top || a.bottom > b.bottom) sidebar.scrollTop += a.top - b.top - (sidebar.querySelector('.current-chapter>.sidebar-item-container')?.offsetHeight || 80) - 24;
  };
  sidebar.addEventListener('shown.bs.collapse', event => {
    if (event.target === sidebar) locate();
  });
  if (matchMedia('(min-width: 992px)').matches) locate();
})();

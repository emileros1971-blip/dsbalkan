const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const canObserve = 'IntersectionObserver' in window;

if (!reduceMotion.matches && canObserve) {
  const headlines = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('headline-in');
      headlines.unobserve(entry.target);
    }
  }, { threshold: .2 });
  document.querySelectorAll('main h1, main h2').forEach(heading => headlines.observe(heading));
}

const welcome = document.querySelector('#welcome');
if (welcome) {
  let started = false;
  const startWelcome = event => {
    if (started || event?.target === welcome) return;
    welcome.play().catch(() => {});
  };
  welcome.addEventListener('playing', () => {
    started = true;
    document.removeEventListener('click', startWelcome, true);
  }, { once: true });
  document.addEventListener('click', startWelcome, true);
  startWelcome();
}

const note = document.querySelector('#scroll-note');
if (note) {
  const title = document.createElement('span');
  title.className = 'scroll-note-title';
  note.append(title);
  const milestones = [
    [() => 70, 'Hvala što ste\nnas posetili!'],
    [() => document.querySelector('#standard').offsetTop - innerHeight * .45, 'Vaš pouzdan izbor\nza čišćenje'],
  ];
  let next = 0;
  let active = false;
  function showNextNote() {
    if (active || next >= milestones.length) return;
    const [threshold, message] = milestones[next];
    if (scrollY < Math.max(70, threshold())) return;
    next += 1;
    active = true;
    title.textContent = message;
    note.classList.add('show');
    setTimeout(() => {
      note.classList.remove('show');
      setTimeout(() => {
        active = false;
        showNextNote();
      }, 180);
    }, 850);
  }
  addEventListener('scroll', showNextNote, { passive: true });
}

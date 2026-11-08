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
const sound = document.querySelector('#sound');
if (welcome && sound) {
  sound.hidden = false;
  sound.addEventListener('click', () => {
    const turnOn = welcome.muted || welcome.volume === 0;
    if (turnOn && welcome.volume === 0) welcome.volume = 1;
    welcome.muted = !turnOn;
    if (turnOn) {
      if (welcome.ended) welcome.currentTime = 0;
      welcome.play().catch(() => {});
    }
  });
  welcome.addEventListener('volumechange', () => {
    sound.textContent = welcome.muted || welcome.volume === 0 ? 'Uključite zvuk' : 'Isključite zvuk';
  });
  if (!reduceMotion.matches && canObserve) {
    const autoplay = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      autoplay.disconnect();
      welcome.play().catch(() => {});
    }, { threshold: .25 });
    autoplay.observe(welcome);
  }
}

const note = document.querySelector('#scroll-note');
if (note) {
  const milestones = [
    [() => 70, 'Hvala što ste nas posetili!'],
    [() => document.querySelector('#standard').offsetTop - innerHeight * .45, 'Vaš pouzdan izbor za čišćenje'],
    [() => document.querySelector('#recenzije').offsetTop - innerHeight * .6, '★★★★★  Odlične ocene na Google-u'],
  ];
  let next = 0;
  let active = false;
  function showNextNote() {
    if (active || next >= milestones.length) return;
    const [threshold, message] = milestones[next];
    if (scrollY < Math.max(70, threshold())) return;
    next += 1;
    active = true;
    note.textContent = message;
    note.classList.add('show');
    setTimeout(() => {
      note.classList.remove('show');
      setTimeout(() => {
        active = false;
        showNextNote();
      }, 180);
    }, 2150);
  }
  addEventListener('scroll', showNextNote, { passive: true });
}

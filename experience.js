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
  const soundButton = document.querySelector('.welcome-sound');
  const soundKey = 'dsbalkan:welcome-sound';
  const hasSound = () => !welcome.muted && welcome.volume > 0;
  let preference;
  try {
    preference = localStorage.getItem(soundKey);
  } catch {
    // Playback and the sound button still work without storage.
  }

  let sound = hasSound();
  function syncSoundButton() {
    if (soundButton) soundButton.hidden = hasSound();
  }

  function setMuted(muted) {
    welcome.muted = muted;
    sound = hasSound();
    syncSoundButton();
  }

  welcome.addEventListener('volumechange', () => {
    if (sound === hasSound()) return;
    sound = hasSound();
    syncSoundButton();
    try {
      localStorage.setItem(soundKey, sound ? 'on' : 'off');
    } catch {
      // The visitor can still use the video controls.
    }
  });

  soundButton?.addEventListener('click', () => {
    if (welcome.volume === 0) welcome.volume = 1;
    welcome.muted = false;
    welcome.currentTime = 0;
    welcome.play().then(() => {
      if (document.activeElement === soundButton) welcome.focus();
    }, () => setMuted(true));
  });

  setMuted(preference === 'off');
  welcome.play().catch(() => {
    setMuted(true);
    welcome.play().catch(() => {});
  });
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

// ============================================
//   MARVEL GALLERY — compare.js
//   All JavaScript for compare.html
// ============================================

// ── SUPABASE CONFIG ──
const SUPABASE_URL = 'https://zxhubiaitwrkyxoiojei.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aHViaWFpdHdya3l4b2lvamVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTY2ODksImV4cCI6MjA5MzU3MjY4OX0.4v-vO3JA2jAU1ItSRHFOoZDfAjHEFmkuiPhDBy7ljiU';
const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

// ── STAT DEFINITIONS ──
const STATS = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];
const STAT_ICONS = {
  intelligence: 'fas fa-brain',
  strength:     'fas fa-dumbbell',
  speed:        'fas fa-bolt',
  durability:   'fas fa-shield-alt',
  power:        'fas fa-fire',
  combat:       'fas fa-fist-raised'
};

// ══════════════════════════════════════
// LOAD HERO DROPDOWNS FROM SUPABASE
// ══════════════════════════════════════
async function loadDropdowns() {
  try {
    const res    = await fetch(
      `${SUPABASE_URL}/rest/v1/heroes?select=id,name&order=display_order.asc`,
      { headers: HEADERS }
    );
    const heroes = await res.json();
    const selOne = document.getElementById('hero-one');
    const selTwo = document.getElementById('hero-two');

    heroes.forEach(h => {
      const opt = `<option value="${h.id}">${h.name}</option>`;
      selOne.innerHTML += opt;
      selTwo.innerHTML += opt;
    });

    // Enable compare button only when both are selected and different
    [selOne, selTwo].forEach(sel => sel.addEventListener('change', checkReady));

  } catch (err) {
    console.error('Dropdown load error:', err);
  }
}

// ── CHECK IF BOTH HEROES SELECTED ──
function checkReady() {
  const one = document.getElementById('hero-one').value;
  const two = document.getElementById('hero-two').value;
  const btn = document.getElementById('btn-compare');

  const sameHero = one && two && one === two;
  btn.disabled = !one || !two || sameHero;
  btn.innerHTML = sameHero
    ? '<i class="fas fa-exclamation-circle"></i> PICK TWO DIFFERENT HEROES'
    : '<i class="fas fa-bolt"></i> COMPARE HEROES';
}

// ══════════════════════════════════════
// RUN COMPARISON — fetch both heroes
// ══════════════════════════════════════
async function runComparison() {
  const idOne = document.getElementById('hero-one').value;
  const idTwo = document.getElementById('hero-two').value;
  if (!idOne || !idTwo || idOne === idTwo) return;

  // Show result area and loading state
  document.getElementById('comparison-result').style.display = 'block';
  document.getElementById('comp-loading').style.display      = 'block';
  document.getElementById('comp-error').style.display        = 'none';
  document.getElementById('comp-content').style.display      = 'none';

  // Scroll to results
  document.getElementById('comparison-result').scrollIntoView({ behavior: 'smooth' });

  try {
    // Fetch both heroes in parallel for speed
    const [r1, r2] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/heroes?id=eq.${idOne}&select=*`, { headers: HEADERS }),
      fetch(`${SUPABASE_URL}/rest/v1/heroes?id=eq.${idTwo}&select=*`, { headers: HEADERS })
    ]);
    const [d1, d2] = await Promise.all([r1.json(), r2.json()]);

    if (!d1.length || !d2.length) {
      document.getElementById('comp-loading').style.display = 'none';
      document.getElementById('comp-error').style.display   = 'block';
      return;
    }

    buildComparison(d1[0], d2[0]);

  } catch (err) {
    console.error('Comparison fetch error:', err);
    document.getElementById('comp-loading').style.display = 'none';
    document.getElementById('comp-error').style.display   = 'block';
  }
}

// ══════════════════════════════════════
// BUILD COMPARISON UI
// ══════════════════════════════════════
function buildComparison(h1, h2) {

  // ── Calculate total power scores ──
  const scoreOne = STATS.reduce((t, s) => t + (h1['stat_' + s] || 0), 0);
  const scoreTwo = STATS.reduce((t, s) => t + (h2['stat_' + s] || 0), 0);
  const winner   = scoreOne > scoreTwo ? 1 : scoreTwo > scoreOne ? 2 : 0;

  // ── Portraits ──
  document.getElementById('img-one').src   = h1.image;
  document.getElementById('img-one').alt   = h1.name;
  document.getElementById('img-two').src   = h2.image;
  document.getElementById('img-two').alt   = h2.name;

  document.getElementById('name-one').textContent  = h1.name;
  document.getElementById('title-one').textContent = h1.title || 'Avenger';
  document.getElementById('name-two').textContent  = h2.name;
  document.getElementById('title-two').textContent = h2.title || 'Avenger';

  document.getElementById('score-one').textContent = scoreOne;
  document.getElementById('score-two').textContent = scoreTwo;

  // ── Winner badges ──
  document.getElementById('badge-one').innerHTML = '';
  document.getElementById('badge-two').innerHTML = '';
  document.getElementById('portrait-one').classList.remove('winner');
  document.getElementById('portrait-two').classList.remove('winner');

  if (winner === 1) {
    document.getElementById('badge-one').innerHTML = '<div class="winner-badge">🏆 WINNER</div>';
    document.getElementById('portrait-one').classList.add('winner');
  } else if (winner === 2) {
    document.getElementById('badge-two').innerHTML = '<div class="winner-badge">🏆 WINNER</div>';
    document.getElementById('portrait-two').classList.add('winner');
  } else {
    const tieBadge = '<div class="winner-badge" style="background:var(--text-muted);">🤝 TIE</div>';
    document.getElementById('badge-one').innerHTML = tieBadge;
    document.getElementById('badge-two').innerHTML = tieBadge;
  }

  // ── Stat rows ──
  const container = document.getElementById('stats-rows');
  container.innerHTML = '';

  STATS.forEach(stat => {
    const v1   = h1['stat_' + stat] || 0;
    const v2   = h2['stat_' + stat] || 0;
    const wins = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;

    const row = document.createElement('div');
    row.className = 'stat-row';
    row.innerHTML = `
      <div class="bar-left">
        <span class="val ${wins === 1 ? 'winner-val' : ''}">${v1}</span>
        <div class="track">
          <div class="fill ${wins === 1 ? 'winner-fill' : ''}" id="bl-${stat}"></div>
        </div>
      </div>

      <div class="stat-label-center">
        <i class="${STAT_ICONS[stat]}"></i>
        ${stat.toUpperCase()}
      </div>

      <div class="bar-right">
        <div class="track">
          <div class="fill ${wins === 2 ? 'winner-fill' : ''}" id="br-${stat}"
            style="background: linear-gradient(90deg, var(--primary-blue), #6bcfff);"></div>
        </div>
        <span class="val ${wins === 2 ? 'winner-val' : ''}">${v2}</span>
      </div>
    `;
    container.appendChild(row);
  });

  // Animate bars after short delay (allows DOM to paint first)
  setTimeout(() => {
    STATS.forEach(stat => {
      document.getElementById('bl-' + stat).style.width = (h1['stat_' + stat] || 0) + '%';
      document.getElementById('br-' + stat).style.width = (h2['stat_' + stat] || 0) + '%';
    });
  }, 200);

  // ── Bio sections ──
  document.getElementById('bio-title-one').textContent = h1.name + ' — Bio';
  document.getElementById('bio-title-two').textContent = h2.name + ' — Bio';

  [{ id: 'bio-one', hero: h1 }, { id: 'bio-two', hero: h2 }].forEach(({ id, hero }) => {
    document.getElementById(id).innerHTML = `
      <div class="bio-row">
        <span class="bio-key">Full Name</span>
        <span class="bio-val">${hero.bio_fullname || '—'}</span>
      </div>
      <div class="bio-row">
        <span class="bio-key">Place of Birth</span>
        <span class="bio-val">${hero.bio_placeofbirth || '—'}</span>
      </div>
      <div class="bio-row">
        <span class="bio-key">Alignment</span>
        <span class="bio-val">${hero.bio_alignment || '—'}</span>
      </div>
      <div class="bio-row">
        <span class="bio-key">Gender</span>
        <span class="bio-val">${hero.bio_gender || '—'}</span>
      </div>
      <div class="bio-row">
        <span class="bio-key">Race</span>
        <span class="bio-val">${hero.bio_race || '—'}</span>
      </div>
    `;
  });

  // Show the result content
  document.getElementById('comp-loading').style.display = 'none';
  document.getElementById('comp-content').style.display = 'block';
}

// ══════════════════════════════════════
// RESET — clear comparison and scroll up
// ══════════════════════════════════════
function resetComparison() {
  document.getElementById('comparison-result').style.display = 'none';
  document.getElementById('hero-one').value = '';
  document.getElementById('hero-two').value = '';
  const btn = document.getElementById('btn-compare');
  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-bolt"></i> COMPARE HEROES';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════════════════════
// THEME TOGGLE
// ══════════════════════════════════════
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.querySelector('.theme-icon');
const savedTheme  = localStorage.getItem('theme') || 'light';
document.body.dataset.theme = savedTheme;
themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = next;
  localStorage.setItem('theme', next);
  themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
  themeToggle.style.transform = 'scale(0.9)';
  setTimeout(() => { themeToggle.style.transform = 'scale(1)'; }, 150);
});

// ══════════════════════════════════════
// HAMBURGER MENU
// ══════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ══════════════════════════════════════
// BUTTON EVENT LISTENERS
// ══════════════════════════════════════
document.getElementById('btn-compare').addEventListener('click', runComparison);
document.getElementById('btn-reset').addEventListener('click', resetComparison);

// ── INIT ──
loadDropdowns();

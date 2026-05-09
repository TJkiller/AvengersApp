// ============================================
//   MARVEL GALLERY — hero.js
//   Stark Industries Interface
// ============================================

const SUPABASE_URL = 'https://zxhubiaitwrkyxoiojei.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aHViaWFpdHdya3l4b2lvamVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTY2ODksImV4cCI6MjA5MzU3MjY4OX0.4v-vO3JA2jAU1ItSRHFOoZDfAjHEFmkuiPhDBy7ljiU';
const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

// ── STAT DEFINITIONS ──
const STATS = [
  { key: 'intelligence', label: 'Intelligence', icon: 'fas fa-brain' },
  { key: 'strength',     label: 'Strength',     icon: 'fas fa-dumbbell' },
  { key: 'speed',        label: 'Speed',         icon: 'fas fa-bolt' },
  { key: 'durability',   label: 'Durability',    icon: 'fas fa-shield-alt' },
  { key: 'power',        label: 'Power',         icon: 'fas fa-fire' },
  { key: 'combat',       label: 'Combat',        icon: 'fas fa-fist-raised' }
];

// ── HERO THEMES ──
// Each entry: primary, secondary, accent, dark (deep bg), mid (mid bg)
const HERO_THEMES = {
  'theme-thor': {
    primary:   '#A8A8B0',
    secondary: '#D4AF37',
    accent:    '#2A4B8D',
    dark:      '#0a0a12',
    mid:       '#141420'
  },
  'theme-ironman': {
    primary:   '#CC2200',
    secondary: '#FF7700',
    accent:    '#FFD700',
    dark:      '#0d0400',
    mid:       '#1a0800'
  },
  'theme-captainamerica': {
    primary:   '#1560BD',
    secondary: '#B22222',
    accent:    '#E8E8E8',
    dark:      '#020612',
    mid:       '#050e22'
  },
  'theme-blackwidow': {
    primary:   '#CC2222',
    secondary: '#888888',
    accent:    '#D4AF37',
    dark:      '#060606',
    mid:       '#0e0e0e'
  },
  'theme-hulk': {
    primary:   '#2E8B22',
    secondary: '#1A6B10',
    accent:    '#8B4513',
    dark:      '#010d01',
    mid:       '#051905'
  },
  'theme-hawkeye': {
    primary:   '#7B2FBE',
    secondary: '#5B1F9E',
    accent:    '#C084FC',
    dark:      '#060010',
    mid:       '#0e0020'
  },
  'theme-spiderman': {
    primary:   '#E31C23',
    secondary: '#2020CC',
    accent:    '#C0C0C0',
    dark:      '#06010a',
    mid:       '#0e0218'
  },
  'theme-doctorstrange': {
    primary:   '#D4AF37',
    secondary: '#4A90D9',
    accent:    '#8B2FC9',
    dark:      '#04040e',
    mid:       '#0c0a1e'
  },
  'theme-blackpanther': {
    primary:   '#9B59B6',
    secondary: '#7D3C98',
    accent:    '#A67C00',
    dark:      '#040206',
    mid:       '#0a060e'
  }
};

// ══════════════════════════════════════
// INIT
// ══════════════════════════════════════
const heroId = new URLSearchParams(window.location.search).get('id');
if (!heroId) { showError(); } else { loadHero(heroId); }

// ══════════════════════════════════════
// FETCH
// ══════════════════════════════════════
async function loadHero(id) {
  try {
    const res  = await fetch(`${SUPABASE_URL}/rest/v1/heroes?id=eq.${id}&select=*`, { headers: HEADERS });
    const data = await res.json();
    if (!data || data.length === 0) { showError(); return; }

    const hero = data[0];
    let nextHero = null;

    if (hero.next_hero) {
      const nr = await fetch(`${SUPABASE_URL}/rest/v1/heroes?id=eq.${hero.next_hero}&select=id,name,image`, { headers: HEADERS });
      const nd = await nr.json();
      if (nd && nd.length > 0) nextHero = nd[0];
    }

    buildPage(hero, nextHero);
  } catch (err) {
    console.error('Hero load error:', err);
    showError();
  }
}

// ══════════════════════════════════════
// BUILD PAGE
// ══════════════════════════════════════
function buildPage(hero, nextHero) {
  document.title = `${hero.name} — Marvel Gallery`;

  applyTheme(hero.theme);

  // Banner BG
  const bannerBg = document.getElementById('banner-bg');
  bannerBg.style.backgroundImage = `url('${hero.image}')`;

  // Hero image
  const img = document.getElementById('hero-img');
  img.src = hero.image;
  img.alt = hero.name;

  // Badge
  const heroIcon = document.getElementById('hero-icon');
  heroIcon.className = hero.icon || 'fas fa-star';
  document.getElementById('hero-title-tag').textContent = (hero.title || 'AVENGER').toUpperCase();

  // Name & description
  document.getElementById('hero-name').textContent = hero.name;
  document.getElementById('hero-description').textContent = hero.description || '';

  // Meta chips
  const bannerMeta = document.getElementById('banner-meta');
  bannerMeta.innerHTML = '';
  if (hero.bio_alignment) bannerMeta.innerHTML += `<span class="meta-chip"><i class="fas fa-shield-alt"></i>${hero.bio_alignment.toUpperCase()}</span>`;
  if (hero.bio_race)      bannerMeta.innerHTML += `<span class="meta-chip"><i class="fas fa-dna"></i>${hero.bio_race.toUpperCase()}</span>`;
  if (hero.bio_gender)    bannerMeta.innerHTML += `<span class="meta-chip"><i class="fas fa-user"></i>${hero.bio_gender.toUpperCase()}</span>`;

  // Quick stats
  let total = 0;
  STATS.forEach(s => {
    const val = hero['stat_' + s.key] || 0;
    total += val;
    const el = document.getElementById('qs-' + s.key);
    if (el) el.textContent = val;
  });
  document.getElementById('qs-total').textContent = total;

  // Bio
  document.getElementById('bio-fullname').textContent     = hero.bio_fullname     || '—';
  document.getElementById('bio-placeofbirth').textContent = hero.bio_placeofbirth || '—';
  document.getElementById('bio-alignment').textContent    = hero.bio_alignment    || '—';
  document.getElementById('bio-gender').textContent       = hero.bio_gender       || '—';
  document.getElementById('bio-race').textContent         = hero.bio_race         || '—';

  // Stat bars
  buildStatBars(hero);

  // Next section
  buildNextSection(hero, nextHero);

  // Show page
  document.getElementById('state-loading').style.display = 'none';
  document.getElementById('hero-page').style.display     = 'block';

  // Animate after paint
  setTimeout(() => animateStats(hero), 450);
}

// ══════════════════════════════════════
// APPLY THEME
// ══════════════════════════════════════
function applyTheme(themeName) {
  const theme = HERO_THEMES[themeName] || {
    primary:   '#ED1D24',
    secondary: '#0078D4',
    accent:    '#FFD700',
    dark:      '#0a0208',
    mid:       '#1a0510'
  };

  const root = document.documentElement;
  root.style.setProperty('--hero-primary',   theme.primary);
  root.style.setProperty('--hero-secondary', theme.secondary);
  root.style.setProperty('--hero-accent',    theme.accent);
  root.style.setProperty('--hero-dark',      theme.dark);
  root.style.setProperty('--hero-mid',       theme.mid);

  // Deep dark background from hero colours
  document.body.style.background = `radial-gradient(ellipse at 20% 20%, ${theme.primary}22 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, ${theme.secondary}22 0%, transparent 50%),
    ${theme.dark}`;

  // Update orb colours
  const orbs = document.querySelectorAll('.orb');
  if (orbs[0]) orbs[0].style.background = theme.primary;
  if (orbs[1]) orbs[1].style.background = theme.secondary;
  if (orbs[2]) orbs[2].style.background = theme.accent;

  // Image glow
  const glow = document.getElementById('image-glow');
  if (glow) glow.style.background = theme.primary;
}

// ══════════════════════════════════════
// BUILD STAT BARS
// ══════════════════════════════════════
function buildStatBars(hero) {
  const body = document.getElementById('stats-body');
  body.innerHTML = STATS.map(s => {
    const val = hero['stat_' + s.key] || 0;
    return `
      <div class="stat-item">
        <div class="stat-meta">
          <span class="stat-name">
            <i class="${s.icon}" aria-hidden="true"></i>
            ${s.label.toUpperCase()}
          </span>
          <span class="stat-num" id="snum-${s.key}">${val}</span>
        </div>
        <div class="stat-track">
          <div class="stat-fill" id="sfill-${s.key}"></div>
        </div>
      </div>
    `;
  }).join('');
}

function animateStats(hero) {
  STATS.forEach(s => {
    const val  = hero['stat_' + s.key] || 0;
    const fill = document.getElementById('sfill-' + s.key);
    if (fill) fill.style.width = val + '%';
  });

  // Also animate quick stat mini bars
  STATS.forEach(s => {
    const val  = hero['stat_' + s.key] || 0;
    const qbar = document.getElementById('qfill-' + s.key);
    if (qbar) qbar.style.width = val + '%';
  });
}

// ══════════════════════════════════════
// NEXT HERO SECTION
// ══════════════════════════════════════
function buildNextSection(hero, nextHero) {
  const section = document.getElementById('next-section');

  if (hero.next_hero && nextHero) {
    section.innerHTML = `
      <a class="next-hero-card" href="hero.html?id=${nextHero.id}">
        <div>
          <span class="next-label">Up Next</span>
          <span class="next-name">${nextHero.name.toUpperCase()}</span>
        </div>
        <div class="next-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </a>
    `;
  } else {
    section.innerHTML = `
      <a class="next-hero-card" href="index.html">
        <div>
          <span class="next-label">You've seen them all!</span>
          <span class="next-name">RETURN TO GALLERY</span>
        </div>
        <div class="next-arrow">
          <i class="fas fa-home"></i>
        </div>
      </a>
    `;
  }
}

// ══════════════════════════════════════
// ERROR STATE
// ══════════════════════════════════════
function showError() {
  document.getElementById('state-loading').style.display = 'none';
  document.getElementById('state-error').style.display   = 'flex';
}

// ══════════════════════════════════════
// HAMBURGER
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
// BACK TO TOP
// ══════════════════════════════════════
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.pageYOffset > 300);
});

backToTop.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

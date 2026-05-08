// ── SUPABASE CONFIG ──
    const SUPABASE_URL = 'https://zxhubiaitwrkyxoiojei.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aHViaWFpdHdya3l4b2lvamVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTY2ODksImV4cCI6MjA5MzU3MjY4OX0.4v-vO3JA2jAU1ItSRHFOoZDfAjHEFmkuiPhDBy7ljiU';
    const HEADERS = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    };

  // ══════════════════════════════════════
// HERO OF THE DAY - COMPACT BANNER
// ══════════════════════════════════════
async function loadHeroOfTheDay() {
  try {
    const res    = await fetch(
      `${SUPABASE_URL}/rest/v1/heroes?select=*&order=display_order.asc`,
      { headers: HEADERS }
    );
    const heroes = await res.json();
    if (!heroes || heroes.length === 0) {
      document.getElementById('hotd-banner').style.display = 'none';
      return;
    }

    // Pick hero based on day of the year
    const now       = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / 86400000);
    const hero      = heroes[dayOfYear % heroes.length];

    // Build the compact banner
    document.getElementById('hotd-banner').innerHTML = `
      <div class="hotd-inner">
        <div class="hotd-img-wrap">
          <img src="${hero.image}" alt="${hero.name}"
            onerror="this.src='https://placehold.co/100x100/1e1e1e/666?text=${hero.name}'">
        </div>
        <div class="hotd-body">
          <div class="hotd-label">
            <i class="fas fa-star"></i> Hero of the Day
          </div>
          <h2 class="hotd-name">${hero.name}</h2>
          <div class="hotd-title">${hero.title || 'Avenger'}</div>
          <div class="hotd-stats">
            <div class="hotd-stat">
              <span class="sval">${hero.stat_combat}</span>
              <span class="slbl">CMB</span>
            </div>
            <div class="hotd-stat">
              <span class="sval">${hero.stat_strength}</span>
              <span class="slbl">STR</span>
            </div>
            <div class="hotd-stat">
              <span class="sval">${hero.stat_intelligence}</span>
              <span class="slbl">INT</span>
            </div>
          </div>
          <a href="hero.html?id=${hero.id}" class="hotd-btn">
            View Profile <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;

  } catch (err) {
    console.error('Hero of the Day error:', err);
    document.getElementById('hotd-banner').style.display = 'none';
  }
}
 
    // ── LOAD GALLERY FROM SUPABASE ──
    async function loadGallery() {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/heroes?select=id,name,title,image,description&order=display_order.asc`,
          { headers: HEADERS }
        );
        const heroes = await response.json();

        if (!heroes || heroes.length === 0) {
          document.getElementById('gallery-loading').style.display = 'none';
          document.getElementById('gallery-error').style.display = 'block';
          return;
        }

        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = heroes.map(hero => `
          <div class="hero-card">
            <img src="${hero.image}" alt="${hero.name}" loading="lazy"
              onerror="this.src='https://placehold.co/300x250/1e1e1e/666?text=${hero.name}'">
            <div class="hero-info">
              <h3>${hero.name}</h3>
              <p>${hero.description || 'Click to explore this hero\'s full profile and powers.'}</p>
              <a href="hero.html?id=${hero.id}" class="explore-btn">
                <i class="fas fa-eye"></i> Explore Profile
              </a>
            </div>
          </div>
        `).join('');

        document.getElementById('gallery-loading').style.display = 'none';
        document.getElementById('gallery-grid').style.display = 'grid';
        attachCardAnimations();
        initSearch();

      } catch (err) {
        console.error('Gallery error:', err);
        document.getElementById('gallery-loading').style.display = 'none';
        document.getElementById('gallery-error').style.display = 'block';
      }
    }

    loadGallery();
    loadHeroOfTheDay();

          // ── HERO SEARCH ──
      function initSearch() {
        const input    = document.getElementById('hero-search');
        const clearBtn = document.getElementById('search-clear');
        const empty    = document.getElementById('search-empty');

        input.addEventListener('input', () => {
          const query = input.value.trim().toLowerCase();
          clearBtn.style.display = query ? 'flex' : 'none';

          const cards = document.querySelectorAll('.hero-card');
          let visible = 0;

          cards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const match = name.includes(query);
            card.style.display = match ? 'flex' : 'none';
            if (match) visible++;
          });

          empty.style.display = visible === 0 && query ? 'block' : 'none';
        });

        clearBtn.addEventListener('click', () => {
          input.value = '';
          clearBtn.style.display = 'none';
          empty.style.display = 'none';
          document.querySelectorAll('.hero-card').forEach(card => {
            card.style.display = 'flex';
          });
          input.focus();
        });
      }

    // ── CARD ANIMATIONS ──
    function attachCardAnimations() {
      document.querySelectorAll('.explore-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const target = this.getAttribute('href');
          this.innerHTML = '<span class="loading"></span> Loading...';
          setTimeout(() => { window.location.href = target; }, 700);
        });
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.08 });

      document.querySelectorAll('.hero-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
      });
    }

    // ── THEME TOGGLE ──
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const savedTheme = localStorage.getItem('theme') || 'light';
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

    // ── SMOOTH SCROLL ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // ── FADE IN ANIMATIONS FOR STATIC CARDS ──
    const staticObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.feature-card, .contact-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      staticObserver.observe(el);
    });

    // ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});
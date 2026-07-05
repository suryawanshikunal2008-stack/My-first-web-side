document.addEventListener('DOMContentLoaded', () => {

  /* ================= Sticky header ================= */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ================= Mobile menu toggle ================= */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ================= Active nav link on scroll ================= */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function setActiveLink(){
    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* ================= Scroll reveal (Intersection Observer) ================= */
  const revealItems = document.querySelectorAll('.fade-up');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(item => revealObserver.observe(item));

  /* ================= Skill bar fill animation ================= */
  const skillFills = document.querySelectorAll('.skill-bar__fill');
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = el.getAttribute('data-width') + '%';
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  /* ================= Animated stat counters ================= */
  const statNums = document.querySelectorAll('.stat__num');
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 1200;
        const stepTime = Math.max(Math.floor(duration / target), 20);

        const timer = setInterval(() => {
          current += 1;
          el.textContent = current;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(num => statObserver.observe(num));

  /* ================= Typing effect for hero name ================= */
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const fullText = typedEl.textContent;
    typedEl.textContent = '';
    let i = 0;
    function typeChar(){
      if (i <= fullText.length) {
        typedEl.textContent = fullText.slice(0, i);
        i++;
        setTimeout(typeChar, 80);
      }
    }
    typeChar();
  }

  /* ================= Testimonials: simple responsive slider on mobile ================= */
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  const cards = track ? Array.from(track.children) : [];
  let sliderActive = false;

  function buildDots(){
    dotsWrap.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(index){
    const card = cards[index];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function enableSlider(){
    if (sliderActive || !track) return;
    sliderActive = true;
    track.style.display = 'flex';
    track.style.overflowX = 'auto';
    track.style.scrollSnapType = 'x mandatory';
    cards.forEach(c => {
      c.style.minWidth = '85%';
      c.style.scrollSnapAlign = 'start';
    });
    dotsWrap.style.display = 'flex';
    buildDots();
  }

  function disableSlider(){
    if (!sliderActive || !track) return;
    sliderActive = false;
    track.removeAttribute('style');
    cards.forEach(c => c.removeAttribute('style'));
    dotsWrap.style.display = 'none';
  }

  function handleTestimonialLayout(){
    if (window.innerWidth <= 768) {
      enableSlider();
    } else {
      disableSlider();
    }
  }
  window.addEventListener('resize', handleTestimonialLayout);
  handleTestimonialLayout();

  /* ================= Contact form validation ================= */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  function showError(inputId, message){
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(`${inputId}Error`);
    input.classList.toggle('invalid', Boolean(message));
    errorEl.textContent = message || '';
  }

  function isValidEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successMsg.classList.remove('show');

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      let valid = true;

      if (!name) { showError('name', 'Please enter your name.'); valid = false; }
      else showError('name', '');

      if (!email) { showError('email', 'Please enter your email.'); valid = false; }
      else if (!isValidEmail(email)) { showError('email', 'Please enter a valid email address.'); valid = false; }
      else showError('email', '');

      if (!subject) { showError('subject', 'Please enter a subject.'); valid = false; }
      else showError('subject', '');

      if (!message) { showError('message', 'Please write a message.'); valid = false; }
      else if (message.length < 10) { showError('message', 'Message should be at least 10 characters.'); valid = false; }
      else showError('message', '');

      if (valid) {
        successMsg.classList.add('show');
        form.reset();
      }
    });
  }

  /* ================= Footer year ================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

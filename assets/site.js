// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function(){
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function(item){
    var btn = item.querySelector('.faq-q');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(other){
        if(other !== item){
          other.classList.remove('open');
          other.querySelector('.faq-q').setAttribute('aria-expanded','false');
        }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });

  // Advisor photo carousel (square, auto-rotating)
  document.querySelectorAll('.advisor-carousel').forEach(function(carousel){
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-dot'));
    if(slides.length <= 1) return;

    var index = 0;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timer = null;

    function show(i){
      index = (i + slides.length) % slides.length;
      slides.forEach(function(s, n){ s.classList.toggle('active', n === index); });
      dots.forEach(function(d, n){ d.setAttribute('aria-current', n === index ? 'true' : 'false'); });
    }
    function next(){ show(index + 1); }
    function prev(){ show(index - 1); }
    function start(){
      if(prefersReduced) return;
      stop();
      timer = setInterval(next, 4000);
    }
    function stop(){
      if(timer){ clearInterval(timer); timer = null; }
    }

    var prevBtn = carousel.querySelector('.carousel-arrow.prev');
    var nextBtn = carousel.querySelector('.carousel-arrow.next');
    if(prevBtn) prevBtn.addEventListener('click', function(){ prev(); start(); });
    if(nextBtn) nextBtn.addEventListener('click', function(){ next(); start(); });
    dots.forEach(function(d, n){ d.addEventListener('click', function(){ show(n); start(); }); });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    show(0);
    start();
  });

  // Back-to-top / back-to-category-nav floating button
  var backToTop = document.getElementById('backToTop');
  if(backToTop){
    var toggleBackToTop = function(){
      if(window.scrollY > 400){ backToTop.classList.add('visible'); }
      else{ backToTop.classList.remove('visible'); }
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
  }

  // Horizontal scroll carousels
  document.querySelectorAll('.hscroll-wrap').forEach(function(wrap){
    var track = wrap.querySelector('.hscroll');
    if(!track) return;
    var prevBtn = wrap.querySelector('[data-scroll="prev"]');
    var nextBtn = wrap.querySelector('[data-scroll="next"]');

    function step(){
      var card = track.querySelector('.hscroll-card');
      var gap = 20;
      return card ? card.getBoundingClientRect().width + gap : 300;
    }
    if(prevBtn) prevBtn.addEventListener('click', function(){ track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if(nextBtn) nextBtn.addEventListener('click', function(){ track.scrollBy({ left: step(), behavior: 'smooth' }); });

    // Let vertical mouse-wheel motion scroll the row horizontally
    track.addEventListener('wheel', function(e){
      if(Math.abs(e.deltaY) > Math.abs(e.deltaX)){
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // Keyboard support when the row itself is focused
    track.addEventListener('keydown', function(e){
      if(e.key === 'ArrowRight'){ track.scrollBy({ left: step(), behavior: 'smooth' }); }
      if(e.key === 'ArrowLeft'){ track.scrollBy({ left: -step(), behavior: 'smooth' }); }
    });
  });

  /*// News filter chips (client-side, progressive enhancement)
  var chips = document.querySelectorAll('.filter-chip');
  if(chips.length){
    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        chips.forEach(function(c){ c.setAttribute('aria-pressed','false'); });
        chip.setAttribute('aria-pressed','true');
        var cat = chip.getAttribute('data-filter');
        document.querySelectorAll('[data-cat]').forEach(function(row){
          var match = (cat === 'all') || (row.getAttribute('data-cat') === cat);
          row.style.display = match ? '' : 'none';
        });
      });
    });
  }*/
});

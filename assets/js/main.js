// مسارات عدلية للمحاماة — سلوكيات الموقع

// قائمة الجوال
const toggle = document.querySelector('.nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  document.querySelectorAll('.main-nav a').forEach(a =>
    a.addEventListener('click', () => document.body.classList.remove('nav-open'))
  );
}

// خلفية الترويسة عند التمرير
const header = document.querySelector('.site-header');
const onScroll = () => header && header.classList.toggle('solid', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// الظهور عند التمرير
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// عدّادات الأرقام
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counterIO.unobserve(e.target);
    const el = e.target;
    const target = parseInt(el.dataset.count, 10);
    const dur = 1600;
    const t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = '+' + Math.round(target * eased).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

// تبويبات الفلترة (الأسئلة الشائعة والمدونة)
document.querySelectorAll('.faq-tabs').forEach(tabs => {
  const buttons = tabs.querySelectorAll('.faq-tab');
  const scope = tabs.closest('section') || document;
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const cat = btn.dataset.cat;
    scope.querySelectorAll('[data-cat]').forEach(el => {
      if (el.classList.contains('faq-tab')) return;
      const show = (cat === 'all') || (el.dataset.cat === cat);
      el.hidden = !show;
      if (show) el.classList.add('in');
    });
  }));
});

// نموذج تسجيل الدخول — النظام غير مربوط بعد، يظهر تنبيهاً
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', ev => {
    ev.preventDefault();
    const nid = loginForm.nid.value.trim();
    const notice = document.getElementById('login-notice');
    if (!/^[0-9]{10}$/.test(nid)) {
      notice.textContent = 'يرجى إدخال رقم هوية صحيح مكوّن من 10 أرقام.';
    } else {
      notice.textContent = 'النظام قيد التجهيز حالياً — للاستفسار يرجى التواصل معنا عبر قنواتنا الرسمية.';
    }
    notice.classList.add('show');
  });
}

// نموذج التواصل — يفتح بريد العميل مع تعبئة الرسالة
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    const body = `الاسم: ${name}%0D%0Aالبريد الإلكتروني: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;
    window.location.href = `mailto:info@masaradl.sa?subject=${encodeURIComponent(subject || 'استفسار من الموقع')}&body=${body}`;
  });
}

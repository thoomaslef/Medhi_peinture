/* ==========================================================================
   Medhi Peinture — scripts du site (aucune dépendance)
   1. Menu mobile
   2. Année du pied de page
   3. Galerie : filtres + visionneuse
   4. Formulaire de demande de devis
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Menu mobile ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.visually-hidden').textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- 2. Année du pied de page ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 3. Galerie ---------- */
  const gallery = document.querySelector('[data-gallery]');

  if (gallery) {
    const items = Array.from(gallery.querySelectorAll('.gallery__item'));
    const filters = document.querySelectorAll('[data-filter]');

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter;
        filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        items.forEach((item) => {
          item.hidden = category !== 'tout' && item.dataset.category !== category;
        });
      });
    });

    const dialog = document.querySelector('[data-lightbox]');

    if (dialog && typeof dialog.showModal === 'function') {
      const img = dialog.querySelector('.lightbox__img');
      const caption = dialog.querySelector('.lightbox__caption');
      let current = 0;

      const visibleItems = () => items.filter((item) => !item.hidden);

      const show = (index) => {
        const list = visibleItems();
        if (!list.length) return;
        current = (index + list.length) % list.length;
        const item = list[current];
        const link = item.querySelector('.gallery__link');
        img.src = link.getAttribute('href');
        img.alt = item.querySelector('img').alt;
        const title = item.querySelector('.gallery__title');
        const meta = item.querySelector('.gallery__meta');
        caption.textContent = [title, meta]
          .filter(Boolean)
          .map((el) => el.textContent.trim())
          .join(' — ');
      };

      gallery.addEventListener('click', (e) => {
        const link = e.target.closest('.gallery__link');
        if (!link) return;
        e.preventDefault();
        show(visibleItems().indexOf(link.closest('.gallery__item')));
        document.documentElement.style.overflow = 'hidden';
        dialog.showModal();
      });

      dialog.addEventListener('close', () => {
        document.documentElement.style.overflow = '';
      });

      dialog.querySelector('.lightbox__close').addEventListener('click', () => dialog.close());
      dialog.querySelector('.lightbox__prev').addEventListener('click', () => show(current - 1));
      dialog.querySelector('.lightbox__next').addEventListener('click', () => show(current + 1));

      // Clic en dehors de l'image : fermeture
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog || e.target.classList.contains('lightbox__inner')) dialog.close();
      });

      dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
      });

      // Balayage au doigt sur mobile
      let touchX = null;
      dialog.addEventListener('touchstart', (e) => {
        touchX = e.changedTouches[0].clientX;
      }, { passive: true });
      dialog.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const delta = e.changedTouches[0].clientX - touchX;
        if (Math.abs(delta) > 50) show(current + (delta < 0 ? 1 : -1));
        touchX = null;
      });
    }
  }

  /* ---------- 4. Formulaire de devis ---------- */
  const form = document.querySelector('[data-quote-form]');

  if (form) {
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('[type="submit"]');
    const submitLabel = submit.innerHTML;

    // Pré-sélection de la prestation via l'URL (ex. contact.html?prestation=pose-de-sol)
    const preset = new URLSearchParams(window.location.search).get('prestation');
    const select = form.elements.prestation;
    if (preset && select && Array.from(select.options).some((o) => o.value === preset)) {
      select.value = preset;
    }

    const setStatus = (type, message) => {
      status.hidden = false;
      status.className = 'form-status form-status--' + type;
      status.textContent = message;
      status.focus();
    };

    const selectedText = (name) => {
      const field = form.elements[name];
      return field && field.selectedIndex > 0 ? field.options[field.selectedIndex].text : '—';
    };

    // Solution de repli tant qu'aucun service d'envoi n'est configuré :
    // ouvre la messagerie du visiteur avec la demande pré-remplie.
    const sendByEmail = () => {
      const data = new FormData(form);
      const value = (name) => (data.get(name) || '').toString().trim() || '—';
      const subject = 'Demande de devis — ' + selectedText('prestation') + ' — ' + value('commune');
      const body = [
        'Nom : ' + value('nom'),
        'Téléphone : ' + value('telephone'),
        'E-mail : ' + value('email'),
        'Commune : ' + value('commune'),
        'Prestation : ' + selectedText('prestation'),
        'Surface approximative : ' + (data.get('surface') ? data.get('surface') + ' m²' : '—'),
        'Délai souhaité : ' + selectedText('delai'),
        '',
        'Projet :',
        value('message'),
      ].join('\r\n');

      window.location.href = 'mailto:' + form.dataset.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      setStatus('info', 'Votre messagerie va s’ouvrir avec votre demande pré-remplie : il ne vous reste plus qu’à l’envoyer.');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Champ piège : rempli uniquement par les robots
      if (form.elements._gotcha && form.elements._gotcha.value) return;

      const endpoint = form.getAttribute('action') || '';
      const configured = /^https?:\/\//.test(endpoint) && !endpoint.includes('VOTRE_ID');

      if (!configured) {
        sendByEmail();
        return;
      }

      submit.disabled = true;
      submit.textContent = 'Envoi en cours…';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        form.reset();
        setStatus('success', 'Merci ! Votre demande a bien été envoyée. Je vous recontacte très rapidement.');
      } catch (err) {
        setStatus('error', 'Oups, l’envoi n’a pas fonctionné. Réessayez dans un instant ou appelez-moi directement.');
      } finally {
        submit.disabled = false;
        submit.innerHTML = submitLabel;
      }
    });
  }
})();

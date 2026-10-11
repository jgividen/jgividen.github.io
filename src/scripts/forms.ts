// Progressive form handler for [data-form] elements.
document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
  form.noValidate = true; // we validate in submit so aria-invalid can be set
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const endpoint = form.dataset.endpoint || '';
  const download = form.dataset.download;
  const say = (msg: string, kind: string) => { status.textContent = msg; status.dataset.kind = kind; };
  const email = form.querySelector<HTMLInputElement>('input[type="email"]');
  const link0 = document.getElementById(form.dataset.reveal || '');
  if (link0) link0.hidden = true;
  email?.addEventListener('input', () => email.removeAttribute('aria-invalid'));
  const reveal = () => {
    const link = document.getElementById(form.dataset.reveal || '') as HTMLAnchorElement | null;
    if (link) { link.hidden = false; link.focus(); }
    if (download) { const a = document.createElement('a'); a.href = download; a.download = ''; document.body.append(a); a.click(); a.remove(); }
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { email?.setAttribute('aria-invalid', 'true'); form.reportValidity(); return; }
    email?.removeAttribute('aria-invalid');
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!endpoint) {
      if (download) { reveal(); say('Signup is opening soon. Your download is starting now, no email needed for the moment.', 'info'); }
      else say('Signup is opening soon. Thanks for your interest, check back shortly!', 'info');
      return;
    }
    if (btn) btn.disabled = true;
    say('Sending…', 'info');
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      say(download ? 'Thanks! Your download is starting.' : "You're on the list. We'll be in touch.", 'success');
      if (download) reveal();
    } catch {
      email?.setAttribute('aria-invalid', 'true');
      say("We couldn't send that. Check your connection and try again.", 'error');
      if (download) { status.append(' Or '); const a = document.createElement('a'); a.href = download; a.download = ''; a.textContent = 'download the spreadsheet directly'; status.append(a, '.'); }
    } finally { if (btn) btn.disabled = false; }
  });
});

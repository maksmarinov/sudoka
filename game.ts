  if (!st || st.over) return;
  modal('Before I reveal a hint: did you kiss The Zaychik?', [
    ['Yes, I kissed The Zaychik 💋', () => { if (!st) return; const i = best(st.val); if (i >= 0) { st.hint = i; st.sel = i; render(); } }],
    ['Not yet', () => {}]]);
}

// ---------- init ----------
function init(): void {
  const g = $('grid');
  for (let i = 0; i < 81; i++) {
    const d = document.createElement('div');
    d.onclick = () => {
      if (!st || st.over) return; st.sel = i;
      if (st.erase && !st.given[i]) { st.val[i] = 0; st.notes[i] = 0; }
      if (st.val[i]) st.last = st.val[i];
      render();
    };
    g.appendChild(d); cells.push(d);
  }
  const pad = $('pad');
  for (let n = 1; n <= 9; n++) { const b = document.createElement('button'); b.textContent = String(n); b.onclick = () => press(n); pad.appendChild(b); }
  $('b-hint').onclick = hint;
  $('b-erase').onclick = () => { if (st) { st.erase = !st.erase; if (st.erase) st.maybe = false; render(); } };
  $('b-maybe').onclick = () => { if (st) { st.maybe = !st.maybe; if (st.maybe) st.erase = false; render(); } };
  $('d-btns').innerHTML = '';
  DIFFS.forEach(d => { const b = document.createElement('button'); b.textContent = d; b.onclick = () => newGame(d); $('d-btns').appendChild(b); });
  $('n-new').onclick = () => show('diff'); $('n-hs').onclick = showScores;
  document.querySelectorAll('.back').forEach(b => (b as HTMLElement).onclick = home);
  $('quit').onclick = () => modal('Quit this game?', [['Quit', home], ['Keep playing', () => {}]]);
  document.addEventListener('keydown', e => { if (e.key >= '1' && e.key <= '9') press(+e.key); });
  show('home');
}
init();
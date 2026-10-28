const directions = [
['AI-driven cyber threat detection','Learning to detect threats beyond the training environment.','Cross-dataset and cross-domain generalization, unknown attacks, distribution shift and reliable detection under imperfect telemetry.',['Network traffic analysis','Generalizable intrusion detection','Robust & explainable models'],'Foundation models for network traffic; self-supervised representations; adaptive detection.'],
['Trustworthy AI & AI security','Understanding and defending the intelligence inside the system.','Jailbreak and prompt-injection resistance, adaptive guardrails and representation-level monitoring across models and attack settings.',['LLM security & guardrails','Hidden-state monitoring','Security–efficiency–utility evaluation'],'Living security benchmarks; reasoning-aware safety; intrusion detection for AI models.'],
['Secure & trustworthy agentic AI','Securing the path from a model’s plan to real-world execution.','Agent identity, fine-grained authorization, secure communication and policy enforcement for trustworthy tool and application use.',['Identity & least privilege','Planning & execution integrity','Provenance & auditability'],'Zero-trust agent architectures; runtime monitoring; secure multi-agent systems.'],
['Agentic AI for cybersecurity operations','Helping defenders reason from evidence and act with oversight.','Evidence-grounded retrieval, alert triage, threat investigation and auditable reporting with analysts retaining decision authority.',['Security knowledge & RAG','Agentic SOC & threat hunting','Human–agent collaboration'],'SOC copilots; self-learning investigation memory; human-supervised autonomous defense.'],
['Intelligent IoT, edge & CPS security','Bringing robust security intelligence to constrained environments.','Lightweight detection, corrupted telemetry, privacy-preserving collaboration and cyber-physical attack detection.',['Resource-aware edge models','Federated & distributed security','Cyber-physical resilience'],'Collaborative edge intelligence; agentic IoT security; autonomous CPS defense.']
];
if (document.querySelector('#directions')) document.querySelector('#directions').innerHTML=directions.map((d,i)=>`<article class="direction" id="rd${i+1}"><span class="number">0${i+1}</span><details class="direction-body"><summary><h3>${d[0]}</h3></summary><p class="subhead">${d[1]}</p><p>${d[2]}</p><div class="tags">${d[3].map(t=>`<span>${t}</span>`).join('')}</div></details></article>`).join('');

// Team portraits uploaded alongside the website source appear automatically.
document.querySelectorAll('.team-photo[data-photo]').forEach(figure => {
  const photo = new Image();
  photo.alt = figure.dataset.alt;
  photo.onload = () => figure.querySelector('.photo-placeholder').replaceWith(photo);
  photo.src = figure.dataset.photo;
});

// Curated bibliography: public metadata only; no notes or local attachment paths.
async function loadRelatedReading() {
  if (!document.querySelector('#directions')) return;
  const response = await fetch('related-reading.json');
  if (!response.ok) return;
  const papers = await response.json();
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function list(items) {
    return '<ul class="reading-list">' + items.map(p => '<li><a href="' + escape(p.url) + '" target="_blank" rel="noopener">' + escape(p.title) + '</a> [' + escape(p.linkLabel) + ']<p>' + escape(p.authors.join(', ')) + '</p><p class="reading-meta">' + escape([p.venue, p.year, p.note].filter(Boolean).join(' · ')) + '</p></li>').join('') + '</ul>';
  }
  for (let group = 1; group <= 5; group++) {
    const items = papers.filter(p => p.group === group).sort((a,b) => (b.year || 0) - (a.year || 0));
    const details = document.createElement('details');
    details.className = 'related-reading';
    details.innerHTML = '<summary>Recent papers</summary>' + list(items);
    document.querySelector('#rd' + group + ' .direction-body').append(details);
  }
  const background = document.createElement('details');
  background.className = 'related-reading background-reading';
  background.innerHTML = '<summary>Other papers of interest</summary><p>Complementary reading on post-quantum cryptography, networking, recommendation, AI text detection and online scams.</p>' + list(papers.filter(p => p.group === 0));
  document.querySelector('#directions').after(background);
}
loadRelatedReading().catch(() => {});

// Live DOI metadata checks; publication dates, not page edits, trigger badges.
async function loadConferenceUpdates() {
  const root = document.querySelector('#paper-resources .resource-columns');
  if (!root || !root.querySelector('li strong')) return;
  const venues = [
    ['IEEE S&P', 'IEEE Symposium on Security and Privacy', /^(?:\d{4} )?(?:IEEE )?Symposium on Security and Privacy(?: \(SP\))?$/i],
    ['USENIX Security', 'USENIX Security Symposium', /^(?:Proceedings of the )?(?:\d+(?:st|nd|rd|th) )?USENIX Security Symposium(?: \d{4})?$/i],
    ['ACM CCS', 'ACM SIGSAC Conference on Computer and Communications Security', /^(?:Proceedings of (?:the )?)?(?:\d{4} )?(?:ACM SIGSAC |ACM )?Conference on Computer and Communications Security$/i],
    ['NDSS', 'Network and Distributed System Security Symposium', /^(?:Proceedings of (?:the )?)?(?:\d{4} )?Network and Distributed System Security Symposium(?: \(NDSS\))?(?: \d{4})?$/i],
    ['NeurIPS', 'Advances in Neural Information Processing Systems', /^Advances in Neural Information Processing Systems(?: \d+)?$/i],
    ['ICML', 'International Conference on Machine Learning', /^(?:Proceedings of (?:the )?)?(?:\d+(?:st|nd|rd|th) )?International Conference on Machine Learning(?: \d{4})?$/i],
    ['ICLR', 'International Conference on Learning Representations', /^(?:Proceedings of (?:the )?)?(?:\d+(?:st|nd|rd|th) )?International Conference on Learning Representations(?: \d{4})?$/i],
    ['AAAI', 'Proceedings of the AAAI Conference on Artificial Intelligence', /^Proceedings of the AAAI Conference on Artificial Intelligence$/i],
    ['IJCAI', 'International Joint Conference on Artificial Intelligence', /^(?:Proceedings of (?:the )?)?(?:(?:\d+(?:st|nd|rd|th)|[A-Za-z]+(?:-[A-Za-z]+)?) )?International Joint Conference on Artificial Intelligence$/i],
    ['CVPR / ICCV', 'IEEE CVF Conference on Computer Vision', /^(?:\d{4} )?(?:IEEE\/CVF |IEEE )?(?:Conference on Computer Vision and Pattern Recognition|International Conference on Computer Vision)(?: \((?:CVPR|ICCV)\))?$/i],
    ['ACL / EMNLP', 'Association for Computational Linguistics', /^(?:Proceedings of (?:the )?)?(?:(?:\d+(?:st|nd|rd|th)|\d{4}) )?(?:Annual Meeting of the Association for Computational Linguistics|Conference on Empirical Methods in Natural Language Processing)(?:: Volume \d+ \((?:Long|Short) Papers\))?$/i]
  ];
  const today = new Date();
  const start = new Date(today); start.setUTCDate(start.getUTCDate() - 30);
  const day = d => d.toISOString().slice(0, 10);
  const note = document.createElement('p'); note.className = 'conference-check-note';
  note.textContent = 'Checking recent conference papers…'; root.before(note);
  let succeeded = 0;
  for (const [name, query, pattern] of venues) {
    const item = [...root.querySelectorAll('li')].find(li => li.querySelector('strong')?.textContent === name);
    if (!item) continue;
    try {
      const params = new URLSearchParams({ 'query.container-title': query,
        filter: `from-pub-date:${day(start)},until-pub-date:${day(today)},type:proceedings-article`,
        rows: '100', select: 'DOI,title,container-title,published' });
      const response = await fetch('https://api.crossref.org/works?' + params, { signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error('Metadata unavailable');
      const data = await response.json();
      if (!Array.isArray(data.message?.items)) throw new Error('Invalid metadata');
      succeeded++;
      const seen = new Set();
      const papers = data.message.items.filter(p => {
        const parts = p.published?.['date-parts']?.[0];
        if (!parts || parts.length < 3 || !p.DOI || !p.title?.[0]) return false;
        const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
        if (date < start || date > today || !(p['container-title'] || []).some(t => pattern.test(t)) || seen.has(p.DOI)) return false;
        seen.add(p.DOI); return true;
      });
      item.title = `DOI metadata checked ${day(today)}; ${papers.length ? 'recent publications found' : 'no matching recent records found'}. Coverage varies by venue.`;
      if (!papers.length) continue;
      const details = document.createElement('details'); details.className = 'conference-update-list';
      const summary = document.createElement('summary'); summary.textContent = 'New papers'; summary.className = 'conference-update';
      summary.title = 'Papers dated within the past 30 days in Crossref'; details.append(summary);
      const list = document.createElement('ul');
      papers.slice(0, 5).forEach(p => {
        const li = document.createElement('li'), a = document.createElement('a');
        a.href = 'https://doi.org/' + encodeURI(p.DOI); a.textContent = p.title[0]; a.target = '_blank'; a.rel = 'noopener';
        li.append(a); list.append(li);
      });
      details.append(list); item.append(details);
    } catch (_) { item.title = 'Recent-paper check unavailable. Use the official proceedings link.'; }
  }
  note.textContent = succeeded
    ? `Checked ${day(today)} · “New papers” shows matching DOI records published in the past 30 days. Source: Crossref; coverage varies, especially for AI venues. Check official proceedings for the complete list.`
    : 'Recent-paper checks are temporarily unavailable. Please use the official proceedings links.';
}
loadConferenceUpdates().catch(() => {});

// Direction links reveal the selected research summary automatically.
function revealResearchDirection() {
  if (!/^#rd[1-5]$/.test(location.hash)) return;
  const details = document.querySelector(location.hash + ' details');
  if (details) details.open = true;
}
window.addEventListener('hashchange', revealResearchDirection);
revealResearchDirection();

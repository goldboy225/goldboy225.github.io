const directions = [
['AI-driven cyber threat detection','Learning to detect threats beyond the training environment.','Cross-dataset and cross-domain generalization, unknown attacks, distribution shift and reliable detection under imperfect telemetry.',['Network traffic analysis','Generalizable intrusion detection','Robust & explainable models'],'Foundation models for network traffic; self-supervised representations; adaptive detection.'],
['Trustworthy AI & AI security','Understanding and defending the intelligence inside the system.','Jailbreak and prompt-injection resistance, adaptive guardrails and representation-level monitoring across models and attack settings.',['LLM security & guardrails','Hidden-state monitoring','Security–efficiency–utility evaluation'],'Living security benchmarks; reasoning-aware safety; intrusion detection for AI models.'],
['Secure & trustworthy agentic AI','Securing the path from a model’s plan to real-world execution.','Agent identity, fine-grained authorization, secure communication and policy enforcement for trustworthy tool and application use.',['Identity & least privilege','Planning & execution integrity','Provenance & auditability'],'Zero-trust agent architectures; runtime monitoring; secure multi-agent systems.'],
['Agentic AI for cybersecurity operations','Helping defenders reason from evidence and act with oversight.','Evidence-grounded retrieval, alert triage, threat investigation and auditable reporting with analysts retaining decision authority.',['Security knowledge & RAG','Agentic SOC & threat hunting','Human–agent collaboration'],'SOC copilots; self-learning investigation memory; human-supervised autonomous defense.'],
['Intelligent IoT, edge & CPS security','Bringing robust security intelligence to constrained environments.','Lightweight detection, corrupted telemetry, privacy-preserving collaboration and cyber-physical attack detection.',['Resource-aware edge models','Federated & distributed security','Cyber-physical resilience'],'Collaborative edge intelligence; agentic IoT security; autonomous CPS defense.']
];
document.querySelector('#directions').innerHTML=directions.map((d,i)=>`<article class="direction" id="rd${i+1}"><span class="number">0${i+1}</span><div class="direction-body"><h3>${d[0]}</h3><p class="subhead">${d[1]}</p><p>${d[2]}</p><div class="tags">${d[3].map(t=>`<span>${t}</span>`).join('')}</div><details><summary>Explore future directions <span>+</span></summary><p>${d[4]}</p></details></div></article>`).join('');

// Team portraits uploaded alongside the website source appear automatically.
document.querySelectorAll('.team-photo[data-photo]').forEach(figure => {
  const photo = new Image();
  photo.alt = figure.dataset.alt;
  photo.onload = () => figure.querySelector('.photo-placeholder').replaceWith(photo);
  photo.src = figure.dataset.photo;
});

// Curated bibliography: public metadata only; no notes or local attachment paths.
async function loadRelatedReading() {
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
  background.innerHTML = '<summary>Recent papers</summary><p>Complementary reading on post-quantum cryptography, networking, recommendation, AI text detection and online scams.</p>' + list(papers.filter(p => p.group === 0));
  document.querySelector('#directions').after(background);
}
loadRelatedReading().catch(() => {});

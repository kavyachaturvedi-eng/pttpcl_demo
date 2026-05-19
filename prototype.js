/* ============================================================
   devx UpTime AI — Prototype interactions
   ============================================================ */

(function() {
  'use strict';

  // ─────────── VIEW ROUTER ───────────
  const views = document.querySelectorAll('.view');
  const navItems = document.querySelectorAll('[data-view]');

  function switchView(viewId) {
    views.forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');

    // sync sidenav
    document.querySelectorAll('.sidenav .nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.view === viewId);
    });

    // scroll to top of main
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // special: re-animate RCA on Diagnostician
    if (viewId === 'diagnostician') {
      animateRcaGeneration();
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const v = item.dataset.view;
      if (v) {
        switchView(v);
        const hudIdx = HUD_SCRIPT.findIndex(s => s.view === v);
        if (hudIdx >= 0) updateHud(hudIdx);
      }
    });
  });

  // ─────────── RCA GENERATION ANIMATION ───────────
  function animateRcaGeneration() {
    const stages = document.querySelectorAll('.gen-stage');
    // Reset
    stages.forEach(s => s.classList.remove('active'));
    // Animate sequentially
    stages.forEach((stage, i) => {
      setTimeout(() => {
        stage.classList.add('active');
      }, i * 400);
    });
  }

  const regen = document.getElementById('regenerateRca');
  if (regen) regen.addEventListener('click', animateRcaGeneration);

  // ─────────── APPROVAL FLOW ───────────
  const approveBtn = document.getElementById('approveBtn');
  const approvalSuccess = document.getElementById('approvalSuccess');
  if (approveBtn) {
    approveBtn.addEventListener('click', () => {
      approveBtn.style.display = 'none';
      document.querySelectorAll('.approval-actions .btn-secondary, .approval-actions .btn-text').forEach(b => b.style.display = 'none');
      if (approvalSuccess) approvalSuccess.classList.add('shown');

      // Animate workflow step
      const activeStep = document.querySelector('.wf-step.active');
      if (activeStep) {
        activeStep.classList.remove('active');
        activeStep.classList.add('done');
        activeStep.querySelector('.wf-icon').textContent = '✓';
        activeStep.querySelector('.wf-meta').textContent = 'Approved 02:48 ICT';
      }
      const nextPending = document.querySelector('.wf-step.pending');
      if (nextPending) {
        nextPending.classList.remove('pending');
        nextPending.classList.add('active');
        nextPending.querySelector('.wf-icon').textContent = '→';
        nextPending.querySelector('.wf-meta').textContent = 'In progress';
      }

      // Add audit row
      const auditTrail = document.querySelector('.audit-trail');
      const pendingRow = document.querySelector('.audit-row.pending');
      if (pendingRow && auditTrail) {
        pendingRow.classList.remove('pending');
        pendingRow.querySelector('.audit-time').textContent = '02:48:11';
        pendingRow.querySelector('.audit-source').textContent = 'ENGINEER';
        pendingRow.querySelector('.audit-event').textContent = 'Reliability Engineer · Approved recommendation · WO-2026-05-19-0247 created';
      }
    });
  }

  // ─────────── LANGUAGE TOGGLE ───────────
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const active = langToggle.querySelector('.lang-active');
      const inactive = langToggle.querySelector('.lang-inactive');
      const tmp = active.textContent;
      active.textContent = inactive.textContent;
      inactive.textContent = tmp;
      // Light visual feedback
      langToggle.style.background = 'var(--accent-soft)';
      setTimeout(() => { langToggle.style.background = ''; }, 300);
    });
  }

  // ─────────── DEMO HUD ───────────
  const HUD_SCRIPT = [
    {
      view: 'dashboard',
      label: 'Step 1 of 9',
      text: '02:47 AM Sriracha Refinery. This is the canvas a reliability engineer signs into. 4 alerts active. Note the critical one on P-204 — Sentinel just flagged it 11 minutes ago. Click into it.'
    },
    {
      view: 'asset',
      label: 'Step 2 of 9',
      text: 'P-204 is a crude feed pump on CDU-1 — A1 criticality, no standby. The Sentinel banner shows the early warning: 14 days to action threshold. The chart shows 90 days of vibration with the forecast band. This is the early warning a reactive approach would never see.'
    },
    {
      view: 'canvas',
      label: 'Step 3 of 9',
      text: 'This is the Industrial Canvas — the collaborative workspace. P&ID, 3D model, live chart, OEM docs, work orders, and a live comment thread — all on one surface. Three colleagues are viewing this same canvas right now. The Sr. Reliability Engineer, Process Engineer, and Turnaround Planner are coordinating in the thread on the right. No tab switching. No phone calls. This is where the work actually happens.'
    },
    {
      view: 'diagnostician',
      label: 'Step 4 of 9',
      text: 'Click Run Diagnostician and 28 seconds later you have a full RCA. Five data sources pulled, cross-referenced, hypothesis formed. Every claim has a citation. The recommendation: lubricant sample first, not bearing replacement. That nuance comes from past incidents in Memory.'
    },
    {
      view: 'memory',
      label: 'Step 5 of 9',
      text: 'Memory queried 2,847 indexed incidents and found 3 matches. The top one is P-204 itself from 2022 — same signature, resolved by oil change. Read that engineer note in yellow — a retiring senior engineer captured exactly this pattern. That knowledge stays with you when they retire.'
    },
    {
      view: 'turnaround',
      label: 'Step 6 of 9',
      text: 'Zoom out. The Turnaround Optimizer is preparing the Q3 turnaround scope. Defers 41 low-risk items, adds 8 high-risk items Sentinel surfaced, including bearing replacement for P-204. Net: 3.2 days shorter turnaround.'
    },
    {
      view: 'handoff',
      label: 'Step 7 of 9',
      text: 'Cross-role handoff in action. Same canvas — but now showing how Isolation Planner, Maintenance Planner, Reliability Engineer, and Field Engineer all collaborate on one work package. Annotations preserved. Comments inherited. When the field engineer arrives on their phone, they have full context — isolation markup, comments, past incidents, location. No re-keying, no lost context.'
    },
    {
      view: 'action',
      label: 'Step 8 of 9',
      text: 'Engineer reviews and approves. Approval creates a SAP work order and triggers MOC workflow. Click Approve and watch the workflow advance and audit trail update. Every step explainable, every action traceable.'
    },
    {
      view: 'outcomes',
      label: 'Step 9 of 9',
      text: 'In 12 minutes we have shown all four agents, the Industrial Canvas, cross-role handoff, and embedded copilot working end-to-end. The structural shift: engineer time, captured knowledge, optimized turnarounds, cited evidence, real collaboration. This is what custom-built UI/UX around your operations enables.'
    }
  ];

  let hudIndex = 0;
  const hudToggle = document.getElementById('hudToggle');
  const hudDismiss = document.getElementById('hudDismiss');
  const hudContent = document.getElementById('hudContent');
  const hudScript = document.getElementById('hudScript');
  const hudTime = document.getElementById('hudTime');
  const hudPrev = document.getElementById('hudPrev');
  const hudNext = document.getElementById('hudNext');

  function updateHud(idx) {
    hudIndex = Math.max(0, Math.min(HUD_SCRIPT.length - 1, idx));
    const s = HUD_SCRIPT[hudIndex];
    if (hudScript) hudScript.textContent = s.text;
    if (hudTime) hudTime.textContent = s.label;
    if (hudPrev) hudPrev.disabled = hudIndex === 0;
    if (hudNext) hudNext.textContent = hudIndex === HUD_SCRIPT.length - 1 ? 'Restart' : 'Next →';
  }

  function advanceHud(direction) {
    const newIdx = hudIndex + direction;
    if (newIdx >= HUD_SCRIPT.length) hudIndex = 0;
    else if (newIdx < 0) hudIndex = 0;
    else hudIndex = newIdx;
    const s = HUD_SCRIPT[hudIndex];
    switchView(s.view);
    updateHud(hudIndex);
  }

  function openHud() { if (hudContent) hudContent.classList.add('shown'); }
  function closeHud() { if (hudContent) hudContent.classList.remove('shown'); }

  if (hudToggle && hudContent) {
    hudToggle.addEventListener('click', () => {
      hudContent.classList.contains('shown') ? closeHud() : openHud();
    });
  }
  if (hudDismiss) hudDismiss.addEventListener('click', closeHud);

  if (hudNext) hudNext.addEventListener('click', () => advanceHud(1));
  if (hudPrev) hudPrev.addEventListener('click', () => advanceHud(-1));

  // Keyboard shortcuts for demo presenter
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      // Auto-open HUD on first navigation
      if (hudContent && !hudContent.classList.contains('shown')) openHud();
      advanceHud(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (hudContent && !hudContent.classList.contains('shown')) openHud();
      advanceHud(-1);
    } else if (e.key === 'h' || e.key === 'H') {
      if (hudContent) hudContent.classList.toggle('shown');
    }
  });

  // Initialize HUD at step 0 but HIDDEN by default
  updateHud(0);
  // Note: not adding 'shown' class — user must click to open

  // ─────────── INITIAL ANIMATION ───────────
  // If page loads on Diagnostician view, animate immediately
  if (document.querySelector('#view-diagnostician.active')) {
    animateRcaGeneration();
  }

  // ─────────── MEMORY SEARCH (visual only) ───────────
  const memorySearch = document.getElementById('memorySearch');
  if (memorySearch) {
    memorySearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Visual pulse
        const meta = document.querySelector('.search-meta');
        if (meta) {
          meta.style.opacity = '0.5';
          setTimeout(() => { meta.style.opacity = '1'; }, 400);
        }
      }
    });
  }

  // ─────────── EMBEDDED COPILOT ───────────
  const copilotFab = document.getElementById('copilotFab');
  const copilotBtn = document.getElementById('copilotBtn');
  const copilotTease = document.getElementById('copilotTease');
  const copilotPanel = document.getElementById('copilotPanel');
  const copilotClose = document.getElementById('copilotClose');
  const copilotInput = document.getElementById('copilotInput');
  const copilotSend = document.getElementById('copilotSend');
  const copilotMessages = document.getElementById('copilotMessages');
  const copilotContext = document.getElementById('copilotContext');

  const CONTEXT_MAP = {
    dashboard: 'Dashboard',
    asset: 'P-204 Asset Detail',
    canvas: 'P-204 Investigation Canvas',
    diagnostician: 'P-204 RCA Brief',
    memory: 'Memory Search',
    turnaround: 'Q3 2026 Turnaround',
    handoff: 'Cross-Role Handoff · WP-204',
    action: 'Action Approval',
    outcomes: 'Outcomes Recap'
  };

  // Pre-baked answers for the demo
  const COPILOT_ANSWERS = {
    'whats wrong with p-204': 'P-204 is showing a 4.8 mm/s radial vibration signature that has drifted from baseline (3.0) over 60 days. Pattern matches early-stage bearing wear. Diagnostician estimates lubricant degradation as the most likely root cause — last oil change was 21 months ago, exceeding the 18-month OEM interval. **Recommendation: lubricant sample first, not bearing replacement.**',
    'has this happened before': 'Yes — three closely-matching incidents in Memory:\n• **P-204 itself, June 2022** (similarity 0.91) — same signature, resolved by oil change, 4.5 hours, no production loss\n• **P-308 Rayong, March 2024** (0.87) — same pump class, lubricant change resolved\n• **P-201 same unit, November 2023** (0.84) — caught later, required bearing replacement at T/A',
    'what should i do next': 'Three steps, in order:\n1. **Schedule a lubricant sample within 72 hours** (ISO 4406 + ferrous PQ). 2 hours, no shutdown.\n2. **If contamination confirmed:** oil change in opportunistic window (4 hours, no production impact).\n3. **Defer bearing replacement** to Q3 2026 T/A — already in the Turnaround Optimizer scope.',
    'default': 'I have full canvas context — sensor history, work orders, P&ID, OEM specs, Memory matches. Try one of the suggestions above or ask anything specific about P-204.'
  };

  function openCopilot() {
    if (copilotPanel) copilotPanel.classList.add('shown');
    if (copilotFab) copilotFab.classList.add('opened');
  }
  function closeCopilot() {
    if (copilotPanel) copilotPanel.classList.remove('shown');
    // Don't remove 'opened' — the teaser shouldn't come back once dismissed
  }
  function updateCopilotContext(view) {
    if (copilotContext && CONTEXT_MAP[view]) copilotContext.textContent = CONTEXT_MAP[view];
  }

  if (copilotBtn) copilotBtn.addEventListener('click', () => {
    copilotPanel.classList.contains('shown') ? closeCopilot() : openCopilot();
  });
  // Clicking the teaser ALSO opens the panel
  if (copilotTease) copilotTease.addEventListener('click', openCopilot);
  if (copilotClose) copilotClose.addEventListener('click', closeCopilot);

  function addCopilotMessage(text, isUser) {
    if (!copilotMessages) return;
    const msg = document.createElement('div');
    msg.className = 'copilot-msg ' + (isUser ? 'user' : 'bot');
    const bubble = document.createElement('div');
    bubble.className = 'copilot-bubble';
    bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    msg.appendChild(bubble);
    copilotMessages.appendChild(msg);
    copilotMessages.scrollTop = copilotMessages.scrollHeight;
  }

  function sendCopilotQuery(q) {
    if (!q || !q.trim()) return;
    addCopilotMessage(q, true);
    const key = q.toLowerCase().replace(/[?'.,!]/g, '').trim();
    // typing indicator
    setTimeout(() => {
      const matched = Object.keys(COPILOT_ANSWERS).find(k => k !== 'default' && key.includes(k.replace(/[?'.,!]/g, '')));
      const answer = matched ? COPILOT_ANSWERS[matched] : COPILOT_ANSWERS.default;
      addCopilotMessage(answer, false);
    }, 600);
  }

  if (copilotSend) copilotSend.addEventListener('click', () => {
    const q = copilotInput.value;
    copilotInput.value = '';
    sendCopilotQuery(q);
  });
  if (copilotInput) copilotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = copilotInput.value;
      copilotInput.value = '';
      sendCopilotQuery(q);
    }
  });

  // Wire up suggestion chips
  document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('copilot-suggest')) {
      const q = e.target.dataset.q || e.target.textContent;
      sendCopilotQuery(q);
    }
  });

  // Update copilot context whenever view changes (via nav clicks)
  document.querySelectorAll('[data-view]').forEach(item => {
    item.addEventListener('click', () => {
      setTimeout(() => {
        const activeView = document.querySelector('.view.active');
        if (activeView) {
          const id = activeView.id.replace('view-', '');
          updateCopilotContext(id);
        }
      }, 50);
    });
  });

  // ─────────── CANVAS DRAG & DROP + RESIZE ───────────
  function initCanvas() {
    const canvas = document.getElementById('canvasGrid');
    if (!canvas) return;

    const panels = canvas.querySelectorAll('.canvas-panel');
    if (!panels.length) return;

    // Capture original positions for reset
    const originalPositions = new Map();
    panels.forEach(p => {
      const cs = window.getComputedStyle(p);
      originalPositions.set(p, {
        left: cs.left,
        top: cs.top,
        width: cs.width,
        height: cs.height
      });

      // Inject resize handle into each panel
      if (!p.querySelector('.resize-handle')) {
        const rh = document.createElement('div');
        rh.className = 'resize-handle';
        rh.title = 'Drag to resize';
        p.appendChild(rh);
      }
    });

    // Z-index management — clicked panel comes to front
    let topZ = 10;
    function bringToFront(panel) {
      topZ += 1;
      panel.style.zIndex = topZ;
    }

    // ─── DRAGGING ───
    let dragState = null;

    function onMouseDownDrag(e) {
      const header = e.target.closest('.canvas-panel-header');
      if (!header) return;
      // Don't drag if user clicked an interactive element inside header
      if (e.target.closest('button, a, input')) return;

      const panel = header.closest('.canvas-panel');
      if (!panel) return;

      // Skip on mobile (panels are stacked, position:relative)
      if (window.innerWidth <= 1200) return;

      e.preventDefault();
      bringToFront(panel);
      panel.classList.add('dragging');

      const rect = panel.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();

      dragState = {
        panel,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        canvasLeft: canvasRect.left,
        canvasTop: canvasRect.top
      };

      document.addEventListener('mousemove', onMouseMoveDrag);
      document.addEventListener('mouseup', onMouseUpDrag);
    }

    function onMouseMoveDrag(e) {
      if (!dragState) return;
      e.preventDefault();
      const { panel, offsetX, offsetY, canvasLeft, canvasTop } = dragState;
      let newLeft = e.clientX - canvasLeft - offsetX;
      let newTop = e.clientY - canvasTop - offsetY;

      // Clamp to canvas bounds (8px padding)
      const canvasW = canvas.clientWidth;
      const canvasH = canvas.clientHeight;
      const panelW = panel.offsetWidth;
      const panelH = panel.offsetHeight;
      newLeft = Math.max(8, Math.min(canvasW - panelW - 8, newLeft));
      newTop = Math.max(8, Math.min(canvasH - panelH - 8, newTop));

      panel.style.left = newLeft + 'px';
      panel.style.top = newTop + 'px';
    }

    function onMouseUpDrag() {
      if (dragState && dragState.panel) {
        dragState.panel.classList.remove('dragging');
      }
      dragState = null;
      document.removeEventListener('mousemove', onMouseMoveDrag);
      document.removeEventListener('mouseup', onMouseUpDrag);
    }

    // ─── RESIZING ───
    let resizeState = null;

    function onMouseDownResize(e) {
      const handle = e.target.closest('.resize-handle');
      if (!handle) return;
      const panel = handle.closest('.canvas-panel');
      if (!panel) return;
      if (window.innerWidth <= 1200) return;

      e.preventDefault();
      e.stopPropagation();
      bringToFront(panel);
      panel.classList.add('resizing');

      resizeState = {
        panel,
        startX: e.clientX,
        startY: e.clientY,
        startW: panel.offsetWidth,
        startH: panel.offsetHeight
      };

      document.addEventListener('mousemove', onMouseMoveResize);
      document.addEventListener('mouseup', onMouseUpResize);
    }

    function onMouseMoveResize(e) {
      if (!resizeState) return;
      e.preventDefault();
      const { panel, startX, startY, startW, startH } = resizeState;
      const newW = Math.max(220, startW + (e.clientX - startX));
      const newH = Math.max(160, startH + (e.clientY - startY));
      panel.style.width = newW + 'px';
      panel.style.height = newH + 'px';
    }

    function onMouseUpResize() {
      if (resizeState && resizeState.panel) {
        resizeState.panel.classList.remove('resizing');
      }
      resizeState = null;
      document.removeEventListener('mousemove', onMouseMoveResize);
      document.removeEventListener('mouseup', onMouseUpResize);
    }

    // ─── EVENT LISTENERS ───
    canvas.addEventListener('mousedown', (e) => {
      // Resize handle takes priority over drag
      if (e.target.closest('.resize-handle')) {
        onMouseDownResize(e);
      } else if (e.target.closest('.canvas-panel-header')) {
        onMouseDownDrag(e);
      }
    });

    // Click anywhere on panel brings to front
    panels.forEach(p => {
      p.addEventListener('mousedown', () => bringToFront(p));
    });

    // ─── RESET BUTTON ───
    const resetBtn = document.getElementById('canvasResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        panels.forEach(p => {
          const orig = originalPositions.get(p);
          if (orig) {
            // Animate the reset
            p.style.transition = 'left 0.3s ease, top 0.3s ease, width 0.3s ease, height 0.3s ease';
            p.style.left = orig.left;
            p.style.top = orig.top;
            p.style.width = orig.width;
            p.style.height = orig.height;
            setTimeout(() => { p.style.transition = ''; }, 350);
          }
        });
        // Visual feedback on button
        resetBtn.style.background = 'var(--success)';
        setTimeout(() => { resetBtn.style.background = ''; }, 600);
      });
    }
  }

  // Initialize canvas drag/drop when the canvas view first becomes active
  let canvasInitialized = false;
  function ensureCanvasInit() {
    const canvasView = document.getElementById('view-canvas');
    if (canvasView && canvasView.classList.contains('active') && !canvasInitialized) {
      // Wait a frame for the layout to apply
      requestAnimationFrame(() => {
        initCanvas();
        canvasInitialized = true;
      });
    }
  }

  // Hook into view switching
  const observer = new MutationObserver(ensureCanvasInit);
  const canvasViewEl = document.getElementById('view-canvas');
  if (canvasViewEl) {
    observer.observe(canvasViewEl, { attributes: true, attributeFilter: ['class'] });
    // Also check on initial load
    ensureCanvasInit();
  }

})();

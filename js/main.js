(function () {
  'use strict';

  // ===== DOM Elements =====
  const questionScreen = document.getElementById('question-screen');
  const celebrationScreen = document.getElementById('celebration-screen');
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const dialogueBox = document.getElementById('dialogue-box');
  const dialogueText = document.getElementById('dialogue-text');
  const attemptCounter = document.getElementById('attempt-counter');
  const attemptCount = document.getElementById('attempt-count');
  const contractDate = document.getElementById('contract-date');
  const contractAttempts = document.getElementById('contract-attempts');
  const celebDialogueText = document.getElementById('celebration-dialogue-text');

  // ===== State =====
  let noAttempts = 0;
  let celebDialogueIndex = 0;
  let celebDialogueInterval = null;

  // ===== No-Attempt Dialogues (20 total, deadpan → absurdist) =====
  const dialogues = [
    "Interesting choice. Wrong, but interesting.",
    "The button moved. That's not a bug. That's a feature.",
    "You're really committing to this bit, huh.",
    "I admire the persistence. Not the judgment, but the persistence.",
    "Fun fact: no one in the history of this website has successfully clicked No.",

    "The button is now questioning your commitment to this relationship.",
    "I spent hours coding this. You could at least pretend to be impressed.",
    "At this point the button is running out of places to hide.",
    "You know this ends with you clicking Yes, right? We both know.",
    "The button just filed a restraining order against your cursor.",

    "BREAKING: Local button evades capture. Authorities baffled.",
    "I could've just texted you. But no. I had to be \u2728 extra \u2728 about it.",
    "The button has entered witness protection. New identity. New life.",
    "Plot twist: the No button was never real. It was the friends we made along the way.",
    "My therapist said this website is 'a lot.' I said thank you.",

    "Okay genuinely \u2014 how are you still trying.",
    "The button wrote a resignation letter. It was very emotional.",
    "NASA called. They found the button. It's orbiting Jupiter.",
    "Congratulations. You've unlocked the secret ending. It's still Yes.",
    "I'm not even mad. I'm impressed. But also click Yes."
  ];

  // ===== Celebration Dialogues (10 rotating) =====
  const celebrationDialogues = [
    "Finally. I was starting to think I'd have to add more code.",
    "The button can rest now. You've freed it. It's at peace.",
    "Somewhere, a developer just shed a single tear of joy.",
    "The contract is binding. I checked. I didn't check with a lawyer, but still.",
    "This confetti is coming out of my personal confetti budget, by the way.",
    "You said Yes. No take-backs. I already mass-produced the announcement cards.",
    "This is now a legally recognized holiday. Source: trust me.",
    "The No button sends its regards. And also a therapy bill.",
    "Best decision you've made today. Low bar, but still.",
    "I'd play romantic music right now but I couldn't figure out the audio API."
  ];

  // ===== No Button Evasion Logic =====

  function getRandomPosition() {
    var padding = 20;
    // Use getBoundingClientRect for actual visual size (accounts for transforms)
    var btnRect = noBtn.getBoundingClientRect();
    var btnWidth = Math.ceil(btnRect.width);
    var btnHeight = Math.ceil(btnRect.height);

    // Use visualViewport for reliable dimensions on mobile (address bar, keyboard, etc.)
    var vp = window.visualViewport || null;
    var vpW = vp ? vp.width : document.documentElement.clientWidth;
    var vpH = vp ? vp.height : document.documentElement.clientHeight;

    var minX = padding;
    var minY = padding;
    var maxX = Math.max(minX, vpW - btnWidth - padding);
    var maxY = Math.max(minY, vpH - btnHeight - padding);

    if (noAttempts < 6) {
      // Phase 1: constrain to button container area (intersected with viewport)
      var container = document.getElementById('button-container');
      var rect = container.getBoundingClientRect();
      minX = Math.max(padding, rect.left);
      minY = Math.max(padding, rect.top);
      maxX = Math.min(maxX, rect.right - btnWidth);
      maxY = Math.min(maxY, rect.bottom - btnHeight);
      maxX = Math.max(minX, maxX);
      maxY = Math.max(minY, maxY);
    }

    return {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY)
    };
  }

  function dodgeNoButton() {
    noAttempts++;
    attemptCount.textContent = noAttempts;

    // Show attempt counter after first try
    if (noAttempts >= 1) {
      attemptCounter.classList.add('visible');
    }

    // Move button to new position
    if (!noBtn.classList.contains('dodging')) {
      noBtn.classList.add('dodging');
    }

    const pos = getRandomPosition();
    noBtn.style.left = pos.x + 'px';
    noBtn.style.top = pos.y + 'px';

    // Grow Yes button (8% per attempt, max 1.8x)
    const yesScale = Math.min(1.8, 1 + noAttempts * 0.08);
    yesBtn.style.transform = 'scale(' + yesScale + ')';

    // Start pulsing after first No attempt
    if (noAttempts >= 1) {
      yesBtn.classList.add('pulsing');
    }

    // Text changes at milestones
    if (noAttempts === 13) {
      noBtn.textContent = 'Reconsider';
    }

    if (noAttempts === 16) {
      noBtn.textContent = 'Fine, Yes';
    }

    // Update futility meter
    var futilityMeter = document.getElementById('futility-meter');
    var futilityFill = document.getElementById('futility-bar-fill');
    var futilityPct = document.getElementById('futility-pct');
    if (noAttempts >= 1) {
      futilityMeter.classList.add('visible');
    }
    var pct = Math.min(100, Math.round(noAttempts / 20 * 100));
    futilityFill.style.width = pct + '%';
    futilityPct.textContent = pct + '%';

    // Update dialogue
    updateDialogue();
  }

  function updateDialogue() {
    const index = Math.min(noAttempts - 1, dialogues.length - 1);
    if (index >= 0) {
      dialogueText.textContent = dialogues[index];
      dialogueBox.classList.remove('dialogue-pop');
      // Force reflow to restart animation
      void dialogueBox.offsetWidth;
      dialogueBox.classList.add('dialogue-pop');
    }
  }

  // Desktop: mouseenter, mouseover, mousedown
  noBtn.addEventListener('mouseenter', function (e) {
    e.preventDefault();
    dodgeNoButton();
  });

  noBtn.addEventListener('mousedown', function (e) {
    e.preventDefault();
    dodgeNoButton();
  });

  // Mobile: touchstart with preventDefault to stop click-through
  noBtn.addEventListener('touchstart', function (e) {
    e.preventDefault();
    dodgeNoButton();
  }, { passive: false });

  noBtn.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, { passive: false });

  // Block context menu (long-press)
  noBtn.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  // Keyboard: redirect focus to Yes button after first attempt
  noBtn.addEventListener('focus', function () {
    if (noAttempts >= 1) {
      yesBtn.focus();
      dodgeNoButton();
    }
  });

  // Proactive dodging after 3 attempts: move when pointer approaches
  document.addEventListener('pointermove', function (e) {
    if (noAttempts < 3) return;
    if (!noBtn.classList.contains('dodging')) return;

    var rect = noBtn.getBoundingClientRect();
    var btnCenterX = rect.left + rect.width / 2;
    var btnCenterY = rect.top + rect.height / 2;
    var dx = e.clientX - btnCenterX;
    var dy = e.clientY - btnCenterY;
    var distance = Math.sqrt(dx * dx + dy * dy);

    // If pointer is within 120px, dodge proactively
    if (distance < 120) {
      var pos = getRandomPosition();
      noBtn.style.left = pos.x + 'px';
      noBtn.style.top = pos.y + 'px';
    }
  });

  // ===== Yes Button Handler =====
  yesBtn.addEventListener('click', function () {
    celebrate();
  });

  // Also handle touch on Yes (just in case)
  yesBtn.addEventListener('touchend', function (e) {
    e.preventDefault();
    celebrate();
  });

  function celebrate() {
    // Prevent double-trigger
    if (celebrationScreen.classList.contains('active')) return;

    // Fire confetti - center burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#e63970', '#ff6b8a', '#ffb6c8', '#fff', '#ff85a2']
    });

    // Left burst
    setTimeout(function () {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: ['#e63970', '#ff6b8a', '#ffb6c8']
      });
    }, 300);

    // Right burst
    setTimeout(function () {
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: ['#e63970', '#ff6b8a', '#ffb6c8']
      });
    }, 500);

    // Switch screens
    setTimeout(function () {
      questionScreen.classList.remove('active');
      celebrationScreen.classList.add('active');

      // Inject date
      var now = new Date();
      var options = { year: 'numeric', month: 'long', day: 'numeric' };
      contractDate.textContent = now.toLocaleDateString('en-IN', options);

      // Inject No-attempt count
      contractAttempts.textContent = noAttempts;

      // Update attempts clause text based on count
      if (noAttempts === 0) {
        document.getElementById('attempts-clause').textContent =
          'The Valentine clicked Yes immediately. No drama required. Suspicious, but accepted.';
      }

      // More confetti on celebration screen
      setTimeout(function () {
        confetti({
          particleCount: 100,
          spread: 160,
          origin: { y: 0.3 },
          colors: ['#e63970', '#ff6b8a', '#ffb6c8', '#fff']
        });
      }, 800);

      // Start rotating celebration dialogues
      showCelebrationDialogue();
      celebDialogueInterval = setInterval(showCelebrationDialogue, 4000);
    }, 700);
  }

  function showCelebrationDialogue() {
    var text = celebrationDialogues[celebDialogueIndex % celebrationDialogues.length];
    celebDialogueText.textContent = text;

    var box = document.getElementById('celebration-dialogue');
    box.classList.remove('dialogue-pop');
    void box.offsetWidth;
    box.classList.add('dialogue-pop');

    celebDialogueIndex++;
  }
})();

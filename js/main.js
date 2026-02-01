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

  // ===== Bollywood Dialogues (20 total, escalating) =====
  const dialogues = [
    // Tier 1 (1-5): Surprised
    "Ye kya kar rahi ho?! Sochna padega kya ismein?",
    "Dil hai, khilona nahi! (But seriously, Yes daba do)",
    "Arre wah, phir se try? Button bhi sharma raha hai.",
    "Itna mushkil nahi hai... Yes wahi hai, bada wala, golden.",
    "Tumne Sholay dekhi hai? Woh Basanti ka scene... bas wahi feel hai abhi.",

    // Tier 2 (6-10): SRK mode + desperate
    "\"Ek baar jo maine commitment kar di, toh phir...\" - woh toh Yes ke baad hoga!",
    "Pushpa... I mean Aditi, flower nahi, FIRE hai ye proposal!",
    "Button bhi thak gaya hai bhaagte bhaagte. Daya karo.",
    "SRK hota toh ab tak baarish mein khada hota. Main code likh raha hoon.",
    "Ye button ab therapy manga raha hai. Khush ho?",

    // Tier 3 (11-15): Absurd escalation
    "BREAKING NEWS: Local button refuses to be clicked. Nation wants to know WHY.",
    "Devdas nahi banunga main. Isliye No button bhi nahi milega tumhe.",
    "Button ne apna resignation de diya hai. Ab sirf Yes hai.",
    "UN mein complaint file kar raha hoon: 'Button harassment'",
    "Ye button ab witness protection programme mein hai.",

    // Tier 4 (16-20): Full chaos
    "Button ne therapy leni shuru kar di hai. Therapist ne bola: 'Just say Yes.'",
    "NASA confirmed: Button ab orbit mein hai. Catch karna mushkil hai.",
    "Button ka autobiography aa rahi hai: 'The One Who Was Never Clicked'",
    "Guinness World Record: Most failed attempts to reject a Valentine. Congratulations!",
    "Plot twist: Button ne khud Yes bol diya. Bas tum bhi bol do."
  ];

  // ===== Celebration Dialogues (10 rotating) =====
  const celebrationDialogues = [
    "FINALLY! Itna drama kyun karna tha? Seedha Yes bol deti!",
    "Mujhe pata tha... tum mana nahi kar sakti thi. Filmy hai ye, but TRUE!",
    "Somewhere, SRK is smiling. Uski training kaam aa gayi.",
    "Ab contract sign ho gaya hai. No take-backs. Maine lawyer se check karaya.",
    "Confetti budget exhaust ho gaya hai, but feelings infinite hai.",
    "Ye Valentine's Day nahi, HISTORY hai. Save the date!",
    "Tumne Yes bola... aur duniya thodi better ho gayi.",
    "Bollywood mein hota toh ab background mein \"Tum Hi Ho\" bajta.",
    "Main already celebration mein hoon. Tum bhi aa jao!",
    "Best decision of 2025. (Okay fine, every year.)"
  ];

  // ===== No Button Evasion Logic =====

  function getRandomPosition() {
    const padding = 20;
    let maxX, maxY;

    if (noAttempts < 6) {
      // Stay within the button container area initially
      const container = document.getElementById('button-container');
      const rect = container.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();
      maxX = rect.right - btnRect.width - padding;
      maxY = rect.bottom - btnRect.height - padding;
      return {
        x: Math.max(rect.left + padding, Math.random() * maxX),
        y: Math.max(rect.top + padding, Math.random() * maxY)
      };
    } else {
      // Escape to full viewport
      const btnRect = noBtn.getBoundingClientRect();
      maxX = window.innerWidth - btnRect.width - padding;
      maxY = window.innerHeight - btnRect.height - padding;
      return {
        x: Math.max(padding, Math.random() * maxX),
        y: Math.max(padding, Math.random() * maxY)
      };
    }
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

    // Shrink No button (8% per attempt, min 40%)
    const noScale = Math.max(0.4, 1 - noAttempts * 0.08);
    noBtn.style.transform = 'scale(' + noScale + ')';

    // Grow Yes button (8% per attempt, max 1.8x)
    const yesScale = Math.min(1.8, 1 + noAttempts * 0.08);
    yesBtn.style.transform = 'scale(' + yesScale + ')';

    // Start pulsing after first No attempt
    if (noAttempts >= 1) {
      yesBtn.classList.add('pulsing');
    }

    // Special behaviors at milestones
    if (noAttempts === 7) {
      // Opacity flash
      noBtn.style.opacity = '0.4';
      setTimeout(function() { noBtn.style.opacity = '0.7'; }, 300);
    }

    if (noAttempts === 10) {
      noBtn.classList.add('flipped');
    }

    if (noAttempts === 13) {
      noBtn.textContent = 'Soch lo...';
    }

    if (noAttempts === 16) {
      noBtn.textContent = 'Okay fine, Yes';
    }

    if (noAttempts >= 20) {
      noBtn.style.opacity = String(Math.max(0.1, 0.5 - (noAttempts - 20) * 0.1));
    }

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
      colors: ['#ffd700', '#ff4444', '#ff69b4', '#fff', '#c8a400']
    });

    // Left burst
    setTimeout(function () {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: ['#ffd700', '#ff4444', '#ff69b4']
      });
    }, 300);

    // Right burst
    setTimeout(function () {
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: ['#ffd700', '#ff4444', '#ff69b4']
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
          'The Valentine wisely chose "Yes" on the first try. Impressive taste.';
      }

      // More confetti on celebration screen
      setTimeout(function () {
        confetti({
          particleCount: 100,
          spread: 160,
          origin: { y: 0.3 },
          colors: ['#ffd700', '#ff4444', '#ff69b4', '#fff']
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

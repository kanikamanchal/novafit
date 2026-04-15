gsap.registerPlugin(ScrollTrigger);

// ---------- CUSTOM CURSOR (Fixed centering & hover scaling) ----------
const cursorCircle = document.querySelector('.cursor-circle');
const cursorDot = document.querySelector('.cursor-dot');

if (cursorCircle && cursorDot) {
    // Hide cursors initially
    gsap.set(cursorCircle, { autoAlpha: 0 });
    gsap.set(cursorDot, { autoAlpha: 0 });

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Show cursors on first move
        if (cursorCircle._gsap?.autoAlpha === 0) {
            gsap.set([cursorCircle, cursorDot], { autoAlpha: 1 });
        }
    });

    gsap.ticker.add(() => {
        // Smooth follow for circle
        circleX += (mouseX - circleX) * 0.2;
        circleY += (mouseY - circleY) * 0.2;
        gsap.set(cursorCircle, {
            xPercent: -50,
            yPercent: -50,
            x: circleX,
            y: circleY
        });

        // Smooth follow for dot
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        gsap.set(cursorDot, {
            xPercent: -50,
            yPercent: -50,
            x: dotX,
            y: dotY
        });
    });

    // Hover animations for interactive elements
    const interactive = document.querySelectorAll('a, button, .workout-card, .diet-card, .stat-item, .coach-card, .gallery-item');
    interactive.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorCircle.classList.add('cursor-hover');
            gsap.to(cursorDot, {
                scale: 2,
                backgroundColor: '#fff',
                duration: 0.2,
                overwrite: true
            });
        });
        el.addEventListener('mouseleave', () => {
            cursorCircle.classList.remove('cursor-hover');
            gsap.to(cursorDot, {
                scale: 1,
                backgroundColor: '#3b82f6',
                duration: 0.2,
                overwrite: true
            });
        });
    });
}

// ---------- ABOUT SECTION ANIMATIONS ----------
gsap.from(".about-text", {
    scrollTrigger: { trigger: "#about-section", start: "top 70%" },
    opacity: 0,
    x: -50,
    duration: 1,
    ease: "power3.out"
});
gsap.from(".about-visual", {
    scrollTrigger: { trigger: "#about-section", start: "top 70%" },
    opacity: 0,
    x: 50,
    duration: 1,
    ease: "power3.out"
});

// ---------- HERO ANIMATIONS ----------
const tl = gsap.timeline();
tl.from(".navbar", { y: -100, opacity: 0, duration: 0.8, ease: "power3.out" })
  .from("#heroMainText", { opacity: 0, y: 60, duration: 1, ease: "back.out(0.7)" }, "-=0.5")
  .from(".hero-glow", { opacity: 0, scale: 0.9, duration: 0.8 }, "-=0.6")
  .from("#heroCta", { opacity: 0, y: 30, duration: 0.6 }, "-=0.4")
  .from(".scroll-indicator", { opacity: 0, y: -20, duration: 0.8 }, "-=0.2");

// ---------- ANIMATED COUNTERS (Optimized) ----------
const counters = document.querySelectorAll('.stat-number');
const animateNumbers = () => {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        if (isNaN(target)) return;
        let current = 0;
        const increment = target / 80;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });
};
ScrollTrigger.create({
    trigger: ".stats-row",
    start: "top 80%",
    onEnter: animateNumbers,
    once: true
});

// ---------- CARD STAGGER REVEALS ----------
gsap.utils.toArray(".workout-card, .diet-card, .gallery-item").forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
        opacity: 0,
        y: 70,
        duration: 0.8,
        delay: i * 0.08,
        ease: "back.out(0.5)",
        scale: 0.95
    });
});
gsap.utils.toArray(".coach-card").forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: ".coaches-grid", start: "top 80%" },
        opacity: 0,
        x: i % 2 === 0 ? -40 : 40,
        duration: 0.7,
        delay: i * 0.1,
        rotationY: 10
    });
});
gsap.from(".cta-section", {
    scrollTrigger: { trigger: ".cta-section", start: "top 85%" },
    opacity: 0,
    y: 60,
    duration: 1.2,
    scale: 0.96,
    ease: "elastic.out(1, 0.5)"
});

// ---------- BUTTON INTERACTIONS ----------
document.querySelectorAll(".workout-btn, .diet-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = btn.closest(".workout-card, .diet-card");
        const name = card?.querySelector("h3")?.innerText || "Program";
        alert(`✨ ${name} activated! Elite guidance & meal prep unlocked.`);
        gsap.to(card, { boxShadow: "0 0 25px #3b82f6", duration: 0.2, yoyo: true, repeat: 1 });
    });
});
document.querySelectorAll(".workout-card, .diet-card").forEach(card => {
    card.addEventListener("click", (e) => {
        if (e.target.classList.contains("card-btn")) return;
        const title = card.querySelector("h3")?.innerText || "This program";
        alert(`⚡ ${title} — Learn more about this program.`);
    });
});
document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => alert("🔥 Immersive gallery — full experience coming soon."));
});
document.getElementById("heroCta")?.addEventListener("click", () => alert("Welcome to NOVA. Your 14-day elite trial awaits."));
document.getElementById("ctaMainBtn")?.addEventListener("click", () => alert("Membership portal: unlock VR classes & personal bio‑coach."));

// ---------- NAVBAR SCROLL EFFECT ----------
window.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar");
    if (nav) {
        if (window.scrollY > 50) nav.style.background = "rgba(0,0,0,0.92)";
        else nav.style.background = "rgba(5,7,10,0.65)";
    }
});

// ---------- PARALLAX TILT FOR HERO TITLE ----------
const heroContent = document.querySelector(".hero-content");
if (heroContent) {
    heroContent.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth) * 20;
        const y = (e.clientY / window.innerHeight) * 20;
        gsap.to("#heroMainText", {
            duration: 0.8,
            textShadow: `${x * 0.5}px ${y * 0.5}px 30px rgba(59,130,246,0.4)`,
            ease: "power2.out"
        });
    });
}

// ---------- FLOATING SCROLL INDICATOR ----------
gsap.to(".scroll-indicator", {
    y: 10,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

// ---------- GLOW ON SECTION TITLES ----------
gsap.utils.toArray(".section-title").forEach(title => {
    ScrollTrigger.create({
        trigger: title,
        start: "top 85%",
        onEnter: () => gsap.to(title, {
            textShadow: "0 0 15px #3b82f6",
            duration: 0.5,
            yoyo: true,
            repeat: 1
        })
    });
});

// ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ---------- BMI CALCULATOR ----------
let unit = "metric";
const weightInput = document.getElementById('weight-input');
const heightInput = document.getElementById('height-input');
const unitBtns = document.querySelectorAll('.unit-btn');
const weightGroupLabel = document.querySelector('#weight-group label');
const heightGroupLabel = document.querySelector('#height-group label');

function updateUnitUI() {
    if (!weightGroupLabel || !heightGroupLabel) return;
    if (unit === "metric") {
        weightGroupLabel.innerHTML = '<i class="fas fa-weight-scale"></i> Weight (kg)';
        heightGroupLabel.innerHTML = '<i class="fas fa-ruler"></i> Height (cm)';
        if (weightInput) weightInput.placeholder = "Enter weight in kg";
        if (heightInput) heightInput.placeholder = "Enter height in cm";
    } else {
        weightGroupLabel.innerHTML = '<i class="fas fa-weight-scale"></i> Weight (lbs)';
        heightGroupLabel.innerHTML = '<i class="fas fa-ruler"></i> Height (inches)';
        if (weightInput) weightInput.placeholder = "Enter weight in pounds";
        if (heightInput) heightInput.placeholder = "Enter height in inches";
    }
}

unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        unitBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        unit = btn.getAttribute('data-unit');
        updateUnitUI();
        const resultArea = document.getElementById('bmi-result-area');
        if (resultArea) {
            resultArea.innerHTML = `<div class="bmi-number">—</div><div class="bmi-category">Ready to evolve</div><div class="bmi-message">Enter your stats and discover your BMI</div>`;
        }
    });
});

function calculateBMI() {
    if (!weightInput || !heightInput) return;
    let weight = parseFloat(weightInput.value);
    let height = parseFloat(heightInput.value);
    const resultArea = document.getElementById('bmi-result-area');
    if (!resultArea) return;

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        resultArea.innerHTML = `<div class="bmi-number">⚠️</div><div class="bmi-category">Invalid Input</div><div class="bmi-message">Please enter valid positive numbers.</div>`;
        return;
    }
    let bmi;
    if (unit === "metric") {
        let heightM = height / 100;
        bmi = weight / (heightM * heightM);
    } else {
        bmi = (weight / (height * height)) * 703;
    }
    bmi = Math.round(bmi * 10) / 10;
    let category = "", message = "";
    if (bmi < 18.5) {
        category = "Underweight";
        message = "Focus on nutrient-dense fuel & strength training.";
    } else if (bmi >= 18.5 && bmi < 25) {
        category = "Optimal Range";
        message = "Excellent! Maintain with balanced training.";
    } else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
        message = "Incorporate HIIT & metabolic conditioning.";
    } else {
        category = "High Range";
        message = "Our coaches can design a transformation blueprint.";
    }
    resultArea.innerHTML = `
        <div class="bmi-number">${bmi}</div>
        <div class="bmi-category">${category}</div>
        <div class="bmi-message">${message}</div>
    `;
    gsap.fromTo(resultArea, { scale: 0.95, opacity: 0.7 }, { scale: 1, opacity: 1, duration: 0.4 });
}

document.getElementById('calc-bmi')?.addEventListener('click', calculateBMI);

// ---------- GLOBAL BUTTON HOVER SCALE ----------
document.querySelectorAll(".btn-primary, .card-btn, .cta-btn").forEach(btn => {
    btn.addEventListener("mouseenter", () => gsap.to(btn, { scale: 1.05, duration: 0.2, ease: "back.out(1)" }));
    btn.addEventListener("mouseleave", () => gsap.to(btn, { scale: 1, duration: 0.2 }));
});

// ---------- JOIN US MODAL ----------
const joinBtn = document.getElementById("joinUsBtn");
const modal = document.getElementById("joinModal");
const closeBtn = document.getElementById("closeModalBtn");

if (joinBtn && modal && closeBtn) {
    joinBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("active");
    });
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });
}

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    document.querySelectorAll("#navLinks a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}




if (joinBtn) {
    joinBtn.addEventListener("click", (e) => {
        createSparkle(window.innerWidth/2, window.innerHeight/2);
    });
}

// CLICK PAR SPARKLE
document.addEventListener("click", function(e) {
    createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
    for (let i = 0; i < 10; i++) {
        let spark = document.createElement("span");
        spark.className = "spark";

        document.body.appendChild(spark);

        spark.style.left = x + "px";
        spark.style.top = y + "px";

        let size = Math.random() * 6 + 4;
        spark.style.width = size + "px";
        spark.style.height = size + "px";

        let angle = Math.random() * 360;
        let distance = Math.random() * 80 + 20;

        spark.animate([
            { transform: `translate(0,0)`, opacity: 1 },
            { transform: `translate(${Math.cos(angle)*distance}px, ${Math.sin(angle)*distance}px)`, opacity: 0 }
        ], {
            duration: 600
        });

        setTimeout(() => spark.remove(), 600);
    }
}
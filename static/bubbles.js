document.addEventListener("DOMContentLoaded", function() {
    if (typeof particlesJS !== "function") return;
    const heroes = document.querySelectorAll('section.beer-hero, .beer-hero');
    heroes.forEach((hero, index) => {
        const id = 'particles-hero-' + index;
        const div = document.createElement('div');
        div.id = id;
        div.className = 'particles-bg';
        
        // Setup hero for absolute positioning of the canvas
        hero.style.position = 'relative';
        
        // zIndex 1 for children so they sit on top of the canvas
        Array.from(hero.children).forEach(child => {
            child.style.position = 'relative';
            child.style.zIndex = '1';
        });

        hero.insertBefore(div, hero.firstChild);

        particlesJS(id, {
            "particles": {
                "number": {
                    "value": 65,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": { "enable": true, "speed": 1, "opacity_min": 0.2, "sync": false }
                },
                "size": {
                    "value": 6,
                    "random": true,
                    "anim": { "enable": true, "speed": 3, "size_min": 2, "sync": false }
                },
                "line_linked": { "enable": false },
                "move": {
                    "enable": true,
                    "speed": 2.5,
                    "direction": "top",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "repulse" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "repulse": { "distance": 90, "duration": 0.4 },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    });
});

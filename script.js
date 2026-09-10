document.addEventListener("DOMContentLoaded",()=> {
    const menuButton = document.querySelector('#menuButton');
    const menu = document.querySelector('#menu');
    const form = document.querySelector('#contactForm');
    const status = document.querySelector('#formStatus');

    menuButton.addEventListener('click', () =>{
        const isOpen = menu.classList.toggle('open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.textContent = isOpen?"Close":"Menu";
    });
    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () =>{
            menuButton.classList.remove('open');
            menuButton.setAttribute('aria-expanded', false);
            menuButton.textContent = 'Menu';
        });
    });
    const bars = document.querySelectorAll('.bar span');
    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.width = `${entry.target.dataset.level}%`;
                    observerInstance.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.4
        }
    );
    bars.forEach((bar) => observer.observe(bar));

    form.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    form.addEventListener('submit', async (event) => 
        {
        event.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if(!name || !email ||!message){
            status.textContent = 'Please fill in every field.';
            status.className = 'form-status error';
            return;
        }

        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            status.textContent = "Please enter a valid email address.";
            status.className = "form-status error";
            return;
        }
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'The message could not be sent.');
            }

            status.textContent = result.message;
            status.className = "form-status success";
            form.reset();
        } catch (error) {
            status.textContent = error.message;
            status.className = "form-status error";
        }
    });
    document.querySelector("#year").textContent = new Date().getFullYear();
});
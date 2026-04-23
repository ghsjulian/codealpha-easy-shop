 // Carousel Logic only (products are now static HTML)
        let currentIndex = 0;
        const totalSlides = 3;

        function updateDots() {
            const dotsContainer = document.getElementById('dots');
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (i === currentIndex) dot.classList.add('active');
                dot.onclick = () => goToSlide(i);
                dotsContainer.appendChild(dot);
            }
        }

        function goToSlide(index) {
            currentIndex = index;
            const slidesContainer = document.getElementById('slides');
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        window.nextSlide = function () {
            currentIndex = (currentIndex + 1) % totalSlides;
            goToSlide(currentIndex);
        };

        window.prevSlide = function () {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            goToSlide(currentIndex);
        };

        function startCarouselAutoPlay() {
            return setInterval(() => {
                nextSlide();
            }, 4800);
        }
        
         // Page initialization
        document.addEventListener('DOMContentLoaded', () => {            // keeps cart count, user section, etc.
            updateDots();
            const autoPlayInterval = startCarouselAutoPlay();
            const carousel = document.querySelector('.hero-carousel');
            carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            carousel.addEventListener('mouseleave', () => startCarouselAutoPlay());
        });
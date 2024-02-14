document.addEventListener("DOMContentLoaded", () => {
    let breakpoint;
    let getBreakpoint = function () {
        return window.getComputedStyle(document.body, ':before').content.replace(/\"/g, '');
    };
    breakpoint = getBreakpoint();

    const carousel = document.querySelectorAll('.jsCarousel') ?? [];
    carousel.forEach(initCarousel);

    function initCarousel(carousel) {
        const carouselItems = carousel.querySelectorAll('.jsCarouselItem');
        const dotsWrapper = carousel.querySelector('.jsDotsWrapper');
        const numbersWrapper = carousel.querySelector('.jsNumbersWrapper');
        const nextBtn = carousel.querySelector('#nextBtn');
        const prevBtn = carousel.querySelector('#prevBtn');
        const carouselLength = new Set([...carouselItems].map(x => x.getAttribute('data-carousel-order'))).size;
        const auto = [...carousel.classList].findIndex(x => x === 'jsCarouselWithTimer') !== -1;
        const mobileOnly = [...carousel.classList].findIndex(x => x === 'jsCarouselMobileOnly') !== -1
        const itemsDesktop = carousel.getAttribute('data-items-desktop');

        let currentIndex = 0;

        function createSliderDots() {
            let dots = [];
            for (let i = 0; i < carouselLength; i++) {
                let dot = document.createElement("div");
                dot.classList.add("slider__dot");
                dot.addEventListener("click", () => showSlide(i));
                dots.push(dot)
            }

            dots.forEach(x => dotsWrapper.appendChild(x));
        }

        function showSlide(...indexes) {
            carouselItems.forEach(item => {
                item.style.display = 'none';
            });

            let indexStringArray = [...indexes].map(x => x.toString());
            let itemsToShow = [...carouselItems].filter(x => indexStringArray.includes(x.getAttribute('data-carousel-order').toString())) ?? [];
                
            itemsToShow.forEach(x => {
                x.style.display = 'flex';
            });

            if (auto === false) {
                if (indexes.includes(0)) {
                    prevBtn.classList.remove("sliderBtn_active");
                    prevBtn.setAttribute("disabled", "true");
                } else {
                    prevBtn.classList.add("sliderBtn_active");
                    prevBtn.removeAttribute("disabled");
                }

                 if (indexes.includes(carouselLength - 1)) {
                    nextBtn.classList.remove("sliderBtn_active");
                    nextBtn.setAttribute("disabled", "true");
                } else {
                    nextBtn.classList.add("sliderBtn_active");
                    nextBtn.removeAttribute("disabled");
                }
            }

            let dots = carousel.querySelectorAll(".slider__dot");
            if (dots && dots.length > 0) {
                dots.forEach(el => el.classList.remove("slider__dot_active"));
                dots[indexes].classList.add("slider__dot_active");
            }

            if (numbersWrapper) {
                let number = document.createElement("div");
                number.textContent = `${Math.max(...indexes) + 1} / ${carouselLength}`;
                number.classList.add("slider__number");
                numbersWrapper.textContent = '';
                numbersWrapper.appendChild(number);
            }
        }

        function nextSlide() {
            if (auto) {
                currentIndex = (currentIndex + 3) % carouselLength;
                
                 if (breakpoint !== 'small') {
                    showSlide(
                        currentIndex, 
                        (currentIndex + 1) % carouselLength, 
                        (currentIndex + 2) % carouselLength
                    );
                } else {
                    showSlide(currentIndex);
                }
            } else {
                currentIndex = (currentIndex + 1) % carouselLength;
                showSlide(currentIndex);
            }
        }

        function previousSlide() {
            if (auto) {
                currentIndex = (currentIndex - 3 + carouselLength) % carouselLength;
                
                 if (breakpoint !== 'small') {
                    showSlide(
                        currentIndex, 
                        (currentIndex - 1) % carouselLength, 
                        (currentIndex - 2) % carouselLength
                    );
                } else {
                    showSlide(currentIndex);
                }
            } else {
                currentIndex = (currentIndex - 1 + carouselLength) % carouselLength;
                showSlide(currentIndex);
            }
        }

        if (dotsWrapper) {
            createSliderDots();
        }

        if (auto) {
            let timerId = setTimeout(function tick() {
                nextSlide();
                timerId = setTimeout(tick, 4000);
            }, 4000);
        }

        if (numbersWrapper) {
            let number = document.createElement("div");
            number.textContent = `1 / ${carouselLength}`;
            number.classList.add("slider__number");
            numbersWrapper.appendChild(number);
        }

        if (auto) {
             if (breakpoint !== 'small') {
                showSlide(
                    currentIndex, 
                    (currentIndex + 1) % carouselLength, 
                    (currentIndex + 2) % carouselLength
                );
            } else {
                showSlide(currentIndex);
            }
        } else {
            showSlide(currentIndex);
        }

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', previousSlide);

        window.addEventListener('resize', function () {
            breakpoint = getBreakpoint();
            if (breakpoint === 'small') {
                showSlide(currentIndex);
            }
        }, false);

        window.addEventListener('resize', () => {
            if (breakpoint !== 'small') {
                if (mobileOnly) {
                    [...carouselItems ?? []].forEach(x => {
                        x.style.display = 'flex';
                    });
                } else if (itemsDesktop !== undefined) {
                    [...carouselItems ?? []].forEach((x, index) => {
                        if (index < itemsDesktop) {
                            x.style.display = 'flex';
                        }
                    });
                }
            }
        });
    }
})

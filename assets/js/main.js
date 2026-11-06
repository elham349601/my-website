// Run all site functions after the page has fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeContactForm();
    initializeEventFilters();
    initializeDarkMode();
    initializeScrollToTop();
    initHomeCategoryFilter();
    initializeBookingForm();
    initializeEventDetails(); // Shows only the requested event on the details page
});


// Contact form validation: required fields and email format
function initializeContactForm() {
    var contactForm = document.getElementById('contactForm');
    var formAlert = document.getElementById('formAlert');

    if (!contactForm || !formAlert) return;

    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var messageInput = document.getElementById('message');

    if (!nameInput || !emailInput || !messageInput) return;

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var name = nameInput.value.trim();
        var email = emailInput.value.trim();
        var message = messageInput.value.trim();
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !message || !emailPattern.test(email)) {
            formAlert.className = 'alert alert-danger';
            formAlert.textContent = 'يرجى ملء جميع الحقول وإدخال بريد إلكتروني صحيح.';
            return;
        }

        formAlert.className = 'alert alert-success';
        formAlert.textContent = 'تم التحقق من بياناتك بنجاح، شكراً لتواصلك معنا.';
        contactForm.reset();
    });
}


//  Advanced event filtering (events page): search, category, date, and location
function initializeEventFilters() {
    var searchInput = document.getElementById('searchInput');
    var categoryFilter = document.getElementById('categoryFilter');
    var dateFilter = document.getElementById('dateFilter');
    var locationFilter = document.getElementById('locationFilter');

    var eventItems = document.querySelectorAll('.event-item');
    var noResults = document.getElementById('noResults');
    var resultsCount = document.getElementById('resultsCount');
    var resetFilters = document.getElementById('resetFilters');

    if (!searchInput || !categoryFilter || !dateFilter || !locationFilter || !noResults || !resultsCount || !resetFilters || eventItems.length === 0) {
        return;
    }

    function filterEvents() {
        var searchText = searchInput.value.trim().toLowerCase();
        var selectedCategory = categoryFilter.value;
        var selectedDate = dateFilter.value;
        var selectedLocation = locationFilter.value;
        var visibleCount = 0;

        eventItems.forEach(function (item) {
            var itemText = item.textContent.toLowerCase();
            var matchesSearch = itemText.indexOf(searchText) !== -1;
            var matchesCategory = selectedCategory === '' || item.dataset.category === selectedCategory;
            var matchesDate = selectedDate === '' || item.dataset.date === selectedDate;
            var matchesLocation = selectedLocation === '' || item.dataset.location === selectedLocation;

            if (matchesSearch && matchesCategory && matchesDate && matchesLocation) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        if (visibleCount > 0) {
            noResults.classList.add('d-none');
        } else {
            noResults.classList.remove('d-none');
        }

        resultsCount.textContent = 'عدد الفعاليات المعروضة: ' + visibleCount;
    }

    searchInput.addEventListener('input', filterEvents);
    categoryFilter.addEventListener('change', filterEvents);
    dateFilter.addEventListener('change', filterEvents);
    locationFilter.addEventListener('change', filterEvents);

    resetFilters.addEventListener('click', function () {
        searchInput.value = '';
        categoryFilter.value = '';
        dateFilter.value = '';
        locationFilter.value = '';
        filterEvents();
    });

    filterEvents();
}


// Dark mode: create the toggle button and add/remove the "dark-mode" class on body
function initializeDarkMode() {
    var navbarContainer = document.querySelector('.navbar .container');
    if (!navbarContainer || document.getElementById('themeToggle')) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'themeToggle';
    button.className = 'btn btn-outline-secondary btn-sm ms-2 me-2';
    button.textContent = '☾';
    button.title = 'تفعيل الوضع الداكن';
    button.setAttribute('aria-label', 'تفعيل الوضع الداكن');

    navbarContainer.appendChild(button);

    button.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        var isDark = document.body.classList.contains('dark-mode');

        button.textContent = isDark ? '☀' : '☾';
        button.title = isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن';
        button.setAttribute('aria-label', button.title);
    });
}


// Scroll-to-top button: appears after scrolling and returns to the top smoothly
function initializeScrollToTop() {
    if (document.querySelector('.scroll-top-btn')) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'scroll-top-btn';
    button.textContent = '↑';
    button.title = 'العودة إلى أعلى الصفحة';
    button.setAttribute('aria-label', 'العودة إلى أعلى الصفحة');

    document.body.appendChild(button);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 250) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });

    button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// Home page quick filter: show events by the selected category
function initHomeCategoryFilter() {
    var buttons = document.querySelectorAll('#homeCategoryFilter .filter-btn');
    var items = document.querySelectorAll('#latestEventsGrid .event-card-item');

    if (!buttons.length || !items.length) return;

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            buttons.forEach(function (b) {
                b.classList.remove('btn-success', 'active');
                b.classList.add('btn-outline-success');
            });
            
            this.classList.remove('btn-outline-success');
            this.classList.add('btn-success', 'active');

            var filter = this.getAttribute('data-filter');

            items.forEach(function (item) {
                var category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}


// Display only the selected event on event.html based on the ID in the URL
function initializeEventDetails() {
    var sections = document.querySelectorAll('.event-detail-section');
    if (sections.length === 0) return; 

    var urlParams = new URLSearchParams(window.location.search);
    var eventId = urlParams.get('id') || window.location.hash.replace('#', '');

    var found = false;
    sections.forEach(function (sec) {
        if (eventId && sec.id === eventId) {
            sec.style.display = 'block';
            found = true;
        } else {
            sec.style.display = 'none';
        }
    });

    if (!found && sections.length > 0) {
        sections[0].style.display = 'block';
    }
}


// Seat booking form handling: close the modal and show a confirmation message
function initializeBookingForm() {
    var bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('userName').value;
        var modalElement = document.getElementById('bookingModal');
        var modal = bootstrap.Modal.getInstance(modalElement);
        
        if (modal) {
            modal.hide();
        }
        
        alert('شكراً لك يا ' + name + '! تم تأكيد حجز مقعدك بنجاح. وسنتواصل معك قريباً عبر رقم الهاتف المرفق.');
        bookingForm.reset();
    });
}
function setupApp() {
    initializeTheme();
    renderAllPages(); // Render first to ensure elements exist
    handleUserLogin(); // Check for user name on app start
    setupNavigation();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.className = savedTheme;
}

function toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
}

function handleUserLogin() {
    const userName = localStorage.getItem('userName');
    if (!userName) {
        // If no name is found, ask for it.
        const message = `
            <p class="text-sub mb-4">Welcome to Calverse! What should we call you?</p>
            <input id="name-input" type="text" placeholder="Enter your name" class="input-field w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition text-main mb-4">
        `;
        const actions = `
            <button id="modal-save-btn" class="btn-primary w-full">Save</button>
        `;
        showModal('Welcome!', message, actions);

        document.getElementById('modal-save-btn').addEventListener('click', () => {
            const newName = document.getElementById('name-input').value;
            if (newName && newName.trim() !== '') {
                localStorage.setItem('userName', newName.trim());
                updateUIWithUserData();
                hideModal();
            }
        });
    } else {
        // If a name exists, just update the UI.
        updateUIWithUserData();
    }
}


function updateUIWithUserData() {
    const userName = localStorage.getItem('userName') || 'User';
    const userInitial = userName.charAt(0).toUpperCase();

    const userAvatar = document.getElementById('user-avatar');
    if (userAvatar) {
        userAvatar.textContent = userInitial;
    }
    
    const currentDateEl = document.getElementById('current-date');
    if(currentDateEl) currentDateEl.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const dashboardGreeting = document.querySelector('#food h2');
    if (dashboardGreeting) {
        dashboardGreeting.textContent = `Hello, ${userName}!`;
    }
    
    const settingsName = document.getElementById('user-display-name');
    if (settingsName) {
        settingsName.textContent = userName;
    }

    const settingsAvatar = document.getElementById('settings-user-avatar');
    if(settingsAvatar) {
        settingsAvatar.textContent = userInitial;
    }
}


function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-item-desktop, .nav-item-mobile, .settings-nav-item');
    const pages = document.querySelectorAll('.page');
    const headerTitle = document.getElementById('header-title');
    const pageTitles = {
        'food': 'Dashboard',
        'meal': 'Meal Analyzer',
        'recipes': 'Recipes & Cravings',
        'calculator': 'Health Calculators',
        'about': 'About Us',
        'contact': 'Contact Us',
        'faq': 'FAQ'
    };

    const updateActiveState = (pageId) => {
        pageId = pageId || 'food';
        pages.forEach(p => p.classList.toggle('active', p.id === pageId));
        if (headerTitle) {
            headerTitle.textContent = pageTitles[pageId] || 'Dashboard';
        }
        
        document.querySelectorAll('.nav-item-desktop').forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${pageId}`));
        document.querySelectorAll('.nav-item-mobile').forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${pageId}`));
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1);
            window.location.hash = pageId;
        });
    });

    window.addEventListener('hashchange', () => updateActiveState(window.location.hash.substring(1)));
    updateActiveState(window.location.hash.substring(1) || 'food');
}

function renderAllPages() {
    const userName = localStorage.getItem('userName') || 'User';
    const userInitial = userName.charAt(0).toUpperCase();
    
    document.getElementById('food').innerHTML = `
        <div class="mb-8">
            <h2 class="text-4xl font-bold text-main">Hello, ${userName}!</h2>
        </div>
        <div class="bg-card border-card p-6 rounded-2xl mb-8 glass-card">
             <h3 class="text-xl font-bold text-main mb-2">Welcome back!</h3>
             <p class="text-sub">"The only bad workout is the one that didn't happen."</p>
        </div>
        <div class="bg-card border-card p-6 rounded-2xl glass-card">
            <div class="flex items-center gap-4 mb-6">
                <i data-lucide="utensils" class="w-8 h-8 text-primary"></i>
                <div>
                    <h2 class="text-2xl font-bold text-main">Nutrition Lookup</h2>
                    <p class="text-sub">Search for a food to find its nutrition information.</p>
                </div>
            </div>
            <div class="relative mb-4">
                <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sub"></i>
                <input id="nutrition-input" type="text" placeholder="E.g., '100g Chicken Breast'" class="input-field w-full border rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none transition">
            </div>
            <button id="get-nutrition-btn" class="btn-primary w-full flex items-center justify-center"><i data-lucide="bar-chart-3" class="w-5 h-5 mr-2"></i>Analyze</button>
            <div id="nutrition-output" class="mt-8"></div>
        </div>`;
    
    document.getElementById('meal').innerHTML = `
        <div class="bg-card border-card p-6 rounded-2xl glass-card">
            <div class="flex items-center gap-4 mb-6">
                <i data-lucide="utensils-crossed" class="w-8 h-8 text-primary"></i>
                <div>
                    <h2 class="text-2xl font-bold text-main">Know Your Meal</h2>
                    <p class="text-sub">Paste a recipe URL or list ingredients to analyze your entire meal.</p>
                </div>
            </div>
            <div class="space-y-4">
                <input id="meal-url-input" type="text" placeholder="Paste a recipe URL" class="input-field w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition">
                <div class="relative"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-card"></div></div><div class="relative flex justify-center"><span class="bg-card px-2 text-sm text-sub">OR</span></div></div>
                <textarea id="meal-ingredients-input" placeholder="List ingredients (one per line or comma-separated)..." class="input-field w-full h-32 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition"></textarea>
                <button id="analyze-meal-btn" class="btn-primary w-full flex items-center justify-center"><i data-lucide="brain-circuit" class="w-5 h-5 mr-2"></i>Analyze Meal</button>
            </div>
            <div id="meal-output" class="mt-8"></div>
        </div>`;

    document.getElementById('recipes').innerHTML = `
        <div class="flex items-center gap-4 mb-6">
            <i data-lucide="notebook-pen" class="w-8 h-8 text-primary"></i>
            <div>
                <h2 class="text-2xl font-bold text-main">Recipes & Cravings</h2>
                <p class="text-sub">Find healthy recipes or alternatives to your cravings.</p>
            </div>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-card border-card p-6 rounded-xl glass-card">
                <h3 class="text-xl font-semibold mb-4 flex items-center text-main"><i data-lucide="chef-hat" class="w-6 h-6 mr-3 text-primary"></i>Recipe Generator</h3>
                <textarea id="recipe-ingredients-input" placeholder="What ingredients do you have?&#10;e.g., chicken breast, broccoli, soy sauce" class="input-field w-full h-32 border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-primary outline-none transition"></textarea>
                <button id="generate-recipe-btn" class="btn-primary w-full">Generate Recipe</button>
            </div>
            <div class="bg-card border-card p-6 rounded-xl glass-card">
                <h3 class="text-xl font-semibold mb-4 flex items-center text-main"><i data-lucide="cookie" class="w-6 h-6 mr-3 text-primary"></i>Craving Solver</h3>
                <input id="craving-input" type="text" placeholder="What are you craving? e.g., Pizza" class="input-field w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-primary outline-none transition">
                <button id="solve-craving-btn" class="btn-primary w-full">Find Healthy Alternative</button>
            </div>
        </div>
        <div id="recipe-output" class="mt-8"></div>`;

    document.getElementById('calculator').innerHTML = `<div class="flex items-center gap-4 mb-6"><i data-lucide="calculator" class="w-8 h-8 text-primary"></i><div><h2 class="text-3xl font-bold text-main">Health Calculators</h2><p class="text-sub">A suite of tools to help you track your health metrics.</p></div></div><div id="calculator-accordion" class="space-y-4"></div><div id="scroll-hint" class="hidden text-center mt-8 text-sub animate-bounce"><i data-lucide="arrow-down" class="w-6 h-6 mx-auto"></i><p>Scroll for more</p></div>`;
    
    document.getElementById('about').innerHTML = `
        <div class="bg-card border-card p-8 rounded-2xl glass-card text-center animate-fade-in">
            <h2 class="text-4xl font-bold text-main mb-4">About Calverse</h2>
            <p class="text-sub leading-relaxed max-w-2xl mx-auto">At Calverse, our mission is to make healthy living clear, accessible, and practical for everyone. Whether you're tracking calories, exploring nutritious recipes, or understanding your health metrics, Calverse gives you the tools to take control of your wellness.

We use our own trusted and verified database, built from reliable nutritional sources, to ensure that every recommendation and value you see is accurate and dependable.

Because with the right information, making better health choices becomes easier  and living a healthier, happier life becomes possible for all.</p>
        </div>`;

    document.getElementById('contact').innerHTML = `
        <div class="bg-card border-card p-8 rounded-2xl glass-card max-w-lg mx-auto animate-fade-in">
            <h2 class="text-3xl font-bold text-main mb-4 text-center">Contact Us</h2>
            <p class="text-sub mb-6 text-center">Have questions, feedback, or suggestions? We'd love to hear from you!</p>
            <form class="space-y-4" onsubmit="event.preventDefault(); showModal('Message Sent!', '<p>Thank you for your feedback. We will get back to you shortly.</p>');">
                <input type="text" placeholder="Your Name" required class="input-field w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition">
                <input type="email" placeholder="Your Email" required class="input-field w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition">
                <textarea placeholder="Your Message" required class="input-field w-full h-32 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition"></textarea>
                <button type="submit" class="btn-primary w-full">Send Message</button>
            </form>
        </div>`;

    document.getElementById('faq').innerHTML = `
        <div class="bg-card border-card p-8 rounded-2xl glass-card max-w-3xl mx-auto animate-fade-in">
            <h2 class="text-3xl font-bold text-main mb-6 text-center">Frequently Asked Questions</h2>
            <div id="faq-accordion" class="space-y-4">
                <div class="accordion-item border-card border rounded-lg">
                    <button class="accordion-header w-full text-left p-4 font-semibold flex justify-between items-center text-main"><span>How accurate is the nutrition analysis?</span><i data-lucide="chevron-down" class="transform transition-transform text-sub"></i></button>
                    <div class="accordion-content px-4 pb-4 text-sub"><p class="pt-2">Our nutrition analysis is based on our own trusted and verified database, compiled from reliable nutritional sources and standards. While we aim for high accuracy, all data should be considered an estimate. For medical or clinical decisions, we recommend consulting a certified nutritionist or healthcare professional.</p></div>
                </div>
                <div class="accordion-item border-card border rounded-lg">
                    <button class="accordion-header w-full text-left p-4 font-semibold flex justify-between items-center text-main"><span>Is my data stored?</span><i data-lucide="chevron-down" class="transform transition-transform text-sub"></i></button>
                    <div class="accordion-content px-4 pb-4 text-sub"><p class="pt-2">No, we do not track or store your personal health data. Your name is stored locally on your device for a personalized experience. All requests are securely proxied, and no sensitive information is saved on our servers. Your privacy and data safety are our top priorities.</p></div>
                </div>
                <div class="accordion-item border-card border rounded-lg">
                    <button class="accordion-header w-full text-left p-4 font-semibold flex justify-between items-center text-main"><span>Can I use this app offline?</span><i data-lucide="chevron-down" class="transform transition-transform text-sub"></i></button>
                    <div class="accordion-content px-4 pb-4 text-sub"><p class="pt-2">The health calculators and basic UI will function offline. However, any feature that requires API  (like nutrition lookup, meal analysis, and recipe generation) requires an active internet connection to communicate with our server.</p></div>
                </div>
            </div>
        </div>`;

    document.getElementById('settings-overlay').innerHTML = `
        <div class="flex items-center justify-between p-4 md:p-6 border-b border-card">
            <h2 class="text-xl font-bold text-main">Profile & Settings</h2>
            <button id="profile-close-btn" class="p-2 rounded-full hover:bg-card"><i data-lucide="x" class="text-sub"></i></button>
        </div>
        <div class="p-4 md:p-6 space-y-8">
            <div class="text-center space-y-2 relative">
                <div id="settings-user-avatar" class="w-24 h-24 rounded-full bg-primary text-text-on-primary flex items-center justify-center text-5xl font-bold border-4 border-primary-hover mx-auto">${userInitial}</div>
                <div class="flex items-center justify-center gap-2">
                    <h3 id="user-display-name" class="text-2xl font-bold text-main pt-2">${userName}</h3>
                    <button id="edit-name-btn" class="p-1 rounded-full hover:bg-card mt-2"><i data-lucide="pencil" class="w-4 h-4 text-sub"></i></button>
                </div>
                <p class="text-sub">Welcome to your health hub!</p>
            </div>

            <div class="space-y-4">
                <h4 class="font-bold text-sub px-1 text-sm uppercase tracking-wider">Settings</h4>
                <div class="flex justify-between items-center p-4 bg-card border-card border rounded-lg glass-card">
                    <div class="flex items-center">
                        <i data-lucide="sun" class="w-5 h-5 mr-4 text-sub"></i>
                        <span class="text-main">Theme</span>
                    </div>
                    <button id="theme-toggle-btn" class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-400">
                        <span class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform" id="theme-toggle-indicator"></span>
                    </button>
                </div>
            </div>

             <div class="space-y-2">
                 <h4 class="font-bold text-sub px-1 text-sm uppercase tracking-wider">Information</h4>
                 <a href="#about" class="settings-nav-item flex justify-between items-center p-4 bg-card border-card border rounded-lg hover:border-primary transition glass-card"><div class="flex items-center"><i data-lucide="info" class="w-5 h-5 mr-4 text-sub"></i><span class="text-main">About Us</span></div><i data-lucide="chevron-right" class="w-5 h-5 text-sub"></i></a>
                 <a href="#contact" class="settings-nav-item flex justify-between items-center p-4 bg-card border-card border rounded-lg hover:border-primary transition glass-card"><div class="flex items-center"><i data-lucide="mail" class="w-5 h-5 mr-4 text-sub"></i><span class="text-main">Contact Us</span></div><i data-lucide="chevron-right" class="w-5 h-5 text-sub"></i></a>
                 <a href="#faq" class="settings-nav-item flex justify-between items-center p-4 bg-card border-card border rounded-lg hover:border-primary transition glass-card"><div class="flex items-center"><i data-lucide="help-circle" class="w-5 h-5 mr-4 text-sub"></i><span class="text-main">FAQ</span></div><i data-lucide="chevron-right" class="w-5 h-5 text-sub"></i></a>
             </div>
            <footer class="text-center mt-12 text-sub text-sm">Made with ❤️ by <a href="https://www.instagram.com/ashutosh8877" target="_blank" class="text-primary font-bold hover:underline">Ashutosh Roy</a></footer>
        </div>`;
    
    document.getElementById('profile-close-btn').addEventListener('click', () => {
        document.getElementById('settings-overlay').classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
    });
    document.getElementById('profile-avatar-btn').addEventListener('click', () => {
        document.getElementById('settings-overlay').classList.remove('translate-x-full');
        document.body.classList.add('overflow-hidden');
    });
    document.querySelectorAll('.settings-nav-item').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('settings-overlay').classList.add('translate-x-full');
            document.body.classList.remove('overflow-hidden');
        });
    });
    document.getElementById('modal-close-btn').addEventListener('click', hideModal);
    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
        toggleTheme();
        updateThemeToggleUI();
    });
    updateThemeToggleUI();
    setupSettingsLogic();
    setupFeatureLogic();
}

function updateThemeToggleUI() {
    const isDark = document.documentElement.classList.contains('dark');
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const indicator = document.getElementById('theme-toggle-indicator');
    const themeIcon = document.querySelector('#settings-overlay i[data-lucide="sun"], #settings-overlay i[data-lucide="moon"]');
    
    if (isDark) {
        toggleBtn.classList.remove('bg-gray-400');
        toggleBtn.classList.add('bg-primary');
        indicator.style.transform = 'translateX(1.25rem)';
        if(themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
    } else {
        toggleBtn.classList.add('bg-gray-400');
        toggleBtn.classList.remove('bg-primary');
        indicator.style.transform = 'translateX(0.125rem)';
        if(themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function setupSettingsLogic() {
    const editNameBtn = document.getElementById('edit-name-btn');
    if (editNameBtn) {
        editNameBtn.addEventListener('click', () => {
            const currentName = localStorage.getItem('userName') || 'User';
            const message = `
                <input id="name-input" type="text" value="${currentName}" class="input-field w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition text-main mb-4">
            `;
            const actions = `
                <button id="modal-cancel-btn" class="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg w-1/2">Cancel</button>
                <button id="modal-save-btn" class="btn-primary w-1/2">Save</button>
            `;
            showModal('Edit Name', message, actions);

            document.getElementById('modal-save-btn').addEventListener('click', () => {
                const newName = document.getElementById('name-input').value;
                if (newName && newName.trim() !== '') {
                    localStorage.setItem('userName', newName.trim());
                    updateUIWithUserData();
                    hideModal();
                }
            });
            document.getElementById('modal-cancel-btn').addEventListener('click', hideModal);
        });
    }
}

/**
 * Parses a nutrient string (e.g., "25g", "100mg", "5.5") into a number.
 * @param {string | number} value The nutrient value to parse.
 * @returns {number} The parsed numeric value, or 0 if invalid.
 */
function parseNutrientValue(value) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}

/**
 * Sums up the nutritional data from an array of individual food items.
 * @param {Array<Object>} nutritionResults Array of nutrition data objects from the API.
 * @returns {Object} An aggregated nutrition object.
 */
function sumNutritionData(nutritionResults) {
    const total = {
        calories: 0, totalFat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0,
        sodium: 0, totalCarbohydrate: 0, dietaryFiber: 0, totalSugars: 0,
        protein: 0, vitaminD: 0, calcium: 0, iron: 0, potassium: 0
    };

    nutritionResults.forEach(result => {
        if (result && typeof result === 'object') {
            for (const key in total) {
                total[key] += parseNutrientValue(result[key]);
            }
        }
    });

    // Format the summed values back into strings with units
    return {
        foodItem: "Total Meal Nutrition",
        servingSize: "1 serving",
        calories: total.calories.toFixed(0),
        totalFat: `${total.totalFat.toFixed(1)}g`,
        saturatedFat: `${total.saturatedFat.toFixed(1)}g`,
        transFat: `${total.transFat.toFixed(1)}g`,
        cholesterol: `${total.cholesterol.toFixed(0)}mg`,
        sodium: `${total.sodium.toFixed(0)}mg`,
        totalCarbohydrate: `${total.totalCarbohydrate.toFixed(1)}g`,
        dietaryFiber: `${total.dietaryFiber.toFixed(1)}g`,
        totalSugars: `${total.totalSugars.toFixed(1)}g`,
        protein: `${total.protein.toFixed(1)}g`,
        vitaminD: `${total.vitaminD.toFixed(0)}mcg`,
        calcium: `${total.calcium.toFixed(0)}mg`,
        iron: `${total.iron.toFixed(1)}mg`,
        potassium: `${total.potassium.toFixed(0)}mg`,
    };
}


function setupFeatureLogic() {
    const calculators = [
        { id: 'bmi', name: 'BMI ', icon: 'ruler', fields: [{id: 'height', placeholder: 'Height (cm)', type: 'number'}, {id: 'weight', placeholder: 'Weight (kg)', type: 'number'}], func: 'calculateBMI' },
        { id: 'bmr', name: 'BMR ', icon: 'flame', fields: [{id: 'age', placeholder: 'Age', type: 'number'}, {id: 'gender', type: 'select', options: ['Male', 'Female']}, {id: 'height', placeholder: 'Height (cm)', type: 'number'}, {id: 'weight', placeholder: 'Weight (kg)', type: 'number'}], func: 'calculateBMR' },
        { id: 'bf', name: 'Body Fat ', icon: 'percent', fields: [{id: 'gender', type: 'select', options: ['Male', 'Female']}, {id: 'height', placeholder: 'Height (cm)', type: 'number'}, {id: 'weight', placeholder: 'Weight (kg)', type: 'number'}, {id: 'neck', placeholder: 'Neck (cm)', type: 'number'}, {id: 'waist', placeholder: 'Waist (cm)', type: 'number'}, {id: 'hip', placeholder: 'Hip (cm) (Females)', type: 'number'}], func: 'calculateBodyFat' },
        { id: 'iw', name: 'Ideal Weight ', icon: 'target', fields: [ {id: 'gender', type: 'select', options: ['Male', 'Female']}, {id: 'height', placeholder: 'Height (cm)', type: 'number'} ], func: 'calculateIdealWeight' },
        { id: 'lbm', name: 'Lean Body Mass ', icon: 'bone', fields: [ {id: 'gender', type: 'select', options: ['Male', 'Female']}, {id: 'height', placeholder: 'Height (cm)', type: 'number'}, {id: 'weight', placeholder: 'Weight (kg)', type: 'number'} ], func: 'calculateLBM' },
        { id: 'protein', name: 'Protein Intake ', icon: 'drumstick', fields: [ {id: 'weight', placeholder: 'Weight (kg)', type: 'number'}, {id: 'activity', type: 'select', options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extra Active']} ], func: 'calculateProtein' },
        { id: 'calories', name: 'Maintenance Calorie ', icon: 'gauge-circle', fields: [ {id: 'age', placeholder: 'Age', type: 'number'}, {id: 'gender', type: 'select', options: ['Male', 'Female']}, {id: 'height', placeholder: 'Height (cm)', type: 'number'}, {id: 'weight', placeholder: 'Weight (kg)', type: 'number'}, {id: 'activity', type: 'select', options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extra Active']} ], func: 'calculateMaintenanceCalories' },
        { id: 'cycle', name: 'Period & Ovulation ', icon: 'calendar-heart', fields: [ {id: 'last-period', placeholder: 'First Day of Last Period', type: 'date'}, {id: 'cycle-length', placeholder: 'Avg. Cycle Length', type: 'number', value: 28} ], func: 'calculateCycle' },
    ];
    const accordionContainer = document.getElementById('calculator-accordion');
    if(accordionContainer) {
        accordionContainer.innerHTML = calculators.map(calc => `
            <div class="accordion-item border-card border rounded-lg glass-card"><button class="accordion-header w-full text-left p-4 font-semibold text-lg flex justify-between items-center transition-colors hover:text-primary text-main"><span class="flex items-center"><i data-lucide="${calc.icon}" class="w-5 h-5 mr-3"></i> ${calc.name}</span><i data-lucide="chevron-down" class="transform transition-transform text-sub"></i></button><div class="accordion-content px-4 pb-4"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">${calc.fields.map(f => f.type === 'select' ? `<select id="${calc.id}-${f.id}" class="input-field w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary transition text-main">${f.options.map(o => `<option value="${o.toLowerCase().replace(/ /g, '-')}">${o}</option>`).join('')}</select>` : `<input type="${f.type === 'date' ? 'text' : f.type}" onfocus="${f.type === 'date' ? "(this.type='date')" : ''}" onblur="${f.type === 'date' ? "(this.type='text')" : ''}" id="${calc.id}-${f.id}" placeholder="${f.placeholder}" ${f.value ? `value="${f.value}"` : ''} class="input-field w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary transition text-main">`).join('')}</div><button data-func="${calc.func}" class="calculator-btn mt-4 btn-primary">Calculate</button></div></div>`).join('');
    }
    
    // This logic now applies to ALL accordions, including the new FAQ one.
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const content = header.nextElementSibling;
            const icon = header.querySelector('i[data-lucide="chevron-down"]');
            const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

            // Close other accordions in the same group
            const parentContainer = accordionItem.parentElement;
            parentContainer.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== accordionItem) {
                    item.querySelector('.accordion-content').style.maxHeight = null;
                    const otherIcon = item.querySelector('i[data-lucide="chevron-down"]');
                    if(otherIcon) otherIcon.classList.remove('rotate-180');
                }
            });

            if (isOpen) {
                content.style.maxHeight = null;
                if(icon) icon.classList.remove('rotate-180');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                if(icon) icon.classList.add('rotate-180');
            }
        });
    });
    
    document.querySelectorAll('.calculator-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const funcName = e.target.dataset.func;
            if(window[funcName]) {
                window[funcName]();
            }
        });
    });

    checkScrollHint();
    window.addEventListener('resize', checkScrollHint);
    
    const getNutritionBtn = document.getElementById('get-nutrition-btn');
    const nutritionInput = document.getElementById('nutrition-input');
    const nutritionOutput = document.getElementById('nutrition-output');
    const handleGetNutrition = async () => {
        if (!nutritionInput.value.trim()) return;
        setLoadingState(getNutritionBtn, true, 'Analyzing...');
        nutritionOutput.innerHTML = getSkeletonHTML('nutrition');
        const prompt = `Analyze nutrition for "${nutritionInput.value}". Return ONLY a JSON object with keys: foodItem, servingSize, calories (number), totalFat, saturatedFat, transFat, cholesterol, sodium, totalCarbohydrate, dietaryFiber, totalSugars, protein, vitaminD, calcium, iron, potassium. Use "N/A" for unknowns.`;
        const result = await callGeminiApi(prompt);
        if (result) {
            try {
                const jsonData = JSON.parse(result.match(/\{[\s\S]*\}/)[0]);
                nutritionOutput.innerHTML = renderNutritionLabel(jsonData); 
            } catch(e) { nutritionOutput.innerHTML = `<p class="text-red-400 text-center">Could not parse nutrition data. Try a more specific query.</p>`; }
        } else { nutritionOutput.innerHTML = `<p class="text-red-400 text-center">Could not retrieve nutrition data. Please try again.</p>`; }
        setLoadingState(getNutritionBtn, false, `<i data-lucide="bar-chart-3" class="w-5 h-5 mr-2"></i>Analyze`);
    };
    getNutritionBtn.addEventListener('click', handleGetNutrition);
    nutritionInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleGetNutrition());

    const analyzeMealBtn = document.getElementById('analyze-meal-btn');
    const mealOutput = document.getElementById('meal-output');
    analyzeMealBtn.addEventListener('click', async () => {
        const url = document.getElementById('meal-url-input').value.trim();
        const ingredientsText = document.getElementById('meal-ingredients-input').value.trim();
        
        let ingredientsList;
        let originalMealInput;

        if (url) {
            // If a URL is provided, we treat it as a single item for analysis.
            ingredientsList = [url];
            originalMealInput = `URL: ${url}`;
        } else if (ingredientsText) {
            // Split by both newlines and commas, then flatten the array.
            ingredientsList = ingredientsText
                .split(/[\n,]+/) // Split by one or more newlines or commas
                .map(item => item.trim()) // Trim whitespace from each item
                .filter(item => item.length > 0); // Remove any empty items
            originalMealInput = `Ingredients: ${ingredientsText}`;
        } else {
            return; // No input provided.
        }

        if (ingredientsList.length === 0) {
            showModal('Error', 'Please enter at least one ingredient.');
            return;
        }

        setLoadingState(analyzeMealBtn, true, `Analyzing ${ingredientsList.length} item(s)...`);
        mealOutput.innerHTML = getSkeletonHTML('meal');

        // --- Step 1: Fetch Nutrition Data for each ingredient ---
        const nutritionPromises = ingredientsList.map(ingredient => {
            const prompt = `You are a nutrition calculator. Analyze the nutrition for this single item: "${ingredient}". Return ONLY a single JSON object with the required keys: calories (number), totalFat, saturatedFat, transFat, cholesterol, sodium, totalCarbohydrate, dietaryFiber, totalSugars, protein, vitaminD, calcium, iron, and potassium. Use "N/A" or 0 for unknown values. For example: { "calories": 165, "protein": "31g", ... }`;
            return callGeminiApi(prompt, 'meal');
        });

        try {
            const results = await Promise.all(nutritionPromises);
            
            const nutritionData = results.map(res => {
                if (!res) return null;
                try {
                    const jsonMatch = res.match(/\{[\s\S]*\}/);
                    if (!jsonMatch) return null;
                    return JSON.parse(jsonMatch[0]);
                } catch (e) {
                    console.error('Failed to parse individual ingredient:', e);
                    return null;
                }
            }).filter(Boolean); // Filter out nulls from failed parses

            if (nutritionData.length === 0) {
                throw new Error("Could not retrieve nutritional data for any of the ingredients. Please check your input and try again.");
            }

            // --- Step 2: Sum the data and render the label ---
            const totalNutrition = sumNutritionData(nutritionData);
            mealOutput.innerHTML = renderNutritionLabel(totalNutrition, 'Total Meal Nutrition');

            // --- Step 3: Fetch Suggestions ---
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.id = 'suggestions-container';
            suggestionsContainer.innerHTML = getSkeletonHTML('recipe');
            mealOutput.appendChild(suggestionsContainer);

            setLoadingState(analyzeMealBtn, true, 'Getting Suggestions...');

            const suggestionsPrompt = `Based on the meal ingredients "${originalMealInput}", provide helpful suggestions. Return ONLY a single JSON object with a key "suggestions" which contains two string properties: "taste" and "health".`;
            const suggestionsResult = await callGeminiApi(suggestionsPrompt, 'meal');

            if (suggestionsResult) {
                try {
                    const jsonMatch = suggestionsResult.match(/\{[\s\S]*\}/);
                    if (!jsonMatch) throw new Error("No JSON object in suggestions response.");
                    const suggestionsData = JSON.parse(jsonMatch[0]);
                    
                    const suggestionsHtml = `
                        <div class="mt-8 bg-card p-6 rounded-xl border border-card glass-card">
                            <h3 class="text-xl font-semibold mb-4 flex items-center text-main"><i data-lucide="lightbulb" class="w-6 h-6 mr-3 text-primary"></i>AI Suggestions</h3>
                            <div class="space-y-4">
                                <div>
                                    <h4 class="font-bold text-primary">Taste Improvement:</h4>
                                    <p class="text-sub">${suggestionsData.suggestions.taste ?? 'No suggestions available.'}</p>
                                </div>
                                <div>
                                    <h4 class="font-bold text-green-400">Health Improvement:</h4>
                                    <p class="text-sub">${suggestionsData.suggestions.health ?? 'No suggestions available.'}</p>
                                </div>
                            </div>
                        </div>`;
                    suggestionsContainer.innerHTML = suggestionsHtml;
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                } catch (e) {
                    console.error("Suggestion parsing error:", e);
                    suggestionsContainer.innerHTML = `<p class="text-red-400 text-center mt-4">Could not parse suggestions.</p>`;
                }
            } else {
                suggestionsContainer.innerHTML = `<p class="text-red-400 text-center mt-4">Could not retrieve suggestions.</p>`;
            }

        } catch (error) {
            mealOutput.innerHTML = `<p class="text-red-400 text-center">${error.message}</p>`;
        } finally {
            setLoadingState(analyzeMealBtn, false, `<i data-lucide="brain-circuit" class="w-5 h-5 mr-2"></i> Analyze Meal`);
        }
    });
    
    const recipeOutput = document.getElementById('recipe-output');
    const setupRecipeButton = (btnId, inputId, promptFn) => {
        const btn = document.getElementById(btnId);
        btn.addEventListener('click', async () => {
            const input = document.getElementById(inputId).value.trim();
            if (!input) return;
            const originalText = btn.innerHTML;
            setLoadingState(btn, true, 'Generating...');
            recipeOutput.innerHTML = getSkeletonHTML('recipe');
            const result = await callGeminiApi(promptFn(input));
            if (result) { recipeOutput.innerHTML = `<div class="bg-card border-card border p-4 md:p-6 rounded-xl ai-content glass-card">${formatAiText(result)}</div>`; } 
            else { recipeOutput.innerHTML = `<p class="text-red-400 text-center">Could not generate a response. Please try again.</p>`; }
            setLoadingState(btn, false, originalText);
        });
    };
    setupRecipeButton('generate-recipe-btn', 'recipe-ingredients-input', (i) => `Create a healthy recipe using: ${i}. Be concise. Use markdown for formatting: '### Title', '### Ingredients', '### Instructions'. Use '*' for list items.`);
    setupRecipeButton('solve-craving-btn', 'craving-input', (c) => `I'm craving ${c}. Suggest a healthy alternative recipe. Be concise and start directly with the recipe. Use markdown for formatting: '### Title', '### Why It\\'s Healthier', '### Ingredients', '### Instructions'. Use '*' for list items.`);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

async function callGeminiApi(prompt, type = 'general') {
    // The API call now goes to our own serverless function.
    const API_URL = '/api/gemini-proxy'; 
    try {
        const response = await fetch(API_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            // Send the prompt and type in the body
            body: JSON.stringify({ prompt, type }) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            const errorMessage = errorData.error?.message || `API request failed: ${response.status}`;
            if (response.status === 429) {
                 showModal("API Limit Reached", "The request limit for the API key has been reached. Please try again later.");
            } else {
                showModal("API Error", `An error occurred: ${errorMessage}`);
            }
            return null;
        }

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
            return data.candidates[0].content.parts[0].text;
        }
        throw new Error("No content returned from API.");
    } catch (error) {
        console.error('Failed to call serverless function:', error);
        showModal("Function Error", "An error occurred while communicating with the server. Please retry ");
        return null;
    }
}


function checkScrollHint() {
    const calcPage = document.getElementById('calculator');
    const scrollHint = document.getElementById('scroll-hint');
    if (calcPage && scrollHint) {
        const isScrollable = calcPage.scrollHeight > calcPage.clientHeight;
        scrollHint.classList.toggle('hidden', !isScrollable);
    }
}

const dailyValues = {
    totalFat: 78,
    saturatedFat: 20,
    cholesterol: 300,
    sodium: 2300,
    totalCarbohydrate: 275,
    dietaryFiber: 28,
    protein: 50,
    calcium: 1300,
    iron: 18,
    potassium: 4700,
    vitaminD: 20
};

const renderNutritionLabel = (data, customTitle = null) => {
    // Guard clause to ensure data is a valid object before rendering
    if (!data || typeof data !== 'object') {
        return `<div class="nutrition-label glass-card"><p class="text-red-400 text-center">No valid nutrition data was provided.</p></div>`;
    }

    const getDV = (key, value) => {
        if (dailyValues[key] && parseFloat(value) > 0) {
            const dv = (parseFloat(value) / dailyValues[key]) * 100;
            return `<span class="dv">${dv.toFixed(0)}%</span>`;
        }
        return '';
    };

    const labelTitle = customTitle ?? data.foodItem ?? 'N/A';

    return `<div class="nutrition-label glass-card">
        <div class="header">
            <h1 class="capitalize text-main">${labelTitle}</h1>
            <div class="text-sub">Serving Size ${data.servingSize ?? 'N/A'}</div>
        </div>
        <div class="item">
            <span class="text-main">Calories</span> 
            <span class="text-2xl font-bold text-main">${data.calories ?? 'N/A'}</span>
        </div>
        <div class="item text-right text-sub text-sm font-bold">
             % Daily Value*
        </div>
        <div class="item"><span class="text-main">Total Fat</span> <span><span class="text-main">${data.totalFat ?? 'N/A'}</span> ${getDV('totalFat', data.totalFat)}</span></div>
        <div class="item indent"><span class="text-sub">Saturated Fat</span> <span><span class="text-sub">${data.saturatedFat ?? 'N/A'}</span> ${getDV('saturatedFat', data.saturatedFat)}</span></div>
        <div class="item indent"><span class="text-sub">Trans Fat</span> <span class="text-sub">${data.transFat ?? 'N/A'}</span></div>
        <div class="item"><span class="text-main">Cholesterol</span> <span><span class="text-main">${data.cholesterol ?? 'N/A'}</span> ${getDV('cholesterol', data.cholesterol)}</span></div>
        <div class="item"><span class="text-main">Sodium</span> <span><span class="text-main">${data.sodium ?? 'N/A'}</span> ${getDV('sodium', data.sodium)}</span></div>
        <div class="item"><span class="text-main">Total Carbohydrate</span> <span><span class="text-main">${data.totalCarbohydrate ?? 'N/A'}</span> ${getDV('totalCarbohydrate', data.totalCarbohydrate)}</span></div>
        <div class="item indent"><span class="text-sub">Dietary Fiber</span> <span><span class="text-sub">${data.dietaryFiber ?? 'N/A'}</span> ${getDV('dietaryFiber', data.dietaryFiber)}</span></div>
        <div class="item indent"><span class="text-sub">Total Sugars</span> <span class="text-sub">${data.totalSugars ?? 'N/A'}</span></div>
        <div class="item"><span class="text-main">Protein</span> <span><span class="text-main">${data.protein ?? 'N/A'}</span> ${getDV('protein', data.protein)}</span></div>
        <div class="footer">
            <div class="item"><span class="text-main">Vitamin D</span> <span><span class="text-main">${data.vitaminD ?? 'N/A'}</span> ${getDV('vitaminD', data.vitaminD)}</span></div>
            <div class="item"><span class="text-main">Calcium</span> <span><span class="text-main">${data.calcium ?? 'N/A'}</span> ${getDV('calcium', data.calcium)}</span></div>
            <div class="item"><span class="text-main">Iron</span> <span><span class="text-main">${data.iron ?? 'N/A'}</span> ${getDV('iron', data.iron)}</span></div>
            <div class="item"><span class="text-main">Potassium</span> <span><span class="text-main">${data.potassium ?? 'N/A'}</span> ${getDV('potassium', data.potassium)}</span></div>
        </div>
        <p class="text-xs text-sub mt-4">*The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</p>
    </div>`;
};

const getSkeletonHTML = (type) => {
    if (type === 'nutrition' || type === 'meal') {
        return `<div class="nutrition-label glass-card skeleton"><div class="header"><div class="skeleton-title bg-gray-700 rounded"></div><div class="skeleton-line w-1/3 mt-2 bg-gray-700 rounded"></div></div><div class="space-y-4 mt-4"><div class="skeleton-line bg-gray-700 rounded"></div><div class="skeleton-line bg-gray-700 rounded"></div><div class="skeleton-line w-2/3 bg-gray-700 rounded ml-6"></div><div class="skeleton-line w-1/2 bg-gray-700 rounded"></div></div></div>`;
    }
    if (type === 'recipe') {
        return `<div class="bg-card border-card border p-6 rounded-xl glass-card skeleton"><div class="space-y-4"><div class="skeleton-title bg-gray-700 rounded"></div><div class="skeleton-line bg-gray-700 rounded"></div><div class="skeleton-line w-5/6 bg-gray-700 rounded"></div><div class="skeleton-line w-2/3 bg-gray-700 rounded"></div></div></div>`;
    }
    return '';
};
const formatAiText = (text) => text.replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/^\* (.*$)/gim, '<li>$1</li>').replace(/<\/li><li>/g, '</li></ul><ul><li>').replace(/<\/li>([^<])/g, '</li></ul>$1').replace(/^<li>/g, '<ul><li>').replace(/<\/li>$/g, '</li></ul>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>').replace(/<br><ul>/g, '<ul>').replace(/<\/ul><br>/g, '</ul>').replace(/\*|#|\*\*\*/g, '');

const modal = document.getElementById('custom-modal');
function showModal(title, messageHTML, actionsHTML = '') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').innerHTML = messageHTML;
    const actionsContainer = document.getElementById('modal-actions');
    if (actionsHTML) {
        actionsContainer.innerHTML = actionsHTML;
        // Re-attach listener for close button if it's custom
        const closeBtn = document.getElementById('modal-cancel-btn');
        if (closeBtn) closeBtn.addEventListener('click', hideModal);
    } else {
        actionsContainer.innerHTML = `<button id="modal-close-btn" class="btn-primary w-full">Close</button>`;
        document.getElementById('modal-close-btn').addEventListener('click', hideModal);
    }
    modal.classList.add('show');
    setTimeout(() => modal.querySelector('div').classList.add('scale-100'), 10);
}
function hideModal() {
    modal.querySelector('div').classList.remove('scale-100');
    setTimeout(() => modal.classList.remove('show'), 200);
}

function setLoadingState(button, isLoading, loadingText) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = `<span class="flex items-center justify-center"><i data-lucide="loader-circle" class="animate-spin mr-2"></i> ${loadingText}</span>`;
    } else {
        button.disabled = false;
        button.innerHTML = loadingText;
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

window.calculateBMI = () => {
    const h = document.getElementById('bmi-height').value;
    const w = document.getElementById('bmi-weight').value;
    if (h > 0 && w > 0) {
        const bmi = (w / ((h / 100) ** 2)).toFixed(1);
        let c = '';
        if (bmi < 18.5) c = 'Underweight';
        else if (bmi < 25) c = 'Normal';
        else if (bmi < 30) c = 'Overweight';
        else c = 'Obesity';
        showModal('BMI Result', `<p class="text-2xl font-bold text-center">${bmi}</p><p class="text-sub text-center">${c}</p>`);
    } else {
        showModal('Error', `<p class="text-red-400 text-center">Please enter valid values.</p>`);
    }
};

window.calculateBMR = () => {
    const a = document.getElementById('bmr-age').value;
    const g = document.getElementById('bmr-gender').value;
    const h = document.getElementById('bmr-height').value;
    const w = document.getElementById('bmr-weight').value;
    if (a > 0 && h > 0 && w > 0) {
        let bmr = g === 'male' ? (88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)) : (447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a));
        showModal('BMR Result', `<p class="text-2xl font-bold text-center">${bmr.toFixed(0)}</p><p class="text-sub text-center">calories/day</p>`);
    } else {
        showModal('Error', `<p class="text-red-400 text-center">Please fill all fields.</p>`);
    }
};

window.calculateBodyFat = () => {
    const g = document.getElementById('bf-gender').value;
    const h = document.getElementById('bf-height').value;
    const w = document.getElementById('bf-weight').value;
    const n = document.getElementById('bf-neck').value;
    const wa = document.getElementById('bf-waist').value;
    const hi = document.getElementById('bf-hip').value;
    if (h <= 0 || w <= 0 || n <= 0 || wa <= 0) {
        showModal('Error', `<p class="text-red-400 text-center">Fill required fields.</p>`);
        return;
    }
    let bfp = 0;
    if (g === 'male') {
        bfp = 495 / (1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
        if (hi <= 0) {
            showModal('Error', `<p class="text-red-400 text-center">Hip measurement is required for females.</p>`);
            return;
        }
        bfp = 495 / (1.29579 - 0.35004 * Math.log10(parseFloat(wa) + parseFloat(hi) - n) + 0.22100 * Math.log10(h)) - 450;
    }
    if (bfp > 0 && bfp < 100) {
        showModal('Body Fat Result', `<p class="text-2xl font-bold text-center">${bfp.toFixed(1)}%</p><p class="text-sub text-center">Body Fat</p>`);
    } else {
        showModal('Error', `<p class="text-red-400 text-center">Could not calculate based on measurements.</p>`);
    }
};

window.calculateIdealWeight = () => {
    const g = document.getElementById('iw-gender').value;
    const h = document.getElementById('iw-height').value;
    if (h <= 152) {
        showModal('Error', `<p class="text-red-400 text-center">Height must be greater than 152cm.</p>`);
        return;
    }
    let base = g === 'male' ? 50 : 45.5;
    const iw = base + (((h / 2.54) - 60) * 2.3);
    showModal('Ideal Weight Result', `<p class="text-2xl font-bold text-center">${iw.toFixed(1)} kg</p>`);
};

window.calculateLBM = () => {
    const g = document.getElementById('lbm-gender').value;
    const h = document.getElementById('lbm-height').value;
    const w = document.getElementById('lbm-weight').value;
    if (h <= 0 || w <= 0) {
        showModal('Error', `<p class="text-red-400 text-center">Please enter valid values.</p>`);
        return;
    }
    let lbm = g === 'male' ? (0.407 * w) + (0.267 * h) - 19.2 : (0.252 * w) + (0.473 * h) - 48.3;
    showModal('Lean Body Mass Result', `<p class="text-2xl font-bold text-center">${lbm.toFixed(1)} kg</p>`);
};

window.calculateProtein = () => {
    const w = document.getElementById('protein-weight').value;
    const act = document.getElementById('protein-activity').value;
    if (w <= 0) {
        showModal('Error', 'Please enter a valid weight.');
        return;
    }
    const factors = { 'sedentary': 0.8, 'lightly-active': 1.2, 'moderately-active': 1.5, 'very-active': 1.8, 'extra-active': 2.2 };
    const protein = w * factors[act];
    showModal('Protein Intake', `<p class="text-2xl font-bold text-center">${protein.toFixed(0)} g</p><p class="text-sub text-center">per day</p>`);
};

window.calculateMaintenanceCalories = () => {
    const a = document.getElementById('calories-age').value;
    const g = document.getElementById('calories-gender').value;
    const h = document.getElementById('calories-height').value;
    const w = document.getElementById('calories-weight').value;
    const act = document.getElementById('calories-activity').value;
    if (a <= 0 || h <= 0 || w <= 0) {
        showModal('Error', 'Please fill all fields.');
        return;
    }
    let bmr = g === 'male' ? (88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)) : (447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a));
    const factors = { 'sedentary': 1.2, 'lightly-active': 1.375, 'moderately-active': 1.55, 'very-active': 1.725, 'extra-active': 1.9 };
    const tdee = bmr * factors[act];
    showModal('Maintenance Calories', `<p class="text-2xl font-bold text-center">${tdee.toFixed(0)}</p><p class="text-sub text-center">calories/day</p>`);
};

window.calculateCycle = () => {
    const dStr = document.getElementById('cycle-last-period').value;
    const c = parseInt(document.getElementById('cycle-cycle-length').value);
    if (!dStr || isNaN(c) || c < 20 || c > 45) {
        showModal('Error', `<p class="text-red-400 text-center">Please enter a valid date and cycle length.</p>`);
        return;
    }
    const d = new Date(dStr.replace(/-/g, '\/'));
    const o = new Date(d);
    o.setDate(d.getDate() + c - 14);
    const fs = new Date(o);
    fs.setDate(o.getDate() - 5);
    const fe = new Date(o);
    fe.setDate(o.getDate() + 1);
    const np = new Date(d);
    np.setDate(d.getDate() + c);
    const fDate = (dt) => dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    showModal('Cycle Estimate', `<p class="font-bold mt-2 text-center text-red-400">${fDate(np)}</p><p class="text-sub text-center">Next Period Start</p><p class="font-bold mt-4 text-center text-green-400">${fDate(o)}</p><p class="text-sub text-center">Estimated Ovulation</p><p class="font-bold mt-4 text-center">${fDate(fs)} - ${fDate(fe)}</p><p class="text-sub text-center">Fertile Window</p>`);
};


window.onload = () => {
    const preloader = document.getElementById('preloader');
    const appContainer = document.getElementById('app-container');
    
    setupApp();

    setTimeout(() => {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.addEventListener('transitionend', () => {
                preloader.style.display = 'none';
            });
        }
        if (appContainer) {
            appContainer.style.visibility = 'visible';
            appContainer.style.opacity = '1';
        }
    }, 2000); 
};

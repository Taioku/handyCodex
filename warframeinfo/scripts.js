// Utility functions
const formatDuration = (milliseconds) => {
    if (milliseconds < 0) return 'Expired';
    
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.length > 0 ? parts.join(' ') : '0s';
};

const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const now = Date.now();
    const itemDate = new Date(dateString).getTime();
    const timeDiff = now - itemDate; // This will be positive for past dates
    
    if (timeDiff < 0) return 'In the future'; // Just in case
    
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (seconds > 30) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    
    return 'Just now';
};

const updateTimer = (element, expiryTime) => {
    const now = Date.now();
    const expiryDate = new Date(expiryTime);
    const timeLeft = expiryDate.getTime() - now;
    
    // Debug logging for Baro Ki'Teer timer issues
    if (element.closest('.card')?.textContent?.includes('Baro Ki\'Teer')) {
        console.log('Baro Timer Debug:', {
            now: new Date(now).toISOString(),
            expiry: expiryDate.toISOString(),
            expiryTime: expiryTime,
            timeLeft: timeLeft,
            timeLeftFormatted: formatDuration(timeLeft)
        });
    }
    
    element.textContent = formatDuration(timeLeft);
    element.classList.toggle('expired', timeLeft < 0);
};

// Collapsible sidebar functionality
const initializeSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mainContent = document.getElementById('mainContent');

    const openSidebar = () => {
        sidebar.classList.add('open');
        menuToggle.classList.add('active');
        sidebarOverlay.classList.add('active');
        mainContent.classList.add('sidebar-open');
        document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
        sidebar.classList.remove('open');
        menuToggle.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        mainContent.classList.remove('sidebar-open');
        document.body.style.overflow = '';
    };

    // Toggle sidebar when menu button is clicked
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    // Close sidebar when overlay is clicked
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });

    // Handle window resize - close sidebar on larger screens if needed
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && sidebar.classList.contains('open')) {
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
};

// Theme Management System
const ThemeManager = {
    themes: {
        narmer: {
            light: {
                '--color-bg': '#3c2f2f',
                '--color-bg2': '#4b3832',
                '--color-panel': '#fff4e6',
                '--color-accent': '#be9b7b',
                '--color-accent2': '#854442',
                '--color-text': '#3c2f2f',
                '--color-text-light': '#fff4e6',
                '--color-text-accent': '#854442',
                '--color-bell-glow': '#000',
                '--color-bell-glow2': '#fff'
            },
            dark: {
                '--color-bg': '#1a1412',
                '--color-bg2': '#3e312a',
                '--color-panel': '#2a211e',
                '--color-accent': '#be9b7b',
                '--color-accent2': '#be9b7b',
                '--color-text': '#fff4e6',
                '--color-text-light': '#fff4e6',
                '--color-text-accent': '#be9b7b',
                '--color-bell-glow': '#ff0',        
                '--color-bell-glow2': '#fff'       
            }
        }
    },

    currentTheme: 'narmer',
    isDarkMode: true,

    init() {
        this.loadSettings();
        this.bindEvents();
        this.applyTheme();
        
        // Force update UI after everything is loaded
        setTimeout(() => {
            this.updateUIControls();
        }, 500);
    },

    loadSettings() {
        const savedTheme = localStorage.getItem('warframeChecklistPalette');
        const savedDarkMode = localStorage.getItem('warframeChecklistPaletteDark');
        
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
        
        if (savedDarkMode !== null) {
            this.isDarkMode = savedDarkMode === '1';
        }
        
        this.updateUIControls();
    },
    
    updateUIControls() {
        const themeSelect = document.getElementById('themeSelect');
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        if (themeSelect) {
            themeSelect.value = this.currentTheme;
        }
        
        if (darkModeToggle) {
            darkModeToggle.checked = this.isDarkMode;
        }
    },

    bindEvents() {
        // Use event delegation to ensure events are bound even if elements load later
        document.addEventListener('change', (e) => {
            if (e.target.id === 'themeSelect') {
                this.setTheme(e.target.value);
            } else if (e.target.id === 'darkModeToggle') {
                this.setDarkMode(e.target.checked);
            }
        });
        
        // Additional click handler for toggle slider to ensure it works
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle-slider')) {
                const checkbox = e.target.previousElementSibling;
                if (checkbox && checkbox.id === 'darkModeToggle') {
                    checkbox.checked = !checkbox.checked;
                    this.setDarkMode(checkbox.checked);
                }
            }
        });
    },

    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            this.saveSettings();
            this.applyTheme();
        }
    },

    setDarkMode(isDark) {
        this.isDarkMode = isDark;
        this.saveSettings();
        this.updateUIControls();
        this.applyTheme();
    },

    applyTheme() {
        const theme = this.themes[this.currentTheme];
        const mode = this.isDarkMode ? 'dark' : 'light';
        const colors = theme[mode];

        const root = document.documentElement;
        
        // Apply the color variables
        Object.entries(colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Update legacy variables that map to the new color system
        root.style.setProperty('--primary-color', colors['--color-accent']);
        root.style.setProperty('--primary-light', colors['--color-accent2']);
        root.style.setProperty('--primary-dark', colors['--color-accent2']);
        root.style.setProperty('--secondary-color', colors['--color-accent']);
        root.style.setProperty('--accent-color', colors['--color-accent2']);
        
        root.style.setProperty('--background-primary', colors['--color-bg']);
        root.style.setProperty('--background-secondary', colors['--color-bg2']);
        root.style.setProperty('--background-tertiary', colors['--color-panel']);
        root.style.setProperty('--surface-primary', colors['--color-panel']);
        root.style.setProperty('--surface-secondary', colors['--color-panel-dark']);
        root.style.setProperty('--surface-elevated', colors['--color-bg2']);
        
        root.style.setProperty('--text-primary', colors['--color-text']);
        root.style.setProperty('--text-secondary', colors['--color-text-light']);
        root.style.setProperty('--text-muted', colors['--color-text-accent']);
        
        root.style.setProperty('--border-primary', colors['--color-accent2']);
        root.style.setProperty('--border-secondary', colors['--color-accent']);
        root.style.setProperty('--border-accent', colors['--color-accent']);

        // Add theme classes to body for additional styling if needed
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${this.currentTheme}`);
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        document.body.classList.toggle('light-mode', !this.isDarkMode);
    },

    saveSettings() {
        localStorage.setItem('warframeChecklistPalette', this.currentTheme);
        localStorage.setItem('warframeChecklistPaletteDark', this.isDarkMode ? '1' : '0');
    }
};

// Data fetching and display functions
const fetchWarframeData = async (platform) => {
    try {
        console.log('Fetching data for platform:', platform);
        const response = await fetch(`https://api.warframestat.us/${platform}`, {
            headers: {
                'Accept-Language': 'en'
            },
            cache: 'no-cache'  // Prevent caching issues
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw API Response:', data);
        
        // Debug Baro Ki'Teer data specifically
        if (data.voidTrader) {
            console.log('Baro Ki\'Teer Data:', {
                character: data.voidTrader.character,
                location: data.voidTrader.location,
                active: data.voidTrader.active,
                expiry: data.voidTrader.expiry,
                expiryDate: new Date(data.voidTrader.expiry).toISOString(),
                currentTime: new Date().toISOString(),
                timeDiff: new Date(data.voidTrader.expiry).getTime() - Date.now()
            });
        }
        
        // Check if we got valid data
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data received from API');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching Warframe data:', error);
        throw error; // Let the display function handle the error
    }
};

const createCard = (title, content) => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    
    card.appendChild(titleElement);
    
    if (typeof content === 'string') {
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = content;
        card.appendChild(contentDiv);
    } else if (content instanceof Node) {
        card.appendChild(content);
    } else {
        console.error('Invalid content type passed to createCard:', content);
        return null;
    }
    
    return card;
};

// World Cycles - New compact layout functions
const createDailyResetTimer = () => {
    const dailyReset = document.createElement('div');
    dailyReset.className = 'daily-reset-timer';
    
    dailyReset.innerHTML = `
        <div class="daily-reset-content">
            <div class="daily-reset-icon">🌀</div>
            <div class="daily-reset-text">
                <div class="daily-reset-label">Daily Reset</div>
                <div class="daily-reset-time" id="dailyResetTime">00:00:00</div>
            </div>
        </div>
    `;
    
    const timeElement = dailyReset.querySelector('#dailyResetTime');
    
    const updateDailyResetTimer = () => {
        const now = new Date();
        
        // Get next midnight UTC - use UTC methods directly
        const nextMidnight = new Date();
        nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
        nextMidnight.setUTCHours(0, 0, 0, 0);
        
        const timeUntilReset = nextMidnight.getTime() - now.getTime();
        
        if (timeUntilReset <= 0) {
            timeElement.textContent = "00:00:00";
            return;
        }
        
        const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeUntilReset % (1000 * 60)) / 1000);
        
        timeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    // Update every second
    setInterval(updateDailyResetTimer, 1000);
    updateDailyResetTimer();
    
    return dailyReset;
};

const createWorldCycle = (name, state, expiry, type) => {
    const cycle = document.createElement('div');
    cycle.className = `world-cycle cycle-${type}`;
    
    // Add state-specific class
    if (state) {
        cycle.classList.add(`state-${state.toLowerCase()}`);
    }
    
    // Get icon based on type and state
    const getIcon = (type, state) => {
        switch(type) {
            case 'cetus':
                return state === 'night' ? '🌙' : '☀️';
            case 'vallis':
                return state === 'warm' ? '🔥' : '❄️';
            case 'cambion':
                return state === 'vome' ? '🟣' : '🔴';
            case 'zariman':
                return '✨';
            default:
                return '🌍';
        }
    };
    
    cycle.innerHTML = `
        <div class="cycle-icon">${getIcon(type, state)}</div>
        <div class="cycle-name">${name}</div>
        <div class="cycle-state">${state || 'Unknown'}</div>
        <div class="cycle-timer" data-expiry="${expiry}"></div>
    `;
    
    const timer = cycle.querySelector('.cycle-timer');
    
    const updateCycleTimer = () => {
        const now = Date.now();
        const timeLeft = new Date(expiry).getTime() - now;
        const duration = formatDuration(timeLeft);
        
        timer.textContent = duration;
        
        // Add warning classes based on time remaining
        timer.classList.remove('warning', 'critical');
        if (timeLeft < 5 * 60 * 1000) { // Less than 5 minutes
            timer.classList.add('critical');
        } else if (timeLeft < 15 * 60 * 1000) { // Less than 15 minutes
            timer.classList.add('warning');
        }
    };
    
    setInterval(updateCycleTimer, 1000);
    updateCycleTimer();
    
    return cycle;
};

const displayCetusInfo = (cetusData) => {
    return createWorldCycle('Cetus', cetusData.state, cetusData.expiry, 'cetus');
};

const displayVallisCycle = (vallisData) => {
    return createWorldCycle('Orb Vallis', vallisData.state, vallisData.expiry, 'vallis');
};

const displayCambionCycle = (cambionData) => {
    return createWorldCycle('Cambion Drift', cambionData.active, cambionData.expiry, 'cambion');
};

const displayZarimanCycle = (zarimanData) => {
    return createWorldCycle('Zariman', zarimanData.state, zarimanData.expiry, 'zariman');
};

const displaySortieInfo = (sortieData) => {
    const content = document.createElement('div');
    
    content.innerHTML = `
        <p>Boss: ${sortieData.boss}</p>
        <ul>
        ${sortieData.variants.map(variant => `
            <li>${variant.missionType} - ${variant.modifier}</li>
            `).join('')}
        </ul>
        <p>Remaining: <span class="timer"></span></p>
    `;
    
    const timer = content.querySelector('.timer');
    setInterval(() => updateTimer(timer, sortieData.expiry), 1000);
    updateTimer(timer, sortieData.expiry);
    
    return createCard('Sortie', content);
};

const displayFissures = (fissures) => {
    if (!Array.isArray(fissures) || fissures.length === 0) return null;
    
    const content = document.createElement('div');
    const activeVoidFissures = fissures.filter(fissure => !fissure.expired);
    
    if (activeVoidFissures.length === 0) {
        content.innerHTML = '<p>No active void fissures</p>';
        return createCard('Void Fissures', content);
    }
    
    // Group fissures by tier
    const groupedFissures = activeVoidFissures.reduce((acc, fissure) => {
        if (!acc[fissure.tier]) acc[fissure.tier] = [];
        acc[fissure.tier].push(fissure);
        return acc;
    }, {});
    
    content.innerHTML = `
        <div id="fissuresList">
            ${Object.entries(groupedFissures).map(([tier, fissures]) => `
                <div class="fissure-group">
                    <h3>${tier}</h3>
                    ${fissures.map(fissure => `
                        <div class="fissure">
                            <p>${fissure.missionType} - ${fissure.node} ${fissure.isSharkwing || fissure.archwingRequired ? `<img src="https://wiki.warframe.com/images/thumb/Amesha.png/32px-Amesha.png?bb937" alt="Amesha" style="width: 16px; height: 16px; vertical-align: middle; margin-left: 4px;">` : ''}</p>
                            <p>Enemy: ${fissure.enemy || 'Unknown'}</p>
                            <p>Time remaining: <span class="timer" data-expiry="${fissure.expiry}"></span></p>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `;
    
    const timers = content.querySelectorAll('.timer');
    timers.forEach(timer => {
        const expiry = timer.dataset.expiry;
        setInterval(() => updateTimer(timer, expiry), 1000);
        updateTimer(timer, expiry);
    });
    
    return createCard('Void Fissures', content);
};

const displayArchonHunt = (archonData) => {
    const content = document.createElement('div');
    content.innerHTML = `
        <p>Boss: ${archonData.boss}</p>
        <ul>
        ${archonData.missions.map(mission => `
            <li>${mission.node} - ${mission.type}</li>
            `).join('')}
        </ul>
        <p>Remaining: <span class="timer"></span></p>
    `;
    
    const timer = content.querySelector('.timer');
    setInterval(() => updateTimer(timer, archonData.expiry), 1000);
    updateTimer(timer, archonData.expiry);
    
    return createCard('Archon Hunt', content);
};

const displayAlerts = (alerts) => {
    if (!alerts.length) return null;
    
    // Create a container for all alert cards
    const alertsContainer = document.createElement('div');
    alertsContainer.className = 'alerts-container';
    
    alerts.forEach((alert, index) => {
        const alertCard = document.createElement('div');
        alertCard.className = 'alert-card';
        
        // Get reward image URL based on reward type
        const getRewardImage = (alert) => {
            const rewardString = alert.mission.reward.asString.toLowerCase();
            const rewardTypes = alert.rewardTypes || [];
            
            // Map reward types to their corresponding image paths
            const getImagePath = (type) => {
                return `rewards/type/${type}.png`;
            };
            
            // Check if we have a specific reward type, otherwise try to infer from reward string
            let rewardType = 'other'; // default fallback
            
            if (rewardTypes && rewardTypes.length > 0) {
                // Use the first reward type if available
                rewardType = rewardTypes[0];
            } else {
                // Try to infer reward type from reward string
                if (rewardString.includes('catalyst') || rewardString.includes('potato')) {
                    rewardType = 'catalyst';
                } else {
                    rewardType = rewardString;
                }
            }
            
            return getImagePath(rewardType);
        };
        
        // Get mission type icon
        const getMissionIcon = (missionType) => {
            const type = missionType.toLowerCase();
            switch(type) {
                case 'exterminate': return '💀';
                case 'capture': return '🎯';
                case 'rescue': return '🚑';
                case 'sabotage': return '💣';
                case 'spy': return '🕵️';
                case 'survival': return '⏱️';
                case 'defense': return '🛡️';
                case 'mobile defense': return '🚚';
                case 'excavation': return '⛏️';
                case 'interception': return '📡';
                case 'assassination': return '🗡️';
                default: return '⚔️';
            }
        };
        
        // Get faction color
        const getFactionColor = (faction) => {
            switch(faction?.toLowerCase()) {
                case 'grineer': return '#ff6b35';
                case 'corpus': return '#4fc3f7';
                case 'infested': return '#8bc34a';
                case 'corrupted': return '#ffc107';
                case 'orokin': return '#ffeb3b';
                default: return '#9e9e9e';
            }
        };
        
        alertCard.innerHTML = `
            <div class="alert-header">
                <div class="alert-title">
                    <span class="mission-icon">${getMissionIcon(alert.mission.type)}</span>
                    <div class="alert-title-text">
                        <h3>${alert.mission.node} ${alert.mission.isSharkwing || alert.mission.archwingRequired ? `<img src="https://wiki.warframe.com/images/thumb/Amesha.png/32px-Amesha.png?bb937" alt="Amesha" style="width: 16px; height: 16px; vertical-align: middle; margin-left: 4px;">` : ''}</h3>
                        <span class="alert-subtitle">${alert.mission.type}</span>
                    </div>
                </div>
                <div class="alert-timer">
                    <span class="timer" data-expiry="${alert.expiry}"></span>
                </div>
            </div>
            
            <div class="alert-content">
                <div class="mission-details">
                    <div class="mission-info">
                        <div class="info-row">
                            <span class="info-label">Faction:</span>
                            <span class="info-value" style="color: ${getFactionColor(alert.mission.faction)}">${alert.mission.faction || 'Unknown'}</span>
                        </div>
                        ${alert.mission.minEnemyLevel ? `
                            <div class="info-row">
                                <span class="info-label">Level:</span>
                                <span class="info-value">${alert.mission.minEnemyLevel}-${alert.mission.maxEnemyLevel || alert.mission.minEnemyLevel}</span>
                            </div>
                        ` : ''}
                        <div class="info-row">
                            <span class="info-label">Mission:</span>
                            <span class="info-value">${alert.mission.type}</span>
                        </div>
                    </div>
                </div>
                
                <div class="reward-section">
                    <div class="reward-header">
                        <span class="reward-label">🎁 Reward</span>
                    </div>
                    <div class="reward-display">
                        <div class="reward-image">
                            <img src="${getRewardImage(alert)}" 
                                 alt="${alert.mission.reward.asString}" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <div class="reward-icon-fallback" style="display: none;">🎁</div>
                        </div>
                        <div class="reward-info">
                            <div class="reward-name">${alert.mission.reward.asString}</div>
                            ${alert.mission.reward.credits ? `<div class="reward-credits">+ ${alert.mission.reward.credits.toLocaleString()} Credits</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        alertsContainer.appendChild(alertCard);
    });
    
    // Set up timers for all alerts
    const timers = alertsContainer.querySelectorAll('.timer');
    timers.forEach(timer => {
        const expiry = timer.dataset.expiry;
        setInterval(() => updateTimer(timer, expiry), 1000);
        updateTimer(timer, expiry);
    });
    
    return createCard('🚨 Active Alerts', alertsContainer);
};

const displayInvasions = (invasions) => {
    const activeInvasions = invasions.filter(invasion => !invasion.completed);
    if (!activeInvasions.length) return null;
    
    const content = document.createElement('div');
    content.innerHTML = `
        ${activeInvasions.map(invasion => `
            <div class="invasion">
                <p>${invasion.node || 'Unknown Location'} ${invasion.isSharkwing || invasion.archwingRequired ? `<img src="https://wiki.warframe.com/images/thumb/Amesha.png/32px-Amesha.png?bb937" alt="Amesha" style="width: 16px; height: 16px; vertical-align: middle; margin-left: 4px;">` : ''}</p>
                <p>${invasion.attackingFaction || 'Unknown'} vs ${invasion.defendingFaction || 'Unknown'}</p>
                <p>Rewards:</p>
                <ul>
                    <li>Attacking: ${invasion.attackerReward?.asString || invasion.attackerReward?.itemString || 'None'}</li>
                    <li>Defending: ${invasion.defenderReward?.asString || invasion.defenderReward?.itemString || 'None'}</li>
                </ul>
                <p>Progress: ${Math.round(invasion.completion || 0)}%</p>
            </div>
        `).join('')}
    `;
    
    return createCard('Active Invasions', content);
};

const displayNightwave = (nightwaveData) => {
    if (!nightwaveData.active) return null;
    
    const content = document.createElement('div');
    content.innerHTML = `
        <p>Season: ${nightwaveData.season} - Phase ${nightwaveData.phase}</p>
        <ul>
            ${nightwaveData.activeChallenges.map(challenge => `
                <li>
                    <p>${challenge.title} (${challenge.reputation})</p>
                    <p>${challenge.desc}</p>
                    <p>Expires in: <span class="timer" data-expiry="${challenge.expiry}"></span></p>
                </li>
            `).join('')}
        </ul>
    `;
    
    const timers = content.querySelectorAll('.timer');
    timers.forEach(timer => {
        const expiry = timer.dataset.expiry;
        setInterval(() => updateTimer(timer, expiry), 1000);
        updateTimer(timer, expiry);
    });
    
    return createCard('Nightwave', content);
};

const displayVoidTrader = (voidTraderData, title = 'Void Trader') => {
    if (!voidTraderData) return null;
    
    // Fix for all void trader timers being 2 days off
    // This is a known issue with the API or timezone handling
    const correctedExpiryTime = new Date(new Date(voidTraderData.expiry).getTime() - (2 * 24 * 60 * 60 * 1000)).toISOString();
    
    console.log('Void Trader Timer Correction Applied:', {
        trader: title,
        original: voidTraderData.expiry,
        corrected: correctedExpiryTime,
        originalDate: new Date(voidTraderData.expiry).toISOString(),
        correctedDate: new Date(correctedExpiryTime).toISOString(),
        difference: '2 days subtracted'
    });
    
    const content = document.createElement('div');
    content.innerHTML = `
        <p>Trader: ${voidTraderData.character}</p>
        <p>Location: ${voidTraderData.location}</p>
        ${voidTraderData.active ? `
            <p>Inventory:</p>
            <ul>
                ${voidTraderData.inventory?.map(item => `
                    <li>${item.item} (${item.ducats} <img src="https://wiki.warframe.com/images/thumb/OrokinDucats.png/20px-OrokinDucats.png?23930" alt="Ducats" style="width: 16px; height: 16px; vertical-align: middle; margin: 0 2px;"> ducats + ${item.credits} credits)</li>
                `).join('') || 'No items available'}
            </ul>
            <p>Leaves in: <span class="timer"></span></p>
        ` : `
            <p>Arrives in: <span class="timer"></span></p>
        `}
    `;
    
    const timer = content.querySelector('.timer');
    setInterval(() => updateTimer(timer, correctedExpiryTime), 1000);
    updateTimer(timer, correctedExpiryTime);
    
    return createCard(title, content);
};

const displayAllVoidTraders = (voidTraders) => {
    if (!Array.isArray(voidTraders) || voidTraders.length === 0) return null;
    
    const content = document.createElement('div');
    content.className = 'void-traders-container';
    
    voidTraders.forEach((trader, index) => {
        // Fix for all void trader timers being 2 days off
        const correctedExpiryTime = new Date(new Date(trader.expiry).getTime() - (2 * 24 * 60 * 60 * 1000)).toISOString();
        
        const traderDiv = document.createElement('div');
        traderDiv.className = 'void-trader-item';
        
        traderDiv.innerHTML = `
            <div class="trader-header">
                <h3>${trader.name || trader.character}</h3>
                <div class="trader-status ${trader.active ? 'active' : 'inactive'}">
                    ${trader.active ? '🟢 Active' : '🔴 Inactive'}
                </div>
            </div>
            <div class="trader-details">
                <p><strong>Trader:</strong> ${trader.character}</p>
                <p><strong>Location:</strong> ${trader.location}</p>
                ${trader.active ? `
                    <div class="trader-inventory">
                        <p><strong>Inventory:</strong></p>
                        <ul>
                            ${trader.inventory?.map(item => `
                                <li>${item.item} <span class="price">(${item.ducats} <img src="https://wiki.warframe.com/images/thumb/OrokinDucats.png/20px-OrokinDucats.png?23930" alt="Ducats" style="width: 16px; height: 16px; vertical-align: middle; margin: 0 2px;"> ducats + ${item.credits} credits)</span></li>
                            `).join('') || '<li>No items available</li>'}
                        </ul>
                    </div>
                    <p><strong>Leaves in:</strong> <span class="timer" data-expiry="${correctedExpiryTime}"></span></p>
                ` : `
                    <p><strong>Arrives in:</strong> <span class="timer" data-expiry="${correctedExpiryTime}"></span></p>
                `}
            </div>
            ${index < voidTraders.length - 1 ? '<div class="trader-separator"></div>' : ''}
        `;
        
        content.appendChild(traderDiv);
    });
    
    // Set up timers for all traders
    const timers = content.querySelectorAll('.timer');
    timers.forEach(timer => {
        const expiry = timer.dataset.expiry;
        setInterval(() => updateTimer(timer, expiry), 1000);
        updateTimer(timer, expiry);
    });
    
    return createCard('Void Traders', content);
};

const displayNews = (news) => {
    if (!Array.isArray(news) || news.length === 0) return null;
    
    // Sort news by date, newest first
    const sortedNews = [...news].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Newest first (descending order)
    });
    
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="news-list">
            ${sortedNews.map(item => `
                <div class="news-item">
                    <p class="news-entry">
                        <span class="news-time">${formatTimeAgo(item.date)}:</span> 
                        ${item.link ? 
                            `<a href="${item.link}" target="_blank" rel="noopener" class="news-message-link">${item.message}</a>` :
                            `<span class="news-message">${item.message}</span>`
                        }
                    </p>
                </div>
            `).join('')}
        </div>
    `;
    
    return createCard('News', content);
};

const displayEvents = (events) => {
    if (!Array.isArray(events) || events.length === 0) return null;
    
    const content = document.createElement('div');
    content.innerHTML = `
        ${events.map(event => `
            <div class="event">
                <h3>${event.description}</h3>
                ${event.victimNode ? `<p>Location: ${event.victimNode}</p>` : ''}
                ${event.health ? `<p>Progress: ${Math.round(event.health * 100)}%</p>` : ''}
                ${event.expiry ? `
                    <p>Ends in: <span class="timer" data-expiry="${event.expiry}"></span></p>
                ` : ''}
            </div>
        `).join('')}
    `;
    
    const timers = content.querySelectorAll('.timer');
    timers.forEach(timer => {
        const expiry = timer.dataset.expiry;
        setInterval(() => updateTimer(timer, expiry), 1000);
        updateTimer(timer, expiry);
    });
    
    return createCard('Events', content);
};

const displaySyndicateMissions = (missions) => {
    if (!Array.isArray(missions) || missions.length === 0) return null;
    
    // Filter out syndicates with no available nodes
    const availableMissions = missions.filter(mission => 
        mission.nodes && Array.isArray(mission.nodes) && mission.nodes.length > 0
    );
    
    if (availableMissions.length === 0) return null;
    
    const content = document.createElement('div');
    content.innerHTML = `
        ${availableMissions.map(mission => `
            <div class="syndicate-mission">
                <h3>${mission.syndicate}</h3>
                <ul>
                    ${mission.nodes.map(node => `<li>${node}</li>`).join('')}
                </ul>
                ${mission.expiry ? `
                    <p>Ends in: <span class="timer" data-expiry="${mission.expiry}"></span></p>
                ` : ''}
            </div>
        `).join('')}
    `;
    
    const timers = content.querySelectorAll('.timer');
    timers.forEach(timer => {
        const expiry = timer.dataset.expiry;
        setInterval(() => updateTimer(timer, expiry), 1000);
        updateTimer(timer, expiry);
    });
    
    return createCard('Syndicate Missions', content);
};

const displaySales = (sales, title) => {
    if (!Array.isArray(sales) || sales.length === 0) return null;
    
    // Sort sales from newer to older based on expiry date
    const sortedSales = [...sales].sort((a, b) => {
        if (!a.expiry && !b.expiry) return 0;
        if (!a.expiry) return 1;
        if (!b.expiry) return -1;
        return new Date(b.expiry).getTime() - new Date(a.expiry).getTime();
    });
    
    const content = document.createElement('div');
    content.innerHTML = `
        ${sortedSales.map(sale => `
            <div class="sale-item">
                <h3>${sale.item}</h3>
                <p>Price: 
                    ${sale.originalPrice ? `<span style="text-decoration: line-through; color: #888; margin-right: 8px;"><img src="https://www-static.warframe.com/images/icons/material/platinum.png" alt="Platinum" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;">${sale.originalPrice}</span>` : ''}
                    <img src="https://www-static.warframe.com/images/icons/material/platinum.png" alt="Platinum" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;">${sale.salePrice || sale.premiumCredits} Platinum
                </p>
                ${sale.discount ? `<p>Discount: ${sale.discount}% OFF</p>` : ''}
                ${sale.expiry ? `
                    <p>Ends in: <span class="timer" data-expiry="${sale.expiry}"></span></p>
                ` : ''}
            </div>
        `).join('')}
    `;
    
    const timers = content.querySelectorAll('.timer');
    timers.forEach(timer => {
        const expiry = timer.dataset.expiry;
        setInterval(() => updateTimer(timer, expiry), 1000);
        updateTimer(timer, expiry);
    });
    
    return createCard(title, content);
};

const displayChallenges = (challenges, title) => {
    if (!Array.isArray(challenges) || challenges.length === 0) return null;
    
    const content = document.createElement('div');
    content.innerHTML = `
        ${challenges.map(challenge => `
            <div class="challenge">
                <h3>${challenge.title || challenge.description}</h3>
                ${challenge.description ? `<p>${challenge.description}</p>` : ''}
                ${challenge.standing ? `<p>Standing: ${challenge.standing}</p>` : ''}
                ${challenge.expiry ? `
                    <p>Ends in: <span class="timer" data-expiry="${challenge.expiry}"></span></p>
                ` : ''}
            </div>
        `).join('')}
    `;
    
    const timers = content.querySelectorAll('.timer');
    timers.forEach(timer => {
        const expiry = timer.dataset.expiry;
        setInterval(() => updateTimer(timer, expiry), 1000);
        updateTimer(timer, expiry);
    });
    
    return createCard(title, content);
};

const displayConclaveChallenges = (challenges) => {
    if (!Array.isArray(challenges) || challenges.length === 0) return null;
    
    const content = document.createElement('div');
    content.innerHTML = `
        <p>Challenges:</p>
        <ul>
            ${challenges.map(challenge => `
                <li>
                    <p>${challenge.title || challenge.description}${challenge.standing ? ` (${challenge.standing} Standing)` : ''}</p>
                    ${challenge.description && challenge.title !== challenge.description ? `<p>${challenge.description}</p>` : ''}
                    ${challenge.expiry ? `<p>Expires in: <span class="timer" data-expiry="${challenge.expiry}"></span></p>` : ''}
                </li>
            `).join('')}
        </ul>
    `;
    
    const timers = content.querySelectorAll('.timer');
    timers.forEach(timer => {
        const expiry = timer.dataset.expiry;
        setInterval(() => updateTimer(timer, expiry), 1000);
        updateTimer(timer, expiry);
    });
    
    return createCard('Conclave Challenges', content);
};

const displaySimaris = (simarisData) => {
    if (!simarisData) return null;
    
    const content = document.createElement('div');
    content.innerHTML = `
        <h3>Daily Target: ${simarisData.target || 'None'}</h3>
        ${simarisData.isTargetActive ? `
            <p>Is Active: Yes</p>
        ` : `
            <p>Is Active: No</p>
        `}
    `;
    
    return createCard('Simaris', content);
};

const displaySentientOutposts = (outpost) => {
    if (!outpost) return null;
    
    const content = document.createElement('div');
    content.innerHTML = `
        <h3>Mission Node: ${outpost.mission?.node || 'None'}</h3>
        ${outpost.mission ? `
            <p>Type: ${outpost.mission.type}</p>
            <p>Faction: ${outpost.mission.faction}</p>
        ` : `
            <p>No active outpost</p>
        `}
    `;
    
    return createCard('Sentient Outposts', content);
};

const displaySteelPath = (steelPathData) => {
    const content = document.createElement('div');
    content.innerHTML = `
        <p>Current Rotation: ${steelPathData.currentReward.name}</p>
        <p>Cost: ${steelPathData.currentReward.cost} <img src="https://wiki.warframe.com/images/thumb/SteelEssence.png/32px-SteelEssence.png?ee70b" alt="Steel Essence" style="width: 16px; height: 16px; vertical-align: middle; margin-left: 4px;"> Steel Essence</p>
        <p>Rotating in: <span class="timer"></span></p>
    `;
    
    const timer = content.querySelector('.timer');
    setInterval(() => updateTimer(timer, steelPathData.expiry), 1000);
    updateTimer(timer, steelPathData.expiry);
    
    return createCard('Steel Path', content);
};

const displayVaultTrader = (vaultTraderData) => {
    if (!vaultTraderData) return null;
    
    const content = document.createElement('div');
    
    // Get faction color for visual consistency
    const getFactionColor = (faction) => {
        switch(faction?.toLowerCase()) {
            case 'grineer': return '#ff6b35';
            case 'corpus': return '#4fc3f7';
            case 'infested': return '#8bc34a';
            case 'corrupted': return '#ffc107';
            case 'orokin': return '#ffeb3b';
            default: return '#9e9e9e';
        }
    };
    
    content.innerHTML = `
        <div class="vault-trader-mission">
            <div class="mission-header">
                <div class="mission-info">
                    <h3>${vaultTraderData.character}</h3>
                    <p class="mission-type">${vaultTraderData.location}</p>
                </div>
                <div class="mission-status ${vaultTraderData.active ? 'active' : 'inactive'}">
                    ${vaultTraderData.active ? '🟢 Active' : '🔴 Inactive'}
                </div>
            </div>
            
            <div class="mission-details">
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value">${vaultTraderData.active ? 'Available' : 'Not Available'}</span>
                </div>
                
                ${vaultTraderData.active && vaultTraderData.inventory && vaultTraderData.inventory.length > 0 ? `
                    <div class="vault-inventory">
                        ${vaultTraderData.inventory.map(item => `
                            <div class="vault-item">
                                <span class="item-name">${item.item}</span>
                                <span class="item-cost">
                                    ${item.ducats !== null ? `${item.ducats} <img src="https://wiki.warframe.com/images/thumb/RegalAya.png/32px-RegalAya.png?dacfe" alt="Regal Aya" style="width: 16px; height: 16px; vertical-align: middle; margin: 0 2px;"> Regal Aya` : ''}
                                    ${item.ducats !== null && item.credits !== null ? ' + ' : ''}
                                    ${item.credits !== null ? `${item.credits.toLocaleString()} <img src="https://wiki.warframe.com/images/thumb/Aya.png/32px-Aya.png?0542b" alt="Aya" style="width: 16px; height: 16px; vertical-align: middle; margin: 0 2px;"> Aya` : ''}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                ` : vaultTraderData.active ? `
                    <div class="info-row">
                        <span class="info-label">Inventory:</span>
                        <span class="info-value">No items available</span>
                    </div>
                ` : ''}
                
                ${vaultTraderData.schedule && Array.isArray(vaultTraderData.schedule) && vaultTraderData.schedule.length > 0 ? `
                    <div class="info-row">
                        <span class="info-label">Upcoming Schedule:</span>
                    </div>
                    <div class="vault-schedule">
                        ${(() => {
                            const now = Date.now();
                            const activeSchedule = vaultTraderData.schedule.filter(item => new Date(item.expiry).getTime() > now);
                            const expiredSchedule = vaultTraderData.schedule.filter(item => new Date(item.expiry).getTime() <= now);
                            
                            let scheduleHTML = '';
                            
                            // Active schedule items
                            if (activeSchedule.length > 0) {
                                scheduleHTML += activeSchedule.map(scheduleItem => `
                                    <div class="schedule-item">
                                        <span class="schedule-item-name">${scheduleItem.item}</span>
                                        <span class="schedule-item-time">
                                            <span class="timer" data-expiry="${scheduleItem.expiry}"></span>
                                        </span>
                                    </div>
                                `).join('');
                            }
                            
                            // Expired schedule items in dropdown
                            if (expiredSchedule.length > 0) {
                                scheduleHTML += `
                                    <div class="expired-schedule-toggle">
                                        <button class="expired-toggle-btn" onclick="this.parentElement.nextElementSibling.classList.toggle('hidden'); this.textContent = this.textContent.includes('▼') ? '▶ Show Expired Items (${expiredSchedule.length})' : '▼ Hide Expired Items (${expiredSchedule.length})'">
                                            ▶ Show Expired Items (${expiredSchedule.length})
                                        </button>
                                    </div>
                                    <div class="expired-schedule-items hidden">
                                        ${expiredSchedule.map(scheduleItem => `
                                            <div class="schedule-item expired">
                                                <span class="schedule-item-name">${scheduleItem.item}</span>
                                                <span class="schedule-item-time expired-time">
                                                    Expired <span class="timer" data-expiry="${scheduleItem.expiry}"></span> ago
                                                </span>
                                            </div>
                                        `).join('')}
                                    </div>
                                `;
                            }
                            
                            return scheduleHTML;
                        })()}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Set up timer if expiry exists
    if (vaultTraderData.expiry) {
        const timer = content.querySelector('.timer');
        setInterval(() => updateTimer(timer, vaultTraderData.expiry), 1000);
        updateTimer(timer, vaultTraderData.expiry);
    }
    
    // Set up timers for schedule items
    if (vaultTraderData.schedule && Array.isArray(vaultTraderData.schedule)) {
        const scheduleTimers = content.querySelectorAll('.schedule-item .timer');
        scheduleTimers.forEach((timer) => {
            const expiry = timer.dataset.expiry;
            if (expiry) {
                const scheduleItem = vaultTraderData.schedule.find(item => item.expiry === expiry);
                if (scheduleItem) {
                    const isExpired = timer.closest('.schedule-item').classList.contains('expired');
                    if (isExpired) {
                        // For expired items, show how long ago they expired
                        const updateExpiredTimer = () => {
                            const now = Date.now();
                            const expiredTime = new Date(expiry).getTime();
                            const timeAgo = now - expiredTime;
                            timer.textContent = formatDuration(timeAgo);
                        };
                        setInterval(updateExpiredTimer, 1000);
                        updateExpiredTimer();
                    } else {
                        // For active items, show countdown
                        setInterval(() => updateTimer(timer, expiry), 1000);
                        updateTimer(timer, expiry);
                    }
                }
            }
        });
    }
    
    // Add CSS styles for the dropdown if not already added
    if (!document.getElementById('vault-trader-styles')) {
        const style = document.createElement('style');
        style.id = 'vault-trader-styles';
        style.textContent = `
            /* Vault Trader Main Container */
            .vault-trader-mission {
                background: var(--color-panel, #2a211e);
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 12px;
                border: 1px solid var(--color-accent2, #854442);
            }
            
            /* Mission Header */
            .mission-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--color-accent2, #854442);
            }
            
            .mission-icon {
                font-size: 1.5em;
                margin-right: 12px;
            }
            
            .mission-info h3 {
                margin: 0;
                font-size: 1.2em;
                color: var(--color-text, #fff);
            }
            
            .mission-type {
                margin: 2px 0 0 0;
                color: var(--color-text-accent, #be9b7b);
                font-size: 0.9em;
            }
            
            .mission-status {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8em;
                font-weight: bold;
            }
            
            .mission-status.active {
                background: rgba(76, 175, 80, 0.2);
                color: #4caf50;
                border: 1px solid #4caf50;
            }
            
            .mission-status.inactive {
                background: rgba(244, 67, 54, 0.2);
                color: #f44336;
                border: 1px solid #f44336;
            }
            
            /* Mission Details */
            .mission-details {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            
            .info-row {
                display: flex;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(190, 155, 123, 0.2);
            }
            
            .info-row:last-child {
                border-bottom: none;
            }
            
            .info-label {
                font-weight: bold;
                color: var(--color-text-accent, #be9b7b);
                min-width: 100px;
                margin-right: 12px;
            }
            
            .info-value {
                color: var(--color-text, #fff);
                flex: 1;
            }
            
            /* Inventory Section */
            .vault-inventory {
                background: rgba(190, 155, 123, 0.1);
                border-radius: 6px;
                padding: 12px;
                margin-top: 8px;
            }
            
            .vault-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(190, 155, 123, 0.2);
            }
            
            .vault-item:last-child {
                border-bottom: none;
            }
            
            .item-name {
                font-weight: bold;
                color: var(--color-text, #fff);
                flex: 1;
            }
            
            .item-cost {
                color: var(--color-text-accent, #be9b7b);
                font-size: 0.9em;
                white-space: nowrap;
                margin-left: 12px;
            }
            
            /* Schedule Section */
            .vault-schedule {
                background: rgba(190, 155, 123, 0.1);
                border-radius: 6px;
                padding: 12px;
                margin-top: 8px;
            }
            
            .schedule-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(190, 155, 123, 0.2);
            }
            
            .schedule-item:last-child {
                border-bottom: none;
            }
            
            .schedule-item-name {
                font-weight: bold;
                color: var(--color-text, #fff);
                flex: 1;
            }
            
            .schedule-item-time {
                color: var(--color-text-accent, #be9b7b);
                font-size: 0.9em;
                white-space: nowrap;
                margin-left: 12px;
            }
            
            /* Expired Schedule Dropdown */
            .expired-schedule-toggle {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid rgba(190, 155, 123, 0.3);
            }
            
            .expired-toggle-btn {
                background: rgba(190, 155, 123, 0.1);
                border: 1px solid var(--color-accent2, #854442);
                border-radius: 4px;
                color: var(--color-text-accent, #be9b7b);
                cursor: pointer;
                font-size: 0.9em;
                padding: 8px 12px;
                text-align: left;
                width: 100%;
                transition: all 0.2s ease;
            }
            
            .expired-toggle-btn:hover {
                background: rgba(190, 155, 123, 0.2);
                color: var(--color-text, #fff);
                border-color: var(--color-accent, #be9b7b);
            }
            
            .expired-schedule-items {
                margin-top: 8px;
                background: rgba(133, 68, 66, 0.1);
                border-radius: 4px;
                border-left: 3px solid var(--color-accent2, #854442);
                padding: 8px 12px;
                transition: all 0.3s ease;
            }
            
            .expired-schedule-items.hidden {
                display: none;
            }
            
            .schedule-item.expired {
                opacity: 0.7;
                background: rgba(133, 68, 66, 0.1);
                margin: 4px 0;
                padding: 6px 8px;
                border-radius: 4px;
                border-bottom: none;
            }
            
            .schedule-item.expired .schedule-item-name {
                text-decoration: line-through;
                color: var(--color-text-accent, #be9b7b);
            }
            
            .expired-time {
                color: var(--color-text-accent, #be9b7b);
                font-style: italic;
            }
            
            /* Timer Styling */
            .timer {
                font-family: 'Courier New', monospace;
                font-weight: bold;
                color: var(--color-accent, #be9b7b);
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .mission-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }
                
                .vault-item,
                .schedule-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 4px;
                }
                
                .item-cost,
                .schedule-item-time {
                    margin-left: 0;
                }
                
                .info-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 4px;
                }
                
                .info-label {
                    min-width: auto;
                    margin-right: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    return createCard('Vault Trader', content);
};

const displayArbitration = (arbitrationData) => {
    if (!arbitrationData) return null;
    
    const content = document.createElement('div');
    
    // Get mission type icon
    const getMissionIcon = (missionType) => {
        const type = missionType.toLowerCase();
        switch(type) {
            case 'exterminate': return '💀';
            case 'capture': return '🎯';
            case 'rescue': return '🚑';
            case 'sabotage': return '💣';
            case 'spy': return '🕵️';
            case 'survival': return '⏱️';
            case 'defense': return '🛡️';
            case 'mobile defense': return '🚚';
            case 'excavation': return '⛏️';
            case 'interception': return '📡';
            case 'assassination': return '🗡️';
            case 'disruption': return '⚡';
            case 'defection': return '🏃';
            default: return '⚔️';
        }
    };
    
    // Get faction color
    const getFactionColor = (faction) => {
        switch(faction?.toLowerCase()) {
            case 'grineer': return '#ff6b35';
            case 'corpus': return '#4fc3f7';
            case 'infested': return '#8bc34a';
            case 'corrupted': return '#ffc107';
            case 'orokin': return '#ffeb3b';
            default: return '#9e9e9e';
        }
    };
    
    // Check if enemy is Tenno for special message
    if (arbitrationData.enemy?.toLowerCase() === 'tenno') {
        content.innerHTML = `
            <div class="arbitration-offline">
                <div class="offline-message">
                    <h3>Hexis drones are offline at the moment</h3>
                    <p>Arbitration missions are currently unavailable</p>
                </div>
            </div>
        `;
        return createCard('Arbitration', content);
    }
    
    content.innerHTML = `
        <div class="arbitration-mission">
            <div class="mission-header">
                <span class="mission-icon">${getMissionIcon(arbitrationData.type)}</span>
                <div class="mission-info">
                    <h3>${arbitrationData.node}</h3>
                    <p class="mission-type">${arbitrationData.type}</p>
                </div>
                <div class="mission-status ${arbitrationData.active ? 'active' : 'inactive'}">
                    ${arbitrationData.active ? '🟢 Active' : '🔴 Inactive'}
                </div>
            </div>
            
            <div class="mission-details">
                <div class="info-row">
                    <span class="info-label">Enemy:</span>
                    <span class="info-value" style="color: ${getFactionColor(arbitrationData.enemy)}">${arbitrationData.enemy}</span>
                </div>
                
                ${arbitrationData.archwing ? `
                    <div class="info-row">
                        <span class="info-label">Special:</span>
                        <span class="info-value">Archwing Mission <img src="https://wiki.warframe.com/images/thumb/Amesha.png/32px-Amesha.png?bb937" alt="Amesha" style="width: 16px; height: 16px; vertical-align: middle; margin-left: 4px;"></span>
                    </div>
                ` : ''}
                
                ${arbitrationData.sharkwing ? `
                    <div class="info-row">
                        <span class="info-label">Special:</span>
                        <span class="info-value">Sharkwing Mission <img src="https://wiki.warframe.com/images/thumb/Amesha.png/32px-Amesha.png?bb937" alt="Amesha" style="width: 16px; height: 16px; vertical-align: middle; margin-left: 4px;"></span>
                    </div>
                ` : ''}
                
                ${arbitrationData.expiry ? `
                    <div class="info-row">
                        <span class="info-label">Rotation:</span>
                        <span class="info-value timer" data-expiry="${arbitrationData.expiry}"></span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Set up timer if expiry exists
    if (arbitrationData.expiry) {
        const timer = content.querySelector('.timer');
        setInterval(() => updateTimer(timer, arbitrationData.expiry), 1000);
        updateTimer(timer, arbitrationData.expiry);
    }
    
    return createCard('Arbitration', content);
};

const displayConstructionProgress = (constructionData) => {
    if (!constructionData) return null;
    
    const content = document.createElement('div');
    content.className = 'construction-progress-simple';
    
    const fomorianProgress = Math.max(0, Math.min(100, constructionData.fomorianProgress || 0));
    const razorbackProgress = Math.max(0, Math.min(100, constructionData.razorbackProgress || 0));
    
    content.innerHTML = `
        <div class="construction-item-simple">
            <div class="construction-name-percent">
                <span class="construction-name">Fomorian</span>
                <span class="construction-percentage">${fomorianProgress.toFixed(1)}%</span>
            </div>
            <div class="construction-progress-bar-simple">
                <div class="construction-progress-fill-simple" style="width: ${fomorianProgress}%"></div>
            </div>
        </div>
        
        <div class="construction-item-simple">
            <div class="construction-name-percent">
                <span class="construction-name">Razorback</span>
                <span class="construction-percentage">${razorbackProgress.toFixed(1)}%</span>
            </div>
            <div class="construction-progress-bar-simple">
                <div class="construction-progress-fill-simple" style="width: ${razorbackProgress}%"></div>
            </div>
        </div>
    `;
    
    return createCard('Construction Progress', content);
};

const displayDuviriCycle = (duviriData) => {
    return createWorldCycle('Duviri', duviriData.state, duviriData.expiry, 'zariman');
};

// Main display function
const displayWarframeData = async (platform) => {
    const container = document.getElementById('warframeData');
    
    try {
        container.innerHTML = 'Loading...';
        const data = await fetchWarframeData(platform);
        
        console.log('Processing data:', {
            hasCetusCycle: !!data.cetusCycle,
            hasVallisCycle: !!data.vallisCycle,
            hasSortie: !!data.sortie,
            hasFissures: Array.isArray(data.fissures),
            fissuresCount: Array.isArray(data.fissures) ? data.fissures.length : 0,
            hasVoidTrader: !!data.voidTrader,
            hasNightwave: !!data.nightwave
        });
        
        // Basic error checking for data
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data received');
        }

        container.innerHTML = '';
        
        // Create sections for organization
        const sections = {
            news: document.createElement('div'),
            worldCycles: document.createElement('div'),
            missions: document.createElement('div'),
            voidActivities: document.createElement('div'),
            syndicates: document.createElement('div'),
            sales: document.createElement('div'),
            challenges: document.createElement('div'),
            activities: document.createElement('div'),
            specialEvents: document.createElement('div')
        };

        // Set section classes
        Object.keys(sections).forEach(key => {
            sections[key].className = `section ${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        });
        
        // World Cycles - Create special container
        const worldCyclesContainer = document.createElement('div');
        worldCyclesContainer.className = 'world-cycles-container';
        
        // Add daily reset timer at the top
        const dailyResetTimer = createDailyResetTimer();
        worldCyclesContainer.appendChild(dailyResetTimer);
        
        // Create cycles grid container
        const cyclesGrid = document.createElement('div');
        cyclesGrid.className = 'cycles-grid';
        
        const cycles = [
            { data: data.cetusCycle, display: displayCetusInfo },
            { data: data.vallisCycle, display: displayVallisCycle },
            { data: data.cambionCycle, display: displayCambionCycle },
            { data: data.zarimanCycle, display: displayZarimanCycle },
            { data: data.duviriCycle, display: displayDuviriCycle }
        ];
        
        cycles.forEach(cycle => {
            if (cycle.data) {
                const cycleElement = cycle.display(cycle.data);
                if (cycleElement) cyclesGrid.appendChild(cycleElement);
            }
        });
        
        // Add cycles grid to container if it has cycles
        if (cyclesGrid.children.length > 0) {
            worldCyclesContainer.appendChild(cyclesGrid);
        }
        
        // Only add container if it has the daily reset timer (it will always have this)
        container.appendChild(worldCyclesContainer);
        
        if (data.sortie) {
            const sortieCard = displaySortieInfo(data.sortie);
            if (sortieCard) container.appendChild(sortieCard);
        }

        if (data.archonHunt) {
            const archonCard = displayArchonHunt(data.archonHunt);
            if (archonCard) container.appendChild(archonCard);
        }

        if (data.steelPath) {
            const steelPathCard = displaySteelPath(data.steelPath);
            if (steelPathCard) container.appendChild(steelPathCard);
        }

        if (data.vaultTrader) {
            const vaultTraderCard = displayVaultTrader(data.vaultTrader);
            if (vaultTraderCard) container.appendChild(vaultTraderCard);
        }

        if (data.arbitration) {
            const arbitrationCard = displayArbitration(data.arbitration);
            if (arbitrationCard) container.appendChild(arbitrationCard);
        }

        if (data.sentientOutposts) {
            const sentientCard = displaySentientOutposts(data.sentientOutposts);
            if (sentientCard) container.appendChild(sentientCard);
        }

        // Alerts section - display immediately after world cycles
        if (data.alerts && Array.isArray(data.alerts) && data.alerts.length > 0) {
            const alertsCard = displayAlerts(data.alerts);
            if (alertsCard) container.appendChild(alertsCard);
        } else {
            // Create a mock alert for demonstration purposes
            const mockAlert = {
                id: "demo-alert-001",
                activation: new Date().toISOString(),
                expiry: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
                startString: "2h 0m",
                active: true,
                mission: {
                    node: "Cambria (Earth)",
                    type: "Exterminate",
                    faction: "Grineer",
                    minEnemyLevel: 8,
                    maxEnemyLevel: 10,
                    reward: {
                        asString: "Orokin Catalyst Blueprint",
                        credits: 4500
                    }
                },
                expired: false,
                eta: "2h 0m",
                rewardTypes: ["blueprint"]
            };
            
            // Show example alert for demonstration, or peace message
            const showExample = false; // Set to false to show peace message instead
            
            if (showExample) {
                const mockAlertsCard = displayAlerts([mockAlert]);
                if (mockAlertsCard) {
                    // Add a demo indicator to the title
                    const title = mockAlertsCard.querySelector('h2');
                    if (title) title.textContent = 'Alerts (Demo Example)';
                    container.appendChild(mockAlertsCard);
                }
            } else {
                // Show peace message when no alerts
                const noAlertsCard = createCard('Alerts', '<p class="peace-message">🕊️ The Origin System is at peace for now</p>');
                container.appendChild(noAlertsCard);
            }
        }
        
        // News and Events
        if (data.news) sections.news.appendChild(displayNews(data.news));
        if (data.events) sections.news.appendChild(displayEvents(data.events));
        if (data.constructionProgress) {
            const constructionCard = displayConstructionProgress(data.constructionProgress);
            if (constructionCard) sections.news.appendChild(constructionCard);
        }
        
        // Events and Missions
        if (data.invasions) {
            const invasionsCard = displayInvasions(data.invasions);
            if (invasionsCard) sections.missions.appendChild(invasionsCard);
        }
        
        // Void Activities
        if (data.fissures) {
            const fissuresCard = displayFissures(data.fissures);
            if (fissuresCard) sections.voidActivities.appendChild(fissuresCard);
        }
        
        // Combine all void traders into a single card
        const allVoidTraders = [];
        if (data.voidTrader) {
            allVoidTraders.push({ ...data.voidTrader, name: 'Baro Ki\'Teer' });
        }
        if (data.voidTraders && Array.isArray(data.voidTraders)) {
            data.voidTraders.forEach((trader, index) => {
                allVoidTraders.push({ ...trader, name: `Void Trader ${index + 1}` });
            });
        }
        
        if (allVoidTraders.length > 0) {
            const combinedVoidTradersCard = displayAllVoidTraders(allVoidTraders);
            if (combinedVoidTradersCard) sections.voidActivities.appendChild(combinedVoidTradersCard);
        }
        
        // Syndicates
        if (data.syndicateMissions) {
            const syndicateCard = displaySyndicateMissions(data.syndicateMissions);
            if (syndicateCard) sections.syndicates.appendChild(syndicateCard);
        }
        if (data.simaris) {
            const simarisCard = displaySimaris(data.simaris);
            if (simarisCard) sections.syndicates.appendChild(simarisCard);
        }
        
        // Sales and Deals
        if (data.dailyDeals) {
            const dailyDealsCard = displaySales(data.dailyDeals, 'DARVO');
            if (dailyDealsCard) sections.sales.appendChild(dailyDealsCard);
        }
        
        // Challenges
        if (data.conclaveChallenges) {
            const conclaveCard = displayConclaveChallenges(data.conclaveChallenges);
            if (conclaveCard) sections.challenges.appendChild(conclaveCard);
        }
        
        // Special Events
        if (data.nightwave) {
            const nightwaveCard = displayNightwave(data.nightwave);
            if (nightwaveCard) sections.specialEvents.appendChild(nightwaveCard);
        }
        
        // Add sections to container
        // World cycles go first as special container
        // Other sections get added as individual cards to the grid
        Object.entries(sections).forEach(([key, section]) => {
            if (section.children.length > 0) {
                // Append each card individually to the main container
                Array.from(section.children).forEach(card => {
                    container.appendChild(card);
                });
            }
        });

        // If no data is displayed, show a message
        if (container.children.length === 0) {
            container.innerHTML = 'No data available for this platform at the moment.';
        }

    } catch (error) {
        console.error('Error in displayWarframeData:', error);
        container.innerHTML = `Error loading Warframe data: ${error.message}`;
    }
};

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize collapsible sidebar
    initializeSidebar();
    
    // Initialize theme manager
    ThemeManager.init();
    
    // Add event listener for platform selection
    document.getElementById('platformSelect').addEventListener('change', (e) => {
        displayWarframeData(e.target.value);
    });

    // Initial load
    displayWarframeData('pc');
});

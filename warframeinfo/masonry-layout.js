// Masonry Layout Implementation for Warframe Info Cards
class MasonryLayout {
    constructor(container, options = {}) {
        this.container = container;
        this.columns = options.columns || 5;
        this.gap = options.gap || 24; // Default gap in pixels
        this.columnElements = [];
        this.isInitialized = false;
        this.lastKnownWidth = 0;
        
        // Bind methods to preserve 'this' context
        this.refresh = this.refresh.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Clear any existing masonry structure
        this.clearMasonry();
        
        // Create column containers
        this.createColumns();
        
        // Set up resize handler
        window.addEventListener('resize', this.handleResize);
        
        this.isInitialized = true;
    }
    
    createColumns() {
        // Create masonry container wrapper
        const masonryWrapper = document.createElement('div');
        masonryWrapper.className = 'masonry-wrapper';
        masonryWrapper.style.display = 'flex';
        masonryWrapper.style.gap = `${this.gap}px`;
        masonryWrapper.style.alignItems = 'flex-start';
        
        // Create columns
        for (let i = 0; i < this.columns; i++) {
            const column = document.createElement('div');
            column.className = 'masonry-column';
            column.style.flex = '1';
            column.style.display = 'flex';
            column.style.flexDirection = 'column';
            column.style.gap = `${this.gap}px`;
            
            this.columnElements.push(column);
            masonryWrapper.appendChild(column);
        }
        
        // Insert masonry wrapper after world cycles
        const worldCycles = this.container.querySelector('.world-cycles-container');
        if (worldCycles && worldCycles.nextSibling) {
            this.container.insertBefore(masonryWrapper, worldCycles.nextSibling);
        } else {
            this.container.appendChild(masonryWrapper);
        }
        
        this.masonryWrapper = masonryWrapper;
    }
    
    clearMasonry() {
        // Remove existing masonry wrapper if it exists
        const existing = this.container.querySelector('.masonry-wrapper');
        if (existing) {
            // Move all cards back to main container before removing wrapper
            const cards = existing.querySelectorAll('.card:not(.world-cycles-container .card)');
            cards.forEach(card => {
                if (card.parentNode === existing || card.closest('.masonry-column')) {
                    this.container.appendChild(card);
                }
            });
            existing.remove();
        }
        
        this.columnElements = [];
        this.masonryWrapper = null;
    }
    
    refresh() {
        if (!this.isInitialized || !this.masonryWrapper) {
            console.warn('Masonry not initialized or wrapper missing');
            return;
        }
        
        try {
            // Get all cards that should be in masonry (not world cycles)
            const allCards = Array.from(this.container.children).filter(child => 
                child.classList.contains('card') && 
                !child.closest('.world-cycles-container')
            );
            
            // Instead of clearing columns with innerHTML, move cards back to main container
            this.columnElements.forEach(column => {
                if (column && column.parentNode) {
                    // Move all cards from this column back to main container
                    while (column.firstChild) {
                        this.container.appendChild(column.firstChild);
                    }
                }
            });
            
            // Distribute cards across columns
            allCards.forEach((card, index) => {
                if (card && card.parentNode === this.container) {
                    const columnIndex = this.getShortestColumn();
                    if (this.columnElements[columnIndex]) {
                        this.columnElements[columnIndex].appendChild(card);
                    }
                }
            });
        } catch (error) {
            console.error('Error in masonry refresh:', error);
        }
    }
    
    getShortestColumn() {
        let shortestIndex = 0;
        let shortestHeight = this.getColumnHeight(0);
        
        for (let i = 1; i < this.columnElements.length; i++) {
            const height = this.getColumnHeight(i);
            if (height < shortestHeight) {
                shortestHeight = height;
                shortestIndex = i;
            }
        }
        
        return shortestIndex;
    }
    
    getColumnHeight(columnIndex) {
        const column = this.columnElements[columnIndex];
        if (!column) return 0;
        
        let height = 0;
        const cards = column.children;
        
        for (let i = 0; i < cards.length; i++) {
            height += cards[i].offsetHeight + this.gap;
        }
        
        return height;
    }
    
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            try {
                // Only update columns if the container width actually changed significantly
                if (!this.container || !this.container.offsetWidth) {
                    return;
                }
                
                const containerWidth = this.container.offsetWidth;
                if (this.lastKnownWidth && Math.abs(containerWidth - this.lastKnownWidth) < 50) {
                    // Width change is too small, skip update
                    return;
                }
                
                this.lastKnownWidth = containerWidth;
                this.updateColumns();
            } catch (error) {
                console.error('Error in masonry handleResize:', error);
            }
        }, 800); // Even longer timeout for stability
    }
    
    updateColumns() {
        if (!this.container || !this.container.offsetWidth) {
            console.warn('Container not available for column update');
            return;
        }
        
        const containerWidth = this.container.offsetWidth;
        let newColumns = 5; // Default
        
        // Responsive column calculation
        if (containerWidth < 600) {
            newColumns = 1;
        } else if (containerWidth < 900) {
            newColumns = 2;
        } else if (containerWidth < 1200) {
            newColumns = 3;
        } else if (containerWidth < 1600) {
            newColumns = 4;
        } else {
            newColumns = 5;
        }
        
        if (newColumns !== this.columns) {
            this.columns = newColumns;
            this.clearMasonry();
            this.createColumns();
            this.refresh();
        }
    }
    
    destroy() {
        if (!this.isInitialized) return;
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        
        // Clear masonry and restore original layout
        this.clearMasonry();
        
        this.isInitialized = false;
    }
    
    // Add a new card to the masonry layout
    addCard(card) {
        if (!this.isInitialized || !this.masonryWrapper) return;
        
        // Skip if it's a world cycles card
        if (card.closest('.world-cycles-container')) return;
        
        const columnIndex = this.getShortestColumn();
        this.columnElements[columnIndex].appendChild(card);
    }
}

// Export for use in scripts.js
window.MasonryLayout = MasonryLayout;

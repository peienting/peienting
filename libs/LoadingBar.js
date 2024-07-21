class LoadingBar {
    constructor(options) {
        this.domElement = document.createElement("div");
        this.domElement.style.position = 'fixed';
        this.domElement.style.top = '0';
        this.domElement.style.left = '0';
        this.domElement.style.width = '100%';
        this.domElement.style.height = '100%';
        this.domElement.style.background = 'rgba(0, 0, 0, 0.8)';
        this.domElement.style.display = 'flex';
        this.domElement.style.alignItems = 'center';
        this.domElement.style.justifyContent = 'center';
        this.domElement.style.zIndex = '1111';
        this.domElement.style.transition = 'opacity 0.5s';

        const barContainer = document.createElement("div");
        barContainer.style.background = '#444';
        barContainer.style.width = '50%';
        barContainer.style.minWidth = '250px';
        barContainer.style.borderRadius = '10px';
        barContainer.style.height = '15px';
        barContainer.style.overflow = 'hidden';
        barContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        this.domElement.appendChild(barContainer);

        const bar = document.createElement("div");
        bar.style.background = 'linear-gradient(90deg, #22a, #4a9)';
        bar.style.height = '100%';
        bar.style.width = '0';
        bar.style.borderRadius = '10px';
        bar.style.transition = 'width 0.5s';
        barContainer.appendChild(bar);
        this.progressBar = bar;

        document.body.appendChild(this.domElement);

        // User interaction
        this.domElement.addEventListener('click', () => {
            alert('Loading in progress...');
        });
    }

    set progress(delta) {
        const percent = delta * 100;
        this.progressBar.style.width = `${percent}%`;
    }

    set visible(value) {
        if (value) {
            this.domElement.style.display = 'flex';
            this.domElement.style.opacity = '1';
        } else {
            this.domElement.style.opacity = '0';
            setTimeout(() => {
                this.domElement.style.display = 'none';
            }, 500); // Match the transition duration
        }
    }
}

export { LoadingBar };
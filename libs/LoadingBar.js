class LoadingBar {
    constructor(options) {
        this.domElement = document.createElement("div");
        this.domElement.style.position = 'fixed';
        this.domElement.style.top = '0';
        this.domElement.style.left = '0';
        this.domElement.style.width = '100%';
        this.domElement.style.height = '100%';
        this.domElement.style.background = '#000';
        this.domElement.style.opacity = '0.7';
        this.domElement.style.display = 'flex';
        this.domElement.style.alignItems = 'center';
        this.domElement.style.justifyContent = 'center';
        this.domElement.style.zIndex = '1111';

        const timerElement = document.createElement("div");
        timerElement.style.color = '#fff';
        timerElement.style.fontSize = '20px';
        timerElement.style.marginBottom = '20px';
        this.timerElement = timerElement;
        this.domElement.appendChild(timerElement);

        const barBase = document.createElement("div");
        barBase.style.width = '50%';
        barBase.style.minWidth = '250px';
        barBase.style.background = '#aaa';
        barBase.style.borderRadius = '10px';
        barBase.style.height = '15px';
        this.domElement.appendChild(barBase);

        const bar = document.createElement("div");
        bar.style.background = '#22a';
        bar.style.width = '0';
        bar.style.borderRadius = '10px';
        bar.style.height = '100%';
        bar.style.transition = 'width 0.5s ease';
        this.progressBar = bar;
        barBase.appendChild(bar);

        this.startTime = Date.now();
        this.estimatedTime = options.estimatedTime || 5000; // Estimated time in milliseconds

        document.body.appendChild(this.domElement);
        this.updateTimer();
    }

    updateTimer() {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(this.estimatedTime - elapsedTime, 0);
        this.timerElement.textContent = `Time remaining: ${(remainingTime / 1000).toFixed(1)}s`;
        if (remainingTime > 0) {
            requestAnimationFrame(this.updateTimer.bind(this));
        }
    }

    onprogress(delta) {
        const progress = delta * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    set progress(delta) {
        const percent = delta * 100;
        this.progressBar.style.width = `${percent}%`;
    }

    set visible(value) {
        if (value) {
            this.domElement.style.display = 'flex';
        } else {
            this.domElement.style.display = 'none';
        }
    }
}

export { LoadingBar };
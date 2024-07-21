class VRButton {

    constructor(renderer, options) {
        this.renderer = renderer;
        if (options !== undefined) {
            this.onSessionStart = options.onSessionStart;
            this.onSessionEnd = options.onSessionEnd;
            this.sessionInit = options.sessionInit;
            this.sessionMode = (options.inline !== undefined && options.inline) ? 'inline' : 'immersive-vr';
        } else {
            this.sessionMode = 'immersive-vr';
        }

        if (this.sessionInit === undefined) this.sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor'] };

        if ('xr' in navigator) {

            const button = document.createElement('button');
            button.style.display = 'none';

            navigator.xr.isSessionSupported(this.sessionMode).then((supported) => {
                supported ? this.showEnterVR(button) : this.showWebXRNotFound(button);
                if (options && options.vrStatus) options.vrStatus(supported);
            });

            document.body.appendChild(button);

        } else {

            const message = document.createElement('a');

            if (window.isSecureContext === false) {

                message.href = document.location.href.replace(/^http:/, 'https:');
                message.innerHTML = 'WEBXR NEEDS HTTPS';

            } else {

                message.href = 'https://immersiveweb.dev/';
                message.innerHTML = 'WEBXR NOT AVAILABLE';

            }

            message.style.left = '0px';
            message.style.width = '100%';
            message.style.textDecoration = 'none';

            this.stylizeElement(message, false);
            message.style.bottom = '0px';
            message.style.opacity = '1';

            document.body.appendChild(message);

            if (options.vrStatus) options.vrStatus(false);

        }

    }

    showEnterVR(button) {

        let currentSession = null;
        const self = this;

        this.stylizeElement(button, true, 30, true);

        function onSessionStarted(session) {

            session.addEventListener('end', onSessionEnded);

            self.renderer.xr.setSession(session);
            self.stylizeElement(button, false, 12, true);

            button.textContent = 'EXIT VR';

            currentSession = session;

            if (self.onSessionStart !== undefined) self.onSessionStart();

        }

        function onSessionEnded() {

            currentSession.removeEventListener('end', onSessionEnded);

            self.stylizeElement(button, true, 12, true);
            button.textContent = 'ENTER VR';

            currentSession = null;

            if (self.onSessionEnd !== undefined) self.onSessionEnd();

        }

        //

        button.style.display = '';
        button.style.right = '20px';
        button.style.width = '80px';
        button.style.height = '80px'; // Add height for round button
        button.style.cursor = 'pointer';
        // Change button content to your preference (optional)
        button.innerHTML = 'VR';

        button.onmouseenter = function () {

            button.style.fontSize = '12px';
            button.textContent = (currentSession === null) ? 'ENTER VR' : 'EXIT VR';
            button.style.opacity = '1.0';

        };

        button.onmouseleave = function () {

            button.style.fontSize = '30px';
            button.innerHTML = 'VR';
            button.style.opacity = '0.5';

        };

        button.onclick = function () {

            if (currentSession === null) {

                // WebXR's requestReferenceSpace only works if the corresponding feature
                // was requested at session creation time. For simplicity, just ask for
                // the interesting ones as optional features, but be aware that the
                // requestReferenceSpace call will fail if it turns out to be unavailable.
                // ('local' is always available for immersive sessions and doesn't need to
                // be requested separately.)

                navigator.xr.requestSession(self.sessionMode, self.sessionInit).then(onSessionStarted);



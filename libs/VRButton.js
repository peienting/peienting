/**
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 * @author NikLever / http://niklever.com
 */

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
            button.style.height = '60px'; // Increased height
            button.style.width = '60px'; // Increased width

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

        this.stylizeElement(button, true);

        function onSessionStarted(session) {

            session.addEventListener('end', onSessionEnded);

            self.renderer.xr.setSession(session);
            self.stylizeElement(button, false);

            button.textContent = 'EXIT';

            currentSession = session;

            if (self.onSessionStart !== undefined) self.onSessionStart();

        }

        function onSessionEnded() {

            currentSession.removeEventListener('end', onSessionEnded);

            self.stylizeElement(button, true);
            button.textContent = 'START';

            currentSession = null;

            if (self.onSessionEnd !== undefined) self.onSessionEnd();

        }

        //

        button.style.display = '';
        button.style.right = '50%'; // Center horizontally
        button.style.bottom = '50%'; // Center vertically
        button.style.transform = 'translate(50%, 50%)'; // Center the button
        button.style.cursor = 'pointer';
        button.innerHTML = '<i class="fas fa-vr-cardboard"></i>';

        button.onmouseenter = function () {

            button.style.fontSize = '20px'; // Font size on hover
            button.style.background = '#E91E63'; // Pink color on hover
            button.style.opacity = '1.0';

        };

        button.onmouseleave = function () {

            button.style.fontSize = '18px'; // Original font size
            button.style.background = '#F06292'; // Lighter pink color when not hovered
            button.style.opacity = '0.9';

        };

        button.onclick = function () {

            if (currentSession === null) {

                navigator.xr.requestSession(self.sessionMode, self.sessionInit).then(onSessionStarted);

            } else {

                currentSession.end();

            }

        };

    }

    disableButton(button) {

        button.style.cursor = 'auto';
        button.style.opacity = '0.5';

        button.onmouseenter = null;
        button.onmouseleave = null;

        button.onclick = null;

    }

    showWebXRNotFound(button) {
        this.stylizeElement(button, false);

        this.disableButton(button);

        button.style.display = '';
        button.style.width = '100%';
        button.style.right = '0px';
        button.style.bottom = '0px';
        button.style.border = '';
        button.style.opacity = '1';
        button.style.fontSize = '13px';
        button.textContent = 'VR NOT SUPPORTED';
    }

    stylizeElement(element, active = true) {

        element.style.position = 'absolute';
        element.style.borderRadius = '50%'; // Make button round
        element.style.border = 'none'; // Remove border
        element.style.background = (active) ? '#F06292' : '#C2185B'; // Pink color for active and darker pink for inactive
        element.style.color = '#fff';
        element.style.font = 'normal 18px sans-serif'; // Default font size
        element.style.textAlign = 'center';
        element.style.opacity = '0.9'; // Slightly transparent
        element.style.outline = 'none';
        element.style.zIndex = '999';
        element.style.padding = '10px'; // Padding inside the button
    }

};

export { VRButton };
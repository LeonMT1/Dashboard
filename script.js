document.getElementById("settings-toggle").addEventListener("click", () => {
    const settingsContent = document.getElementById("settings-content");
    settingsContent.style.display = settingsContent.style.display === "none" ? "block" : "none";
});

function updateTime() {
    const timeDisplay = document.getElementById("Berlin_z704");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}`;
}

function saveSettings() {
    const settings = {
        blur: document.getElementById("blur-range").value,
        opacity: document.getElementById("opacity-range").value,
        clockTransparency: document.getElementById("clock-transparency").checked,
        clockColor: document.getElementById("clock-color").value,
        clockFont: document.getElementById("clock-font").value,
        clockSize: document.getElementById("clock-size").value,
        clockHeight: document.getElementById("clock-height").value,
        spotifyUrl: document.getElementById("spotify-url").value
    };
    localStorage.setItem("dashboardSettings", JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem("dashboardSettings"));
    if (savedSettings) {
        document.getElementById("blur-range").value = savedSettings.blur;
        document.getElementById("opacity-range").value = savedSettings.opacity;
        document.getElementById("clock-transparency").checked = savedSettings.clockTransparency;
        document.getElementById("clock-color").value = savedSettings.clockColor;
        document.getElementById("clock-font").value = savedSettings.clockFont;
        document.getElementById("clock-size").value = savedSettings.clockSize;
        document.getElementById("clock-height").value = savedSettings.clockHeight;
        document.getElementById("spotify-url").value = savedSettings.spotifyUrl || "";

        updateWindowStyle();
        updateSpotifyWidget();
    }
}

function updateSpotifyWidget() {
    const spotifyUrl = document.getElementById("spotify-url").value;
    const spotifyWidget = document.getElementById("spotify-widget").querySelector("iframe");
    if (spotifyUrl) {
        spotifyWidget.src = spotifyUrl;
    }
}

document.getElementById("spotify-url").addEventListener("input", () => {
    saveSettings();
    updateSpotifyWidget();
});

function updateWindowStyle() {
    const blurValue = document.getElementById("blur-range").value;
    const opacityValue = document.getElementById("opacity-range").value / 100;
    const clockDisplay = document.getElementById("Berlin_z704");

    document.querySelectorAll('.window').forEach(window => {
        window.style.backdropFilter = `blur(${blurValue}px)`;
        window.style.backgroundColor = `rgba(255, 255, 255, ${opacityValue})`;
    });

    clockDisplay.style.color = document.getElementById("clock-color").value;
    clockDisplay.style.fontFamily = document.getElementById("clock-font").value;
    clockDisplay.style.fontSize = `${document.getElementById("clock-size").value}px`;
    clockDisplay.style.top = `${document.getElementById("clock-height").value}vh`;

    if (document.getElementById("clock-transparency").checked) {
        clockDisplay.style.textShadow = `0 0 ${blurValue}px rgba(51, 51, 51, 0.5)`;
    } else {
        clockDisplay.style.textShadow = "none";
    }
}

document.getElementById("blur-range").addEventListener("input", () => { updateWindowStyle(); saveSettings(); });
document.getElementById("opacity-range").addEventListener("input", () => { updateWindowStyle(); saveSettings(); });
document.getElementById("clock-transparency").addEventListener("change", () => { updateWindowStyle(); saveSettings(); });
document.getElementById("clock-color").addEventListener("input", () => { updateWindowStyle(); saveSettings(); });
document.getElementById("clock-font").addEventListener("change", () => { updateWindowStyle(); saveSettings(); });
document.getElementById("clock-size").addEventListener("input", () => { updateWindowStyle(); saveSettings(); });
document.getElementById("clock-height").addEventListener("input", () => { updateWindowStyle(); saveSettings(); });

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    updateTime();
    setInterval(updateTime, 60000);
});

document.getElementById("export-settings").addEventListener("click", () => {
    const settings = localStorage.getItem("dashboardSettings");
    const blob = new Blob([settings], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "settings.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.getElementById("import-settings-button").addEventListener("click", () => {
    document.getElementById("import-settings").click();
});

document.getElementById("import-settings").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedSettings = JSON.parse(e.target.result);
            localStorage.setItem("dashboardSettings", JSON.stringify(importedSettings));
            loadSettings();
            alert("Einstellungen wurden erfolgreich importiert.");
        } catch (error) {
            alert("Fehler beim Importieren der Einstellungen.");
        }
    };
    reader.readAsText(file);
});

document.getElementById("settings-toggle").addEventListener("click", () => {
    const settingsContent = document.getElementById("settings-content");

    if (settingsContent.classList.contains("open")) {
        settingsContent.classList.remove("open");
    } else {
        updateSettingsStyle();
        settingsContent.classList.add("open");
    }
});

function updateSettingsStyle() {
    const blurValue = document.getElementById("blur-range").value;
    const opacityValue = document.getElementById("opacity-range").value / 100;

    const settingsContent = document.getElementById("settings-content");
    settingsContent.style.backdropFilter = `blur(${blurValue}px)`;
    settingsContent.style.backgroundColor = `rgba(255, 255, 255, ${opacityValue})`;
}

document.getElementById("blur-range").addEventListener("input", () => {
    updateWindowStyle();
    updateSettingsStyle();
    saveSettings();
});
document.getElementById("opacity-range").addEventListener("input", () => {
    updateWindowStyle();
    updateSettingsStyle();
    saveSettings();
});

class DraggableResizable {
    constructor(elementId) {
        this.el = document.getElementById(elementId);
        this.titleBar = this.el.querySelector('.title-bar');
        this.el.style.position = 'absolute';

        this.loadPositionAndSize();
        this.el.addEventListener('mousedown', (e) => this.activateWindow(e));

        this.titleBar.addEventListener('mousedown', this.startDrag.bind(this));
        window.addEventListener('mouseup', this.stopDrag.bind(this));
        window.addEventListener('mousemove', this.drag.bind(this));
    }

    loadPositionAndSize() {
        const savedData = JSON.parse(localStorage.getItem(this.el.id));
        if (savedData) {
            this.el.style.left = savedData.left;
            this.el.style.top = savedData.top;
            this.el.style.width = savedData.width;
            this.el.style.height = savedData.height;
        }
    }

    savePositionAndSize() {
        const data = {
            left: this.el.style.left,
            top: this.el.style.top,
            width: this.el.style.width,
            height: this.el.style.height
        };
        localStorage.setItem(this.el.id, JSON.stringify(data));
    }

    activateWindow(e) {
        e.stopPropagation();
        document.querySelectorAll('.window').forEach(window => {
            window.classList.remove('active');
        });
        this.el.classList.add('active');
    }

    startDrag(e) {
        e.preventDefault();
        this.offsetX = e.clientX - this.el.offsetLeft;
        this.offsetY = e.clientY - this.el.offsetTop;
        this.isDragging = true;
    }

    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.savePositionAndSize();
        }
    }

    drag(e) {
        if (this.isDragging) {
            e.preventDefault();
            this.el.style.left = `${e.clientX - this.offsetX}px`;
            this.el.style.top = `${e.clientY - this.offsetY}px`;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const weatherWindow = new DraggableResizable("weather-window");

    document.body.addEventListener('mousedown', () => {
        document.querySelectorAll('.window').forEach(window => {
            window.classList.remove('active');
        });
    });
});

class Stage {
    constructor() {
        this.renderParam = {
            clearColor: 0x666666,
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.cameraParam = {
            left: -1,
            right: 1,
            top: 1,
            bottom: 1,
            near: 0,
            far: -1
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.isInitialized = false;
    }

    init() {
        this._setScene();
        this._setRender();
        this._setCamera();
        this.isInitialized = true;
    }

    _setScene() {
        this.scene = new THREE.Scene();
    }

    _setRender() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("webgl-canvas")
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(this.renderParam.clearColor));
        this.renderer.setSize(this.renderParam.width, this.renderParam.height);
    }

    _setCamera() {
        if (!this.isInitialized) {
            this.camera = new THREE.OrthographicCamera(
                this.cameraParam.left,
                this.cameraParam.right,
                this.cameraParam.top,
                this.cameraParam.bottom,
                this.cameraParam.near,
                this.cameraParam.far
            );
        }
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        this.camera.aspect = windowWidth / windowHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(windowWidth, windowHeight);
    }

    _render() {
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this._setCamera();
    }

    onRaf() {
        this._render();
    }
}

class Mesh {
    constructor(stage) {
        this.canvas = document.getElementById("webgl-canvas");
        this.uniforms = {
            resolution: { type: "v2", value: [ window.innerWidth, window.innerHeight ] },
            time: { type: "f", value: 0.0 },
            xScale: { type: "f", value: 1.0 },
            yScale: { type: "f", value: 0.5 },
            distortion: { type: "f", value: 0.050 }
        };

        this.stage = stage;
        this.mesh = null;
    }

    init() {
        this._setMesh();
    }

    _setMesh() {
        const position = [
            -1.0, -1.0, 0.0,
             1.0, -1.0, 0.0,
            -1.0,  1.0, 0.0,
             1.0, -1.0, 0.0,
            -1.0,  1.0, 0.0,
             1.0,  1.0, 0.0
        ];

        const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", positions);

        const material = new THREE.RawShaderMaterial({
            vertexShader: document.getElementById("js-vertex-shader").textContent,
            fragmentShader: document.getElementById("js-fragment-shader").textContent,
            uniforms: this.uniforms,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.stage.scene.add(this.mesh);
    }
  
    _render() {
        this.uniforms.time.value += 0.01;
    }

    onRaf() {
        this._render();
    }
}

(() => {
    const stage = new Stage();
    stage.init();

    const mesh = new Mesh(stage);
    mesh.init();

    window.addEventListener("resize", () => {
        stage.onResize();
    });

    const _raf = () => {
        window.requestAnimationFrame(() => {
            stage.onRaf();
            mesh.onRaf();
            _raf();
        });
    };

    _raf();
})();

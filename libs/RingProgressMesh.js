import { Mesh, PlaneBufferGeometry, ShaderMaterial } from './three/three.module.js';

const vshader = `
varying vec2 vUv;
void main() {	
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fshader = `
#define PI2 6.28318530718

uniform float uProgress;
uniform vec4 uBgColor;
uniform vec4 uArcColor;
uniform float uArcThickness;

varying vec2 vUv;

float circle(vec2 pt, vec2 center, float radius){
  pt -= center;
  float len = length(pt);
  return (len<radius) ? 1.0 : 0.0;
}

float arc(vec2 pt, vec2 center, float radius, float percent, float thickness){
  float result = 0.0;

  vec2 d = pt - center;
  float len = length(d);
  float halfRadius = radius * 0.5;

  if ( len<radius && len>halfRadius){
    percent = clamp(percent, 0.0, 1.0);
    float arcAngle = PI2 * percent;

    float angle = mod( arcAngle - atan(d.y, d.x), PI2);
    float edgeWidth = radius * thickness;
    result = (angle<arcAngle) ? smoothstep(halfRadius, halfRadius + edgeWidth, len) - smoothstep(radius-edgeWidth, radius, len) : 0.0;
  }

  return result;
}

void main (void)
{
  vec2 center = vec2(0.5);
  vec4 color = vec4(0.0);
  color += circle(vUv, center, 0.5) * uBgColor;
  color += arc(vUv, center, 0.4, uProgress, uArcThickness) * uArcColor;
  gl_FragColor = color; 
}`;

class RingProgressMesh extends Mesh {
    constructor(scale = 1, bgColor = [0, 0, 0, 1], arcColor = [1, 1, 1, 1], arcThickness = 0.05) {
        super();

        const uniforms = {
            uProgress: { value: 0.0 },
            uBgColor: { value: new THREE.Vector4(...bgColor) },
            uArcColor: { value: new THREE.Vector4(...arcColor) },
            uArcThickness: { value: arcThickness },
        };

        this.material = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vshader,
            fragmentShader: fshader,
            alphaTest: 0.5,
            transparent: true
        });

        this.geometry.dispose();
        this.geometry = new PlaneBufferGeometry();
        this.scale.set(scale, scale, scale);
        this.progress = 1;
    }

    set progress(value) {
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        this.material.uniforms.uProgress.value = value;
    }

    get progress() {
        return this.material.uniforms.uProgress.value;
    }
}

export { RingProgressMesh };
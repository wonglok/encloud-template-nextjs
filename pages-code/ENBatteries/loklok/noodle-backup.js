import {
  BufferAttribute,
  CylinderGeometry,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  RawShaderMaterial,
  TextureLoader,
  Vector2,
} from "three";
import { Geometry } from "three-stdlib/deprecated/Geometry";
import { getID } from "../../ENCloudSDK/ENUtils";

import { FolderName } from "./index.js";
export const title = `${FolderName}.noodle_disable`;

export const effect = async (node) => {
  //
  let info = new TubeGeoInfo({
    count: 60,
    numSides: 3,
    subdivisions: 350,
    openEnded: true,
  });

  let mesh = new Mesh(info.lineGeo, info.lineMat);
  info.lineMat.uniforms.time = { value: 0 };
  node.onLoop((t, dt) => {
    info.lineMat.uniforms.time.value += dt;
  });

  node.userData.scene.add(mesh);
  node.onClean(() => {
    node.userData.scene.remove(mesh);
  });
};

class TubeGeoInfo {
  constructor({
    // parent,
    count = 100,
    numSides = 8,
    subdivisions = 50,
    openEnded = true,
  }) {
    // this.parent = parent;

    // create a base CylinderGeometry which handles UVs, end caps and faces
    const radius = 1;
    const length = 1;
    const newBaseGeometry = new CylinderGeometry(
      radius,
      radius,
      length,
      numSides,
      subdivisions,
      openEnded
    );

    const baseGeometry = new Geometry().fromBufferGeometry(newBaseGeometry);

    // fix the orientation so X can act as arc length
    baseGeometry.rotateZ(Math.PI / 2);

    // compute the radial angle for each position for later extrusion
    const tmpVec = new Vector2();
    const xPositions = [];
    const v3Positions = [];
    const angles = [];
    const uvs = [];
    const vertices = baseGeometry.vertices;
    const faceVertexUvs = baseGeometry.faceVertexUvs[0];

    // Now go through each face and un-index the geometry.
    baseGeometry.faces.forEach((face, i) => {
      const { a, b, c } = face;
      const v0 = vertices[a];
      const v1 = vertices[b];
      const v2 = vertices[c];
      const verts = [v0, v1, v2];
      const faceUvs = faceVertexUvs[i];

      // For each vertex in this face...
      verts.forEach((v, j) => {
        tmpVec.set(v.y, v.z).normalize();

        // the radial angle around the tube
        const angle = Math.atan2(tmpVec.y, tmpVec.x);
        angles.push(angle);

        // "arc length" in range [-0.5 .. 0.5]
        xPositions.push(v.x);

        v3Positions.push(v.x, v.y, v.z);

        // copy over the UV for this vertex
        uvs.push(faceUvs[j].toArray());
      });
    });

    // build typed arrays for our attributes
    const posArray = new Float32Array(xPositions);
    const angleArray = new Float32Array(angles);
    const uvArray = new Float32Array(uvs.length * 2);

    // unroll UVs
    for (let i = 0; i < posArray.length; i++) {
      const [u, v] = uvs[i];
      uvArray[i * 2 + 0] = u;
      uvArray[i * 2 + 1] = v;
    }

    const lineGeo = new InstancedBufferGeometry();
    lineGeo.instanceCount = count;
    lineGeo.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(v3Positions), 3)
    );
    lineGeo.setAttribute("line", new BufferAttribute(posArray, 1));
    lineGeo.setAttribute("angle", new BufferAttribute(angleArray, 1));
    lineGeo.setAttribute("uv", new BufferAttribute(uvArray, 2));

    let offsets = [];
    let ddxyz = Math.ceil(Math.pow(count, 1));
    for (let z = 0; z < ddxyz; z++) {
      for (let y = 0; y < ddxyz; y++) {
        for (let x = 0; x < ddxyz; x++) {
          offsets.push(x / ddxyz, y / ddxyz, z / ddxyz);
        }
      }
    }

    // for (let i = 0; i < this.parent.ctrlPts; i++) {
    //   lineGeo.setAttribute(
    //     "controlPoint" + i,
    //     new InstancedBufferAttribute(
    //       new Float32Array(this.parent[`controlPoint${i}`]),
    //       3
    //     )
    //   );
    // }

    lineGeo.setAttribute(
      "offset",
      new InstancedBufferAttribute(new Float32Array(offsets), 3)
    );

    let uniforms = {
      baseOpacity: { value: 1 },

      thickness: { value: 0.01 },
      spread: { value: 20.03 },
      spheretex: {
        value: new TextureLoader().load("/matcap/golden2.png"),
      },
      time: { value: 0 },
    };

    // dispose old lineGeo since we no longer need it
    baseGeometry.dispose();

    const lineMat = new RawShaderMaterial({
      defines: {
        lengthSegments: subdivisions.toFixed(1),
      },
      transparent: true,
      uniforms,
      vertexShader: /* glsl */ `
        precision highp float;

        #define PI 3.1415926535897932384626433832795

        // attributes of our mesh
        attribute vec3 position;
        attribute float line;
        attribute float angle;
        attribute vec2 uv;
        attribute vec3 offset;

        // built-in uniforms from ThreeJS camera and Object3D
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform mat4 modelMatrix;
        uniform mat3 normalMatrix;

        // uniforms
        uniform float time;
        uniform float thickness;
        uniform float spread;

        uniform vec3 cameraPosition;

        // -----
        #define M_PI 3.1415926535897932384626433832795
        float atan2 (in float y, in float x) {
          bool xgty = (abs(x) > abs(y));
          return mix(M_PI/2.0 - atan(x,y), atan(y,x), float(xgty));
        }

        // ------
        vec3 fromBall (float r, float az, float el) {
          return vec3(
            r * cos(el) * cos(az),
            r * cos(el) * sin(az),
            r * sin(el)
          );
        }

        void toBall (vec3 pos, out float az, out float el) {
          az = atan2(pos.y, pos.x);
          el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
        }

        // float az = 0.0;
        // float el = 0.0;
        // vec3 noiser = vec3(lastVel);
        // toBall(noiser, az, el);
        // lastVel.xyz = fromBall(1.0, az, el);

        vec3 ballify (vec3 pos, float r) {
          float az = atan2(pos.y, pos.x);
          float el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
          return vec3(
            r * cos(el) * cos(az),
            r * cos(el) * sin(az),
            r * sin(el)
          );
        }

        mat3 rotateQ (vec3 axis, float rad) {
          float hr = rad / 2.0;
          float s = sin( hr );
          vec4 q = vec4(axis * s, cos( hr ));
          vec3 q2 = q.xyz + q.xyz;
          vec3 qq2 = q.xyz * q2;
          vec2 qx = q.xx * q2.yz;
          float qy = q.y * q2.z;
          vec3 qw = q.w * q2.xyz;

          return mat3(
            1.0 - (qq2.y + qq2.z),  qx.x - qw.z,            qx.y + qw.y,
            qx.x + qw.z,            1.0 - (qq2.x + qq2.z),  qy - qw.x,
            qx.y - qw.y,            qy + qw.x,              1.0 - (qq2.x + qq2.y)
          );
        }

        mat3 rotateX (float rad) {
          float c = cos(rad);
          float s = sin(rad);
          return mat3(
            1.0, 0.0, 0.0,
            0.0, c, s,
            0.0, -s, c
          );
        }

        mat3 rotateY (float rad) {
          float c = cos(rad);
          float s = sin(rad);
          return mat3(
            c, 0.0, -s,
            0.0, 1.0, 0.0,
            s, 0.0, c
          );
        }

        mat3 rotateZ (float rad) {
          float c = cos(rad);
          float s = sin(rad);
          return mat3(
            c, s, 0.0,
            -s, c, 0.0,
            0.0, 0.0, 1.0
          );
        }


        mat4 rotationX( in float angle ) {
          return mat4(	1.0,		0,			0,			0,
                  0, 	cos(angle),	-sin(angle),		0,
                  0, 	sin(angle),	 cos(angle),		0,
                  0, 			0,			  0, 		1);
        }

        mat4 rotationY( in float angle ) {
          return mat4(	cos(angle),		0,		sin(angle),	0,
                      0,		1.0,			 0,	0,
                  -sin(angle),	0,		cos(angle),	0,
                      0, 		0,				0,	1);
        }

        mat4 rotationZ( in float angle ) {
          return mat4(	cos(angle),		-sin(angle),	0,	0,
                  sin(angle),		cos(angle),		0,	0,
                      0,				0,		1,	0,
                      0,				0,		0,	1);
        }
        mat4 scale(float x, float y, float z){
            return mat4(
                vec4(x,   0.0, 0.0, 0.0),
                vec4(0.0, y,   0.0, 0.0),
                vec4(0.0, 0.0, z,   0.0),
                vec4(0.0, 0.0, 0.0, 1.0)
            );
        }

        mat4 translate(float x, float y, float z){
            return mat4(
                vec4(1.0, 0.0, 0.0, 0.0),
                vec4(0.0, 1.0, 0.0, 0.0),
                vec4(0.0, 0.0, 1.0, 0.0),
                vec4(x,   y,   z,   1.0)
            );
        }

        vec3 spherical (float r, float phi, float theta) {
          return vec3(
            r * cos(phi) * cos(theta),
            r * cos(phi) * sin(theta),
            r * sin(phi)
          );
        }

        // line
        // vec3 sample (float t) {
        //   float x = t * 2.0 - 1.0;
        //   float y = sin(t + time);
        //   return vec3(x, y, 0.0);
        // }

        // dough nut
        // vec3 sample (float t) {
        //   float angle = t * 2.0 * PI;
        //   vec2 rot = vec2(cos(angle), sin(angle));
        //   return vec3(rot, 0.0);
        // }


        // vec3 sample (float t) {
        //   float beta = t * PI;

        //   float r = sin(beta * 1.0 + sin(time)) * 5.25;
        //   float phi = sin(beta * 9.0 + time);
        //   float theta = 6.0 * beta;

        //   return spherical(r, phi, theta);
        // }

        // vec3 sample (float t) {
        //   float beta = t * PI;

        //   float r = sin(beta * 1.0 + time * 0.1) * 6.25;
        //   float phi = sin(beta * 6.0 + time * 0.0);
        //   float theta = beta * 2.0;

        //   return spherical(r, phi, theta);
        // }

        vec3 sample (float t) {
          float beta = t * PI;

          float r = sin(beta * 1.0) * 6.75;
          float phi = sin(beta * 6.0 + sin(time * 0.1));
          float theta = 4.0 * beta;

          return spherical(r, phi, theta);
        }

        // vec3 sample (float t) {
        //   vec3 pos = vec3((t - 0.5) * 2500.0);
        //   float pX = pos.x;
        //   float pY = pos.y;
        //   float pZ = pos.y;
        //   float piz = 0.001 * 2.0 * 3.14159265;

        //   pos.xyz = rotateQ(normalize(vec3(1.0, pY * piz, 1.0)), time + pY * piz) * rotateY(time + pZ * piz) * pos.xyz;
        //   pos.xyz = rotateQ(normalize(vec3(1.0, pZ * piz, 1.0)), time + pY * piz) * rotateZ(time + pZ * piz) * pos.xyz;
        //   pos.xyz = rotateQ(normalize(vec3(1.0, pZ * piz, 1.0)), time + pX * piz) * rotateY(time + pY * piz) * pos.xyz;

        //   // pos.z += sin(time  + pX * piz * 0.333) * pos.y;

        //   pos.xyz *= 0.00055;

        //   float ttTime = time * 0.5;

        //   pos.xyz *= rotateX(length(pos.xyz) + ttTime);
        //   pos.xyz *= rotateY(length(pos.xyz) + ttTime);
        //   pos.xyz *= rotateZ(length(pos.xyz) + ttTime);

        //   pos.xyz += ballify(pos.xyz, length(pos.xyz) * 0.25 + 0.75 * length(pos.xyz) * sin(ttTime));

        //   return pos.xyz;
        // }

        void createTube (float t, vec2 volume, out vec3 pos, out vec3 normal) {
          // find next sample along curve
          float nextT = t + (1.0 / lengthSegments);

          // sample the curve in two places
          vec3 cur = sample(t);
          vec3 next = sample(nextT);

          // compute the Frenet-Serret frame
          vec3 T = normalize(next - cur);
          vec3 B = normalize(cross(T, next + cur));
          vec3 N = -normalize(cross(B, T));

          // extrude outward to create a tube
          float tubeAngle = angle;
          float circX = cos(tubeAngle);
          float circY = sin(tubeAngle);

          // compute position and normal
          normal.xyz = normalize(B * circX + N * circY);
          pos.xyz = cur + B * volume.x * circX + N * volume.y * circY;
        }

        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main (void) {
          // if (offset.y > maxLines) {
          //   gl_Position = vec4(0.0);
          //   return;
          // }

          mat4 flowerSpread = rotationZ(spread * 4.0 * offset.x * PI * 2.0);
          mat4 offsetSpread = translate(0.0, 0.0, 0.0);
          float evenTicker = 2.4;

          // [-0.5, ... 0.5]
          float t = (line + 0.5);
          vec2 volume = vec2(thickness * evenTicker + thickness * evenTicker * sin(position) * 0.03);
          vec3 transformed;
          vec3 objectNormal;
          createTube(t, volume, transformed, objectNormal);

          // pass the normal and UV along
          vec3 transformedNormal = normalMatrix * normalize(objectNormal);

          vNormal = normalize(transformedNormal);
          // vUv = uv.xy; // swizzle this to match expectations

          vec4 newObjPos = flowerSpread * offsetSpread * vec4(transformed, 1.0);
          vec4 mvPosition = modelViewMatrix * newObjPos;
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;

          // matcap
          // vViewPosition = cameraPosition.xyz;
          vec3 viewDir = normalize( vViewPosition );
          vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
          vec3 y = cross( viewDir, x );
          vec2 uv = vec2( dot( x, vNormal ), dot( y, vNormal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks

          // vUv = uv;
        }
      `,

      fragmentShader: /* glsl */ `
        precision highp float;

        uniform float baseOpacity;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        uniform sampler2D spheretex;

        void main (void) {
          vec3 viewDir = normalize( vViewPosition );
          vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
          vec3 y = cross( viewDir, x );
          vec2 smoothUV = vec2( dot( x, vNormal ), dot( y, vNormal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks

          vec4 color = texture2D(spheretex, smoothUV);

          gl_FragColor = vec4(vec3(color), baseOpacity);
        }

      `,
    });

    return {
      lineGeo,
      lineMat,
      // ball: ballGeo,
    };
  }
}

"use client";

import { useEffect, useRef } from "react";

const SIM = 256;

const COMPUTE = /* wgsl */ `
struct P {
  w: f32, h: f32, t: f32, dt: f32,
  mx: f32, my: f32, mdx: f32, mdy: f32,
}
@group(0) @binding(0) var<uniform> p: P;
@group(0) @binding(1) var<storage, read> vi: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> vo: array<vec2f>;
@group(0) @binding(3) var<storage, read> di: array<vec4f>;
@group(0) @binding(4) var<storage, read_write> dout: array<vec4f>;

fn id(x: i32, y: i32) -> u32 {
  return u32(clamp(y,0,i32(p.h)-1)) * u32(p.w) + u32(clamp(x,0,i32(p.w)-1));
}
fn sv(q: vec2f) -> vec2f { return vi[id(i32(q.x),i32(q.y))]; }
fn sd(q: vec2f) -> vec4f { return di[id(i32(q.x),i32(q.y))]; }

fn hsv(h: f32, s: f32, v: f32) -> vec3f {
  let c=v*s; let hp=fract(h)*6.0; let x=c*(1.0-abs(hp%2.0-1.0)); let m=v-c;
  var r=vec3f(0.0);
  if(hp<1.0){r=vec3f(c,x,0);}else if(hp<2.0){r=vec3f(x,c,0);}
  else if(hp<3.0){r=vec3f(0,c,x);}else if(hp<4.0){r=vec3f(0,x,c);}
  else if(hp<5.0){r=vec3f(x,0,c);}else{r=vec3f(c,0,x);}
  return r+m;
}

/* ── hash noise for turbulence ── */
fn hash21(p: vec2f) -> f32 {
  var q = fract(p * vec2f(123.34, 456.21));
  q += dot(q, q + 45.32);
  return fract(q.x * q.y);
}
fn hash22(p: vec2f) -> vec2f {
  let n = vec2f(dot(p,vec2f(127.1,311.7)), dot(p,vec2f(269.5,183.3)));
  return fract(sin(n)*43758.5453) * 2.0 - 1.0;
}

/* ── simplex-ish noise ── */
fn noise2(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f*f*(3.0-2.0*f);
  let a = hash21(i);
  let b = hash21(i+vec2f(1,0));
  let c = hash21(i+vec2f(0,1));
  let d = hash21(i+vec2f(1,1));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

fn fbm(p: vec2f, t: f32) -> f32 {
  var v = 0.0;
  var a = 0.5;
  var q = p;
  for (var i=0; i<4; i++) {
    v += a * noise2(q + t*0.3);
    q = q * 2.01 + vec2f(1.7, 1.2);
    a *= 0.5;
  }
  return v;
}

fn curl(p: vec2f, t: f32) -> vec2f {
  let e = 0.5;
  let dx = fbm(p+vec2f(e,0),t) - fbm(p-vec2f(e,0),t);
  let dy = fbm(p+vec2f(0,e),t) - fbm(p-vec2f(0,e),t);
  return vec2f(dy, -dx) / (2.0*e);
}

@compute @workgroup_size(8,8)
fn main(@builtin(global_invocation_id) g: vec3u) {
  let w=u32(p.w); let h=u32(p.h);
  if(g.x>=w||g.y>=h){return;}
  let i=g.y*w+g.x;
  let pos=vec2f(f32(g.x),f32(g.y));
  let res=vec2f(p.w,p.h);

  let vel=vi[i];
  let bp=pos-vel*p.dt*12.0;
  var nv=sv(bp)*0.995;
  var nd=sd(bp)*0.992;

  /* ── curl noise turbulence field ── */
  let uv = pos / res;
  let cn = curl(uv * 6.0, p.t * 0.8) * 45.0;
  nv += cn * 0.012;

  /* ── noise-based dye injection ── */
  let n = fbm(uv * 4.0 + p.t * 0.15, p.t);
  if (n > 0.55) {
    let s = (n - 0.55) * 4.0;
    let hu = fract(p.t * 0.06 + uv.x * 0.3 + uv.y * 0.2);
    nd += vec4f(hsv(hu, 0.9, 0.8) * s * 0.08, s * 0.02);
  }

  /* ── mouse interaction — stronger, wider ── */
  let mp=vec2f(p.mx,p.my)*res;
  let md=vec2f(p.mdx,p.mdy)*res;
  let mD=length(pos-mp);
  let mR=res.x*0.18;
  if(mD<mR && length(md)>0.2){
    let s=exp(-mD*mD/(mR*mR*0.15));
    nv+=md*s*0.8;
    let hu=fract(p.t*0.12+mD/mR*0.6);
    nd+=vec4f(hsv(hu,1.0,1.0)*s*3.0,s*1.5);
  }

  /* ── 12 orbiting rainbow vortices ── */
  for(var j=0u;j<12u;j++){
    let a=f32(j)*0.524+p.t*(0.15+f32(j)*0.035);
    let r=res.x*(0.06+f32(j)*0.05);
    let c=res*0.5+vec2f(cos(a),sin(a))*r;
    let d=length(pos-c);
    let sr=res.x*0.06;
    if(d<sr){
      let s=exp(-d*d/(sr*sr*0.2))*0.2;
      let fa=a+1.5708;
      nv+=vec2f(cos(fa),sin(fa))*s*90.0;
      let hu=fract(f32(j)/12.0+p.t*0.05);
      nd+=vec4f(hsv(hu,1.0,1.0)*s*2.5,s*0.8);
    }
  }

  /* ── occasional burst emitters ── */
  for(var k=0u;k<3u;k++){
    let phase = p.t * 0.3 + f32(k) * 2.094;
    let burst = max(sin(phase), 0.0);
    if (burst > 0.7) {
      let bx = res.x * (0.2 + f32(k) * 0.3);
      let by = res.y * (0.3 + sin(p.t + f32(k)) * 0.2);
      let bd = length(pos - vec2f(bx, by));
      let br = res.x * 0.08;
      if (bd < br) {
        let bs = exp(-bd*bd/(br*br*0.3)) * (burst - 0.7) * 3.0;
        let ba = p.t * 2.0 + f32(k) * 1.047;
        nv += vec2f(cos(ba), sin(ba)) * bs * 60.0;
        let hu = fract(f32(k)/3.0 + p.t * 0.08);
        nd += vec4f(hsv(hu, 1.0, 1.0) * bs * 2.0, bs);
      }
    }
  }

  vo[i]=nv;
  dout[i]=clamp(nd,vec4f(0.0),vec4f(3.0));
}`;

const RENDER = /* wgsl */ `
struct R { w:f32, h:f32, t:f32, pad:f32 }
@group(0) @binding(0) var<uniform> r: R;
@group(0) @binding(1) var<storage, read> dye: array<vec4f>;

struct V { @builtin(position) p:vec4f, @location(0) uv:vec2f }

@vertex fn vs(@builtin(vertex_index) i:u32)->V{
  var q=array<vec2f,4>(vec2f(-1,-1),vec2f(1,-1),vec2f(-1,1),vec2f(1,1));
  var o:V; o.p=vec4f(q[i],0,1); o.uv=q[i]*0.5+0.5; o.uv.y=1.0-o.uv.y; return o;
}

fn s(x:i32,y:i32)->vec4f{
  return dye[u32(clamp(y,0,i32(r.h)-1))*u32(r.w)+u32(clamp(x,0,i32(r.w)-1))];
}

/* ── hash for grain ── */
fn hash(p: vec2f) -> f32 {
  var q = fract(p * vec2f(443.897, 441.423));
  q += dot(q, q + 19.19);
  return fract(q.x * q.y);
}

@fragment fn fs(v:V)->@location(0) vec4f{
  let px=i32(v.uv.x*r.w); let py=i32(v.uv.y*r.h);

  /* ── sharper 3x3 kernel with center boost ── */
  var c=s(px,py).rgb*0.40;
  c+=s(px+1,py).rgb*0.10; c+=s(px-1,py).rgb*0.10;
  c+=s(px,py+1).rgb*0.10; c+=s(px,py-1).rgb*0.10;
  c+=s(px+1,py+1).rgb*0.05; c+=s(px-1,py-1).rgb*0.05;
  c+=s(px+1,py-1).rgb*0.05; c+=s(px-1,py+1).rgb*0.05;

  /* ── contrast boost — S-curve ── */
  c = c * 1.3;
  c = c * c * (3.0 - 2.0 * c);

  /* ── subtle chromatic aberration ── */
  let ca = 1.5 / r.w;
  let cr = s(i32(v.uv.x*r.w + ca*r.w), py).r * 0.15;
  let cb = s(i32(v.uv.x*r.w - ca*r.w), py).b * 0.15;
  c.r += cr;
  c.b += cb;

  /* ── film grain ── */
  let grain = (hash(v.uv * 1000.0 + r.t * 100.0) - 0.5) * 0.06;
  c += grain;

  /* ── vignette — tighter ── */
  let d=length(v.uv-0.5);
  let vig=smoothstep(0.85,0.1,d);

  let lum=max(c.r,max(c.g,c.b));
  return vec4f(c*vig, lum*0.35);
}`;

export function FluidCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!navigator.gpu) return;
    const canvas = ref.current;
    if (!canvas) return;

    let dead = false;
    let af = 0;
    const m = { x: 0.5, y: 0.5, dx: 0, dy: 0 };

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      m.dx += nx - m.x;
      m.dy += ny - m.y;
      m.x = nx;
      m.y = ny;
    };
    window.addEventListener("mousemove", onMove);

    canvas.width = Math.floor(window.innerWidth * 0.5);
    canvas.height = Math.floor(window.innerHeight * 0.5);

    const go = async () => {
      try {
        const adapter = await navigator.gpu?.requestAdapter();
        if (!adapter || dead) return;
        const dev = await adapter.requestDevice();
        if (dead) {
          dev.destroy();
          return;
        }

        const ctx = canvas.getContext("webgpu");
        if (!ctx) return;
        const fmt = navigator.gpu?.getPreferredCanvasFormat() ?? "bgra8unorm";
        ctx.configure({ device: dev, format: fmt, alphaMode: "premultiplied" });

        const N = SIM * SIM;
        const vb = [0, 1].map(() =>
          dev.createBuffer({ size: N * 8, usage: GPUBufferUsage.STORAGE }),
        );
        const db = [0, 1].map(() =>
          dev.createBuffer({ size: N * 16, usage: GPUBufferUsage.STORAGE }),
        );
        const ub = dev.createBuffer({
          size: 32,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const rb = dev.createBuffer({
          size: 16,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const cp = dev.createComputePipeline({
          layout: "auto",
          compute: { module: dev.createShaderModule({ code: COMPUTE }), entryPoint: "main" },
        });
        const rp = dev.createRenderPipeline({
          layout: "auto",
          vertex: { module: dev.createShaderModule({ code: RENDER }), entryPoint: "vs" },
          fragment: {
            module: dev.createShaderModule({ code: RENDER }),
            entryPoint: "fs",
            targets: [
              {
                format: fmt,
                blend: {
                  color: {
                    srcFactor: "src-alpha",
                    dstFactor: "one-minus-src-alpha",
                    operation: "add",
                  },
                  alpha: {
                    srcFactor: "one",
                    dstFactor: "one-minus-src-alpha",
                    operation: "add",
                  },
                },
              },
            ],
          },
          primitive: { topology: "triangle-strip" },
        });

        const cbg = [0, 1].map((s) =>
          dev.createBindGroup({
            layout: cp.getBindGroupLayout(0),
            entries: [
              { binding: 0, resource: { buffer: ub } },
              { binding: 1, resource: { buffer: vb[s] } },
              { binding: 2, resource: { buffer: vb[1 - s] } },
              { binding: 3, resource: { buffer: db[s] } },
              { binding: 4, resource: { buffer: db[1 - s] } },
            ],
          }),
        );
        const rbg = [0, 1].map((i) =>
          dev.createBindGroup({
            layout: rp.getBindGroupLayout(0),
            entries: [
              { binding: 0, resource: { buffer: rb } },
              { binding: 1, resource: { buffer: db[i] } },
            ],
          }),
        );

        let fr = 0;
        const t0 = performance.now();

        const loop = () => {
          if (dead) return;
          const t = (performance.now() - t0) / 1000;
          const s = fr % 2;
          const d = 1 - s;

          dev.queue.writeBuffer(
            ub,
            0,
            new Float32Array([SIM, SIM, t, 1 / 60, m.x, m.y, m.dx, m.dy]),
          );
          dev.queue.writeBuffer(rb, 0, new Float32Array([SIM, SIM, t, 0]));

          const enc = dev.createCommandEncoder();

          const cpass = enc.beginComputePass();
          cpass.setPipeline(cp);
          cpass.setBindGroup(0, cbg[s]);
          cpass.dispatchWorkgroups(SIM / 8, SIM / 8);
          cpass.end();

          const rpass = enc.beginRenderPass({
            colorAttachments: [
              {
                view: ctx.getCurrentTexture().createView(),
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                loadOp: "clear",
                storeOp: "store",
              },
            ],
          });
          rpass.setPipeline(rp);
          rpass.setBindGroup(0, rbg[d]);
          rpass.draw(4);
          rpass.end();

          dev.queue.submit([enc.finish()]);
          m.dx *= 0.82;
          m.dy *= 0.82;
          fr++;
          af = requestAnimationFrame(loop);
        };
        loop();
      } catch {
        /* WebGPU not available — fallback to CSS mesh */
      }
    };
    go();

    return () => {
      dead = true;
      cancelAnimationFrame(af);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

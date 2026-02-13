/* Minimal WebGPU type stubs for fluid-canvas.tsx */

interface GPU {
  requestAdapter(): Promise<GPUAdapter | null>;
  getPreferredCanvasFormat(): GPUTextureFormat;
}

interface GPUAdapter {
  requestDevice(): Promise<GPUDevice>;
}

type GPUTextureFormat = string;

interface GPUDevice {
  createBuffer(desc: GPUBufferDescriptor): GPUBuffer;
  createShaderModule(desc: { code: string }): GPUShaderModule;
  createComputePipeline(desc: GPUComputePipelineDescriptor): GPUComputePipeline;
  createRenderPipeline(desc: GPURenderPipelineDescriptor): GPURenderPipeline;
  createBindGroup(desc: GPUBindGroupDescriptor): GPUBindGroup;
  createCommandEncoder(): GPUCommandEncoder;
  queue: GPUQueue;
  destroy(): void;
}

interface GPUBuffer {
  size: number;
}

interface GPUBufferDescriptor {
  size: number;
  usage: number;
}

declare const GPUBufferUsage: {
  STORAGE: number;
  UNIFORM: number;
  COPY_DST: number;
};

// biome-ignore lint/complexity/noBannedTypes: opaque WebGPU handle
type GPUShaderModule = {};

interface GPUComputePipeline {
  getBindGroupLayout(index: number): GPUBindGroupLayout;
}

interface GPURenderPipeline {
  getBindGroupLayout(index: number): GPUBindGroupLayout;
}

// biome-ignore lint/complexity/noBannedTypes: opaque WebGPU handle
type GPUBindGroupLayout = {};

interface GPUComputePipelineDescriptor {
  layout: string | GPUBindGroupLayout;
  compute: { module: GPUShaderModule; entryPoint: string };
}

interface GPURenderPipelineDescriptor {
  layout: string | GPUBindGroupLayout;
  vertex: { module: GPUShaderModule; entryPoint: string };
  fragment: {
    module: GPUShaderModule;
    entryPoint: string;
    targets: Array<{
      format: GPUTextureFormat;
      blend?: {
        color: GPUBlendComponent;
        alpha: GPUBlendComponent;
      };
    }>;
  };
  primitive?: { topology: string };
}

interface GPUBlendComponent {
  srcFactor: string;
  dstFactor: string;
  operation: string;
}

interface GPUBindGroupDescriptor {
  layout: GPUBindGroupLayout;
  entries: Array<{
    binding: number;
    resource: { buffer: GPUBuffer };
  }>;
}

// biome-ignore lint/complexity/noBannedTypes: opaque WebGPU handle
type GPUBindGroup = {};

interface GPUCommandEncoder {
  beginComputePass(): GPUComputePassEncoder;
  beginRenderPass(desc: GPURenderPassDescriptor): GPURenderPassEncoder;
  finish(): GPUCommandBuffer;
}

interface GPURenderPassDescriptor {
  colorAttachments: Array<{
    view: GPUTextureView;
    clearValue: { r: number; g: number; b: number; a: number };
    loadOp: string;
    storeOp: string;
  }>;
}

interface GPUComputePassEncoder {
  setPipeline(pipeline: GPUComputePipeline): void;
  setBindGroup(index: number, bindGroup: GPUBindGroup): void;
  dispatchWorkgroups(x: number, y: number): void;
  end(): void;
}

interface GPURenderPassEncoder {
  setPipeline(pipeline: GPURenderPipeline): void;
  setBindGroup(index: number, bindGroup: GPUBindGroup): void;
  draw(count: number): void;
  end(): void;
}

// biome-ignore lint/complexity/noBannedTypes: opaque WebGPU handle
type GPUCommandBuffer = {};

interface GPUQueue {
  writeBuffer(buffer: GPUBuffer, offset: number, data: Float32Array): void;
  submit(buffers: GPUCommandBuffer[]): void;
}

// biome-ignore lint/complexity/noBannedTypes: opaque WebGPU handle
type GPUTextureView = {};

interface GPUTexture {
  createView(): GPUTextureView;
}

interface GPUCanvasContext {
  configure(config: { device: GPUDevice; format: GPUTextureFormat; alphaMode: string }): void;
  getCurrentTexture(): GPUTexture;
}

interface Navigator {
  gpu?: GPU;
}

interface HTMLCanvasElement {
  getContext(contextId: "webgpu"): GPUCanvasContext | null;
}

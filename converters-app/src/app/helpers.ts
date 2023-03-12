import * as Generation from "../generation/generation_pb";
import { GenerationServiceClient } from "../generation/generation_pb_service";
import { grpc as GRPCWeb } from "@improbable-eng/grpc-web";
import { Buffer } from 'buffer';
import {Injector} from '@angular/core'

import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import { ElementRef } from "@angular/core";
import { TextToImageService } from "./text-to-image/text-to-image.service";
import { AppInjector } from "./app.module";
const fs = require('./fs');

export function executeRequest(text: any, el: ElementRef): Promise<any|void> {
  
  // This is a NodeJS-specific requirement - browsers implementations should omit this line.
// GRPCWeb.setDefaultTransport(NodeHttpTransport());

// Authenticate using your API key, don't commit your key to a public repository!
const metadata = new GRPCWeb.Metadata();
metadata.set("Authorization", "Bearer sk-JkPSOaColkQ5gcCScuHBD8ZRWhQKNOR4QvjSk8D7FM97e7ZJ");

// Create a generation client to use with all future requests
const client = new GenerationServiceClient("https://grpc.stability.ai", {});

const request = buildGenerationRequest("stable-diffusion-512-v2-1", {
  type: "text-to-image",
  prompts: [
    {
      text: text,
    },
  ],
  width: 512,
  height: 512,
  samples: 1,
  cfgScale: 13,
  steps: 25,
  sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
});

return executeGenerationRequest(client, request, metadata)
  .then(onGenerationComplete)
  .catch((error) => {
    console.error("Failed to make text-to-image request:", error);
  });
}


export type GenerationTextPrompt = {
  /** The text prompt, maximum of 2000 characters. */
  text: string;
  /** The weight of the prompt, use negative values for negative prompts. */
  weight?: number;
};

export type CommonGenerationParams = {
  prompts: GenerationTextPrompt[];
  height?: number;
  width?: number;
  samples?: number;
  steps?: number;
  cfgScale?: number;
  sampler?: Generation.DiffusionSamplerMap[keyof Generation.DiffusionSamplerMap];
  clipGuidancePreset?: Generation.GuidancePresetMap[keyof Generation.GuidancePresetMap];
  seed?: number;
};

export type GenerationRequestParams = CommonGenerationParams &
  (
    | { type: "text-to-image" }
    | {
        type: "image-to-image";
        initImage: Buffer;
        stepScheduleStart: number;
        stepScheduleEnd?: number;
      }
    | {
        type: "image-to-image-masking";
        initImage: Buffer;
        maskImage: Buffer;
      }
  );

export type GenerationRequest = Generation.Request;

export type GenerationResponse = Error | GenerationArtifacts;

export type GenerationArtifacts = {
  readonly imageArtifacts: Generation.Artifact[];
  readonly filteredArtifacts: Generation.Artifact[];
};

/** Builds a generation request for a specified engine with the specified parameters. */
export function buildGenerationRequest(
  engineID: string,
  params: GenerationRequestParams
): GenerationRequest {
  const imageParams = new Generation.ImageParameters();
  params.width && imageParams.setWidth(params.width);
  params.height && imageParams.setHeight(params.height);

  // Set the number of images to generate (Default 1)
  params.samples && imageParams.setSamples(params.samples);

  // Set the steps (Default 30)
  // Represents the amount of inference steps performed on image generation.
  params.steps && imageParams.setSteps(params.steps);

  // Set the seed (Default 0)
  // Including a seed will cause the results to be deterministic.
  // Omitting the seed or setting it to `0` will do the opposite.
  params.seed && imageParams.addSeed(params.seed);

  // Set the sampler (Default 'automatic')
  // Omitting this value enables 'automatic' mode where we choose the best sampler for you based
  // on the current payload. For example, since CLIP guidance only works on ancestral samplers,
  // when CLIP guidance is enabled, we will automatically choose an ancestral sampler for you.
  if (params.sampler) {
    const transformType = new Generation.TransformType();
    transformType.setDiffusion(params.sampler);
    imageParams.setTransform(transformType);
  }

  // Set the Engine
  // At the time of writing, valid engines are:
  //  stable-diffusion-v1,
  //  stable-diffusion-v1-5
  //  stable-diffusion-512-v2-0
  //  stable-diffusion-768-v2-0
  //  stable-diffusion-512-v2-1
  //  stable-diffusion-768-v2-1
  //  stable-inpainting-v1-0
  //  stable-inpainting-512-v2-0
  const request = new Generation.Request();
  request.setEngineId(engineID);
  request.setRequestedType(Generation.ArtifactType.ARTIFACT_IMAGE);
  request.setClassifier(new Generation.ClassifierParameters());

  // Set the CFG scale (Default 7)
  // Influences how strongly your generation is guided to match your prompt.  Higher values match closer.
  const samplerParams = new Generation.SamplerParameters();
  params.cfgScale && samplerParams.setCfgScale(params.cfgScale);

  const stepParams = new Generation.StepParameter();
  stepParams.setScaledStep(0);
  stepParams.setSampler(samplerParams);

  const scheduleParams = new Generation.ScheduleParameters();
  if (params.type === "image-to-image") {
    // If we're doing image-to-image generation then we need to configure
    // how much influence the initial image has on the diffusion process
    scheduleParams.setStart(params.stepScheduleStart);
    if (params.stepScheduleEnd) {
      scheduleParams.setEnd(params.stepScheduleEnd);
    }
  } else if (params.type === "image-to-image-masking") {
    // Step schedule start is always 1 for masking requests
    scheduleParams.setStart(1);
  }

  stepParams.setSchedule(scheduleParams);

  // Set CLIP Guidance (Default: None)
  // NOTE: This only works with ancestral samplers. Omitting the sampler parameter above will ensure
  // that we automatically choose an ancestral sampler for you when CLIP guidance is enabled.
  if (params.clipGuidancePreset) {
    const guidanceParameters = new Generation.GuidanceParameters();
    guidanceParameters.setGuidancePreset(
      Generation.GuidancePreset.GUIDANCE_PRESET_FAST_BLUE
    );
    stepParams.setGuidance(guidanceParameters);
  }

  imageParams.addParameters(stepParams);
  request.setImage(imageParams);

  // Set our text prompts
  params.prompts.forEach((textPrompt) => {
    const prompt = new Generation.Prompt();
    prompt.setText(textPrompt.text);

    // If provided, set the prompt's weight (use negative values for negative weighting)
    if (textPrompt.weight) {
      const promptParameters = new Generation.PromptParameters();
      promptParameters.setWeight(textPrompt.weight);
      prompt.setParameters(promptParameters);
    }

    request.addPrompt(prompt);
  });

  // Add image prompts if we're doing some kind of image-to-image generation
  if (params.type === "image-to-image") {
    request.addPrompt(createInitImagePrompt(params.initImage));
  } else if (params.type === "image-to-image-masking") {
    request.addPrompt(createInitImagePrompt(params.initImage));
    request.addPrompt(createMaskImagePrompt(params.maskImage));
  }

  return request;
}

function createInitImagePrompt(imageBinary: Buffer): Generation.Prompt {
  const initImageArtifact = new Generation.Artifact();
  initImageArtifact.setBinary(imageBinary);
  initImageArtifact.setType(Generation.ArtifactType.ARTIFACT_IMAGE);

  const initImageParameters = new Generation.PromptParameters();
  initImageParameters.setInit(true);

  const initImagePrompt = new Generation.Prompt();
  initImagePrompt.setParameters(initImageParameters);
  initImagePrompt.setArtifact(initImageArtifact);

  return initImagePrompt;
}

function createMaskImagePrompt(imageBinary: Buffer): Generation.Prompt {
  const maskImageArtifact = new Generation.Artifact();
  maskImageArtifact.setBinary(imageBinary);
  maskImageArtifact.setType(Generation.ArtifactType.ARTIFACT_MASK);

  const maskImagePrompt = new Generation.Prompt();
  maskImagePrompt.setArtifact(maskImageArtifact);

  return maskImagePrompt;
}

/** Executes a GenerationRequest, abstracting the gRPC streaming result behind a Promise */
export async function executeGenerationRequest(
  generationClient: GenerationServiceClient,
  request: GenerationRequest,
  metadata: GRPCWeb.Metadata
): Promise<GenerationResponse> {
  try {
    const stream = generationClient.generate(request, metadata);
    const answers = await new Promise<Generation.Answer[]>(
      (resolve, reject) => {
        const answers = new Array<Generation.Answer>();

        stream.on("data", (data) => answers.push(data));
        stream.on("end", () => resolve(answers));
        stream.on("status", (status) => {
          if (status.code === 0) return;
          reject(status.details);
        });
      }
    );

    return extractArtifacts(answers);
  } catch (err) {
    return err instanceof Error ? err : new Error(JSON.stringify(err));
  }
}

function extractArtifacts(answers: Generation.Answer[]): GenerationArtifacts {
  const filteredArtifacts = new Array<Generation.Artifact>();
  const imageArtifacts = new Array<Generation.Artifact>();

  for (const answer of answers) {
    for (const artifact of answer.getArtifactsList()) {
      if (artifact.getType() === Generation.ArtifactType.ARTIFACT_IMAGE) {
        if (artifact.getFinishReason() === Generation.FinishReason.FILTER) {
          // Oh no! We were filtered by the NSFW classifier!
          filteredArtifacts.push(artifact);
        } else {
          // We got an image!
          imageArtifacts.push(artifact);
        }
      }
    }
  }

  return { filteredArtifacts, imageArtifacts };
}

/** Generation completion handler - replace this with your own logic  */
export function onGenerationComplete(response: GenerationResponse) : any{
  let url = "";
  let blob: any;
  if (response instanceof Error) {
    console.error("Generation failed", response);
    return "";
  }

  console.log(
    `${
      response.imageArtifacts.length + response.filteredArtifacts.length
    } artifacts were generated.`
  );

  // Do something with the filtered artifacts
  if (response.filteredArtifacts.length > 0) {
    console.log(
      `${response.filteredArtifacts.length} artifact` +
        `${response.filteredArtifacts.length === 1 ? "s" : ""}` +
        ` were filtered by the NSFW classifier`
    );
  }

  // Do something with the successful image artifacts
  response.imageArtifacts.forEach((artifact: Generation.Artifact) => {
    try {
      //window.open(artifact.getBinary_asB64());
      // fs.writeFileSync(
      //   `image-${artifact.getSeed()}.png`,
      //   Buffer.from(artifact.getBinary_asB64())
      // );
      const base64String = artifact.getBinary_asB64();
const byteCharacters = atob(base64String);
const byteNumbers = new Array(byteCharacters.length);

for (let i = 0; i < byteCharacters.length; i++) {
  byteNumbers[i] = byteCharacters.charCodeAt(i);
}

const byteArray = new Uint8Array(byteNumbers);
blob = new Blob([byteArray], { type: 'application/octet-stream' });
url = URL.createObjectURL(blob);
const div = document.getElementById('imagePreview');
const a = document.createElement('img');
const string = artifact.getBinary_asB64().replace(/https?:\/\/\S+/gi, '');
a.src = `data:png;base64,${string}`;
console.log(a.src);
const myService = AppInjector.get(TextToImageService);
// const textToImageService: TextToImageService = Inject(TextToImageService);
myService.setImage(a.src);

div?.appendChild(a); 
// a.download = `image-${artifact.getSeed()}.png`;
// a.click();

    } catch (error) {
      console.error("Failed to write resulting image to disk", error);
    }
    return url;
  });
return blob;
  // For browser implementations: you could use the `artifact.getBinary_asB64()` method to get a
  // base64 encoded string and then create a data URL from that and display it in an <img> tag.
}
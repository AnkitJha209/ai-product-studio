import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv"
import { storeToAzure } from "./uploadingToAzure";

dotenv.config()

const client = new InferenceClient(process.env.HF_TOKEN);

export const generateImage = async (inputs: string) => {
    const image = await client.textToImage({
        provider: "hf-inference",
        model: "black-forest-labs/FLUX.1-dev",
        inputs: inputs,
        parameters: { num_inference_steps: 5 },
    });

    const imgUrl = await storeToAzure(image)

    return imgUrl
}
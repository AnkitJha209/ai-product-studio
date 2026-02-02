import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import crypto from 'crypto'

dotenv.config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING as string,
);

const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER_NAME as string,
);

export const storeToAzure = async (buffer: Buffer, imageType : string) => {

    const fileName = `${crypto.randomUUID()}.png`;

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: {
            blobContentType: imageType,
        },
    });

    return blockBlobClient.url;
};

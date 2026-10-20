"use server";

import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

const s3client = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string
): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "application/pdf",
  };

  console.log(params);

  const command = new PutObjectCommand(params);

  try {
    const response = await s3client.send(command);
    console.log("File uploaded successfully:", response);
    return fileName;
  } catch (error) {
    console.log("no");
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function uploadResume(
  formData: FormData
): Promise<{ status: string; message: string }> {
  const file = formData.get("file") as File | null;

  if (!file) {
    return {
      status: "error",
      message: "Please upload a pdf file",
    };
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  try {
    await uploadFileToS3(fileBuffer, file.name);
    return {
      status: "success",
      message: "File uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      status: "error",
      message: "An error occurred while uploading the file.",
    };
  }
}

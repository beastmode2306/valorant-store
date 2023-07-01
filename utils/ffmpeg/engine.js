import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import * as path from "path";

const buildCommand = (images, tgId, playerId) => {
  const timestamp = Date.now();

  const imagesCommandChunk = images.map(({ url }) => `-i ${url}`).join(" ");

  const fontPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../assets/fonts/valorant.ttf"
  );

  const destination = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    `../../assets/collages/${tgId}_${playerId}_${timestamp}.png`
  );

  const margin = 20;

  const imageLabels = ["left", "right", "bottomleft", "bottomright"];

  const filterComplexImages = images
    .map(
      ({ price }, index) =>
        `[${index}:v]scale='min(iw*(150/ih),600)':150,pad=600:150:(ow-iw)/2:(oh-ih)/2:color=0x1e1e2e,drawtext=fontfile=${fontPath}:text='${price} VP':x=(w-text_w)/2:y=h-text_h-${margin}:fontsize=40:fontcolor=white:bordercolor=black:borderw=2[${imageLabels[index]}]`
    )
    .join(";");

  const filterComplexChunk = `-filter_complex "${filterComplexImages};color=c=0x1e1e2e:s=1200x300[bg];[bg][left]overlay=shortest=1[top];[top][right]overlay=600:shortest=1[finaltop];[finaltop][bottomleft]overlay=0:150:shortest=1[final];[final][bottomright]overlay=600:150:shortest=1,pad=iw+140:ih+140:70:70:color=0x1e1e2e"`;

  return {
    command: `ffmpeg ${imagesCommandChunk} ${filterComplexChunk} ${destination}`,
    destination,
  };
};

export const generateCollage = (images, tgId, playerId) => {
  const { command, destination } = buildCommand(images, tgId, playerId);
  const execPromise = promisify(exec);

  return execPromise(command)
    .then(() => destination)
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

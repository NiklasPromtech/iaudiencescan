export const EXTENSION_DOWNLOAD_URL =
  "https://storage.googleapis.com/audiencescan-downloads/extension/audiencescan-extension.zip";

export async function downloadExtension(): Promise<void> {
  const response = await fetch(EXTENSION_DOWNLOAD_URL);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "audiencescan-extension.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

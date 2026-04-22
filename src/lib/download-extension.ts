export const EXTENSION_DOWNLOAD_URL =
  "https://storage.googleapis.com/audiencescan-downloads/extension/audiencescan-extension.zip";

export async function downloadExtension(): Promise<void> {
  // Plain anchor navigation — no fetch(), no CORS. The browser streams the
  // bytes straight to disk. The `download` attribute hints the filename when
  // same-origin or when the server sends Content-Disposition.
  const a = document.createElement("a");
  a.href = EXTENSION_DOWNLOAD_URL;
  a.download = "audiencescan-extension.zip";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

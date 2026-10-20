export async function uploadFile(file) {
  const body = new FormData();
  body.set("file", file);
  let response;
  try {
    response = await fetch("/api/uploads", { method: "POST", body });
  } catch {
    throw new Error("Network error. Check your connection and try again.");
  }
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) throw new Error(data.error || "Upload failed.");
  return data;
}

export function kindFromAccept(accept) {
  const wantsImage = accept.includes("image");
  const wantsVideo = accept.includes("video");
  if (wantsImage && !wantsVideo) return "image";
  if (wantsVideo && !wantsImage) return "video";
  return "";
}

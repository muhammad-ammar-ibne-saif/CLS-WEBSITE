import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "assets");

const assets = {
  "ornament.svg":
    "https://www.figma.com/api/mcp/asset/9d0c828e-5639-4ee4-8fa4-5a96a81a7d5f.svg",
  "play.svg":
    "https://www.figma.com/api/mcp/asset/cefa0760-a5ad-4519-b15f-0fbeb0e85bb7.svg",
  "book-open.svg":
    "https://www.figma.com/api/mcp/asset/915ee86b-6aca-47f1-ad7b-e72495f46bf8.svg",
  "chevron-down.svg":
    "https://www.figma.com/api/mcp/asset/63ee7eeb-e118-430c-a0e1-e44e6a3cb255.svg",
  "download.svg":
    "https://www.figma.com/api/mcp/asset/a74064d2-589e-4d01-b9f2-75758aff577e.svg",
  "clock.svg":
    "https://www.figma.com/api/mcp/asset/5c1eb18c-0af5-4abd-b20d-813b4de82a4d.svg",
  "blocks.svg":
    "https://www.figma.com/api/mcp/asset/199115c1-40fe-452c-9f6c-1bc195f5c678.svg",
  "border.png":
    "https://www.figma.com/api/mcp/asset/fff68f50-c22a-4aeb-b8d1-6ca6c74e1fbb.png",
  "calligraphy-events.png":
    "https://www.figma.com/api/mcp/asset/4dc1f37f-a38c-40df-be5f-dafef6e9c7cf.png",
  "calligraphy-writers.png":
    "https://www.figma.com/api/mcp/asset/f49ccbf6-afe0-4550-a4f7-19f4e35052ad.png",
  "calligraphy-cta.png":
    "https://www.figma.com/api/mcp/asset/756931f5-3bbb-4511-9cde-0509f1bec79f.png",
  "calligraphy-story.png":
    "https://www.figma.com/api/mcp/asset/b375c2d8-0416-444f-bc79-9c702a7855b6.png",
  "calligraphy-constitution.png":
    "https://www.figma.com/api/mcp/asset/1e0f143e-88cd-4c7f-9472-e25602ce6fd4.png",
  "calligraphy-leadership.png":
    "https://www.figma.com/api/mcp/asset/f613481a-8495-4d35-8342-710bda230c87.png",
  "calligraphy-history.png":
    "https://www.figma.com/api/mcp/asset/7d50b8e3-7617-4f3e-8ca1-21180e8fbc12.png",
  "video-frame.png":
    "https://www.figma.com/api/mcp/asset/ca189ce3-6d51-437e-8700-d9c71c7af190.png",
  "photo-frame.png":
    "https://www.figma.com/api/mcp/asset/d443695a-2d07-4e79-ae57-89d42d18169b.png",
  "portrait-frame.png":
    "https://www.figma.com/api/mcp/asset/c7738d47-7008-4060-831b-0fd61324a572.png",
  "rose.png":
    "https://www.figma.com/api/mcp/asset/00ccdf57-faa7-4965-abe3-b97593d7435a.png",
  "logo.png":
    "https://www.figma.com/api/mcp/asset/30565785-2ffe-43d2-a4a9-144f7cf395fe.png",
  "constitution-thumb.png":
    "https://www.figma.com/api/mcp/asset/53c28689-641c-4740-b48a-e5f66b7c14c7.png",
  "flowers.png":
    "https://www.figma.com/api/mcp/asset/61ed1196-a429-4686-8cef-078e80d28c1f.png",
  "about-banner.png":
    "https://www.figma.com/api/mcp/asset/cfe9c0e5-dc00-418d-a2a9-7f2ce28f19e0.png",
  "history-portrait.png":
    "https://www.figma.com/api/mcp/asset/bb5b8d9b-5447-44e5-8a82-413e5a4ce615.png",
  "flower-literature.png":
    "https://www.figma.com/api/mcp/asset/a497eb7c-7119-4cde-bc4e-b0585ac3fd6b.png",
  "flower-inspiration.png":
    "https://www.figma.com/api/mcp/asset/347bbf15-c2bf-4f84-82eb-6a8f6aa1fa67.png",
  "flower-vision.png":
    "https://www.figma.com/api/mcp/asset/d543ce26-c770-44fe-94eb-d0d974e02738.png",
};

const members = [
  "4673e20d-2b12-47a2-9fc7-b293d2e93e2d",
  "0bd55343-6a84-4f9e-bd0d-580643ddc856",
  "0cc75194-1bbc-4023-b4b8-770b138e534f",
  "7925c314-fc36-4e56-8726-b480eba76250",
  "39750bdc-f387-4097-8b51-fd05ad345b96",
  "fc88aa21-395b-4e3b-bee2-1601971f3dd4",
  "adb8646a-a39c-4ab9-8a19-b0553f773ce9",
  "38299bd9-3212-433e-8f5d-3ab6bd1b8740",
  "e8f7f638-9a18-49d3-9fcb-a5cfc87b30a7",
  "b315ad32-25b9-41ae-8e71-95f32c528a2a",
  "09f95b76-c23c-4128-bc08-b1e2d0e87088",
  "5536e022-87ab-4d3f-a2eb-11aa6f213d55",
  "527c73a2-9095-4cff-8739-88f4da8a2d37",
  "84afe03b-6203-43fd-a1ec-c592f5658a05",
  "2f4eaeb5-2b8b-4865-bbb3-73ab43808104",
  "2018f406-e89c-45d0-92cd-d5707437627b",
  "5174e611-dd4b-4ec2-a03c-36fcf59ad475",
  "997ddbef-4030-4291-874d-69bb62e34150",
  "dac04c68-ba2b-4ca9-ad82-b995fc86e1c7",
  "c6f870be-d27a-421f-8aca-2b1e4cfb0414",
  "45414f27-8f6b-4c19-a804-2d18d588a4b0",
  "26528ef9-0a96-448f-b016-ed2dc8b1b6fb",
  "3e27dc37-f88d-4e72-b48b-83a6f82d2a35",
  "44a8295c-d410-41d9-8e53-940765cf751f",
  "4dc3334c-0cd2-4ffa-8004-981a91774130",
  "653fd37a-73ad-455d-af0d-253093844d58",
  "79436946-6e65-4fcb-90d3-cf50246ebb60",
  "b6f776c5-21ba-4d79-ab94-88589e4ec074",
  "8fe1cfb8-40b5-4833-92f4-5ee2ba546286",
  "bfead1d8-fb12-4251-90c5-39bff69854b5",
  "a5e0ee72-be62-4025-9260-1bca75a202fe",
  "8011d5cb-e22c-4837-aa45-95e6f28d4f8a",
  "f1b94e82-17ac-473e-a8e5-f60ed594c3d9",
  "cb4db4e6-83c6-485c-87d0-92199dd301fa",
  "bfc1f0fe-c24d-4365-ad71-999e4daf0df7",
  "cbfa071e-9ae9-45cf-a64c-c30e9d499b7f",
  "0fb24ff9-b649-45e4-ba7a-606615734e6a",
  "089a81a3-edf3-40ef-93d8-af26f417842c",
  "f386f214-1207-4bef-b6a0-3db550a97681",
  "bd30fa3f-04ca-434c-ba4b-41ef77131353",
  "d3e04fa4-4ba2-4411-8f9f-7b4ab84dc072",
  "9c5fd7c4-5921-4b54-b2d1-e837b7804f3f",
  "b9e9a097-5018-4f93-9c80-4fa3621cb84e",
  "2f353c84-f9ec-47d6-8fa7-7f778f81048b",
  "f955915d-c8a2-4770-a3a1-ff1e33a83344",
  "d1ad01d5-f055-42bb-9769-ea3362ef5e33",
  "a30c1084-7fc4-4d7e-9edb-639bceeec821",
  "7ec0fa52-5228-4bd0-a99d-7bd69a9d0cd9",
  "c5746580-e34b-498e-b8f0-3f5d2ccd3425",
  "d82034f5-8f2e-4530-addc-de1cfa97b987",
  "b2371fa4-1688-426c-886c-19e8e483474d",
  "0a2b6e3b-7821-49e4-8460-e3b69b542da0",
  "665bd17b-27aa-4308-aac4-05862815eb82",
  "29e38a51-6b31-426a-901f-e28c6f13d05c",
  "57c93b4a-cb78-4ad0-9f3a-afa65049fcfe",
  "c4e3c0b6-5142-4d56-b6d6-3902721805ac",
  "69d13ac6-aad7-42eb-a387-c869efd15574",
];

members.forEach((id, i) => {
  assets[`members/${String(i + 1).padStart(2, "0")}.png`] =
    `https://www.figma.com/api/mcp/asset/${id}.png`;
});

async function download(path, url) {
  const dest = join(outDir, path);
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log("saved", path);
}

const entries = Object.entries(assets);
for (let i = 0; i < entries.length; i += 8) {
  await Promise.all(entries.slice(i, i + 8).map(([path, url]) => download(path, url)));
}

console.log(`Downloaded ${entries.length} assets`);

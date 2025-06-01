import { writeFileSync } from "node:fs";

async function generate(code) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    frame_name: "no-frame",
    qr_code_text: `https://m.inventory.romashov.tech/?item=${code}`,
    image_format: "SVG",
    background_color: "#000000",
    foreground_color: "#ffffff",
    // frame_name: "bottom-frame",
    // qr_code_text: "https://www.qr-code-generator.com/",
    // image_format: "SVG",
    // frame_color: "#02bfff",
    // frame_icon_name: "mobile",
    // frame_text: "Scan me",
    // marker_left_template: "version13",
    // marker_right_template: "version13",
    // marker_bottom_template: "version13",
  });

  const resp = await fetch(
    `https://api.qr-code-generator.com/v1/create?access-token=${process.env.QR_CODE_GENERATOR_TOKEN}`,
    {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    }
  );

  const svg = await resp.text();
  writeFileSync(`images/${code}.svg`, svg);
}

async function main() {
  for (let i = 1; i <= 30; i++) {
    await generate(i);
  }
}

(async () => await main())();

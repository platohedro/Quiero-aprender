import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const semillasDir = path.join(publicDir, "semillas");
    const files = fs.readdirSync(semillasDir, { withFileTypes: true });

    const pngs = files
      .filter((f) => f.isFile() && f.name.toLowerCase().endsWith(".png"))
      .map((f) => path.parse(f.name).name);

    const items = pngs.map((id) => ({
      id,
      nombre: id.replaceAll("_", " "),
      img: `/semillas/${id}.png`,
      audioMp3: `/aduios_semillas/${id}.MP3`,
      audioM4a: `/aduios_semillas/${id}.m4a`,
    }));

    return NextResponse.json({ semillas: items });
  } catch (e: any) {
    return NextResponse.json({ semillas: [], error: String(e?.message ?? e) }, { status: 200 });
  }
}


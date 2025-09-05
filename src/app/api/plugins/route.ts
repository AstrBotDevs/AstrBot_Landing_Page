import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const p = path.join(process.cwd(), "data", "checkpoint.json");
    const json = await fs.readFile(p, "utf-8");
    const data = JSON.parse(json);
    const plugins = data.plugins || {};
    const github = data.github || {};
    return Response.json({
      plugins,
      github: {
        stars: github.stars ?? 0,
        forks: github.forks ?? 0,
        contributors: github.contributors ?? 0,
      },
    });
  } catch (e) {
    return Response.json({ error: "Failed to load plugins" }, { status: 500 });
  }
}



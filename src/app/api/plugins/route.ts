import data from "../../../../data/checkpoint.json";

export async function GET() {
  try {
    const plugins = (data as any).plugins || {};
    const github = (data as any).github || {};
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



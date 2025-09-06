import data from "../../../../data/checkpoint.json";

type PluginItem = { desc: string; stars?: number; repo?: string };
type PluginsMap = Record<string, PluginItem>;
type GithubStats = { stars?: number; forks?: number; contributors?: number };
type ReleaseInfo = { tag_name?: string; name?: string; published_at?: string; body?: string };
type Checkpoint = { plugins?: PluginsMap; github?: GithubStats };

async function getLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const response = await fetch("https://api.github.com/repos/AstrBotDevs/AstrBot/releases/latest", {
      headers: {
        "User-Agent": "AstrBot-Landing-Page",
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const checkpoint = data as unknown as Checkpoint;
    const plugins: PluginsMap = checkpoint.plugins || {};
    const github: GithubStats = checkpoint.github || {};
    const latestRelease = await getLatestRelease();
    
    return Response.json({
      plugins,
      github: {
        stars: github.stars ?? 0,
        forks: github.forks ?? 0,
        contributors: github.contributors ?? 0,
      },
      release: latestRelease ? {
        version: latestRelease.tag_name,
        name: latestRelease.name,
        publishedAt: latestRelease.published_at,
        description: latestRelease.body,
      } : null,
    });
  } catch {
    return Response.json({ error: "Failed to load plugins" }, { status: 500 });
  }
}



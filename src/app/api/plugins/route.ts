import data from "../../../../data/checkpoint.json";

type PluginItem = { desc: string; stars?: number; repo?: string };
type PluginsMap = Record<string, PluginItem>;
type GithubStats = { stars?: number; forks?: number; contributors?: number };
type Checkpoint = { plugins?: PluginsMap; github?: GithubStats };

export async function GET() {
  try {
    const checkpoint = data as unknown as Checkpoint;
    const plugins: PluginsMap = checkpoint.plugins || {};
    const github: GithubStats = checkpoint.github || {};
    return Response.json({
      plugins,
      github: {
        stars: github.stars ?? 0,
        forks: github.forks ?? 0,
        contributors: github.contributors ?? 0,
      },
    });
  } catch {
    return Response.json({ error: "Failed to load plugins" }, { status: 500 });
  }
}



type GitHubAsset = {
  name: string;
  browser_download_url: string;
  size: number;
};

type GitHubRelease = {
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  html_url: string;
  assets: GitHubAsset[];
};

export async function GET() {
  try {
    const response = await fetch("https://api.github.com/repos/AstrBotDevs/AstrBot/releases/latest", {
      headers: {
        "User-Agent": "AstrBot-Landing-Page",
        // 暂不添加 GitHub token
        // "Authorization": `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
      return Response.json({ error: "Failed to fetch release data" }, { status: response.status });
    }

    const release: GitHubRelease = await response.json();
    
    return Response.json({
      version: release.tag_name,
      name: release.name,
      publishedAt: release.published_at,
      description: release.body,
      downloadUrl: release.html_url,
      assets: release.assets?.map((asset) => ({
        name: asset.name,
        downloadUrl: asset.browser_download_url,
        size: asset.size,
      })) || [],
    });
  } catch (error) {
    console.error("Error fetching release:", error);
    return Response.json({ error: "Failed to fetch release data" }, { status: 500 });
  }
}

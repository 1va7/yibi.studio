import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

type GitHubAppProfile = {
  login: string;
  id: number;
  avatar_url: string;
  name?: string;
  email?: string;
};

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};

export function GitHubAppProvider(
  options: OAuthUserConfig<GitHubAppProfile>,
): OAuthConfig<GitHubAppProfile> {
  return {
    id: "github",
    name: "GitHub",
    type: "oauth",
    issuer: "https://github.com/login/oauth",
    authorization: {
      url: "https://github.com/login/oauth/authorize",
      params: {
        scope: "read:user user:email",
      },
    },
    token: "https://github.com/login/oauth/access_token",
    userinfo: {
      url: "https://api.github.com/user",
      async request({ client, tokens }) {
        const accessToken = tokens.access_token;
        if (!accessToken) {
          throw new Error("GitHub App user authorization did not return an access token");
        }

        const profile = await client.userinfo(accessToken);
        if (!profile.email) {
          const response = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          });
          if (response.ok) {
            const emails = (await response.json()) as GitHubEmail[];
            const primaryVerified = emails.find(
              (email) => email.primary && email.verified,
            );
            const firstVerified = emails.find((email) => email.verified);
            profile.email = (primaryVerified ?? firstVerified)?.email;
          }
        }
        return profile as unknown as GitHubAppProfile;
      },
    },
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    style: {
      logo: "/github.svg",
      bg: "#24292f",
      text: "#fff",
    },
    options,
  };
}

import { Injectable } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";
import { ErrorPageException } from "../exceptions/errorPage.exception";
import { OAuthProvider, OAuthToken } from "./oauthProvider.interface";

@Injectable()
export class LinuxDoProvider implements OAuthProvider<LinuxDoToken> {
  constructor(private config: ConfigService) {}

  getAuthEndpoint(state: string): Promise<string> {
    return Promise.resolve(
      "https://connect.linux.do/oauth2/authorize?" +
        new URLSearchParams({
          client_id: this.config.get("oauth.linuxdo-clientId"),
          response_type: "code",
          redirect_uri:
            this.config.get("general.appUrl") + "/api/oauth/callback/linuxdo",
          state: state,
        }).toString(),
    );
  }

  async getToken(query: OAuthCallbackDto): Promise<OAuthToken<LinuxDoToken>> {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: query.code,
      redirect_uri:
        this.config.get("general.appUrl") + "/api/oauth/callback/linuxdo",
    }).toString();

    const res = await fetch("https://connect.linux.do/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${this.config.get("oauth.linuxdo-clientId")}:${this.config.get(
            "oauth.linuxdo-clientSecret",
          )}`,
        ).toString("base64")}`,
      },
      body: body,
    });

    if (!res.ok) {
      throw new ErrorPageException("oauth_error", undefined, ["provider_linuxdo"]);
    }

    const token = (await res.json()) as LinuxDoToken;
    return {
      accessToken: token.access_token,
      tokenType: token.token_type,
      expiresIn: token.expires_in,
      scope: token.scope,
      rawToken: token,
    };
  }

  async getUserInfo(token: OAuthToken<LinuxDoToken>): Promise<OAuthSignInDto> {
    const user = await this.getLinuxDoUser(token);
    
    if (!user.email) {
      throw new ErrorPageException("no_email", undefined, ["provider_linuxdo"]);
    }

    return {
      provider: "linuxdo",
      providerId: user.id.toString(),
      providerUsername: user.name || user.username,
      email: user.email,
      idToken: `linuxdo:${token.accessToken}`,
    };
  }

  private async getLinuxDoUser(
    token: OAuthToken<LinuxDoToken>,
  ): Promise<LinuxDoUser> {
    const res = await fetch("https://connect.linux.do/api/user", {
      headers: {
        Authorization: `${token.tokenType ?? "Bearer"} ${token.accessToken}`,
      },
    });

    if (!res.ok) {
      throw new ErrorPageException("oauth_error", undefined, ["provider_linuxdo"]);
    }

    return (await res.json()) as LinuxDoUser;
  }
}

export interface LinuxDoToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface LinuxDoUser {
  id: number;
  username: string;
  name?: string;
  email?: string;
} 
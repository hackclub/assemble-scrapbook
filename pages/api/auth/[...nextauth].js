import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    {
      id: 'assemble',
      name: 'Assemble',
      type: 'oauth',
      version: '2.0',
      clientId: 'com.hackclub.AssembleScrapbook',
      authorizationUrl: 'https://id.assemble.hackclub.com/oauth/authorize',
      accessTokenUrl: 'https://api.id.assemble.hackclub.com/oauth/token',
      profileUrl: 'https://api.id.assemble.hackclub.com/users/me',
      protection: 'pkce',
      scope: 'auth',  // Make sure to request the users email address
      params: {

      }
    }
  ]
})
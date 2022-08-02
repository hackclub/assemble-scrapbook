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
      clientSecret: 'nextauthisshit',
      authorization: {
        url: 'https://id.assemble.hackclub.com/oauth/authorize',
        params: {'app_id': 'com.hackclub.AssembleScrapbook'}
      },
      token: {
        url: 'http://localhost:3000/api/token-handler'
      },
      userinfo: {
        url: 'https://api.id.assemble.hackclub.com/users/me'
      },
      idToken: true,
      checks: ['pkce'],
      session: {
        jwt: false
      },
      jwt: { decode: async (...args) => ({}) },
      scope: 'auth',  // Make sure to request the users email address
      params: {

        callbacks: {
          async redirect({url, baseUrl}) {
            console.log(url);
            console.log(baseUrl);
          }
        }
      }
    }
  ]
})
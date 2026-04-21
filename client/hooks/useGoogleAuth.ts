import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const DISCOVERY: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export function useGoogleAuth() {
  const redirectUri = 'https://auth.expo.io/@rodolfosparapan/wallot';

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
    },
    DISCOVERY
  );

  const exchangeForIdToken = async (): Promise<string> => {
    if (response?.type !== 'success') throw new Error('No auth response.');
    const tokens = await AuthSession.exchangeCodeAsync(
      {
        clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
        code: response.params.code,
        redirectUri,
        extraParams: { code_verifier: request?.codeVerifier ?? '' },
      },
      DISCOVERY
    );
    if (!tokens.idToken) throw new Error('No ID token received from Google.');
    return tokens.idToken;
  };

  return { request, response, promptAsync, exchangeForIdToken, redirectUri };
}

# Wallot

Personal finance tracker. Mobile app (client) backed by a REST API (api).

## Structure

```
wallot/
  api/      # ASP.NET Core 9 REST API
  client/   # React Native / Expo mobile app
```

## Conventions

- Branch off `main`, open PRs back into `main`
- API and client are versioned together in this repo
- The API runs on `http://localhost:5000` by default; the client points there in dev

## Workflow

- Start API: `cd api/src && dotnet run`
- Start client: `cd client && npx expo start`

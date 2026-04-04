# Wallot API

ASP.NET Core 9 REST API with SQLite via Entity Framework Core.

## Stack

- **Framework**: ASP.NET Core 9 (`net9.0`)
- **ORM**: EF Core 8 + SQLite (`wallot.db`)
- **Auth**: JWT Bearer tokens (secret in `appsettings.Development.json`)
- **Docs**: Swagger at `/swagger`
- **Password hashing**: BCrypt.Net-Next

## Project layout

```
api/
  src/
    Controllers/   # Route handlers
    Data/          # DbContext
    Migrations/    # EF Core migrations
    Models/        # Entity and DTO models
    Services/      # Business logic + interfaces
    Program.cs     # App bootstrap
  tests/
```

## Running

```bash
cd api/src
dotnet run
```

## Testing

```bash
cd api/tests
dotnet test
```

## Migrations

```bash
cd api/src
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

## Conventions

- JSON uses `snake_case` (configured globally in Program.cs)
- Null fields are omitted from JSON responses (`WhenWritingNull`)
- Services are injected via interfaces in `Services/Interfaces/`
- Auth-required endpoints use `[Authorize]`

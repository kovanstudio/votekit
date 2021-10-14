# VoteKit

VoteKit is a user feedback collection, participation and ranking software.

The project contains the API server, data access layer and the web application code. It is written in C# using .NET Core with ASP.NET Core.
VoteKit can run on PostgreSQL or SQLite (default) at the moment. The code base can be deployed an developed on Windows, Linux or macOS.

## Build

### Requirements

[.NET Core 6.0 SDK](https://www.microsoft.com/net/download/core)

### Recommended

[Task](https://taskfile.dev/) - GNU Make alternative

## Run

```sh
dotnet run --project VoteKit.Web/
```

Visit http://localhost:5000

## Deploy

VoteKit has an official docker image and it is the recommended method for deploying the application on a server.

```
# Run and bind to localhost:5000
docker run -p 5000:80 ghcr.io/kovanstudio/votekit:latest

# Persist data on host filesystem
docker run -v /path/to/host/directory:/app/data -p 5000:80 ghcr.io/kovanstudio/votekit:latest
```

## Configuration

VoteKit can be configured using environment variables or a json configuration file located in the data directory.

It is recommended to use the environment variable approach. All environment variables are prefixed with `VK_`

### Database Provider
```shell
# In order to use PostgreSQL instead of the default SQLite database, set the DB variable to "pg"
VK_DB__Provider="pg"
# Also provide a connection string
VK_DB__ConnectionString="Host=localhost;Port=5432;Database=votekit;Username=root;Password=root"
```

### Mail
VoteKit currently supports SMTP for sending emails. Please set the configuration as following:

```shell
VK_Email__Service="SMTP"
VK_Email__From="me@example.com"
VK_Email__SMTPUser="<USERNAME>>"
VK_Email__SMTPPass="<PASSWORD>"
VK_Email__SMTPHost="smtp.gmail.com"
VK_Email__SMTPPort="587"
```

> Further configuration options will be listed below

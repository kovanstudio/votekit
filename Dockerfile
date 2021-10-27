FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:6.0 AS backendbuild

WORKDIR /source
COPY *.sln .

COPY Migrations ./Migrations/
COPY VoteKit ./VoteKit/
COPY VoteKit.Api ./VoteKit.Api/
COPY VoteKit.Web ./VoteKit.Web/

ARG TARGETPLATFORM

RUN case ${TARGETPLATFORM} in \
         "linux/amd64")  RUNTIME=linux-x64  ;; \
         "linux/arm64")  RUNTIME=linux-arm64  ;; \
         "linux/arm/v7") RUNTIME=linux-arm  ;; \
    esac \
  && dotnet publish VoteKit.Web -c release -r ${RUNTIME} -o /app

FROM --platform=$BUILDPLATFORM node as frontendbuild
ENV NODE_ENV production
WORKDIR /app
ADD VoteKit.Web/Client/package.json VoteKit.Web/Client/package-lock.json /app/
RUN npm install --no-optional
COPY VoteKit.Web/Client /app/
RUN npm run build

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=backendbuild /app ./
COPY --from=frontendbuild /wwwroot/client ./wwwroot/client

ENTRYPOINT ["dotnet", "VoteKit.Web.dll"]

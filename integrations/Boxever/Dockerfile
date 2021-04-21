ARG BUILD_IMAGE
ARG BASE_IMAGE

FROM ${BUILD_IMAGE} AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY src/ ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM ${BASE_IMAGE}
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "Sitecore.Integrations.Boxever.dll"]
+++
title = 'Working with MapLibre in a React Native project'
date = 2024-11-27T10:16:00+01:00
draft = true
weather = '6°C Cloudy'
location = '50.79°N, 3.65°W'
tags = ['react-native', 'maplibre']
customcss = 'custom.css'
description = 'Notes on installing and using MapLibre in a React Native project'
+++

```bash
bun create expo maplibre-rn-test
bun run reset-project
```

bun install maplibre-react-native


added the config plugin to my app.config.ts


ran a

```bash
bunx expo@latest prebuild --clean
```

crashes on entry!

libc++abi: terminating due to uncaught exception of type std::domain_error

Crashes when the MapLibreGL.MapView view is used, so i suspect a linking error


this works ok (doesnt display the map though)
```typescript
<View style={styles.page}>
  <MapLibreGL.MapView style={styles.map} logoEnabled />
</View>
```



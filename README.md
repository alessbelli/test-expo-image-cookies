# test-expo-image-cookies

Minimal test repository for [expo/expo#43229](https://github.com/expo/expo/issues/43229).

## Purpose

This repo demonstrates that **expo-image on Android does not use the same HTTP stack as the rest of the React Native app**. As a result, it does not send cookies or other headers from the shared HTTP layer, making it **impossible to reliably load authenticated images** (e.g. images that require session cookies or auth headers).

## Setup

- A minimal Expo app that loads an SVG from a Cloudflare Worker.
- The Worker echoes request headers (including cookies) in both:
  - A **JSON** endpoint (fetched with `fetch()` — uses the normal React Native HTTP stack).
  - An **image** endpoint that returns an SVG with the same headers rendered in the image (loaded with **expo-image**).

## How to reproduce

1. Run the app: `npm run android`
2. On first load, both requests show no cookies (expected).
3. The Worker sets a cookie in the response for both requests.
4. Refresh or reopen the app.
5. The **JSON** response (via `fetch`) shows the cookie that was set on the first visit.
6. The **image** (via expo-image) still shows **no cookies** — expo-image is not using the same HTTP stack.

So expo-image cannot be used for images that depend on cookies or shared headers for authentication.

## Repo contents

- **App.js** — Expo app: displays the SVG image (expo-image) and the raw JSON from the Worker.
- **cloudflare-worker.js** — Worker code for the `/image.svg` and `/json` endpoints (echo headers and set a cookie).

## Link

Issue: [expo-image] [android] expo-image doesn't pass regular headers / cookies from the common react-native http stack — https://github.com/expo/expo/issues/43229

# Atlanta FIFA Navigator

This is a Next.js application designed to provide real-time traffic and transit navigation for Mercedes-Benz Stadium during FIFA events.

## Architecture Overview

The application is built with the following technologies:

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Map**: Google Maps JavaScript API via `@googlemaps/js-api-loader`
- **Package Manager**: pnpm
- **Deployment**: Vercel
- **Testing**: Jest and React Testing Library

## Development Workflow

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd atlanta-fifa-navigator
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    - Copy the `.env.sample` file to a new file named `.env.local`.
    -   ```bash
        cp .env.sample .env.local
        ```
    -   Open `.env.local` and add your Google Maps API key. You can obtain a key from the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/overview).
        ```
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
        ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:3000`.

### Testing

To run the tests, use the following command:

```bash
pnpm test
```

## Environment Variables

-   `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: The API key for the Google Maps JavaScript API. This key is exposed to the client-side and should be configured with appropriate restrictions in the Google Cloud Console to prevent unauthorized use.

## Troubleshooting

-   **Map not loading:**
    -   Ensure that your `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is correct and has the necessary permissions in the Google Cloud Console.
    -   Check the browser's developer console for any errors from the Google Maps API.
    -   Verify that you have enabled the "Maps JavaScript API" in your Google Cloud project.
-   **CORS errors:**
    -   If you see CORS errors related to the Google Maps API, you may need to configure the allowed HTTP referrers for your API key in the Google Cloud Console. For local development, you can add `http://localhost:3000/*`. For production, add your production domain.

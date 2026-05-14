# API Reference

DisasterSense AI interacts with multiple internal and external APIs. This document outlines the core service functions used within the application.

## 1. Groq AI Integration (`src/services/groq.js`)

### `analyzePost(postText, metadata)`
Sends raw social media text to the Groq Llama 3.3 70B model to determine if it describes a disaster.
*   **Parameters:**
    *   `postText` (string): The raw text of the post.
    *   `metadata` (object): Optional metadata (source, timestamp, author).
*   **Returns:** A Promise resolving to a strict JSON object containing `is_disaster`, `disaster_type`, `location`, `severity`, `confidence`, `summary`, etc.

## 2. Verification Engine (`src/services/verification.js`)

### `verifyIncident(analysis)`
The core function that takes the AI's analysis and cross-checks it against public APIs.
*   **Parameters:**
    *   `analysis` (object): The JSON output from `analyzePost()`.
*   **Returns:** A Promise resolving to a verification object containing `credibility_score`, `verification_status`, and `verification_notes`.

### `computeCredibilityScore(params)`
Calculates the final credibility percentage based on weighted factors.
*   **Parameters:** Object containing `llmConfidence`, `weatherVerified`, `officialVerified`, `multiSourceVerified`.
*   **Returns:** A float between 0 and 1.

## 3. Geocoding (`src/services/geocoding.js`)

### `geocode(locationString)`
Converts a text location into coordinates using OpenStreetMap Nominatim.
*   **Returns:** `{ latitude, longitude, display_name }`

## 4. Weather API (`src/services/weather.js`)

### `verifyFloodConditions(latitude, longitude)`
Queries Open-Meteo for recent or current heavy precipitation.
*   **Returns:** `{ verified: boolean, reason: string }`

## 5. Third-Party APIs used for Verification
*   **USGS Earthquake Catalog:** `https://earthquake.usgs.gov/fdsnws/event/1/query`
*   **GDELT Project:** `https://api.gdeltproject.org/api/v2/doc/doc`
*   **ReliefWeb:** `https://api.reliefweb.int/v1/reports`
*   **Open-Meteo:** `https://api.open-meteo.com/v1/forecast`

const API_KEY = process.env.GOOGLE_API_KEY ?? process.env.PAGESPEED_API_KEY;

interface PlaceDetails {
  rating?: number;
  userRatingCount?: number;
  displayName?: { text: string };
  websiteUri?: string;
  id?: string;
}

export async function fetchPlaceDetails(placeId: string): Promise<PlaceDetails> {
  if (!API_KEY) throw new Error("No Google API key configured");

  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "rating,userRatingCount,displayName,websiteUri,id",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Places API error (${res.status}): ${errText}`);
  }

  return res.json();
}

interface SearchResult {
  places?: PlaceDetails[];
}

export async function searchPlace(
  query: string,
  locationBias?: { lat: number; lng: number }
): Promise<PlaceDetails | null> {
  if (!API_KEY) throw new Error("No Google API key configured");

  const body: Record<string, unknown> = {
    textQuery: query,
    maxResultCount: 1,
  };

  if (locationBias) {
    body.locationBias = {
      circle: {
        center: { latitude: locationBias.lat, longitude: locationBias.lng },
        radius: 50000,
      },
    };
  }

  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.rating,places.userRatingCount,places.displayName,places.websiteUri,places.id",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Places search error (${res.status}): ${errText}`);
  }

  const data: SearchResult = await res.json();
  return data.places?.[0] ?? null;
}

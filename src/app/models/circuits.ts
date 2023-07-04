export interface circuits {
    circuitId: string,
    url: string,
    circuitName: string,
    Location: Location
}

export interface Location {
    lat: string,
    long: string,
    locality: string,
    country: string
}
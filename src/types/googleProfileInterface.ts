export interface IGoogleProfile {
    id: string
    displayName: string,
    name: name
    emails: emails[]
    photos: photos[]
    provider: string
    _raw: string
    _json: _json
}

interface name {
    familyName: string
    givenName: string
}

interface emails {
    value: string
    verified: boolean
}

interface photos {
    value: string
}

interface _json {
    sub: string
    name: string
    givenName: string
    familyName: string
    picture: string
    email: string
    email_verified: boolean
    locale: string
}
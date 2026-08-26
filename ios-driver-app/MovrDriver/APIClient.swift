import Foundation

enum APIError: Error {
    case http(Int)
    case decoding
}

final class APIClient {
    static let shared = APIClient()

    // Sostituisci con l'URL del deploy della piattaforma (progetto Vercel "logistic",
    // non "logistic-site"). La chiave deve combaciare con DRIVER_API_KEY su Vercel.
    private let baseURL = URL(string: "https://logistic.vercel.app")!
    private var apiKey: String {
        AppConfig.shared.driverApiKey
    }

    private func request(_ path: String, method: String = "GET", body: Data? = nil) -> URLRequest {
        var req = URLRequest(url: URL(string: path, relativeTo: baseURL)!)
        req.httpMethod = method
        req.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = body
        return req
    }

    func fetchSpedizioni(vettoreId: String) async throws -> [Spedizione] {
        var req = request("/api/driver/spedizioni")
        var components = URLComponents(url: req.url!, resolvingAgainstBaseURL: false)!
        components.queryItems = [URLQueryItem(name: "vettoreId", value: vettoreId)]
        req.url = components.url

        let (data, response) = try await URLSession.shared.data(for: req)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw APIError.http((response as? HTTPURLResponse)?.statusCode ?? -1)
        }
        return try JSONDecoder().decode(SpedizioniResponse.self, from: data).spedizioni
    }

    func segnalaRitiro(spedizioneId: String, ora: String) async throws {
        try await postAzione(path: "/api/driver/ritiro", spedizioneId: spedizioneId, ora: ora)
    }

    func segnalaRientroVuoto(spedizioneId: String, ora: String) async throws {
        try await postAzione(path: "/api/driver/rientro-vuoto", spedizioneId: spedizioneId, ora: ora)
    }

    private func postAzione(path: String, spedizioneId: String, ora: String) async throws {
        let body = try JSONEncoder().encode(["spedizioneId": spedizioneId, "ora": ora])
        let req = request(path, method: "POST", body: body)
        let (_, response) = try await URLSession.shared.data(for: req)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw APIError.http((response as? HTTPURLResponse)?.statusCode ?? -1)
        }
    }
}

import Foundation
import Combine

// Config minima per il test interno: l'autista incolla la chiave una volta,
// resta salvata sul device. Per il rollout reale questo va sostituito da un
// vero login (magic link via numero di telefono, per esempio).
final class AppConfig: ObservableObject {
    static let shared = AppConfig()

    @Published var vettoreId: String {
        didSet { UserDefaults.standard.set(vettoreId, forKey: "vettoreId") }
    }

    @Published var driverApiKey: String {
        didSet { UserDefaults.standard.set(driverApiKey, forKey: "driverApiKey") }
    }

    private init() {
        vettoreId = UserDefaults.standard.string(forKey: "vettoreId") ?? ""
        driverApiKey = UserDefaults.standard.string(forKey: "driverApiKey") ?? ""
    }

    var isConfigured: Bool {
        !vettoreId.isEmpty && !driverApiKey.isEmpty
    }
}

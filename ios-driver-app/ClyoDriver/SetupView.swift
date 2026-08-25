import SwiftUI

struct SetupView: View {
    @EnvironmentObject private var config: AppConfig
    @State private var vettoreId = ""
    @State private var apiKey = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Autista") {
                    TextField("ID vettore (es. V-01)", text: $vettoreId)
                        .autocapitalization(.none)
                }
                Section("Accesso") {
                    SecureField("Chiave API", text: $apiKey)
                }
                Section {
                    Button("Continua") {
                        config.vettoreId = vettoreId.trimmingCharacters(in: .whitespaces)
                        config.driverApiKey = apiKey.trimmingCharacters(in: .whitespaces)
                    }
                    .disabled(vettoreId.isEmpty || apiKey.isEmpty)
                }
            }
            .navigationTitle("Clyo Driver")
        }
    }
}

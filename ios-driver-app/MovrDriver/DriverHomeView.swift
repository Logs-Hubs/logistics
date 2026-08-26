import SwiftUI

@MainActor
final class DriverHomeViewModel: ObservableObject {
    @Published var spedizione: Spedizione?
    @Published var arrivatoLocale = false
    @Published var isLoading = false
    @Published var errore: String?

    private let vettoreId: String

    init(vettoreId: String) {
        self.vettoreId = vettoreId
    }

    var ritirato: Bool {
        spedizione?.faseOperativa == .ritirato || spedizione?.faseOperativa == .rientroVuoto
    }

    var vuotoRientrato: Bool {
        spedizione?.faseOperativa == .rientroVuoto
    }

    var arrivato: Bool {
        arrivatoLocale || ritirato
    }

    func carica() async {
        isLoading = true
        errore = nil
        defer { isLoading = false }
        do {
            let spedizioni = try await APIClient.shared.fetchSpedizioni(vettoreId: vettoreId)
            // La prossima spedizione confermata e non ancora chiusa; se non ce n'è,
            // la prima in generale (per mostrare comunque qualcosa di utile).
            spedizione = spedizioni.first { $0.stato == .confermato && $0.faseOperativa != .rientroVuoto }
                ?? spedizioni.first
        } catch {
            errore = "Impossibile caricare gli appuntamenti. Controlla la connessione e riprova."
        }
    }

    func segnalaRitiro() async {
        guard let spedizione else { return }
        do {
            try await APIClient.shared.segnalaRitiro(spedizioneId: spedizione.id, ora: oraCorrente())
            await carica()
        } catch {
            errore = "Non sono riuscito a registrare il ritiro. Riprova."
        }
    }

    func segnalaRientroVuoto() async {
        guard let spedizione else { return }
        do {
            try await APIClient.shared.segnalaRientroVuoto(spedizioneId: spedizione.id, ora: oraCorrente())
            await carica()
        } catch {
            errore = "Non sono riuscito a registrare il rientro del vuoto. Riprova."
        }
    }

    private func oraCorrente() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: Date())
    }
}

struct DriverHomeView: View {
    @EnvironmentObject private var config: AppConfig
    @StateObject private var vm: DriverHomeViewModel

    init() {
        _vm = StateObject(wrappedValue: DriverHomeViewModel(vettoreId: AppConfig.shared.vettoreId))
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    if let errore = vm.errore {
                        Text(errore)
                            .font(.footnote)
                            .foregroundStyle(.red)
                    }

                    if let spedizione = vm.spedizione {
                        AppuntamentoCard(spedizione: spedizione, vm: vm)
                        IstruzioniGateCard(spedizione: spedizione)
                    } else if !vm.isLoading {
                        Text("Nessun appuntamento confermato al momento.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }
                .padding()
            }
            .refreshable { await vm.carica() }
            .navigationTitle("Movr")
            .task { await vm.carica() }
        }
    }
}

private struct AppuntamentoCard: View {
    let spedizione: Spedizione
    @ObservedObject var vm: DriverHomeViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("PROSSIMO APPUNTAMENTO")
                .font(.caption2.weight(.semibold))
                .foregroundStyle(.white.opacity(0.7))
            Text(spedizione.oraAppuntamento ?? "-")
                .font(.system(size: 28, weight: .bold))
                .foregroundStyle(.white)

            Label(spedizione.terminalNome, systemImage: "mappin.and.ellipse")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.85))
            Label(spedizione.containerId, systemImage: "shippingbox")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.85))

            azionePrincipale
        }
        .padding(20)
        .background(Color(red: 0.06, green: 0.13, blue: 0.24))
        .clipShape(RoundedRectangle(cornerRadius: 20))
    }

    @ViewBuilder
    private var azionePrincipale: some View {
        if !vm.arrivato {
            Button {
                vm.arrivatoLocale = true
            } label: {
                Label("Segnala arrivo al gate", systemImage: "location.fill")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(.orange)
        } else if vm.arrivato && !vm.ritirato {
            Button {
                Task { await vm.segnalaRitiro() }
            } label: {
                Label("Segnala ritiro container", systemImage: "shippingbox.fill")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(.orange)
        } else if vm.ritirato && !vm.vuotoRientrato {
            VStack(spacing: 8) {
                Label("Ritirato alle \(spedizione.oraRitiro ?? ""), in consegna al cliente", systemImage: "checkmark.circle.fill")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.green)
                Button {
                    Task { await vm.segnalaRientroVuoto() }
                } label: {
                    Label("Segnala rientro container vuoto", systemImage: "arrow.uturn.left")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.orange)
            }
        } else if vm.vuotoRientrato {
            Label("Vuoto rientrato alle \(spedizione.oraRientroVuoto ?? ""), ciclo completato", systemImage: "checkmark.circle.fill")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.green)
        }
    }
}

private struct IstruzioniGateCard: View {
    let spedizione: Spedizione

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Istruzioni per il gate")
                .font(.caption.weight(.semibold))
            Text("• Documento di trasporto + targa mezzo")
            Text("• Corsia merci in \(spedizione.tipo == "import" ? "arrivo" : "partenza")")
            Text("• Container \(spedizione.containerId)")
        }
        .font(.footnote)
        .foregroundStyle(.secondary)
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

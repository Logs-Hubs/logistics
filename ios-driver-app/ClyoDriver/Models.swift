import Foundation

enum StatoAppuntamento: String, Codable {
    case confermato
    case daPianificare = "da_pianificare"
    case inRitardo = "in_ritardo"
}

enum FaseOperativa: String, Codable {
    case inAttesaRitiro = "in_attesa_ritiro"
    case ritirato
    case rientroVuoto = "rientro_vuoto"
}

struct Spedizione: Codable, Identifiable {
    let id: String
    let cliente: String
    let containerId: String
    let terminalId: String
    let terminalNome: String
    let stato: StatoAppuntamento
    let vettoreId: String
    let scadenzaDemurrage: String
    let oraAppuntamento: String?
    let dataAppuntamento: String?
    let tipo: String
    let merce: String
    let faseOperativa: FaseOperativa?
    let oraRitiro: String?
    let oraRientroVuoto: String?
}

struct SpedizioniResponse: Codable {
    let spedizioni: [Spedizione]
}

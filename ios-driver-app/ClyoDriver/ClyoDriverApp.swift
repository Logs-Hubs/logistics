import SwiftUI

@main
struct ClyoDriverApp: App {
    @StateObject private var config = AppConfig.shared

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(config)
        }
    }
}

struct RootView: View {
    @EnvironmentObject private var config: AppConfig

    var body: some View {
        if config.isConfigured {
            DriverHomeView()
        } else {
            SetupView()
        }
    }
}

// FamilyActivityPickerView.swift
// SwiftUI wrapper for FamilyActivityPicker
//
// This creates a native picker that lets students select which apps to allow/block
// during Study Mode. The picker is provided by Apple and shows all installed apps.

import SwiftUI
import FamilyControls

// MARK: - App Selection Store
// Stores the user's app selections using App Groups for cross-extension access

@available(iOS 16.0, *)
class AppSelectionStore: ObservableObject {
    static let shared = AppSelectionStore()
    
    private let userDefaults = UserDefaults(suiteName: "group.app.focas.shared")
    private let selectionsKey = "selectedAppsToBlock"
    private let allowedAppsKey = "allowedApps"
    private let teacherSuggestionsKey = "teacherSuggestedApps"
    
    @Published var appsToBlock: FamilyActivitySelection = FamilyActivitySelection() {
        didSet {
            saveSelections()
        }
    }
    
    @Published var allowedApps: FamilyActivitySelection = FamilyActivitySelection() {
        didSet {
            saveAllowedApps()
        }
    }
    
    init() {
        loadSelections()
    }
    
    private func saveSelections() {
        if let encoded = try? JSONEncoder().encode(appsToBlock) {
            userDefaults?.set(encoded, forKey: selectionsKey)
        }
    }
    
    private func loadSelections() {
        if let data = userDefaults?.data(forKey: selectionsKey),
           let decoded = try? JSONDecoder().decode(FamilyActivitySelection.self, from: data) {
            appsToBlock = decoded
        }
    }
    
    private func saveAllowedApps() {
        if let encoded = try? JSONEncoder().encode(allowedApps) {
            userDefaults?.set(encoded, forKey: allowedAppsKey)
        }
    }
    
    // MARK: - Teacher Suggestions
    
    func loadTeacherSuggestions() -> [String] {
        return userDefaults?.stringArray(forKey: teacherSuggestionsKey) ?? []
    }
    
    func saveTeacherSuggestions(_ suggestions: [String]) {
        userDefaults?.set(suggestions, forKey: teacherSuggestionsKey)
    }
    
    func clearAllSelections() {
        appsToBlock = FamilyActivitySelection()
        allowedApps = FamilyActivitySelection()
        userDefaults?.removeObject(forKey: selectionsKey)
        userDefaults?.removeObject(forKey: allowedAppsKey)
    }
}

// MARK: - FamilyActivityPicker Views

@available(iOS 16.0, *)
struct BlockedAppsPickerView: View {
    @StateObject private var store = AppSelectionStore.shared
    @State private var isPresented = false
    
    var body: some View {
        VStack(spacing: 20) {
            // Header
            VStack(spacing: 8) {
                Image(systemName: "app.badge.checkmark")
                    .font(.system(size: 48))
                    .foregroundColor(.blue)
                
                Text("Select Apps to Block")
                    .font(.title2)
                    .fontWeight(.semibold)
                
                Text("Choose which apps should be blocked during Study Mode")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            .padding()
            
            // Selection summary
            if !store.appsToBlock.applicationTokens.isEmpty || 
               !store.appsToBlock.categoryTokens.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Currently blocked:")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text("\(store.appsToBlock.applicationTokens.count) apps, \(store.appsToBlock.categoryTokens.count) categories")
                        .font(.headline)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(Color.red.opacity(0.1))
                .cornerRadius(12)
            }
            
            // Picker button
            Button(action: { isPresented = true }) {
                HStack {
                    Image(systemName: "plus.circle.fill")
                    Text("Choose Apps to Block")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(12)
            }
            .familyActivityPicker(isPresented: $isPresented, selection: $store.appsToBlock)
            
            Spacer()
        }
        .padding()
    }
}

@available(iOS 16.0, *)
struct AllowedAppsPickerView: View {
    @StateObject private var store = AppSelectionStore.shared
    @State private var isPresented = false
    
    var body: some View {
        VStack(spacing: 20) {
            // Header
            VStack(spacing: 8) {
                Image(systemName: "checkmark.shield")
                    .font(.system(size: 48))
                    .foregroundColor(.green)
                
                Text("Select Allowed Apps")
                    .font(.title2)
                    .fontWeight(.semibold)
                
                Text("Choose which apps should remain accessible during Study Mode")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            .padding()
            
            // Selection summary
            if !store.allowedApps.applicationTokens.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Always allowed:")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text("\(store.allowedApps.applicationTokens.count) apps")
                        .font(.headline)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(Color.green.opacity(0.1))
                .cornerRadius(12)
            }
            
            // Picker button
            Button(action: { isPresented = true }) {
                HStack {
                    Image(systemName: "plus.circle.fill")
                    Text("Choose Allowed Apps")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(12)
            }
            .familyActivityPicker(isPresented: $isPresented, selection: $store.allowedApps)
            
            Spacer()
        }
        .padding()
    }
}

// MARK: - Combined App Management View

@available(iOS 16.0, *)
struct AppManagementView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        NavigationView {
            VStack {
                Picker("Mode", selection: $selectedTab) {
                    Text("Block Apps").tag(0)
                    Text("Allow Apps").tag(1)
                }
                .pickerStyle(SegmentedPickerStyle())
                .padding()
                
                if selectedTab == 0 {
                    BlockedAppsPickerView()
                } else {
                    AllowedAppsPickerView()
                }
            }
            .navigationTitle("App Settings")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - Preview

@available(iOS 16.0, *)
struct AppManagementView_Previews: PreviewProvider {
    static var previews: some View {
        AppManagementView()
    }
}

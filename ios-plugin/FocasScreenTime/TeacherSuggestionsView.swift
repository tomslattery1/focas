// TeacherSuggestionsView.swift
// UI for displaying and accepting teacher-suggested app restrictions
//
// This view shows apps that teachers have recommended to block during Study Mode.
// Students can review suggestions and choose to accept them voluntarily.

import SwiftUI
import FamilyControls

// MARK: - Teacher Suggestion Model

struct TeacherAppSuggestion: Identifiable, Codable {
    let id: String
    let appName: String
    let appBundleId: String?
    let category: String
    let reason: String
    let teacherName: String
    let suggestedAt: Date
    var isAccepted: Bool = false
}

// MARK: - Suggestions Store

@available(iOS 16.0, *)
class TeacherSuggestionsStore: ObservableObject {
    static let shared = TeacherSuggestionsStore()
    
    private let userDefaults = UserDefaults(suiteName: "group.app.focas.shared")
    private let suggestionsKey = "teacherAppSuggestions"
    
    @Published var suggestions: [TeacherAppSuggestion] = []
    
    init() {
        loadSuggestions()
    }
    
    func loadSuggestions() {
        if let data = userDefaults?.data(forKey: suggestionsKey),
           let decoded = try? JSONDecoder().decode([TeacherAppSuggestion].self, from: data) {
            suggestions = decoded
        }
    }
    
    func saveSuggestions() {
        if let encoded = try? JSONEncoder().encode(suggestions) {
            userDefaults?.set(encoded, forKey: suggestionsKey)
        }
    }
    
    func acceptSuggestion(_ suggestion: TeacherAppSuggestion) {
        if let index = suggestions.firstIndex(where: { $0.id == suggestion.id }) {
            suggestions[index].isAccepted = true
            saveSuggestions()
            
            // Add to blocked apps
            // Note: In production, you'd match the bundle ID to an ApplicationToken
            // This requires the FamilyActivityPicker to have been used first
        }
    }
    
    func rejectSuggestion(_ suggestion: TeacherAppSuggestion) {
        suggestions.removeAll { $0.id == suggestion.id }
        saveSuggestions()
    }
    
    func addSuggestion(_ suggestion: TeacherAppSuggestion) {
        suggestions.append(suggestion)
        saveSuggestions()
    }
    
    // Called from React Native/Capacitor bridge when teacher sends suggestions
    func syncSuggestionsFromServer(_ newSuggestions: [TeacherAppSuggestion]) {
        // Merge new suggestions, keeping accepted status
        for suggestion in newSuggestions {
            if !suggestions.contains(where: { $0.id == suggestion.id }) {
                suggestions.append(suggestion)
            }
        }
        saveSuggestions()
    }
}

// MARK: - Teacher Suggestions View

@available(iOS 16.0, *)
struct TeacherSuggestionsView: View {
    @StateObject private var store = TeacherSuggestionsStore.shared
    @State private var showingAcceptAll = false
    
    var pendingSuggestions: [TeacherAppSuggestion] {
        store.suggestions.filter { !$0.isAccepted }
    }
    
    var acceptedSuggestions: [TeacherAppSuggestion] {
        store.suggestions.filter { $0.isAccepted }
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Header
                VStack(spacing: 8) {
                    Image(systemName: "person.badge.shield.checkmark")
                        .font(.system(size: 48))
                        .foregroundColor(.blue)
                    
                    Text("Teacher Suggestions")
                        .font(.title2)
                        .fontWeight(.semibold)
                    
                    Text("Your teachers have suggested these apps to block during Study Mode. You can choose to accept or dismiss each suggestion.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding()
                
                // Pending suggestions
                if !pendingSuggestions.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("Pending Suggestions")
                                .font(.headline)
                            Spacer()
                            Button("Accept All") {
                                showingAcceptAll = true
                            }
                            .font(.subheadline)
                        }
                        
                        ForEach(pendingSuggestions) { suggestion in
                            SuggestionCard(
                                suggestion: suggestion,
                                onAccept: { store.acceptSuggestion(suggestion) },
                                onReject: { store.rejectSuggestion(suggestion) }
                            )
                        }
                    }
                    .padding(.horizontal)
                }
                
                // Accepted suggestions
                if !acceptedSuggestions.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Accepted")
                            .font(.headline)
                        
                        ForEach(acceptedSuggestions) { suggestion in
                            AcceptedSuggestionCard(suggestion: suggestion)
                        }
                    }
                    .padding(.horizontal)
                }
                
                // Empty state
                if store.suggestions.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "checkmark.circle")
                            .font(.system(size: 48))
                            .foregroundColor(.green)
                        
                        Text("No Suggestions")
                            .font(.headline)
                        
                        Text("Your teachers haven't suggested any apps to block yet.")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.vertical, 40)
                }
            }
        }
        .alert("Accept All Suggestions?", isPresented: $showingAcceptAll) {
            Button("Accept All", role: .destructive) {
                for suggestion in pendingSuggestions {
                    store.acceptSuggestion(suggestion)
                }
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("This will add all \(pendingSuggestions.count) suggested apps to your blocked list during Study Mode.")
        }
    }
}

// MARK: - Suggestion Card

@available(iOS 16.0, *)
struct SuggestionCard: View {
    let suggestion: TeacherAppSuggestion
    let onAccept: () -> Void
    let onReject: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                // App icon placeholder
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.gray.opacity(0.2))
                    .frame(width: 44, height: 44)
                    .overlay(
                        Image(systemName: "app.fill")
                            .foregroundColor(.gray)
                    )
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(suggestion.appName)
                        .font(.headline)
                    
                    Text(suggestion.category)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
            
            // Reason
            HStack(alignment: .top, spacing: 8) {
                Image(systemName: "info.circle")
                    .foregroundColor(.blue)
                    .font(.caption)
                
                Text(suggestion.reason)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            // Teacher info
            HStack {
                Image(systemName: "person.circle")
                    .foregroundColor(.secondary)
                
                Text("Suggested by \(suggestion.teacherName)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            // Action buttons
            HStack(spacing: 12) {
                Button(action: onReject) {
                    Text("Dismiss")
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(Color.gray.opacity(0.1))
                        .foregroundColor(.primary)
                        .cornerRadius(8)
                }
                
                Button(action: onAccept) {
                    Text("Accept")
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Accepted Suggestion Card

@available(iOS 16.0, *)
struct AcceptedSuggestionCard: View {
    let suggestion: TeacherAppSuggestion
    
    var body: some View {
        HStack {
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.gray.opacity(0.2))
                .frame(width: 36, height: 36)
                .overlay(
                    Image(systemName: "app.fill")
                        .foregroundColor(.gray)
                        .font(.caption)
                )
            
            VStack(alignment: .leading, spacing: 2) {
                Text(suggestion.appName)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Text("Blocked during Study Mode")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(.green)
        }
        .padding()
        .background(Color.green.opacity(0.05))
        .cornerRadius(12)
    }
}

// MARK: - Preview

@available(iOS 16.0, *)
struct TeacherSuggestionsView_Previews: PreviewProvider {
    static var previews: some View {
        TeacherSuggestionsView()
    }
}

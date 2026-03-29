// DeviceActivityMonitorExtension.swift
// Extension to respond to device activity events
//
// SETUP INSTRUCTIONS:
// 1. In Xcode, File > New > Target > Device Activity Monitor Extension
// 2. Replace the generated code with this template
// 3. Update your App Group identifier

import DeviceActivity
import ManagedSettings
import Foundation

// Customize this extension to respond to device activity schedule events
class FocasDeviceActivityMonitor: DeviceActivityMonitor {
    
    let store = ManagedSettingsStore()
    
    // Called when a scheduled activity interval begins (e.g., school starts)
    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        
        // Apply restrictions when school hours begin
        if activity.rawValue == "school_hours" {
            enableSchoolModeRestrictions()
            notifyApp(event: "school_mode_started")
        }
    }
    
    // Called when a scheduled activity interval ends (e.g., school ends)
    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        
        // Remove restrictions when school hours end
        if activity.rawValue == "school_hours" {
            disableSchoolModeRestrictions()
            notifyApp(event: "school_mode_ended")
        }
    }
    
    // Called when user reaches a usage threshold
    override func eventDidReachThreshold(_ event: DeviceActivityEvent.Name, activity: DeviceActivityName) {
        super.eventDidReachThreshold(event, activity: activity)
        
        notifyApp(event: "threshold_reached", data: ["event": event.rawValue])
    }
    
    // MARK: - Private Methods
    
    private func enableSchoolModeRestrictions() {
        // Block all apps and categories during school mode
        // In production, you'd load the user's selected apps from shared storage
        store.shield.applications = nil
        store.shield.applicationCategories = .all(except: Set())
        store.shield.webDomainCategories = .all(except: Set())
    }
    
    private func disableSchoolModeRestrictions() {
        // Remove all restrictions
        store.clearAllSettings()
    }
    
    private func notifyApp(event: String, data: [String: Any]? = nil) {
        // Use App Groups to communicate with the main app
        // Store event in shared UserDefaults
        let sharedDefaults = UserDefaults(suiteName: "group.app.focas.shared")
        
        var eventData: [String: Any] = [
            "event": event,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        if let additionalData = data {
            eventData.merge(additionalData) { (_, new) in new }
        }
        
        // Store latest event
        sharedDefaults?.set(eventData, forKey: "latestDeviceActivityEvent")
        
        // Store event history (keep last 50)
        var history = sharedDefaults?.array(forKey: "deviceActivityEventHistory") as? [[String: Any]] ?? []
        history.insert(eventData, at: 0)
        if history.count > 50 {
            history = Array(history.prefix(50))
        }
        sharedDefaults?.set(history, forKey: "deviceActivityEventHistory")
    }
}

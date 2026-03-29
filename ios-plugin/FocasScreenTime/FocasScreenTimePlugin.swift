// FocasScreenTimePlugin.swift
// Capacitor plugin for Screen Time API integration
// 
// SETUP INSTRUCTIONS:
// 1. Copy this folder into your Xcode project after running `npx cap add ios`
// 2. Add to your app's Podfile or link manually
// 3. Request Family Controls entitlement from Apple Developer Portal
// 4. Add the Family Controls capability in Xcode

import Foundation
import Capacitor

// Required iOS 15+ frameworks
#if canImport(FamilyControls)
import FamilyControls
import DeviceActivity
import ManagedSettings
#endif

@objc(FocasScreenTimePlugin)
public class FocasScreenTimePlugin: CAPPlugin, CAPBridgedPlugin {
    
    public let identifier = "FocasScreenTimePlugin"
    public let jsName = "FocasScreenTime"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getAuthorizationStatus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startMonitoring", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopMonitoring", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setAppRestrictions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "removeRestrictions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getUsageReport", returnType: CAPPluginReturnPromise)
    ]
    
    #if canImport(FamilyControls)
    private let center = AuthorizationCenter.shared
    private let store = ManagedSettingsStore()
    #endif
    
    // MARK: - Authorization
    
    @objc func requestAuthorization(_ call: CAPPluginCall) {
        #if canImport(FamilyControls)
        if #available(iOS 16.0, *) {
            Task {
                do {
                    try await center.requestAuthorization(for: .individual)
                    call.resolve([
                        "granted": true,
                        "status": "authorized"
                    ])
                } catch {
                    call.resolve([
                        "granted": false,
                        "status": "denied",
                        "error": error.localizedDescription
                    ])
                }
            }
        } else {
            call.reject("Screen Time API requires iOS 16 or later")
        }
        #else
        call.reject("FamilyControls framework not available")
        #endif
    }
    
    @objc func getAuthorizationStatus(_ call: CAPPluginCall) {
        #if canImport(FamilyControls)
        if #available(iOS 16.0, *) {
            let status: String
            switch center.authorizationStatus {
            case .notDetermined:
                status = "notDetermined"
            case .denied:
                status = "denied"
            case .approved:
                status = "approved"
            @unknown default:
                status = "unknown"
            }
            
            call.resolve([
                "status": status,
                "isAuthorized": center.authorizationStatus == .approved
            ])
        } else {
            call.reject("Screen Time API requires iOS 16 or later")
        }
        #else
        call.reject("FamilyControls framework not available")
        #endif
    }
    
    // MARK: - Monitoring
    
    @objc func startMonitoring(_ call: CAPPluginCall) {
        #if canImport(FamilyControls)
        guard let scheduleName = call.getString("scheduleName") else {
            call.reject("Schedule name is required")
            return
        }
        
        if #available(iOS 16.0, *) {
            // Create a DeviceActivitySchedule for school hours
            let startHour = call.getInt("startHour") ?? 8
            let startMinute = call.getInt("startMinute") ?? 30
            let endHour = call.getInt("endHour") ?? 15
            let endMinute = call.getInt("endMinute") ?? 30
            
            let schedule = DeviceActivitySchedule(
                intervalStart: DateComponents(hour: startHour, minute: startMinute),
                intervalEnd: DateComponents(hour: endHour, minute: endMinute),
                repeats: true
            )
            
            let deviceActivityCenter = DeviceActivityCenter()
            
            do {
                try deviceActivityCenter.startMonitoring(
                    DeviceActivityName(rawValue: scheduleName),
                    during: schedule
                )
                call.resolve([
                    "success": true,
                    "message": "Monitoring started for \(scheduleName)"
                ])
            } catch {
                call.reject("Failed to start monitoring: \(error.localizedDescription)")
            }
        } else {
            call.reject("Screen Time API requires iOS 16 or later")
        }
        #else
        call.reject("FamilyControls framework not available")
        #endif
    }
    
    @objc func stopMonitoring(_ call: CAPPluginCall) {
        #if canImport(FamilyControls)
        guard let scheduleName = call.getString("scheduleName") else {
            call.reject("Schedule name is required")
            return
        }
        
        if #available(iOS 16.0, *) {
            let deviceActivityCenter = DeviceActivityCenter()
            deviceActivityCenter.stopMonitoring([DeviceActivityName(rawValue: scheduleName)])
            call.resolve([
                "success": true,
                "message": "Monitoring stopped"
            ])
        } else {
            call.reject("Screen Time API requires iOS 16 or later")
        }
        #else
        call.reject("FamilyControls framework not available")
        #endif
    }
    
    // MARK: - App Restrictions
    
    @objc func setAppRestrictions(_ call: CAPPluginCall) {
        #if canImport(FamilyControls)
        if #available(iOS 16.0, *) {
            // Block all apps except allowed ones during school mode
            // In a real implementation, you would use FamilyActivityPicker
            // to let users select which apps to restrict
            
            store.shield.applications = nil // Block all by default
            store.shield.applicationCategories = .all(except: Set())
            store.shield.webDomainCategories = .all(except: Set())
            
            call.resolve([
                "success": true,
                "message": "App restrictions applied"
            ])
        } else {
            call.reject("Screen Time API requires iOS 16 or later")
        }
        #else
        call.reject("FamilyControls framework not available")
        #endif
    }
    
    @objc func removeRestrictions(_ call: CAPPluginCall) {
        #if canImport(FamilyControls)
        if #available(iOS 16.0, *) {
            store.clearAllSettings()
            call.resolve([
                "success": true,
                "message": "All restrictions removed"
            ])
        } else {
            call.reject("Screen Time API requires iOS 16 or later")
        }
        #else
        call.reject("FamilyControls framework not available")
        #endif
    }
    
    // MARK: - Usage Reports
    
    @objc func getUsageReport(_ call: CAPPluginCall) {
        // Note: Getting detailed usage data requires DeviceActivityReport extension
        // This is a placeholder that returns mock data
        // Real implementation requires a DeviceActivityReportExtension
        
        call.resolve([
            "available": false,
            "message": "Usage reports require DeviceActivityReportExtension. See Apple documentation for setup."
        ])
    }
}

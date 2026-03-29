# Fócas iOS Technical Handoff Document

## Executive Summary

**Fócas** is a school-focused screen time management application designed to help students focus during class hours. This document provides all technical requirements for converting the existing Lovable web application into a fully functional native iOS app using Capacitor.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Capacitor Configuration](#capacitor-configuration)
4. [Screen Time API Integration](#screen-time-api-integration)
5. [Plugin API Contracts](#plugin-api-contracts)
6. [Native Swift Implementation](#native-swift-implementation)
7. [Required Entitlements & Capabilities](#required-entitlements--capabilities)
8. [App Groups Configuration](#app-groups-configuration)
9. [User Flows & States](#user-flows--states)
10. [Data Models](#data-models)
11. [Testing Considerations](#testing-considerations)
12. [App Store Submission Notes](#app-store-submission-notes)

---

## Project Overview

### Application Purpose
Fócas enables schools to manage student device usage during class hours through Apple's Screen Time APIs. Students voluntarily opt-in to have their app usage monitored and restricted during school hours.

### User Roles
| Role | Description |
|------|-------------|
| **Student** | Primary user who activates "Study Mode" to limit distracting apps |
| **Teacher** | Monitors student compliance, sends app limit suggestions |
| **Guardian** | Views child's compliance, can generate unlock codes |
| **Admin** | School administrator managing users, schedules, and policies |

### Key Features Requiring Native Implementation
- Screen Time authorization and monitoring
- App restriction/shielding during school hours
- Background device activity monitoring
- NFC tag scanning for activation (optional)
- Push notifications for schedule reminders

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Web App (Capacitor)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Student UI  │  │ Teacher UI  │  │ Guardian/Admin UI   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          ▼                                   │
│              ┌───────────────────────┐                       │
│              │   useScreenTime Hook  │                       │
│              └───────────┬───────────┘                       │
└──────────────────────────┼───────────────────────────────────┘
                           │ Capacitor Bridge
┌──────────────────────────┼───────────────────────────────────┐
│                          ▼                                   │
│              ┌───────────────────────┐                       │
│              │ FocasScreenTimePlugin │                       │
│              └───────────┬───────────┘                       │
│                          │                                   │
│         ┌────────────────┼────────────────┐                  │
│         ▼                ▼                ▼                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Family    │  │  Managed    │  │  Device     │          │
│  │  Controls   │  │  Settings   │  │  Activity   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│                    iOS Native Layer                          │
└──────────────────────────────────────────────────────────────┘
```

---

## Capacitor Configuration

### Current Configuration (`capacitor.config.ts`)
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e5867dacef6847778254fb6b50915bf3',
  appName: 'focas',
  webDir: 'dist',
  server: {
    // Development only - remove for production
    url: 'https://e5867dac-ef68-4777-8254-fb6b50915bf3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
```

### Production Configuration (Recommended)
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.focas.school', // Update to production bundle ID
  appName: 'Fócas',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    backgroundColor: '#0C0A09' // Match app dark background
  },
  plugins: {
    FocasScreenTime: {
      // Plugin-specific configuration
    }
  }
};

export default config;
```

### Setup Commands
```bash
# Install dependencies
npm install

# Build web assets
npm run build

# Add iOS platform
npx cap add ios

# Sync changes
npx cap sync ios

# Open in Xcode
npx cap open ios
```

---

## Screen Time API Integration

### Required Frameworks
| Framework | Purpose | iOS Version |
|-----------|---------|-------------|
| `FamilyControls` | Authorization & app selection | iOS 16.0+ |
| `ManagedSettings` | Apply/remove app restrictions | iOS 16.0+ |
| `DeviceActivity` | Schedule-based monitoring | iOS 16.0+ |

### Authorization Flow
```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   App UI    │────▶│ Request Auth     │────▶│ System Dialog   │
│             │     │ (FamilyControls) │     │ (Apple)         │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                      │
                    ┌──────────────────┐              │
                    │ Authorization    │◀─────────────┘
                    │ Result           │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌─────────┐    ┌─────────┐    ┌─────────┐
        │Approved │    │ Denied  │    │ Unknown │
        └─────────┘    └─────────┘    └─────────┘
```

### Authorization States
```typescript
type ScreenTimeAuthorizationStatus = 
  | 'notDetermined'  // User hasn't been asked yet
  | 'denied'         // User denied permission
  | 'approved'       // User granted permission
  | 'unknown';       // Error or unavailable
```

---

## Plugin API Contracts

### TypeScript Interface (`src/types/screen-time.ts`)

```typescript
export interface FocasScreenTimePlugin {
  /**
   * Request Screen Time authorization from the user
   * Shows system dialog for Family Controls permission
   */
  requestAuthorization(): Promise<ScreenTimeAuthResult>;

  /**
   * Get current authorization status without prompting
   */
  getAuthorizationStatus(): Promise<ScreenTimeStatusResult>;

  /**
   * Start monitoring device activity for a schedule
   * @param options - Schedule configuration
   */
  startMonitoring(options: MonitoringOptions): Promise<MonitoringResult>;

  /**
   * Stop monitoring a specific schedule
   * @param options - Schedule identifier
   */
  stopMonitoring(options: { scheduleName: string }): Promise<{ success: boolean; message: string }>;

  /**
   * Apply app restrictions (shield distracting apps)
   */
  setAppRestrictions(): Promise<{ success: boolean; message: string }>;

  /**
   * Remove all app restrictions
   */
  removeRestrictions(): Promise<{ success: boolean; message: string }>;

  /**
   * Get usage report (requires DeviceActivityReport extension)
   */
  getUsageReport(): Promise<{ available: boolean; message: string }>;
}
```

### Request/Response Types

```typescript
// Authorization Result
interface ScreenTimeAuthResult {
  granted: boolean;
  status: ScreenTimeAuthorizationStatus;
  error?: string;
}

// Status Check Result
interface ScreenTimeStatusResult {
  status: ScreenTimeAuthorizationStatus;
  isAuthorized: boolean;
}

// Monitoring Configuration
interface MonitoringOptions {
  scheduleName: string;      // Unique identifier (e.g., "school_hours")
  startHour: number;         // 0-23
  startMinute: number;       // 0-59
  endHour: number;           // 0-23
  endMinute: number;           // 0-59
}

// Monitoring Result
interface MonitoringResult {
  success: boolean;
  message: string;
}
```

### JavaScript Usage Example

```typescript
import { registerPlugin } from '@capacitor/core';
import type { FocasScreenTimePlugin } from '@/types/screen-time';

const FocasScreenTime = registerPlugin<FocasScreenTimePlugin>('FocasScreenTime');

// Request authorization
async function setupScreenTime() {
  const result = await FocasScreenTime.requestAuthorization();
  
  if (result.granted) {
    // Start monitoring school hours (8:30 AM - 3:30 PM)
    await FocasScreenTime.startMonitoring({
      scheduleName: 'school_hours',
      startHour: 8,
      startMinute: 30,
      endHour: 15,
      endMinute: 30
    });
    
    // Apply restrictions immediately
    await FocasScreenTime.setAppRestrictions();
  }
}

// Remove restrictions (e.g., when school ends)
async function endSchoolMode() {
  await FocasScreenTime.removeRestrictions();
  await FocasScreenTime.stopMonitoring({ scheduleName: 'school_hours' });
}
```

---

## Native Swift Implementation

### File Structure
```
ios/App/App/
├── FocasScreenTime/
│   ├── FocasScreenTimePlugin.swift      # Main Capacitor plugin
│   ├── FocasScreenTimePlugin.m          # Objective-C bridge
│   ├── FamilyActivityPickerView.swift   # App selection UI
│   └── TeacherSuggestionsView.swift     # Teacher suggestions UI
├── Extensions/
│   ├── FocasActivityMonitor/            # Device Activity Monitor Extension
│   │   ├── DeviceActivityMonitorExtension.swift
│   │   └── Info.plist
│   ├── FocasActivityReport/             # Device Activity Report Extension (optional)
│   │   └── ...
│   └── FocasShieldConfig/               # Shield Configuration Extension (optional)
│       └── ...
└── AppDelegate.swift                     # Register plugin here
```

### Main Plugin Implementation (`FocasScreenTimePlugin.swift`)

```swift
import Capacitor
import FamilyControls
import ManagedSettings
import DeviceActivity

@available(iOS 16.0, *)
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
    
    private let center = AuthorizationCenter.shared
    private let store = ManagedSettingsStore()
    private let deviceActivityCenter = DeviceActivityCenter()
    
    // MARK: - Authorization
    
    @objc func requestAuthorization(_ call: CAPPluginCall) {
        Task {
            do {
                try await center.requestAuthorization(for: .individual)
                
                let status = center.authorizationStatus
                call.resolve([
                    "granted": status == .approved,
                    "status": self.statusString(from: status)
                ])
            } catch {
                call.resolve([
                    "granted": false,
                    "status": "denied",
                    "error": error.localizedDescription
                ])
            }
        }
    }
    
    @objc func getAuthorizationStatus(_ call: CAPPluginCall) {
        let status = center.authorizationStatus
        call.resolve([
            "status": statusString(from: status),
            "isAuthorized": status == .approved
        ])
    }
    
    // MARK: - Monitoring
    
    @objc func startMonitoring(_ call: CAPPluginCall) {
        guard let scheduleName = call.getString("scheduleName") else {
            call.reject("Missing scheduleName")
            return
        }
        
        let startHour = call.getInt("startHour") ?? 8
        let startMinute = call.getInt("startMinute") ?? 30
        let endHour = call.getInt("endHour") ?? 15
        let endMinute = call.getInt("endMinute") ?? 30
        
        let schedule = DeviceActivitySchedule(
            intervalStart: DateComponents(hour: startHour, minute: startMinute),
            intervalEnd: DateComponents(hour: endHour, minute: endMinute),
            repeats: true
        )
        
        do {
            let activityName = DeviceActivityName(scheduleName)
            try deviceActivityCenter.startMonitoring(activityName, during: schedule)
            
            call.resolve([
                "success": true,
                "message": "Monitoring started for \(scheduleName)"
            ])
        } catch {
            call.resolve([
                "success": false,
                "message": error.localizedDescription
            ])
        }
    }
    
    @objc func stopMonitoring(_ call: CAPPluginCall) {
        guard let scheduleName = call.getString("scheduleName") else {
            call.reject("Missing scheduleName")
            return
        }
        
        let activityName = DeviceActivityName(scheduleName)
        deviceActivityCenter.stopMonitoring([activityName])
        
        call.resolve([
            "success": true,
            "message": "Monitoring stopped"
        ])
    }
    
    // MARK: - Restrictions
    
    @objc func setAppRestrictions(_ call: CAPPluginCall) {
        // Load user's app selection from App Groups storage
        let selection = loadAppSelection()
        
        if selection.applicationTokens.isEmpty && selection.categoryTokens.isEmpty {
            // No specific apps selected - block all except system apps
            store.shield.applicationCategories = .all(except: Set())
        } else {
            // Block only selected apps
            store.shield.applications = selection.applicationTokens
            store.shield.applicationCategories = ShieldSettings
                .ActivityCategoryPolicy
                .specific(selection.categoryTokens)
        }
        
        call.resolve([
            "success": true,
            "message": "Restrictions applied"
        ])
    }
    
    @objc func removeRestrictions(_ call: CAPPluginCall) {
        store.clearAllSettings()
        
        call.resolve([
            "success": true,
            "message": "Restrictions removed"
        ])
    }
    
    @objc func getUsageReport(_ call: CAPPluginCall) {
        // Note: Detailed usage reports require DeviceActivityReportExtension
        call.resolve([
            "available": false,
            "message": "Usage reports require DeviceActivityReport extension"
        ])
    }
    
    // MARK: - Helpers
    
    private func statusString(from status: AuthorizationStatus) -> String {
        switch status {
        case .notDetermined: return "notDetermined"
        case .denied: return "denied"
        case .approved: return "approved"
        @unknown default: return "unknown"
        }
    }
    
    private func loadAppSelection() -> FamilyActivitySelection {
        // Load from App Groups UserDefaults
        let defaults = UserDefaults(suiteName: "group.app.focas.shared")
        // Decode stored selection...
        return FamilyActivitySelection()
    }
}
```

### Device Activity Monitor Extension

```swift
// DeviceActivityMonitorExtension.swift
import DeviceActivity
import ManagedSettings
import Foundation

class FocasDeviceActivityMonitor: DeviceActivityMonitor {
    
    let store = ManagedSettingsStore()
    let sharedDefaults = UserDefaults(suiteName: "group.app.focas.shared")
    
    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        
        if activity.rawValue == "school_hours" {
            // School started - apply restrictions
            enableSchoolModeRestrictions()
            notifyApp(event: "school_mode_started")
        }
    }
    
    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        
        if activity.rawValue == "school_hours" {
            // School ended - remove restrictions
            disableSchoolModeRestrictions()
            notifyApp(event: "school_mode_ended")
        }
    }
    
    private func enableSchoolModeRestrictions() {
        store.shield.applicationCategories = .all(except: Set())
        store.shield.webDomainCategories = .all(except: Set())
    }
    
    private func disableSchoolModeRestrictions() {
        store.clearAllSettings()
    }
    
    private func notifyApp(event: String) {
        sharedDefaults?.set([
            "event": event,
            "timestamp": Date().timeIntervalSince1970
        ], forKey: "latestDeviceActivityEvent")
    }
}
```

---

## Required Entitlements & Capabilities

### Entitlements File (`App.entitlements`)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.family-controls</key>
    <dict>
        <key>AuthorizationMode</key>
        <string>individual</string>
    </dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.app.focas.shared</string>
    </array>
</dict>
</plist>
```

### Required Capabilities in Xcode
| Capability | Purpose |
|------------|---------|
| Family Controls | Access Screen Time APIs |
| App Groups | Share data between app and extensions |
| Push Notifications | Schedule reminders (optional) |
| Background Modes | Background fetch for status updates (optional) |

### Apple Developer Portal Setup
1. **Create App ID** with bundle identifier `app.focas.school` (or your chosen ID)
2. **Enable Family Controls** capability (requires Apple approval)
3. **Create App Group** identifier `group.app.focas.shared`
4. **Submit Family Controls Request** via [Apple Developer Portal](https://developer.apple.com)
   - Explain educational use case
   - Emphasize voluntary student/parent consent
   - May take days/weeks for approval

---

## App Groups Configuration

### Shared Data Store
```swift
// Shared constants
struct FocasShared {
    static let appGroupIdentifier = "group.app.focas.shared"
    
    // UserDefaults keys
    static let keyAppsToBlock = "appsToBlock"
    static let keyAllowedApps = "allowedApps"
    static let keyTeacherSuggestions = "teacherSuggestions"
    static let keyLatestEvent = "latestDeviceActivityEvent"
    static let keyEventHistory = "deviceActivityEventHistory"
    static let keySchoolSchedule = "schoolSchedule"
}

// Access shared storage
let sharedDefaults = UserDefaults(suiteName: FocasShared.appGroupIdentifier)
```

### Data Flow Between App and Extension
```
┌─────────────────┐                    ┌─────────────────┐
│    Main App     │                    │    Extension    │
│                 │                    │                 │
│  Save app       │──── App Groups ───▶│  Read app       │
│  selection      │    UserDefaults    │  selection      │
│                 │                    │                 │
│  Read events    │◀─── App Groups ────│  Write events   │
│                 │    UserDefaults    │                 │
└─────────────────┘                    └─────────────────┘
```

---

## User Flows & States

### Student Activation Flow
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Launch     │────▶│   Login      │────▶│ Age Verify   │
│   App        │     │ (Student ID) │     │ (Under 13?)  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                     ┌──────────────┐              │
                     │  Parental    │◀─────Yes────┘
                     │  Consent     │              │
                     └──────┬───────┘              No
                            │                      │
                            ▼                      ▼
                     ┌──────────────┐     ┌──────────────┐
                     │  Data        │◀────│  Screen Time │
                     │  Consent     │     │  Permission  │
                     └──────┬───────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Main       │
                     │   Dashboard  │
                     └──────────────┘
```

### Study Mode States
```typescript
type StudyModeState = 
  | 'inactive'           // Not in study mode
  | 'pending_activation' // User initiated, waiting for NFC/confirm
  | 'active'             // Study mode running
  | 'pending_deactivation'; // Waiting for code/NFC to deactivate

interface StudyModeContext {
  state: StudyModeState;
  activatedAt?: Date;
  scheduledEndTime?: Date;
  deactivationMethod?: 'nfc' | 'teacher_code' | 'guardian_code' | 'scheduled';
}
```

### Deactivation Methods
| Method | Description | Implementation |
|--------|-------------|----------------|
| **NFC** | Tap school NFC tag | Web NFC API (limited iOS support) |
| **Teacher Code** | Enter 6-digit code from teacher | Verify against teacher-generated codes |
| **Guardian Code** | Enter code from parent/guardian | Verify against guardian-generated codes |
| **Scheduled** | Automatic at end of school day | DeviceActivity extension handles this |

---

## Data Models

### Core Types (`src/types/app.ts`)

```typescript
// Compliance Status
type ComplianceStatus = 'green' | 'amber' | 'red';

// User Types
interface Student {
  id: string;
  name: string;
  email?: string;
  studentId: string;
  classId: string;
  complianceStatus: ComplianceStatus;
  isStudyModeActive: boolean;
  guardianLinked: boolean;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  classes: string[];
}

// Schedule Types
interface ClassSession {
  id: string;
  name: string;
  startTime: string; // HH:mm format
  endTime: string;
  room?: string;
  teacherId: string;
}

interface DaySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  sessions: ClassSession[];
}
```

### App Suggestion Types (`src/types/app-suggestions.ts`)

```typescript
interface AppBlockingSuggestion {
  id: string;
  teacherId: string;
  teacherName: string;
  className: string;
  suggestedApps: SuggestedApp[];
  reason: string;
  createdAt: Date;
  expiresAt?: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

interface SuggestedApp {
  name: string;
  bundleId?: string; // iOS bundle identifier
  icon?: string;
  category: 'social' | 'games' | 'entertainment' | 'other';
}

interface StudentSuggestionResponse {
  suggestionId: string;
  studentId: string;
  response: 'accepted' | 'rejected';
  respondedAt: Date;
}
```

---

## Testing Considerations

### Simulator Limitations
- Screen Time APIs **do not work** in iOS Simulator
- Must test on physical device
- Use mock implementation for development

### Mock Implementation
The web app includes a mock implementation in `src/types/screen-time.ts`:

```typescript
export const createMockScreenTimePlugin = (): FocasScreenTimePlugin => ({
  async requestAuthorization() {
    const granted = localStorage.getItem('screenTimePermissionGranted') === 'true';
    return {
      granted,
      status: granted ? 'approved' : 'notDetermined'
    };
  },
  
  async getAuthorizationStatus() {
    const permission = localStorage.getItem('screenTimePermissionGranted');
    if (permission === 'true') {
      return { status: 'approved', isAuthorized: true };
    } else if (permission === 'false') {
      return { status: 'denied', isAuthorized: false };
    }
    return { status: 'notDetermined', isAuthorized: false };
  },
  
  async startMonitoring(options) {
    console.log('[Mock] Starting monitoring:', options);
    localStorage.setItem('screenTimeMonitoring', JSON.stringify(options));
    return { success: true, message: 'Mock monitoring started' };
  },
  
  async stopMonitoring(options) {
    console.log('[Mock] Stopping monitoring:', options);
    localStorage.removeItem('screenTimeMonitoring');
    return { success: true, message: 'Mock monitoring stopped' };
  },
  
  async setAppRestrictions() {
    console.log('[Mock] Setting app restrictions');
    localStorage.setItem('screenTimeRestrictions', 'active');
    return { success: true, message: 'Mock restrictions applied' };
  },
  
  async removeRestrictions() {
    console.log('[Mock] Removing restrictions');
    localStorage.removeItem('screenTimeRestrictions');
    return { success: true, message: 'Mock restrictions removed' };
  },
  
  async getUsageReport() {
    return { available: false, message: 'Usage reports not available in mock mode' };
  }
});
```

### Test Scenarios
| Scenario | Expected Behavior |
|----------|-------------------|
| First launch | Show onboarding, request permission |
| Permission denied | Show explanation, allow retry |
| Schedule starts | Auto-apply restrictions |
| Schedule ends | Auto-remove restrictions |
| Manual activation | Apply restrictions immediately |
| Teacher code entry | Validate and remove restrictions |
| App in background | Restrictions persist |
| Device restart | Restrictions restore automatically |

---

## App Store Submission Notes

### Review Guidelines Compliance
1. **Explain voluntary nature** - Users opt-in to monitoring
2. **Document parental consent** - Under-13 requires parent approval
3. **Educational purpose** - Helps students focus during class
4. **No coercion** - Students can decline

### App Review Notes Template
```
Fócas is an educational app designed to help students focus during 
class hours by voluntarily limiting access to distracting apps.

Key points for review:
- Screen Time access is 100% opt-in by students/parents
- Under-13 users require parental consent before any monitoring
- Students can see exactly which apps are being limited
- Teachers can only suggest apps to limit, not force restrictions
- All data sharing preferences are controlled by the student

Test Account:
- Student: [provide test credentials]
- Teacher: [provide test credentials]

The app uses Family Controls to apply app restrictions during 
school hours as specified by the school schedule.
```

### Required Privacy Disclosures
| Data Type | Collection | Usage |
|-----------|------------|-------|
| App usage | Collected with consent | Show focus statistics |
| Device identifiers | Not collected | N/A |
| Location | Not collected | N/A |
| Contacts | Not collected | N/A |

---

## Additional Resources

### Apple Documentation
- [Family Controls Framework](https://developer.apple.com/documentation/familycontrols)
- [Managed Settings Framework](https://developer.apple.com/documentation/managedsettings)
- [Device Activity Framework](https://developer.apple.com/documentation/deviceactivity)
- [Screen Time API WWDC Sessions](https://developer.apple.com/videos/play/wwdc2021/10123/)

### Project Files Reference
| File | Purpose |
|------|---------|
| `ios-plugin/README.md` | Setup instructions |
| `ios-plugin/FocasScreenTime/FocasScreenTimePlugin.swift` | Main plugin |
| `ios-plugin/FocasScreenTime/FocasScreenTimePlugin.m` | ObjC bridge |
| `ios-plugin/FocasScreenTime/DeviceActivityMonitorExtension.swift` | Background monitor |
| `ios-plugin/FocasScreenTime/FamilyActivityPickerView.swift` | App picker UI |
| `src/hooks/useScreenTime.ts` | React hook for plugin |
| `src/types/screen-time.ts` | TypeScript types + mock |

---

## Contact & Support

For questions about the web application implementation, refer to the codebase comments and existing documentation in the `ios-plugin/` folder.

**Last Updated:** January 2026
**Document Version:** 1.0

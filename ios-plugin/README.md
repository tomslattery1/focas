# Fócas Screen Time Plugin for iOS

This folder contains Swift code templates for integrating Apple's Screen Time API (Family Controls framework) with your Capacitor app.

## Requirements

- iOS 16.0 or later
- Xcode 14+
- Apple Developer Program membership
- Family Controls entitlement (requires Apple approval)

## Files

| File | Purpose |
|------|---------|
| `FocasScreenTime/FocasScreenTimePlugin.swift` | Main Capacitor plugin bridging Screen Time to JavaScript |
| `FocasScreenTime/FocasScreenTimePlugin.m` | Objective-C bridge file for Capacitor |
| `FocasScreenTime/DeviceActivityMonitorExtension.swift` | Extension for background activity monitoring |

## Setup Instructions

### 1. Request Family Controls Entitlement

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Navigate to Certificates, Identifiers & Profiles
3. Select your App ID
4. Enable "Family Controls" capability
5. Submit request form to Apple (may take days/weeks for approval)

### 2. Add Plugin to Xcode Project

After running `npx cap add ios` and `npx cap open ios`:

1. In Xcode, right-click on your App folder
2. Select "Add Files to [App Name]"
3. Navigate to this `ios-plugin/FocasScreenTime` folder
4. Select all Swift and .m files
5. Ensure "Copy items if needed" is checked

### 3. Add Capabilities in Xcode

1. Select your app target in Xcode
2. Go to "Signing & Capabilities" tab
3. Click "+ Capability"
4. Add "Family Controls"
5. Add "App Groups" (for extension communication)
   - Create group: `group.app.focas.shared`

### 4. Create Device Activity Monitor Extension

1. File > New > Target
2. Select "Device Activity Monitor Extension"
3. Name it "FocasActivityMonitor"
4. Replace generated code with `DeviceActivityMonitorExtension.swift` content
5. Add the extension to the same App Group

### 5. Register Plugin in Capacitor

In your iOS app's `AppDelegate.swift`, add:

```swift
import Capacitor

// In application(_:didFinishLaunchingWithOptions:)
bridge?.registerPlugin(FocasScreenTimePlugin.self)
```

Or in `capacitor.config.ts`:

```typescript
plugins: {
  FocasScreenTime: {
    // Plugin options if any
  }
}
```

## Usage in React/TypeScript

```typescript
import { registerPlugin } from '@capacitor/core';

interface FocasScreenTimePlugin {
  requestAuthorization(): Promise<{ granted: boolean; status: string }>;
  getAuthorizationStatus(): Promise<{ status: string; isAuthorized: boolean }>;
  startMonitoring(options: {
    scheduleName: string;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
  }): Promise<{ success: boolean; message: string }>;
  stopMonitoring(options: { scheduleName: string }): Promise<{ success: boolean }>;
  setAppRestrictions(): Promise<{ success: boolean }>;
  removeRestrictions(): Promise<{ success: boolean }>;
}

const FocasScreenTime = registerPlugin<FocasScreenTimePlugin>('FocasScreenTime');

// Request permission
const result = await FocasScreenTime.requestAuthorization();
if (result.granted) {
  // Start monitoring school hours
  await FocasScreenTime.startMonitoring({
    scheduleName: 'school_hours',
    startHour: 8,
    startMinute: 30,
    endHour: 15,
    endMinute: 30
  });
}
```

## Apple Review Considerations

When submitting to the App Store:

1. **Explain the use case** in App Review notes
2. **Emphasize voluntary nature** - this is opt-in by students/parents
3. **Highlight educational benefit** - helps students focus during class
4. **Document parental consent flow** if applicable
5. **Provide demo credentials** for testing

## Limitations

- Only works on iOS 16+
- Requires specific Apple entitlement approval
- Cannot access detailed app usage without DeviceActivityReport extension
- Shield customization requires ShieldConfiguration extension

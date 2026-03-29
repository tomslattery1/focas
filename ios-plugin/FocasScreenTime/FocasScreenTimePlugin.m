// FocasScreenTimePlugin.m
// Objective-C bridge for Capacitor

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(FocasScreenTimePlugin, "FocasScreenTime",
    CAP_PLUGIN_METHOD(requestAuthorization, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(getAuthorizationStatus, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(startMonitoring, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(stopMonitoring, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(setAppRestrictions, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(removeRestrictions, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(getUsageReport, CAPPluginReturnPromise);
)

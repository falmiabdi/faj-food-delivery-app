import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(true);

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Push Notifications',
          type: 'toggle',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: 'moon-outline',
          label: 'Dark Mode',
          type: 'toggle',
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          icon: 'language-outline',
          label: 'Language',
          type: 'link',
          value: 'English',
        },
        {
          icon: 'location-outline',
          label: 'Currency',
          type: 'link',
          value: 'USD ($)',
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          icon: 'finger-print-outline',
          label: 'Biometric Login',
          type: 'toggle',
          value: biometric,
          onValueChange: setBiometric,
        },
        {
          icon: 'lock-closed-outline',
          label: 'Change Password',
          type: 'link',
        },
        {
          icon: 'shield-checkmark-outline',
          label: 'Two-Factor Auth',
          type: 'link',
          badge: 'Setup',
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle-outline',
          label: 'App Version',
          type: 'info',
          value: '1.0.0',
        },
        {
          icon: 'document-text-outline',
          label: 'Terms & Conditions',
          type: 'link',
        },
        {
          icon: 'lock-open-outline',
          label: 'Privacy Policy',
          type: 'link',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileIconContainer}>
          <Ionicons name="person-circle-outline" size={50} color="#6366f1" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Alex Johnson</Text>
          <Text style={styles.profilePlan}>Premium Member</Text>
        </View>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade</Text>
        </TouchableOpacity>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity 
                key={itemIndex} 
                style={styles.settingItem}
                disabled={item.type === 'toggle'}
              >
                <View style={styles.settingItemLeft}>
                  <Ionicons name={item.icon as any} size={22} color="#6366f1" />
                  <Text style={styles.settingItemLabel}>{item.label}</Text>
                </View>
                
                <View style={styles.settingItemRight}>
                  {item.type === 'toggle' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
                      thumbColor="white"
                    />
                  )}
                  
                  {item.type === 'link' && (
                    <>
                      {item.value && (
                        <Text style={styles.settingItemValue}>{item.value}</Text>
                      )}
                      {item.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      )}
                      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </>
                  )}
                  
                  {item.type === 'info' && (
                    <Text style={styles.settingItemValue}>{item.value}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.helpButton}>
        <Ionicons name="chatbubble-ellipses-outline" size={22} color="#6366f1" />
        <Text style={styles.helpButtonText}>Contact Support</Text>
      </TouchableOpacity>

      <Text style={styles.copyright}>© 2026 ShopEase. All rights reserved.</Text>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  profileIconContainer: {
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  profilePlan: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '500',
  },
  upgradeButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 20,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingItemLabel: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingItemValue: {
    fontSize: 14,
    color: '#64748b',
  },
  badge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  helpButtonText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  copyright: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 20,
  },
} as const;
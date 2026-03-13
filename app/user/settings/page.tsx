'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Bell, Shield, Moon, Globe, Volume2 } from 'lucide-react'

export default function UserSettings() {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    events: true,
    gallery: false
  })
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    autoPlay: false
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Load user preferences from metadata
      if (user?.user_metadata) {
        const meta = user.user_metadata
        setNotifications({
          email: meta.email_notifications ?? true,
          push: meta.push_notifications ?? false,
          events: meta.event_notifications ?? true,
          gallery: meta.gallery_notifications ?? false
        })
        setPreferences({
          theme: meta.theme ?? 'dark',
          language: meta.language ?? 'en',
          autoPlay: meta.auto_play ?? false
        })
      }
    }
    getUser()
  }, [])

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          email_notifications: notifications.email,
          push_notifications: notifications.push,
          event_notifications: notifications.events,
          gallery_notifications: notifications.gallery,
          theme: preferences.theme,
          language: preferences.language,
          auto_play: preferences.autoPlay
        }
      })
      
      if (!error) {
        // Show success message
        console.log('Settings saved successfully')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      {/* Notification Settings */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={24} className="text-purple-400" />
          <h2 className="text-xl font-bold text-white">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
            { key: 'push', label: 'Push Notifications', description: 'Receive browser notifications' },
            { key: 'events', label: 'Event Updates', description: 'Get notified about new events' },
            { key: 'gallery', label: 'Gallery Updates', description: 'Get notified about new content' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h3 className="text-white font-medium">{setting.label}</h3>
                <p className="text-gray-400 text-sm">{setting.description}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [setting.key]: !notifications[setting.key as keyof typeof notifications] })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[setting.key as keyof typeof notifications] ? 'bg-purple-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[setting.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} className="text-purple-400" />
          <h2 className="text-xl font-bold text-white">Preferences</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <div className="flex items-center gap-2">
                <Moon size={16} />
                Theme
              </div>
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <div className="flex items-center gap-2">
                <Globe size={16} />
                Language
              </div>
            </label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h3 className="text-white font-medium flex items-center gap-2">
                <Volume2 size={16} />
                Auto-play Media
              </h3>
              <p className="text-gray-400 text-sm">Automatically play audio/video content</p>
            </div>
            <button
              onClick={() => setPreferences({ ...preferences, autoPlay: !preferences.autoPlay })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.autoPlay ? 'bg-purple-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.autoPlay ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

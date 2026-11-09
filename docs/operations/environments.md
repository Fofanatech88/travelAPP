# Environments

| Environment     | Purpose                                         | Data and access                                                     |
| --------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| development     | Local Expo, tests and later local Supabase      | Synthetic fixtures; local variables                                 |
| preview/staging | Integrated browser/device and TestFlight checks | Separate Supabase project; test accounts; approved code             |
| production      | Public web and App Store                        | Separate credentials/project; restricted access; monitoring/backups |

Only local foundation configuration is implemented initially. No hosted projects or EAS builds are implied. EAS configuration should explicitly map development, preview and production build profiles to their supported environments; verify current CLI support before account setup.

Public app variables may contain Supabase URL and publishable key only. Server secrets, service-role keys and signing credentials never enter EXPO_PUBLIC values or source. Keep private .env files ignored; commit .env.example placeholders. Generate database types from the environment's versioned migrations when database work begins.

Full Xcode is needed for local simulator/native builds. Supabase CLI plus Docker are needed for local database integration. Expo/EAS accounts and Apple membership are external prerequisites for cloud/device distribution; their absence must not block pure domain tests or the welcome browser application.

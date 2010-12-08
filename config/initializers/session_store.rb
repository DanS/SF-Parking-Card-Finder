# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_parkingCard238_session',
  :secret      => 'd94c728d5703718f7ba2e58e281e05818655e0f59e32396e4f5dba4f872208b0d7ac7713432c06fe1947af97d343ea5e66590bac2299d67537902a1e2baebd99'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store

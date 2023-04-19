# aptos command list

rm -rf .aptos

aptos init

aptos move compile --named-addresses todo=default

aptos move publish --package-dir .  --named-addresses aptos_shell=default

aptos move publish --package-dir .  --named-addresses todo=default

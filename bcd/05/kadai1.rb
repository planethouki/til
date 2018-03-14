require 'securerandom'
require 'bitcoin'
require 'digest'

p "======== sample  ========"
root_seed_t = "f76c442bf7847df1a6c1a859043eb02e"
#p Bitcoin::Trezor::Mnemonic.to_mnemonic([root_seed_t].pack("H*"))
#“wash giraffe april upper elephant web only  crush flip capable project front”


p "========= mnemonic ========"
#root_seed = SecureRandom.hex(16)
root_seed = "e938ff837eee2661bbf3e8dc7e999722"
p root_seed

p Bitcoin::Trezor::Mnemonic.to_mnemonic([root_seed].pack("H*"))



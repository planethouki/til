require 'securerandom'
require 'bitcoin'
require 'digest'

# https://github.com/lian/bitcoin-ruby/blob/master/lib/bitcoin/trezor/mnemonic.rb

p "======== sample  ========"
root_ent_t = "f76c442bf7847df1a6c1a859043eb02e"
m = Bitcoin::Trezor::Mnemonic.to_mnemonic([root_ent_t].pack("H*"))
s = Bitcoin::Trezor::Mnemonic.to_seed(m)
# to be c134ba00badd038b9f7bc8506c5a6245c0762e1d2fb65e73606f353298c3014b1c748baa9b9e6d0cedcf6d11fa192cf707d6e85370180d5d95274ba09e72e279
v = "0488ade4"
d = "00"
f = "00000000"
i = "00000000"
c = s[64..127]
p = "00" + s[0..63]

payload = v + d + f + i + c + p
p payload

check_sum = Digest::SHA256.hexdigest(Digest::SHA256.digest(payload))

#to be xprv9s21ZrQH143K4GKGLy7cuGD7dqsXC8Sy82FQkeABdzaZ7otVpbrMZyK6CmSjZcRiaYRnNrGa9GxRUqz6mzasQiq3QmdHwNcqgsFbBoNba7G
p Bitcoin.encode_base58(payload + check_sum[0..7])



#master_key = Bitcoin::ExtKey.generate_master(s)
#p master_key.priv

#p Bitcoin.decode_base58("xprv9s21ZrQH143K4GKGLy7cuGD7dqsXC8Sy82FQkeABdzaZ7otVpbrMZyK6CmSjZcRiaYRnNrGa9GxRUqz6mzasQiq3QmdHwNcqgsFbBoNba7G")

p "========= mnemonic ========"
#root_seed = SecureRandom.hex(16)
root_seed = "e938ff837eee2661bbf3e8dc7e999722"




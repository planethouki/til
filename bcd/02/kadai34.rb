require 'ecdsa'
require 'securerandom'
require 'digest'
require 'bitcoin'

group = ECDSA::Group::Secp256k1

n = group.order
#privKey = 1 + SecureRandom.random_number(n-1)
privKey = 84370321610215031974582375851313642477610672803952108851805126719289457842410
puts '======== Private Key ======='
puts privKey
puts privKey.to_s(16)

puts '======== WIF Private Key ======='
prefix = '80' 
suffix = '01'
payload = privKey.to_s(16) + suffix
prefixPayload = [prefix + payload].pack("H*")
prefixPayloadDoubleHash = Digest::SHA256.hexdigest(Digest::SHA256.digest(prefixPayload))
checksum = prefixPayloadDoubleHash[0...8]
base58check = Bitcoin::encode_base58(prefix + payload + checksum)
puts base58check


pubKey = group.generator.multiply_by_scalar(privKey)
puts '======== Public Key ========'
puts pubKey.x
puts pubKey.y
puts pubKey.x.to_s(16)
puts pubKey.y.odd? ? '03' + pubKey.x.to_s(16) : '02' + pubKey.x.to_s(16)


message ="Done is better than perfect."
digest = Digest::SHA256.hexdigest(message)
puts '========= sig ============='
puts digest

k = 1 + SecureRandom.random_number(n-1)
sign = ECDSA.sign(group,privKey,digest,k)

der_sign = ECDSA::Format::SignatureDerString.encode(sign)
puts der_sign
puts der_sign.unpack("H*")

puts ECDSA.valid_signature?(pubKey,digest,sign)

der_sign_hex = der_sign.unpack("H*")

puts ECDSA.valid_signature?(pubKey,digest,ECDSA::Format::SignatureDerString.decode(der_sign_hex.pack("H*")))
